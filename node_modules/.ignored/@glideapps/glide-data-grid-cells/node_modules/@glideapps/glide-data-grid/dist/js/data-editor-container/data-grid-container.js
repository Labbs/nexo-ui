function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { styled } from "../common/styles";
import * as React from "react";
const Wrapper = styled.div`
    overflow: hidden;
    position: relative;

    width: ${p => p.width}px;
    height: ${p => p.height}px;

    > :first-child {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
`;

const DataEditorContainer = p => {
  const {
    width,
    height,
    children,
    ...rest
  } = p;
  return React.createElement(Wrapper, _extends({
    width: width,
    height: height
  }, rest), children);
};

export default DataEditorContainer;