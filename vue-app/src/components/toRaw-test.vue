<template>
  <div class="page-wrapper">
    <p>-------------------------------toRaw-----------------------</p>
    <p>stu: {{stu}}</p>
    <button @click="changeStu">点我一下,changeStu</button>
    <p>rawStu： {{rawStu}}</p>
    <button @click="changeRawStu">>点我一下,changeRawStu</button>
    <p>stuAge: {{stuAge}}</p>
    <button @click="changeStuAge">点我一下,changeStuAge</button>
    <p>rawStuAge: {{rawStuAge}}</p>
    <button @click="changeRawStuAge">点我一下,changeRawStuAge</button>
  </div>
</template>
<script lang="js">
import { defineComponent, reactive, ref, toRaw } from 'vue';
export default defineComponent({
  name: 'reactive-test',
  setup(){
    let stu= reactive({
        name: 'zs',
        age: 18
    })

    let stuAge= ref(18)
    let rawStuAge= toRaw(stuAge)
    //当通过ref或者reactive生成响应式数据的时候，修改数据不想引起UI的变化就可以调用toRaw这个API
    let rawStu= toRaw(stu);
    function changeStu() {
        stu.name= 'ls';

    }
    function changeRawStu() {
        rawStu.name= 'ww';
        console.log('changeStu', stu);
        console.log('changeRawStu', rawStu);
    }
    function changeStuAge(){
        
    }
    function changeRawStuAge(){
        
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