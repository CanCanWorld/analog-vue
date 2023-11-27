// 测试用 api 实例
const models = require('../db');
const express = require('express');
const app = express();
const mysql = require('mysql');
const $sql = require('../sqlMap');
const ws = require('express-ws')
const expressWs = ws(app)
// 连接数据库
const conn = mysql.createConnection(models.mysql);
conn.connect();
const jsonWrite = (res, ret) => {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败',
        });
    } else {
        res.json(ret);
    }
};
// 获取日志中的status
app.post('/getStatus', (req, res) => {
    let sql = $sql.log.getStatus;
    console.log("request: ", "/getStatus")
    console.log('body: ', req.body)
    console.log('sql: ', sql)
    conn.query(sql, [], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    });
});
// 获取日志中的normal
app.post('/getNormal', (req, res) => {
    let sql = $sql.log.getNormal;
    console.log("request: ", "/getNormal")
    console.log('body: ', req.body)
    console.log('sql: ', sql)
    conn.query(sql, [], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    });
});
// 获取日志中的request
app.post('/getRequest', (req, res) => {
    let sql = $sql.log.getRequest;
    console.log("request: ", "/getRequest")
    console.log('body: ', req.body)
    console.log('sql: ', sql)
    let startTime = req.body.startTime
    let endTime = req.body.endTime
    if (startTime === undefined) startTime = '1970-01-01'
    if (endTime === undefined) endTime = '2099-01-01'
    conn.query(sql, [startTime, endTime], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    });
});
// 根据status 获取 日志列表
app.post('/getLogByStatus', (req, res) => {
    let sql = $sql.log.getLog;
    console.log("request: ", "/getLogByStatus")
    console.log('body: ', req.body)
    const status = req.body.status
    let result = ""
    status.forEach((item, index) => {
        if (index === 0) {
            result = " where status=" + item
        } else {
            result += " or status=" + item
        }
    })
    const targetSql = sql + result
    console.log('sql: ', targetSql)
    conn.query(targetSql, [], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    });
});
// 根据日期范围 获取 日志列表
app.post('/getLogByTime', (req, res) => {
    let sql = $sql.log.getLog;
    console.log("request: ", "/getLogByTime")
    console.log('body: ', req.body)
    const startTime = req.body.startTime
    const endTime = req.body.endTime
    if (startTime !== undefined && endTime !== undefined)
        sql += " where time_local between '" + startTime + "' and '" + endTime + "'"
    console.log('sql: ', sql)
    conn.query(sql, [], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    });
});
// 根据normal 获取 日志列表
app.post('/getLogByNormal', (req, res) => {
    let sql = $sql.log.getLog;
    console.log("request: ", "/getLogByNormal")
    console.log('body: ', req.body)
    const normal = req.body.normal
    let result = ""
    normal.forEach((item, index) => {
        if (index === 0) {
            result = " where normal=" + item
        } else {
            result += " or normal=" + item
        }
    })
    const targetSql = sql + result
    console.log('sql: ', targetSql)
    conn.query(targetSql, [], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    });
});
// 根据 安全类型 获取 日志列表
app.post('/getLogBySafeType', (req, res) => {
    let sql = $sql.log.getLog;
    console.log("request: ", "/getLogBySafeType")
    console.log('body: ', req.body)
    const type = req.body.type
    let result = ""
    type.forEach((item, index) => {
        if (index === 0) {
            result = " where " + item + "=1"
        } else {
            result += " or " + item + "=1"
        }
    })
    const targetSql = sql + result
    console.log('sql: ', targetSql)
    conn.query(targetSql, [], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    });
});
let columnCount = 0
let timer = null
app.ws("/socket", (ws, req) => {
    // ws:websocket 实例，该实例可以监听来自客户端的消息发送事件
    // req:浏览器请求实例
    // 使用定时器不停的向客户端推动消息
    timer && clearTimeout(timer)
    timer = setInterval(() => {
        // ws.send("发送数据");
        conn.query($sql.log.getColumn, [], (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result) {
                if (columnCount !== result[0].count) {
                    ws.send("新增数据：" + (result[0].count - columnCount) + "条")
                    columnCount = result[0].count
                    console.log('数据发生改变columnCount: ', columnCount);
                } else {
                    console.log('没有数据改变')
                }
            }
        });
    }, 5000);

    // 监听断开连接
    ws.on("close", () => {
        console.log("本次连接已关闭");
        clearInterval(timer);
        timer = null;
    });

    // 监听浏览器发来的数据
    ws.on("message", (res) => {
        if (res === 'ping') {
            ws.send('pong')
            return
        }
        console.log("收到浏览器非心跳数据：" + res)
    });
});
// 启动服务器，端口设置为3000
app.listen(250, (err) => {
    if (!err) {
        console.log("服务器启动成功，监听端口3000");
    }
});
module.exports = app;
