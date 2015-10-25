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
                scope.selectedRef = {
                    id: 'none',
                    selector: 'oa:TextQuoteSelector',
                    preNum: 1,
                    sufNum: 1
                };
                scope.allJsonData = reference.getAllData();

                scope.submit = function (thisToken) {
                    var selRef = scope.tokenRefs2[scope.selectedRef.id];
                    //scope.selectedRefMap = reference.mapRefToToken(scope.ref.id, thisToken);
                    reference.createNewRef(selRef.placeLink,
                        scope.selectedRef.selector,
                        thisToken,
                        scope.selectedRef.preNum,
                        scope.selectedRef.sufNum);
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
                    var unique_ids = uniqueIds(name_matches);
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
                    return _results;
                };

                scope.mapResultsToToken = function (_results, token) {
                    for (var i = 0; i < _results.length; i++) {
                        if (begins_with(_results[i][0].toString(), token)) {
                            _results[i][2] = token;
                        }
                    }
                    return _results;
                };

                function getCountry(_results, data, ii, rec) {
                    if (!rec) ii = 0;
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
                                    var res = _results[ii];
                                    scope.tokenRefs[res[1]].country = modern_country;

                                }
                                if (rec) getTokenRef(_results, ii + 1);
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
                    if(ii ==_results.length) {
                        scope.tokenRefs2 = scope.tokenRefs;
                        return;
                    }
                    var res = _results[ii];
                    scope.tokenRefs[res[1]] = {};
                    scope.tokenRefs[res[1]].tokenString = res[2];
                    scope.tokenRefs[res[1]].id = res[1];
                    scope.tokenRefs[res[1]].name = res[0] + "";
                    scope.tokenRefs[res[1]].placeLink = "http://pleiades.stoa.org/places/" + res[1];
                    scope.tokenRefs[res[1]].country = "";
                    $.ajax("/pleiades-geojson/geojson/" + res[1] + ".geojson", {
                        type: 'GET',
                        dataType: 'json',
                        crossDomain: true,
                        error: function (jqXHR, textStatus, errorThrown) {
                            return console.log("AJAX Error: " + textStatus);
                        },
                        success: function (data) {
                            scope.tokenRefs[res[1]].dsp = data.description;
                            var rec = true;
                            getCountry(_results, data, ii, rec);
                        }
                    });
                }

                scope.$watchCollection('state.clickedTokens', function (newVal, oldVal) {
                    scope.ids = Object.keys(newVal).sort();
                    scope.active = scope.ids.length;
                    scope.currentTokenStrings = currentTokens();
                    scope.splittedTokens = splitStr(scope.currentTokenStrings);

                    if (currentTokens() == "")
                        return;

                    var tokenRefMap = reference.getTokenRefMap();
                    var _results = results();
                    angular.forEach(scope.splittedTokens, function (spToken) {
                        scope.resultToTokenMap = scope.mapResultsToToken(_results, spToken);
                    });
                    _results = _results.filter(function(ent) {
                        return !(tokenRefMap[ent[2]]!=null &&
                            tokenRefMap[ent[2]]!=ent[1]);
                    });
                    scope.tokenRefs = new Object();
                    getTokenRef(_results, 0);
                });
            },
            templateUrl: 'templates/arethusa.reference/ref_input_form.html'
        };
    }

]);