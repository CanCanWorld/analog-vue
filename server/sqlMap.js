// todo sql 语句留后面调用
module.exports = {
    log: {
        // ? 占位符 后面给数据自动填充
        add: 'insert into weblog(id,name, age) values(?,?, ?)',
        get: "select * from weblog",
    },
};
