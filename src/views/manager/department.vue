<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.deptname">
      </el-input>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="状态">
        <el-option v-for="item in  userStatus" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button v-has-add:department class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="努力加载中" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="部门名" >
        <template slot-scope="scope">
          <span>{{scope.row.deptname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述" >
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="70px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusText}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="320px">
        <template slot-scope="scope">
          <el-button v-has-update:department v-if="scope.row.status=='0'" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-has-status:department v-if="scope.row.status!='-1'" size="mini" type="success" @click="handleModifyStatus(scope.row,'-1')">删除
          </el-button>
          <el-button v-has-status:department v-if="scope.row.status!='0'" size="mini" @click="handleModifyStatus(scope.row,'0')">正常
          </el-button>
          <el-button v-has-status:department v-if="scope.row.status!='1'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'1')">锁定
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNum"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="部门名" prop="deptname">
          <el-input v-model="temp.deptname"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
         <el-form-item label="状态" prop="status"> 
          <el-select class="filter-item" style="width: 130px" v-model="temp.status">
            <el-option v-for="item in userStatus" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
         </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-dialog__body{
  padding: 1px 20px；
}
</style>

<script>
import {
  fetchList,
  createDepartment,
  updateDepartment,
  updateStatus
} from '@/api/department'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import config from '@/utils/config'

export default {
  name: 'listDepartment',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        deptname: undefined,
        status: undefined
      },
      userStatus: config.userStatus,
      dialogFormVisible: false,
      dialogTransferVisible: false,
      departments: [],
      curDepartId: undefined,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      temp: this.initCreateUpdateTemp(),
      dialogPvVisible: false,
      rules: {
        username: [
          { required: true, message: '部门名必填', trigger: 'change' }
        ],
        status: [
          { required: true, message: '状态必填', trigger: 'change' }
        ]
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': 'success',
        '1': 'info',
        '-1': 'danger'
      }
      return statusMap[status]
    },
    statusText(type) {
      return config.userStatusValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    initCreateUpdateTemp() {
      return {
        id: null,
        deptname: null,
        description: null,
        status: 0
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total * 1
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      const id = row.id
      updateStatus({ id, status }).then(() => {
        this.$notify({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      })
    },
    resetTemp() {
      this.temp = this.initCreateUpdateTemp()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createDepartment(this.temp).then(() => {
            this.getList()// 重新加载列表
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      const r = Object.assign({}, row) // copy obj
      for (var property in this.temp) {
        this.temp[property] = r[property]
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateDepartment(tempData).then(() => {
            this.getList()// 重新加载列表
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['部门名', '描述', '状态']
        const filterVal = [
          'deptname',
          'description',
          'status'
        ]
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel(tHeader, data, '部门列表')
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'createdate') {
            return parseTime(v[j])
          } else if (j === 'status') {
            return config.userStatusValue[v[j]]
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>