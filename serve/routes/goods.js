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

//解决跨域问题
router.all("*" , (req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "authorization "); // 允许携带这个头部信息
    next();//放行
})
//商品添加
router.post("/goodsadd",(req,res) => {

    //接收请求参数
    let {GoodsClassify,GoodsBarCode,GoodsName,SellPrice,MarketPrice,PurchasePrice,
        StockNum,GoodsWeight,GoodsUnit,discounts,IsPromotion,goodsdesc} = req.body;

    //准备sql
    let sqlStr = `insert into goods(GoodsClassify,GoodsBarCode,GoodsName,SellPrice,MarketPrice,PurchasePrice,
    StockNum,GoodsWeight,GoodsUnit,discounts,IsPromotion,goodsdesc) values(?,?,?,?,?,?,?,?,?,?,?,?)`;

    let sqlParams = [GoodsClassify,GoodsBarCode,GoodsName,SellPrice,MarketPrice,PurchasePrice,
        StockNum,GoodsWeight,GoodsUnit,discounts,IsPromotion,goodsdesc]

    //执行sql
    connection.query(sqlStr ,sqlParams, (err,data) => {
         if(err) throw err;

         if(data.affectedRows > 0){//成功
             res.send({code:0,reason:"添加商品成功"});
         }else{//失败
             res.send({code:1,reason:"添加商品失败"});
         }
    })
})

//渲染页面 -- 分页
router.get("/getgoodsdata", (req,res) => {

     //接收请求参数
     let {pageSize,currentPage,classify,keyword} = req.query;
     //总数据条数
     let total;
     //准备sql
     let sqlStr = `select * from goods where 1=1`;

     //判断 -- 高级查询
     //拼接sql -- 分类为空和为全部分类 -- 都是查询全部
    if(classify !== "" && classify !== "全部分类"){
       sqlStr += ` and GoodsClassify='${classify}'`;
    }

    //拼接sql
    if(keyword !== ""){
        sqlStr += ` and (GoodsClassify like '${keyword}' or GoodsBarCode like '${keyword}')`
    }

     //排序
     sqlStr += ` order by ctime desc`;

     //执行sql
     connection.query(sqlStr , (err,data) => {
        if(err) throw err;
        total = data.length;//数据总条数
    })
    
     //拼接sql
     let n = (currentPage - 1) * pageSize;//跳过多少条
     sqlStr += ` limit ${n} , ${pageSize}`;
     
     //执行sql
     connection.query(sqlStr ,(err,data) => {
        if(err) throw err;
        res.send({total,data});
     })
})

//删除数据
router.get("/datadel", (req,res) => {
    //接收请求参数
    let {id} = req.query;

    //准备sql
    let sqlStr = `delete from goods where id=${id}`;
    //执行sql
    connection.query(sqlStr , (err,data) => {
        if(err) throw err;

        //判断
        if(data.affectedRows > 0){
           res.send({code:0,reason:"删除成功"})
        }else{
           res.send({code:1,reason:"删除失败"})
        }
    })
})

//批量删除
router.get("/batchdatadel" , (req,res) => {

    //接收请求参数
    let {idArr} = req.query;
    
    //准备sql
    let sqlStr = `delete from goods where id in (${idArr})`;

    //执行sql
    connection.query(sqlStr , (err,data) =>{
         if(err) throw err;

         if(data.affectedRows > 0){//删除成功
             res.send({code:0,reason:"批量删除成功"});
         }else{//删除失败
             res.send({code:1,reason:"批量删除失败"});
         }
    })
})

//编辑
router.post("/editdata" , (req,res) => {
    let {id} = req.body;

    //准备sql
    let sqlStr = `select * from goods where id=${id}`;
    //执行sql
    connection.query(sqlStr , (err,data) => {
         if(err) throw err;
         //将当前数据发给前端
         res.send({data});
    })
})

//保存数据
router.post("/saveData" , (req,res) => {
   let {GoodsName,GoodsClassify,SellPrice,IsPromotion,MarketPrice,id} = req.body;
    
   //准备sql
   let sqlStr = `update goods set GoodsName='${GoodsName}',GoodsClassify='${GoodsClassify}',
   SellPrice='${SellPrice}',IsPromotion='${IsPromotion}',MarketPrice='${MarketPrice}' where id=${id}`;

   //执行sql
   connection.query(sqlStr , (err,data) => {
       if(err) throw err;

       if(data.affectedRows > 0){
           res.send({code:0,reason:"修改商品成功"});
       }else{
           res.send({code:1,reason:"修改商品失败"});
       }
   }) 
})
module.exports = router;