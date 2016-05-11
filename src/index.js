/* eslint no-param-reassign: [0] */

import { identity } from 'lodash/fp';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';


export default postcss.plugin('transform-classes', ({
  transform = identity,
  allowConflicts = false,
} = {}) => (root) => {
  const transformedToOriginalValue = {};

  const transformClassNode = classNode => {
    const { value } = classNode;
    const transformedClassName = transform(value);

    if (!allowConflicts &&
      transformedClassName in transformedToOriginalValue &&
      transformedToOriginalValue[transformedClassName] !== value
    ) {
      throw new Error(`Expected ${value} to produce a consistent result`);
    }

    transformedToOriginalValue[transformedClassName] = value;
    classNode.value = transformedClassName;
  };

  const transformSelector = selector => selectorParser(node => {
    node.walkClasses(transformClassNode);
  }).process(selector).result;

  root.walkRules(rule => {
    rule.selectors = rule.selectors.map(transformSelector);
  });
});
