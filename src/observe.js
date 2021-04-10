import Dep from './dep'
import { arrayMethods } from './array'

// 功能就是用来监测数据的变化
export function observe (value) {
    if (!value || (typeof value !== 'object')) {
        return
    }

    return new Observer(value)
}

// 它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新：
class Observer {
    constructor (value) {
        this.value = value
        this.dep = new Dep()

        // 把自身实例添加到数据对象 value 的 __ob__ 属性上
        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false,
            writable: true,
            configurable: true
        })

        if (Array.isArray(value)) {
            value.__proto__ = arrayMethods
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }

    walk (obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[keys[i]])
        }
    }

    observeArray (items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }
}


// 功能就是定义一个响应式对象，给对象动态添加 getter 和 setter
function defineReactive (obj, key, val, shallow) {
    const dep = new Dep();

    // let childOb = !shallow && observe(val)
    let childOb = observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter () {
            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    childOb.dep.depend()
                    if (Array.isArray(val)) {
                      dependArray(val)
                    }
                }
            }
            return val
        },
        set: function reactiveSetter (newVal) {
            if (newVal === val) return
            val = newVal
            childOb = observe(newVal)
            dep.notify()
        }
    })
}

function dependArray (value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i]
        e && e.__ob__ && e.__ob__.dep.depend()
        if (Array.isArray(e)) {
            dependArray(e)
        }
    }
}
  

export function set (target, key, val) {
    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }
    const ob = target.__ob__
    if (!ob) {
        target[key] = val
        return val
    }
    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
}