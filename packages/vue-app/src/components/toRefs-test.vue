<template>
    <div class="page-wrapper">
        <p>-------------------------------toRefs--------------------------</p>
        <p>name: {{name}}</p>
        <p>age: {{age}}</p>
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
    // let {name, age}= toRefs(stu);
    let {name, age}= stu;
    console.log(reactive({
        a: 1,
        b: null
    }))
    function ageChange() {
        // age.value++;
        age++;
        console.log('stu', stu.age)
        // console.log('age', age.value)
        console.log('age', age)
    }
    return {
        name,
        age,
        ageChange
    }
  }
  
})
</script>