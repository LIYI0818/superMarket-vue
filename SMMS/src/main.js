import Vue from 'vue'
import App from './App.vue'
import router from './router'

import "./assets/reset.css"//引入重置样式
import "./assets/common.css"//引入共用样式

import ElementUI from 'element-ui'; // 引入JS组件
import 'element-ui/lib/theme-chalk/index.css'; // 引入css样式

import Echarts from "echarts";//引入echarts

import local from "@/utils/local"

//将echarts挂在vue原型上
Vue.prototype.$echarts = Echarts;


//路由守卫 -- 拦截所有路由
router.beforeEach( (to,from,next) => {
    //获取token
    let token = local.get("user_token");

    //判断
    if(token){//如果有令牌，放行
       next()
    }else{
       if(to.path === "/login"){ //如果去登录页面 -- 放行
          next();
       }else{//如果去其他页面 -- 直接跳转到登录页面
          next({path:"/login"})
       }
    }
})

Vue.use( ElementUI )//注册

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
