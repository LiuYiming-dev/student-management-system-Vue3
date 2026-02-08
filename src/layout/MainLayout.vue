<template>
  <el-container class="layout-container">
    <el-aside width="200px">


      <el-menu
          :default-active="$route.path"
          router
          class="side-menu"
          background-color="#304156"
          text-color="#fff"
      >


        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <span>主页</span>
        </el-menu-item>

        <el-menu-item index="/student">
          <el-icon><User /></el-icon>
          <span>学生管理</span>
        </el-menu-item>

        <el-menu-item index="/clazz">
          <el-icon><School /></el-icon>
          <span>班级管理</span>
        </el-menu-item>




      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="nav-header"> ... </el-header>
      <el-main>
        <!-- 4. 🌟 核心：这是内容的占位符，HomeView 或 ClazzView 会显示在这里 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import {HomeFilled, School, User} from "@element-plus/icons-vue";
</script>