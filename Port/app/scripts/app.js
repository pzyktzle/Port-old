'use strict';

/**
 * @ngdoc overview
 * @name portApp
 * @description
 * # portApp
 *
 * Main module of the application.
 */
angular
  .module('portApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'mgcrea.ngStrap',
    'googlechart'
  ])
  .config(function ($routeProvider) {
      $routeProvider
          .when('/dashboard', {
              templateUrl: '/app/views/dashboard.html',
              controller: 'dashboardCtrl'
          })
          .when('/watchlist/:id', {
              templateUrl: '/app/views/watchlist.html',
              controller: 'watchlistCtrl'
          })
          .otherwise({
            redirectTo: '/dashboard'
          });
  });
