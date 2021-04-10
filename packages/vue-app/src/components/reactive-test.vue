<template>
  <div class="page-wrapper">
    <p>-------------------------------reactive-----------------------</p>
    <p>{{stu}}</p>
    <button @click="myFn">点我一下</button>
  </div>
</template>
<script lang="js">
import { defineComponent, reactive } from 'vue';
export default defineComponent({
  name: 'reactive-test',
  setup(){
    // 1，reactive 是 Vue3中提供的实现响应式数据的方法
    // 2，reactive的参数必须是对象
    let stu= reactive({
        name: 'zs',
        age: 18
    })
    console.log(stu);
    function myFn(){
      stu.name= 'ls';  
      //reactive生成的响应式数据监听的根节点是自己，所以不能进行引用的切换
      //   stu= { 
      //     name: 'ls',
      //     age: 28
      //   }
    }

    return {
        stu,
        myFn
    }
  }
  
})
</script>