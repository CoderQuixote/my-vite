<template>
  <div class="page-wrapper">
    <p>--------------------------ref和reactive的关系---------------------</p>
    <p>{{stuAge}}</p>
    <button @click="myFn">点我一下,agg++</button>
    <p>{{refData}}</p>
    <button @click="refFn">点我一下,refChange</button>
    <p>{{reactiveData}}</p>
    <button @click="reactiveFn">点我一下,reactiveChange</button>
  </div>
</template>
<script lang="js">
import { defineComponent, reactive, ref} from 'vue';
export default defineComponent({
  name: 'diffRefReactive',
  setup(){
    //1，ref(param) === reactive({value: param})
    //2，ref和reactive都为递归监听
    //递归监听
    let refData= ref({
        gf: {
            f: {
                s: {
                    d: 4
                },
                c: 3
            },
            b: 2
        },
        a: 1
    });
    let reactiveData= reactive({
        gf: {
            f: {
                s: {
                    d: 4
                },
                c: 3
            },
            b: 2
        },
        a: 1
    });
    console.log('refData:', refData.value);
    console.log('refData.value.gf:', refData.value.gf);
    console.log('refData.value.gf.f:', refData.value.gf.f);
    console.log('refData.value.gf.f.s:', refData.value.gf.f.s);


    console.log('reactiveData:', reactiveData);
    console.log('reactiveData.gf:', reactiveData.gf);
    console.log('reactiveData.gf.f:', reactiveData.gf.f);
    console.log('reactiveData.gf.f.s:', reactiveData.gf.f.s);

    
    let stuAge= ref(18)
    console.log(stuAge);
    function myFn(){
      stuAge++;
      // stuAge.value++;
    }
    function refFn(){
        refData.value.a = 666;
        refData.value.gf.b = 666;
        refData.value.gf.f.c = 666;
        refData.value.gf.f.s.d = 666;
    }
    function reactiveFn(){
        reactiveData.a = 666;
        reactiveData.gf.b = 666;
        reactiveData.gf.f.c = 666;
        reactiveData.gf.f.s.d = 666;
    }
    return {
        stuAge,
        refData,
        reactiveData,
        myFn,
        refFn,
        reactiveFn
    }
  }
  
})
</script>