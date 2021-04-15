<template>
    <div class="page-wrapper">
        <p>-------------------------------customRef getUserlistRef--------------------------</p>
        <ul>
            <li v-for="item in userList" :key="item.id">{{item.name}}---{{item.id}}</li>
        </ul>
        <button @click="getNextPageData">下一页</button>
    </div>
</template>
<script lang="js">
import { defineComponent, customRef} from 'vue';
function getUserlist(param){
    console.log('getUserlist enter param', param);
    return new Promise((resolve, reject) => {
        fetch('public/user-list.json').then(res=> {
            return res.json();
        }).then(data=> {
            resolve(data.slice((param.page-1)*3, (param.page-1)*3 + 3))
        }).catch(error => {
            reject(error)
        })
    })
}
function getUserlistRef(value){
    return customRef((track, trigger) => {
        let userList= [];
        function getUserlistData(){
            getUserlist(value).then(res=> {
                console.log('getUserlist then res', res);
                userList= res;
                trigger();
            })
        }
        getUserlistData();
        return {
            get(){
                track();
                return userList;
            },
            set(newValue){
                value= newValue;
                getUserlistData();
            }
        }
    })
}
export default defineComponent({
    name: 'customRef-test',
    setup(){
        let page= 1; 
        let userList= getUserlistRef({page});
        function getNextPageData(){
            userList.value= {
                page: ++page
            }
        }
        return {
            userList,
            getNextPageData
        }
    }

})
</script>