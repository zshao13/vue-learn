
// 订阅者 Dep

let uid = 0

export default class Dep {
    constructor () {
        this.id = uid++
        this.subs = [];
    }

    addSub (sub) {
        this.subs.push(sub);
    }

    removeSub (sub) {
        remove(this.subs, sub)
    }

    depend () {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    notify () {
        const subs = this.subs.slice()
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

function remove (arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

/**
 * 这是一个全局唯一 Watcher，
 * 这是一个非常巧妙的设计，
 * 因为在同一时间只能有一个全局的 Watcher 被计算，
 * 另外它的自身属性 subs 也是 Watcher 的数组。
 */
Dep.target = null

const targetStack = []

export function pushTarget (target) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
