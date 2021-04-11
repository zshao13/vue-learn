import Dep, { pushTarget, popTarget } from './dep'
import { nextTick } from './next-tick'
let uid = 0;
export default class Watcher {
    constructor (vm, expOrFn, cb) {
        this.id = ++uid
        this.deps = []
        this.newDeps = []
        this.depIds = new Set()
        this.newDepIds = new Set()

        this.vm = vm
        this.getter = expOrFn

        this.get()
    }

    get () {
        pushTarget(this)
        let value
        const vm = this.vm
        try {
            //在这个过程中会对 vm 上的数据访问，这个时候就触发了数据对象的 getter。进行依赖收集
            value = this.getter.call(vm, vm)
        } catch (e) {
            throw e
        } finally {
            popTarget()
            this.cleanupDeps()
        }
        return value
    }

    addDep (dep) {
        const id = dep.id
        // 保证同一数据不会被添加多次 , 比如render 中多次访问同一个属性的时候
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                // 将当前watcher 添加到 subs中，每个属性都有个Dep实例，
                // 实例中subs保存的是订阅了当前属性的watcher
                dep.addSub(this)
            }
        }
    }

    update () {
        queueWatcher(this)
    }

    run () {
        const value = this.get()
        // console.log("视图更新啦～", this.vm);
    }

    cleanupDeps () {
        let i = this.deps.length
        while (i--) {
            const dep = this.deps[i]
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this)
            }
        }
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }
}

let has = {};
let queue = [];
let waiting = false;
let flushing = false;
let index = 0

function flushSchedulerQueue () {
    flushing = true
    let watcher, id;

    queue.sort((a, b) => a.id - b.id)

    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        id = watcher.id;
        has[id] = null;
        watcher.run();
    }

    index = queue.length = 0
    waiting = flushing = false
    has = {}
}

function queueWatcher(watcher) {
    const id = watcher.id;
    if (has[id] == null) {
        has[id] = true;
        if (!flushing) {
            queue.push(watcher);
        } else {
            let i = queue.length - 1
            while (i > index && queue[i].id > watcher.id) {
                i--
            }
            queue.splice(i + 1, 0, watcher)
        }

        if (!waiting) {
            waiting = true;
            nextTick(flushSchedulerQueue);
        }
    }
}
