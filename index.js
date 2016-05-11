'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fp = require('lodash/fp');

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssSelectorParser = require('postcss-selector-parser');

var _postcssSelectorParser2 = _interopRequireDefault(_postcssSelectorParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _postcss2.default.plugin('transform-classes', function () {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$transform = _ref.transform;
  var transform = _ref$transform === undefined ? _fp.identity : _ref$transform;
  var _ref$allowConflicts = _ref.allowConflicts;
  var allowConflicts = _ref$allowConflicts === undefined ? false : _ref$allowConflicts;
  return function (root) {
    var transformedToOriginalValue = {};

    var transformClassNode = function transformClassNode(classNode) {
      var value = classNode.value;

      var transformedClassName = transform(value);

      if (!allowConflicts && transformedClassName in transformedToOriginalValue && transformedToOriginalValue[transformedClassName] !== value) {
        throw new Error('Expected ' + value + ' to produce a consistent result');
      }

      transformedToOriginalValue[transformedClassName] = value;
      classNode.value = transformedClassName;
    };

    var transformSelector = function transformSelector(selector) {
      return (0, _postcssSelectorParser2.default)(function (node) {
        node.walkClasses(transformClassNode);
      }).process(selector).result;
    };

    root.walkRules(function (rule) {
      rule.selectors = rule.selectors.map(transformSelector);
    });
  };
}); /* eslint no-param-reassign: [0] */
