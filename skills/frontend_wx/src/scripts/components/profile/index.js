/**
 * 已报名活动
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
 */
const notPaymentsRoute = {
  path: "non-payments",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./activities.jsx').default)
    }, "profile.activities")
  }
}

/**
 * 退款
 */
const refundRoute = {
  path: "refunds",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./refunds.jsx').default)
    }, "profile.refunds")
  }
}

/**
 * 退款理由
 */
const refundConfirmRoute = {
  path: "refunds/:pid",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./refund-confirm.jsx').default)
    }, "profile.refund.confirm")
  }
}

/**
 * 我的评论
 */
const myCommentsRoute = {
  path: "mycomments",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./comments.jsx').default)
    }, "profile.comments")
  }
}

/**
 * 评论
 */
const commentRoute = {
  path: "comment",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./addcomment.jsx').default)
    }, "profile.add.comment")
  }
}


/**
 * 认证
 */
const verifyRoute = {
  path: "verify",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./verify.jsx').default)
    }, "profile.verify")
  }
}

const signinfoRoute = {
  path: "signinfo/:signid",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./signinfo.jsx').default)
    }, "profile.signinfo")
  }
}


/**
 * 用户信息
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
    refundRoute,
    refundConfirmRoute,
    myCommentsRoute,
    commentRoute,
    verifyRoute,
    signinfoRoute
  ]
}
