import React from 'react'
import { Form, Input, Tree } from 'antd';
import menuList from '../../config/menuConfig'
const { TreeNode } = Tree;
class SetRole extends React.Component {
    constructor(props){
        super(props)
        const {menus}=this.props.role
        this.state={
            checkedKeys:menus
        }
    }

    //获取树节点
    getTreeNodes = (menuList) => {
        //方式一.reducer()
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        }, [])
        //方式二.map()
        // return menuList.map((item) => {
        //     return (
        //         <TreeNode title={item.title} key={item.key}>
        //             {item.children ? this.getTreeNodes(item.children) : null}
        //         </TreeNode>
        //     )
        // })
    }

    //为父级提供数据
    getMenus=()=>{
        return this.state.checkedKeys
    }

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    //会在已挂载的组件接收新的 props 之前被调用,render()方法前执行，如果你需要更新状态以响应 
    //prop 更改你可以比较 this.props 和 nextProps 并使用 this.setState() 执行 state 转换。
    componentWillReceiveProps(nextProps){
        const {menus}=nextProps.role
        this.setState({checkedKeys:menus})
    }

    render() {
        const role = this.props.role
        const {checkedKeys}=this.state
        console.log('modal',checkedKeys)

        const formLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        }
        return (
            <Form {...formLayout}>
                <Form.Item label='角色名称'>
                    <Input disabled value={role.name} />
                </Form.Item>
                <Form.Item label='权限管理'>
                    <Tree
                        checkable
                        defaultExpandAll={true}
                        checkedKeys={checkedKeys} //默认选中复选框的树节点
                        // defaultSelectedKeys={['/products']} //默认选中的树节点
                        onCheck={(checkedKeys)=>this.setState({checkedKeys})}
                    >
                        <TreeNode title='平台权限' key='all'>
                            {this.treeNodes}
                        </TreeNode>
                    </Tree>
                </Form.Item>
            </Form>
        )

    }
}
export default SetRole;