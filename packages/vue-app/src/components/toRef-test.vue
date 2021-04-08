<template>
    <div class="page-wrapper">
        <p>-------------------------------toRef--------------------------</p>
        <p>toRefAge: {{toRefAge}}</p>
        <button @click="toRefAgeChange">toRefAgeChange</button>
        <p>refAge: {{refAge}}</p>
        <button @click="refAgeChange">refAgeChange</button>
    </div>
</template>
<script lang="js">
import { defineComponent, ref, toRef, watchEffect} from 'vue';
export default defineComponent({
  name: 'toRef-test',
  setup(){
    let stu= {
        name: 'zs',
        age: 18
    };
    let refAge= ref(stu.age);
    // let refAge= ref(stu)
    let toRefAge= toRef(stu, 'age');
    //1,toRef和传入的数据形成引用关系，修改toRef会影响之的数据，但是不会更新UI
    //2,ref是单纯的复制,影响不影响之前复制的数据，取决于复制的数据类型，但是会更新UI
    //3,ref 数据会引起监听行为，而 toRef 不会。
    function toRefAgeChange(){
        toRefAge.value++;
        console.log('stu.age', stu.age);
        console.log('toRefAge.value',  toRefAge.value);
    }
    function refAgeChange(){
        refAge.value++;
        console.log('stu.age', stu.age);
        console.log('refAge.value',  refAge.value);
    }
    watchEffect(function(){
        console.log('watchEffect enter:', toRefAge.value, refAge.value);
    })
    return {
        toRefAge,
        toRefAgeChange,
        refAge,
        refAgeChange
    }
  }
  
})
</script>