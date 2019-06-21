/*
 *axios请求封装
*/

//引入axios
import axios from "axios";

//引入qs
import qs from "qs";

//引入本地存储封装
import local from "@/utils/local";


//默认服务器地址
axios.defaults.baseURL = "http://127.0.0.1:5000";

/* 
    axios请求拦截器： 
        在axios发送请求之前，把它拦截，让他先携带一点东西
        再发出请求。
*/ 

axios.interceptors.request.use(function(config) {
    //获取token
    const token = local.get("user_token");
    config.headers.authorization = `Bearer ${token}` 
    return config;
})

//暴露出去
export default {
    get(url,params={}){
        return new Promise( (resolve,reject) => {
             axios.get(url,{params})
             .then(response => {
                 resolve(response.data)
             })
             .catch(err => {
                 reject(err)
             })
        })
    },
    post(url,params={}){
        return new Promise( (resolve,reject) => {
            axios.post(url,qs.stringify(params))
            .then(response => {
                resolve(response.data)
            })
            .catch(err => {
                reject(err)
            })
       })
    }
}

