import request from '@/utils/request'

export const getDashboardData = () => {
    return request({ url: '/stat/dashboard', method: 'get' })
}