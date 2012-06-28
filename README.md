# canihaz

`canihaz` is a small module that makes it possible to lazy install npm modules.

## How?

The module checks your `package.json` file for a special `canihaz` object, this
object is formatted just like your regular `dependencies` key where there `key`
is the name of the module that needs to be installed and the value is the
`version` of this module that you require.


```js
var canihaz = require('canihaz')();

canihaz.watch(function async(err, watch) {
  // watch is the result of require('watch');
});
```

It's also possible to store these extra `canihaz` in the home directory of the
user.

```js
// this will install modules in the ~/.pewpew folder
var canihaz = require('canihaz')('pewpew');
```

If you want to load a package.json file from a other directory than from the
module that required your canihaz, you can supply it with the second argument:

```js
// install modules in the ~/.pewpew folder, and get the package.json from
// /home/lolz/package.json
var canihaz = require('canihaz')('pewpew', '/home/lolz/');
```
