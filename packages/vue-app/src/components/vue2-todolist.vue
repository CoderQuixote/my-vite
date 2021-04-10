<template>
  <div class="page-wrapper">
    <ul>
      <li v-for="(item, index) in stus" @click="delStu(index)" :key="index">{{item.name}}--{{item.age}}</li>
    </ul>
    <div>
      <input v-model="stuModel.name">
      <input v-model="stuModel.age">
      <button @click="addStu">addStu</button>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive } from 'vue';
export default defineComponent({
    name: 'vue3ToList',
    data(){
        return{
            stus: [
                {
                    name: 'zs',
                    age: '18'
                },
                {
                    name: 'ls',
                },
                {
                    name: 'ww',
                    age: '21'
                }
            ],
            stuModel: {
                name: '',
                age: ''
            }
        }
    },
    methods: {
        addStu(){
            let newStu= Object.assign({}, this.stuModel);
            this.stus.push(newStu);
            this.stus.name= '';
            this.stus.age= '';
        },
        delStu(_index){
            this.stus= this.stus.filter((item, index)=> {
                return index !== _index;
            })
        }
    }
  
})
</script>
