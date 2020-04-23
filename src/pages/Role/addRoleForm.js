import React from 'react'
import { Form ,Input} from 'antd';

class CreateRole extends React.Component {

    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 13 }
        }
        return (
            <Form {...formLayout}>
                <Form.Item label='角色名称'>
                    {getFieldDecorator('name', {
                        rules: [
                            { required: true, message: '角色不能为空' }
                        ]
                    })(
                        <Input placeholder='请输入角色名称' />
                    )}
                </Form.Item>
            </Form>
        )

    }
}
export default Form.create()(CreateRole);