
'use strict';


angular.module('portApp').service('quoteService', function ($http, $interval) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var stocks = [];
    var base = "http://query.yahooapis.com/v1/public/yql?q=";
    var end = "&format=json&diagnostics=true&env=http://datatables.org/alltables.env";
    var quoteTable = "yahoo.finance.quotes";

    // [1]
    var update = function(quotes) {
        console.log(quotes);
        if (quotes.length === stocks.length) {
            _.each(quotes, function(quote, index) {
                var stock = stocks[index];
                stock.lastPrice = parseFloat(quote.LastTradePriceOnly);
                stock.change = parseFloat(quote.Change);
                stock.percentChange = quote.ChangeinPercent;
                stock.marketValue = stock.shares * stock.lastPrice;
                stock.dayChange = stock.shares * stock.change;
                stock.save();
            });
        }
    };

    this.register = function(stock) {
        stocks.push(stock);
    };

    this.deregister = function(stock) {
        _.remove(stocks, stock);
    };

    this.clear = function() {
        stocks = [];
    };

    this.fetch = function() {

        var symbols = _.reduce(stocks, function(symbols, stock) {
            symbols.push(stock.company.symbol);
            return symbols;
        }, []);

        var query = encodeURIComponent("select * from " + quoteTable + " where symbol in ('" + symbols.join(',') + "')");
        var url = base + query + end;

        $http.jsonp(url + "&callback=JSON_CALLBACK").success(function(data) {
            if (data.query.count) {
                var quotes = data.query.count > 1 ? data.query.results.quote : [data.query.results.quote];
                update(quotes);
            }
        }).error(function(data) {
            console.log(data);
        });
    };

    // invoke fetch function every 5 seconds
    $interval(this.fetch, 5000);

});
