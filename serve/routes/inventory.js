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
router.all("*",(req,res,next) => {
   res.header("Access-Control-Allow-Origin","*");
   res.header("Access-Control-Allow-Headers", "authorization "); // 允许携带这个头部信息
   next();
})
//添加库存
router.post("/goodsaddinventory" , (req,res) => {
    //接收请求参数
    let {GoodsBarCode,GoodsName,GoodsNum,PurchasePrice,classify} = req.body;

    //准备sql
    let sqlStr = `insert into inventory(GoodsBarCode,GoodsName,GoodsNum,PurchasePrice,classify) 
    values('${GoodsBarCode}','${GoodsName}','${GoodsNum}','${PurchasePrice}','${classify}')`;


    
    //执行sql
    connection.query(sqlStr , (err,data) => {
         if(err) throw err;

         if(data.affectedRows > 0){
            res.send({code:0,reason:"添加商品入库成功"});
         }else{
            res.send({code:1,reason:"添加商品入库失败"});
         }
    })
})

//根据当前页获取数据
router.get("/getinventorydatabypage",(req,res) => {
     //接收请求参数
     let {pageSize,currentPage,classify,keyword} = req.query;
     //数据总条数
     let total;

     //准备sql
     let sqlStr = `select * from inventory where 1=1`;

     //判断
     if(classify !== "" && classify !== "全部分类"){
         sqlStr += ` and classify='${classify}'`;
     }

     if(keyword !== ""){
         sqlStr += ` and (classify like '${keyword}' or GoodsName like '${keyword}')`;
     }

     //倒序
     sqlStr += ` order by ctime desc`;

     //执行sql
      connection.query(sqlStr , (err,data) => {
          total = data.length;//数据总条数
      })

      //拼接sql
      let n = (currentPage - 1) * pageSize;//跳过多少条数据
      sqlStr += ` limit ${n}, ${pageSize}`;
   
    //   //执行sql
      connection.query(sqlStr , (err,data) => {
           if(err) throw err;

           res.send({ total , data })
      })

    
})

//删除数据
router.get("/deldata" , (req,res) => {
    //接收请求参数
    let {id} = req.query;

    //准备sql
    let sqlStr = `delete from inventory where id=${id}`;
    //执行sql
    connection.query(sqlStr , (err,data) => {
        if(err) throw err;

        if(data.affectedRows > 0){
            res.send({code:0,reason:"删除商品库存成功"});
        }else{
            res.send({code:1,reason:"删除商品库存失败"});
        }
    })
}) 

//批量删除
router.get("/batchdatadel" , (req,res) => {
    
    //接收请求参数
    let {idArr} = req.query;

    //准备sql
    let sqlStr = `delete from inventory where id in (${idArr})`;

    //执行sql
    connection.query(sqlStr , (err,data) => {
         if(err) throw err;

         //判断
         if(data.affectedRows > 0){//成功
             res.send({code:0,reason:"批量删除成功"});
         }else{//失败
             res.send({code:1,reason:"批量删除失败"});
         }
    })
})

//编辑 -- 获取数据
router.get("/getinventorydata" , (req,res) => {

    //接收请求参数
    let {id} = req.query;

    //准备sql
    let sqlStr = `select * from inventory where id=${id}`;

    //执行sql
    connection.query(sqlStr , (err,data) => {
        if(err) throw err;

        //将数据发给前端
        res.send({data})
    })
    
})

//编辑 -- 保存数据
router.post("/saveinventorydata" , (req,res) => {
    //接收请求参数
    let {GoodsName,GoodsNum,PurchasePrice,editId} = req.body;

    //准备sql
    let sqlStr = `update inventory set GoodsName='${GoodsName}',
    GoodsNum='${GoodsNum}' ,PurchasePrice='${PurchasePrice}' where id=${editId}`;

    //执行sql
    connection.query(sqlStr , (err,data) => {
         if(err) throw err;

         //判断
         if(data.affectedRows > 0){
             res.send({code:0,reason:"编辑商品库存成功"});
         }else{
             res.send({code:1,reason:"编辑商品库存失败"});
         }
    })
})

module.exports = router;