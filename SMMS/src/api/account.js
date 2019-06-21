
/**
 * 用户管理api 
 */

//引入axios请求js
import axios from "@/utils/request";

//用户添加
export function accountAdd(params){
    return  axios.post("/account/accountadd",params);
}

//判断用户名是否存在
export function isaccountexist(params){
    return  axios.get("/account/isaccountexist" , params);
}

//修改用户
export function accountEdit(params){
    return  axios.get("/account/accountedit",params)
}
//保存编辑
export function saveEdit(params){
    return  axios.post("/account/changedata",params)
}

//删除数据
export function accountDelete(params){
    return axios.get("/account/deletedata",params)
}

//批量删除
export function batchDelete(params){
    return axios.get("/account/batchdel" , params)
}

//分页
export function getAccountDataByPage(params){
    return  axios.get("/account/getdatabypage", params)
}

//验证旧密码是否正确
export function checkoriginPass(params){
    return  axios.post("/account/checkoriginpass", params)
}

//修改密码
export function EditPassword(params){
    return  axios.post("/account/editpassword", params)
}

//获取当前登录用户
export function GetAccount(){
    return  axios.get("/account/getaccount")
}

//用户权限 -- 显示左侧菜单
export function accountRole(){
    return  axios.get("/account/accountrole")
}