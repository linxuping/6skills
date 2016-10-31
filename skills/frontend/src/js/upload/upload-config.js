function uploadConfig(options){

  if (options == undefined || options.key == undefined) {
    alert("upload key cannot be null");
    return null;
  }
  var key = options.key + "-" + new Date().getTime() + (options.type || ".jpg");
  options = options || {};
  var config = {

    runtimes: 'html5,flash,html4',
    browse_button: options.id || 'pickfiles',
    // container: 'container',
    // drop_element: 'container',
    max_file_size: '1000mb',
    //flash_swf_url: require('./Moxie.swf'),
    dragdrop: true,
    chunk_size: '4mb',
    multi_selection: false,//!(mOxie.Env.OS.toLowerCase()==="ios"),
    //uptoken_url: $('#uptoken_url').val(),
    uptoken_func: function(){

      var ajax = new XMLHttpRequest();

      var url = '/uploadtoken/get?key=' + key;
      ajax.open('GET', url, false);
      ajax.setRequestHeader("If-Modified-Since", "0");
      ajax.send();
      if (ajax.status === 200) {
          var res = JSON.parse(ajax.responseText);
          console.log('custom uptoken_func:' + res.token);

          return res.token;
      } else {
          console.log('custom uptoken_func err');
          return '';
      }

    },
    domain: "http://img.6skills.com/",
    get_new_uptoken: false,
    // downtoken_url: '/downtoken',
    unique_names: false,
    save_key: false,
    // x_vars: {
    //     'id': '1234',
    //     'time': function(up, file) {
    //         var time = (new Date()).getTime();
    //         // do something with 'time'
    //         return time;
    //     },
    // },
    auto_start: true,
    log_level: 1,
    init: {
      'FilesAdded': function(up, files) {
        plupload.each(files, function(file) {
            // 文件添加进队列后,处理相关的事情
        });
          // $('table').show();
          // $('#success').hide();
          // plupload.each(files, function(file) {
          //     var progress = new FileProgress(file, 'fsUploadProgress');
          //     progress.setStatus("绛夊緟...");
          //     progress.bindUploadCancel(up);
          // });
      },
      'BeforeUpload': function(up, file) {
          options.beforeCallBack && options.beforeCallBack(file);
      },
      'UploadProgress': function(up, file) {
          //var progress = new FileProgress(file, 'fsUploadProgress');
          //var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
          //progress.setProgress(file.percent + "%", file.speed, chunk_size);
      },
      'UploadComplete': function(res) {
          // $('#success').show();
        //console.log(res)
      },
      'FileUploaded': function(up, file, info) {
          // var progress = new FileProgress(file, 'fsUploadProgress');
          // progress.setComplete(up, info);
          options.successCallBack && options.successCallBack(info, config.domain);
      },
      'Error': function(up, err, errTip) {
          console.log(errTip)
      }
      ,
      'Key': function(up, file) {
          //var key = "";
          // do something with key
          return key
      }
    }
  }
  return config;

}
