// todo sql 语句留后面调用
module.exports = {
    log: {
        getLog: "select * from weblog",
        getStatus: "select status, count(status) as count from weblog group by status",
        getRequest: "select request, count(request) as count from weblog where time_local between ? and ? group by request ORDER BY count DESC",
        getNormal: "select normal, count(normal) as count from weblog group by normal",
        getColumn: "select count(*) as count from weblog"
    },
};
