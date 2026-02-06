<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStudentPage, addStudent, updateStudent, deleteStudent } from '@/api/student'
import router from "@/router/index.js";

const tableData = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const loading = ref(false) // 🌟 新增：加载状态
const searchName = ref('')

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getStudentPage({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      name:searchName.value
    })
    // 🌟 注意：因为拦截器里返回了 res.data，这里直接拿 list 和 total
    console.log("接口返回的数据：", res)
    tableData.value = res.records
    total.value = res.total
    console.log("注入表格的数据：", tableData.value)
  } catch (e) {
    console.error('获取数据失败了：', e)
  }
  finally {
    loading.value = false
  }
}

onMounted(loadData)

const handleCurrentChange = (val) => {
  pageNum.value = val
  loadData()
}

// 删除
const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', { type: 'warning' }).then(async () => {
    await deleteStudent(id) // 调用 API
    ElMessage.success('删除成功')
    loadData()
  })
}

const dialogVisible = ref(false)
const form = ref({ studentNo: '', name: '', age: '', email: '', clazzId: 1, gender: 1 })

const openDialog = () => {
  form.value = { clazzId: 1, gender: 1 } // 重置表单
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.value = JSON.parse(JSON.stringify(row))
  dialogVisible.value = true
}

// 保存（增/改）
const save = async () => {
  if (form.value.id) {
    await updateStudent(form.value)
    ElMessage.success('修改成功')
  } else {
    await addStudent(form.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  loadData()
}
const logout = () => {
  localStorage.removeItem('student_token') // 清除 Token
  router.push('/login')
  ElMessage.success('已安全退出')
}


</script>


<template>
  <!-- 🌟 使用布局容器 -->
  <el-container class="layout-container">

    <!-- 左侧菜单栏 -->
    <el-aside width="200px">
      <div class="logo">学生系统</div>
      <el-menu default-active="1" class="el-menu-vertical">
        <el-menu-item index="1">
          <el-icon><User /></el-icon>
          <span>学生管理</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><School /></el-icon>
          <span>班级管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部状态栏 -->
      <el-header class="header">
        <div class="breadcrumb">首页 / 学生管理</div>
        <div class="user-info">
          <span>管理员</span>
          <el-button type="text">退出</el-button>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main>
        <div class="action-bar">
          <el-button type="primary" @click="openDialog">新增学生</el-button>
        </div>

        <div class="action-bar" style="display: flex; gap: 10px; margin-bottom: 20px;">
          <el-input
              v-model="searchName"
              placeholder="输入姓名搜索"
              style="width: 200px"
              clearable
              @clear="loadData"
          />
          <el-button type="primary" icon="Search" @click="loadData">搜索</el-button>
          <el-button type="success" icon="Plus" @click="openDialog">新增学生</el-button>
        </div>

        <!-- 🌟 v-loading 让表格加载时有转圈效果 -->
        <el-table :data="tableData" v-loading="loading" border style="width: 100%">
          <el-table-column prop="studentNo" label="学号" width="120" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="className" label="班级" width="150" /> <!-- 🌟 之前做的 VO 字段 -->
          <el-table-column prop="age" label="年龄" width="80" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            class="pagination"
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
        />
      </el-main>
    </el-container>
  </el-container>

  <!-- 弹窗部分保持不变，但你可以把 v-model 里的 clazzId 和 gender 补齐 -->
</template>

<style scoped>
.layout-container { height: 100vh; }
.el-aside { background-color: #304156; color: white; }
.logo { height: 60px; line-height: 60px; text-align: center; font-size: 20px; font-weight: bold; background: #2b2f3a; }
.header { background: #fff; border-bottom: 1px solid #dcdfe6; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
.action-bar { margin-bottom: 20px; }
.pagination { margin-top: 20px; text-align: right; }
</style>
