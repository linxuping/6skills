/**
 * 活动添加
 * @type
 */
const addRoute = {
  path: 'add',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./add-activity.jsx').default)
    }, "addactivity")
  }
}

/**
 * 活动layout
 * @type
 */
module.exports = {
  path: 'activities',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./activities-layout.jsx').default)
    }, "activities")
  },
  childRoutes: [
    addRoute
  ]
}
