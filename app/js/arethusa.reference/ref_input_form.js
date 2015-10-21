"use strict";

angular.module('arethusa.reference').directive('refInputForm', [
  'reference',
  'state',
  function(reference,state) {
      return {
//      restrict: 'A',
//      scope: {},
          link: function (scope, element, attrs) {
              scope.refArr = [];
              scope.tokenMapRef = new Object();
              scope.selectedRefMap = new Object();
              scope.resultToTokenMap = new Map();
              scope.matchedTokens = [];
              scope.state = state;
              scope.ref = {
                  id: 'none',
                  selector: 'oa:TextQuoteSelector',
                  preNum: 1,
                  sufNum: 1
              };
              scope.allJsonData = reference.getAllData();

              scope.submit = function () {

                  scope.selectedRefMap = reference.mapRefToToken(scope.ref.id, scope.currentTokenStrings);
                  reference.createNewRef(scope.ref.id, scope.ref.selector, scope.currentTokenStrings, scope.ref.preNum, scope.ref.sufNum);
                  console.log(JSON.stringify(scope.selectedRefMap, null, 4));
              };
              scope.splitRefs = function (token) {
                  return reference.splitRefs(scope.tokenMapRef, token);
              };

              function currentTokens() {
                  return scope.active ? state.toTokenStrings(scope.ids) : '';
              }

              function begins_with(input_string, comparison_string) {
                  return input_string.toUpperCase().indexOf(comparison_string.toUpperCase()) === 0;
              };

              function begins_with_some(input_string, comparison_string) {
                  var test = false;
                  for (var i=0; i < comparison_string.length; i++) {
                      // for tokens with length bigger than 2
                      // to avoid huge number of results which we don't need
                      if (comparison_string[i].length >= 3)
                          if (begins_with(input_string, comparison_string[i])) {
                              test = true;
                              //scope.matchedTokens[i] = comparison_string[i];
                          }
                  }
                  return test;
              };

              function nameMatches() {
                  return reference.getAllData().filter(function (entry) {
                      var tokens = currentTokens().split(/\...|\ /);
                      return begins_with_some(entry[0],tokens);
                      //return begins_with(entry[0], currentTokens());
                  });

              };

              function uniqueIds(names) {
                  //var name_matches =
                  //names = [[a,1], [b,2], [c,1]];
                  var unique_ids = _.uniq(names.map(function (match) {
                      return match[1];
                  }));
                  return unique_ids;
              };

              function results() {
                  var _i, _len, _results;
                  _results = [];
                  var name_matches = nameMatches();
                  //alert()
                  var unique_ids = uniqueIds(name_matches);
                  for (_i = 0, _len = unique_ids.length; _i < _len; _i++) {
                      var unique_id = unique_ids[_i];
                      _results.push([
                          (function () {
                              var _j, _len1, _results1;
                              _results1 = [];

                              for (_j = 0, _len1 = name_matches.length; _j < _len1; _j++) {

                                  var name_match = name_matches[_j];
                                  //alert(JSON.stringify("name_match: " + name_match,null,4));
                                  if (name_match[1] === unique_id) {
                                      //var tmp = [];
                                      //tmp.push(name_match[0]);
                                      //tmp.push(tokenStr);
                                      _results1.push(name_match[0]);
                                  }
                                }
                              //alert(JSON.stringify("results1 in results func: " +_results1));

                              return _results1;
                          })(), unique_id
                      ]);
                  }
                  //alert(JSON.stringify("results in results func: " +_results));
                  //alert(JSON.stringify("results length in results func: " +_results.length));
                  return _results;
              };

              scope.mapResultsToToken = function (_results, token) {
                  for (var i = 0; i < _results.length; i++) {
                      if (begins_with(_results[i][0].toString(), token)) {
                          _results[i][2] = token;
                          //alert("results[i][2]: " + _results[i][2]);
                          //scope.resultToTokenMap[_results[i][2]] = token;
                          //alert(JSON.stringify("result for map: " + scope.resultToTokenMap, null, 4));
                          //alert(JSON.stringify("_results in mapResultToToken:"+ _results));
                      }
                  }
                  return _results;
              };

              function getCountry(_results, data, ii) {
                  $.ajax("http://api.geonames.org/countrySubdivisionJSON?lat=" +
                      data.reprPoint[1] + "&lng=" + data.reprPoint[0] + "&username=ryanfb",
                      {
                          type: 'GET',
                          dataType: 'json',
                          crossDomain: 'true',
                          error: function (jqXHR, textStatus, errorThrown) {
                              return console.log("AJAX Error: " + textStatus);
                          },
                          success: function (data) {
                              var modern_country;
                              if (data.countryName) {
                                  modern_country = data.countryName;
                                  if (data.adminName1) {
                                      modern_country += " > " + data.adminName1;
                                  }
                                  scope.tokenRefs[ii].country = modern_country;

                              }
                              getTokenRef(_results, ii + 1);
                          }
                      });
              };

              function getCountryNoRec(data) {
                  $.ajax("http://api.geonames.org/countrySubdivisionJSON?lat=" +
                      data.reprPoint[1] + "&lng=" + data.reprPoint[0] + "&username=ryanfb",
                      {
                          type: 'GET',
                          dataType: 'json',
                          crossDomain: 'true',
                          error: function (jqXHR, textStatus, errorThrown) {
                              return console.log("AJAX Error: " + textStatus);
                          },
                          success: function (data) {
                              var modern_country;
                              if (data.countryName) {
                                  modern_country = data.countryName;
                                  if (data.adminName1) {
                                      modern_country += " > " + data.adminName1;
                                  }
                                  scope.tokenRefs[0].country = modern_country;

                              }
                          }
                      });
              }

              function splitStr(str){
                  var splitted =str.split(/\...|\ /);
                  var arr=[];
                  for (var i = 0;i < splitted.length; i++) {
                      var s = splitted[i];
                      if(s.length>=3) {
                          arr.push(s);
                      }
                  }
                  return arr;
              }

              function getTokenRef(_results, ii) {
                  //alert("results length: " + _results.length);
                  if(ii ==_results.length) {	
			  scope.tokenRefs2 = scope.tokenRefs
			return;
                  }
                  var res = _results[ii];
                  //alert(JSON.stringify("results 0 : " + res[0],null,4));
                  //alert(JSON.stringify("results 1 : " + res[1],null,4));
                  //alert(JSON.stringify("results 2 : " + res[2],null,4));
                  scope.tokenRefs[ii] = {};
                  scope.tokenRefs[ii].tokenString = res[2];
                  scope.tokenRefs[ii].id = res[1];
                  scope.tokenRefs[ii].name = res[0] + "";
                  scope.tokenRefs[ii].placeLink = "http://pleiades.stoa.org/places/" + res[1];
                  scope.tokenRefs[ii].country = "";
                  var out = {};
                  var dsp = "";
                  $.ajax("/pleiades-geojson/geojson/" + res[1] + ".geojson", {
                      type: 'GET',
                      dataType: 'json',
                      crossDomain: true,
                      error: function (jqXHR, textStatus, errorThrown) {
                          return console.log("AJAX Error: " + textStatus);
                      },
                      success: function (data) {
                          scope.tokenRefs[ii].dsp = data.description;
                          getCountry(_results,data,ii);
                      }
                  });
                  //alert(JSON.stringify("tokenRefs token: " + scope.tokenRefs[0].tokenString,null,4));
                  //alert(JSON.stringify("tokenRefs name: " + scope.tokenRefs[0].name,null,4));
                  //alert(JSON.stringify("tokenRefs id: " + scope.tokenRefs[0].id,null,4));
              }

              scope.$watchCollection('state.clickedTokens', function (newVal, oldVal) {
                  scope.ids = Object.keys(newVal).sort();
                  scope.active = scope.ids.length;
                  scope.currentTokenStrings = currentTokens();
                  scope.splittedTokens = splitStr(scope.currentTokenStrings);

                  if (currentTokens() == "") {
                      return;
                  }

                  scope.refToToken = reference.getRefToToken();
                  var _results = [];
                  //scope.tokenRefs = new Array(scope.splittedTokens.length);
                  //for (var i = 0; i < scope.splittedTokens.length; i++) {
                  //    var sptok = scope.splittedTokens[i];
                  //    if (refToToken[scope.splittedTokens[i]] != null) {
                  //        var res = refToToken[scope.splittedTokens[i]];
                  //        scope.tokenRefs[sptok] = {};
                  //        scope.tokenRefs[sptok].id = refToToken[scope.splittedTokens[i]];
                  //        //scope.tokenRefs[0].name = res[0] + "";
                  //        scope.tokenRefs[sptok].placeLink = "http://pleiades.stoa.org/places/" + res;
                  //        scope.tokenRefs[sptok].country = "";
                  //        //$.ajax("/pleiades-geojson/geojson/" + res
                  //        //    + ".geojson", {
                  //        //    type: 'GET',
                  //        //    dataType: 'json',
                  //        //    crossDomain: true,
                  //        //    error: function (jqXHR, textStatus, errorThrown) {
                  //        //        return console.log("AJAX Error: " + textStatus);
                  //        //    },
                  //        //    success: function(data) {
                  //        //        scope.tokenRefs[0].dsp = data.description;
                  //        //        scope.tokenRefs[0].name = data.names[0];
                  //        //        getCountryNoRec(data);
                  //        //    }
                  //        //});
                  //        return;
                  //    }
                  //
                  //}

                  _results = results();
                  //scope.resultToTokenMap = new Map(_results.length);
                  angular.forEach(scope.splittedTokens, function (spToken) {
                      scope.resultToTokenMap = scope.mapResultsToToken(_results, spToken);
                   //   _results = scope.mapResultsToToken(_results, spToken);
                  });

                  //alert(JSON.stringify("result to token map: " + scope.resultToTokenMap, null, 4));
                  //alert("map length: " + scope.resultToTokenMap.length);
                  //alert(JSON.stringify("_results: " + _results,null,4));
                  scope.tokenRefs = new Array(_results.length);
                  getTokenRef(_results, 0);
              });
          },
              templateUrl: 'templates/arethusa.reference/ref_input_form.html'
          };
      }

]);
