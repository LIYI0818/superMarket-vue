var express = require('express');
var router = express.Router();

//引入mysql
const mysql = require('mysql');

//创建连接对象
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"smms"
})

//执行连接方法
connection.connect();
console.log("mysql连接成功")
//暴露连接对象
module.exports = connection;


