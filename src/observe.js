import Dep from './dep'

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
        // this.dep = new Dep()
        if (Array.isArray(value)) {
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

    let childOb = !shallow && observe(val)
    // console.log(childOb);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter () {
            if (Dep.target) {
                dep.depend()
            }
            return val
        },
        set: function reactiveSetter (newVal) {
            // if (newVal === val) return
            val = newVal
        }
    })
}
