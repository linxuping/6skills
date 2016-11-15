var url = require('url');
var proxy = require('proxy-middleware');

var src               = 'src';
var build             = 'dist';
// var development       = 'dist/development';
// var production        = 'dist/production';
var srcAssets         = 'src';
var developmentAssets = 'dist/static';
// var productionAssets  = 'dist/production/assets';

var proxyOptions = url.parse('http://www.6skills.com:19900/activities');
proxyOptions.route = '/activities';
var proxyOptions2 = url.parse('http://www.6skills.com:19900/wx');
proxyOptions2.route = '/wx';
var proxyOptions3 = url.parse('http://www.6skills.com:19900/get_wx_payinfo');
proxyOptions3.route = '/get_wx_payinfo';
var proxyOptions4 = url.parse('http://www.6skills.com/business');
proxyOptions4.route = '/business';


module.exports = {
  browsersync: {
    development: {
      server: {
        baseDir: [build],
          proxy(proxyOptions2),
          proxy(proxyOptions3),
          proxy(proxyOptions4)
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
