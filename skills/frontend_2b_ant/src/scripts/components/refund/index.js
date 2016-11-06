/**
 * 退款列表
 * @type
 */
module.exports = {
  path: "/manager-refund",
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./refund-list.jsx').default)
    }, "audit-list")
  },
  childRoutes: [
    
  ]
};
