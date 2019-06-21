<template>
    <div class="goods-add">     
         <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>商品添加</h3>
                
            </div>
            <div class="text item">
                 <el-form 
                 :model="GoodsAddForm"
                 status-icon 
                 :rules="rules"
                 ref="GoodsAddForm"
                 label-width="100px"
                 >
                 <el-form-item label="所属分类" prop="GoodsClassify">
                    <el-select 
                    v-model="GoodsAddForm.GoodsClassify"
                     placeholder="== 选择分类 =="
                     size="small"
                     >
                    <el-option label="烟酒类" value="烟酒类"></el-option>
                    <el-option label="零食类" value="零食类"></el-option>
                    <el-option label="饮料类" value="饮料类"></el-option>
                    </el-select>
                </el-form-item>

                    <el-form-item label="商品条形码" prop="GoodsBarCode">
                        <el-input 
                        type="text" 
                        v-model="GoodsAddForm.GoodsBarCode"
                         style="width:300px;margin-right:20px"
                         size="small"
                         ></el-input>
                        <el-button 
                        size="small"
                        type="success"
                         @click="SetBarCode(100000000,999999999)"
                         >生成条形码</el-button>
                    </el-form-item>

                   
                    <el-form-item label="商品名称" prop="GoodsName">
                        <el-input type="text" 
                        v-model="GoodsAddForm.GoodsName"
                        style="width:240px"
                        size="small"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="商品进价" prop="PurchasePrice">
                        <el-input type="text" 
                        v-model="GoodsAddForm.PurchasePrice"
                        style="width:180px"
                        size="small"
                        @blur="countPrice"
                        ></el-input>
                        <span style="margin-left:10px">元</span>
                    </el-form-item>

                    <el-form-item label="商品售价" prop="SellPrice">
                        <el-input type="text" 
                        v-model="GoodsAddForm.SellPrice"
                        style="width:180px"
                        size="small"
                        ></el-input>
                        <span style="margin-left:10px">元</span>
                    </el-form-item>

                    <el-form-item label="市场价" prop="MarketPrice">
                        <el-input type="text" 
                        v-model="GoodsAddForm.MarketPrice"
                        style="width:180px"
                        size="small"
                        ></el-input>
                        <span style="margin-left:10px">元</span>
                        <!-- <p>默认市场价为售价的1.2倍</p> -->
                    </el-form-item>

                    <el-form-item label="入库数量" prop="StockNum">
                        <el-input type="text" 
                        v-model="GoodsAddForm.StockNum"
                        style="width:180px"
                        size="small"
                        ></el-input>
                        <p>计重商品单位为千克</p>
                    </el-form-item>

                    <el-form-item label="商品重量" prop="GoodsWeight">
                        <el-input type="text" 
                        v-model="GoodsAddForm.GoodsWeight"
                        style="width:180px"
                        size="small"
                        placeholder="单位：千克"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="商品单位" prop="GoodsUnit">
                        <el-input type="text" 
                        v-model="GoodsAddForm.GoodsUnit"
                        style="width:180px"
                        size="small"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="会员优惠">                    
                        <el-radio v-model="GoodsAddForm.discounts" label="享受">享受</el-radio>
                        <el-radio v-model="GoodsAddForm.discounts" label="不享受">不享受</el-radio>                        
                    </el-form-item>

                    <el-form-item label="是否促销">
                        <el-radio v-model="GoodsAddForm.IsPromotion" label="促销">促销</el-radio>
                        <el-radio v-model="GoodsAddForm.IsPromotion" label="不促销">不促销</el-radio>           
                    </el-form-item>

                    <el-form-item label="活动形式" prop="goodsdesc">
                        <el-input type="textarea" v-model="GoodsAddForm.goodsdesc"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
         </el-card>
    </div>
</template>

<script>
    //引入商品管理api文件
    import {GoodsAdd} from "@/api/goods";

    export default {
        data(){
            return {
                GoodsAddForm:{
                    GoodsClassify:"",//分类
                    GoodsBarCode:"",//商品条形码
                    GoodsName:"",//商品名称
                    SellPrice:"",//商品售价
                    MarketPrice:"",//市场价
                    PurchasePrice:"",//商品进价
                    StockNum:"",//入库数量
                    GoodsWeight:"",//商品重量
                    GoodsUnit:"",//商品单位
                    discounts:"",//会员优惠
                    IsPromotion:"",//是否促销
                    goodsdesc:""//商品简介
                },
                rules:{
                    GoodsClassify:[
                        { required: true, message: '请选择商品所属分类', trigger: 'change' }
                    ],
                    GoodsBarCode:[
                        { required: true, message: '请输入商品条形码', trigger: 'change' }
                    ],
                    GoodsName:[
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    SellPrice:[
                        { required: true, message: '请输入商品售价(数字)', trigger: 'blur' }
                    ],
                    MarketPrice:[
                        { required: true, message: '请输入商品市场价(数字)', trigger: 'blur' }
                    ],
                    PurchasePrice:[
                        { required: true, message: '请输入商品进价(数字)', trigger: 'blur' }
                    ],
                    StockNum:[
                        { required: true, message: '请输入商品数量(数字)', trigger: 'blur' }
                    ],
                    GoodsWeight:[
                        { required: true, message: '请输入商品重量(数字)', trigger: 'blur' }
                    ],
                    GoodsUnit:[
                        { required: true, message: '请输入商品单位', trigger: 'blur' }
                    ],
                    goodsdesc:[
                        { required: true, message: '请输入商品简介', trigger: 'blur' }
                    ]
                }             
            }
        },
        methods : {
            submitForm(){
                this.$refs.GoodsAddForm.validate( (valid) => {
                    if(valid){
                       //收集参数
                       let params = {
                            GoodsClassify : this.GoodsAddForm.GoodsClassify,//分类
                            GoodsBarCode : this.GoodsAddForm.GoodsBarCode,//条形码
                            GoodsName : this.GoodsAddForm.GoodsName,//商品名称
                            SellPrice : this.GoodsAddForm.SellPrice,//售价
                            MarketPrice : this.GoodsAddForm.MarketPrice,//市场价
                            PurchasePrice : this.GoodsAddForm.PurchasePrice,//进价
                            StockNum : this.GoodsAddForm.StockNum,//入库数量
                            GoodsWeight : this.GoodsAddForm.GoodsWeight,//商品重量
                            GoodsUnit : this.GoodsAddForm.GoodsUnit,//商品单位
                            discounts : this.GoodsAddForm.discounts,//会员优惠
                            IsPromotion : this.GoodsAddForm.IsPromotion,//是否促销
                            goodsdesc : this.GoodsAddForm.goodsdesc,//商品简介
                       }
                       //发送ajax
                       GoodsAdd(params)
                       .then(res => {
                           let {code,reason} = res;

                           if(code === 0){
                               this.$message({
                                   type:"success",
                                   message:reason
                               })

                               //成功跳转到商品管理
                               this.$router.push("/home/goodsmanage");
                           }else if(code === 1){
                               this.$message.error(error);
                           }
                       })
                       .catch(err => {
                           console.log(err)
                       })
                        
                    }else{
                        return false;
                    }
                })
            },
            SetBarCode(min,max){//生成商品条形码
               let ranNum = Math.floor( Math.random() * (max-min+1) + min);
               this.GoodsAddForm.GoodsBarCode = ranNum
            },
            countPrice(){//计算价格
                this.GoodsAddForm.SellPrice = parseFloat((this.GoodsAddForm.PurchasePrice * 1.5).toFixed(2));
                this.GoodsAddForm.MarketPrice = parseFloat((this.GoodsAddForm.PurchasePrice * 2).toFixed(2));
            }
        }

    }
</script>

<style lang="less">
     .goods-add{
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