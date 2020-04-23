import React from 'react'
import CreateRole from './addRoleForm'
import SetRole from './settingRole'
import utils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import formateDate from '../../utils/timeDateUtils'
import { reqRole, reqCreateRole, reqUpdateRole } from '../../api'
import { Card, Button, Icon, Table, Modal, message } from 'antd';
class User extends React.Component {

    state = {
        roles: [],//所有角色列表
        role: {},//指定角色对象,
        selectedRowKeys: [],
        isVisible: false,
        isSeting: false
    }

    constructor(props) {
        super(props)
        this.ref = React.createRef()
    }

    initcolumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            }, {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formateDate
            }, {
                title: '授权人',
                dataIndex: 'auth_name'
            }, {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            }
        ]
    }

    //获取角色列表
    getRoleList = async () => {
        const result = await reqRole()
        if (result.status === 0) {
            const roles = result.data
            this.setState({ roles })
        }
    }

    //设置行属性
    onRow = (record, index) => {
        return {
            onClick: () => {
                const selectedRowKeys = [record._id]
                // console.log('selectedRowKeys', selectedRowKeys)
                this.setState({ selectedRowKeys, role: record })
            }
        }
    }

    //点击创建角色
    handCreate = () => {
        this.setState({ isVisible: true })
    }

    //提交创建的角色
    submitCreateRole = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const result = await reqCreateRole(values.name)
                this.form.resetFields()
                if (result.status === 0) {
                    // this.getRoleList()//方法一，直接获取角色列表
                    //方法二，将新产生的角色添加到已有的角色数组中,
                    //react建议最好不要直接操作原有数据，可生成一个新数据
                    //在原有的数据基础上操作（如：添加），推荐使用setState（）的函数方式，结果返回一个对象
                    //setState（）的对象方式，用于更新的数据更原有数据没有更新，如：替换
                    const role = result.data
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                    this.setState({ isVisible: false })
                    message.success('角色创建成功！')
                } else {
                    message.success('角色创建失败！')
                }
            }
        })
    }

    //点击设置角色
    handleSetting = () => {
        this.setState({ isSeting: true })
    }

    //提交角色权限
    submitSettingRole = async () => {
        const role = this.state.role
        const auth_name = utils.usersInfo.username
        const auth_time = Date.now()
        const menus = this.ref.current.getMenus()
        role.menus = menus
        role.auth_name = auth_name
        role.auth_time = auth_time
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            /*判断当前登录用户的角色是否等于现在操作的角色 */
            if (role._id === utils.usersInfo.role._id) {
                utils.usersInfo = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前登录用户权限已更改，请重新登录！')
            } else {
                this.getRoleList()
                this.setState({ isSeting: false })
                message.success('权限设置成功')
            }
        } else {
            message.error('权限设置失败')
        }
    }

    componentWillMount() {
        this.initcolumn()
    }

    componentDidMount() {
        this.getRoleList()
    }

    render() {
        const { roles, role, selectedRowKeys, isVisible, isSeting } = this.state
        const title = (
            <div>
                <Button type='primary' style={{ marginRight: 3 }} onClick={this.handCreate}>
                    <Icon type='plus' />
                    <span>创建角色</span>
                </Button>
                <Button type='primary' disabled={!role._id} onClick={this.handleSetting}>{/*//选中时role._id有值*/}
                    <Icon type='setting' />
                    <span>设置角色权限</span>
                </Button>
            </div>
        )

        //配置rowSelection
        const rowSelection = {
            selectedRowKeys,
            type: 'radio',
            // onSelect:(record, selected, selectedRows, nativeEvent)=>{
            //     console.log('record',record)
            //     console.log('selected',selected)
            //     console.log('selectedRows',selectedRows)
            // }
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys, role: selectedRows[0] })
            }
        }
        return (
            <div>
                <Card title={title}>
                    <Table
                        bordered
                        rowKey='_id'//如果表格行 key 的取值指定，则selectedRowKeys只能是key，否则是index索引值
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={roles}
                        pagination={{ defaultPageSize: 4 }}
                        onRow={this.onRow}
                    />
                </Card>
                <Modal
                    title='创建角色'
                    visible={isVisible}
                    onOk={this.submitCreateRole}
                    onCancel={() => this.setState({ isVisible: false })}
                >
                    <CreateRole setForm={form => this.form = form} />
                </Modal>
                <Modal
                    title='设置角色权限'
                    visible={isSeting}
                    onOk={this.submitSettingRole}
                    onCancel={() => this.setState({ isSeting: false })}
                >
                    <SetRole role={role} ref={this.ref} />
                </Modal>
            </div>

        )
    }
}
export default User;