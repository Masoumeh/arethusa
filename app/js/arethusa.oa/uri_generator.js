"use strict";

angular.module('arethusa.oa').service('uriGenerator', [
  'state',
  function(state) {
    this.generateURI = function(selectorClass, exactToken) {
      var uri = {};
      uri["@id"] = "http://data.perseus.org/collections/urn:cite:perseus";
      uri["@type"] = selectorClass;
      uri["exact"] = exactToken;
      uri["suffix"] = state.nextToken(exactToken).string;
      uri["prefix"] = state.prevToken(exactToken).string;
      return uri;
    }
  }
]);
