var express = require('express');
var router = express.Router();

let connection = require("./js/mysql");//引入操作mysql模块

/* -----  拦截所有请求 请求中必须携带token（令牌才响应数据 否则响应错误信息）-------- */ 
const expressJwt = require('express-jwt'); // 引入检查token的模块
const secret = 'itsource';  // 秘钥

// 检查token合法性 如果不合法 就会抛出错误哦
router.use(expressJwt ({
    secret
}).unless({
    path: ['/login/checklogin']  // 不需要验证的请求url
}))

//拦截器
router.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {   
        // 响应错误状态码 和 错误信息
        res.status(401).send('token无效，你的请求要携带正确的token才能获取到数据哦！');
    }
})
/*------ 拦截请求结束 ------*/

//解决跨域
router.all("*", (req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "authorization "); // 允许携带这个头部信息
    next();//放行
})
//添加会员
router.post("/vipaccountadd" , (req,res) => {

    let {RealName,VipCardNum,AccountGroup,IpNum,Status,PhoneNum,TelNum,EmailAddress,ProvinceGroup,CityGroup,Address,PostalCode} = req.body;

    //准备sql
    let sqlStr = `insert into vipaccount(RealName,VipCardNum,AccountGroup,IpNum,Status,PhoneNum,TelNum,
        EmailAddress,ProvinceGroup,CityGroup,Address,PostalCode) values(?,?,?,?,?,?,?,?,?,?,?,?)`;
    let sqlParams = [RealName,VipCardNum,AccountGroup,IpNum,Status,PhoneNum,TelNum,EmailAddress,ProvinceGroup,CityGroup,Address,PostalCode]
    //执行sql
    connection.query(sqlStr ,sqlParams, (err,data) => {
        if(err) throw err;

        //判断
        if(data.affectedRows > 0){//成功
            res.send({code:0,reason:"会员添加成功"});
        }else{//失败
            res.send({code:1,reason:"会员添加失败"});
        }
    })
})

//分页
router.get("/getvipdatabypage" , (req,res) => {
   //接收请求参数
   let {pageSize,currentPage} = req.query;
   
   //数据总条数
   let total;

   //准备sql
   let sqlStr = `select * from vipaccount order by ctime desc`;

   //执行sql
   connection.query(sqlStr , (err,data) => {
        total = data.length;//数据总条数
   })
   
   //拼接sql
   let n = (currentPage - 1) * pageSize;
   sqlStr += ` limit ${n} , ${pageSize}`;

   //执行sql
   connection.query(sqlStr, (err,data) => {
        if(err) throw err;

        res.send({total,data})
   })
})


//删除
router.get("/deletevipdata" , (req,res) => {
     //接收请求参数
     let {id} = req.query;

     //准备sql
     let sqlStr = `delete from vipaccount where id=${id}`;

     //执行sql
     connection.query( sqlStr , (err,data) => {
          if(err) throw err;

          if(data.affectedRows > 0){
             res.send({code:0,reason:"删除会员数据成功"});
          }else{
             res.send({code:1,reason:"删除会员数据失败"});
          }
     })
})

//编辑 -- 数据回填
router.get("/editvipdata" , (req,res) => {

    //接收请求参数
    let {id} = req.query;

    //准备sql
    let sqlStr = `select * from vipaccount where id=${id}`;

    //执行sql
    connection.query(sqlStr ,(err,data) =>{
        res.send({data});
    })
})

//编辑 -- 保存数据
router.post("/savevipeditdata",(req,res) => {
    //接收请求参数
    let {VipCardNum,RealName,AccountGroup,Status,PhoneNum,TelNum,EmailAddress,editId} = req.body;

    //准备sql
    let sqlStr = `update vipaccount set VipCardNum='${VipCardNum}',RealName='${RealName}'
    ,AccountGroup='${AccountGroup}',Status='${Status}',PhoneNum='${PhoneNum}',TelNum='${TelNum}',
    EmailAddress='${EmailAddress}' where id=${editId}`;

    //执行sql
    connection.query(sqlStr , (err,data) => {
         if(err) throw err;

         if(data.affectedRows > 0){
            res.send({code:0,reason:"编辑会员信息成功"});
         }else{
            res.send({code:1,reason:"编辑会员信息失败"});
         }
    })
})

//批量删除
router.get("/bacthdeletevipdata" , (req,res) => {

    //接收请求参数
    let {IdArr} = req.query;

    //准备sql
    let sqlStr = `delete from vipaccount where id in (${IdArr})`;

    //执行sql
    connection.query(sqlStr , (err,data) => {
        if(err) throw err;
 
        if(data.affectedRows > 0){
           res.send({code:0,reason:"批量删除成功"});
        }else{
           res.send({code:1,reason:"批量删除失败"});
        }
    })
})


module.exports = router;