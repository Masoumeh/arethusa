"use strict";

angular.module('arethusa.oa').service('oaHandler', [
  'uriGenerator',
  'state',
  'configurator',
  'documentStore',
  function(uriGenerator, state, configurator, documentStore) {
    var self = this;

    //this.getURI = function(){
    //  return uriGenerator.generateURI();
    //}

    this.getCurrentDate = function() {
      var d = new Date();
      return d.getFullYear() + "-" + d.getMonth()
          + "-" + d.getDate() + "T" + d.getHours() +
          ":" + d.getMinutes() + ":" + d.getSeconds();
    }

    this.generateTarget = function(ids) {
      return arethusaUtil.inject([], ids, function(memo, id) {
        memo.push(state.asString(id));
      }).join(':');
    };

    this.setPersister = function(pers) {
      this.persister = pers;
    }

    this.save = function (refId, motiv, selectorClass, callback, errCallb){
      this.persister.save(refId, motiv, selectorClass, callback, errCallb);
    };
  }
]);
