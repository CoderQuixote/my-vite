<template>
  <div class="page-wrapper">
    <ul>
      <li v-for="(item, index) in state.stus" @click="delStu(index)" :key="index">{{item.name}}--{{item.age}}</li>
    </ul>
    <div>
      <input v-model="stuModel.name">
      <input v-model="stuModel.age">
      <button @click="addStu">addStu</button>
    </div>
  </div>
</template>

<script lang="js">

//useAddStu
function useAddStu(state){
  let stuModel= reactive({
    name: '',
    age: ''
  })
  function addStu(){
    let newStu= Object.assign({}, stuModel);
    state.stus.push(newStu);
    stuModel.name= '';
    stuModel.age= '';
  }
  return [stuModel, addStu]
}

//useDelStu
function useDelStu(){
  let state= reactive({
    stus: [
      {
        name: 'zs',
        age: 18
      },
      {
        name: 'ls',
        age: 20
      },
      {
        name: 'ww',
        age: 22
      }
    ]
  })

  function delStu(_index){
    state.stus= state.stus.filter((item, index)=> {
      return index !== _index;
    })
  }
  return [state, delStu]
}

import { defineComponent, reactive } from 'vue';
export default defineComponent({
  name: 'vue3ToList',
  setup(){
    const [ state, delStu ]= useDelStu();
    const [ stuModel, addStu ]= useAddStu(state);
    
    return {
      addStu,
      delStu,
      state,
      stuModel
    }
  }
})
</script>
