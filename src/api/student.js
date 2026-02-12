import request from '@/utils/request'

// 分页查询
export const getStudentPage = (params) => {
    return request({ url: '/student/page', method: 'get', params })
}

// 新增
export const addStudent = (data) => {
    return request({ url: '/student/add', method: 'post', data })
}

// 修改
export const updateStudent = (data) => {
    return request({ url: '/student/update', method: 'put', data })
}

// 删除
export const deleteStudent = (id) => {
    return request({ url: `/student/delete/${id}`, method: 'delete' })
}

export const exportStudent = () => {
    return request({ url: `/student/export`, method: 'get' , responseType:"blob"})
}

export const importStudent = (data) => {
    return request({
        url: `/student/import`, method: 'post', data: data, headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

