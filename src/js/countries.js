import angular from 'angular';
import 'angular-route';

angular.module('countries', ['ngRoute'])
  .constant('USERNAME', 'bpaulanderson')
  .constant('PROXY', '//localhost:1337'); // proxies my requests to allow CORS
