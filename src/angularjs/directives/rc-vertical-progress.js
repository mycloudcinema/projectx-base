(function (ng) {
	"use strict";
	ng.module("rc.directives").directive("rcVerticalProgress", [directive]);
	function directive() {
		return {
			restrict: "A",
			scope: false,
			replace: true,
			template: `
				<div class="rc-vertical">
					<div class="rc-vertical-inner ten"></div>
					<div class="rc-vertical-inner nine"></div>
					<div class="rc-vertical-inner eight"></div>
					<div class="rc-vertical-inner seven"></div>
					<div class="rc-vertical-inner six"></div>
					<div class="rc-vertical-inner five"></div>
					<div class="rc-vertical-inner four"></div>
					<div class="rc-vertical-inner three"></div>
					<div class="rc-vertical-inner two"></div>
					<div class="rc-vertical-inner one"></div>
				</div>`,
			link: function (scope, element, attrs, ctrl) {
				var level = Math.ceil(parseFloat(attrs.rcVerticalProgress) / 10);
				element.addClass('rc-vertical-' + (isNaN(level) ? '0' : level));
			}
		};
	}
})(angular);
