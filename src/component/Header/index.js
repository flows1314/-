import React from 'react'
import './index.less'
import { Modal } from 'antd'
import { reqWeather } from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import formateDate from '../../utils/timeDateUtils'
import menuConfig from '../../config/menuConfig'
import LinkButton from '../../component/LinkButton/linkButton'
import { withRouter } from 'react-router-dom'

class Header extends React.Component {
    state = {
        dayPictureUrl: '',
        weather: '',
        dateTime: formateDate(Date.now()),
    }

    componentDidMount() {
        this.getWeather('武汉')
        this.updateTime()
    }

    //组件销毁前清除定时器
    componentWillUnmount() {
        clearInterval(this.Interval)
    }

    //获取天气信息
    getWeather = async (city) => {
        const response = await reqWeather(city)
        const { weather, dayPictureUrl } = response
        this.setState({
            weather,
            dayPictureUrl
        })
    }

    //实时更新时间
    updateTime = () => {
        this.Interval = setInterval(() => {
            this.setState({ dateTime: formateDate(Date.now()) })
        }, 1000)
    }


    //退出登录
    Logout = () => {
        Modal.confirm({
            title: '提示',
            content: '你确定要退出吗？',
            onOk: () => {
                storageUtils.removeUser()
                memoryUtils.usersInfo = {}
                this.props.history.replace('/login')
            }
        })
    }

    //查询主页标题
    getTitle=()=>{
        
        let title
        const path=this.props.location.pathname
        menuConfig.forEach((item)=>{
            if(item.key===path){
                title=item.title
            }else if(item.children){
                const citem=item.children.find(citem=>path.indexOf(citem.key)===0)
                if(citem){
                    title=citem.title
                }
            }
        })
        return title
        //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
        //如果要检索的字符串值没有出现，则该方法返回 -1
        //如果找到第一次出现的位置。则返回0
    }
  

    render() {
        const userName = memoryUtils.usersInfo.username
        const { weather, dayPictureUrl, dateTime } = this.state
        //每次加载组件render（）方法都会被调用
        const title=this.getTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎！{userName}</span>
                    {/* 函数式定义的组件，函数体中的内容，如：<span>退出</span>，
                    也会通过props属性传递给组件LinkButton的children */}
                    <LinkButton onClick={this.Logout}>
                        退出
                    </LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{dateTime}</span>
                        <img src={dayPictureUrl} alt="天气加载失败" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header);