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

                scope.submit = function (thisToken) {
                    var selRef = scope.tokenRefs[scope.selectedRef.id];
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

                scope.$watchCollection('state.clickedTokens', function (newVal, oldVal) {
                    scope.ids = Object.keys(newVal).sort();
                    scope.active = scope.ids.length;
                    scope.currentTokenStrings = currentTokens();
                    ref_finder.setCurTokens(currentTokens());
                    scope.splittedTokens = ref_finder.splitStr(scope.currentTokenStrings);
                    if (currentTokens() == "")return;

                    var tokenRefMap = reference.getTokenRefMap();
                    var _results = ref_finder.results();
                    angular.forEach(scope.splittedTokens, function (spToken) {
                        scope.resultToTokenMap = ref_finder.mapResultsToToken(_results, spToken);
                    });
                    _results = _results.filter(function (ent) {
                        return !(tokenRefMap[ent[2]] != null &&
                        tokenRefMap[ent[2]] != ent[1]);
                    });
                    ref_finder.callGetTokenRef(_results, 0);
                    scope.tokenRefs=ref_finder.tokenRefs2;
                });
            },
            templateUrl: 'templates/arethusa.reference/ref_input_form.html'
        };
    }
]);
