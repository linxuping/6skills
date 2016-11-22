/**
 * 活动详情
 * @type
 */
const detailRoute = {
  path: ':actid',
  getComponents(nextState, cb){
    require.ensure([], (require) => {
      cb(null, require('./detail.jsx').default)
    }, 'detail')
  }
}

/**
 * 活动列表
 * @type {Object}
 */
module.exports = {
  path: '/activities',
  indexRoute: {
    getComponent(nextState, cb){
      require.ensure([], (require)=>{
        cb(null, require('./list.spec.jsx').default)
      }, "list")
    }
  },
  childRoutes: [
    detailRoute,
    // analysisRoute
  ]
}
