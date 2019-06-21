
/* 
 * 商品管理api
 */

//引入请求文件
import axios from "@/utils/request";

//商品添加
export function GoodsAdd(params){
   return axios.post("/goods/goodsadd",params);
}

//编辑商品
export function GoodsEdit(params){
    return axios.post("/goods/editdata",params);
}

//编辑商品 -- 保存数据
export function saveEdit(params){
    return axios.post("/goods/saveData",params);
}

//删除商品
export function GoodsDelete(params){
    return axios.get("/goods/datadel",params);
}

//批量删除商品
export function BatchDelete(params){
    return axios.get("goods/batchdatadel",params);
}

//分页
export function getGoodsByPage(params){
    return axios.get("/goods/getgoodsdata",params);
}

//高级查询
export function Search(params){
    return axios.get("/goods/search",params);
}
