<template>
    <div class="goods-manage">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>商品管理</h3>
            </div>
            <div class="text item">
                <!-- 表单 -->
                <el-form :inline="true" :model="SearchForm" class="demo-form-inline">
                    <el-form-item>
                        <el-select 
                        style="width:150px"
                        v-model="SearchForm.classify"
                         placeholder="== 选择分类 =="
                         size="small"
                         >
                        <el-option label="全部分类" value="全部分类"></el-option>
                        <el-option label="烟酒类" value="烟酒类"></el-option>
                        <el-option label="零食类" value="零食类"></el-option>
                        <el-option label="饮料类" value="饮料类"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字：">
                        <el-input 
                        style="width:200px"
                        v-model="SearchForm.keyword" 
                        placeholder="(商品名称，条形码)"
                        size="small"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格 -->
                <el-table
                    :data="GoodstableData"
                    stripe
                    ref="Goodstable"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="GoodsBarCode"
                    label="条形码"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="GoodsName"
                    label="商品名称"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="GoodsClassify"
                    label="商品分类">
                    </el-table-column>

                    <el-table-column
                    prop="SellPrice"
                    label="售价(元)">
                    </el-table-column>

                    <el-table-column
                    prop="IsPromotion"
                    label="是否促销">
                    </el-table-column>

                    <el-table-column
                    prop="MarketPrice"
                    label="市场价(元)">
                    </el-table-column>
                    <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button 
                            type="primary" 
                            icon="el-icon-edit"
                            circle
                            size="mini"
                            @click="handleEdit(scope.row.id)"
                         >
                      </el-button>
                        <el-button 
                            type="danger" 
                            icon="el-icon-delete"
                            circle
                            size="mini"
                            @click="handleDelete(scope.row.id)"
                         ></el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[1, 3, 5, 10]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
                <!-- 按钮 -->
                <div style="margin-top:20px;">
                  <el-button type="danger" size="mini" @click="batchdel">批量删除</el-button>
                  <el-button type="primary" size="mini" @click="deselect">取消选中</el-button>
                </div>
                <!-- 编辑表单 -->
                <el-dialog title="修改商品" :visible.sync="visible" width="450px">
                    <el-form :model="EditForm" ref="EditForm" :rules="rules">
                        <el-form-item label="商品名称" label-width="120px" prop="GoodsName">
                           <el-input v-model="EditForm.GoodsName" style="width:217px" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" label-width="120px" prop="GoodsClassify">
                        <el-select v-model="EditForm.GoodsClassify" placeholder="请选择商品分类">
                            <el-option label="烟酒类" value="烟酒类"></el-option>
                            <el-option label="零食类" value="零食类"></el-option>
                            <el-option label="饮料类" value="饮料类"></el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item label="售价" label-width="120px" prop="SellPrice">
                           <el-input v-model="EditForm.SellPrice" style="width:217px" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="是否促销" label-width="120px">
                            <el-radio v-model="EditForm.IsPromotion" label="促销">促销</el-radio>
                            <el-radio v-model="EditForm.IsPromotion" label="不促销">不促销</el-radio>           
                        </el-form-item>

                        <el-form-item label="市场价" label-width="120px" prop="MarketPrice">
                           <el-input v-model="EditForm.MarketPrice" style="width:217px" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="visible = false">取 消</el-button>
                        <el-button type="primary" @click="saveData">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入商品管理api文件
    import {GoodsEdit,GoodsDelete,BatchDelete,getGoodsByPage,saveEdit,Search} from "@/api/goods";
  
    export default {
        data(){
            return {
                SearchForm : {
                    classify:"",
                    keyword:""
                },
                GoodstableData : [],
                currentPage:1,
                pageSize:3, //每页数据条数  
                total:0,//数据总条数
                idArr:[],//批量删除id们
                editId:0,
                visible:false,
                EditForm:{
                   GoodsName:"",
                   GoodsClassify:"",
                   SellPrice:"",
                   IsPromotion:"",
                   MarketPrice:""
                },
                rules:{
                   GoodsName:[
                       { required: true, message: '请输入商品名称', trigger: 'blur' }
                   ],
                   GoodsClassify:[
                       { required: true, message: '请选择商品所属分类', trigger: 'change' }
                   ],
                   SellPrice:[
                       { required: true, message: '请输入商品售价(数字)', trigger: 'blur' }
                   ],
                   MarketPrice:[
                       { required: true, message: '请输入商品市场价(数字)', trigger: 'blur' }
                   ]
                }
            }
        },
        methods : {
            search(){//查询商品
            
                //调用分页函数
                this.getDataByPage();
            },
            handleEdit(id){//编辑
                //将数据id保存下来
                this.editId = id;

                this.visible = true;
                 
                let params = {
                    id
                }
                //渲染当前数据
                GoodsEdit(params)
                  .then(res => {
                      let {data} = res;
                      
                      this.EditForm = data[0];
                  })
                  .catch(err => {
                      console.log(err)
                  })

            },
            handleDelete(id){//删除
                  this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        GoodsDelete({id})
                        .then(res => {
                            let {code,reason} = res;
                            
                            if(code === 0){//成功
                                this.$message({
                                    type:"success",
                                    message:reason
                                })
                                //重新渲染
                                this.getDataByPage();
                            }else if(code === 1){//失败
                                this.$message.error(reason)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                  
            },
            handleSelectionChange(data){//选中触发
                this.idArr = data.map(v => v.id);//选中数据的id们
            },
            deselect(){//取消选中
                this.$refs.Goodstable.clearSelection();
            },
            batchdel(){//批量删除

                 //优化
                 if(!this.idArr.length){
                      this.$message.error("请选择需要批量删除数据");
                      return;
                 }

                 
                 this.$confirm('此操作将批量删除选中的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            idArr : this.idArr
                        }
                        BatchDelete(params)
                        .then(res => {
                            let {code,reason} = res;
                            
                            if(code === 0){//成功
                                this.$message({
                                    type:"success",
                                    message:reason
                                })

                                //重新渲染页面
                                this.getDataByPage();
                            }else if(code === 1){//失败
                                this.$message.error(reason);
                            } 
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                    });

                 
            },
            handleSizeChange(pageSize){//每页条数
                this.pageSize = pageSize;
                this.getDataByPage();
            },
            handleCurrentChange(currentPage){//当前页
                this.currentPage = currentPage;
                this.getDataByPage();
            },
            getDataByPage(){//分页获取 - 对应页码的数据

                //收集参数
                let params = {
                    pageSize : this.pageSize,
                    currentPage : this.currentPage,
                    classify : this.SearchForm.classify,
                    keyword : this.SearchForm.keyword
                }
                
                getGoodsByPage(params)
                 .then(res => {
                     let {total,data} = res;
                     //渲染页面
                     this.total = total;
                     this.GoodstableData = data;

                     //优化 -- 没有数据返回上一页 && 当前页不能等于1
                     if(!data.length && this.currentPage !== 1){
                            this.currentPage -= 1;
                            this.getDataByPage();
                     }
                     
                 })
                 .catch(err => {
                     console.log(err);
                 })
            },
            saveData(){//保存数据
                 //前端通过验证才可修改
                 this.$refs.EditForm.validate((valid) => {
                     if(valid){
                         //模态框消失
                        this.visible = false;

                        let params = {
                            GoodsName : this.EditForm.GoodsName,
                            GoodsClassify : this.EditForm.GoodsClassify,
                            SellPrice : this.EditForm.SellPrice,
                            IsPromotion : this.EditForm.IsPromotion,
                            MarketPrice : this.EditForm.MarketPrice,
                            id:this.editId
                        }

                        saveEdit(params)
                        .then(res => {
                            //接收响应参数
                            let {code,reason} = res;
                            
                            if(code === 0){//成功
                                this.$message({
                                    type:"success",
                                    message:reason
                                });

                                //重新渲染页面
                                this.getDataByPage();
                            }else if(code === 1){//失败
                                this.$message.error(reason)
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })

                     }else{
                        return false;
                     }
                 })

                 
            }
        },
        created(){
            this.getDataByPage();
        }
    }
</script>

<style lang="less">
   .goods-manage{
          .el-card{
               border:1px solid #ccc;
              .el-card__header{
                 padding: 12px 20px;
                 background:#f2f2f2;
                 h3 {
                     font-size:16px;
                 }
              }
              .el-card__body{
                  .item{
                     & > .el-form{
                          border-bottom:2px solid #ccc;
                      }
                      .el-table{
                          margin-top:20px;
                      }
                      .el-pagination{
                          margin-top:20px;
                      }
                  }
              }
          }
      }
</style>