import { observe, set } from './observe'
import Watcher from './watcher'


function Vue (options) {
    this.data = options.data
    observe(this.data)
    // 模仿一个渲染 watcher
    new Watcher(this, updateComponent)
}

function updateComponent (vm) {
    update(render(vm))
}

// 把 VNode 渲染成真实的 DOM
function update (vNode) {
    console.log('视图跟新了~');
}

// 生成VNode
function render (vm) {
    console.log(vm)
    // console.log(vm.data)
    // console.log(vm.data.test);
    // console.log(vm.data.obj);
    // console.log(vm.data.test);
    // console.log(vm.data.name);
    // console.log(vm.data.obj);
    // console.log(vm.data.obj.obj1);
    // console.log(vm.data.arr);
    console.log(vm.data.name);
}

let app = new Vue({
    data: {
        name: 'li hua',
        obj: {
            obj1: '111'
        },
        arr: [1, 2]
    }
})

// set(app.data.obj, 'newKey', 'new value')

// app.data.arr.push(3)
app.data.name = '111'
app.data.name = '222'
app.data.name = '333'

// app.data.newKey = 'new value'

// console.log(app)

<div id="app">
    {{ message }}
</div>

new Vue({
    el: '#app',
    data: {
        message: 'Hello~'
    }
})