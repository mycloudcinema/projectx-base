(function (ng) {

    "use strict";

    ng.module("rc.directives").directive("rcImageSize", [rcImageSize]);

    function rcImageSize() {
        return {
            restrict: "A",
            scope: {
                rcImageSize: "="
            },
            link: function (scope, element, attrs, controller) {
                element[0].onload = function () {
                    scope.rcImageSize = {
                        naturalHeight: element[0].naturalHeight,
                        naturalWidth: element[0].naturalWidth
                    };
                    scope.$apply();
                };
            }
        };
    }

})(angular);
