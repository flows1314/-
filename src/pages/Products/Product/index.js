import React from 'react'
import './product.less'
import Home from './home'
import Detail from './detail'
import AddUpdate from './addUpdate'
import {Route, Switch, Redirect} from 'react-router-dom'
class Product extends React.Component {
  
          
    render() {
        return (
            <div>
                {/* {this.props.children} */}
               <Switch>
                   <Route path='/product' component={Home} exact/>{/*路径完全匹配*/}
                   <Route path='/product/detail' component={Detail}/>
                   <Route path='/product/addupdate' component={AddUpdate}/>
                   <Redirect to='/product'/>
               </Switch>
            </div>
        )
    }
}
export default Product;