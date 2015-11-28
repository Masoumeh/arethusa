"use strict";

angular.module('arethusa.reference').directive('refInputForm', [
    'reference',
    'state',
     'ref_finder',
    function(reference,state,ref_finder) {
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

	        scope.mapResultsToToken = function (_results, token) {
                    for (var i = 0; i < _results.length; i++) {
                        if (begins_with(_results[i][0].toString(), token)) {
                            _results[i][2] = token;
                        }
                    }
                    return _results;
                };

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

                this.currentTokens = function() {
                    return scope.active ? state.toTokenStrings(scope.ids) : '';
                }

                scope.$watchCollection('state.clickedTokens', function (newVal, oldVal) {
                    scope.ids = Object.keys(newVal).sort();
                    scope.active = scope.ids.length;
                    scope.currentTokenStrings = currentTokens();
                    scope.splittedTokens = ref_finder.splitStr(scope.currentTokenStrings);

                    if (currentTokens() == "")
                        return;

                    var tokenRefMap = reference.getTokenRefMap();
                    var _results = ref_finder.results();
                    angular.forEach(scope.splittedTokens, function (spToken) {
                        scope.resultToTokenMap = scope.mapResultsToToken(_results, spToken);
                    });
                    _results = _results.filter(function(ent) {
                        return !(tokenRefMap[ent[2]]!=null &&
                            tokenRefMap[ent[2]]!=ent[1]);
                    });
                    scope.tokenRefs = new Object();
		    ref_finder.curToks=this.currentTokens();
                    ref_finder.getTokenRef(_results, 0);
                });
            },
            templateUrl: 'templates/arethusa.reference/ref_input_form.html'
        };
    }

]);
