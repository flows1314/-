import React from 'react'
import { Form, Input, Select } from 'antd'
const Option=Select.Option
class AddForm extends React.Component{

    getOption=(categoryList)=>{
        return categoryList.map((item)=>{
            return <Option value={item._id}>{item.name}</Option>
        })
    }

    componentDidMount(){
        const form=this.props.form
        this.props.getFormData(form)
    }
    render(){
        const {getFieldDecorator}=this.props.form
        const {category,parentId}=this.props
        return(
            <Form layout='horizontal'>
                <Form.Item label='所属分类'>
                    {getFieldDecorator('parentId',{
                        initialValue:parentId
                    })(
                        <Select>
                            <Option value='0'>一级分类</Option>
                            {this.getOption(category)}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label='分类名称'>
                    {getFieldDecorator('categoryName',{
                        initialValue:'',
                        rules:[{required:true,message:'分类名称必须添加'}]
                    })(
                        <Input placeholder='请输入要添加的分类名称'/>
                    )}
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)