/**
 * 活动详情
 * @type
 */
const detailRoute = {
  path: ':actid',
  getComponents(nextState, cb){
    require.ensure([], (require) => {
      cb(null, require('./detail.jsx').default)
    }, 'activity.detail')
  }
}

const signupRoute = {
  path: ':actid/signup',
  getComponents(nextState, cb){
    require.ensure([], (require) => {
      cb(null, require('./signup/signup.jsx').default)
    }, 'activity.signup')
  }
}

const comfirmRoute = {
  path: ':actid/signup-confirm',
  getComponents(nextState, cb){
    require.ensure([], (require) => {
      cb(null, require('./signup/confirm.jsx').default)
    }, 'activity.signup.confirm')
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
      }, "activity.list")
    }
  },
  childRoutes: [
    detailRoute,
    signupRoute,
    comfirmRoute
  ]
}
