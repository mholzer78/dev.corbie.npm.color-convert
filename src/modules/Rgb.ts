import Color from './Color.js';
import colorsJson from '../colors.json' with { type: 'json' };
import type { TCbDefault, TCbCmyk } from './Color.js';

export default class Rgb extends Color {
  override validArray = [255, 255, 255];

  toHex(args: TCbDefault): string {
    this.validate(args);
    return args.map((x) => x.toString(16).padStart(2, '0')).join('');
  }

  toRgb(args: TCbDefault): TCbDefault {
    this.validate(args);
    return args;
  }

  toHwb(args: TCbDefault): TCbDefault {
    this.validate(args);

    const [r, g, b] = this.splitRgb(args, 255);
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let chroma = max - min;
    let hue, white, black;
    if (chroma == 0) {
      hue = 0;
    } else if (r == max) {
      hue = (((g - b) / chroma) % 6) * 360;
    } else if (g == max) {
      hue = (((b - r) / chroma + 2) % 6) * 360;
    } else {
      hue = (((r - g) / chroma + 4) % 6) * 360;
    }
    white = min;
    black = 1 - max;
    return [
      Math.round(hue / 6),
      Math.round(white * 100),
      Math.round(black * 100),
    ] as TCbDefault;
  }

  toHsv(args: TCbDefault): TCbDefault {
    this.validate(args);

    // https://gist.github.com/mjackson/5311256
    const [r, g, b] = this.splitRgb(args, 255);

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let hue,
      sat,
      val = max;

    const delta = max - min;
    sat = max == 0 ? 0 : delta / max;

    hue = 0; // achromatic
    if (max !== min) {
      switch (max) {
        case r:
          hue = (g - b) / delta + (g < b ? 6 : 0);
          break;
        case g:
          hue = (b - r) / delta + 2;
          break;
        case b:
          hue = (r - g) / delta + 4;
          break;
      }

      hue /= 6;
    }

    return [
      Math.round(hue * 360),
      Math.round(sat * 1000) / 10,
      Math.round(val * 1000) / 10,
    ] as TCbDefault;
  }

  toHsl(args: TCbDefault): TCbDefault {
    this.validate(args);

    // https://gist.github.com/mjackson/5311256
    const [r, g, b] = this.splitRgb(args, 255);
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let hue = 0;
    let sat;
    let light = (max + min) / 2;

    if (max == min) {
      hue = sat = 0; // achromatic
    } else {
      let delta = max - min;
      sat = light > 0.5 ? delta / (2 - max - min) : delta / (max + min);

      switch (max) {
        case r:
          hue = (g - b) / delta + (g < b ? 6 : 0);
          break;
        case g:
          hue = (b - r) / delta + 2;
          break;
        case b:
          hue = (r - g) / delta + 4;
          break;
      }

      hue /= 6;
    }

    return [
      Math.round(hue * 360),
      Math.round(sat * 1000) / 10,
      Math.round(light * 1000) / 10,
    ] as TCbDefault;
  }
  toCmyk(args: TCbDefault): TCbCmyk {
    this.validate(args);

    const [r, g, b] = this.splitRgb(args, 255);
    let c = 1 - r;
    let m = 1 - g;
    let y = 1 - b;
    let k = Math.min(c, Math.min(m, y));

    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);

    c = Math.round(c * 10000) / 100;
    m = Math.round(m * 10000) / 100;
    y = Math.round(y * 10000) / 100;
    k = Math.round(k * 10000) / 100;

    c = Number.isNaN(c) ? 0 : Math.round(c);
    m = Number.isNaN(m) ? 0 : Math.round(m);
    y = Number.isNaN(y) ? 0 : Math.round(y);
    k = Number.isNaN(k) ? 0 : Math.round(k);

    return [c, m, y, k] as TCbCmyk;
  }
  toName(args: TCbDefault): string {
    this.validate(args);

    const color = colorsJson.find(
      (e) => JSON.stringify(e.rgb) === JSON.stringify(args),
    );

    if (color) {
      return color.name;
    } else {
      return 'No name found that matches this value';
    }
  }
  toOklch(args: TCbDefault): TCbDefault {
    this.validate(args);

    let [r, g, b] = this.splitRgb(args, 255);

    // sRGB → linear
    const toLinear = (x: number) =>
      x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);

    r = toLinear(r);
    g = toLinear(g);
    b = toLinear(b);

    // linear RGB → LMS
    const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

    // cube root
    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    // LMS → OKLab
    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

    // OKLab → OKLCH
    const C = Math.sqrt(a * a + b_ * b_);
    let h = Math.atan2(b_, a) * (180 / Math.PI);
    if (h < 0) h += 360;

    return [
      Math.round(L * 10000) / 10000,
      Math.round(C * 10000) / 10000,
      Math.round(h * 100) / 100,
    ] as TCbDefault;
  }

  splitRgb(rgb: TCbDefault, divider = 1): TCbDefault {
    const [r, g, b] = rgb;
    return [r / divider, g / divider, b / divider];
  }
}
