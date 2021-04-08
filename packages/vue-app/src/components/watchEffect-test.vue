<template>
  <div class="page-wrapper">
    <p>-------------------------------shallowReactive--------------------------</p>
    <p>{{stuAge}}</p>
    <button @click="myFn">点我一下</button>
  </div>
</template>
<script lang="js">
import { defineComponent, ref, watchEffect } from 'vue';
export default defineComponent({
  name: 'effect-test',
  setup(){
    let stuAge= ref(0);
    function myFn(){
        stuAge.value++;
    }
    //功能和watch大致相当
    //区别
    //1,初始化时会自动执行一次和计算属性同理
    //2,不用传入依赖的数据，自己会主动收集依赖
    //3,watchEffect拿不到oldValue
    //4,watchEffect返回一个可以停止watchEffect的函数句柄可以通过调用此函数停止watch
    //4,watchEffect传入的回调函数会以参数的形式返回一个onInvalidate，onInvalidate(fn)传入的回调会在 watchEffect 重新运行或者 watchEffect 停止的时候执行
    const stop= watchEffect(onInvalidate => {
        console.log('effect enter', stuAge.value);

        //处理watchEffect频繁调用的逻辑
        onInvalidate(()=> {
            console.log('onInvalidate enter');
        })
        if(stuAge.value === 3){
            stop();
        }
    })
    return {
        stuAge,
        myFn
    }
  }
  
})
</script>