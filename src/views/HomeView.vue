<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="card-content">
            <el-icon class="icon student-icon"><UserFilled /></el-icon>
            <div class="text-area">
              <div class="title">总学生数</div>
              <div class="number">{{ stats.totalStudents }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="card-content">
            <el-icon class="icon clazz-icon"><School /></el-icon>
            <div class="text-area">
              <div class="title">班级总数</div>
              <div class="number">{{ stats.totalClasses }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="card-content">
            <el-icon class="icon avgAge-icon"><Orange /></el-icon>
            <div class="text-area">
              <div class="title">平均年龄</div>
              <div class="number">{{ stats.avgAge }}</div>
            </div>
          </div>
        </el-card>
      </el-col>


    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :md="12">
        <el-card header="性别占比" class="dashboard-card">
          <div id="genderChart" class="chart-box"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="12">
        <el-card header="班级人数分布" class="dashboard-card">
          <div id="classChart" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'
import { getDashboardData } from '@/api/stat'
import {Orange, School, UserFilled} from "@element-plus/icons-vue";

const stats = ref({totalStudents: 0, totalClasses: 0, avgAge: 0})
let genderChart = null
let classChart = null
const handleResize = () => {
  genderChart?.resize()
  classChart?.resize()
}
    onMounted(async () => {
      const res = await getDashboardData()
      stats.value = res

      // 初始化性别饼图
      genderChart = echarts.init(document.getElementById('genderChart'))
      genderChart.setOption({
        tooltip: {trigger: 'item'},
        series: [{type: 'pie', radius: '60%', data: res.genderData}]
      })

      // 初始化班级柱状图
      classChart = echarts.init(document.getElementById('classChart'))
      classChart.setOption({
        title: {text: '班级人数分布', left: 'center'},
        tooltip: {trigger: 'axis'},
        grid: {
          top: '15%',
          left: '5%',
          right: '5%',
          bottom: '15%', // 🌟 必须给 35% 以上，文字竖过来后占空很大
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: res.classData.map(d => d.name),
          axisLabel: {
            interval: 0,
            rotate: 0,
            fontSize: 12,
            color: '#666',
            formatter: function (value) {
              return value.split('').join('\n');
            },
            margin: 15
          }
        },
        yAxis: {
          type: 'value',
          name: '人数'
        },
        series: [{
          name: '人数',
          type: 'bar',
          barWidth: '40%', // 调窄柱子，看起来更精致
          data: res.classData.map(d => d.value),
          itemStyle: {
            color: '#409EFF',
            borderRadius: [5, 5, 0, 0] // 柱子顶部圆角
          },
          label: {
            show: true,
            position: 'top'
          }
        }]
      })

      window.addEventListener('resize', handleResize)
    });

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  genderChart?.dispose();
  classChart?.dispose();
});
</script>

<style scoped>
.stat-num { font-size: 30px; font-weight: bold; color: #409EFF; text-align: center; }
/* 统一图表容器的高度 */
.chart-box {
  height: 430px; /* 稍微调高一点，给竖着的文字留空间 */
  width: 100%;
}

/* 让卡片本身也撑满高度，这样看起来更整齐 */
.dashboard-card {
  height: 100%;
}

/* 给每一列增加底边距 */
.el-col {
  margin-bottom: 20px;
}

/* 适配：当在大屏幕（md）以上横着排时，取消最后一行的多余间距（可选） */
@media (min-width: 992px) {
  .dashboard-row {
    margin-bottom: -20px; /* 抵消掉底部的间距，让布局更紧凑 */
  }
}

/* 确保卡片高度一致且美观 */
.dashboard-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-container {
  height: 450px;
  width: 100%;
  margin-top: auto;
}

.stat-row { margin-bottom: 20px; }
.stat-card { border-radius: 8px; }
.card-content { display: flex; align-items: center; }
.icon { font-size: 48px; margin-right: 20px; padding: 10px; border-radius: 8px; }
.student-icon { color: #409EFF; background: #ecf5ff; }
.clazz-icon { color: #67C23A; background: #f0f9eb; }
.avgAge-icon{color: #6366f1; background: #eef2ff;}
.title { font-size: 14px; color: #909399; margin-bottom: 5px; }
.number { font-size: 24px; font-weight: bold; color: #303133; }
</style>