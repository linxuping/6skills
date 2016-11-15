import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import {Link, Router, Route, hashHistory, IndexRoute} from 'react-router';


//import Layout from './components/layout.jsx';
// import Home from './components/superadmin/home.jsx';

// //activities
// import ActivitiesLayout from './components/activity/activities-layout.jsx';
// import AddActivity from './components/activity/add-activity.jsx';


const rootRoute = {
	path: "/",
	component: require('./components/layout.jsx').default,
	indexRoute:{
		getComponent(nextState, cb){
			require.ensure([], (require)=>{
				cb(null, require('./components/superadmin/home.jsx').default)
			}, 'home')
		}
	},
	childRoutes: [
		require('./components/activity'),
		require('./components/audit'),
		require('./components/refund'),
		require('./components/applicants')
	]
}


ReactDom.render((
		<Router history={hashHistory}
						routes={rootRoute}></Router>
	), document.getElementById('app')
)

// ReactDom.render((
//   <Router history={hashHistory}>
//     <Route path="/" component={Layout}>
//       <IndexRoute component={Home}/>
//       <Route path="/activities" component={ActivitiesLayout}>
//         <Route path="add" component={AddActivity}></Route>
//       </Route>
//     </Route>
//   </Router>
//   ), document.getElementById('app')
// );
