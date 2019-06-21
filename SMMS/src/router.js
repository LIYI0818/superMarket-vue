import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
     {
       path:"/",
       redirect:"/login"
     },
     //登录
     {
       path:"/login",component:() => import("./views/Login/Login.vue")
     },
     //后台主页面
     {
       path:"/home",
       component : () => import("./views/Home/Home.vue"),
       redirect : "/home/systeminfo",
       children : [
          //用户管理
          {
             path:"/home/accountadd",//用户添加
             component: () => import("./views/AccountAdd/AccountAdd.vue")
          },
          {
            path:"/home/accountmanage",//用户管理
            component: () => import("./views/AccountManage/AccountManage.vue")
          },
          {
            path:"/home/passwordmodify",//密码修改
            component: () => import("./views/PasswordModify/PasswordModify.vue")
          },
          //商品管理
          {
            path:"/home/goodsmanage",//商品管理
            component: () => import("./views/GoodsManage/GoodsManage.vue")
          },
          {
            path:"/home/goodsadd",//商品添加
            component: () => import("./views/GoodsAdd/GoodsAdd.vue")
          },
          //统计管理
          {
            path:"/home/selltotal",//销售统计
            component: () => import("./views/SellTotal/SellTotal.vue")
          },
          {
            path:"/home/stocktotal",//出货统计
            component: () => import("./views/StockTotal/StockToal.vue")
          },
          //系统管理
          {
            path:"/home/systeminfo",//系统信息
            component: () => import("./views/SystemInfo/SystemInfo.vue")
          },
          //进货管理
          {
            path:"/home/inventorymanage",//库存管理
            component:() => import("./views/InventoryManage/InventoryManage.vue")
          },
          {
            path:"/home/inventoryadd",//库存添加
            component:() => import("./views/InventoryAdd/InventoryAdd.vue")
          },
          //会员管理
          {
             path:"/home/vipaccountadd",//用户添加
             component:() => import("./views/VipAccountAdd/VipAccountAdd.vue")
          },
          {
            path:"/home/vipaccountmanage",//用户管理
            component:() => import("./views/VipAccountManage/VipAccountManage.vue")
          },
          //个人中心
          {
             path:"/home/personal",
             component:() => import("./views/Personal/Personal.vue")
          }
       ]
     }
  ]
})
