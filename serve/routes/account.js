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
router.all("*", (req,res,next) => {
     res.header("Access-Control-Allow-Origin","*");
     res.header("Access-Control-Allow-Headers", "authorization "); // 允许携带这个头部信息
     next();//放行
})
 
//账号添加
router.post("/accountadd" , (req,res) => {
    //接收参数
     let { account , password , userGroup } = req.body;

     //添加默认头像
     let avatarUrl = `/upload/portrait.jpg`;

    //准备sql
    let sqlStr = `insert into accounts(account , password , userGroup , avatarUrl) values('${account}','${password}','${userGroup}','${avatarUrl}')`;//添加数据
    
    //执行sql
    connection.query(sqlStr , (err,data) => {
        if(err) throw err;

        if(data.affectedRows > 0){
            res.send({ code:0, reason:"添加用户成功"})
        }else{
            res.send({ code:1, reason:"添加用户失败"})
        }
    })
})

//账号添加 -- 查看是否相同用户名
router.get("/isaccountexist" , (req,res) => {
    //接收请求参数
    let {account} = req.query;

    //准备sql
    let sqlStr = `select * from accounts where account='${account}'`;
    //执行sql
    connection.query(sqlStr, (err,data) => {
         if(err) throw err;
         console.log(data.length);
         if(data.length){ // 0 是不存在 1存在
            res.send({code:1,reason:"该用户已存在"})
        }else{
            res.send({code:0,reason:"该用户可以使用"})
         }
    })
})

//账号管理 -- 数据渲染
router.get("/refresh", (req,res) => {
    
    //准备sql
    let sqlStr = `select * from accounts order by ctime desc`;//查询所有数据
    
    //执行sql
    connection.query(sqlStr , (err,data) => {
        if(err) throw err;

        //返回所有数据
        res.send( {data} )
    })
    
})

//删除数据
router.get("/deletedata",(req,res) => {

    //接收参数
    let {id} = req.query;

    //准备sql
    let sqlStr = `delete from accounts where id=${id}`;
    //执行sql
    connection.query(sqlStr , (err,data) => {
         if(err) throw err;

         if(data.affectedRows > 0){
              res.send({code:0,reason:"删除用户成功"})
         }else{
              res.send({code:1,reason:"删除用户失败"})
         }

    }) 

})

//编辑数据 -- 数据回填
router.get("/accountedit" , (req,res) => {
      //接收请求参数
      let {id} = req.query;
      
      //准备sql
      let sqlStr = `select * from accounts where id=${id}`;

      //执行sql
      connection.query(sqlStr, (err ,data) => {
          if(err) throw err;

          res.send({data});//返回数据
      })

})

//编辑数据 -- 改变数据
router.post("/changedata" , (req,res) => {
    //接收请求参数
    let {account,userGroup,id} = req.body;
     
    //准备sql
    let sqlStr = `update accounts set account='${account}' , userGroup='${userGroup}' where id=${id}`;

    //执行sql
    connection.query(sqlStr , (err,data) => {
        if(err) throw err;

        if(data.affectedRows > 0){
            res.send({code:0,reason:"修改账户成功"});
        }else{       
            res.send({code:1,reason:"修改账户失败"});
        }
    })

})

//删除选中的数据
router.get("/batchdel" , (req,res) => {

    //接收请求参数
    let {IdArr} = req.query; //IdArr是个数组

    //准备sql
    let sqlStr = `delete from accounts where id in (${IdArr})`;

    //执行sql
    connection.query(sqlStr , (err,data) => {
        if(err) throw err;

        //判断
        if(data.affectedRows > 0){//删除成功
            res.send({ code: 0 , reason: "批量删除成功"});
        }else{//删除失败
            res.send({ code: 1 , reason: "批量删除失败"});
        }
    })
})

//分页
router.get("/getdatabypage" , (req,res) => {
    
    //接收请求参数
    let {pageSize,currentPage} = req.query;
     
    //数据总条数
    let total;
    //准备sql
    let sqlStr = `select * from accounts order by ctime desc`;
    //执行sql
    connection.query(sqlStr , (err,data) => {
        if(err) throw err;
        
        total = data.length;//数据总条数
    })
    
    //拼接sql
    let n = (currentPage - 1) * pageSize;//跳过多少条
    sqlStr += ` limit ${n} , ${pageSize}`;
    
    //执行sql
    connection.query(sqlStr , (err,data) => {//data就是当前页的数据
        if(err) throw err;
        //响应数据给前端
        res.send({total,data})
    })
})

//验证旧密码
router.post("/checkoriginpass" , (req,res) => {

    let {originPass} = req.body;

    let password = req.user.password;

    //判断
    if( originPass === password ){
       res.send({code:0,reason:"原密码正确"});
    }else{
       res.send({code:1,reason:"原密码错误"});
    }
})

//修改密码
router.post("/editpassword" , (req,res) => {
    //接收请求参数
    let {newPass} = req.body;

    let id = req.user.id;

    //准备sql
    let sqlStr = `update accounts set password='${newPass}' where id=${id}`;

    //执行sql
    connection.query(sqlStr , (err,data) => {
        if(err) throw err;

        if(data.affectedRows > 0){
            res.send({code:0,reason:"修改密码成功,请重新登录!!!"});
        }else{
            res.send({code:1,reason:"修改密码失败"});
        }
    })
})

//获取当前用户
router.get("/getaccount", (req,res) => {

    let id = req.user.id;//获取当前用户id

    //准备sql
    let sqlStr = `select * from accounts where id=${id}`;
    //执行sql
    connection.query(sqlStr , (err,data) => {
         if(err) throw err;

         res.send({data});
    })
})

/* -----上传开始---- */ 
// 引入node上传模块
var multer = require('multer');

// 配置存储路径 和 重命名
var storage = multer.diskStorage({
    // 图片上传到服务器以后 要放置的路径
    destination: 'public/upload',

    // 图片重命名
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
});

// 上传对象
var upload = multer({
    storage,
});

router.post('/uploadavatar', upload.single('file'), (req, res) => {
    // 接收到的文件信息
	var file = req.file;
	
	// 文件名
    let fileName = file.filename;
	// 拼接文件路径
	let avatarUrl = '/upload/' + fileName

	// 构造sql
	const sqlStr = `update accounts set avatarUrl = '${avatarUrl}' where id=${req.user.id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: "上传成功", avatarUrl})
		} else {
			res.send({code: 1, reason: "上传失败"})
		}
    })
})
/* -----上传结束---- */ 

router.get("/accountrole" , (req,res) => {
    
    let role = req.user.userGroup;

     res.send({role})
})
module.exports = router;
