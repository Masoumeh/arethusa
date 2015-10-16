"use strict";

angular.module('arethusa.oa').service('uriGenerator', [
  'state',
  function(state) {
    this.generateURI = function(token, selectorClass, preNum, sufNum) {
      var uri = {};
      uri["@id"] = "http://data.perseus.org/collections/urn:cite:perseus";
      uri["@type"] = selectorClass;
      uri["exact"] = state.asString(Object.keys(token));
      if (preNum == 1)
        uri["prefix"] = state.prevToken().string;
      else {
        var pre;
        pre = state.prevToken().string;
        for (var i = preNum - 2; i >= 0 ; i--) {
          pre += " " + state.prevIthToken(preNum - i).string;
        }
        uri["prefix"] = pre;
      }
      if (sufNum == 1) {
        uri["suffix"] = state.nextToken().string;
      }
      else {
        var suf;
        suf = state.nextToken().string;
        for (var i = 1; i <= sufNum - 1; i++) {
          suf += " " + state.nextIthToken(i + 1).string;
        }
        uri["suffix"] = suf;
      }
      return uri;
    }
  }
]);
