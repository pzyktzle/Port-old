'use strict';


angular.module('portApp').controller('dashboardCtrl', function ($scope, quoteService, watchlistService) {
    
    // initialize
    var unregisterHandlers = [];
    $scope.watchlists = watchlistService.getWatchlist();
    $scope.CssStyle = "height: 300px;";
    var formatters = {
        number: [
            {
                columnNum: 1,
                prefix: '$'
            }
        ]
    };

    var updateCharts = function() {

        // donut chart
        var donutChart = {
            type: 'PieChart',
            displayed: true,
            data: [['Watchlist', 'Market Value']],
            options: {
                legend: 'none',
                pieHole: 0.4,
                backgroundColor: '#303030'
            },
            formatters: formatters
        };
        
        // Column chart
        var columnChart = {
            type: 'ColumnChart',
            displayed: true,
            data: [['Watchlist', 'Change', { role: 'style' }]],
            options: {
                legend: 'none',
                animation: {
                    duration: 1500,
                    easing: 'linear'
                },
                backgroundColor: '#303030'
            },
            formatters: formatters
        };

        //  Push data onto both chart objects
        _.each($scope.watchlists, function (watchlist) {
            donutChart.data.push([watchlist.name, watchlist.marketValue]);
            columnChart.data.push([watchlist.name, watchlist.dayChange, watchlist.dayChange < 0 ? 'Red' : 'Green']);
        });

        $scope.donutChart = donutChart;
        $scope.columnChart = columnChart;

    };

    var reset = function() {
        quoteService.clear();

        _.each($scope.watchlists, function (watchlist) {
            _.each(watchlist.stocks, function (stock) {
                quoteService.register(stock);
            });
        });

        _.each(unregisterHandlers, function(unregister) {
            unregister();
        });

        // add a $watch listener that invokes recalculate() every time a watchlists market value changes
        _.each($scope.watchlists, function (watchlist) {
            var unregister = $scope.$watch(function () {
                return watchlist.marketValue;
            }, function () {
                recalculate();
            });
            unregisterHandlers.push(unregister);
        });
    };

    var recalculate = function() {
        $scope.marketValue = 0;
        $scope.dayChange = 0;
        _.each($scope.watchlists, function (watchlist) {
            $scope.marketValue += watchlist.marketValue ? watchlist.marketValue : 0;
            $scope.dayChange += watchlist.dayChange ? watchlist.dayChange : 0;
        });
        updateCharts();
    };

    $scope.$watch("watchlists.length", function() {
        reset();
    });

});