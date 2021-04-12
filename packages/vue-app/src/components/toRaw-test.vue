<template>
  <div class="page-wrapper">
    <p>-------------------------------toRaw-----------------------</p>
    <p>stu: {{stu}}</p>
    <button @click="changeStu">点我一下,changeStu</button>
    <p>rawStu： {{rawStu}}</p>
    <button @click="changeRawStu">>点我一下,changeRawStu</button>
  </div>
</template>
<script lang="js">
import { defineComponent, reactive, ref, toRaw } from 'vue';
export default defineComponent({
  name: 'toRow-test',
  setup(){
    let stu= reactive({
        name: 'zs',
        age: 18
    })

    let stuAge= ref(18)
    let rawStuAge= toRaw(stuAge)
    //响应式数据拆解，当通过ref或者reactive生成响应式数据的时候，修改数据不想引起UI的变化就可以调用toRaw这个API
    let rawStu= toRaw(stu);
    function changeStu() {
        stu.name= 'ls';

    }
    function changeRawStu() {
        rawStu.name= 'ww';
        console.log('changeStu', stu);
        console.log('changeRawStu', rawStu);
    }
    return {
        stu,
        rawStu,
        changeStu,
        changeRawStu
    }
  }
  
})
</script>