'use strict';



// [1] Register directive and inject dependencie
angular.module('portApp').directive("signColour", function () {

    return {

        restrict: "A",
        link: function ($scope, $element, $attrs) {

            $attrs.$observe("signColour", function (newVal) {
                var newSign = parseFloat(newVal);
                if (newSign > 0) {
                    $element[0].style.color = "#00bc8c";
                } else {
                    $element[0].style.color = "#e74c3c";
                }
            });
        }

    };

});
