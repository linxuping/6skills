import React from 'react';
import { Row, Col } from 'antd';
export default class Panel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
  	console.log(this.props.title.length)
    return (
      <div className="py-panel">
				<div className="py-panel-hd">
					{
						this.props.title.length > 0 ?
						<Row>
							{
								this.props.title.map(function(item, idx) {
									return (
										<Col span={Math.round(24/this.props.title.length)} key={idx}
											className="tc">
											<span className="title">{item}</span>
										</Col>
									);
								}.bind(this))
							}
						</Row>
						:
						<div className="title">{this.props.title}</div>
					}
				</div>
				<div className="py-panel-bd">
					{this.props.children}
				</div>
      </div>
    );
  }
}
