"use strict";

angular.module('arethusa.reference').service('reference', [
  'state',
  'configurator',
  'plugins',
  'navigator',
  function(state, configurator, navigator, plugins) {
    var self = this;
    this.name = 'reference';

    var retriever, persister;
    var refArr = [];
    var tokenMapRef = new Map();
    var id = 0;


    this.defaultConf = {
      template: 'templates/arethusa.reference/reference.html'
    };

    function configure() {
      configurator.getConfAndDelegate(self);
      retriever = configurator.getRetriever(self.conf.retriever);
      persister = retriever;
    };

    function Ref(id,ids, cToken, link) {
      this.id= id;
      this.ids = ids;
      //this.sentenceId = sentenceId;
      this.cToken=cToken;
      this.link = link;
    };

    this.createNewRef = function(ids, cToken,ref) {
      var newRef = new Ref(id, ids, cToken, ref);
      id++;
      refArr.push(newRef);
        alert("cToken in create:" + cToken);
//        if (tokenMapRef.has(cToken)) {
        if (cToken in tokenMapRef) {
//          tokenMapRef.push(cToken);
            tokenMapRef[cToken] = tokenMapRef[cToken] + "|" + ref;
            alert("create token map:" + tokenMapRef[cToken]);
      }
      else {
            tokenMapRef[cToken] = ref;
            alert("create else:" + tokenMapRef[cToken] );
      }
      persister.saveData(refArr, saveSuccess, saveError);
//        persister.saveData(tokenMapRef, saveSuccess, saveError);
//        alert("length save map:" + tokenMapRef.length)
          return tokenMapRef;
    };

    function getRefs() {

        alert("get refs!");
        retriever.get(function(refs) {
//            alert("retriever");
//            alert("refs length:" + refs.length);
            for (var i = 0; i < refs.length; i++) {
//                alert("refArr loop");
                refArr.push(refs[i]);
//                alert("get refArr");
//                alert("current token:" + refs[i].cToken);
                if (tokenMapRef.hasOwnProperty(refs[i].cToken)) {
//                    alert("has token in map!");
                    tokenMapRef[refs[i].cToken] = tokenMapRef[refs[i].cToken] + "|" + refs[i].link;
//                    alert("map value: " + tokenMapRef[refs[i].cToken]);
                }
                else {
//                    alert("doesn't have token in map!");
                    tokenMapRef[refs[i].cToken] = refs[i].link;
//                    tokenMapRef.set(refs[i].cToken, refs[i].link);
                }
            }
            alert("retriever lenght:" +tokenMapRef.size);
        });
    };

    function saveSuccess() {
      //alert('success');
    };

    function saveError() {
      //alert('error');
    };

    this.init = function() {
      configure();
      getRefs();
    };
  }
]);
