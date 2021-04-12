<template>
  <div class="page-wrapper">
    <p>-------------------------------shallowRef && triggerRef--------------------------</p>
    <p>{{state}}</p>
    <button @click="myFn">点我一下</button>
  </div>
</template>
<script lang="js">
import { defineComponent, shallowRef, triggerRef} from 'vue';
export default defineComponent({
  name: 'shallowRef-test',
  setup(){
    //shallowRef生成非递归响应数据，只监听第一层数据的变化
    let state= shallowRef({
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
    console.log('state.value', state.value);
    console.log('state.value.gf', state.value.gf)
    console.log('state.value.gf.f', state.value.gf.f)
    console.log('state.value.gf.f.s', state.value.gf.f.s)
    function myFn(){
        state.value.a= 666;
        state.value.gf.b= 666;
        state.value.gf.f.c= 666;
        state.value.gf.f.s.d= 666;
        
        //对于 shallow 过的 ref 对象，我们还可以手动去触发 ref 的变化监听事件来实现界面的改变。使用的 api 是 triggerRef
        // triggerRef(state);
        // state.value= {
        //     gf: {
        //         f: {
        //             s: {
        //                 d: 666
        //             },
        //             c: 666
        //         },
        //         b: 666
        //     },
        //     a: 666
        // }
    }

    return {
        state,
        myFn
    }
  }
  
})
</script>
