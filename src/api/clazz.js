import request from '@/utils/request'
export const getAllClazz = () => {
    return request({ url: '/clazz/all', method: 'get' })
}

export const getClazzPage = (params) => {
    return request({ url: '/clazz/page', method: 'get', params})
}

