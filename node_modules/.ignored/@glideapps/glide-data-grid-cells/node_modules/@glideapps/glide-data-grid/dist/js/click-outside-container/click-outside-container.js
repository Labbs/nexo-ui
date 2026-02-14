function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";
export default class ClickOutsideContainer extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.wrapperRef = React.createRef();

    this.clickOutside = event => {
      if (this.wrapperRef.current !== null && !this.wrapperRef.current.contains(event.target)) {
        let node = event.target;

        while (node !== null) {
          if (node.classList.contains("click-outside-ignore")) {
            return;
          }

          node = node.parentElement;
        }

        this.props.onClickOutside();
      }
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.clickOutside, true);
    document.addEventListener("contextmenu", this.clickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.clickOutside);
    document.removeEventListener("contextmenu", this.clickOutside);
  }

  render() {
    const {
      onClickOutside,
      ...rest
    } = this.props;
    return React.createElement("div", _extends({}, rest, {
      ref: this.wrapperRef
    }), this.props.children);
  }

}