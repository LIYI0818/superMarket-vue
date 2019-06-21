<template>
    <div class="home">
         <el-container>
            <!-- 左侧导航组件 -->
            <LeftNav></LeftNav>
            <el-container>
                <el-header>
                <!-- 右侧头部 -->
                   <RightHeader ref="RightHeader"></RightHeader>
               </el-header>
                <el-main>
                     <!-- 路由出口 -->
                    <router-view @uploadcurrent="fn"></router-view>
                </el-main>
                <!-- 右侧页脚 -->
                <el-footer>
                     <RightFooter></RightFooter>
                </el-footer>
            </el-container>
         </el-container>
         
    </div>
</template>

<script>
    //引入左侧导航组件
    import LeftNav from "@/components/LeftNav/LeftNav.vue";
    //引入右侧头部组件
    import RightHeader from "@/components/RightHeader/RightHeader.vue";
    //引入右侧尾部组件
    import RightFooter from "@/components/RightFooter/RightFooter.vue";
    export default {
         components : {
             LeftNav,
             RightHeader,
             RightFooter
         },
         methods:{
             fn(){
                 this.$refs.RightHeader.getUserInfo();
             }
         }
    }
</script>

<style lang="less">
    .home{
        height: 100%;
        .el-container{
            height: 100%;
        }
        .el-header{
            line-height: 60px;
            
        }
        .el-main {
            color: #333;
        }
        .el-footer{
            line-height: 58px;
        }
    }
</style>