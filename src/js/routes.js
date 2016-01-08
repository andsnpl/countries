import angular from 'angular';

angular.module('countries').config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/index.view.html'
      })
      .when('/countries/', {
        templateUrl: 'templates/countries-list.view.html',
        controller: 'countriesListCtrl as ctrl'
      })
      .when('/countries/:countryCode/capital', {
        templateUrl: 'templates/country.view.html',
        controller: 'countryCtrl as ctrl'
      })
      .otherwise('/');
  }
]);
