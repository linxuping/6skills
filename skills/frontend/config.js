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
var proxyOptions2 = url.parse('http://www.6skills.com/wx');
proxyOptions2.route = '/wx';

module.exports = {
  browsersync: {
    development: {
      server: {
        baseDir: [build],
        middleware: [proxy(proxyOptions), proxy(proxyOptions2)]
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
