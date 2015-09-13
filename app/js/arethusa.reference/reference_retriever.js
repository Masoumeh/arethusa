"use strict";

angular.module('arethusa.reference').factory('ReferenceRetriever', [
  'configurator',
    'oaPersister',
  function(configurator,oaPersister) {
    return function(conf) {
      var self = this;
      var resource = configurator.provideResource(conf.resource);

      this.saveData = function(ref,success,error) {
          oaPersister.save('mamad');
        //resource.save(ref).then(success,error);
      };

      this.get = function(callback) {
        resource.get().then(function(res) {
          var data = res.data;
          callback(data);
        });
      };
    };
  }
]);
