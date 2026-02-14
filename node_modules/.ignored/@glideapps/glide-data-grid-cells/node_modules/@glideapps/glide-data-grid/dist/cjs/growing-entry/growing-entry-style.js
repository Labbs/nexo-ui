"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShadowBox = exports.InputBox = exports.GrowingEntryStyle = void 0;

var _styles = require("../common/styles");

var _styledComponents = require("styled-components");

const inputProps = (0, _styledComponents.css)(["font-size:", ";line-height:16px;font-family:", ";color:", ";padding:0;margin:0;"], p => p.theme.editorFontSize, p => p.theme.fontFamily, p => p.theme.textDark);
const InputBox = _styles.styled.textarea`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;

    border-radius: 0px;

    resize: none;
    white-space: pre-wrap;
    min-width: 100%;
    overflow: hidden;
    border: 0;
    background-color: transparent;

    ::placeholder {
        color: ${p => p.theme.textLight};
    }

    ${inputProps}
`;
exports.InputBox = InputBox;
const ShadowBox = _styles.styled.div`
    visibility: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;

    width: max-content;
    max-width: 100%;

    min-width: 100%;

    ${inputProps}

    padding-bottom: 2px;
`;
exports.ShadowBox = ShadowBox;
const GrowingEntryStyle = _styles.styled.div`
    position: relative;
    margin-top: 6px;
`;
exports.GrowingEntryStyle = GrowingEntryStyle;