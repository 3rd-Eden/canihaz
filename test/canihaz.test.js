describe('canihaz?', function () {
  'use strict';

  //
  // Modules that are required for asserting the tests
  //
  var assume = require('assume')
    , path = require('path')
    , fs = require('fs');

  //
  // The actual library that we run tests against
  //
  var canihaz = require('canihaz');

  //
  // The package.json file that contains all the definitions
  //
  var definitions = require('../package.json');

  //
  // The location of the home directory of the user
  //
  var home = process.env.HOME || process.env.USERPROFILE;

  it('should expose it self as a function', function () {
    assume(canihaz).to.be.a('function');
  });

  it('exposes the queue', function () {
    assume(canihaz.queue).to.be.an.instanceof(require('events').EventEmitter);
  });

  describe('@ configuration', function () {
    it('should read out a different key', function () {
      var has = canihaz({ key: 'devDependencies' });

      Object.keys(definitions.devDependencies).forEach(function (lib) {
        assume(has[lib]).to.be.a('function');
      });
    });

    it('should read the package.json from a different location', function () {
      var has = canihaz({ location: __dirname })
        , definitions = require(__dirname + '/package.json');

      Object.keys(definitions.canihaz).forEach(function (lib) {
        assume(has[lib]).to.be.a('function');
      });
    });

    it('should create a dot folder in the home folder', function (done) {
      var has = canihaz({ dot: 'foo' });

      has.request(function lazy(err, request) {
        assume(request).to.be.a('function');
        assume(err).to.not.be.an.instanceof(Error);

        fs.stat(path.join(home, '.foo'), done);
      });
    });

    it('should create a dot folder in the home folder (alternate)', function (done) {
      var has = canihaz('foo');

      has.request(function lazy(err, request) {
        assume(request).to.be.a('function');
        assume(err).to.not.be.an.instanceof(Error);

        fs.stat(path.join(home, '.foo'), done);
      });
    });

    it('should create a dot folder in a custom home folder', function (done) {
      var has = canihaz({ home: __dirname, dot: 'foo' });

      has.request(function lazy(err, request) {
        assume(err).to.not.be.an.instanceof(Error);
        assume(request).to.be.a('function');

        fs.stat(path.join(__dirname, '.foo'), done);
      });
    });

    after(function cleanup(done) {
      var rmrf = require('rimraf')
        , error;

      // Remove the generated dot folder
      rmrf(path.join(home, '.foo'), function (err) {
        error = err;

        // Remove the custom dot folder location
        rmrf(path.join(__dirname, '.foo'), function (err) {
          done(error || err);
        });
      });
    });
  });

  describe('- Requiring a un-configured dependency', function () {
    it('should require a dependency with a version', function (done) {
      canihaz()('request', '1.2.0', done);
    });

    it('should require a dependency without a version', function (done) {
      canihaz()('socket.io', '', done);
    });
  });

  describe('- Requiring multiple dependencies', function () {
    it('should install multiple dependencies', function (done) {
      var has = canihaz();

      has('request', 'routable', 'useragent', function (err, request, routable, ua) {
        assume(err).to.not.be.an.instanceof(Error);

        assume(request).to.be.a('function');
        assume(routable).to.be.a('function');
        assume(ua).to.be.a('function');
        assume(ua.parse).to.be.a('function');

        done();
      });
    });

    it('should install multiple dependencies with version nrs', function (done) {
      var has = canihaz();

      has(
          { name: 'async', version: '0.1.22' }
        , 'underscore'
        , { name: 'jade', version: '0.27.7' }
        , function (err, async, _, jade) {
            assume(err).to.not.be.an.instanceof(Error);

            assume(async.forEach).to.be.a('function');
            assume(_.each).to.be.a('function');
            assume(jade.compile).to.be.a('function');

            done();
          }
      );
    });
  });
});
