/**
 * 审核详情
 * @type
 */
const auditDetail = {
  path: ":id",
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./audit-detail.jsx').default)
    }, "audit-detail")
  }
}

/**
 * 审核列表
 * @type
 */
module.exports = {
  path: "/manager-audit",
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./audit-list.jsx').default)
    }, "audit-list")
  },
  childRoutes: [
    auditDetail
  ]
};
