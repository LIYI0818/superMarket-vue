/* 
 *  登录模块api
*/

//引入请求文件
import axios from "@/utils/request";


export function checkLogin(params){
    return axios.post("/login/checklogin" ,params)
}