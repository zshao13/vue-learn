import Dep, { pushTarget, popTarget } from './dep'


export default class Watcher {
    constructor (vm, expOrFn, cb) {
        /* 在new一个Watcher对象时将该对象赋值给Dep.target，在get中会用到 */
        // Dep.target = this;
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
            // if (this.deep) {
            //     traverse(value)
            // }
            // popTarget()
            // this.cleanupDeps()
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
        console.log("视图更新啦～", this.vm);
    }
}
