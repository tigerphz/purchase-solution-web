<template>
  <div class="app-container calendar-list-container">
      <el-form :rules="rules" ref="dataForm" :model="user" label-position="left" label-width="80px" style='width: 450px;'>
        <el-form-item label="用户名" prop="username">
          <span>{{user.username}}</span>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <span v-if="isEditMode === false">{{user.nickname}}</span>
          <el-input v-else v-model="user.nickname"></el-input>
        </el-form-item>
         <el-form-item label="状态" prop="status"> 
           <span>{{user.status | statusText}}</span>
         </el-form-item>
        <el-form-item label="性别"> 
          <span v-if="isEditMode === false">{{user.gender | genderText}}</span>
          <el-select v-else class="filter-item" style="width: 130px" v-model="user.gender">
            <el-option v-for="item in genderEnum" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="手机号">
          <span v-if="isEditMode === false">{{user.cellphone}}</span>
          <el-input v-else v-model="user.cellphone"></el-input>
        </el-form-item>
         <el-form-item label="身份证">
          <span v-if="isEditMode === false">{{user.identitycard}}</span>
          <el-input v-else v-model="user.identitycard"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <span v-if="isEditMode === false">{{user.email}}</span>
          <el-input v-else v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <span v-if="isEditMode === false">{{user.address}}</span>
          <el-input v-else v-model="user.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpdatePassword">密码修改</el-button>
          <el-button type="primary" v-if="isEditMode===false" @click="handleUpdate">启用编辑</el-button>
          <el-button type="primary" v-if="isEditMode===true" @click="UpdateData">保存</el-button>
          <el-button type="primary" v-if="isEditMode===true" @click="handleCancelUpdate">取消</el-button>
        </el-form-item>
      </el-form>

      <el-dialog title="密码修改" :visible.sync="dialogPasswordVisible">
        <el-form :rules="passwordRules" ref="passwordForm" :model="passwordForm" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
          <el-form-item label="新密码密码" prop="password">
            <el-input type="password" v-model="passwordForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkpassword"> 
            <el-input type="password" v-model="passwordForm.checkpassword" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPasswordVisible = false">取消</el-button>
          <el-button type="primary" @click="updatedPassword">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import config from '@/utils/config'
import { updateUserById, updatePassword, getUserById } from '@/api/user'
import store from '@/store'

export default {
  name: 'userdetail',
  data() {
    return {
      orgUser: null,
      user: {
        id: null,
        username: null,
        nickname: null,
        status: null,
        gender: null,
        cellphone: null,
        identitycard: null,
        email: null,
        address: null
      },
      passwordForm: {
        password: '',
        checkpassword: ''
      },
      passwordRules: {
        password: [{ validator: this.validatePassword, trigger: 'blur' }],
        checkpassword: [
          { validator: this.validateCheckPassword, trigger: 'blur' }
        ]
      },
      rules: {
        username: [
          { required: true, message: '用户名必填', trigger: 'change' }
        ],
        nickname: [
          { required: true, message: '昵称必填', trigger: 'change' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }
        ]
      },
      userStatus: config.userStatus,
      genderEnum: config.genderEnum,
      isEditMode: false,
      dialogPasswordVisible: false
    }
  },
  filters: {
    statusText(type) {
      return config.userStatusValue[type]
    },
    genderText(type) {
      return config.userGenderValue[type]
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUserById(store.getters.id).then(Response => {
        this.user = Response.data
        this.orgUser = Object.assign({}, Response.data) // copy obj
      })
    },
    validatePassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位数'))
      } else {
        if (this.passwordForm.checkpassword !== '') {
          this.$refs.passwordForm.validateField('checkpassword')
        }
        callback()
      }
    },
    validateCheckPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    handleUpdatePassword() {
      this.dialogPasswordVisible = true
      this.$refs.passwordForm.resetFields()
    },
    updatedPassword() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          updatePassword({ id: store.getters.id, password: this.passwordForm.password }).then(() => {
            this.dialogPasswordVisible = false
            this.$msgbox({
              title: '确定登出',
              message: '修改密码成功，需要重新登录',
              confirmButtonText: '重新登录',
              showCancelButton: false,
              type: 'warning'
            }).then(() => {
              store.dispatch('FedLogOut').then(() => {
                location.reload()// 为了重新实例化vue-router对象 避免bug
              })
            })
          })
        }
      })
    },
    handleUpdate() {
      this.isEditMode = true
    },
    handleCancelUpdate() {
      this.isEditMode = false
      this.$refs.dataForm.clearValidate()
      this.user = Object.assign({}, this.orgUser) // copy obj
    },
    UpdateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.user)
          updateUserById(tempData).then(() => {
            this.getUser()// 重新加载列表
            this.isEditMode = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
