"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpriteManager = void 0;

var _support = require("../common/support");

var _sprites = require("./sprites");

const variantList = ["normal", "selected", "special"];
const renderSize = 40;

function makeExtraMapIndex(bgColor, fgColor) {
  return `${bgColor}|${fgColor}`;
}

function getColorsForIndex(str) {
  const r = str.split("|");
  (0, _support.assert)(r.length === 2);
  return r;
}

function getColors(variant, theme) {
  if (variant === "normal") {
    return [theme.bgIconHeader, theme.fgIconHeader];
  } else if (variant === "selected") {
    return ["white", theme.accentColor];
  } else {
    return [theme.accentColor, theme.bgHeader];
  }
}

class SpriteManager {
  constructor(headerIcons) {
    this.colorMap = [];
    this.spriteCanvas = void 0;
    this.spriteList = void 0;
    this.headerIcons = void 0;
    this.headerIcons = { ..._sprites.sprites,
      ...(headerIcons !== null && headerIcons !== void 0 ? headerIcons : {})
    };
    this.spriteList = Object.keys(this.headerIcons);
  }

  drawSprite(sprite, variant, ctx, x, y, size, theme) {
    let alpha = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;
    if (this.spriteCanvas === undefined) throw new Error();
    const spriteIndex = this.spriteList.indexOf(sprite);
    if (spriteIndex === -1) throw new Error(`Unknown header icon: ${sprite}`);
    const [bgColor, fgColor] = getColors(variant, theme);
    const variantIndex = this.colorMap.indexOf(makeExtraMapIndex(bgColor, fgColor));
    const xOffset = spriteIndex * renderSize;
    const yOffset = Math.max(0, variantIndex * renderSize);

    if (alpha < 1) {
      ctx.globalAlpha = alpha;
    }

    ctx.drawImage(this.spriteCanvas, xOffset, yOffset, renderSize, renderSize, x, y, size, size);

    if (alpha < 1) {
      ctx.globalAlpha = 1;
    }
  }

  async buildSpriteMap(theme, cols) {
    const map = new Set();

    for (const v of variantList) {
      const [bg, fg] = getColors(v, theme);
      map.add(makeExtraMapIndex(bg, fg));
    }

    for (const c of cols) {
      var _c$themeOverride, _c$themeOverride2;

      if (((_c$themeOverride = c.themeOverride) === null || _c$themeOverride === void 0 ? void 0 : _c$themeOverride.bgIconHeader) !== undefined || ((_c$themeOverride2 = c.themeOverride) === null || _c$themeOverride2 === void 0 ? void 0 : _c$themeOverride2.fgIconHeader) !== undefined) {
        const finalTheme = { ...theme,
          ...c.themeOverride
        };

        for (const v of variantList) {
          const [bg, fg] = getColors(v, finalTheme);
          map.add(makeExtraMapIndex(bg, fg));
        }
      }
    }

    const newMap = [...map];
    newMap.sort();
    let hasDiff = false;

    for (const [index, key] of newMap.entries()) {
      if (key !== this.colorMap[index]) {
        hasDiff = true;
        break;
      }
    }

    if (!hasDiff) return false;
    this.colorMap = newMap;
    this.spriteCanvas = document.createElement("canvas");
    this.spriteCanvas.width = this.spriteList.length * renderSize;
    this.spriteCanvas.height = this.colorMap.length * renderSize;
    const ctx = this.spriteCanvas.getContext("2d");
    if (ctx === null) return false;
    let x = 0;

    for (const key of this.spriteList) {
      const sprite = this.headerIcons[key];
      let y = 0;

      for (const ex of this.colorMap) {
        const [bgColor, fgColor] = getColorsForIndex(ex);
        const imgSource = new Image();
        imgSource.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sprite({
          fgColor,
          bgColor
        }))}`;
        await imgSource.decode();
        ctx.drawImage(imgSource, x, y, renderSize, renderSize);
        y += renderSize;
      }

      x += renderSize;
    }

    return true;
  }

}

exports.SpriteManager = SpriteManager;