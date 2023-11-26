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
// 获取日志中的normal
router.post('/getNormal', (req, res) => {
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
router.post('/getRequest', (req, res) => {
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
// 根据日期范围 获取 日志列表
router.post('/getLogByTime', (req, res) => {
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
router.post('/getLogByNormal', (req, res) => {
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
router.post('/getLogBySafeType', (req, res) => {
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

module.exports = router;
