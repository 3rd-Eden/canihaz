describe('canihaz?', function () {
  'use strict';

  //
  // Modules that are required for asserting the tests
  //
  var chai = require('chai')
    , path = require('path')
    , expect = chai.expect
    , fs = require('fs');

  chai.Assertion.includeStack = true;

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
    expect(canihaz).to.be.a('function');
  });

  it('exposes the queue', function () {
    expect(canihaz.queue).to.be.an.instanceof(require('events').EventEmitter);
  });

  describe('@ configuration', function () {
    it('should read out a different key', function () {
      var has = canihaz({ key: 'devDependencies' });

      Object.keys(definitions.devDependencies).forEach(function (lib) {
        expect(has[lib]).to.be.a('function');
      });
    });

    it('should create a dot folder in the home folder', function (done) {
      var has = canihaz({ dot: 'foo' });

      has.request(function lazy(err, request) {
        expect(request).to.be.a('function');
        expect(err).to.not.be.an.instanceof(Error);

        fs.stat(path.join(home, '.foo'), done);
      });
    });

    it('should create a dot folder in the home folder (alternate)', function (done) {
      var has = canihaz({ home: __dirname, dot: 'foo' });

      has.request(function lazy(err, request) {
        expect(err).to.not.be.an.instanceof(Error);
        expect(request).to.be.a('function');

        fs.stat(path.join(__dirname, '.foo'), done);
      });
    });

    it('should create a dot folder in a custom home folder');

    it('should read the package.json from a different location');

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

  describe('- Requiring a configured dependency', function () {
  });

  describe('- Requiring a un-configured dependency', function () {
  });

  describe('- Requiring multiple dependencies', function () {
  });
});
