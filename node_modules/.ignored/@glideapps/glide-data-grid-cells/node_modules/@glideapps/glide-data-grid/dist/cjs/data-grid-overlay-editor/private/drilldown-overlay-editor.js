"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _styles = require("../../common/styles");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const DrilldownOverlayEditorStyle = _styles.styled.div`
    display: flex;
    flex-wrap: wrap;

    .doe-bubble {
        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 100px;

        padding: 0 8px;
        height: 24px;

        background-color: ${p => p.theme.bgCell};
        color: ${p => p.theme.textDark};
        margin: 2px;

        border-radius: 6px;

        box-shadow: 0 0 1px rgba(62, 65, 86, 0.4), 0 1px 3px rgba(62, 65, 86, 0.4);

        img {
            height: 16px;
            object-fit: contain;

            margin-right: 4px;
        }
    }

    textarea {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 0px;
        height: 0px;

        opacity: 0;
    }
`;

const DrilldownOverlayEditor = p => {
  const {
    drilldowns,
    onKeyDown
  } = p;
  return React.createElement(DrilldownOverlayEditorStyle, null, drilldowns.map((d, i) => React.createElement("div", {
    key: i,
    className: "doe-bubble"
  }, d.img !== undefined && React.createElement("img", {
    src: d.img
  }), React.createElement("div", null, d.text))), React.createElement("textarea", {
    autoFocus: true,
    onKeyDown: onKeyDown
  }));
};

var _default = DrilldownOverlayEditor;
exports.default = _default;