import React, { Component, PropTypes } from 'react';
require('./moxie.js');
require('./plupload.dev.js');
require('./qiniu.js');
import uploadConfig from './upload-config.js';

/**
 * 图片上传组件
 */
class Upload extends Component {
  static propTypes = {
    uploadKey: PropTypes.string,
    imgProps: PropTypes.func,
    id: PropTypes.string,
    form: PropTypes.object,
    success: React.PropTypes.func
  };

  state = {
    file: ""
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let qiniu = new QiniuJsSDK()
    qiniu.uploader(uploadConfig({
      key: this.props.uploadKey,
      id: this.props.id,
      successCallBack: this.successCallBack.bind(this)
    }));
  }

  successCallBack(file, domain){
    let fileObj = JSON.parse(file);
    this.setState({
      file: domain + fileObj.key + "?" + new Date().getTime()
    });
    this.props.success(fileObj, domain);
  }

  render() {
    return (
      <span>
        {
          !this.state.file ? "" :
          <div className="ant-upload-list ant-upload-list-picture-card">
            <span>
              <div className="ant-upload-list-item ant-upload-list-item-done"><div className="ant-upload-list-item-info">
                  <a className="ant-upload-list-item-thumbnail" href={this.state.file} target="_blank">
                    <img src={this.state.file}/>
                  </a>
                  <a href={this.state.file} target="_blank" className="ant-upload-list-item-name">
                  </a>
                  <span>
                    <a href={this.state.file} target="_blank">
                      <i className="anticon anticon-eye-o"></i>
                    </a>
                    <i className="anticon anticon-delete"></i>
                  </span>
                </div>
              </div>
            </span>
          </div>
        }
        <div className="ant-upload ant-upload-select ant-upload-select-picture-card">
          <span className="rc-upload" tabIndex="0" role="button" style={{position: "relative"}} id={this.props.id}>
            <i className="anticon anticon-plus" style={{fontSize: "2.4rem"}}></i>
            <div className="ant-upload-text">上传图片</div>
          </span>
          <input type="hidden" {...this.props.imgProps}/>
        </div>
      </span>
    );
  }
}

export default Upload;
