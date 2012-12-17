'use strict';

/**
 * Use `npm` to install the modules, so we don't have to re-invent the wheel.
 */
var path = require('path')
  , npm = require('npm')
  , fs = require('fs')
  , undefined;

/**
 * Get some default configuration for npm.
 *
 * @type {Object}
 */
var configuration = require('npm/lib/utils/config-defs');

// Update some of the default configuration stuff from npm..
configuration.loglevel = 'silent';

/**
 * Generate a dot directory in the home directory of the user, this directory is
 * could be used to store the `canihaz` based modules. This way we don't need
 * root rights for installations when users installed the module using the -g
 * flag.
 *
 * @param {String} name
 * @return {Mixed} error if we cannot generate a module
 * @api private
 */
function dotFolder(name) {
  // Windows doesn't have env.HOME but env.USERPROFILE
  var location = path.join(process.env.HOME || process.env.USERPROFILE, '.' + name);

  // If the location already exists, lets make sure that it's actually an
  // directory that we can use.
  if (fs.existsSync(location)) {
    return fs.statSync(location).isDirectory()
      ? location
      : new Error(location + ' is not an directory');
  }

  // the location doesn't exist, so we are going to generate the directory
  try {
    fs.mkdirSync(location);
    return location;
  } catch (e) {
    return e;
  }
}

/**
 * The actual module.
 *
 * @param {String} dot name of the dot folder to use
 * @param {String} location location of the package.json to parse
 * @returns {Object}
 */
module.exports = function canihaz(dot, location) {
  /**
   * The actual installation or require method.
   *
   * @param {String} packages
   * @param {String} version
   * @param {Function} fn
   * @api private
   */
  function has(packages, version, fn) {
    var location = path.join(installation, 'node_modules', packages)
      , currentversion;

    if (fs.existsSync(location)) {
      try { currentversion = require(path.join(location, 'package.json')).version; }
      catch (e) {}

      // Not that we hopefully got the current version from the package.json
      // file we are going to compare it with our given function.
      if (currentversion === version) {
        try { return fn(undefined, require(location)); }
        catch (e) { /* failed to install, continue to npm.load */}
      }
    }

    // Try to determin if we already have this package installed
    npm.load(configuration, function npmloaded(err) {
      if (err) return fn(err);

      npm.commands.install(
          installation
        , [packages + '@' + version]
        , function installed(err) {
            if (err) return fn(err);
            return fn(undefined, require(location));
          }
      );
    });
  }

  // Determin the location of the package.json file that has the `canihaz`
  // section.
  var destination = path.join(location || __dirname, '../../..')
    , installation = dot ? dotFolder(dot) : destination
    , dependencies = require(path.join(destination, 'package.json')).canihaz
    , exporter = Object.create(null);

  // Generate a list of modules that can be installed based on the `canihaz`
  // field in the package.json
  Object.keys(dependencies).forEach(function iterate(name) {
    Object.defineProperty(exporter, name, {
      get: function findPackage() {
        return has.bind(has, name, dependencies[name]);
      }
    });
  });

  // Simple helper function for requiring every module as specified
  if (!('all' in exporter)) {
    /**
     * Helper function when you want to fetch multiple modules in one go.
     *
     * @param {Function} cb the last argument is always the callback
     * @api public
     */
    exporter.all = function all() {
      var args = Array.prototype.slice.call(arguments, 0)
        , cb = args.pop()
        , fetched = {}
        , error;

      args.forEach(function has(lib) {
        exporter[lib](function lazyfetch(err, library) {
          fetched[lib] = library;

          // Store errors if they are given.
          if (err && !error) error = err;
          if (Object.keys(fetched).lengh < args.length) return;

          var applies = [error];

          // Add the libraries back in the same order as supplied in the
          // arguments.
          args.forEach(function add(item) {
            applies.push(fetched[item]);
          });

          cb.apply(cb, applies);
        });
      });
    };
  }

  // Return the exporter
  return exporter;
};
