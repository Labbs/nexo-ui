import * as React from "react";
import { styled } from "../../common/styles";
const DrilldownOverlayEditorStyle = styled.div`
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

export default DrilldownOverlayEditor;