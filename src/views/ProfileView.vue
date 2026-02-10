<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card header="个人基本资料" class="info-card">
          <div class="avatar-area">
            <el-avatar :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <h3>{{ userStore.userInfo.nickname }}</h3>
            <el-tag>{{userStore.userInfo.role}}</el-tag>
          </div>
          <div class="detail-area">
            <p>账号：{{ userStore.userInfo.username }}</p>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：修改密码 -->
      <el-col :span="16">
        <el-card header="安全设置 / 修改密码">
          <el-form :model="passForm" :rules="rules" ref="formRef" label-width="100px" style="max-width: 400px">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="passForm.oldPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passForm.newPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="passForm.confirmPassword" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">提交修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { updatePassword } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const formRef = ref()
const passForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })

// 校验逻辑：确认两次密码一致
const validateConfirm = (rule, value, callback) => {
  if (value !== passForm.value.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, min: 6, message: '新密码至少6位', trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirm, trigger: 'blur' }]
}

const onSubmit = async () => {
  await formRef.value.validate()
  await updatePassword(passForm.value)
  ElMessage.success('密码修改成功，请重新登录')


  localStorage.removeItem('student_token')
  userStore.clearUserInfo()
  await router.push('/login')
}
</script>

<style scoped>
.avatar-area { text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }
.detail-area { padding: 20px; color: #666; font-size: 14px; }
</style>