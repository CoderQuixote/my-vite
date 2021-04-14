<template>
    <div class="page-wrapper">
        <p>{{stu.age}}</p>
        <button @click="myFn">change age</button>
    </div>
</template>
<script lang="js">
import { defineComponent, readonly, shallowReadonly, isReadonly} from 'vue';
export default defineComponent({
  name: 'ref-test',
  setup(){
    /*
        1)readonly创建一个只读数据，并且是递归只读
        //const 和 readonly的区别
        //const 赋值保护，不能重新赋值
        2)readonly 属性保护，不能重新赋值
    */
    let stu= readonly({
        age: 18
    })
    function myFn() {
        stu.age++;
    }
    return {
        stu,
        myFn
    }
  }
  
})
</script>
