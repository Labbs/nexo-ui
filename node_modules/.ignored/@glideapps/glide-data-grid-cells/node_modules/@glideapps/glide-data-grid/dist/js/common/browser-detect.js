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

export const browserIsFirefox = userAgent.includes("Firefox");
export const browserIsSafari = userAgent.indexOf("Mac OS") > -1 && userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") < 0;
export const browserIsOSX = lazy(() => window.navigator.platform.toLowerCase().startsWith("mac"));