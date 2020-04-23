import React from 'react'
import { Form, Input, Select } from 'antd';
const Option = Select.Option
class AddUser extends React.Component {

    getOption = () => {
        this.Option = this.props.roles.map((role) => {
            return <Option value={role._id}>{role.name}</Option>
        })
    }

    componentWillMount() {
        this.getOption()
        this.props.setForm(this.props.form)
    }

    render() {
        const { user } = this.props
        const { getFieldDecorator } = this.props.form
        const formLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 13 }
        }
        return (
            <Form {...formLayout}>
                <Form.Item label='用户名'>
                    {getFieldDecorator('username', {
                        initialValue: user.username,
                        rules: [
                            { required: true, message: '用户名不能为空' }
                        ]
                    })(
                        <Input placeholder='请输入用户名' />
                    )}
                </Form.Item>
                {
                    user._id ? null : (
                        <Form.Item label='密码'>
                            {getFieldDecorator('password', {
                                rules: [
                                    { required: true, message: '密码不能为空' }
                                ]
                            })(
                                <Input placeholder='请输入密码' />
                            )}
                        </Form.Item>
                    )
                }

                <Form.Item label='手机号'>
                    {getFieldDecorator('phone', {
                        initialValue: user.phone
                    })(
                        <Input placeholder='请输入手机号码' />
                    )}
                </Form.Item>
                <Form.Item label='邮箱'>
                    {getFieldDecorator('email', {
                        initialValue: user.email
                    })(
                        <Input placeholder='请输入邮箱号' />
                    )}
                </Form.Item>
                <Form.Item label='角色'>
                    {getFieldDecorator('role_id', {
                        initialValue: user.role_id
                    })(
                        <Select placeholder='请选择角色'>
                            {this.Option}
                        </Select>
                    )}
                </Form.Item>
            </Form>
        )

    }
}
export default Form.create()(AddUser);