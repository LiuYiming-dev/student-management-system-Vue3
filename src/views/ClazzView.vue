<script setup>

import {onMounted, ref} from "vue";
import {exportClazz, getClazzPage} from "@/api/clazz.js";
import {ElMessage} from "element-plus";

const tableData = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const res = await getClazzPage({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    })
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

onMounted(async () => {
  await loadData();
})

const handleCurrentChange = (val) => {
  console.log("用户点击了页码：", val)
  pageNum.value = val
  loadData()
}

const handleExport = async () => {
  try {
    const res = await exportClazz()

    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.href = url
    // 🌟 设置文件名
    link.setAttribute('download', '班级列表.xlsx')
    document.body.appendChild(link)
    link.click()

    // 清理现场
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败详情:', error)
  }
};


</script>

<template>
  <div class="action-bar" style="display: flex; gap: 10px; margin-bottom: 20px;">
  <el-button type="success" icon="Plus" @click="handleExport">导出</el-button>
  </div>
  <div class="clazz-manager">

    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="className" label="班级" width="180" />
      <el-table-column prop="teacherName" label="老师" width="150" />
      <el-table-column prop="phoneNumber" label="电话号码" width="180" />

    </el-table>

    <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped>

.pagination { margin-top: 20px; text-align: right; }
</style>