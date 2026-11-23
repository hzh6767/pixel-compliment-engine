import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { runInNewContext } from 'node:vm';

const require = createRequire(import.meta.url);
const { banks, pick, roll, rate, praise } = require('../app.js');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('app.js loads without a DOM', () => {
  assert.equal(typeof document, 'undefined');
  assert.deepEqual(Object.keys(banks).sort(), ['brave', 'chaos', 'craft', 'kind']);
});

test('every bank has three templates, each with one {name} slot', () => {
  for (const [vibe, lines] of Object.entries(banks)) {
    assert.equal(lines.length, 3, `${vibe} should hold 3 templates`);
    for (const line of lines) {
      assert.equal(line.split('{name}').length - 1, 1, `${vibe} template must hold exactly one {name}`);
    }
  }
});

test('flavors in index.html match the banks in app.js', () => {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const options = [...html.matchAll(/<option value="([a-z]+)">/g)].map(m => m[1]).sort();
  assert.deepEqual(options, Object.keys(banks).sort());
});

test('praise fills the slot and uppercases the handle', () => {
  const line = praise('kind', 'ada');
  assert.match(line, /ADA/);
  assert.doesNotMatch(line, /\{name\}/);
  assert.ok(banks.kind.includes(line.replace('ADA', '{name}')));
});

test('praise treats $ patterns in the handle literally', () => {
  const line = praise('craft', '$&');
  assert.match(line, /^\$&, /);
  assert.doesNotMatch(line, /\{name\}/);
});

test('pick always returns a member of the bank', () => {
  for (let i = 0; i < 200; i++) assert.ok(banks.chaos.includes(pick(banks.chaos)));
});

test('roll stays inside the documented 50-99 range', () => {
  for (let i = 0; i < 500; i++) {
    const points = roll();
    assert.ok(Number.isInteger(points) && points >= 50 && points <= 99, `out of range: ${points}`);
  }
});

test('rarity thresholds match the documented tiers', () => {
  assert.equal(rate(50), 'NICE');
  assert.equal(rate(65), 'NICE');
  assert.equal(rate(66), 'RARE');
  assert.equal(rate(85), 'RARE');
  assert.equal(rate(86), 'ULTRA RARE');
  assert.equal(rate(99), 'ULTRA RARE');
});

test('a delayed clipboard result cannot change the next compliment or its copy feedback', async () => {
  const elements = new Map();
  function querySelector(selector) {
    if (!elements.has(selector)) {
      elements.set(selector, {
        value: '', style: {},
        addEventListener(type, listener) { this[type] = listener; }
      });
    }
    return elements.get(selector);
  }
  let finishCopy;
  const clipboard = {
    writeText() {
      return new Promise((resolve, reject) => { finishCopy = { resolve, reject }; });
    }
  };
  runInNewContext(readFileSync(join(root, 'app.js'), 'utf8'), {
    document: { querySelector }, navigator: { clipboard }, clearTimeout, setTimeout
  });
  querySelector('#vibe').value = 'craft';
  const generate = () => querySelector('#compliment-form').submit({ preventDefault() {} });
  const copy = querySelector('#copy');
  generate();
  for (const outcome of ['resolve', 'reject']) {
    const pending = copy.click();
    generate();
    finishCopy[outcome]();
    await pending;
    assert.equal(copy.textContent, 'COPY');
  }
});
