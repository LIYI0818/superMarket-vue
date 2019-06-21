<template>
    <div class="inventory-manage">
        
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>库存管理</h3>
                
            </div>
            <div class="text item">
                <!-- 表单 -->
                <el-form :inline="true"
                 :model="InventorymanageForm" 
                 size="small"
                 >
                    <el-form-item label="分类">
                        <el-select 
                        v-model="InventorymanageForm.classify" 
                        placeholder="== 选择分类 =="
                        style="width:150px;"
                        >
                        <el-option label="全部分类" value="全部分类"></el-option>
                        <el-option label="烟酒类" value="烟酒类"></el-option>
                        <el-option label="零食类" value="零食类"></el-option>
                        <el-option label="饮料类" value="饮料类"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input v-model="InventorymanageForm.keyword" placeholder="搜索商品"></el-input>
                    </el-form-item>
                    <el-form-item>
                        (商品名称，条形码)
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格 -->
                <el-table
                    :data="InventorytableData"
                    stripe
                    style="width: 100%"
                    ref="Inventorytable"
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                    >
                     <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                    prop="GoodsBarCode"
                    label="商品条形码"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="GoodsName"
                    label="商品名称"
                    >
                    </el-table-column>

                    <el-table-column
                    prop="classify"
                    label="商品分类"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="PurchasePrice"
                    label="进价(元)">
                    </el-table-column>
                    <el-table-column
                    prop="GoodsNum"
                    label="商品数量">
                    </el-table-column>

                    <el-table-column
                    label="添加时间">
                    <template slot-scope="scope">{{ scope.row.ctime |  filterCtime }}</template>
                    </el-table-column>
                    
                    <el-table-column label="管理">
                      <template slot-scope="scope">
                           <!-- 编辑 -->
                            <el-button 
                            type="primary" size="mini" 
                             icon="el-icon-edit" circle
                             @click="editData(scope.row.id)"
                             >
                            </el-button>
                            <!-- 删除 -->
                            <el-button 
                            type="danger" size="mini" 
                            icon="el-icon-delete" circle
                            @click="deleteData(scope.row.id)"
                            ></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                    style="margin-top:20px"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[1, 3, 5, 10]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>

                <!-- 按钮 -->
                <div style="margin-top:20px">
                    <el-button type="danger" size="mini" @click="batchdel">批量删除</el-button>
                    <el-button type="primary" size="mini" @click="deselect">取消选择</el-button>
                </div>

                <!-- 模态框 -->
                <el-dialog title="收货地址" :visible.sync="visible" width="450px">
                    <el-form :model="EditForm" :rules="rules" ref="EditForm">
                        <el-form-item label="商品名称" label-width="120px" prop="GoodsName">
                          <el-input 
                          v-model="EditForm.GoodsName"
                          autocomplete="off" 
                          style="width:217px"></el-input>
                        </el-form-item>

                        <el-form-item label="商品数量" label-width="120px" prop="GoodsNum">
                          <el-input 
                          v-model="EditForm.GoodsNum" 
                          autocomplete="off"
                          style="width:217px"
                          ></el-input>
                        </el-form-item>

                        <el-form-item label="商品进价" label-width="120px" prop="PurchasePrice">
                          <el-input 
                          v-model="EditForm.PurchasePrice"
                           autocomplete="off"
                           style="width:217px"
                           ></el-input>
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
    //引入时间格式化模块
    import moment from "moment"

    //引入库存模块api
    import {DeleteInventory,GetInventoryData,SaveInventoryData,BatchDataDel,getDataByPage} from "@/api/inventory"

    export default {
        data(){
            return {
                InventorymanageForm:{
                    classify:"",
                    keyword:""
                },
                InventorytableData:[],
                currentPage:1,//当前页
                pageSize:3,//每页数据条数
                total:10,//总数据条数
                idArr:[],//选中数据的id们
                visible:false,
                EditForm:{
                    GoodsName:"",
                    GoodsNum:"",
                    PurchasePrice:""
                },
                rules:{
                    GoodsName:[
                        { required: true, message:"请输入商品名称", trigger: 'blur' }
                    ],
                    GoodsNum:[
                        { required: true, message:"请输入商品数量", trigger: 'blur' }
                    ],
                    PurchasePrice:[
                        { required: true, message:"请输入商品进价", trigger: 'blur' }
                    ]
                },
                editId:""//编辑数据的id
            }
        },
        methods:{
            search(){
                 this.getInventoryDataByPage();
            },
            deleteData(id){//删除数据

               //优化 -- 增加用户体验
               this.$confirm('此操作将删除该商品库存, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    DeleteInventory({id})
                    .then(res => {
                        //接收响应参数
                        let {code,reason} = res;
                        
                        if(code === 0){//成功
                            this.$message({
                                type:"success",
                                message:reason
                            })
                            //重新渲染页面
                            this.getInventoryDataByPage();
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
            editData(id){//编辑数据
                //显示模态框
                this.visible = true;

                //渲染当前数据
                this.editId = id;

                GetInventoryData({id})
                .then(res => {
                    //接收响应参数
                    let {data} = res;

                    //渲染到表单中
                    this.EditForm = data[0];
                    
                })
                .catch(err => {
                    console.log(err)
                })

            },
            saveData(){//保存修改数据
                //前端验证通过才能修改
                this.$refs.EditForm.validate((valid) => {
                    
                    if(valid){
                        //隐藏模态框
                        this.visible = false;

                        let params = {
                            GoodsName : this.EditForm.GoodsName,
                            GoodsNum : this.EditForm.GoodsNum,
                            PurchasePrice : this.EditForm.PurchasePrice,
                            editId : this.editId,
                        }
            
                        SaveInventoryData(params)
                        .then(res => {
                            //接收响应数据
                            let {code,reason} = res;
                            
                            if(code === 0){//成功
                                this.$message({
                                    type:"success",
                                    message:reason
                                })
                                //重新渲染页面
                                this.getInventoryDataByPage();
                            }else if(code === 1){//失败
                                this.$message.error(reason)
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
            handleSelectionChange(data){//选项改变触发
                 this.idArr = data.map(v => v.id);
            },
            batchdel(){//批量删除
                
                //优化
                if(!this.idArr.length){
                    this.$message.error("请选择需要批量删除的商品库存数据");
                    return;
                }
                
                //提示 -- 增加用户体验
                this.$confirm('此操作将批量删除选中数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    BatchDataDel({idArr : this.idArr})
                    .then(res => {

                        //接收响应参数
                        let {code,reason} = res;
                        
                        if(code === 0){//成功
                            this.$message({
                                type:"success",
                                message:reason
                            })

                            //重新渲染页面
                            this.getInventoryDataByPage();
                            
                            //如果没有数据
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
            deselect(){//取消选择
                this.$refs.Inventorytable.clearSelection();
            },
            handleSizeChange(pageSize){//每页数据条数
                 this.pageSize = pageSize;
                 this.getInventoryDataByPage();
            },
            handleCurrentChange(currentPage){//当前页
                 this.currentPage = currentPage;
                 this.getInventoryDataByPage();
            },
            getInventoryDataByPage(){//分页 -- 拿当前页的数据
                //收集参数
                let params = {
                    pageSize : this.pageSize,
                    currentPage : this.currentPage,
                    classify : this.InventorymanageForm.classify,
                    keyword : this.InventorymanageForm.keyword,
                }
                 
                getDataByPage(params)
                 .then(res => {
                     //接收响应数据
                     let {total , data} = res;

                     //渲染页面
                     this.total = total;
                     this.InventorytableData = data;

                     //优化  -- 当前没有数据是自动跳到上一页 -- 当前页不能=1
                     if(!data.length && this.currentPage !== 1){
                          this.currentPage -= 1;
                          this.getInventoryDataByPage();
                     }
                 })
                 .catch(err => {
                     console.log(err)
                 })
            }
        },
        created(){
            this.getInventoryDataByPage();
        },
        filters:{//过滤器
             filterCtime(ctime){
                return moment(ctime).format("YYYY-MM-DD hh-mm-ss");
            }
        }
    }
</script>

<style lang="less">
     .inventory-manage{
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
                  }
              }
          }
      }
</style>