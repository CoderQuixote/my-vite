<template>
  <div class="page-wrapper">
    <p>-------------------------------shallowReactive--------------------------</p>
    <p>{{state}}</p>
    <button @click="myFn">点我一下</button>
  </div>
</template>
<script lang="js">
import { defineComponent, shallowReactive } from 'vue';
export default defineComponent({
  name: 'shallowReactive-test',
  setup(){
    //shallowReactive生成非递归响应数据，只监听第一层数据的变化
    //在 shallowReactive 中，并没有提供 trigger 方案来主动唤醒监测变化
    //本质上，shallowRef 是特殊的 shallowReactive，而 ref 是特殊的 reactive。
    let state= shallowReactive({
        gf: {
            f: {
                s: {
                    d: 4
                },
                c: 3
            },
            b: 2
        },
        a: 1
    })
    console.log('state', state);
    console.log('state.gf', state.gf)
    console.log('state.gf.f', state.gf.f)
    console.log('state.gf.f.s', state.gf.f.s)
    function myFn(){
        // state.a= 666;
        state.gf.b= 666;
        state.gf.f.c= 666;
        state.gf.f.s.d= 666;
    }

    return {
        state,
        myFn
    }
  }
  
})
</script>
