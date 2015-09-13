"use strict";

angular.module('arethusa.oa').factory('oaPersister', [
  'configurator',
  'oaHandler',
  function(configurator, oaHandler) {
      return function (conf) {
          var self = this;
          var resource = configurator.provideResource(conf.resource);

          this.save = function (data, callback, errCallback) {
              var oa = {};
              oa["@context"] = "http://www.w3.org/ns/oa-context-20130208.json";
              oa["@id"] = ref;
              oa["@type"] = "oa:Annotation";
              oa["annotatedAt"] = oaHandler.getCurrentDate();
              oa["dcterms:source"] = "http";
              oa["dcterms:title"] = "http";
              oa["hasBody"] = {};
              oa["hasBody"]["@id"] = "http";
              oa["hasTarget"] = {};
              oa["hasTarget"]["@id"] = "http";
              oa["hasTarget"]["@type"] = "oa:SpecificResource";
              oa["hasTarget"]["hasSelector"] = oaHandler.getURI();
              oa["hasTarget"]["hasSource"] = {};
              oa["hasTarget"]["hasSource"]["@id"] = "http";
              oa["motivatedBy"] = "oa:identifying";
              oa["serializedBy"] = {};
              oa["serializedBy"]["@id"] = "http";
              oa["serializedBy"]["@type"] = "prov:SoftwareAgent";
              resource.save(oa, self.mimeType).then(callback, errCallback);
          };

          this.mimeType = 'application/json';
      };
  }
]);
