import React from 'react'
import AddForm from './addForm'
import UpdateForm from './updateForm'
import { reqCategoryList, reqUpdateCategory, reqAddCategory } from '../../../api/index'
import { Card, Button, Icon, Table, Modal, message } from 'antd'

class Category extends React.Component {
    state = {
        categoryList: [],//一级分类列表数据
        subCategoryList: [],//二级分类列表数据
        loading: false,
        parentId: '0',//一级/二级分类列表ID
        parentName: '',//分类列表名
        isShow: 0, //标识显示对象，0不显示，1显示新增确认框，2显示修改分类框
        page:1
    }
    columns = [
        {
            title: '分类名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            key: 'operation',
            width: 300,
            render: (item) => (
                <div>
                    <Button type='link' style={{ marginRight: -20 }} onClick={() => this.updateCategory(item)}>修改分类</Button>
                    {
                        this.state.parentId === '0' ? <Button type='link' onClick={() => this.showSubcategory(item)}>查看子分类</Button> : null
                    }
                </div>
            )
        }
    ]

    //获取一级/二级分类列表数据
    getCategoryList = async (Id) => {
        this.setState({ loading: true })
        //如果id有值取id值，没有取this.state.parentId值
        const parentId = Id || this.state.parentId
        const response = await reqCategoryList(parentId)
        this.setState({ loading: false })
        if (response.status === 0) {
            const category = response.data
            if (parentId === '0') {
                //更新一级分类列表数据
                this.setState({ categoryList: category })
            } else {
                //更新二级分类列表数据
                this.setState({ subCategoryList: category })
            }
        } else {
            message.error('获取分类列表数据失败')
        }
    }

    //显示子分类列表并进入
    showSubcategory = (category) => {
        //setState()方法是异步的，若想同步可以添加一个回调函数作为第二参数
        this.setState({ parentId: category._id, parentName: category.name }, () => {
            this.getCategoryList()
        })

    }

    //返回一级分类列表
    goBackCategory = () => {
        this.setState({ parentId: '0', subCategoryList: [], parentName: '' })
    }

    //更新分类列表
    updateCategory = (category) => {
        this.categoryName = category.name
        this.categoryId = category._id
        this.setState({ isShow: 2 })
    }

    //新增分类列表
    addCategory = () => {
        this.setState({ isShow: 1 })
    }

    //提交修改分类列表
    submitUpdateCategory = () => {
        // const categoryName =this.form.getFieldValue('categoryName')
        this.form.validateFields(async (err, values) => {
            const categoryId = this.categoryId
            if (!err) {
                const { categoryName } = values
                const response = await reqUpdateCategory({ categoryId, categoryName })
                this.setState({ isShow: 0 })
                this.form.resetFields()
                if (response.status === 0) {
                    this.getCategoryList()
                } else {
                    message.error('修改分类失败')
                }
            }
        })

    }

    //提交添加分类列表
    submitAddCategory = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const { parentId, categoryName } = values
                const response = await reqAddCategory(parentId, categoryName)
                this.setState({ isShow: 0 })
                this.form.resetFields()
                if (response.status === 0) {
                    if (parentId === this.state.parentId) {
                        //如果添加当前子分类，刷新当前子分类
                        this.getCategoryList()
                    } else if (parentId === '0') {
                        //如果在二级分类下添加一级分类，则刷新一级分类列表
                        this.getCategoryList('0')
                    }
                } else {
                    message.error('添加分类失败')
                }
            }
        })

    }

    componentDidMount() {
        this.getCategoryList()
    }


    render() {
        const { categoryList, loading, subCategoryList, parentId, isShow, parentName } = this.state
        const title = parentId === "0" ? '一级分类列表' : (
            <div>
                <Button type='link' onClick={this.goBackCategory} style={{ fontSize: 15, paddingLeft: 0 }}>一级分类列表</Button>
                <Icon type='arrow-right' style={{ marginRight: 15 }} />
                {parentName}
            </div>
        )
        return (
            <div className='category'>
                <Card
                    title={title}
                    extra={
                        <Button type='primary' onClick={this.addCategory}>
                            <Icon type='plus' />新增</Button>}
                >
                    <Table
                        bordered
                        rowKey='_id'
                        loading={loading}
                        columns={this.columns}
                        dataSource={parentId === '0' ? categoryList : subCategoryList}
                        //不指定pagination默认使用自带的分页格式
                        pagination={{ 
                            current:this.state.page,
                            pageSize: 4, 
                            showQuickJumper: true,
                            onChange:page=>{
                                this.setState({page})
                            }
                        }}

                    />
                </Card>
                <Modal
                    title='新增分类'
                    visible={isShow === 1}
                    onCancel={() => {
                        this.form.resetFields();
                        this.setState({ isShow: 0 })
                    }
                    }
                    onOk={this.submitAddCategory}
                >
                    <AddForm
                        category={categoryList}
                        parentId={parentId}
                        getFormData={(formDate) => this.form = formDate}
                    />
                </Modal>
                <Modal
                    title='修改分类'
                    visible={isShow === 2}
                    onCancel={() => {
                        this.form.resetFields();
                        this.setState({ isShow: 0 })
                    }
                    }
                    onOk={this.submitUpdateCategory}
                >
                    <UpdateForm
                        categoryName={this.categoryName}
                        getFormData={(formDate) => this.form = formDate}
                    />
                </Modal>
            </div>
        )
    }
}
export default Category;