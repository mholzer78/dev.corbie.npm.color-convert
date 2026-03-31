import type { TCbDefault } from './Color.js';
import ColorNotRgb from './ColorNotRgb.js';

export default class Oklch extends ColorNotRgb {
  override validArray = [100, 0.4, 360];

  toRgb(args: TCbDefault): TCbDefault {
    this.validate(args);
    const L = args[0] / 100;
    const C = args[1];
    const h = args[2];

    const rad = (h * Math.PI) / 180;

    // OKLCH → OKLab
    const a = C * Math.cos(rad);
    const b = C * Math.sin(rad);

    // OKLab → LMS
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;

    // cube
    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;

    // LMS → linear RGB
    let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let b_ = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

    // linear → sRGB
    const toSRGB = (x: number) =>
      x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;

    r = toSRGB(r);
    g = toSRGB(g);
    b_ = toSRGB(b_);

    // clamp + convert to 0–255
    return [
      Math.round(Math.max(0, Math.min(1, r)) * 255),
      Math.round(Math.max(0, Math.min(1, g)) * 255),
      Math.round(Math.max(0, Math.min(1, b_)) * 255),
    ] as TCbDefault;
  }
}
