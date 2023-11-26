<template>
    <div>
        <el-table
                :data="logs.slice((page-1)*limit, page*limit)"
                style="width: 100%">
            <el-table-column
                    prop="remote_addr"
                    label="remote_addr"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="remote_user"
                    label="remote_user"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="time_local"
                    :show-overflow-tooltip="true"
                    label="time_local">
            </el-table-column>
            <el-table-column
                    prop="request"
                    :show-overflow-tooltip="true"
                    label="request">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="status">
            </el-table-column>
            <el-table-column
                    prop="body_bytes_sent"
                    label="body_bytes_sent">
            </el-table-column>
            <el-table-column
                    prop="http_referer"
                    :show-overflow-tooltip="true"
                    label="http_referer">
            </el-table-column>
            <el-table-column
                    prop="http_user_agent"
                    :show-overflow-tooltip="true"
                    label="http_user_agent">
            </el-table-column>
            <el-table-column
                    prop="http_x_forwarded_for"
                    label="http_x_forwarded_for">
            </el-table-column>
        </el-table>
        <el-pagination
                background
                :current-page="page"
                :page-size="limit"
                :pager-count="11"
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="logs.length">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: "LogTable",
    props: ["logs", "page", "limit"],
    methods:{
        handleCurrentChange(page) {
            console.log('page: ', page)
            this.page = page;
        },
    }
}
</script>

<style scoped>

</style>
