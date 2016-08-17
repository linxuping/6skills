import React from 'react';
import {Navbar, Nav, NavDropdown, MenuItem, DropToggle} from 'react-bootstrap';

export default class CusNavbar extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  state = {
    username: "administrator"
  };

  render() {
    let user_avatar = <img className="nav-user-photo" src={require('images/default_avatar.jpg')}/>
    return (
      <Navbar className="ace-save-state" fluid>
        <div className="navbar-container ace-save-state">
          <Navbar.Header>
            <Navbar.Brand>
              <small>
                <i className="fa fa-leaf"></i>
                6 SKILLS
              </small>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Header className="navbar-buttons pull-right">
            <Nav className="ace-nav" navbar>
              <NavDropdown eventKey="1" title={"欢迎您! " + this.state.username} id="nav-dropdown" className="light-blue dropdown-modal">
                <MenuItem eventKey="1.1" href="#">
                  <i className="ace-icon fa fa-cog"></i>
                  设置
                </MenuItem>
                <MenuItem eventKey="1.2" href="#">
                  <i className="ace-icon fa fa-user"></i>
                  用户
                </MenuItem>
                <MenuItem divider />
                <MenuItem eventKey="1.3" href="#">
                  <i className="ace-icon fa fa-power-off"></i>
                  退出
                </MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar.Header>
        </div>
      </Navbar>
    );
  }
}
