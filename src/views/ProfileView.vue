<template>
  <div class="profile-container">
    <el-row :gutter="20" class="equal-height-row">
      <el-col :span="8">
        <el-card header="个人资料修改">
          <el-form :model="form" label-width="80px">
            <el-form-item label="头像">
              <el-upload
                  action="http://localhost:8080/student/upload"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  class="avatar-uploader"
              >
                <img v-if="form.avatar" :src="form.avatar" class="avatar-pre"  alt=""/>
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>

            <el-form-item label="昵称">
              <el-input v-model="form.nickname" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧：修改密码 -->
      <el-col :span="15">
        <el-card header="安全设置 / 修改密码">
          <el-form :model="passForm" :rules="rules" ref="formRef" label-width="100px" style="max-width: 400px; margin: 20px auto">
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
import {updatePassword, updateUserInfo} from '@/api/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {Plus} from "@element-plus/icons-vue";

const userStore = useUserStore()
const router = useRouter()
const formRef = ref()
const passForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
const form = ref({
  nickname: userStore.userInfo.nickname,
  avatar: userStore.userInfo.avatar
})
const uploadHeaders = { token: localStorage.getItem('student_token') }
const handleAvatarSuccess = (res) => {
  if (res.code === '200') {
    form.value.avatar = res.data
  }
}
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

// 提交修改
const submitProfile = async () => {
  await updateUserInfo(form.value)

  // 🌟 关键：后端改完后，必须同步更新前端的 Pinia 管家
  // 这样右上角的名字和头像才会立刻变化！
  userStore.setUserInfo({
    ...userStore.userInfo, // 保留原来的 ID、角色等
    nickname: form.value.nickname,
    avatar: form.value.avatar
  })

  ElMessage.success('个人资料已更新')
}
</script>

<style scoped>
.avatar-pre { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; }
.avatar-uploader-icon { border: 1px dashed #d9d9d9; width: 100px; height: 100px; line-height: 100px; text-align: center; }
.equal-height-row {
  display: flex;       /* 启用 Flexbox */
  flex-wrap: wrap;     /* 允许在小屏幕换行 */
}
/* 🌟 核心：让 col 内部的组件也能撑开高度 */

/* 🌟 核心：让 card 占据父级 col 的 100% 高度 */

/* 调整卡片内容的布局，让底部的按钮能对齐（可选） */
</style>