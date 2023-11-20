// 使用 express 创建服务器
// 导入 express 模块
const express = require('express');
// 调用 express 函数，返回一个数据库实例
const app = express();
// 导入路由模块
const logApi = require('./api/logApi');
// 端口号
const port = 8888;
// 注册全局解析中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 注册路由模块
app.use('/api/log', logApi);
// 调用 app.listen() 启动服务器
app.listen(port, () => console.log(`Example app listening on port 8888!`));

