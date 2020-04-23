import React from 'react'
import './login.less'
import { resLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import logo from '../../assets/images/logo.png'
import { Icon, Input, Button, Form, message } from 'antd'
import { Redirect } from 'react-router-dom'
class Login extends React.Component {

  //对密码自定义校验
  validatorpdw = (rule, value, callback) => {
    if (!value) {
      callback('密码不能为空！')
    } else if (value.length < 3) {
      //字符串可以调用length获取字符长度
      callback('密码不能小于3位')
    } else if (value.length > 10) {
      callback('密码不能大于10位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是字母数字下划线')
    } else {
      callback()//无参数时，校验通过
    }
  }


  //登录提交
  handleSubmit = (e) => {
    //阻止事件的默认行为
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      //校验成功
      if (!err) {
        const { username, password } = values
        const result = await resLogin(username, password)//alt+<-返回
        if (result.status === 0) {
          //保存登录用户信息到memoryUtils内存中
          memoryUtils.usersInfo = result.data
          storageUtils.saveUser(result.data)
          message.success('登录成功')
          //push可以回退路由，如this.props.history.push('/')
          //登录成功时跳转
          this.props.history.replace('/')//replace不可以回退路由
        } else {
          //登录失败
          message.error(result.msg)
        }
      } else {
        //校验失败
        console.log('登录校验失败')
      }
    })
  }

  render() {
    //如果用户是已经登录，自动跳转到登录状态
    const usersInfo = memoryUtils.usersInfo
    if (usersInfo && usersInfo._id) {
      return <Redirect to='/' />
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="" />
          <span>React项目，后台管理系统</span>
        </header>
        <section className='login-content'>
          <h1>用户登录</h1>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item hasFeedback>
              {getFieldDecorator('username', {
                rules: [
                  //申明式验证:直接使用别人定义好的验证规则
                  { required: true, message: '用户名不能为空!' },
                  { min: 3, max: 11, message: '用户名长度为3-11位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是字母数字下划线' }
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="请输入你的用户名"
                />
              )}
            </Form.Item>
            <Form.Item hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  { //自定义校验
                    validator: this.validatorpdw
                  }
                ],
              })(
                <Input.Password
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="请输入你的密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              {/* 提交按钮，自动执行form上的onsubmit方法，设置htmlType="submit"属性 */}
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
export default Form.create()(Login);