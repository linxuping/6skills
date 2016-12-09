import React from "react"
import { render } from "react-dom"
import { Router, Route, hashHistory } from "react-router"
import mobileUtils from './common/fixscreen'
import 'weui';

mobileUtils.fixScreen(window, document)

require('css/style.less');

const rootRoute = {
  childRoutes: [{
    path: "/",
    component: require("./components/layout.jsx").default,
    indexRoute: {
      getComponent(nextState, cb){
        require.ensure([], (require)=>{
          cb(null, require('./components/home/home.jsx').default)
        }, "index")
      }
    },
    childRoutes: [
      require('./components/activities'),
      require('./components/profile'),
      require('./components/contact'),
      require('./components/404')  //must be put at the end
    ]
  }]
}


render((
    <Router history={hashHistory}
            routes={rootRoute}/>
  ), document.getElementById("app")
)
