var src               = 'src';
var build             = 'dist';
// var development       = 'dist/development';
// var production        = 'dist/production';
var srcAssets         = 'src';
var developmentAssets = 'dist/static';
// var productionAssets  = 'dist/production/assets';

module.exports = {
  browsersync: {
    development: {
      server: {
        baseDir: [build]
      },
      port: 3000,
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
