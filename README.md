[![build status](https://secure.travis-ci.org/3rd-Eden/canihaz.png)](http://travis-ci.org/3rd-Eden/canihaz)
# Canihaz?

Canihaz is module that allows you to lazy install npm modules that might not be
required to use your module but it required to unlock some of it's features. For
example in observing/square I use the `canihaz` module to lazy load the modules
that are used in the plugins that ship with the build system as not everybody
might be interested in linting their code, so jshint and csshint are lazy
installed when you use the lint plugin.

# How doz it workz?

The module reads out your `package.json` file and searches for the `canihaz`
object. This is where you specify which modules and version you want to have
lazy loaded. It follows the same format as your regular dependencies
specifications:

```js
{
    "name": "example"
  , "description": "example description"
  , "version": "0.0.0"
  , "dependencies": {
        "canihaz": "0.0.x"
    }
  , "canihaz": {
        "coffee-script": "1.3.3"
      , "csslint": "0.9.8"
      , "jshint": "0.7.1"
      , "socket.io": "0.9.6"
      , "stylus": "0.27.2"
      , "watch": "0.5.1"
    }
}
```

When you require the `canihaz` module and call it will read out the package.json
and return the package names as keys with as value a function that automatically
requires the module if it's already installed and lazy installs npm module if it
cannot be found. So for example if we want to get stylus from our code:

```js
var canihaz = require('canihaz')();

canihaz.stylus(function lazyload(err, stylus) {
// if we you got an error, something went wrong, probably the installation
// or something else silly.

// stylus is actual result that you would expect if you did a require('stylus');
// please note that this function is executed async
});
```

# Alternate install location

canihaz will automatically the modules in the node_modules folder where canihaz
has also be installed, if you want to install it in a different location you can
supply that as the first argument when you call the canihaz module. This will
automatically create the folder in the home directory of the user and makes it
hidden by adding a dot to the folder name..

```
var canihaz = require('canihaz')('pewpew');

// this will install all the canihaz modules in a .pewpew folder in the ~/ home
// directory
```

# Alternate package.json

If you wish to load a package.json file from a other directory than the module
that required canihaz you can specify it as the second argument.

```js
// install modules in the ~/.pewpew folder, and get the package.json from
// /home/lolz/package.json
var canihaz = require('canihaz')('pewpew', '/home/lolz/');
```
