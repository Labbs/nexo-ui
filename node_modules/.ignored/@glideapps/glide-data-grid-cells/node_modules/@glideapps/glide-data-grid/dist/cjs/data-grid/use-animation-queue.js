"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimationQueue = useAnimationQueue;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function hasItem(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] === item[0] && arr[i][1] === item[1]) return true;
  }

  return false;
}

function useAnimationQueue(draw) {
  const queue = React.useRef([]);
  const drawRef = React.useRef(draw);
  drawRef.current = draw;
  const loop = React.useCallback(() => {
    const fn = () => {
      const toDraw = queue.current;
      queue.current = [];
      drawRef.current(toDraw);
    };

    window.requestAnimationFrame(fn);
  }, []);
  const enqueue = React.useCallback(item => {
    if (hasItem(queue.current, item)) return;

    if (queue.current.length === 0) {
      loop();
    }

    queue.current.push(item);
  }, [loop]);
  return enqueue;
}