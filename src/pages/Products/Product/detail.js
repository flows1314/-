import React from 'react'
import { Card, Icon, List } from 'antd'
import { reqCategorys } from '../../../api'
class ProductDetail extends React.Component {
    state = {
        cName1: '',//一级分类名称
        cName2: ''//二级分类名称
    }

    title = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon
                type='arrow-left'
                style={{ color: '#1DA57A', marginRight: 15, fontSize: 25 }}
                onClick={() => this.props.history.goBack()}
            />
            <span>商品详情</span>
        </div>
    )

    //查询商品分类
    getProductCategorys = async () => {
        const { categoryId, pCategoryId } = this.props.location.state
        if (pCategoryId === '0') {
            //一级分类下的商品详情
            const result = await reqCategorys(categoryId)
            const cName1 = result.data.name
            this.setState({ cName1 })
        } else {
            //二级分类下的商品详情
            //Promise.all（）方法，一次性发多个请求，只有都成功了，才正常处理
            const results = await Promise.all([reqCategorys(pCategoryId), reqCategorys(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({ cName1, cName2 })
        }
    }

    componentDidMount() {
        this.getProductCategorys()
    }

    render() {
        const { cName1, cName2 } = this.state
        const { name, desc, price, imgs, detail } = this.props.location.state
        return (
            <Card title={this.title} className='product-detail'>
                <List>
                    <List.Item>
                        <span className='product-detail-left'>商品名称：</span>
                        <span className='product-detail-right'>{name}</span>
                    </List.Item>
                    <List.Item>
                        <span className='product-detail-left'>商品描述：</span>
                        <span className='product-detail-right'>{desc}</span>
                    </List.Item>
                    <List.Item>
                        <span className='product-detail-left'>商品价格：</span>
                        <span className='product-detail-right'>{price}</span>
                    </List.Item>
                    <List.Item>
                        <span className='product-detail-left'>商品分类：</span>
                        <span className='product-detail-right'>
                            {cName1}{cName2 ? '-->' + cName2 : null}
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className='product-detail-left'>商品图片：</span>
                        <span className='product-detail-right'>
                            {imgs.map(item =>
                                <img
                                    src={`/upload/${item}`}
                                    alt='img'
                                    style={{ height: 80, width: 90 ,marginRight:5}}
                                />
                            )}
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className='product-detail-left'>商品详情：</span>
                        <span className='product-detail-right'
                            dangerouslySetInnerHTML={{ __html: detail }}
                        >
                        </span>
                    </List.Item>
                </List>
            </Card>
        )
    }
}
export default ProductDetail;