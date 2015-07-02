'use strict';

/**
 * @ngdoc service
 * @name portApp.WatchlistService
 * @description
 * # WatchlistService
 * Service in the portApp.
 */
angular.module('portApp').service('watchlistService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var StockModel = {
        save: function () {
            var watchlist = findWatchlistById(this.watchlistId);
            watchlist.recalculate();
            saveModel();
        }
    };

    var WatchlistModel = {
        addStock: function (stock) {
            var existingStock = _.find(this.stocks, function (s) {
                return s.company.symbol === stock.company
            });
            if (existingStock) {
                existingStock.shares += stock.shares;
            } else {
                _.extend(stock, StockModel);
                this.stocks.push(stock);
            }
            this.recalculate();
            saveModel();
        },
        removeStock: function (stock) {
            _.remove(this.stocks, function (s) {
                return s.company.symbol === stock.company.symbol;
            });
            this.recalculate();
            saveModel();
        },
        recalculate: function () {
            var calcs = _.reduce(this.stocks, function (calcs, stock) {
                calcs.shares += stock.shares;
                calcs.marketValue += stock.marketValue;
                calcs.dayChange += stock.dayChange;
                return calcs;
            }, { shares: 0, marketValue: 0, dayChange: 0 });
            this.shares = calcs.shares;
            this.marketValue = calcs.marketValue;
            this.dayChange = calcs.dayChange;
        }
    };

    // [1] helper: load watchlists from local storage
    var loadModel = function() {
        var model = {
            watchlists: JSON.parse(localStorage.getItem('port_watchlists')) ? JSON.parse(localStorage.getItem('port_watchlists')) : [], // localStorage['port.watchlists'] ? JSON.parse(localStorage['port.watchlists']) : [],
            nextWatchlistId: JSON.parse(localStorage.getItem('port_nextWatchlistId')) ? JSON.parse(localStorage.getItem('port_nextWatchlistId')) : [] //localStorage['port.nextWatchlistId'] ? parseInt(localStorage['port.nextWatchlistId']) : 0
            
        };

        _.each(model.watchlists, function(watchlist) {
            _.extend(watchlist, WatchlistModel);

            _.each(watchlist.stocks, function(stock) {
                _.extend(stock, StockModel);
            });
        });

        return model;
    };

    // [2] Helper: Save watchlists to localStorage
    var saveModel = function () {
        //localStorage['port.watchlists'] = JSON.stringify(Model.watchlists);
        localStorage.setItem("port_watchlists", JSON.stringify(Model.watchlists));
        //localStorage['port.nextWatchlistId'] = Model.nextWatchlistId;
        localStorage.setItem("port_nextWatchlistId", Model.nextWatchlistId);
        loadModel();
    };

    // [3] Helper: Use lodash to find a watchlist with given ID
    var findWatchlistById = function (watchlistId) {
        return _.find(Model.watchlists, function (watchlist) {
            return watchlist.id === parseInt(watchlistId);
        });
    };

    // [4] Return all watchlists or find by given ID
    this.getWatchlist = function (watchlistId) {
        if (watchlistId) {
            return findWatchlistById(watchlistId);
        } else {
            return Model.watchlists;
        }
    };

    // [5] Save a new watchlist to watchlists model
    this.saveNewWatchlist = function (watchlist) {
        watchlist.id = Model.nextWatchlistId++;
        watchlist.stocks = [];
        _.extend(watchlist, WatchlistModel);
        Model.watchlists.push(watchlist);
        saveModel();
    };

    // [6] Remove given watchlist from watchlists model
    this.removeWatchlist = function(watchlist) {
        _.remove(Model.watchlists, function(list) {
            return list.id === watchlist.id;
        });
        saveModel();
    };

    // [7] Initialize Model for this singleton service
    var Model = loadModel();

   

});
