<template>
  <div class="page-wrapper">
    <p>-------------------------------markRow-----------------------</p>
    <p>stu: {{stu}}</p>
    <button @click="changeStu">点我一下,changeStu</button>
  </div>
</template>
<script lang="js">
import { defineComponent, reactive, markRaw } from 'vue';
export default defineComponent({
  name: 'toRow-test',
  setup(){
    let obj= {
        name: 'zs',
        age: 18
    }
    obj= markRaw(obj);
    console.log('markRaw obj', obj);
    let stu= reactive(obj);
    console.log('reactive stu', stu);
    function changeStu() {
        stu.name= 'ls';
        console.log('changeStu', stu);

    }
    return {
        stu,
        changeStu
    }
  }
  
})
</script>