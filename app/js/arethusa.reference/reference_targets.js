"use strict";

angular.module('arethusa.reference').directive('referenceTargets', [
    'reference',
    'idHandler',
    function(reference, idHandler) {
        return {
            restrict: 'A',
            scope: {
                tokens: "=referenceTargets"
            },
            link: function(scope, element, attrs) {
                function ids() {
                    return arethusaUtil.map(scope.tokens, function(token) {
                        return token.id;
                    }).sort();
                }

                scope.nonSequential = idHandler.nonSequentialIds(ids());
            },
            templateUrl: 'templates/arethusa.reference/reference_targets.html'

        };
    }
]);
