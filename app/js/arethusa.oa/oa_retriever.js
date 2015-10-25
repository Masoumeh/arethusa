"use strict";

angular.module('arethusa.oa').factory('oaRetriever', [
  'configurator',
  'oaHandler',
  function(configurator, oaHandler) {

    return function(conf) {
      var self = this;
      var resource = configurator.provideResource(conf.resource);

        this.parseOa=function(refs) {
            var ids = new Object();
            angular.forEach(refs, function(ref, index) {
                var hasBody = ref.hasBody["@id"];
                var arrOfSplit = hasBody.split("/");
                var id = arrOfSplit[arrOfSplit.length-1];
                var exactToken = ref.hasTarget.hasSelector.exact;
                ids[exactToken]=id;
            });
            return ids;
        }

      this.get = function(callback) {
        resource.get().then(function(res) {
          var data = res.data;
          console.log(JSON.stringify("retriever data: "+data,null,4));
          callback(data);
        });
      };
    };
  }
]);
