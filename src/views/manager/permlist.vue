<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-if="false" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="权限名" v-model="listQuery.permname">
      </el-input>
      <el-select v-if="false" clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="状态">
        <el-option v-for="item in  userStatus" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button v-has-add:permission class="filter-item" style="margin-left: 10px;" @click="handleTopCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button>
      <el-button v-has-perm:permission:flashPerms class="filter-item" type="primary" v-waves icon="el-icon-refresh" @click="handleFlashPerms">更新权限</el-button>
    </div>

    <tree-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="努力加载中" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="权限名" >
        <template slot-scope="scope">
          <span>{{scope.row.permname}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="类型" width="70px">
        <template slot-scope="scope">
          <span>{{scope.row.type | typeText}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址url" width="210px">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限code" width="160px">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述" >
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="创建日期" v-if="false">
        <template slot-scope="scope">
          <span>{{scope.row.createdate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="创建人" v-if="false">
        <template slot-scope="scope">
          <span>{{scope.row.createusername}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="70px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusText}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="300px">
        <template slot-scope="scope">
          <el-button v-has-add:permission type="primary" size="mini" v-if="scope.row.type!==2" @click="handleChildrenCreate(scope.row)">添加</el-button>
          <el-button v-has-update:permission v-if="scope.row.status=='0'" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-has-status:permission v-if="scope.row.status!='-1'" size="mini" type="success" @click="handleModifyStatus(scope.row,'-1')">删除
          </el-button>
          <el-button v-has-status:permission v-if="scope.row.status!='0'" size="mini" @click="handleModifyStatus(scope.row,'0')">正常
          </el-button>
          <el-button v-has-status:permission v-if="scope.row.status!='1'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'1')">锁定
          </el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @open="onDialogOpen">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="权限名" prop="permname">
          <el-input v-model="temp.permname"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus !== 'topCreate'" label="父节点" prop="parentid"> 
          <el-select class="filter-item" style="width: 130px" v-model="temp.parentid">
            <el-option v-for="item in typeData" :key="item.id" :label="item.permname" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-select class="filter-item" style="width: 130px" v-model="temp.type">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址url" prop="url">
          <el-input v-model="temp.url"></el-input>
        </el-form-item>
        <el-form-item label="权限code" prop="code">
          <el-input v-model="temp.code"></el-input>
        </el-form-item>
        <el-form-item label="顺序" prop="sort">
          <el-input v-model.number="temp.sort"></el-input>
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
        <el-button v-if="dialogStatus==='topCreate'||dialogStatus==='childrenCreate'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  createPerm,
  updatePerm,
  updateStatus,
  menuNode,
  flashPerms
} from '@/api/permission'
import waves from '@/directive/waves' // 水波纹指令
import treeTable from '@/components/TreeTable'
import config from '@/utils/config'

const typeOptions = [
  { key: 0, display_name: '菜单' },
  { key: 1, display_name: '页面' },
  { key: 2, display_name: '按钮' }
]

const typeValue = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'listPerm',
  components: { treeTable },
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        permname: null,
        status: 0
      },
      userStatus: config.userStatus,
      typeOptions,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        topCreate: '顶级节点添加',
        childrenCreate: '子节点添加'

      },
      temp: this.initCreateUpdateTemp(),
      typeData: [],
      isNeedGetTypeData: true,
      rules: {
        permname: [
          { required: true, message: '权限名必填', trigger: 'change' }
        ],
        description: [
          { required: true, message: '描述必填', trigger: 'change' }
        ],
        type: [
          { required: true, message: '类型必填', trigger: 'change' }
        ],
        status: [
          { required: true, message: '状态必填', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '顺序必填', trigger: 'change' },
          { type: 'number', message: '顺序必须为数字值' }
        ],
        url: [
          { validator: this.validateUrl, trigger: 'change' }
        ],
        code: [
          { validator: this.validateCode, trigger: 'change' }
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
    },
    typeText(type) {
      return typeValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    validateUrl(rule, value, callback) {
      if ((this.temp.type === 1 || this.temp.type === 2) &&
       (this.temp.url === '' || this.temp.url === null)) {
        callback(new Error('请输入地址url'))
      }
      callback()
    },
    validateCode(rule, value, callback) {
      if ((this.temp.type === 1 || this.temp.type === 2) &&
       (this.temp.code === '' || this.temp.code === null)) {
        callback(new Error('请输入权限code'))
      }
      callback()
    },
    initCreateUpdateTemp() {
      return {
        id: null,
        permname: null,
        description: null,
        parentid: null,
        type: null,
        url: null,
        code: null,
        icon: null,
        sort: null,
        status: 0
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleFlashPerms() {
      flashPerms().then(() => {
        this.$notify({
          message: '更新权限成功',
          type: 'success'
        })
      })
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
    handleTopCreate() {
      this.resetTemp()
      this.dialogStatus = 'topCreate'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleChildrenCreate(row) {
      this.resetTemp()
      this.temp.parentid = row.id
      this.dialogStatus = 'childrenCreate'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createPerm(this.temp).then(() => {
            this.getList()// 重新加载列表
            this.dialogFormVisible = false
            this.isNeedGetTypeData = true
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
          updatePerm(tempData).then(() => {
            this.getList()// 重新加载列表
            this.dialogFormVisible = false
            this.isNeedGetTypeData = true
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
        const tHeader = ['权限名称', '类型', '地址url', '权限code', '描述', '状态']
        const filterVal = [
          'permname',
          'type',
          'url',
          'code',
          'description',
          'status'
        ]
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel(tHeader, data, '权限列表')
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      const data = []
      const getChildren = element => {
        if (element.children && element.children.length > 0) {
          element.children.forEach(children => {
            data.push(children)
            getChildren(children)
          })
        }
      }
      jsonData.forEach(element => {
        data.push(element)
        getChildren(element)
      })

      return data.map(v =>
        filterVal.map(j => {
          if (j === 'status') {
            return config.userStatusValue[v[j]]
          } else if (j === 'type') {
            return typeValue[v[j]]
          } else {
            return v[j]
          }
        })
      )
    },
    onDialogOpen() {
      if (!this.isNeedGetTypeData) { return }
      menuNode().then(response => {
        this.typeData = response.data
        this.isNeedGetTypeData = false
      })
    }
  }
}
</script>