"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BubblesOverlayEditorStyle = void 0;

var _styles = require("../../common/styles");

const BubblesOverlayEditorStyle = _styles.styled.div`
    display: flex;
    flex-wrap: wrap;

    .boe-bubble {
        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 100px;

        padding: 0 8px;
        height: 20px;

        background-color: ${p => p.theme.bgBubble};
        color: ${p => p.theme.textDark};
        margin: 2px;
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
exports.BubblesOverlayEditorStyle = BubblesOverlayEditorStyle;