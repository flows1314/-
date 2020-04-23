//保存登录数据到localstorage中
import store from 'store'
const USER_KEY = 'user_key'
export default {
    //保存数据
    saveUser(user) {
        store.set(USER_KEY, user)
    },
    //读取数据
    getUser() {
        return store.get(USER_KEY) || {}
    },
    //删除数据
    removeUser() {
        store.remove(USER_KEY)
    }
}

