'use strict';



// [1] Register directive and inject dependencie
angular.module('portApp').directive('watchlistPanel', ["$location", "$modal", "watchlistService", "$routeParams", function ($location, $modal, watchlistService, $routeParams) {
    return {
        templateUrl: '/app/views/templates/watchlist-panel.html',
        restrict: 'E',
        scope: {},
        link: function ($scope) {
            
            // [2] Initialize variables
            $scope.newWatchlist = {};

            // the modal
            var addWatchlistModal = $modal({
                scope: $scope,
                template: "/app/views/templates/addlist-modal.html",
                show: false
            });

            $scope.currentWatchlistId = $routeParams.id;

            // [3] Bind model from service to this scope
            $scope.watchlists = watchlistService.getWatchlist();

            // [4] display addWatchlistModal
            $scope.showAddWatchlistModal = function() {
                addWatchlistModal.$promise.then(addWatchlistModal.show);
            };

            // [5] create a new watchlist from fields in the modal
            $scope.createNewWatchList = function() {
                watchlistService.saveNewWatchlist($scope.newWatchlist);
                addWatchlistModal.hide();
                $scope.newWatchlist = {};
            };

            $scope.deleteWatchlist = function(watchlist) {
                watchlistService.removeWatchlist(watchlist);
                $location.path('/');
            };

            $scope.goToWatchlist = function(id) {
                $location.path("watchlist/" + id);
            };
        }
    };
}]);
