import angular from 'angular';

angular.module('countries')
  .controller('countryCtrl', [
    '$scope', '$rootScope', '$timeout', '$routeParams', 'geoCountryData',
    function ($scope, $rootScope, $timeout, $routeParams, geoCountryData) {

      $rootScope.loading = true;

      $scope.countryCode = $routeParams.countryCode;
      $scope.mapUrl
        = `http://www.geonames.org/img/country/250/`
        + `${$scope.countryCode.toUpperCase()}.png`;
      $scope.flagUrl
        = `http://www.geonames.org/flags/x/`
        + `${$scope.countryCode.toLowerCase()}.gif`;

      // get the rest of the data from the server
      geoCountryData($scope.countryCode)
        .then((results) => {
          $scope.countryName = results.countryName;
          $scope.popCountry = results.popCountry;
          $scope.areaKm2 = results.areaKm2;
          $scope.capitalName = results.capitalName;
          $scope.popCapital = results.popCapital;
          $scope.neighbors = results.neighbors;
          $rootScope.loading = false;
          // load event to be fired after the results are rendered.
          $timeout(() => { $scope.$broadcast('load'); }, 0);
        });

    }
  ])

  // Could be extracted to its own file, but it makes the most sense if we can
  // see the context, the controller firing the 'load' event.
  .directive('scrollPositionReporter', [
    function () {
      return {
        restrict: 'A',
        template: `
          <div class="scrollpositionreporter"
               ng-class="{
                 'is-scrolled-top': scrolledTop,
                 'is-scrolled-bottom': scrolledBottom
               }">
            <div class="arrow uparrow" ng-click="scrollUp()">^</div>
            <div class="transcluded-content" ng-transclude></div>
            <div class="arrow downarrow" ng-click="scrollDown()">v</div>
          </div>`,
        transclude: true,
        scope: true,
        link: function (scope, element) {
          // The transcluded content is what is meant to be scrollable.
          element = angular.element(
            element[0].getElementsByClassName('transcluded-content'))
            .children();

          // With no content loaded in the element, it is guaranteed to be
          // scrolled to both top and bottom, because they are the same.
          scope.scrolledTop = true;
          scope.scrolledBottom = true;

          // ngClick handlers

          scope.scrollUp = function () {
            element[0].scrollTop -= element[0].offsetHeight;
          };

          scope.scrollDown = function () {
            element[0].scrollTop += element[0].offsetHeight;
          };

          // handler for any change to scroll position.
          let reportPosition = function (elt, scope) {
            let scrolled
              = elt.scrollTop / (elt.scrollHeight - elt.offsetHeight);

            if (isNaN(scrolled)) {
              scope.$applyAsync(`
                scrolledTop = true;
                scrolledBottom = true;
                scrolledPercent = null`);
              return;
            }

            scope.$applyAsync(`scrolledPercent = ${scrolled * 100}`);

            if (scrolled === 0) {
              scope.$applyAsync('scrolledTop = true');
            } else {
              scope.$applyAsync('scrolledTop = false');
            }

            if (scrolled === 1) {
              scope.$applyAsync('scrolledBottom = true');
            } else {
              scope.$applyAsync('scrolledBottom = false');
            }
          };

          scope.$on('load', () => { reportPosition(element[0], scope); });
          element.on('scroll', (evt) => { reportPosition(evt.target, scope); });
        }
      };
    }]);
