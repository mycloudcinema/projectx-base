(function () {
	angular.module('timer', []).directive('countdown', [
		'$interval',
		function ($interval) {
			return {
				restrict: 'A',
				scope: {date: '@'},
				link: function (scope, element) {
					var diff = moment.duration(moment(scope.date).diff(moment()));
					element.text(Math.ceil(diff.asMinutes()));
					$interval(function () {
						diff = moment.duration(moment(scope.date).diff(moment()));
						return element.text(Math.ceil(diff.asMinutes()));
					}, 10000);
				}
			};
		}
	]);
}.call(this));