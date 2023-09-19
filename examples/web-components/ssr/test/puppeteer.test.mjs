import { render } from '../renderer.mjs';
import fs from 'fs';
import { expect } from 'chai';

const testCase = name => {
  return {
    input: fs.readFileSync(`./test/fixtures/${name}.input.html`, 'utf8'),
    expected: fs.readFileSync(`./test/fixtures/${name}.expected.html`, 'utf8'),
  }
}

const components = [
  'pull-quote',
  'links-list'
].map(name => fs.readFileSync(`./src/components/${name}.js`, 'utf8'));

describe('Convert documents', () => {
  [
    'minimal',
  ].forEach(name => {
    it(`Converts the ${name} document`, async () => {
      const tc = testCase(name);
      const actual = await render(tc.input, components);
      expect(actual).to.equal(tc.expected);
    });
  })
});