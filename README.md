# postcss-transform-classes

```
npm install --save postcss-transform-classes
```

Transforms all classes in a CSS file.

```js
import { camelCase } from 'lodash';
import transformClasses from 'postcss-transform-classes';

return postcss([
  transformClasses({
    transform: camelCase,
  }),
])
  .process(...)
```

By default will throw if two different classes produce the same output. In the example above, an error would be thrown if you had `.foo-bar` and `.fooBar`. You can disable this by setting `allowConflicts: true`.
