<template>
    <div class="vipaccount-manage">
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>会员用户管理</h3>
                
            </div>
            <div class="text item">
                <!-- 表单 -->
                <el-form 
                 :inline="true" 
                 :model="vipaccountmanageForm" 
                 class="demo-form-inline"
                 size="small"
                 >
                    <el-form-item label="搜索">
                        <el-input v-model="vipaccountmanageForm.search"></el-input>
                    </el-form-item>
                    <el-form-item>
                         会员卡，会员名，电话，手机
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格 -->
                <el-table
                    ref="VipaccountManageTable"
                    :data="VipaccountManageData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    prop="VipCardNum"
                    label="会员卡卡号"
                    >
                    </el-table-column>

                    <el-table-column
                    prop="RealName"
                    label="会员姓名"
                    >
                    </el-table-column>

                    <el-table-column
                    prop="AccountGroup"
                    label="会员等级"
                    >
                    </el-table-column>

                    <el-table-column
                    prop="Status"
                    label="用户状态"
                    >
                    </el-table-column>

                    <el-table-column
                    prop="PhoneNum"
                    label="手机号码"
                    >
                    </el-table-column>

                    <el-table-column
                    prop="TelNum"
                    label="座机号码"
                    >
                    </el-table-column>

                    <el-table-column
                    prop="EmailAddress"
                    label="邮箱地址"
                    >
                    </el-table-column>
                    <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button 
                        type="primary" 
                        icon="el-icon-edit"
                        circle
                        size="mini"
                        @click="handleEdit(scope.row.id)"
                        ></el-button>
                        <el-button 
                        type="danger" 
                        icon="el-icon-delete" 
                        circle
                        @click="handleDelete(scope.row.id)"
                        size="mini"
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
                    <el-button type="danger" size="mini" @click="BatchDel">批量删除</el-button>
                    <el-button type="primary" size="mini" @click="deselect">取消选中</el-button>
                </div>
                <!-- 模态框 -->
                <el-dialog title="编辑会员信息" :visible.sync="visible" width="450px">
                    <el-form :model="VipEditForm" :rules="rules" ref="VipEditForm">
                        <el-form-item label="会员卡卡号" label-width="120px" prop="VipCardNum">
                        <el-input 
                        v-model="VipEditForm.VipCardNum"
                        autocomplete="off"
                        style="width:217px"
                        ></el-input>
                        </el-form-item>

                        <el-form-item label="会员名称" label-width="120px" prop="RealName">
                        <el-input 
                        v-model="VipEditForm.RealName"
                        autocomplete="off"
                        style="width:217px"
                        ></el-input>
                        </el-form-item>

                        <el-form-item label="会员等级" label-width="120px" prop="AccountGroup">
                            <el-select v-model="VipEditForm.AccountGroup" placeholder="请选择会员等级">
                                <el-option label="黄金会员" value="黄金会员"></el-option>
                                <el-option label="白银会员" value="白银会员"></el-option>
                                <el-option label="普通会员" value="普通会员"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="用户状态" label-width="120px" prop="Status">
                            <el-radio-group v-model="VipEditForm.Status">
                                <el-radio label="启用">启用</el-radio>
                                <el-radio label="禁用">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        
                        <el-form-item label="手机号码" label-width="120px" prop="PhoneNum">
                            <el-input 
                            v-model="VipEditForm.PhoneNum"
                            autocomplete="off"
                            style="width:217px"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="座机号码" label-width="120px" prop="TelNum">
                            <el-input 
                            v-model="VipEditForm.TelNum"
                            autocomplete="off"
                            style="width:217px"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="邮箱地址" label-width="120px" prop="EmailAddress">
                            <el-input 
                            v-model="VipEditForm.EmailAddress"
                            autocomplete="off"
                            style="width:217px"
                            ></el-input>
                        </el-form-item>

                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="visible = false">取 消</el-button>
                        <el-button type="primary" @click="SaveVipData">确 定</el-button>
                    </div>
                </el-dialog>

            </div>
        </el-card>
    </div>
</template>

<script>
    //引入会员模块api文件
    import {GetVipDataByPage,DeleteVipData,EditVipData,SaveVipEditData,BatchDeleteVipData} from "@/api/vipaccount";
     //引入工具函数
    import { PhoneNumReg, TelNumReg ,EmailReg} from "@/utils/reg";
    export default {
        data(){
             const VerifyPhoneNum = (rule,value,callback) => {//手机号码
               
                if(value === ""){
                   callback(new Error("请输入手机号码"));
                }else if(!PhoneNumReg(value)){
                   callback(new Error("请输入有效的手机号码"));//1开头 第二位3、6、7、8 后面直到11位数字
                }else{
                    callback();
                }
             }
             const VerifyTelNum = (rule,value,callback) => {//座机号码
                
                 if(value === ""){
                     callback(new Error("请输入座机号码"))
                 }else if(!TelNumReg(value)){
                     callback(new Error("号码为0开始，2-3个数字-加7、8个数字"))
                 }else{
                     callback();
                 }
             }
             const VerifyEmail = (rule,value,callback) => {//邮箱地址
                
                if(value === ""){
                    callback(new Error("输入邮箱地址"));
                }else if(!EmailReg(value)){
                    callback(new Error("输入正确邮箱地址"));
                }else{
                    callback();
                }
             }
            return {
                vipaccountmanageForm:{
                   search:""
                },
                VipaccountManageData:[],
                currentPage:1,//当前页
                pageSize:3,//每页数据条数
                total:10,//数据总条数
                visible:false,
                VipEditForm:{
                    VipCardNum:"",
                    RealName:"",
                    AccountGroup:"",
                    Status:"",
                    PhoneNum:"",
                    TelNum:"",
                    EmailAddress:""
                },
                editId:"",
                rules:{
                   VipCardNum:[
                       { required: true, message: '请输入会员卡卡号', trigger: 'blur' },
                       { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
                   ],
                   RealName:[
                       { required: true, message: '请输入真实姓名', trigger: 'blur' },
                       { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
                   ],
                   AccountGroup:[
                       { required: true, message: '请选择用户组', trigger: 'change' }
                   ],
                   Status:[
                       { required: true, message: '请选择用户状态', trigger: 'change' }
                   ],
                   PhoneNum:[
                       { required: true, validator:VerifyPhoneNum, trigger: 'blur' }
                   ],
                   TelNum:[
                       { required: true, validator:VerifyTelNum, trigger: 'blur' }
                   ],
                   EmailAddress:[
                       { required: true, validator:VerifyEmail, trigger: 'blur' }
                   ]
                },
                IdArr:[]
            }
        },
        methods:{
            onSubmit(){

            },
            handleSelectionChange(data){//选中状态发生改变触发
                this.IdArr = data.map(v => v.id);
            },
            BatchDel(){//批量删除
                 //优化
                 if(!this.IdArr.length){
                     this.$message.error("请选中需要批量删除的会员信息");
                     return;
                 }
                 
                 //提示信息
                 this.$confirm('此操作将批量删除选中的会员信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                            //收集参数
                            let params = {
                                IdArr : this.IdArr
                            }

                            BatchDeleteVipData(params)
                            .then(res => {
                                let {code,reason} = res;
                                
                                if(code === 0){
                                    this.$message({
                                        type:"success",
                                        message:reason
                                    })

                                    //重新渲染页面
                                    this.getVipDataByPage();
                                }else if(code === 1){
                                    this.$message.error(reason);
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
            handleEdit(id){//编辑
                //保存数据id
                this.editId = id;

                //显示模态框
                this.visible = true;

                EditVipData({id})
                 .then(res => {
                     let {data} = res;
                    
                     //数据回填
                     this.VipEditForm = data[0];
                 })
                 .catch( err => {
                     console.log(err);
                 })
            },
            SaveVipData(){//保存编辑后的数据

                 this.$refs.VipEditForm.validate( (valid) => {
                      
                      if(valid){
                           //隐藏模态框
                            this.visible = false;

                            //收集参数
                            let params = {
                                VipCardNum : this.VipEditForm.VipCardNum,
                                RealName : this.VipEditForm.RealName,
                                AccountGroup : this.VipEditForm.AccountGroup,
                                Status : this.VipEditForm.Status,
                                PhoneNum : this.VipEditForm.PhoneNum,
                                TelNum : this.VipEditForm.TelNum,
                                EmailAddress : this.VipEditForm.EmailAddress,
                                editId : this.editId
                            }
                        
                            SaveVipEditData(params)
                            .then(res => {
                                let {code,reason} = res;

                                if(code === 0){
                                    this.$message({
                                        type:"success",
                                        message : reason
                                    })
                                    //重新渲染页面
                                    this.getVipDataByPage();
                                }else if(code === 1){
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
                
                
            },
            handleDelete(id){//删除
                //优化 -- 增加用户体验

                this.$confirm('此操作将该会员信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    DeleteVipData({id})
                    .then(res => {
                        let {code,reason} = res;
                        
                        if(code === 0){
                            this.$message({
                                type:"success",
                                message:reason
                            })
                            //重新渲染页面
                            this.getVipDataByPage();
                        }else if(code === 1){
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
            deselect(){//取消选中
               this.$refs.VipaccountManageTable.clearSelection();
            },
            handleSizeChange(pageSize){//每页数据条数改变
                this.pageSize = pageSize;
                this.getVipDataByPage();
            },
            handleCurrentChange(currentPage){//当前页改变
                this.currentPage = currentPage;
                this.getVipDataByPage();
            },
            getVipDataByPage(){//分页
                //收集参数
                let params = {
                    pageSize : this.pageSize,
                    currentPage : this.currentPage
                }
                
                GetVipDataByPage(params)
                 .then(res => {
                     let {total,data} = res;

                     //渲染页面
                      this.total = total;
                      this.VipaccountManageData= data;

                      //优化
                      if(!data.length && currentPage !== 1){
                          this.currentPage -= 1;
                          this.getVipDataByPage();
                      }
                 })
                 .catch(err => {
                     console.log(err)
                 })
            }
        },
        created(){
            this.getVipDataByPage();
        }
    }
</script>

<style lang="less">
     .vipaccount-manage{
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