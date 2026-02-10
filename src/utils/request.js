import axios from 'axios'
import router from '@/router'
import { ElMessage, ElNotification } from 'element-plus'
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
        if (res.code === '200') {
            return res.data;
        } else {
            return Promise.reject(new Error(res.msg || 'Error'));
        }
    },
    error => {
        let message = '网络异常，请稍后再试'
        if (error.response) {
            const status = error.response.status
            switch (status) {
                case 401:
                    message = '身份已过期，请重新登录'
                    localStorage.removeItem('student_token'); // 清除掉那个可能过期的假证件
                    location.href = '/login'; // 🌟 暴力跳转到登录页
                    break
                case 403:
                    message = '权限不足：您没有权限执行此操作'
                    break
                case 404:
                    message = '请求的接口不存在'
                    break
                case 500:
                    message = '服务器内部错误，请联系管理员'
                    break
                default:
                    message = error.response.data?.msg || '系统异常'
            }
        }
        return Promise.reject(new Error(message));
    }
)

export default request