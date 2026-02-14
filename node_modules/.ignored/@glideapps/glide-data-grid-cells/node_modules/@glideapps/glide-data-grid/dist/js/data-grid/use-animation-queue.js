import * as React from "react";

function hasItem(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] === item[0] && arr[i][1] === item[1]) return true;
  }

  return false;
}

export function useAnimationQueue(draw) {
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