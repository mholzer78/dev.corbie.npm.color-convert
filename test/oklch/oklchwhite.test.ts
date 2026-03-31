import cbColorConvert from '../../src/index.js';
import { test, expect } from 'vitest';
import colors from '../colors.json';
import { TCbDefault } from '../../src/modules/Color.js';

let master = colors.white;

test('oklch2hex as params', () => {
  expect(cbColorConvert.hwb.hex(...(master.hwb as TCbDefault))).toBe(
    master.hex,
  );
});
test('oklch2hex as object', () => {
  expect(cbColorConvert.hwb.hex(master.hwbObj)).toBe(master.hex);
});
test('oklch2rgb', () => {
  expect(cbColorConvert.hwb.rgb(master.hwb as TCbDefault)).toStrictEqual(
    master.rgb,
  );
});
test('oklch2hwb', () => {
  expect(cbColorConvert.hwb.hwb(master.hwb as TCbDefault)).toStrictEqual(
    master.hwb,
  );
});
test('oklch2hsv', () => {
  expect(cbColorConvert.hwb.hsv(master.hwb as TCbDefault)).toStrictEqual(
    master.hsv,
  );
});
test('oklch2hsl', () => {
  expect(cbColorConvert.hwb.hsl(master.hwb as TCbDefault)).toStrictEqual(
    master.hsl,
  );
});
test('oklch2cmyk', () => {
  expect(cbColorConvert.hwb.cmyk(master.hwb as TCbDefault)).toStrictEqual(
    master.cmyk,
  );
});
