<template>
    <div class="account-add">    
         <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>用户添加</h3>
            </div>
            <div class="text item">
                <el-form 
                 :model="AccountAddForm" 
                 status-icon :rules="rules"
                 ref="AccountAddForm" 
                 label-width="100px">
                    <el-form-item label="用户名" prop="account">
                        <el-input 
                        type="text" 
                        v-model="AccountAddForm.account"
                        autocomplete="off"
                         style="width:217px"
                         @blur="isAccountExist"
                         ></el-input>
                        <span 
                        style="margin-left:20px;font-size:12px"
                        >{{msg}}</span>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input 
                        type="password"
                        v-model="AccountAddForm.password"
                        autocomplete="off"
                        style="width:217px"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input 
                        type="password" 
                        v-model="AccountAddForm.checkPass" 
                        autocomplete="off"
                        style="width:217px"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="选择用户组" prop="userGroup">
                        <el-select v-model="AccountAddForm.userGroup" placeholder="请选择用户组">
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                        <el-option label="普通用户" value="普通用户"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">确认</el-button>
                        <el-button @click="resetForm()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入正则函数
    import {pwdReg} from "@/utils/reg";
    //引入用户管理api文件
    import {accountAdd,isaccountexist} from "@/api/account"

    export default {
        data(){
            let checkPassword = (rule,value,callback) => {//密码验证
                let pwdLen = value.length;
                if(value === ""){
                   callback(new Error("请输入密码"));//非空
                }else if( pwdLen < 5 || pwdLen > 8){
                   callback(new Error("请输入密码为 5 ~ 8 位"));//长度
                }else if( !pwdReg(value) ){
                   callback(new Error("密码格式为数字或者字母"));//正则
                }else{
                   if( this.AccountAddForm.checkPass !== ""){
                       this.$refs.AccountAddForm.validateField("checkPass")//反向验证
                   }
                   callback();
                } 
                
            }
            let confirmPass = (rule,value,callback) => {//确认密码验证
                
                if(value === ""){
                    callback(new Error("请再次输入密码"))
                }else if(value !== this.AccountAddForm.password){//一致性
                    callback(new Error("两次输入的密码不一致"))
                }else{
                    callback();
                }
            }
            return {
                AccountAddForm : {
                    account : "",
                    password : "",
                    checkPass : "",
                    userGroup : ""
                },
                rules : {
                    account : [//用户名
                        { required: true, message: '请输入用户名', trigger: 'blur' },//非空
                        { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }//长度
                    ],
                    password : [//密码
                        {required : true, validator : checkPassword , trigger: 'blur'}//自定义验证
                    ],
                    checkPass : [//确认密码
                        {required : true, validator : confirmPass , trigger: 'blur'}//自定义验证
                    ],
                    userGroup : [//选择用户组
                        {required : true, message: '请选择用户组', trigger: 'change'}
                    ]
                },
                msg:""
            }
        },
        methods : {
            submitForm(){
                this.$refs.AccountAddForm.validate( (valid) => {//所有前端验证全通过 valid返回true /否则false
                    if(valid){
                       
                       let params = {
                           account : this.AccountAddForm.account,
                           password : this.AccountAddForm.password,
                           userGroup : this.AccountAddForm.userGroup
                       }
                       
                       //发送ajax
                       accountAdd(params)
                        .then(res => {
                            let {code,reason} = res;
                            
                            if(code === 0){//成功
                              
                               this.$message({
                                   type:"success",
                                   message:reason
                               });
                               //跳转账号管理
                               this.$router.push("/home/accountmanage");
                            }else if(code === 1){//失败
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
            },
            resetForm(){
                this.$refs.AccountAddForm.resetFields();
            },
            isAccountExist(){//验证用户名是否存在
                  
                 isaccountexist({account:this.AccountAddForm.account})//收集请求参数
                 .then(res => {
                     //接收响应参数
                     let {code,reason} = res;
                     
                     if(code === 0){//可以使用 

                        this.msg = reason;

                     }else if(code === 1){//用户已存在
                        this.msg = reason;
                     }
                 }) 
                 .catch(err => {
                     console.log(err);
                 })
                 
            }
        }
    }
</script>

<style lang="less">
   .account-add{
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