<template>
  <div class="table-box">
    <el-table
        size="mini"
        stripe="true"
        border="true"
        :data="tableData.logs.slice((tableData.page-1)*tableData.limit, tableData.page*tableData.limit)"
        style="width: 100%">
      <el-table-column
          align="center"
          prop="remote_addr"
          :show-overflow-tooltip="true"
          label="remote_addr"
          width="120">
      </el-table-column>
      <el-table-column
          prop="remote_user"
          align="center"
          :show-overflow-tooltip="true"
          label="remote_user"
          width="120">
      </el-table-column>
      <el-table-column
          prop="time_local"
          align="center"
          width="100"
          :show-overflow-tooltip="true"
          label="time_local">
      </el-table-column>
      <el-table-column
          align="center"
          prop="request"
          :show-overflow-tooltip="true"
          label="request">
      </el-table-column>
      <el-table-column
          align="center"
          :show-overflow-tooltip="true"
          prop="status"
          width="60"
          label="status">
      </el-table-column>
      <el-table-column
          prop="body_bytes_sent"
          align="center"
          :show-overflow-tooltip="true"
          width="140"
          label="body_bytes_sent">
      </el-table-column>
      <el-table-column
          prop="http_referer"
          width="120"
          align="center"
          :show-overflow-tooltip="true"
          label="http_referer">
      </el-table-column>
      <el-table-column
          prop="http_user_agent"
          align="center"
          :show-overflow-tooltip="true"
          width="140"
          label="http_user_agent">
      </el-table-column>
      <el-table-column
          align="center"
          prop="http_x_forwarded_for"
          :show-overflow-tooltip="true"
          width="160"
          label="http_x_forwarded_for">
      </el-table-column>
      <el-table-column
          prop="normal"
          :show-overflow-tooltip="true"
          width="80"
          align="center"
          label="正常">
      </el-table-column>
      <el-table-column
          prop="assault_xss"
          align="center"
          :show-overflow-tooltip="true"
          width="80"
          label="XSS攻击">
      </el-table-column>
      <el-table-column
          prop="assault_file"
          width="100"
          :show-overflow-tooltip="true"
          align="center"
          label="敏感文件攻击">
      </el-table-column>
      <el-table-column
          prop="assault_comm"
          align="center"
          :show-overflow-tooltip="true"
          width="100"
          label="命令执行攻击">
      </el-table-column>
      <el-table-column
          prop="assault_sqlinj"
          align="center"
          :show-overflow-tooltip="true"
          width="100"
          label="sql注入攻击">
      </el-table-column>
      <el-table-column
          prop="assault_webshell"
          align="center"
          :show-overflow-tooltip="true"
          width="140"
          label="webshell连接攻击">
      </el-table-column>
    </el-table>
    <el-pagination
        background
        :current-page="tableData.page"
        :page-size="tableData.limit"
        :pager-count="11"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="tableData.logs.length">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "LogTable",
  props: ["tableData"],
  methods: {
    handleCurrentChange(page) {
      console.log('page: ', page)
      this.tableData.page = page;
    },
  }
}
</script>

<style scoped>
.table-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
