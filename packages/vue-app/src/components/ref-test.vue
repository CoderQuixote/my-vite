<template>
  <div class="page-wrapper">
    <p>-------------------------------ref-----------------------</p>
    <p>{{stuAge}}</p>
    <button @click="myFn">点我一下</button>
  </div>
</template>
<script lang="js">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'reactive-test',
  setup(){
    //1，ref可以生成响应式数据，多用于简单类型数据生成响应式数据
    //2，ref生成的响应式数据监听的数据为{value: param}
    let stuAge= ref(18)
    console.log(stuAge);
    function myFn(){
      stuAge.value++;
    }

    return {
        stuAge,
        myFn
    }
  }
  
})
</script>
