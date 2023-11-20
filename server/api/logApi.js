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
// GET 请求
router.post('/getLog', (req, res) => {
    let sql = $sql.log.get;
    let params = req.body;
    console.log(params);

    conn.query(sql,[params.name], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    });
});
module.exports = router;
