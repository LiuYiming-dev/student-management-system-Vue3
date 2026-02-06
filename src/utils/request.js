import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 1. 创建实例：配置基础路径和超时
const request = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000
})

// 2. 请求拦截器：在发车前，自动把本地存的 Token 戴在头上
request.interceptors.request.use(config => {
    const token = localStorage.getItem('student_token')
    if (token) {
        config.headers['token'] = token // 必须和后端拦截器里获取的 key 一致
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 3. 响应拦截器：统一处理后端的 Result
request.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code == '200') {
            return res.data;
        }
    },
    error => {
        // 🌟 重点：如果请求返回了 401
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('student_token'); // 清除掉那个可能过期的假证件
            location.href = '/login'; // 🌟 暴力跳转到登录页
            return Promise.reject('请先登录');
        }
        return Promise.reject(error);
    }
)

export default request