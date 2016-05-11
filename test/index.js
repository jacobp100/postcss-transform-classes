import { camelCase, constant } from 'lodash/fp';
import test from 'ava';
import postcss from 'postcss';
import transformClasses from '../src';


test.serial('transforms class names', t => {
  t.plan(1);

  return postcss([
    transformClasses({
      transform: camelCase,
    }),
  ])
    .process('.foo-bar {}')
    .then(({ css }) => {
      t.is(css, '.fooBar {}');
    });
});

test.serial('ignores other parts', t => {
  t.plan(1);

  return postcss([
    transformClasses({
      transform: camelCase,
    }),
  ])
    .process('p.foo-bar:nth-child(2n + 1) {}')
    .then(({ css }) => {
      t.is(css, 'p.fooBar:nth-child(2n + 1) {}');
    });
});

test.serial('throws by default for colliding class names', t => {
  t.plan(1);

  return postcss([
    transformClasses({
      transform: constant('fooBar'),
    }),
  ])
    .process('.foo-bar {}, .fooBar {}')
    .catch(() => {
      t.pass();
    });
});

test.serial('does not throw for colliding class names if overridden', t => {
  t.plan(1);

  return postcss([
    transformClasses({
      transform: constant('fooBar'),
      allowConflicts: true,
    }),
  ])
    .process('.foo-bar {}, .fooBar {}')
    .then(() => {
      t.pass();
    });
});

test.serial('does not throw for colliding class names if names are identical', t => {
  t.plan(1);

  return postcss([
    transformClasses({
      transform: camelCase,
    }),
  ])
    .process('.foo-bar {}, .foo-bar {}')
    .then(() => {
      t.pass();
    });
});
