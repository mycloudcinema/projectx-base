(function (ng) {
	"use strict";
	ng.module("rc.directives").directive("rcEvent", ["$parse", directive]);
	function directive($parse) {
		return {
			restrict: "A",
			scope: false,
			link: function (scope, element, attrs, ctrl) {
				element.bind(attrs.rcEvent, function (event) {
					scope.$apply(function () {
						scope.$eval(attrs.rcEventListener, {$event: event});
					});
					event.preventDefault();
				});

			}
		};
	}
})(angular);