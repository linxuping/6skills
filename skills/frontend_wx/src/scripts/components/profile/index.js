/**
 * 已报名活动
 * @type {Object}
 */
const activitiesRoute = {
  path: "activities",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./activities.jsx').default)
    }, "profile.activities")
  }
}

/**
 * 收藏活动
 * @type {Object}
 */
const collectionsRoute = {
  path: "collections",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./collections.jsx').default)
    }, "profile.collections")
  }
}

/**
 * 未付款
 * @type {Object}
 */
const notPaymentsRoute = {
  path: "non-payments",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./activities.jsx').default)
    }, "profile.activities")
  }
}

const refundRoute = {
  path: "refunds",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./refunds.jsx').default)
    }, "profile.refunds")
  }
}

/**
 * 用户信息
 * @type
 */
module.exports = {
  path: "/profile",
  indexRoute: {
    getComponent(nextState, cb){
      require.ensure([], (require)=>{
        cb(null, require('./me.jsx').default)
      }, "me")
    }
  },
  childRoutes: [
    activitiesRoute,
    collectionsRoute,
    notPaymentsRoute,
    refundRoute
  ]
}
