<script setup>

import {onMounted, ref} from "vue";
import {getClazzPage} from "@/api/clazz.js";

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



</script>

<template>
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