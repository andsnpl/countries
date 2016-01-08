import angular from 'angular';

angular.module('countries').config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/countries/:countryCode/capital', {
        templateUrl: 'templates/country.view.html',
        controller: 'countryCtrl as ctrl'
      })
      .otherwise('/');
  }
]);
