"use strict";

angular.module('arethusa.core').directive('navbarButtons', [
  'translator',
  function(translator) {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, element, attrs) {
        scope.$watch('windowWidth', function(newVal, oldVal) {
          var coll = newVal > 1090 ? '' : '_collapsed';
          scope.bTemplate = 'templates/arethusa.core/navbar_buttons' + coll + '.html';
        });

        scope.translations = {};
        translator('messages', scope.translations, 'messages');
        translator('contactUs', scope.translations, 'contactUs');
        translator('menu', scope.translations, 'menu');
      },
      template: '<ul class="has-form button-group right" ng-include="bTemplate"/>'
    };
  }
]);
