/**
 * 商务合作
 */
const businessRoute = {
  path: "business",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./business/index.jsx'))
    }, "contactus.business")
  }
}
/**
 * 联系我们
 */
module.exports = {
  path: "/contactus",
  indexRoute: {
    getComponent(nextState, cb){
      require.ensure([], (require)=>{
        cb(null, require('./contactus.jsx'))
      }, "contactus")
    }
  },
  childRoutes: [
    businessRoute
  ]
}
