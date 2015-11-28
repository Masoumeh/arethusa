"use strict";

angular.module('arethusa.reference').service('reference', [
  'state',
  'configurator',
  'navigator',
  'plugins',
  'oaPersister',
  'oaRetriever',
  '$http',
  function(state, configurator, navigator, plugins, oaPersister, oaRetriever,$http) {
      var self = this;
      this.name = 'reference';
      var retriever, persister;
      var refArr = [];
      var tokenRefMap = new Map();
      var id = 0;
      var allData;
      var conf;

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
      // To be used in fetching the references of a selected token which
      // has been got
      this.mapRefToToken = function(refId, cToken) {
        tokenRefMap[cToken] = {};
          tokenRefMap[cToken][id] = refId;
        return tokenRefMap;
      };
      this.getTokenRefMap = function() {
        return tokenRefMap;
      };
 
      function saveSuccess() {

      };

      function saveError() {

      };
      this.createNewRef = function (id, selectorClass, cToken, ref) {
          var oaPersist = new oaPersister(conf);
          var oa = oaPersist.oa(id, "oa:identifying", selectorClass, cToken, saveSuccess, saveError);
          refArr.push(oa);
          persister.saveData(refArr, saveSuccess, saveError);
          return refArr;
      };

      this.splitRefs = function (map, key) {
          return map[key].split('|').toString();
      };
      function getRefs() {
          retriever.get(function (refs) {
              refArr=refs;
              var oaRet = new oaRetriever(conf);
              tokenRefMap = oaRet.parseOa(refs);
          });
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
              }
          });

    }
  }
]);

