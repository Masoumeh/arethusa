"use strict";

angular.module('arethusa.oa').service('oaHandler', [
  'uriGenerator',
  'state',
  'documentStore',
  function(uriGenerator, state, documentStore) {
    var self = this;

    this.getURI = function(){
      return uriGenerator.generateURI();
    }

    this.getCurrentDate = function() {
      var d = new Date();
      return d.getFullYear() + "-" + d.getMonth()
          + "-" + d.getData() + "T" + d.getHours() +
          ":" + d.getMinutes() + ":" + d.getSeconds();
    }

    this.generateTarget = function(ids) {
      return arethusaUtil.inject([], ids, function(memo, id) {
        memo.push(state.asString(id));
      }).join(':');
    };
  }
]);
