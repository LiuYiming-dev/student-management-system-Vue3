<script setup>
import {onMounted, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {addStudent, deleteStudent, exportStudent, getStudentPage, importStudent, updateStudent} from '@/api/student'
import {getAllClazz} from "@/api/clazz.js";
import {Plus, User} from "@element-plus/icons-vue";

const tableData = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const searchName = ref('')
const clazzList = ref([])

const uploadHeaders = {
  token: localStorage.getItem('student_token')
}

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
    console.log("第一行数据的头像地址是：", tableData.value[0].avatar)
  } catch (e) {
    console.error('获取数据失败了：', e)
  }
  finally {
    loading.value = false
  }
}

onMounted(async () =>{
  await loadData();
  clazzList.value = await getAllClazz();
})

const handleCurrentChange = (val) => {
  pageNum.value = val
  loadData()
}

// 删除
const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', { type: 'warning' }).then(async () => {
    try {
      await deleteStudent(id); // 调用 API
      ElMessage.success('删除成功')
      await loadData()
    } catch (e){
      ElMessage.error("Error:" + e.message);
    }

  })
}

const dialogVisible = ref(false)
const form = ref({ studentNo: '', name: '', age: '', phoneNumber: '', clazzId: 1, gender: 1,avatar: '' })

const openDialog = () => {
  console.log("click the add button")
  form.value = { clazzId: 1, gender: 1,avatar: '' } // 重置表单
  dialogVisible.value = true
}

const handleEdit = (row) => {
  const editData = JSON.parse(JSON.stringify(row));
  console.log("编辑原始数据:", row.gender)
  if (editData.gender === '男' || editData.gender === 1) {
    editData.gender = 1
  } else if (editData.gender === '女' || editData.gender === 0) {
    editData.gender = 0
  }
  form.value = editData;
  dialogVisible.value = true;
}

// 保存（增/改）
const save = async () => {
  try {
    if (form.value.id) {
      await updateStudent(form.value)
      ElMessage.success('修改成功')
    } else {
      // 如果后端校验失败（比如学号重复），request.js 会抛出 reject
      // 那么这里的代码会直接跳到 catch，不会执行下一行的“新增成功”
      await addStudent(form.value);
      ElMessage.success('新增成功');
    }
    dialogVisible.value = false;
    loadData();
  } catch (error){
    console.error('提交失败:' + error.message);
    ElMessage.error('提交失败:' + error.message);
  }

}

const handleExport = async () => {
  try {
    const res = await exportStudent()

    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.href = url
    // 🌟 设置文件名
    link.setAttribute('download', 'students.xlsx')
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

/**
 * 当用户在文件选择框里选好文件并点“打开”时，这个函数会自动触发
 * @param file 这是一个包含文件信息的对象
 */
const handleImport = async (file) => {
  // 1. 🌟 获取原始文件对象
  // file.raw 才是真正的文件二进制数据
  const rawFile = file.raw

  // 2. 校验文件类型（防止用户选了别的）
  if (!rawFile) return
  if (rawFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      rawFile.type !== 'application/vnd.ms-excel') {
    ElMessage.error('请上传 Excel 格式的文件！')
    return
  }

  // 3. 🌟 准备“快递纸箱” (FormData)
  const formData = new FormData()

  // 4. 把文件塞进纸箱
  // 注意：第一个参数 'file' 必须和后端 @RequestParam("file") 的名字一模一样
  formData.append('file', rawFile)

  // 5. 发送请求给后端
  try {
    ElMessage.info('正在解析并导入，请稍候...')

    // 调用 API
    await importStudent(formData)

    ElMessage.success('导入成功！')
    loadData() // 🌟 导入成功后刷新表格数据
  } catch (error) {
    // 错误已经被 request.js 的拦截器处理（显示 403 权限不足或 500 报错）
    console.error('导入失败', error)
  }
}

const handleAvatarSuccess = (res) => {
  // 🌟 上传成功后，后端返回了图片的 URL，存入 form 对象，之后随表单一起提交
  if (res.code === '200') {
    form.value.avatar = res.data
    ElMessage.success('头像上传成功')
  }
}
</script>


<template>

  <div class="student-manager">
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
          <el-button type="success" icon="Plus" @click="handleExport">导出学生</el-button>
            <el-upload
                action="#"
                :auto-upload="false"
                :on-change="handleImport"
                :show-file-list="false"
                accept=".xlsx, .xls"
            >
              <el-button type="success" icon="Upload">导入学生 Excel</el-button>
            </el-upload>
        </div>




        <el-table :data="tableData" v-loading="loading" border style="width: 100%">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column label="头像" width="80" align="center">
            <template #default="{ row }">
              <!-- 只有当 row.avatar 有值时才渲染图片 -->
              <el-image
                  v-if="row.avatar"
                  style="width: 40px; height: 40px; border-radius: 50%"
                  :src="row.avatar"
                  :preview-src-list="[row.avatar]"
                  preview-teleported
              >
                <!-- 图片加载失败时显示的内容 -->
                <template #error>
                  <div style="background: #f5f7fa; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <el-icon><User /></el-icon>
                  </div>
                </template>
              </el-image>

              <!-- 如果数据里根本没头像，直接显示默认头像组件 -->
              <el-avatar v-else :size="40">匿</el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="studentNo" label="学号" width="150" />
          <el-table-column prop="className" label="班级" width="180" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="gender" label="性别" width="120" />
          <el-table-column prop="age" label="年龄" width="80"  />
          <el-table-column prop="phoneNumber" label="电话号码" width="200" />
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
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
  <el-dialog
      v-model="dialogVisible"
      title="新增学生信息"
      width="400px"
  >
    <!-- 这里是表单，每个 el-input 通过 v-model 绑定到 form 对象上 -->
    <el-form :model="form" label-width="80px">
      <el-form-item label="学号">
        <el-input v-model="form.studentNo" />
      </el-form-item>
      <el-form-item label="所在班级">
        <el-select v-model="form.clazzId" placeholder="请选择班级">
          <el-option
              v-for="item in clazzList"
              :key="item.id"
              :label="item.className"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="性别">
        <!-- v-model 依然绑定 form.gender -->
        <el-radio-group v-model="form.gender">
          <!-- 🌟 注意这里的 :label="1"，加了冒号表示传递的是数字 1，不加冒号传的是字符串 "1" -->
          <el-radio :value="1">男</el-radio>
          <el-radio :value="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model.number="form.age" type="number" />
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model.number="form.phoneNumber" type="number" />
      </el-form-item>
    </el-form>
    <el-form-item label="头像">
      <el-upload
          action="http://localhost:8080/student/upload"
          :headers="uploadHeaders"
          :on-success="handleAvatarSuccess"
          :show-file-list="false"
          class="avatar-uploader"
      >
        <!-- 如果 form 里有地址了，显示预览图；否则显示加号 -->
        <img v-if="form.avatar" :src="form.avatar" class="avatar-pre"  alt=""/>
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>

    <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
    </template>
  </el-dialog>
  </div>
</template>

<style scoped>
.action-bar { margin-bottom: 20px; }
.pagination { margin-top: 20px; text-align: right; }
</style>
