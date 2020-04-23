import React from 'react'
import { Card, Button, Icon, Table, Modal, message } from 'antd';
import { reqUser, reqDeleteUser, reqAddorUpdateUser } from '../../api'
import AddUser from './addUser'
import formateDate from '../../utils/timeDateUtils'
class User extends React.PureComponent {
    state = {
        users: [],//所有用户
        roles: [],//所有角色
        isVisible: false,
        user:{}
    }

    initcolumn = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            }, {
                title: '邮箱',
                dataIndex: 'email',
            }, {
                title: '电话',
                dataIndex: 'phone'
            }, {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            }, {
                title: '所属角色',
                dataIndex: 'role_id',
                // render:(role_id)=>this.state.roles.find(role=>role._id===role_id).name
                render: (role_id) => this.role[role_id]//变量类型的对象可以这种方式
            }, {
                title: '操作',
                render: (user) => (
                    <div>
                        <Button
                            type='link'
                            style={{ margin: '0 -20px' }}
                            onClick={() => this.updateUser(user)}
                        >
                            <span>修改</span>
                        </Button>
                        <Button
                            type='link'
                            onClick={() => this.deleteUser(user)}
                        >
                            <span>删除</span>
                        </Button>
                    </div>
                )
            }
        ]
    }

    //初始化获取用户列表
    getUser = async () => {
        const result = await reqUser()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.role = roles.reduce((pre, role) => {
                pre[role._id] = role.name
                return pre
            }, {})
            this.setState({ users, roles })
        }
    }

    //新增用户
    createUser = () => {
        this.setState({ isVisible: true,user:{} })
    }

    //提交新增用户
    submitUser = () => {
        this.form.validateFields(async (err, value) => {
            if (!err) {
                const {user}=this.state                
                if(user._id){
                    value._id=user._id
                }
                const result = await reqAddorUpdateUser(value)
                if (result.status === 0) {
                    message.success(`${user._id ? '修改用户成功！':'新增用户成功！'}`)
                    this.getUser()
                    this.form.resetFields()
                    this.setState({ isVisible: false })
                } else {
                    message.error(`${result.msg}，请重新添加！`)
                }
            }
        })
    }

    //删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: '提示！',
            content: `你确定要删除用户${user.username}吗？`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功！')
                    this.getUser()
                } else {
                    message.error('删除用户失败！')
                }
            }
        })
    }

    //修改用户
    updateUser = (user) => {        
        this.setState({
            isVisible: true,
            user
        })

    }

    componentWillMount() {
        this.initcolumn()
    }

    componentDidMount() {
        this.getUser()
    }

    render() {
        const title = (
            <Button type='primary' onClick={this.createUser}>
                <Icon type='plus' />
                <span>创建用户</span>
            </Button>
        )

        const { users, isVisible, roles} = this.state
        const user = this.state.user || {}
        return (
            <div>
                <Card title={title}>
                    <Table
                        bordered
                        rowKey='_id'//如果表格行 key 的取值指定，则selectedRowKeys只能是key，否则是index索引值
                        columns={this.columns}
                        dataSource={users}
                        pagination={{ defaultPageSize: 4 }}
                    />
                </Card>
                <Modal
                    title={user._id ? '修改用户':'新增用户'}
                    visible={isVisible}
                    onOk={this.submitUser}
                    onCancel={() => {
                        this.setState({ isVisible: false })
                        this.form.resetFields()
                    }}
                >
                    <AddUser
                        user={user}
                        roles={roles}
                        setForm={form => this.form = form}
                    />
                </Modal>
            </div>

        )
    }
}
export default User;