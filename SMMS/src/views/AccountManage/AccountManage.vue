<template>
    <div class="account-manage">
         <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>用户管理</h3>
            </div>
            <div class="text item">
                <!-- 表格 -->
                <el-table
                    ref="AccountTable"
                    :data="AccountTableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="SelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    
                    <el-table-column
                    prop="account"
                    label="姓名"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="userGroup"
                    label="用户组"
                    >
                    </el-table-column>
                    <el-table-column
                    label="日期"
                    >
                    <template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="handleEdit(scope.row.id)"
                            >
                            <i class="el-icon-edit"></i>
                            编辑</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row.id)"
                            >
                            <i class="el-icon-delete"></i>
                            删除</el-button>
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
                    :total="total"
                    >
                </el-pagination>
                <!-- 按钮 -->
                <div style="margin-top:20px;">
                    <el-button type="danger" size="small" @click="batchdel">批量删除</el-button>
                    <el-button type="primary" size="small" @click="deselect">取消选择</el-button>
                </div>

                <!-- 弹出的模态框 -->
                <el-dialog 
                    title="编辑账号"
                    :visible.sync="visible"
                    width = "430px"
                    >
                        <el-form :model="editForm" ref="editForm" :rules="rules" style="width:317px" >
                            <el-form-item label="账号" label-width="100px" prop="account">
                            <el-input v-model="editForm.account"  autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="用户组" label-width="100px">
                            <el-select v-model="editForm.userGroup" placeholder="请选择用户组">
                                <el-option label="超级管理员" value="超级管理员"></el-option>
                                <el-option label="普通用户" value="普通用户"></el-option>
                            </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="visible = false">取 消</el-button>
                            <el-button type="primary" @click="SaveData">确 定</el-button>
                        </div>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入时间格式化模块
    import moment from "moment";

    //引入用户管理api文件
    import {accountEdit,accountDelete,saveEdit,batchDelete,getAccountDataByPage} from "@/api/account";


    export default {
        data(){
            return {
               //表格数据
               AccountTableData : [],
               currentPage : 1,//当前页码
               pageSize:3,//每页条数
               total:0,//数据总条数
               editForm:{//模态框数据
                   account:"",
                   userGroup:""
               },
               visible : false,//模态框显示、隐藏
               rules : {
                   account:[
                        { required: true, message: '请输入用户名', trigger: 'change' },//非空
                        { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change' }//长度
                   ]
               },
               editId:"",
               IdArr:[]//选中数据的id
            }
        },
        methods : {
            handleEdit(id){//修改
                 //显示模态框
                 this.visible = true;

                 //保存原来数据的id
                 this.editId = id;
                 
                 //发送请求 -- 拿到指定数据 进行数据回填
                 accountEdit({id})
                 .then(res => {
                     //接收响应结果
                     let {data} = res;
                     
                     //数据回填
                     this.editForm.account = data[0].account;
                     this.editForm.userGroup = data[0].userGroup;
                 })
                 .catch( err => {
                     console.log(err);
                 })
            },
            handleDelete(id){//删除
                //优化用户体验 -- 提示用户 是否进行此操作
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {//成功
                   accountDelete({id})
                    .then(res => {
                        //接收响应数据
                        let {code,reason} = res;
                        //判断
                        if(code === 0){//成功
                            this.$message({
                                type:"success",
                                message:reason
                            })
                            //重新刷新页面 -- 再次请求数据
                            this.getDataByPage();
                        }else if(code === 1){//失败
                            this.$message.error(reason)
                        }
                        
                    })
                    .catch( err => {
                        console.log(err);
                    })
                }).catch(() => {//失败
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                });
            },
            handleSizeChange(pageSize){//每页条数
                this.pageSize = pageSize
                //调用显示当前页数据函数
                this.getDataByPage();
            }, 
            handleCurrentChange(currentPage){//当前页
                this.currentPage = currentPage
                //调用显示当前页数据函数
                this.getDataByPage();
            },
            SelectionChange(data){//当选择项发生变化时会触发该事件 -- 批量删除
               
               this.IdArr = data.map( v => v.id);//取出所有数据的id们
             
            },
            SaveData(){//保存数据
               //当所有前端验证通过后 才能隐藏模态框
               this.$refs.editForm.validate((valid) => {
                   if(valid){//通过
                     //隐藏模态框
                     this.visible = false;

                     let params = {
                         account:this.editForm.account,
                         userGroup:this.editForm.userGroup,
                         id:this.editId
                     }
                     
                     //保存数据 -- 修改用户
                    saveEdit(params)
                     .then(res => {

                         let {code ,reason } = res;
                         if(code === 0){//成功
                             this.$message({
                                 type:"success",
                                 message:reason
                             })

                             //重新渲染页面 -- 请求所有数据渲染
                             this.getDataByPage();
                         }else if(code === 1){//失败
                             this.$message.error(reason)
                         }

                     })
                     .catch(err => {
                         console.log(err)
                     })

                   }else{//不通过
                      return false;
                   }

               })
            },
            deselect(){//取消选择
                 this.$refs.AccountTable.clearSelection();
            },
            batchdel(){//批量删除
                //如果用户没有选中 -- 就不用发送请求
                if(!this.IdArr.length){
                    this.$message.error("请选中需要批量删除的数据！！！");
                    return;
                }

                //优化用户体验 -- 警示框
                this.$confirm('此操作将批量删除选中数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     //发送ajax
                        batchDelete({IdArr:this.IdArr})
                        .then(res => {
                            //接收响应参数
                            let { code , reason } = res;
                            //判断
                            if(code === 0){//删除成功
                                this.$message({
                                    type:"success",
                                    message:reason
                                })
                                //刷新网页数据
                                this.getDataByPage();
                            }else if(code === 1){//删除失败
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
            getDataByPage(){//分页 -- 显示当前页的数据
               
                //收集参数
                let params = {
                    pageSize : this.pageSize,
                    currentPage : this.currentPage
                }
                
                getAccountDataByPage(params)
                .then(res => {
                    //接收相应参数
                    let {total,data} = res;
                    
                    //赋值 -- 渲染页面
                     this.total = total;
                     this.AccountTableData = data;

                    //如果当前页没有数据 -- 跳到上一页   当前页不能等于一
                    if(!data.length && this.currentPage !== 1){
                        this.currentPage -= 1;
                        this.getDataByPage();
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
        },
        created(){//发送ajax
            
             this.getDataByPage();
        },
        filters:{//过滤器
            filterCtime(ctime){
                return moment(ctime).format("YYYY-MM-DD hh-mm-ss");
            }
        }
    }
</script>

<style lang="less">
    .account-manage{
         & > .el-card{
               border:1px solid #ccc;
             & > .el-card__header{
                 padding: 12px 20px;
                 background:#f2f2f2;
                 h3 {
                     font-size:16px;
                 }
              }
             & > .el-card__body{
                 .el-pagination{
                     margin-top:30px;
                 }
             }
          }
      }
</style>