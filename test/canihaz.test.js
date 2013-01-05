describe('canihaz?', function () {
  'use strict';

  //
  // Third party module dependencies
  //
  var chai = require('chai')
    , expect = chai.expect;

  chai.Assertion.includeStack = true;

  //
  // The actual library that we run tests against
  //
  var canihaz = require('canihaz');

  it('should expose it self as a function', function () {
    expect(canihaz).to.be.a('function');
  });

  it('exposes the queue', function () {
    expect(canihaz.queue).to.be.an.instanceof(require('events').EventEmitter);
  });
});
