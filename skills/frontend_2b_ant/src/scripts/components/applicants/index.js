/**
 * 报名用户列表
 * @type
 */
module.exports = {
  path: "/analytics-applicants",
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./applicants.jsx').default)
    }, "applicants")
  },
  childRoutes: [

  ]
};
