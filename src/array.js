
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

methodsToPatch.forEach(function (method) {
    const original = arrayProto[method]
    def(arrayMethods, method, function mutator (...args) {
        const result = original.apply(this, args);
        const ob = this.__ob__;
        let inserted;
        switch (method) {
        case 'push':
        case 'unshift':
            inserted = args
            break
        case 'splice':
            inserted = args.slice(2)
            break
        }
        if (inserted) ob.observeArray(inserted);
        // notify change
        ob.dep.notify();
        return result
    })
})

export function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}