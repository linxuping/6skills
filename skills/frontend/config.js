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
var proxyOptions2 = url.parse('http://www.6skills.com/uploadtoken');
proxyOptions2.route = '/uploadtoken';
var proxyOptions3 = url.parse('http://www.6skills.com/wx');
proxyOptions3.route = '/wx';
var proxyOptions4 = url.parse('http://www.6skills.com/business');
proxyOptions4.route = '/business';
var proxyOptions5 = url.parse('http://www.6skills.com/get-auth-code');
proxyOptions5.route = '/get-auth-code';
var proxyOptions6 = url.parse('http://www.6skills.com/signupinfo');
proxyOptions6.route = '/signupinfo';
var proxyOptions7 = url.parse('http://www.6skills.com/sign');
proxyOptions7.route = '/sign';

module.exports = {
  browsersync: {
    development: {
      server: {
        baseDir: [build],
        middleware: [
          proxy(proxyOptions),
          proxy(proxyOptions2),
          proxy(proxyOptions3),
          proxy(proxyOptions4),
          proxy(proxyOptions5),
          proxy(proxyOptions6),
          proxy(proxyOptions7)
        ]
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
