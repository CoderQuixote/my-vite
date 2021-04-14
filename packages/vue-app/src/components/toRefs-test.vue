<template>
    <div class="page-wrapper">
        <p>-------------------------------toRefs--------------------------</p>
        <p>name: {{refsStu.name.value}}</p>
        <p>age: {{refsStu.age.value}}</p>
        <button @click="ageChange">click一下,age++</button>
    </div>
</template>
<script lang="js">
import { defineComponent, reactive, toRefs} from 'vue';
export default defineComponent({
  name: 'toRefs-test',
  setup(){
    let stu= reactive({
        name: 'zs',
        age: 18
    });
    //响应式拆解
    let refsStu= toRefs(stu);
    // let {name, age}= stu;
    function ageChange() {
        refsStu.age.value++;
        // age++;
        console.log('stu.age', stu.age)
        // console.log('age', age.value)
        // console.log('age', age)
    }
    return {
        refsStu,
        // name,
        // age,
        ageChange
    }
  }
  
})
</script>