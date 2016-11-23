import ReactDom from "react-dom";
import WeUI from 'react-weui';
const {Dialog} = WeUI;
import React, {PropTypes} from 'react';

export class ConfirmComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  cancelHandler(){
    if (this.props.onCancel ) {
      this.props.onCancel()
    }
    ReactDom.unmountComponentAtNode(document.getElementById('msg-wrap'))
  }

  okHandler(){
    if (this.props.onOk) {
      this.props.onOk()
    }
    ReactDom.unmountComponentAtNode(document.getElementById('msg-wrap'))
  }

  render() {
    return (
      <Dialog.Confirm title={this.props.title || "提示"}
        buttons={[
            {
                type: 'default',
                label: this.props.cancelLabel || '取消',
                onClick: this.cancelHandler.bind(this)
            },
            {
                type: 'default',
                label: this.props.okLabel||'确定',
                onClick: this.okHandler.bind(this)
            }
        ]}
        show={true}
        >
        {this.props.content}
      </Dialog.Confirm>
    );
  }
}

ConfirmComponent.propTypes = {
  content: React.PropTypes.string,
  title: React.PropTypes.string,
  onOk: React.PropTypes.fun,
  onCancel: React.PropTypes.fun
};

export function confirm(options) {
  ReactDom.render(
    <ConfirmComponent title={options.title}
                      content={options.content}
                      onOk={options.onOk}
                      onCancel={options.onCancel}
                      />,
    document.getElementById("msg-wrap")
  )
}

export class AlertConponent extends React.Component {
  constructor(props) {
    super(props);
  }

  okHandler(){
    if (this.props.onOk) {
      this.props.onOk()
    }
    ReactDom.unmountComponentAtNode(document.getElementById('msg-wrap'))
  }

  render() {
    return (
      <Dialog.Alert title={this.props.title || "提示"}
        buttons={[
            {
                type: 'default',
                label: this.props.okLabel||'确定',
                onClick: this.okHandler.bind(this)
            }
        ]}
        show={true}
        >
        {this.props.content}
      </Dialog.Alert>
    );
  }
}

AlertConponent.propTypes = {
  content: React.PropTypes.string,
  title: React.PropTypes.string,
  onOk: React.PropTypes.fun,
};

export function alert(options) {
  ReactDom.render(
    <AlertConponent title={options.title}
                      content={options.content}
                      onOk={options.onOk}
                      />,
    document.getElementById("msg-wrap")
  )
}
