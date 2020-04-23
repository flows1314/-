import React from 'react'
import './linkButton.less'
//函数式定义的组件，函数体中的内容，如：<span>退出</span>，
//也会通过props属性传递给组件的children，因此，不用写this.props.children
export default function LinkButton(props){
    return <button className='btn' {...props}></button>
}