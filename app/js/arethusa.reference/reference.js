"use strict";

angular.module('arethusa.reference').service('reference', [
  'state',
  'configurator',
  'navigator',
  'plugins',
  'oaPersister',
  '$http',
  function(state, configurator, navigator, plugins, oaPersister, $http) {
      var self = this;
      this.name = 'reference';
      var retriever, persister;
      var refArr = [];
      var tokenMapRef = new Map();
      var tokenRefMap = new Map();
      var id = 0;
      var allData;
      var conf;
      //var refId;

      this.getAllData = function() {
          return allData;
      };

      this.defaultConf = {
          template: 'templates/arethusa.reference/reference.html'
      };

      function configure() {
          conf = configurator.getConfAndDelegate(self);
          retriever = configurator.getRetriever(self.conf.retriever);
          persister = retriever;
      };

      function Ref(id, ids, cToken, link) {
          this.id = id;
          this.ids = ids;
          //this.sentenceId = sentenceId;
          this.cToken = cToken;
          this.link = link;
      };

      function selectedRef(id) {
          return state.getToken(id).ref;
      }
      this.mapRefToToken = function(refId, cToken) {
        tokenRefMap[cToken] = refId;
        return tokenRefMap;
      };
      this.getRefToToken = function() {
        return tokenRefMap;
      };
      this.createNewRef = function (id, selectorClass, cToken, ref) {
          var oaPersist = new oaPersister(conf);
          var oa = oaPersist.oa(id, "oa:identifying", selectorClass, saveSuccess, saveError);
          //alert("oa:" + JSON.stringify(oa, null, 4));
          oaPersist.save(oa);
          //oaPersister.save(id, saveSuccess, saveError);
              //Object.prototype.getName = function () {
          //  var funcNameRegex = /function (.{1,})\(/;
          //  var results = (funcNameRegex).exec((this).constructor.toString());
          //  return (results && results.length > 1) ? results[1] : "";
          //};
          //var newRef = new Ref(id, ids, cToken, ref);
          //id++;
          var oa = {};

          //body["places"].push(oa);

          //refArr.push(body);
          //    if (cToken in tokenMapRef) {
          //        tokenMapRef[cToken] = tokenMapRef[cToken] + "|" + ref;
          //  }
          //  else {
          //        tokenMapRef[cToken] = ref;
          //  }
          //  persister.saveData(refArr, saveSuccess, saveError);
          //return [refArr, tokenMapRef];
      };

      this.splitRefs = function (map, key) {
          return map[key].split('|').toString();
      };
      function getRefs() {

          retriever.get(function (refs) {
              for (var i = 0; i < refs.length; i++) {
                  refArr.push(refs[i]);
                  if (tokenMapRef.hasOwnProperty(refs[i].cToken)) {
                      tokenMapRef[refs[i].cToken] = tokenMapRef[refs[i].cToken] + "|" + refs[i].link;
                  }
                  else {
                      tokenMapRef[refs[i].cToken] = refs[i].link;
                  }
              }
          });
      };

      function saveSuccess() {
          alert('success');
      };

      function saveError() {
          alert('error');
      };

      this.init = function () {
          configure();
          getRefs();
          $.ajax("/pleiades-geojson/name_index.json",
          {
              type: 'GET',
              dataType: 'json',
              crossDomain: true,
              error: function (jqXHR, textStatus, errorThrown) {
                  return console.log("AJAX Error: " + textStatus);
              },
              success: function (data) {
                  allData = data;
                  //alert("success " + search_for("Rome",data));
              }
          });

    }
  }
]);

