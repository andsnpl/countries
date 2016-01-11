import angular from 'angular';

angular.module('countries').controller('countryCtrl', [
  '$scope', '$rootScope', '$routeParams', 'geoCountryData',
  function ($scope, $rootScope, $routeParams, geoCountryData) {

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
      });
  }
]);
