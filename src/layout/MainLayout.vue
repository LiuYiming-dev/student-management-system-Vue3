<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <!-- 1. 🌟 必须加上 router 属性，点击菜单才会跳转 URL -->
      <!-- 2. 🌟 :default-active 绑定当前路径，刷新页面菜单高亮才不会丢 -->
      <el-menu
          :default-active="$route.path"
          router
          class="side-menu"
          background-color="#304156"
          text-color="#fff"
      >
        <!-- 3. 🌟 index 必须写成和路由配置里一样的 path -->
        <el-menu-item index="/home">
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