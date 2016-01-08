import angular from 'angular';

angular.module('countries').controller('countriesListCtrl', [
  '$scope', 'geoCountriesList',
  function ($scope, geoCountriesList) {
    geoCountriesList.then((countries) => {
      $scope.countries = countries.geonames;
    });
  }
]);
