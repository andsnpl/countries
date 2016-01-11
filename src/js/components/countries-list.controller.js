import angular from 'angular';

angular.module('countries').controller('countriesListCtrl', [
  '$scope', '$rootScope', 'geoCountriesList',
  function ($scope, $rootScope, geoCountriesList) {
    $rootScope.loading = true;

    geoCountriesList.then((countries) => {
      $scope.countries = countries.geonames;
      $rootScope.loading = false;
    });
  }
]);
