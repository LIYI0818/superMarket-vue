<template>
    <div class="leftnav">
          <el-aside width="200px">
            <div class="title">
                <i class="el-icon-menu"></i>
                华联超市管理系统
            </div>
            <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            unique-opened
            background-color = "rgb(48, 65, 86)"
            text-color = "#fff"
            router
            >
            <el-submenu :index="(index + 1) + ''" v-for="(menu,index) in menus" :key="index">
                <template slot="title">
                <i :class="menu.iconClass"></i>
                    <span>{{menu.title}}</span>
                </template>
                <el-menu-item 
                    v-for="(subMenu,index) in menu.children" :key="index"
                    :index="subMenu.path"
                    >
                    {{subMenu.subTitle}}
                    </el-menu-item>
            </el-submenu>
            </el-menu>
          </el-aside>
    </div>
</template>

<script>

    //引入用户管理api文件
    import {accountRole} from "@/api/account";
    export default {
         data(){
             return {
                 menus : []
             }
         },
         created(){
             accountRole()
              .then(res => {
                  
                  let {role} = res;

                  let nav = [
                      { //系统管理
                         iconClass:"el-icon-s-tools",
                         title:"系统管理",
                         role:["超级管理员","普通用户"],
                         children:[
                             {
                                 path:"/home/systeminfo",
                                 subTitle:"系统信息"
                             }
                         ]
                      },
                      { //用户管理
                         iconClass:"el-icon-user-solid",
                         title:"用户管理",
                         role:["超级管理员"],
                         children:[
                             {
                                 path:"/home/accountmanage",
                                 subTitle:"用户管理"
                             },
                             {
                                 path:"/home/accountadd",
                                 subTitle:"用户添加"
                             },
                             {
                                 path:"/home/passwordmodify",
                                 subTitle:"修改密码"
                             }
                         ]
                      },
                      { //商品管理
                         iconClass:"el-icon-s-goods",
                         title:"商品管理",
                         role:["超级管理员","普通用户"],
                         children:[
                             {
                                 path:"/home/goodsmanage",
                                 subTitle:"商品管理"
                             },
                             {
                                 path:"/home/goodsadd",
                                 subTitle:"商品添加"
                             }
                         ]
                      },
                      { //统计管理
                         iconClass:"el-icon-s-order",
                         title:"统计管理",
                         role:["超级管理员"],
                         children:[
                             {
                                 path:"/home/selltotal",
                                 subTitle:"销售统计"
                             },
                             {
                                 path:"/home/stocktotal",
                                 subTitle:"出货统计"
                             }
                         ]
                      },
                      { //进货管理
                         iconClass:"el-icon-takeaway-box",
                         title:"进货管理",
                         role:["超级管理员","普通用户"],
                         children:[
                             {
                                 path:"/home/inventorymanage",
                                 subTitle:"库存管理"
                             },
                             {
                                 path:"/home/inventoryadd",
                                 subTitle:"库存添加"
                             }
                         ]
                      },
                      { //会员管理
                         iconClass:"el-icon-s-custom",
                         title:"会员管理",
                         role:["超级管理员"],
                         children:[
                             {
                                 path:"/home/vipaccountmanage",
                                 subTitle:"账号管理"
                             },
                             {
                                 path:"/home/vipaccountadd",
                                 subTitle:"账号添加"
                             }
                         ]
                      }
                  ]

                  //过滤导航
                  this.menus = nav.filter(v => v.role.includes(role));
              })
              .catch(err => {
                  console.log(err)
              })
         }
    }
</script>

<style lang="less">
    .leftnav{
        .el-aside{
          height: 100%;
          background-color: rgb(48, 65, 86);
          color: #333;
          .el-menu{
              border-right:none;
              .el-submenu{
                  .el-submenu__title{
                      i{
                          color:#fff;
                      }
                  }
              }
          }
          & > .title{
              margin:10px 0;
              color:#fff;
              font-size:16px;
              text-indent: 12px;
          }
        }
    }
        

</style>