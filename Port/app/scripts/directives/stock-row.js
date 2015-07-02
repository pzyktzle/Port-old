'use strict';



// [1] Register directive and inject dependencie
angular.module('portApp').directive("stockRow", function ($timeout, quoteService) {

    return {

        restrict: "A",
        require: "^stockTable",
        scope: {
            stock: "=",
            isLast: "="
        },

        link: function($scope, $element, $attrs, stockTableCtrl) {
            
            $element.tooltip({
                placement: 'left',
                title: $scope.stock.company.name
            });

            // [4] Add this row to the TableCtrl
            stockTableCtrl.addRow($scope);

            // [5] Register this stock with the QuoteService
            quoteService.register($scope.stock);

            // [6] Deregister company with the QuoteService on $destroy
            $scope.$on('$destroy', function () {
                stockTableCtrl.removeRow($scope);
                quoteService.deregister($scope.stock);
            });

            // [7] If this is the last 'stock-row', fetch quotes immediately
            if ($scope.isLast) {
                $timeout(quoteService.fetch);
            }

            // [8] Watch for changes in shares and recalculate fields
            $scope.$watch('stock.shares', function () {
                $scope.stock.marketValue = $scope.stock.shares * $scope.stock.lastPrice;
                $scope.stock.dayChange = $scope.stock.shares * parseFloat($scope.stock.change);
                $scope.stock.save();
            });

        }

    };

});
