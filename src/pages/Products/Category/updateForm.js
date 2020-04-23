import React from 'react'
import { Form, Input} from 'antd'
class UpdateForm extends React.Component{
    componentDidMount(){
        const form=this.props.form
        this.props.getFormData(form)
    }
    render(){
        const {getFieldDecorator}=this.props.form
        return(
            <Form>
                <Form.Item>
                    {getFieldDecorator('categoryName',{
                        initialValue:this.props.categoryName,
                        rules:[{required:true,message:'修改的分类名称必须输入'}]
                    })(
                        <Input placeholder='请输入要修改的分类名称'/>
                    )}
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create()(UpdateForm)