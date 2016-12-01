import React, {PropTypes} from 'react';
import Back from '../../common/back.jsx'

export default class NotFound extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="not-found">
        <Back></Back>
        <h3 className="title">404 NOT FOUND</h3>
        <p className="dsc">
          从前有座山，山里有座庙，<br/>庙里有个页面，现在找不到……
        </p>
      </div>
    );
  }
}
