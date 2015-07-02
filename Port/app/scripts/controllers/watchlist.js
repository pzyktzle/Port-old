'use strict';


angular.module('portApp').controller('watchlistCtrl', function ($scope, $routeParams, $modal, $location, watchlistService, companyService) {

    // get companies
    $scope.companies = companyService.query();


    $scope.watchlist = watchlistService.getWatchlist($routeParams.id);
    $scope.stocks = $scope.watchlist.stocks;
    $scope.newStock = {};

    var addNewStockModal = $modal({
        scope: $scope,
        template: "/app/views/templates/addstock-modal.html",
        show: false
    });

    $scope.showNewStockModal = function() {
        addNewStockModal.$promise.then(addNewStockModal.show);
    };

    $scope.addStock = function() {
        $scope.watchlist.addStock({
            watchlistId: $routeParams.id,
            company: $scope.newStock.company,
            shares: $scope.newStock.shares
        });
        addNewStockModal.hide();
        $scope.newStock = {};
    };

});