"use strict";

describe('ArethusaReferenceRetriever', function() {
  var retriever, backend;

  var backendUrl = '';

  var conf = {
    resources: {
      testResource: {
        route: backendUrl
      }
    }
  };

  beforeEach(function() {
    module('arethusa.core');
    module('arethus.reference');

    inject(function($httpBackend, configurator, locator) {
      backend = $httpBackend;
      configurator.defineConfiguration(conf);
      retriever = configurator.getRetriever({
        ArethusaReferenceRetriever : {
          resource: 'testResource' 
        }
      });
      locator.watchUrl(false);
      locator.set({});
    });
  });

  describe('get', function() {
    it('...', function() {
      var response = {};

      backend.when('GET', backendUrl).respond(response);

      // Your GET code goes here!

      backend.flush();

      // Your first expectation goes here!
    });
  });
});
