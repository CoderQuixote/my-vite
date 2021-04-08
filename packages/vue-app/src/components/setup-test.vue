<template>
  <div class="page-wrapper">
    <p>-------------------------------setup-----------------------</p>
    <p>setup() say {{msg}}</p>
    <p>data() say {{msg}}</p>
  </div>
</template>
<script lang="js">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'setup-test',
  //1,setup 调用在VUE生命周期的beforeCreated和created之间  -->  this为undefined    
  //2,setup 选项应该是一个接受 props 和 context 的函数。此外，我们从 setup 返回的所有内容都将暴露给组件的其余部分 (计算属性、方法、生命周期钩子等等) 以及组件的模板。
  //3,当设置setup为同步函数不能设置async( 立即执行并 return 的原因), 如果有此类需求的话可以自定义ref -->customRef
  //async setup(){
  data(){
    return{
      message: this.msg
    }
  },
  setup(){  
    console.log('this', this);
    return {
        msg: 'hell'
    }
  }
  
})
</script>