"use strict";

angular.module('arethusa.reference').directive('referenceHistory', [
    'reference',
    'state',
    function(reference, state) {
        return {
            restrict: 'A',
            scope: {
                reference: "=referenceHistory"
            },
            compile: function(tElement, tAttrs, transclude) {
                return {
                    pre: function(scope, iElement, iAttrs) {
                        // Need to define the token in a pre-compile function,
                        // otherwise the directive in the template cannot render!
                        scope.tokens = arethusaUtil.map(scope.reference.ids, function(id) {
                            return state.getToken(id);
                        });
                    },
                    post: function(scope, iElement, iAttrs) {
                        scope.select = function() {
                            state.multiSelect(scope.reference.ids);
                        };
                    }
                };
            },
            templateUrl: 'templates/arethusa.reference/reference_history.html'
        };
    }
]);
