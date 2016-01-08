import angular from 'angular';

angular.module('countries').controller('countryCtrl', [
  '$scope', '$routeParams', 'geoCountryData',
  function ($scope, $routeParams, geoCountryData) {

    $scope.loading = true;

    $scope.countryCode = $routeParams.countryCode;
    $scope.mapUrl
      = `http://www.geonames.org/img/country/250/`
      + `${$scope.countryCode.toUpperCase()}.png`;
    $scope.flagUrl
      = `http://www.geonames.org/flags/x/`
      + `${$scope.countryCode.toLowerCase()}.gif`;

    // get the rest of the data from the server
    geoCountryData($scope.countryCode)
      .then((data) => {
        $scope.countryName = data.countryName;
        $scope.popCountry = data.popCountry;
        $scope.areaKm2 = data.areaKm2;
        $scope.capitalName = data.capitalName;
        $scope.popCapital = data.popCapital;
        $scope.neighbors = data.neighbors;
        $scope.loading = false;
      });
  }
]);
