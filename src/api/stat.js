import request from '@/utils/request'

export const getDashboardData = () => {
    return request({ url: '/stat/dashboard', method: 'get' })
}

export const exportAll = () => {
    return request({ url: '/stat/export', method: 'get' , responseType:"blob"})
}