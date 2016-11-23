module.exports = {
  path: '*',
  indexRoute: {
    getComponent(nextState, cb){
      require.ensure([], (require)=>{
        cb(null, require('./404.jsx').default)
      }, "404")
    }
  }
}
