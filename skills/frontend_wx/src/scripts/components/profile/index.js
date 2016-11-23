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

/**
 * 退款
 * @type
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
 * 我的评论
 * @type {Object}
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
 * @type {Object}
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
 * @type
 */
const verifyRoute = {
  path: "verify",
  getComponent(nextState, cb){
    require.ensure([], (require)=>{
      cb(null, require('./verify.jsx').default)
    }, "profile.verify")
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
    refundRoute,
    myCommentsRoute,
    commentRoute,
    verifyRoute
  ]
}
