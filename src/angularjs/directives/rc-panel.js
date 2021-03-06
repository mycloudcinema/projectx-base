/*
  ____                     _
 |  _ \ ___ _ __ ___   ___| | __
 | |_) / _ \ '_ ` _ \ / _ \ |/ /
 |  _ <  __/ | | | | |  __/   <
 |_| \_\___|_| |_| |_|\___|_|\_\

   ____                      _ _   _
  / ___|___  _ __  ___ _   _| | |_(_)_ __   __ _
 | |   / _ \| '_ \/ __| | | | | __| | '_ \ / _` |
 | |__| (_) | | | \__ \ |_| | | |_| | | | | (_| |
  \____\___/|_| |_|___/\__,_|_|\__|_|_| |_|\__, |
                                            |___/

 Directive for slide-in/out panels.
 */

(function (ng) {

	'use strict';

	ng.module("rc.directives")
		.directive("rcPanel", [rcPanel])
		.directive("rcSlideIn", ["$compile", rcSlideIn])
		.directive("rcSlideInMenu", [rcSlideInMenu])
		.directive("rcSlideInContent", [rcSlideInContent]);

	function rcPanel() {

		function link(scope, element, attrs, ctrl) {

			if ('autoHide' in attrs) {
				angular.element(document).on('mousedown', function (event) {
					//console.log("rcPanel: document#onmousedown Event", event);
					scope.show = false;
					setTimeout(function () {
						scope.show = false;
						scope.onPanelHide();
						scope.$apply();
					}, 200);
				})
			}
			element.on('mousedown', function (event) {
				event.stopPropagation();
			});

			scope.hidePanel = function() {
				//console.log('Hiding the panel');
				scope.show = false;
				if (typeof scope.onPanelHide === 'function') {
					scope.onPanelHide();
				// } else {
					//console.log(typeof scope.onPanelHide);
				}
			}
		}

		return {
			restrict:			"E",
			replace:			true,
			transclude:			true,
			template:			'<div class="rc-panel" ng-attr-asd="{{show}}" ng-class="{\'show\':show, \'top\':panelPosition === \'top\', \'bottom\':panelPosition === \'bottom\', \'left\':panelPosition === \'left\', \'right\':panelPosition === \'right\'}"><div class="rc-panel-heading"><h4>{{heading}} <i ng-click="hidePanel()" class="pull-right fa fa-times-circle-o pointer"></i></h4></div><div class="rc-panel-body"><ng-transclude></div></div>',
			scope: {
				panelPosition:	"@",
				heading:		"@",
				show:			"=",
				onPanelHide:	"&"
			},
			link: 				link
		}
	}

	function rcSlideIn($compile) {
		return {
			restrict: 'A',
			link: function (scope, element) {
				element.append(element.children());
				$compile(element.contents())(scope);
			}
		};
	}

	function rcSlideInMenu() {
		return {
			restrict: 'A',
			scope: true,
			transclude: true,
			compile: function (tElement, attrs, transclude) {
				return function ($scope) {
					transclude($scope, function (clone) {
						// console.info("SlideInMenu", tElement, clone);
						tElement.append(clone);
					});
				};
			}
		};
	}

	function rcSlideInContent() {
		return {
			restrict: 'A',
			scope: true,
			transclude: true,
			compile: function (tElement, attrs, transclude) {
				return function ($scope) {
					transclude($scope, function (clone) {
						// console.info("Content", clone);
						tElement.append(clone);
					});
				};
			}
		};
	}

} (angular));
