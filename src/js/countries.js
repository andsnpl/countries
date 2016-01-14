import angular from 'angular';
import 'angular-route';

angular.module('countries', ['ngRoute'])
  .constant('USERNAME', 'bpaulanderson')
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);
