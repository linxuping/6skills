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
      require('./components/activities')
    ]
  }]
}


render((
    <Router history={hashHistory}
            routes={rootRoute}/>
  ), document.getElementById("app")
)
