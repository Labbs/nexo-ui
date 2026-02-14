"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.browserIsSafari = exports.browserIsOSX = exports.browserIsFirefox = void 0;
const {
  userAgent
} = window.navigator;

class Lazy {
  constructor(fn) {
    this.fn = void 0;
    this.val = void 0;
    this.fn = fn;
  }

  get value() {
    var _this$val;

    return (_this$val = this.val) !== null && _this$val !== void 0 ? _this$val : this.val = this.fn();
  }

}

function lazy(fn) {
  return new Lazy(fn);
}

const browserIsFirefox = userAgent.includes("Firefox");
exports.browserIsFirefox = browserIsFirefox;
const browserIsSafari = userAgent.indexOf("Mac OS") > -1 && userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") < 0;
exports.browserIsSafari = browserIsSafari;
const browserIsOSX = lazy(() => window.navigator.platform.toLowerCase().startsWith("mac"));
exports.browserIsOSX = browserIsOSX;