<template>
    <div class="personal">
       <h1>个人中心</h1>
       <div class="info">
            <p>用户名：{{userInfo.account}}</p>
            <p>用户组：{{userInfo.userGroup}}</p>
            <p>创建时间：{{userInfo.ctime | filterCtime}}</p>
       </div>
       <div>
           <el-upload
            class="avatar-uploader"
            action="#"
            :http-request="uploadAvatar"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
       </div>
       <h2>上传头像</h2>
    </div>
</template>

<script>
    //引入用户管理api文件
    import {GetAccount} from "@/api/account";
    //引入时间格式化模块
    import moment from "moment";

    //引入axios
    import axios from "axios";
    export default {
        data(){
            return {
                userInfo:{
                    account:"",
                    password:"",
                    userGroup:"",
                    ctime:""
                },
                imageUrl:""//图片地址
            }
        },
        methods:{
            GetAccountInfo(){
                GetAccount()
                 .then(res => {
                     let {data} = res;
                     
                     //渲染页面
                     this.userInfo = data[0];

                 })
                 .catch(err => {
                     console.log(err)
                 })
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            uploadAvatar(file){
                //创建formData实例对象
                let formData = new FormData();

                formData.append("file",file.file);

                axios.post("/account/uploadavatar",formData)
                  .then( response => {

                     //接收响应参数
                     let {code,reason,avatarUrl} = response.data;
                     
                     if(code === 0){
                        this.$message({
                            type:"success",
                            message:reason
                        })
                        
                        //回填
                        this.imageUrl = "http://127.0.0.1:5000" + avatarUrl;

                        //传递给父组件
                        this.$emit("uploadcurrent")

                     }else if(code === 1){
                        this.$message.error(reason)
                     }
                  })
                  .catch( err => {
                     console.log(err);
                  })
            }
              
        },
        created(){
            this.GetAccountInfo();
        },
        filters:{
            filterCtime(ctime){
               return moment(ctime).format("YYYY-MM-DD HH-mm-ss")
            }
        }
    }
</script>

<style lang="less">
    .personal{
       .info{
           line-height: 40px;
           margin-top:20px;
       }
       .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
    }
</style>