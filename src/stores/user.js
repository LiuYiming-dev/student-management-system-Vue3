import { defineStore } from 'pinia'
import { ref } from 'vue'

// 🌟 定义一个名为 'user' 的仓库
export const useUserStore = defineStore('user', () => {
    const cacheUser = JSON.parse(localStorage.getItem('user_info') || '{}')

    const userInfo = ref({
        id: cacheUser.id || null,
        username: cacheUser.username || '',
        nickname: cacheUser.nickname || '访客' // 默认值
    })

    // 2. 定义行为 (Action) - 相当于修改数据的方法
    const setUserInfo = (data) => {
        userInfo.value = data
        localStorage.setItem('user_info', JSON.stringify(data))
    }

    // 3. 退出登录时清理
    const clearUserInfo = () => {
        userInfo.value = {id: null, username: '', nickname: '访客'}
        localStorage.removeItem('user_info')
    }

    // 🌟 必须 return 出去，外部才能访问
    return {userInfo, setUserInfo, clearUserInfo}
});