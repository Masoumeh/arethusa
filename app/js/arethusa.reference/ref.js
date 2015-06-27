"use strict";

angular.module('arethusa.reference').directive('ref', [
    'reference',
    function(reference) {
        return {
            restrict: 'A',
            scope: {
                ref: '='
            },
            link: function(scope, element, attrs) {
            },
            templateUrl: 'templates/arethusa.reference/ref.html'
        };
    }
]);
