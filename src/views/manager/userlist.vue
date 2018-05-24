<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名" v-model="listQuery.username">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="昵称" v-model="listQuery.nickname">
      </el-input>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="状态">
        <el-option v-for="item in  userStatus" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button v-has-add:user class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="努力加载中" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="用户名" >
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" >
        <template slot-scope="scope">
          <span>{{scope.row.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" >
        <template slot-scope="scope">
          <span>{{scope.row.gender | genderText}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" >
        <template slot-scope="scope">
          <span>{{scope.row.cellphone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱" >
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
       <el-table-column align="center" label="地址" >
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createdate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createusername}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="70px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusText}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="320px">
        <template slot-scope="scope">
          <el-button v-has-perm:user:roles type="primary" size="mini" @click="handleOpenRoleDialog(scope.row)">角色</el-button>
          <el-button v-has-update:user v-if="scope.row.status=='0'" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-has-status:user v-if="scope.row.status!='-1'" size="mini" type="success" @click="handleModifyStatus(scope.row,'-1')">删除
          </el-button>
          <el-button v-has-status:user v-if="scope.row.status!='0'" size="mini" @click="handleModifyStatus(scope.row,'0')">正常
          </el-button>
          <el-button v-has-status:user v-if="scope.row.status!='1'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'1')">锁定
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
        <el-form-item v-if="dialogStatus=='create'" label="用户名" prop="username">
          <el-input v-model="temp.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="dialogStatus=='create'" prop="password">
          <el-input v-model="temp.password"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="temp.nickname"></el-input>
        </el-form-item>
         <el-form-item label="状态" prop="status"> 
          <el-select class="filter-item" style="width: 130px" v-model="temp.status">
            <el-option v-for="item in userStatus" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
         </el-form-item>
        <el-form-item label="性别"> 
          <el-select class="filter-item" style="width: 130px" v-model="temp.gender">
            <el-option v-for="item in genderEnum" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门"> 
          <el-select v-model="temp.deptid" placeholder="请选择">
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.deptname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="手机号">
          <el-input v-model="temp.cellphone"></el-input>
        </el-form-item>
         <el-form-item label="身份证">
          <el-input v-model="temp.identitycard"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="temp.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色设置" :visible.sync="dialogTransferVisible" width="570px">
      <el-transfer filterable filter-placeholder="请输入角色名称"
      v-model="userRoles" :data="roles" :titles="['未拥有角色', '已拥有角色']" 
      :button-texts="['移除', '添加']"
      :props="{ key: 'id', label: 'rolename' }"></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTransferVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUserRolesData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-dialog__body {
  padding: 1px 20px；;
}
</style>

<script>
/* eslint-disable */
import { fetchList, createUser, updateUser, updateStatus } from "@/api/user";
import { getUserRoles, getAllRoles, updateUserRoles } from "@/api/role";
import { fetchList as departFetchList } from "@/api/department";
import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";
import config from "@/utils/config";

export default {
  name: "listUser",
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
        username: undefined,
        nickname: undefined,
        status: undefined
      },
      userStatus: config.userStatus,
      genderEnum: config.genderEnum,
      dialogFormVisible: false,
      dialogTransferVisible: false,
      userRoles: [],
      roles: [],
      departments: [],
      curUserId: undefined,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      temp: this.initCreateUpdateTemp(),
      dialogPvVisible: false,
      rules: {
        username: [
          { required: true, message: "用户名必填", trigger: "change" }
        ],
        password: [
          { required: true, message: "密码必填", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              if (value.length < 6) {
                callback(new Error("密码长度不能小于6位数"));
              } else callback();
            },
            trigger: "blur"
          }
        ],
        nickname: [{ required: true, message: "昵称必填", trigger: "change" }],
        email: [
          { type: "email", message: "请输入正确的邮箱地址", trigger: "change" }
        ],
        status: [{ required: true, message: "状态必填", trigger: "change" }]
      },
      downloadLoading: false
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "0": "success",
        "1": "info",
        "-1": "danger"
      };
      return statusMap[status];
    },
    statusText(type) {
      return config.userStatusValue[type];
    },
    genderText(type) {
      return config.userGenderValue[type];
    }
  },
  created() {
    this.getList();
  },
  methods: {
    initCreateUpdateTemp() {
      return {
        id: null,
        username: null,
        password: null,
        nickname: null,
        deptid: null,
        gender: null,
        cellphone: null,
        identitycard: null,
        email: null,
        address: null,
        status: 0
      };
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total * 1;
        this.listLoading = false;
      });
    },
    loadDepartment() {
      if (this.departments.length > 0) return;
      let query = { status: 0 };
      departFetchList(query).then(response => {
        this.departments = response.data.list;
      });
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleModifyStatus(row, status) {
      const id = row.id;
      updateStatus({ id, status }).then(() => {
        this.$notify({
          message: "操作成功",
          type: "success"
        });
        row.status = status;
      });
    },
    resetTemp() {
      this.temp = this.initCreateUpdateTemp();
    },
    handleCreate() {
      this.loadDepartment();
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createUser(this.temp).then(() => {
            this.getList(); // 重新加载列表
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.loadDepartment();
      const r = Object.assign({}, row); // copy obj
      for (var property in this.temp) {
        this.temp[property] = r[property];
      }
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateUser(tempData).then(() => {
            this.getList(); // 重新加载列表
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleOpenRoleDialog(row) {
      getUserRoles(row.id).then(response => {
        this.userRoles = response.data.map(d => {
          return d.id;
        });
      });
      if (this.roles.length === 0) {
        getAllRoles().then(response => {
          this.roles = response.data.map(x => {
            return { id: x.id, rolename: `${x.rolename}(${x.description})` };
          });
        });
      }

      this.curUserId = row.id;
      this.dialogTransferVisible = true;
    },
    updateUserRolesData() {
      updateUserRoles({ userId: this.curUserId, roleIds: this.userRoles }).then(
        () => {
          this.dialogTransferVisible = false;
          this.$notify({
            title: "成功",
            message: "更新角色成功",
            type: "success",
            duration: 2000
          });
        }
      );
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "用户名",
          "昵称",
          "手机号",
          "邮箱",
          "地址",
          "创建日期",
          "创建人",
          "状态"
        ];
        const filterVal = [
          "username",
          "nickname",
          "cellphone",
          "email",
          "address",
          "createdate",
          "createusername",
          "status"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel(tHeader, data, "用户列表");
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "createdate") {
            return parseTime(v[j]);
          } else if (j === "status") {
            return config.userStatusValue[v[j]];
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>