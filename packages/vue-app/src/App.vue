<template>
  <!-- <vue2Todolist/> -->
  <!-- <vue3Todolist/> -->
  <!-- <setupTest/> -->
  <!-- <reactiveTest/> -->
  <!-- <refTest/> -->
  <!-- <diffRefReactive/> -->
  <!-- <shallowRefTest/> -->
  <!-- <shallowReactiveTest/> -->
  <!-- <toRawTest/> -->
  <!-- <markRawTest/> -->
  <!-- <toRefTest/> -->
  <!--<toRefsTest/> -->
  <customRefTest/>
  <!-- <watchEffectTest/> -->
  <!-- <readonlyTest/> -->
</template>

<script>
import vue2Todolist from './components/vue2-todolist.vue';
import vue3Todolist from './components/vue3-todolist.vue';
import setupTest from './components/setup-test.vue';
import reactiveTest from './components/reactive-test.vue';
import refTest from './components/ref-test.vue';
import diffRefReactive from './components/diffRefReactive.vue';
import shallowRefTest from './components/shallowRef-test.vue';
import shallowReactiveTest from './components/shallowReactive-test.vue';
import toRawTest from './components/toRaw-test.vue';
import markRawTest from './components/markRaw-test.vue';
import toRefTest from './components/toRef-test.vue';
import toRefsTest from './components/toRefs-test.vue';
import customRefTest from './components/customRef-test.vue';
import watchEffectTest from './components/watchEffect-test.vue';
import readonlyTest from './components/readonly-test.vue';

export default {
  name: 'App',
  components: {
    vue2Todolist,
    vue3Todolist,
    setupTest,
    reactiveTest,
    refTest,
    diffRefReactive,
    shallowRefTest,
    shallowReactiveTest,
    toRawTest,
    markRawTest,
    toRefTest,
    toRefsTest,
    customRefTest,
    watchEffectTest,
    readonlyTest
  }
}
</script>
<style lang="less">
  .page-wrapper{
    text-align: center;
  }
</style>