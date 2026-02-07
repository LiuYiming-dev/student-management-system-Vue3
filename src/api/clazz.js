import request from '@/utils/request'
export const getAllClazz = () => {
    return request({ url: '/clazz/all', method: 'get' })
}

export const getClazzPage = () => {
    return request({ url: '/clazz/page', method: 'get' })
}

