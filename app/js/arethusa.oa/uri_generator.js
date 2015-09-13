"use strict";

angular.module('arethusa.oa').service('uriGenerator', [
  'state',
  function(state) {
    this.generateURI = function()
    {
      var uri = {};
      uri["@id"] = "http://data.perseus.org/collections/urn:cite:perseus";
      uri["@type"] = "oa:TextQuoteSelector";
      uri["exact"] = state.selectedTokens;
      uri["suffix"] = state.nextToken().string;
      uri["prefix"] = state.prevToken().string;
      return uri;
    }
  }
]);
