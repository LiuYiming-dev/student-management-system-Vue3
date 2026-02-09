import request from "@/utils/request.js";

export const updatePassword = (data) => {
    return request({url: '/user/password', method:'put', data})
}