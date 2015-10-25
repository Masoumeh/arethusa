"use strict";

angular.module('arethusa.oa').factory('oaPersister', [
  'configurator',
  'oaHandler',
  'uriGenerator',
  function(configurator, oaHandler, uriGenerator) {
      var res;
      return function (conf) {
          var self = this;
          res = configurator.provideResource(conf.resource);

          this.oa = function (refId, motiv, selector, tarToken, callback, errCallback) {
              var oa = {};
              oa["@context"] = "http://www.w3.org/ns/oa-context-20130208.json";
              oa["@id"] = "id";
              oa["@type"] = "oa:Annotation";
              oa["annotatedAt"] = oaHandler.getCurrentDate();
              oa["dcterms:source"] = "http";
              oa["dcterms:title"] = "http";
              oa["hasBody"] = {};
              oa["hasBody"]["@id"] = refId;
              oa["hasTarget"] = {};
              oa["hasTarget"]["@id"] = "http";
              oa["hasTarget"]["@type"] = "oa:SpecificResource";
              oa["hasTarget"]["hasSelector"] = oaHandler.getURI(selector, tarToken);
              oa["hasTarget"]["hasSource"] = {};
              oa["hasTarget"]["hasSource"]["@id"] = "http";
              //oa["hasSelector"] = uriGenerator.generateURI(selectorClass);
              oa["motivatedBy"] = motiv;
              oa["serializedBy"] = {};
              oa["serializedBy"]["@id"] = "http";
              oa["serializedBy"]["@type"] = "prov:SoftwareAgent";
              //resource.save(oa, self.mimeType).then(callback, errCallback);
              return oa;
          };

          this.save = function (oa) {
              res.save(oa, self.mimeType).then(callback, errCallback);
          };

          this.mimeType = 'application/json';
      };
  //return this;
  }
]);
