<template>
    <div class="right-header">
        
        <el-row>
            <el-col :span="12"><h2 class="title"><i class="el-icon-menu"></i>华联超市管理系统</h2></el-col>
            <el-col :span="12">
                <el-row>
                     <el-col :span="18">
                        <el-dropdown @command="handleCommand">
                            <span class="el-dropdown-link">
                                {{account}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                                <el-dropdown-item command="logout">退出系统</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                     </el-col>
                     <el-col :span="6">
                         <div class="portrait">
                             <img :src="avatarUrl" alt="">
                        </div>
                     </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    //引入本地存储封装
    import local from "@/utils/local";
    //引入用户管理api文件
    import {GetAccount} from "@/api/account";
    export default {
        data(){
            return {
                account:"",
                avatarUrl:""
            }
        },
        methods:{
            handleCommand(command){
               if(command === "logout"){//退出系统
                //删除token
                local.remove("user_token");
                //弹出提示框
                this.$message({
                    type:"success",
                    message:"成功退出系统！！！"
                })
                //跳转到登录页面
                setTimeout( () => {
                    this.$router.push("/login");
                },1000)
                

               }else if(command === "personal"){//个人中心
                   //跳转到个人中心
                   this.$router.push("/home/personal")
               }
            },
            getUserInfo(){
               GetAccount()
                .then(res => {
                    //接收响应参数
                    let {data} = res;

                    let {account,avatarUrl} = data[0];
                    
                    this.account = account;//渲染用户

                    //渲染头像地址
                    this.avatarUrl = "http://127.0.0.1:5000" + avatarUrl;
                })
                .catch(err => {
                    console.log(err)
                })
            }
            
        },
        created(){
            this.getUserInfo()
        }
    }
</script>

<style lang="less">
      .right-header{
           border-bottom: 1px solid rgb(48, 65, 86);
           & > .title{
               color:rgb(48, 65, 86);
               font-size:22px;
            }
           
           .el-row{
               .el-col{
                   .el-row{
                       .el-col:first-child{
                           text-align:right;
                       }
                       .el-col:last-child{
                           .portrait{
                                width:50px;
                                height: 50px;
                                background:yellowgreen;
                                margin:5px 0 0 20px;
                                border-radius: 50%;
                                img{
                                    border-radius: 50%;
                                    width:100%;
                                    height:100%;
                                }
                            }
                       }
                   }
               }
           }
      }
</style>