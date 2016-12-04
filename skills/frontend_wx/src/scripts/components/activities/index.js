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

/**
 * 报名
 */
const signupRoute = {
  path: ':actid/signup',
  getComponents(nextState, cb){
    require.ensure([], (require) => {
      cb(null, require('./signup/signup.jsx').default)
    }, 'activity.signup')
  }
}

/**
 * 报名信息确认
 */
const comfirmRoute = {
  path: ':actid/signup-confirm',
  getComponents(nextState, cb){
    require.ensure([], (require) => {
      cb(null, require('./signup/confirm.jsx').default)
    }, 'activity.signup.confirm')
  }
}

/**
 * 付款
 */
const payRoute = {
  path: ':actid/pay',
  getComponents(nextState, cb){
    require.ensure([], (require) => {
      cb(null, require('./pay/pay.jsx').default)
    }, 'activity.pay')
  }
}

const commentRoute = {
  path: ':actid/comment',
  getComponents(nextState, cb){
    require.ensure([], (require) => {
      cb(null, require('./comments/details.jsx').default)
    }, 'activity.comment.detail')
  }
}

/**
 * 活动列表
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
    comfirmRoute,
    payRoute,
    commentRoute
  ]
}
