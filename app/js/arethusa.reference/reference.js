"use strict";

angular.module('arethusa.reference').service('reference', [
  'state',
  'configurator',
  'navigator',
  'plugins',
  'oa',
  '$http',
  function(state, configurator, navigator, plugins, oa, $http) {
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
          var oaObject = oa.createOA(id, "oa:identifying", "oaTextQouteSelector");
          persister.saveData(oaObject,saveSuccess,saveError);
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
