import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from './pages/Login/Login'
import Admin from './pages/Admin/Admin'
import Home from './pages/Home/home'
import Category from './pages/Products/Category'
import Product from './pages/Products/Product'
import User from './pages/User/user'
import Role from './pages/Role/role'
import Bar from './pages/Charts/bar'
// import AddUpdate from './pages/Products/Product/addUpdate'
// import Detail from './pages/Products/Product/detail'

class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route path='/login' component={Login}/>
					<Route path='/' render={() =>
						<Admin>
							<Switch>
								<Route path='/home' component={Home}/>
								<Route path='/category' component={Category}/>
								<Route path='/product' component={Product}/>
								{/* <Route path='/product' render={()=>(
									<Product>
										<Switch>
											<Route path='/product' component={Home} exact/>
											<Route path='/product/detail' component={Detail}/>
											<Route path='/product/addupdate' component={AddUpdate}/>
											<Redirect to='/product'/>
										</Switch>
									</Product>
								)}/> */}
								<Route path='/user' component={User}/>
								<Route path='/role' component={Role}/>
								<Route path='/charts/bar' component={Bar}/>
								<Redirect to='/home'/>
							</Switch>
						</Admin>
					} />
				</Switch>
			</BrowserRouter >
		)
	}
}
export default App;
