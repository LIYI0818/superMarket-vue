/* 
 * 会员模块aqi
*/

//引入请求文件
import axios from "@/utils/request";


//会员添加
export function VipAccountAdd(params){
   return axios.post("/vipaccount/vipaccountadd",params);
}

//分页
export function GetVipDataByPage(params){
    return axios.get("/vipaccount/getvipdatabypage",params);
}

//删除
export function DeleteVipData(params){
    return axios.get("/vipaccount/deletevipdata",params);
}

//编辑 -- 数据回填
export function EditVipData(params){
    return axios.get("/vipaccount/editvipdata",params);
}
//编辑 -- 保存数据
export function SaveVipEditData(params){
    return axios.post("/vipaccount/savevipeditdata",params);
}

//批量删除
export function BatchDeleteVipData(params){
    return axios.get("/vipaccount/bacthdeletevipdata",params);
}