'use strict';


angular.module('portApp').service('companyService', function companyService($resource) {
      // AngularJS will instantiate a singleton by calling "new" on this function
    return $resource("/app/data/tickers.json");

});
