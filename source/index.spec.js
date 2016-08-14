import test from 'ava';
import recast from 'recast';
import { resolver } from 'react-docgen';
import Documentation from 'react-docgen/dist/Documentation';
import { parse } from '../tests/utils';
import exportTypeHandler from './index';
const { findExportedComponentDefinition } = resolver;

let documentation = null;

test.beforeEach(() => {
  documentation = new Documentation();
});

test('ES2015 default export', (t) => {
  const definition = findExportedComponentDefinition(parse(`
    export default () => (<button />)
  `), recast);
  exportTypeHandler(documentation, definition);

  const actual = documentation.get('exports');
  const expected = {
    format: 'ES2015',
    type: 'default',
    name: '',
  };

  t.deepEqual(actual, expected,
    'it should find the default export for the component definition');
});

test('ES2015 referenced default export', (t) => {
  const definition = findExportedComponentDefinition(parse(`
    const Button = () => (<button />);
    export default Button;
  `), recast);
  exportTypeHandler(documentation, definition);

  const actual = documentation.get('exports');
  const expected = {
    format: 'ES2015',
    type: 'default',
    name: 'Button',
  };

  t.deepEqual(actual, expected,
    'it should find the default export for the component definition');
});

test('ES2015 named export', (t) => {
  const definition = findExportedComponentDefinition(parse(`
    export const Button = () => (<button />);
  `), recast);
  exportTypeHandler(documentation, definition);

  const actual = documentation.get('exports');
  const expected = {
    format: 'ES2015',
    type: 'named',
    name: 'Button',
  };

  t.deepEqual(actual, expected,
    'it should find the named export for the component definition');
});

test('ES2015 named export', (t) => {
  const definition = findExportedComponentDefinition(parse(`
    const Button = () => (<button />);
    export { Button };
  `), recast);
  exportTypeHandler(documentation, definition);

  const actual = documentation.get('exports');
  const expected = {
    format: 'ES2015',
    type: 'named',
    name: 'Button',
  };

  t.deepEqual(actual, expected,
    'it should find the named export for the component definition');
});

test('CommonJS "default" export', (t) => {
  const definition = findExportedComponentDefinition(parse(`
    module.exports = () => (<button />);
  `), recast);
  exportTypeHandler(documentation, definition);

  const actual = documentation.get('exports');
  const expected = {
    format: 'CommonJS',
    type: 'default',
    name: '',
  };

  t.deepEqual(actual, expected,
    'it should find the default export for the component definition');
});

test('CommonJS referenced "default" export', (t) => {
  const definition = findExportedComponentDefinition(parse(`
    const Button = () => (<button />);
    module.exports = Button;
  `), recast);
  exportTypeHandler(documentation, definition);

  const actual = documentation.get('exports');
  const expected = {
    format: 'CommonJS',
    type: 'default',
    name: 'Button',
  };

  t.deepEqual(actual, expected,
    'it should find the default export for the component definition');
});

test('CommonJS "named" export', (t) => {
  const definition = findExportedComponentDefinition(parse(`
    module.exports.Button = () => (<button />);
  `), recast);
  exportTypeHandler(documentation, definition);

  const actual = documentation.get('exports');
  const expected = {
    format: 'CommonJS',
    type: 'named',
    name: 'Button',
  };

  t.deepEqual(actual, expected,
    'it should find the named export for the component definition');
});

test('CommonJS referenced "named" export', (t) => {
  const definition = findExportedComponentDefinition(parse(`
    const Button = () => (<button />);
    module.exports.Button = Button;
  `), recast);
  exportTypeHandler(documentation, definition);

  const actual = documentation.get('exports');
  const expected = {
    format: 'CommonJS',
    type: 'named',
    name: 'Button',
  };

  t.deepEqual(actual, expected,
    'it should find the named export for the component definition');
});
