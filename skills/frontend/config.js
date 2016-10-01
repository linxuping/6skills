var url = require('url');
var proxy = require('proxy-middleware');

var src               = 'src';
var build             = 'dist';
// var development       = 'dist/development';
// var production        = 'dist/production';
var srcAssets         = 'src';
var developmentAssets = 'dist/static';
// var productionAssets  = 'dist/production/assets';

var proxyOptions = url.parse('http://www.6skills.com/activities');
proxyOptions.route = '/activities';

module.exports = {
  browsersync: {
    development: {
      server: {
        baseDir: [build],
        middleware: [proxy(proxyOptions)]
      },
      port: 9901,
      files: [
        developmentAssets + '/css/**',
        developmentAssets + '/js/**',
        developmentAssets + '/img/**',
        developmentAssets + '/fonts/*',
        build + "/template"
      ]
    }
  }
};
