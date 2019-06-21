<template>
    <div class="vipaccount-add">
       
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>会员用户添加</h3>
                
            </div>
            <div class="text item">
                <el-form :model="VipAccountAddForm" 
                :rules="rules" 
                ref="VipAccountAddForm"
                label-width="100px"
                size="small"
                >   
                <!-- 真实姓名 -->
                    <el-form-item label="真实姓名" prop="RealName" style="width:350px">
                        <el-input v-model="VipAccountAddForm.RealName"></el-input>
                    </el-form-item>
                 <!-- 会员卡卡号 -->
                    <el-form-item label="会员卡卡号" prop="VipCardNum" style="width:350px">
                        <el-input v-model="VipAccountAddForm.VipCardNum"></el-input>
                    </el-form-item>
                 <!-- 用户组 -->
                    <el-form-item label="用户组" prop="AccountGroup" style="width:250px">
                        <el-select v-model="VipAccountAddForm.AccountGroup" placeholder="普通会员">
                        <el-option label="黄金会员" value="黄金会员"></el-option>
                        <el-option label="白银会员" value="白银会员"></el-option>
                        <el-option label="普通会员" value="普通会员"></el-option>
                        </el-select>
                    </el-form-item>
                 <!-- 身份证号 -->
                    <el-form-item label="身份证号" prop="IpNum" style="width:350px">
                        <el-input v-model="VipAccountAddForm.IpNum"></el-input>
                    </el-form-item>

                <!-- 用户状态 -->
                    <el-form-item label="用户状态" prop="Status">
                        <el-radio-group v-model="VipAccountAddForm.Status">
                            <el-radio label="启用">启用</el-radio>
                            <el-radio label="禁用">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
            
                 <!-- 手机号码 -->
                    <el-form-item label="手机号码" prop="PhoneNum" style="width:350px">
                        <el-input v-model="VipAccountAddForm.PhoneNum"></el-input>
                    </el-form-item>

                 <!-- 座机号码 -->
                    <el-form-item label="座机号码" prop="TelNum" style="width:350px">
                        <el-input v-model="VipAccountAddForm.TelNum"></el-input>
                    </el-form-item>

                 <!-- 邮箱地址 -->
                    <el-form-item label="邮箱地址" prop="EmailAddress" style="width:350px">
                        <el-input v-model="VipAccountAddForm.EmailAddress"></el-input>
                    </el-form-item>
                 <!-- 地区选择 -->
                   <el-form-item label="地区选择">
                       <el-col :span="4">

                        <el-form-item  prop="ProvinceGroup" >
                            <el-select 
                            v-model="VipAccountAddForm.ProvinceGroup" 
                            placeholder="请选择省份"
                            style="width:150px"
                            >
                            <el-option label="四川省" value="四川省"></el-option>
                            <el-option label="广东省" value="广东省"></el-option>
                            </el-select>
                        </el-form-item>
                       </el-col>
                        <el-col :span="20">

                        <el-form-item prop="CityGroup">
                            <el-select 
                            v-model="VipAccountAddForm.CityGroup"
                             placeholder="请选择城市"
                             style="width:150px"
                             >
                            <el-option label="成都" value="成都"></el-option>
                            <el-option label="绵阳" value="绵阳"></el-option>
                            <el-option label="广州" value="广州"></el-option>
                            <el-option label="东莞" value="东莞"></el-option>
                            </el-select>
                        </el-form-item>
                        </el-col>
                  </el-form-item>

                  <!-- 详细地址 -->
                    <el-form-item label="详细地址" prop="Address" style="width:350px">
                        <el-input v-model="VipAccountAddForm.Address"></el-input>
                    </el-form-item>

                  <!-- 邮政编码 -->
                    <el-form-item label="邮政编码" prop="PostalCode" style="width:350px">
                        <el-input v-model="VipAccountAddForm.PostalCode"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">添加用户</el-button>
                        <el-button @click="resetForm()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入工具函数
    import { IpNumReg , PhoneNumReg, TelNumReg ,EmailReg} from "@/utils/reg";

    //引入会员模块api文件
    import {VipAccountAdd} from "@/api/vipaccount"

    export default {
        data(){
            const VerifyIpNum = (rule,value,callback) => {//身份证验证
                
                let IpNumLen = value.length;
                  if(value === ""){
                     callback(new Error("请输入身份证号"));
                  }else if(!IpNumReg(value)){
                      callback(new Error("身份证号为 15 或 17 位数字后x后缀"));
                  }else{
                      callback();
                  }
                
            }
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
                VipAccountAddForm:{
                    RealName:"",//真实姓名
                    VipCardNum:"",//会员卡号
                    AccountGroup:"",//用户组
                    IpNum:"",//身份证号
                    Status:"",//状态
                    PhoneNum:"",//手机号码
                    TelNum:"",//座机号码
                    EmailAddress:"",//邮箱地址
                    ProvinceGroup:"",//省份
                    CityGroup:"",//城市
                    Address:"",//地址
                    PostalCode:""//邮政编码
                },
                rules:{
                    RealName:[
                        { required: true, message: '请输入真实姓名', trigger: 'blur' },
                        { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
                    ],
                    VipCardNum:[
                        { required: true, message: '请输入会员卡卡号', trigger: 'blur' },
                        { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
                    ],
                    AccountGroup:[
                        { required: true, message: '请选择用户组', trigger: 'change' }
                    ],
                    IpNum:[
                        { required: true, validator:VerifyIpNum, trigger: 'blur' }
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
                    ],
                    ProvinceGroup:[
                        { required: true, message: '请选择省份组', trigger: 'change' }
                    ],
                    CityGroup:[
                        { required: true, message: '请选择城市组', trigger: 'change' }
                    ],
                    Address:[
                        { required: true, message: '请输入详细地址', trigger: 'blur' },
                        { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
                    ],
                    PostalCode:[
                        { required: true, message: '请输入邮政编码', trigger: 'blur' },
                        { min: 6, max: 7, message: '长度在 6 到 7 个数字', trigger: 'blur' }
                    ] 
                }
            }
        },
        methods:{
           submitForm(){
                 this.$refs.VipAccountAddForm.validate( (valid) => {
                     if(valid){

                         //收集参数
                         let params = {
                             RealName : this.VipAccountAddForm.RealName,
                             VipCardNum : this.VipAccountAddForm.VipCardNum,
                             AccountGroup : this.VipAccountAddForm.AccountGroup,
                             IpNum : this.VipAccountAddForm.IpNum,
                             Status : this.VipAccountAddForm.Status,
                             PhoneNum : this.VipAccountAddForm.PhoneNum,
                             TelNum: this.VipAccountAddForm.TelNum,
                             EmailAddress: this.VipAccountAddForm.EmailAddress,
                             ProvinceGroup: this.VipAccountAddForm.ProvinceGroup,
                             CityGroup: this.VipAccountAddForm.CityGroup,
                             Address: this.VipAccountAddForm.Address,
                             PostalCode: this.VipAccountAddForm.PostalCode
                         }

                          VipAccountAdd(params)
                          .then(res=> {
                              //接收响应参数
                              let {code,reason} = res;
                              
                              //判断
                              if(code === 0){//成功
                                 this.$message({
                                     type:"success",
                                     message:reason
                                 })

                                 //跳转到用户管理
                                 this.$router.push("/home/vipaccountmanage");

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
           },
           resetForm(){
                this.$refs.VipAccountAddForm.resetFields();
           }
        }
    }
</script>

<style lang="less">
    .vipaccount-add{
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