"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimationManager = void 0;
exports.easeOutCubic = easeOutCubic;

var _clamp = _interopRequireDefault(require("lodash/clamp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hoverTime = 80;

function easeOutCubic(x) {
  const x1 = x - 1;
  return x1 * x1 * x1 + 1;
}

class AnimationManager {
  constructor(callback) {
    this.callback = callback;
    this.currentHoveredItem = undefined;
    this.leavingItems = [];
    this.lastAnimationTime = void 0;

    this.areSameItems = (left, right) => {
      return (left === null || left === void 0 ? void 0 : left[0]) === (right === null || right === void 0 ? void 0 : right[0]) && (left === null || left === void 0 ? void 0 : left[1]) === (right === null || right === void 0 ? void 0 : right[1]);
    };

    this.addToLeavingItems = item => {
      const isAlreadyLeaving = this.leavingItems.find(i => this.areSameItems(i.item, item.item)) !== undefined;

      if (isAlreadyLeaving) {
        return;
      }

      this.leavingItems.push(item);
    };

    this.removeFromLeavingItems = item => {
      var _leavingItem$hoverAmo;

      const leavingItem = this.leavingItems.find(e => this.areSameItems(e.item, item));
      this.leavingItems = this.leavingItems.filter(i => i !== leavingItem);
      return (_leavingItem$hoverAmo = leavingItem === null || leavingItem === void 0 ? void 0 : leavingItem.hoverAmount) !== null && _leavingItem$hoverAmo !== void 0 ? _leavingItem$hoverAmo : 0;
    };

    this.cleanUpLeavingElements = () => {
      this.leavingItems = this.leavingItems.filter(i => i.hoverAmount > 0);
    };

    this.shouldStep = () => {
      const hasLeavingItems = this.leavingItems.length > 0;
      const currentHoveredIsAnimating = this.currentHoveredItem !== undefined && this.currentHoveredItem.hoverAmount < 1;
      return hasLeavingItems || currentHoveredIsAnimating;
    };

    this.getAnimatingItems = () => {
      if (this.currentHoveredItem !== undefined) {
        return [...this.leavingItems, this.currentHoveredItem];
      }

      return this.leavingItems.map(x => ({ ...x,
        hoverAmount: easeOutCubic(x.hoverAmount)
      }));
    };

    this.step = timestamp => {
      if (this.lastAnimationTime === undefined) {
        this.lastAnimationTime = timestamp;
      } else {
        const step = timestamp - this.lastAnimationTime;
        const delta = step / hoverTime;

        for (const item of this.leavingItems) {
          item.hoverAmount = (0, _clamp.default)(item.hoverAmount - delta, 0, 1);
        }

        if (this.currentHoveredItem !== undefined) {
          this.currentHoveredItem.hoverAmount = (0, _clamp.default)(this.currentHoveredItem.hoverAmount + delta, 0, 1);
        }

        const animating = this.getAnimatingItems();
        this.callback(animating);
        this.cleanUpLeavingElements();
      }

      if (this.shouldStep()) {
        this.lastAnimationTime = timestamp;
        window.requestAnimationFrame(this.step);
      } else {
        this.lastAnimationTime = undefined;
      }
    };

    this.setHovered = item => {
      var _this$currentHoveredI;

      if (this.areSameItems((_this$currentHoveredI = this.currentHoveredItem) === null || _this$currentHoveredI === void 0 ? void 0 : _this$currentHoveredI.item, item)) {
        return;
      }

      if (this.currentHoveredItem !== undefined) {
        this.addToLeavingItems(this.currentHoveredItem);
      }

      if (item !== undefined) {
        const hoverAmount = this.removeFromLeavingItems(item);
        this.currentHoveredItem = {
          item,
          hoverAmount
        };
      } else {
        this.currentHoveredItem = undefined;
      }

      if (this.lastAnimationTime === undefined) {
        window.requestAnimationFrame(this.step);
      }
    };
  }

}

exports.AnimationManager = AnimationManager;