// 测试用 api 实例
const models = require('../db');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../sqlMap');
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
router.post('/getStatus', (req, res) => {
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
// 根据status 获取 日志列表
router.post('/getLogByStatus', (req, res) => {
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

module.exports = router;
