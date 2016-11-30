import React, {PropTypes} from 'react';
import Back from '../../common/back.jsx';
import { Link } from 'react-router';

export default class Contactus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="contactus mt120">
        <div className="feedback">
          <Back></Back>
          <div className="ml15 mt30" style={{fontSize:30}}>转载文章</div>
          <p>转载文章请在文中附下图，即视为有效授权，无需再联系我们</p>
          <p className="qr">
            <img src={require("img/qrcode_for_gh_1f700e3515dc_258.jpg")}/>
          </p>
          <div className="ml15 mt30" style={{fontSize:30}}>在线客服</div>
          <p className="ol-serv">
            点击咨询在线客服
            <a target="_blank" href="http://sighttp.qq.com/authd?IDKEY=e482769a89f979b33df8b6856321444d4dbc1dceccb270cb"><img src="http://wpa.qq.com/imgd?IDKEY=e482769a89f979b33df8b6856321444d4dbc1dceccb270cb&pic=52" alt="点击这里给我发消息" title="点击这里给我发消息"/></a>
          </p>
          <div className="ml15 mt30" style={{fontSize:30}}>申请商务合作</div>
          <p>
            老师与机构<Link to="/contactus/business" className="co-link">合作申请入口</Link>
          </p>
          <div className="ml15 mt30" style={{fontSize:30}}>其他合作</div>
          <p>
            邮箱：<mail>1344671651@qq.com</mail>
          </p>
        </div>
      </div>
    );
  }
}

module.exports = Contactus
