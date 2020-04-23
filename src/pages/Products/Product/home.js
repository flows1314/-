import React from 'react'
import { reqProductList, reqSearchProduct, reqUpdateStatus } from '../../../api'
import { PAGE_SIZE } from '../../../utils/pageSize'
import { Card, Select, Input, Button, Icon, Table } from 'antd';
const Option = Select.Option

class ProductHome extends React.Component {
    state = {
        list: [],
        total: 0,
        current:1,
        loading: false,
        searchProduct: '',
        searchType: 'productName'
    }

    columns = [
        {
            title: '商品名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '商品描述',
            dataIndex: 'desc',
            key: 'desc'
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: 90,
            render: (price) => ('￥' + price)
        },
        {
            title: '状态',
            key: 'status',
            width: 90,
            render: (items) => (
                <div>
                    <Button
                        type='primary'
                        onClick={() => this.handleState(items._id, items.status)}
                    >
                        {items.status === 1 ? '下架' : '上架'}
                    </Button>
                    <span>
                        {items.status === 1 ? '在售' : '已下架'}
                    </span>
                </div>
            )
        },
        {
            title: '操作',
            key: 'operation',
            width: 90,
            render: (state) => (
                <div>
                    <Button
                        type='link'
                        onClick={() => this.props.history.push('/product/detail', state)}
                    >
                        <span>详情</span>
                    </Button>
                    <Button
                        type='link'
                        onClick={() => this.props.history.push('/product/addupdate', state)}
                    >
                        <span>修改</span>
                    </Button>
                </div>)
        }
    ]

    //对商品进行上架/下架处理
    handleState = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status === 1 ? 2 : 1)
        if (result.status === 0) {
            this.getList(this.pageNum)
        }
    }

    //请求列表数据/分页改变的回调
    getList = async (pageNum) => {
        let result
        /* 保存pageNum，使分页时停留在当前数据页 */
        this.pageNum = pageNum || this.state.current
        console.log('this.state.current',this.pageNum)
        
        const { searchType, searchProduct } = this.state
        this.setState({ loading: true , current:pageNum})
        if (searchProduct) {
            //searchProduct搜索内容有值时，执行条件搜索
            result = await reqSearchProduct(this.pageNum, PAGE_SIZE, searchProduct, searchType)
        } else {
            //普通方式请求列表数据
            result = await reqProductList(this.pageNum, PAGE_SIZE)
        }
        this.setState({ loading: false })
        if (result.status === 0) {
            const { list, total } = result.data
            this.setState({ list, total })
        }
    }

    //按条件搜索
    handleSearch = () => {
        this.getList()
    }

    //添加商品
    addProducts = () => {
        this.props.history.push('/product/addupdate')
    }

    componentDidMount() {
        this.getList()
    }

    render() {
        const { list, total, loading, searchType, searchProduct,current } = this.state
        const title = (//受控组件
            <div>
                <Select
                    value={searchType}
                    style={{ width: 130 }}
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{ width: 200, margin: '0 3px' }}
                    value={searchProduct}
                    onChange={e => this.setState({ searchProduct: e.target.value })}
                />
                <Button type='primary' onClick={this.handleSearch}>搜索</Button>
            </div>
        )

        return (
            <Card
                title={title}
                extra={
                    <Button type='primary' onClick={this.addProducts}>
                        <Icon type='plus' />
                        <span>添加商品</span>
                    </Button>
                }
            >
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    columns={this.columns}
                    dataSource={list}
                    pagination={{
                        total,
                        current:this.pageNum,
                        // defaultCurrent: 1,
                        defaultPageSize: PAGE_SIZE,
                        showTotal: (total) => `总共${total}条数据`,
                        onChange: this.getList

                    }}
                />
            </Card>
        )
    }
}
export default ProductHome;