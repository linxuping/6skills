import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';

export default class Sidebar extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="sidebar" className="sidebar responsive ace-save-state">
        <ul className="nav nav-list">
          <li className="active">
            <a href="index.html">
              <i className="menu-icon fa fa-tachometer"></i>
              <span className="menu-text"> Dashboard </span>
            </a>

            <b className="arrow"></b>
          </li>

          <li className="">
            <a href="#" className="dropdown-toggle">
              <i className="menu-icon fa fa-desktop"></i>
              <span className="menu-text">
                UI &amp; Elements
              </span>

              <b className="arrow fa fa-angle-down"></b>
            </a>

            <b className="arrow"></b>

            <ul className="submenu">
              <li className="">
                <a href="typography.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  Typography
                </a>

                <b className="arrow"></b>
              </li>

              <li className="">
                <a href="elements.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  Elements
                </a>

                <b className="arrow"></b>
              </li>

              <li className="">
                <a href="buttons.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  Buttons &amp; Icons
                </a>

                <b className="arrow"></b>
              </li>

              <li className="">
                <a href="content-slider.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  Content Sliders
                </a>

                <b className="arrow"></b>
              </li>

              <li className="">
                <a href="treeview.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  Treeview
                </a>

                <b className="arrow"></b>
              </li>

              <li className="">
                <a href="jquery-ui.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  jQuery UI
                </a>

                <b className="arrow"></b>
              </li>

              <li className="">
                <a href="nestable-list.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  Nestable Lists
                </a>

                <b className="arrow"></b>
              </li>

              <li className="">
                <a href="#" className="dropdown-toggle">
                  <i className="menu-icon fa fa-caret-right"></i>

                  Three Level Menu
                  <b className="arrow fa fa-angle-down"></b>
                </a>

                <b className="arrow"></b>

                <ul className="submenu">
                  <li className="">
                    <a href="#">
                      <i className="menu-icon fa fa-leaf green"></i>
                      Item #1
                    </a>

                    <b className="arrow"></b>
                  </li>

                  <li className="">
                    <a href="#" className="dropdown-toggle">
                      <i className="menu-icon fa fa-pencil orange"></i>

                      4th level
                      <b className="arrow fa fa-angle-down"></b>
                    </a>

                    <b className="arrow"></b>

                    <ul className="submenu">
                      <li className="">
                        <a href="#">
                          <i className="menu-icon fa fa-plus purple"></i>
                          Add Product
                        </a>

                        <b className="arrow"></b>
                      </li>

                      <li className="">
                        <a href="#">
                          <i className="menu-icon fa fa-eye pink"></i>
                          View Products
                        </a>

                        <b className="arrow"></b>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <li className="">
            <a href="#" className="dropdown-toggle">
              <i className="menu-icon fa fa-list"></i>
              <span className="menu-text"> Tables </span>

              <b className="arrow fa fa-angle-down"></b>
            </a>

            <b className="arrow"></b>

            <ul className="submenu">
              <li className="">
                <a href="tables.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  Simple &amp; Dynamic
                </a>

                <b className="arrow"></b>
              </li>

              <li className="">
                <a href="jqgrid.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  jqGrid plugin
                </a>

                <b className="arrow"></b>
              </li>
            </ul>
          </li>

          <li className="">
            <a href="#" className="dropdown-toggle">
              <i className="menu-icon fa fa-pencil-square-o"></i>
              <span className="menu-text"> Forms </span>

              <b className="arrow fa fa-angle-down"></b>
            </a>

            <b className="arrow"></b>

            <ul className="submenu">
              <li className="">
                <a href="form-elements.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  Form Elements
                </a>

                <b className="arrow"></b>
              </li>

              <li className="">
                <a href="form-elements-2.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  Form Elements 2
                </a>

                <b className="arrow"></b>
              </li>

              <li className="">
                <a href="form-wizard.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  Wizard &amp; Validation
                </a>

                <b className="arrow"></b>
              </li>

              <li className="">
                <a href="wysiwyg.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  Wysiwyg &amp; Markdown
                </a>

                <b className="arrow"></b>
              </li>

              <li className="">
                <a href="dropzone.html">
                  <i className="menu-icon fa fa-caret-right"></i>
                  Dropzone File Upload
                </a>

                <b className="arrow"></b>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}
