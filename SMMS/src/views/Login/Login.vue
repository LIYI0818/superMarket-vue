<template>
    <div class="login">
        <div class="login-wrap">
             <h3 class="login-title">
                 <span class="el-icon-s-custom"></span>
                 华联超市管理系统 -- 登录界面
             </h3>
             <el-form 
             :model="loginForm" 
             status-icon 
             :rules="rules" 
             ref="loginForm" 
             label-width="100px" 
             class="demo-ruleForm"
             >
                <el-form-item label="用户名" prop="account">
                    <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="loginForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
            
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    //引入正则验证函数
    import { pwdReg } from "@/utils/reg";
    //引入本地存贮函数
    import local from "@/utils/local";
    //引入登录模块api
    import {checkLogin} from "@/api/login"
    export default {
        data(){
            //密码验证
            let checkPassword = (rule,value,callback) => {
                let pwdLen = value.length;
                if(value === ""){
                     callback(new Error("请输入密码！！！"));//非空
                }else if(pwdLen < 5 || pwdLen > 8){
                     callback(new Error("请输入密码为 5 ~ 8 位"));//长度
                }else if(!pwdReg( value )){
                     callback(new Error("密码格式为数字或者字母"));//正则
                }else{
                     //再次输入密码不为空 ，触发一致性验证
                     if(this.loginForm.checkPass !== ""){
                         this.$refs.loginForm.validateField("checkPass");
                     }
                     callback();//成功
                }
            }
            //确认密码
            let confirmPwd = (rule,value,callback) => {
                if(value === ""){//非空
                   callback(new Error("请再次输入密码"));
                }else if(value !== this.loginForm.password){//一致性
                   callback(new Error("两次输入的密码不一致"));
                }else{
                   callback();//成功
                }
            }
            return {
                loginForm : {//数据双向绑定
                    account : "",
                    password : "",
                    checkPass : ""
                },
                rules : {//验证规则
                    account : [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
                    ],
                    password : [
                        { required: true, validator:checkPassword, trigger: 'blur' }
                    ],
                    checkPass : [
                        { required: true, validator:confirmPwd, trigger: 'blur' }                       
                    ]
                }
            }
        },
        methods : {
            submitForm(){
               // 页面中使用ref属性声明的标签dom，可以使用 this.$refs.ref属性的值 获取
                // element内置了验证方法 validate 传入一个函数 函数中的变量如果是true就验证通过 否则验证不通过
                this.$refs.loginForm.validate((valid) => {
                    if(valid){
                        //收集参数
                        let params = {
                            account: this.loginForm.account,
                            password:this.loginForm.password
                        }
                        checkLogin(params)
                         .then( res => {
                             //接收响应参数
                             let {code,reason,token} = res;
                             
                             //将token 放入本地存贮
                             local.save("user_token",token);

                             //判断
                             if(code === 0){//成功
                                this.$message({
                                    type:"success",
                                    message:reason
                                })

                                //跳转到主页
                                this.$router.push("/home");
                             }else if(code === 1){//失败
                                 this.$message.error(reason);
                             }
                         })
                         .catch(err => {
                             console.log(err)
                         })

                    }else{
                        return false; //不允许提交
                    }
                })
            },
            resetForm(){
                 this.$refs.loginForm.resetFields();//重置表单
            }
        }
    }
</script>

<style lang="less">
//    引入登录样式
  @import "./login.less";
</style>