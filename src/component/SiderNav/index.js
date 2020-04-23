import React from 'react'
import './index.less'
import memoryUtils from '../../utils/memoryUtils'
import { Link, withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { Menu, Icon } from 'antd'
import sideNavLogo from '../../assets/siderNav.svg'
const { SubMenu } = Menu;

class Sider extends React.Component {

    /* 判断当前登录用户是否有item权限*/
    hasAuth = (item) => {
        const { key, isPublic } = item
        const username = memoryUtils.usersInfo.username
        const menus = memoryUtils.usersInfo.role.menus
        //1、当前用户是超级管理员admin时，获取所有权限
        //2、根据当前登录的用户权限匹配是否有item权限
        //3、item权限是公开的，所有用户都可拥有
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if(item.children) {
            //4、如果当前用户有此item的某个子item权限
            return !!item.children.find(child=>menus.indexOf(child.key) !== -1)
        }
        return false
    }


    //获取菜单列表
    getMenuNodes = (menuList) => {
        return menuList.map((item) => {
            //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置
            const path = this.props.location.pathname
            if (this.hasAuth(item)) {
                if (item.children) {
                    if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) {
                        this.openKey = item.key
                    }
                    return (
                        <SubMenu
                            key={item.key}
                            title={<span><Icon type={item.icon} />{item.title}</span>}
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
                return (
                    <Menu.Item key={item.key}>
                        {<Link to={item.key}><Icon type={item.icon} />{item.title}</Link>}
                    </Menu.Item>
                )
            }

        })
    }

    componentWillMount() {
        this.getMenuNodes = this.getMenuNodes(menuList)
    }

    render() {
        let selectedKeys = this.props.location.pathname
        if (selectedKeys.indexOf('/product') === 0) {
            selectedKeys = '/product'
        }
        const openKey = this.openKey

        return (
            <div className='sider'>
                <div className='sider-title'>
                    <img src={sideNavLogo} alt="sideNavLogo" />
                    <span>FLOWS管理系统</span>
                </div>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[selectedKeys]}
                    defaultOpenKeys={[openKey]}
                >
                    {this.getMenuNodes}
                </Menu>
            </div>
        )
    }
}
export default withRouter(Sider);