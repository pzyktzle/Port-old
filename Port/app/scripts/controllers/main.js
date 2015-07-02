'use strict';

/**
 * @ngdoc function
 * @name portApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the portApp
 */
angular.module('portApp').controller('mainCtrl', function($scope, $location, watchlistService) {
    // [1] populate watchlists
    $scope.watchlists = watchlistService.getWatchlist();

    // [2] use $watch to watch the state of $location.path and if it changes then set the activeView
    $scope.$watch(function() {
        return $location.path();
    }, function(path) {
        if (_.contains(path, "watchlist")) {
            $scope.activeView = "watchlist";
        } else {
            $scope.activeView = "dashboard";
        };
    });
});
