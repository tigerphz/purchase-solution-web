<template>
  <div class="app-container calendar-list-container">
<el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 450px;'>
        <el-form-item label="用户名" prop="username">
          <span>{{user.username}}</span>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="user.nickname"></el-input>
        </el-form-item>
         <el-form-item label="状态" prop="status"> 
           <span>{{user.status | statusText}}</span>
         </el-form-item>
        <el-form-item label="性别"> 
          <el-select class="filter-item" style="width: 130px" v-model="user.gender">
            <el-option v-for="item in genderEnum" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="手机号">
          <el-input v-model="user.cellphone"></el-input>
        </el-form-item>
         <el-form-item label="身份证">
          <el-input v-model="user.identitycard"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="user.address"></el-input>
        </el-form-item>
      </el-form> 
      <el-button type="primary" @click="createData">密码修改</el-button>
      <el-button type="primary" @click="updateData">保存</el-button>
  </div>
</template>

<script>
import config from '@/utils/config'

export default {
  name: 'userdetail',
  data() {
    return {
      user: {
        username: null,
        nickname: null,
        status: null,
        gender: null,
        cellphone: null,
        identitycard: null,
        email: null,
        address: null
      },
      userStatus: config.userStatus,
      genderEnum: config.genderEnum
    }
  },
  filters: {
    statusText(type) {
      return config.userStatusValue[type]
    }
  }
}
</script>
