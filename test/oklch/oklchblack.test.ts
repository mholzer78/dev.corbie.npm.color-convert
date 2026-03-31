import cbColorConvert from '../../src/index.js';
import { test, expect } from 'vitest';
import colors from '../colors.json';
import { TCbDefault } from '../../src/modules/Color.js';

let master = colors.black;

test('oklch2hex as params', () => {
  expect(cbColorConvert.oklch.hex(...(master.oklch as TCbDefault))).toBe(
    master.hex,
  );
});
test('oklch2hex as object', () => {
  expect(cbColorConvert.oklch.hex(master.oklchObj)).toBe(master.hex);
});
test('oklch2hex', () => {
  expect(cbColorConvert.oklch.hex(master.oklch as TCbDefault)).toBe(master.hex);
});
test('oklch2name', () => {
  expect(cbColorConvert.oklch.name(master.oklch as TCbDefault)).toBe(
    master.name,
  );
});
test('oklch2rgb', () => {
  expect(cbColorConvert.oklch.rgb(master.oklch as TCbDefault)).toStrictEqual(
    master.rgb,
  );
});
test('oklch2hwb', () => {
  expect(cbColorConvert.oklch.hwb(master.oklch as TCbDefault)).toStrictEqual(
    master.hwb,
  );
});
test('oklch2hsv', () => {
  expect(cbColorConvert.oklch.hsv(master.oklch as TCbDefault)).toStrictEqual(
    master.hsv,
  );
});
test('oklch2hsl', () => {
  expect(cbColorConvert.oklch.hsl(master.oklch as TCbDefault)).toStrictEqual(
    master.hsl,
  );
});
test('oklch2cmyk', () => {
  expect(cbColorConvert.oklch.cmyk(master.oklch as TCbDefault)).toStrictEqual(
    master.cmyk,
  );
});
