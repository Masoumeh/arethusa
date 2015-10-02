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
              scope.state = state;
              scope.ref = {
                  id: 'none',
                  selector: 'oa:TextQuoteSelector'
              };

              scope.submit = function () {
                  scope.selectedRefMap = reference.mapRefToToken(scope.ref.id, scope.currentTokenStrings);
                  reference.createNewRef(scope.ref.id);
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

              function nameMatches() {
                  return reference.getAllData().filter(function (entry) {
                      return begins_with(entry[0], currentTokens());
                  });
              };

              function uniqueIds() {
                  var name_matches = nameMatches();
                  var unique_ids = _.uniq(name_matches.map(function (match) {
                      return match[1];
                  }));
                  return unique_ids;
              };

              function results() {
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
                  return _results;
              };


              function getCountry(_results,data,ii) {
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
                              getTokenRef(_results, ii+1);
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

              function getTokenRef(_results, ii) {
                  if(ii ==_results.length) return;
                  var res = _results[ii];
                  scope.tokenRefs[ii] = {};
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
              }

              scope.$watchCollection('state.clickedTokens', function (newVal, oldVal) {
                  scope.ids = Object.keys(newVal).sort();
                  scope.active = scope.ids.length;
                  scope.currentTokenStrings = currentTokens();
                  if (currentTokens() == "") {
                      return;
                  }

                  var refToToken = reference.getRefToToken();
                  var _results = [];
                  if (refToToken[currentTokens()] != null) {
                      scope.tokenRefs = new Array(1);
                      var res = refToToken[currentTokens()];
                      scope.tokenRefs[0] = {};
                      scope.tokenRefs[0].id = refToToken[currentTokens()];
                      //scope.tokenRefs[0].name = res[0] + "";
                      scope.tokenRefs[0].placeLink = "http://pleiades.stoa.org/places/" + res;
                      scope.tokenRefs[0].country = "";
                      $.ajax("/pleiades-geojson/geojson/" + res
                          + ".geojson", {
                          type: 'GET',
                          dataType: 'json',
                          crossDomain: true,
                          error: function (jqXHR, textStatus, errorThrown) {
                              return console.log("AJAX Error: " + textStatus);
                          },
                          success: function(data) {
                              scope.tokenRefs[0].dsp = data.description;
                              scope.tokenRefs[0].name = data.names[0];
                              getCountryNoRec(data);
                          }
                      });
                      return;
                  }

                  _results=results();
                  scope.tokenRefs = new Array(_results.length);
                  getTokenRef(_results, 0);
                  ;
              });
          },
              templateUrl: 'templates/arethusa.reference/ref_input_form.html'
          };
      }

]);