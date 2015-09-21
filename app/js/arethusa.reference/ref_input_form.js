"use strict";

angular.module('arethusa.reference').directive('refInputForm', [
  'reference',
  'state',
  function(reference,state) {
    return {
//      restrict: 'A',
//      scope: {},
      link: function(scope, element, attrs) {
        scope.refArr = [];
        scope.tokenMapRef = new Object();
        scope.selectedRefMap = new Object();
        scope.state = state;
        scope.ref = {
            id : 'none'
        };

        scope.submit = function() {
           scope.refArr = reference.createNewRef(scope.ids,scope.currentTokenStrings,scope.ref)[0];
           scope.tokenMapRef = reference.createNewRef(scope.ids,scope.currentTokenStrings,scope.ref)[1];
           scope.selectedRefMap = reference.mapRefToToken(scope.ref.id, scope.currentTokenStrings);
           console.log(JSON.stringify( scope.selectedRefMap, null, 4));
        };
        scope.splitRefs = function(token) {
          return reference.splitRefs(scope.tokenMapRef, token);
        };

        function currentTokens() {
             return scope.active ? state.toTokenStrings(scope.ids) : '';
        }

        function begins_with(input_string, comparison_string) {
          return input_string.toUpperCase().indexOf(comparison_string.toUpperCase()) === 0;
        };

        function nameMatches() {
          return reference.getAllData().filter(function(entry) {
              return begins_with(entry[0], currentTokens());
          });
        };

        function uniqueIds () {
            var name_matches = nameMatches();
            var unique_ids = _.uniq(name_matches.map(function(match) {
                return match[1];
            }));
            return unique_ids;
        };

        function results () {
            var _i, _len, _results;
            _results = [];
            var unique_ids = uniqueIds();
            for (_i = 0, _len = unique_ids.length; _i < _len; _i++) {
                var unique_id = unique_ids[_i];
                _results.push([
                    (function () {
                        var _j, _len1, _results1;
                        _results1 = [];
                        var name_matches = nameMatches();
                        for (_j = 0, _len1 = name_matches.length; _j < _len1; _j++) {
                            var name_match = name_matches[_j];
                            if (name_match[1] === unique_id) {
                                _results1.push(name_match[0]);
                            }
                        }
                        return _results1;
                    })(), unique_id
                ]);
            }
        };

          function getGeography(data) {
              var modernCountry;
              $.ajax("http://api.geonames.org/countrySubdivisionJSON?lat=" +
                  data.reprPoint[1]  + "&lng=" + data.reprPoint[0] + "&username=ryanfb",
                  {
                      type: 'GET',
                      dataType: 'json',
                      crossDomain: 'true',
                      async: false,
                      error: function(jqXHR, textStatus, errorThrown) {
                          return console.log("AJAX Error: " + textStatus);
                      },
                      success: function(data) {
                          alert("success" + data.countryName + " " + data.adminName1);
                          var modern_country;
                          if (data.countryName) {
                              modern_country = data.countryName;
                              if (data.adminName1) {
                                  modern_country += " > " + data.adminName1;
                              }
                              //scope.tokenRefs[0].country = modern_country;
                              modernCountry= modern_country;
                              //state.
                          }
                      }
                  });
              return modernCountry;
          }

        scope.$watchCollection('state.clickedTokens', function(newVal, oldVal) {
          scope.ids = Object.keys(newVal).sort();
          scope.active = scope.ids.length;
          scope.currentTokenStrings = currentTokens();
          if(currentTokens() == "") {
              return;
          }

            var refToToken = reference.getRefToToken();
            var _results = [];
            if(refToToken[currentTokens()] != null) {
                scope.tokenRefs = new Array(1);
                var res = refToToken[currentTokens()];
                scope.tokenRefs[0] = {};
                scope.tokenRefs[0].id = refToToken[currentTokens()];
                //scope.tokenRefs[0].name = res[0] + "";
                scope.tokenRefs[0].placeLink="http://pleiades.stoa.org/places/"+res;
                scope.tokenRefs[0].country = "";
                $.ajax("/pleiades-geojson/geojson/" + res
                    + ".geojson", {
                    type: 'GET',
                    dataType: 'json',
                    crossDomain: true,
                    async: false,
                    error: function(jqXHR, textStatus, errorThrown) {
                        return console.log("AJAX Error: " + textStatus);
                    },
                    success: function(data) {
                        scope.tokenRefs[0].dsp = data.description;
                        scope.tokenRefs[0].name = data.names[0];
                        scope.tokenRefs[0].country = getGeography(data);
                    }
                });
                return;
                //_results.push(curre)
            }

          var name_matches = reference.getAllData().filter(function(entry) {
            return begins_with(entry[0], currentTokens());
          });
          var unique_ids = _.uniq(name_matches.map(function(match) {
                return match[1];
          }));

          var _i, _len;
          for (_i = 0, _len = unique_ids.length; _i < _len; _i++) {
              var unique_id = unique_ids[_i];
              _results.push([
                  (function () {
                      var _j, _len1, _results1;
                      _results1 = [];
                      for (_j = 0, _len1 = name_matches.length; _j < _len1; _j++) {
                          var name_match = name_matches[_j];
                          if (name_match[1] === unique_id) {
                              _results1.push(name_match[0]);
                          }
                      }
                      return _results1;
                  })(), unique_id
              ]);
          }
          //var _results = results();
            scope.tokenRefs = new Array(_results.length);


            for(var ii = 0; ii <  _results.length; ii ++) {
                var res = _results[ii];
                scope.tokenRefs[ii] = {};
                scope.tokenRefs[ii].id = res[1];
                scope.tokenRefs[ii].name = res[0] + "";
                scope.tokenRefs[ii].placeLink="http://pleiades.stoa.org/places/"+res[1];
                scope.tokenRefs[ii].country = "";
                var dsp = "";
                    $.ajax("/pleiades-geojson/geojson/" + res[1] + ".geojson", {
                    type: 'GET',
                    dataType: 'json',
                    crossDomain: true,
                        async: false,
                    error: function(jqXHR, textStatus, errorThrown) {
                        return console.log("AJAX Error: " + textStatus);
                    },
                    success: function(data) {
                        scope.tokenRefs[ii].dsp =  data.description;
                        scope.tokenRefs[ii].country = getGeography(data);
                    }
                });
            }

            function saveSelectedRef(){

            }
        });

      },
      templateUrl: 'templates/arethusa.reference/ref_input_form.html'
    };
  }

]);