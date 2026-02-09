<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside">
      <div class="logo-box">
        <el-icon color="#409EFF" size="24"><School /></el-icon>
        <span class="logo-text">学籍管理系统</span>
      </div>

      <el-menu
          :default-active="$route.path"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          class="side-menu"
      >
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <span>主页</span>
        </el-menu-item>
        <el-menu-item index="/student">
          <el-icon><User /></el-icon>
          <span>学生管理</span>
        </el-menu-item>
        <el-menu-item index="/clazz">
          <el-icon><Collection /></el-icon>
          <span>班级管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="nav-header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>后台</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-dropdown trigger="click">
            <div class="user-profile">
              <div class="user-profile">
                <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <span class="nickname">{{ userStore.userInfo.nickname }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="User" @click="router.push('/profile')">个人中心</el-dropdown-item>
                <el-dropdown-item divided :icon="SwitchButton" @click="handleLogout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>


      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>



.layout-container { height: 100vh; background-color: #f0f2f5; }
.aside { background-color: #304156; transition: width 0.3s; }

.logo-box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b2f3a;
  gap: 10px;
}
.logo-text { color: white; font-weight: bold; font-size: 16px; }

.nav-header {
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0,21,41,.08); /* 🌟 增加阴影，立显高级 */
  padding: 0 20px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}
.nickname { font-size: 14px; color: #666; }

.main-content { padding: 20px; }

.el-menu-item.is-active {
  background-color: #263445 !important;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}


</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  HomeFilled,
  School,
  User,
  Collection,
  ArrowDown,
  SwitchButton,
  Setting
} from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录并返回首页吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 1. 清理硬盘上的 Token
    localStorage.removeItem('student_token');
    // 2. 🌟 清理 Pinia 内存中的用户信息
    userStore.clearUserInfo();
    // 3. 提示
    ElMessage.success('已安全退出');
    // 4. 重定向到登录页
    router.push('/login');
  }).catch(() => {
    // 用户点取消，不做任何事
  });
};
</script>