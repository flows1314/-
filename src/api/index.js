import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
export const resLogin = (username, password) => ajax('/login', { username, password }, 'POST')
// export const resAddUser=(username,password)=>ajax('/manage/user/add',{username,password},'POST')
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url, {}, (err, data) => {
            if (!err && data.status === 'success') {
                const { weather, dayPictureUrl } = data.results[0].weather_data[0]
                resolve({ weather, dayPictureUrl })
            } else {
                message.error('获取天气信息失败')
            }
        })
    })
}
//获取一级或某个二级分类列表
export const reqCategoryList=(parentId)=>ajax('/manage/category/list',{parentId})
//添加分类
export const reqAddCategory=(parentId,categoryName)=>ajax('/manage/category/add',{parentId,categoryName},'POST')
//更新分类/品类名称
export const reqUpdateCategory=({categoryId,categoryName})=>ajax('/manage/category/update',{categoryId,categoryName},'POST')
// 获取商品分页列表
export const reqProductList=(pageNum,pageSize)=>ajax('/manage/product/list',{pageNum,pageSize},'GET')
//根据 ID/Name 搜索产品分页列表,searchType可能是productName/productDesc
//利用[]将searchType的值作为变量属性名传入
export const reqSearchProduct=(pageNum,pageSize,searchProduct,searchType)=>
ajax('/manage/product/search',{pageNum,pageSize,[searchType]:searchProduct})
//根据分类id获取分类
export const reqCategorys=(categoryId)=>ajax('/manage/category/info',{categoryId},'GET')
//对商品进行上架/下架处理
export const reqUpdateStatus=(productId,status)=>ajax('/manage/product/updateStatus',{productId,status},'POST')
//删除图片
export const reqRemoveImgs=(name)=>ajax('/manage/img/delete',{name},'POST')
//更新商品/添加商品,product是产品数据对象
export const reqUpdateorAddProduct=(product)=>ajax(`/manage/product/${product._id ?'update':'add'}`,product,'POST')

//获取角色列表
export const reqRole=()=>ajax('/manage/role/list')

//创建角色
export const reqCreateRole=(roleName)=>ajax('/manage/role/add',{roleName},'POST')

//更新角色(给角色设置权限)
export const reqUpdateRole=(role)=>ajax('/manage/role/update',role  ,'POST')

//添加/修改用户
export const reqAddorUpdateUser=(user)=>ajax('/manage/user/'+(user._id ? 'update':'add'),user,'POST')

//获取所有用户列表
export const reqUser=()=>ajax('/manage/user/list')

//删除用户
export const reqDeleteUser=(userId)=>ajax('/manage/user/delete',{userId},'POST')



