/* 
 * 进货模块api
*/

//引入请求函数
import axios from "@/utils/request";

//库存添加
export function GoodsAddInventory(params){
    return axios.post("/inventory/goodsaddinventory",params);
}

//删除库存
export function DeleteInventory(params){
    return axios.get("inventory/deldata",params);
}

//批量删除库存
export function BatchDataDel(params){
    return axios.get("inventory/batchdatadel",params);
}

//编辑库存  -- 数据回填
export function GetInventoryData(params){
    return axios.get("/inventory/getinventorydata",params);
}

//编辑库存  -- 保存数据
export function SaveInventoryData(params){
    return axios.post("/inventory/saveinventorydata",params);
}

//分页
export function getDataByPage(params){
    return axios.get("/inventory/getinventorydatabypage",params);
}