export function proveType(_val) {}

function panic() {
  let message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "This should not happen";
  throw new Error(message);
}

export function assert(fact) {
  let message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Assertion failed";
  if (fact) return;
  return panic(message);
}
export function assertNever(_never) {
  return panic("Hell froze over");
}
export function maybe(fn, defaultValue) {
  try {
    const result = fn();
    return result;
  } catch {
    return defaultValue;
  }
}