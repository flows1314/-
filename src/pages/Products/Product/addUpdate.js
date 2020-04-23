import React from 'react'
import RichTextEditor from './richTextEditor'
import PicturesWall from './pictureswall'
import { reqCategoryList ,reqUpdateorAddProduct} from '../../../api'
import { Card, Icon, Form, Input, Button, Cascader, message} from 'antd';
const TextArea = Input.TextArea

class ProductUpdate extends React.Component {
    state = {
        options: []
    }

    //在构造函数中申明ref容器this.myRef
    constructor(props){
        super(props)
        this.myRef=React.createRef()
        this.myDraft=React.createRef()
    }

    //自定义校验规则
    validator = (rule, value, callback) => {
        // console.log(value, typeof (value * 2))
        if (value * 1 > 0) {//将字符串格式的数字转换成数字格式，乘以数字
            callback()
        } else {
            callback('价格不能小于0')
        }
    }

    //提交表单数据
    submitForm = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                //1，收集数据
                let pCategoryId
                let categoryId
                const {name,desc,price,category}=values
                const detail=this.myDraft.current.getDraftToHtml()
                const imgs=this.myRef.current.getImgsName()

                console.log(imgs)

                if(category.find((item)=>item===item[0])){
                    pCategoryId='0'
                    categoryId=category[0]
                }else{
                    pCategoryId=category[0]
                    categoryId=category[1]
                }
                const product={name,desc,price,detail,imgs,pCategoryId,categoryId}
                //2，调用接口发送请求（添加/更新）
                if(this.flag){//this.flag存在，说明是更改操作
                    product._id=this.product._id
                }                
                const result =await reqUpdateorAddProduct(product)
                if(result.status===0){
                    message.success(`${product._id ? '修改':'新增'}成功`)
                    this.props.history.goBack()
                }else{
                    message.success(`${product._id ? '修改':'新增'}失败`)
                }
            }
        })
    }

    //用于动态加载选项
    loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        //asyns函数返回的是一个新的promise对象，对象值是返回的结果
        const categorys = await this.getOptions(targetOption.value)
        if (categorys && categorys.length > 0) {//返回的二级数据不为空且大于0
            this.childOptions = categorys.map((category) => ({
                value: category._id,
                label: category.name
            }))
        } else {
            targetOption.isLeaf = true
        }
        setTimeout(() => {
            targetOption.loading = false;
            targetOption.children = this.childOptions
            this.setState({
                options: [...this.state.options],
            })
        }, 1000)
    }

    //获取级联选择一级/二级数据
    getOptions = async (parentId) => {
        const result = await reqCategoryList(parentId)
        if (result.status === 0) {
            const category = result.data
            if (parentId === '0') {//一级级联列表
                const options = category.map((item) => ({
                    value: item._id,
                    label: item.name,
                    isLeaf: false,
                }))
                this.setState({ options })
                //在商品修改界面时，根据父id查询对应的二级商品值
                if (this.flag && this.product.pCategoryId !== '0') {
                    const pCategoryId = this.product.pCategoryId || {}
                    const subCategory = await this.getOptions(pCategoryId)
                    const childOptions = subCategory.map((item) => ({
                        value: item._id,
                        label: item.name,
                    }))
                    //find() 方法返回通过测试（函数内判断条件为true）的数组的第一个元素的值。
                    //find() 方法为数组中的每个元素都调用一次函数执行：
                    //当数组中的元素在测试条件时返回 true 时, find() 返回符合条件的元素，之后的值不会再调用执行函数。
                    //如果没有符合条件的元素返回 undefined
                    const targetOption = options.find(item => item.value === pCategoryId)
                    targetOption.children = childOptions
                    this.setState({
                        options
                    })
                }
            } else {//二级级联列表
                return category
            }
        }
    }

    componentDidMount() {
        this.getOptions('0')
    }

    componentWillMount() {
        this.category = []
        this.product = this.props.location.state
        this.flag = !!this.product//在修改商品组件中生成一个bool类型的标志位
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { name, desc, price, categoryId, pCategoryId,imgs ,detail} = this.product || {}
        //判断是修改时的一级分类还是二级分类
        if (this.flag && pCategoryId === '0') {
            this.category.push(categoryId)
        } else if (this.flag && pCategoryId !== '0') {
            this.category.push(pCategoryId)
            this.category.push(categoryId)
        }
        const formLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 7 }
        }

        const title = (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon
                    type='arrow-left'
                    style={{ color: 'green', fontSize: 20, marginRight: 18 }}
                    onClick={() => this.props.history.goBack()}
                />
                <span>{this.flag ? '修改商品' : '添加商品'}</span>
            </div>
        )

        return (
            <Card title={title}>
                <Form {...formLayout}>
                    <Form.Item label='商品名称'>
                        {getFieldDecorator('name', {
                            initialValue: name,
                            rules: [
                                { required: true, message: '商品名不能为空' }
                            ]
                        })(
                            <Input placeholder='请输入商品名称' />
                        )}
                    </Form.Item>
                    <Form.Item label='商品描述'>
                        {getFieldDecorator('desc', {
                            initialValue: desc,
                            rules: [
                                { required: true, message: '商品描述不能为空' }
                            ]
                        })(
                            <TextArea autoSize={{ minRows: 1, maxRows: 3 }} placeholder='请输入商品描述' />
                        )}
                    </Form.Item>
                    <Form.Item label='商品价格'>
                        {getFieldDecorator('price', {
                            initialValue: price,
                            rules: [
                                { required: true, message: '商品价格不能为空' },
                                { validator: this.validator }
                            ]
                        })(
                            <Input type='number' addonAfter="元" placeholder='请输入商品价格' />
                        )}
                    </Form.Item>
                    <Form.Item label='商品分类'>
                        {getFieldDecorator('category', {
                            initialValue: this.category,
                            rules: [
                                { required: true, message: '商品分类不能为空' },
                            ]
                        })(
                            <Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                                placeholder='请选择商品分类'
                            />
                        )}
                    </Form.Item>
                    <Form.Item label='商品图片'>
                        <PicturesWall ref= {this.myRef} imgs={imgs}/>
                    </Form.Item>
                    <Form.Item label='商品详情' labelCol= {{ span:3 }} wrapperCol={{ span:21 }}>
                        <RichTextEditor ref={this.myDraft} detail={detail}/>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type='primary'
                            style={{ marginLeft: 123 }}
                            onClick={this.submitForm}
                        >
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductUpdate);

//子组件调用父组件的方法：将父组件的方法已函数属性的形式传递给子组件，子组件就可以调用
//父组件调用子组件的方法：在父组件中通过ref得到子组件中的属性和方法