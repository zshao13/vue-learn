import { observe } from './observe'
import Watcher from './watcher'

class Vue {
    constructor(options) {
        this.data = options.data
        observe(this.data)
        // 模仿一个渲染 watcher
        new Watcher(this, render)
    }
}

function render (vm) {
    console.log(vm)
    // console.log(vm.data.test);
    // console.log(vm.data.test);
    // console.log(vm.data.name);
    // console.log(vm.data.obj);
    console.log(vm.data.obj.obj1);
}

let app = new Vue({
    data: {
        test: 'i am test',
        name: 'li hua',
        obj: {
            obj1: '111'
        }
    }
})

// console.log(app)

// o._data.test = 'hello'
// o._data.name = 'hello vvvv'