<template>
    <div class="inventory-add">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>商品入库</h3>
            </div>
            <div class="text item">
                <el-form 
                style="width:300px"
                :model="InventoryAddForm"
                status-icon 
                :rules="rules"
                ref="InventoryAddForm"
                label-width="100px">
                    <el-form-item label="商品条形码" prop="GoodsBarCode">
                        <el-input 
                        type="text"
                         v-model="InventoryAddForm.GoodsBarCode"
                          autocomplete="off"
                          ></el-input>
                    </el-form-item>

                    <el-form-item label="商品名称" prop="GoodsName">
                        <el-input 
                        type="text"
                         v-model="InventoryAddForm.GoodsName"
                          autocomplete="off"
                          ></el-input>
                    </el-form-item>

                    <el-form-item label="分类" prop="classify">
                        <el-select 
                        v-model="InventoryAddForm.classify" 
                        placeholder="== 选择分类 =="
                        style="width:150px;"
                        >
                        <el-option label="烟酒类" value="烟酒类"></el-option>
                        <el-option label="零食类" value="零食类"></el-option>
                        <el-option label="饮料类" value="饮料类"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="数量" prop="GoodsNum">
                        <el-input 
                        type="text" 
                        v-model="InventoryAddForm.GoodsNum"
                         autocomplete="off"
                         ></el-input>
                         <span style="font-size:12px;color:666">计重商品单位为千克</span>
                    </el-form-item>

                    <el-form-item :inline="true" label="进价" prop="PurchasePrice">
                        <el-input 
                        type="text"
                         v-model="InventoryAddForm.PurchasePrice"
                          autocomplete="off"
                          placeholder="单位：元"
                          ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="submitForm()">入库</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入商品正则函数
    import { BarCodeReg,pwdReg,PriceReg } from "@/utils/reg";

    //引入进货模块api文件
    import {GoodsAddInventory} from "@/api/inventory"

    export default {
        data(){
            //商品条形码
            const VerifyBarCode = (rule,value,callback) => {

                 if(value === ""){
                    callback(new Error("请输入商品条形码"));//非空
                 }else if( !BarCodeReg(value )){
                    callback(new Error("商品条形码为7 ~ 8位纯数字"));//正则
                 }else{
                    callback();
                 }
            }
            //商品数量
            const VerifyGoodsNum = (rule,value,callback) => {

                 let Len = value.length;

                 if( value === ""){
                     callback(new Error("请输入商品数量"));//非空
                 }else if(Len < 1 || Len > 8){
                     callback(new Error("商品数量为1 ~ 8位数字加单位"));//长度
                 }else if( !pwdReg(value) ){
                     callback(new Error("商品数量为数字 或 加单位字母"));//正则
                 }else {
                     callback();
                 }

            }
            //进价
            const VerifyPrice = (rule,value,callback) => {

                 if(value === ""){
                    callback(new Error("请输入商品进价"));//非空
                 }else if(!PriceReg(value)){
                    callback(new Error("商品进价为1 ~ 8位纯数字"));//正则
                 }else{
                    callback();
                 }
            }
            return {
                InventoryAddForm:{
                    GoodsBarCode:"",//商品条形码
                    GoodsName:"",
                    classify:"",
                    GoodsNum:"",//商品数量
                    PurchasePrice:""//进价
                },
                rules:{
                   GoodsBarCode:[
                       { required: true, validator:VerifyBarCode, trigger: 'blur' }
                   ],
                   GoodsName:[
                       { required: true, message:"请输入商品名称", trigger: 'blur' }
                   ],
                   classify:[
                       { required: true, message:"请选择商品分类", trigger: 'change' }
                   ],
                   GoodsNum:[
                       { required: true, validator:VerifyGoodsNum, trigger: 'blur' }
                   ],
                   PurchasePrice:[
                       { required: true, validator:VerifyPrice, trigger: 'blur' }
                   ]
                }     
            }
        },
        methods:{
            submitForm(){
                this.$refs.InventoryAddForm.validate( (valid) => {//所有验证通过valid返回true,否则false
                      
                      if(valid){
                         let params = {
                             GoodsBarCode : this.InventoryAddForm.GoodsBarCode,//商品条形码
                             GoodsName : this.InventoryAddForm.GoodsName,//商品名称
                             GoodsNum : this.InventoryAddForm.GoodsNum,//商品数量
                             PurchasePrice : this.InventoryAddForm.PurchasePrice,//进价
                             classify : this.InventoryAddForm.classify,//进价             
                         }

                         GoodsAddInventory(params)
                           .then(res => {
                               //接收响应数据
                               let {code,reason} = res;
                               
                               if(code === 0){
                                   this.$message({
                                       type:"success",
                                       message:reason
                                   })
                                   //跳转到库存管理页面
                                   this.$router.push("/home/inventorymanage");
                               }else if(code === 1){
                                   this.$message.error(reason);
                               }
                            
                           })
                           .catch(err => {
                               console.log(err)
                           })
 

                      }else{
                        return false;
                      }
                })
            }
        }
    }
</script>

<style lang="less">
    .inventory-add{
          .el-card{
               border:1px solid #ccc;
              .el-card__header{
                 padding: 12px 20px;
                 background:#f2f2f2;
                 h3 {
                     font-size:16px;
                 }
              }
              
          }
      }
</style>