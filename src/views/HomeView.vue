<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

// 定义变量
const tableData = ref([])  // 存放列表数据
const total = ref(0)       // 存放总条数
const pageNum = ref(1)     // 当前页
const pageSize = ref(10)   // 每页多少条

// 获取数据的函数
const loadData = async () => {
  // 调用后端接口
  const res = await axios.get('http://localhost:8080/student/page', {
    params: {
      pageNum: pageNum.value,
      pageSize: pageSize.value
    }
  })
  
  // 看看控制台输出了什么，方便调试
  console.log(res.data)

  // 赋值 (注意：根据你后端Result结构的层级来取)
  // 假设后端是 Result -> data -> list
  if (res.data.code === '200') {
    tableData.value = res.data.data.list
    total.value = res.data.data.total
  } else {
    alert(res.data.msg)
  }
}

// 页面加载完成后，自动触发
onMounted(() => {
  loadData()
})

// 翻页触发
const handleCurrentChange = (val) => {
  pageNum.value = val
  loadData()
}

// 删除逻辑
const handleDelete = (id) => {
  ElMessageBox.confirm(
    '确定要删除这位同学吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    // 用户点了确定，发请求
    // 注意：这里的URL要跟你后端 @DeleteMapping 定义的一样
    // 假设后端是 /student/delete/{id}
    const res = await axios.delete(`http://localhost:8080/student/delete/${id}`)
    
    if (res.data.code === '200') {
      ElMessage.success('删除成功')
      loadData() // 🌟 关键：删完之后重新查一遍，表格才会更新
    } else {
      ElMessage.error(res.data.msg)
    }
  }).catch(() => {
    // 用户点了取消，啥也不做
  })
}

// 控制弹窗显示/隐藏
const dialogVisible = ref(false)

// 表单数据对象 (初始为空)
const form = ref({
  studentNo: '',
  name: '',
  age: '',
  email: ''
})

// 点击新增按钮：打开弹窗，清空表单
const openDialog = () => {
  form.value = {} // 清空上次填的数据
  dialogVisible.value = true
}


// 点击编辑按钮
const handleEdit = (row) => {
  // 把当前行的数据复制给 form，弹窗里就会显示旧数据了
  // 🌟 注意：要用 JSON.parse(JSON.stringify(row)) 深拷贝，
  // 否则你在弹窗里改字，表格里的字也会跟着变，体验不好
  form.value = JSON.parse(JSON.stringify(row))
  dialogVisible.value = true
}

// 修改 save 函数 (核心逻辑)
const save = async () => {
  if (form.value.id) {
    // 有ID，说明是修改
    const res = await axios.put('http://localhost:8080/student/update', form.value)
    if (res.data.code === '200') {
        ElMessage.success('修改成功')
        dialogVisible.value = false
        loadData()
    } else {
        ElMessage.error(res.data.msg)
    }
  } else {
    // 没有ID，说明是新增
    const res = await axios.post('http://localhost:8080/student/add', form.value)
    // ...同上...
    if (res.data.code === '200') {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        loadData()
    } else {
        ElMessage.error(res.data.msg)
    }
  }
}
</script>

<template>
  <div style="padding: 20px;">
    <h2>学生管理系统</h2>
    
    <!-- 表格区域 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="studentNo" label="学号" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="age" label="年龄" width="80" />
      <el-table-column prop="email" label="邮箱" />
      
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div style="margin-top: 20px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增按钮，放在表格上面 -->
    <div style="margin-bottom: 10px;">
      <el-button type="primary" @click="openDialog">新增学生</el-button>
    </div>

    <!-- 弹窗组件 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增学生"
      width="30%"
    >
      <el-form :model="form" label-width="80px">
        <!-- 这里的 v-model 对应 form 里的属性 -->
        <el-form-item label="学号">
          <el-input v-model="form.studentNo" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age" type="number" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>