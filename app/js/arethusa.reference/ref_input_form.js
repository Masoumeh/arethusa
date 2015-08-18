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
        scope.state = state;
        scope.submit = function() {
           scope.refArr = reference.createNewRef(scope.ids,scope.currentTokenStrings,scope.ref)[0];
          scope.tokenMapRef = reference.createNewRef(scope.ids,scope.currentTokenStrings,scope.ref)[1];
        };
        scope.splitRefs = function(token) {
          return reference.splitRefs(scope.tokenMapRef, token);
        };

        function currentTokens() {
             return scope.active ? state.toTokenStrings(scope.ids) : '';
        }

        scope.$watchCollection('state.clickedTokens', function(newVal, oldVal) {
          scope.ids = Object.keys(newVal).sort();
          scope.active = scope.ids.length;
          scope.currentTokenStrings = currentTokens();
        });

      },
      templateUrl: 'templates/arethusa.reference/ref_input_form.html'
    };
  }
]);
