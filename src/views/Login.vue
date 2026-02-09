<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>系统登录</h2>
      <el-form :model="loginForm">
        <el-form-item>
          <el-input v-model="loginForm.username" placeholder="账号" prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios' // 暂时直接用 axios 测通，也可以用你封装的 request
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {useUserStore} from "@/stores/user.js";

const userStore = useUserStore()
const router = useRouter()
const loginForm = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  try {

    const res = await axios.post('http://localhost:8080/user/login', loginForm.value)

    if (res.data.code === '200') {
      const token = res.data.data.token
      localStorage.setItem('student_token', token)
      userStore.setUserInfo(res.data.data.user)
      ElMessage.success('登录成功')
      await router.push('/')
    } else {
      ElMessage.error(res.data.msg)
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查后端服务')
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}
.login-card { width: 400px; padding: 20px; }
h2 { text-align: center; margin-bottom: 30px; color: #409EFF; }
</style>