import React from 'react'
import { Layout } from 'antd'
import Header from '../../component/Header'
import SiderNav from '../../component/SiderNav'
import { Redirect } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
const { Sider, Content, Footer } = Layout

class Admin extends React.Component {
  render() {
    // console.log('this.props.location',this.props.location)
    const usersInfo = memoryUtils.usersInfo
    if (!usersInfo._id) {
      //render()方法中自动跳转用Redirect标签，事件回调函数或操作中自动跳转用history的方法，
      //如history.replace（'/'） history.push（'/'）
      return <Redirect to='/login' />
    }
    return (
      <Layout>
        <Sider style={{ height: '100vh',position:'fixed',left:0}}>
          <SiderNav />
        </Sider>
        <Layout style={{marginLeft:200}}>
          <Header />
          <Content
            style={{ backgroundColor: '#fff', margin: '20px 15px 0px' }}>
            {this.props.children}
          </Content>
          <Footer style={{ textAlign: 'center', fontSize: 16 }}>
            <span>Made with ❤ by flows1314</span>
          </Footer>
        </Layout>
      </Layout>
    )
  }
}
export default Admin;