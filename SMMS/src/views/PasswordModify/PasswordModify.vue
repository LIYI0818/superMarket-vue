<template>
    <div class="password-modify">   
         <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>修改用户密码</h3>
            </div>
            <div class="text item">
                 <el-form 
                  style="width:350px"
                 :model="PasswordModifyForm"
                  status-icon 
                  :rules="rules" 
                  ref="PasswordModifyForm" 
                  label-width="100px" 
                  >
                    <el-form-item label="原密码" prop="originPass">
                        <el-input 
                            type="password" 
                            v-model="PasswordModifyForm.originPass" 
                            autocomplete="off">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPass">
                        <el-input 
                            type="password" 
                            v-model="PasswordModifyForm.newPass" 
                            autocomplete="off">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="checkNewPass">
                        <el-input 
                            type="password" 
                            v-model="PasswordModifyForm.checkNewPass" 
                            autocomplete="off">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="submitForm()">确认修改</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入正则函数 -- 验证密码
    import { pwdReg } from "@/utils/reg";

    //引入用户管理
    import {checkoriginPass,EditPassword} from "@/api/account";

    //引入本地存储函数
    import local from "@/utils/local";
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
                    //验证原密码是否正确
                    checkoriginPass({originPass : value})
                      .then(res =>{

                         let {code,reason} = res;
                         
                         if(code === 0){
                            callback();//成功
                         }else if(code === 1){
                            callback(new Error(reason))
                         }
                      })
                      .catch(err => {
                         console.log(err)
                      })
                      
                }
            }
           let verifyNewPass = (rule,value,callback) => {//新密码验证
               let pwdLen = value.length;
               if(value === ""){

                  callback(new Error("请输入新密码"));//非空

               }else if(value === this.PasswordModifyForm.originPass){
                   
                  callback(new Error("新密码不能和原密码一致"))//新密码不能和原密码一致

               }else if(pwdLen < 5 || pwdLen > 8){

                  callback(new Error("请输入密码在 5 ~ 8 位"));//长度

               }else if( !pwdReg(value) ){

                  callback(new Error("密码格式为数字或字母"))//正则

               }else{
                  if(this.PasswordModifyForm.checkNewPass !== ""){

                      this.$refs.PasswordModifyForm.validateField("checkNewPass");
                  }
                  callback();//成功
               }
           }
           let verifyCheckNewPass = (rule,value,callback) => {//确认新密码
                if(value === ""){
                   callback(new Error("请再次输入新密码"));//非空
                }else if( value !== this.PasswordModifyForm.newPass){
                   callback(new Error("两次输入密码不一致"))//一致性
                }else{
                   callback();//成功
                }
           }
           return {
               PasswordModifyForm :{
                   originPass : "",//原密码
                   newPass : "",//新密码
                   checkNewPass : ""//确认新密码
               },
               rules : {//验证规则
                   originPass : [
                       { required: true, validator:checkPassword, trigger: 'blur' },//非空
                   ],
                   newPass : [
                       { required: true, validator: verifyNewPass, trigger: 'blur' }//自定义密码验证
                   ],
                   checkNewPass : [
                       { required: true, validator: verifyCheckNewPass, trigger: 'blur' }//自定义确认密码验证
                   ]
               }
           }

        },
        methods : {
            submitForm(){
                 this.$refs.PasswordModifyForm.validate( (valid) => {//通过验证返回true,否则返回false
                     if(valid){
                         //获取参数
                         let params = {
                             newPass : this.PasswordModifyForm.newPass
                         }
                         
                         EditPassword(params)
                          .then(res => {
                              let {code,reason} = res;
                              
                              if(code === 0){//成功
                                 this.$message({
                                     type:"success",
                                     message:reason
                                 })

                                 //清除token
                                 local.remove("user_token");

                                 //跳转到登录页面
                                 setTimeout(() => {
                                     this.$router.push("/login");
                                 },1000)
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
        }
    }
</script>

<style lang="less">
    .password-modify{
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