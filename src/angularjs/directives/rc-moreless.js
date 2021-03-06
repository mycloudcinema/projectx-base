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

Display text with a More/Less toggle.
*/
(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcMoreLess", rcMoreLess);

	function rcMoreLess() {

		return {

			restrict:		"E",
			template:		'<div><p ng-if="expanded">{{full_text}} <span ng-click="collapse()" class="{{lessClass}}">{{lessText}}</span></p><p ng-if="!expanded">{{condensed_text}} <span ng-click="expand()" class="{{moreClass}}">{{moreText}}</span></p></div>',
			replace:		true,
			scope: {
				options:	"=",
				text:		"="
			},

			link: function (scope, element, attrs, ctrl) {

				scope.collapse = function() {
					scope.expanded = false;
				};
				scope.expand = function() {
					scope.expanded = true;
				};
				scope.init = function() {

					if (!scope.options) {
						console.warn('rcMoreLess should not be used without options');
					} else {
						scope.moreClass = scope.options.moreClass || 'moreClass';
						scope.lessClass = scope.options.lessClass || 'lessClass';
						scope.moreText = scope.options.moreText || '… more';
						scope.lessText = scope.options.lessText || '« less';
						scope.expanded = false;
					}
				};
				scope.$watch("text", function(text) {
					if (scope.text) {
						scope.full_text = scope.text;
						scope.condensed_text = scope.text.trunc(scope.options.limit, true, scope.moreText);
					}
				});
				scope.init();
			}
		};
	}

	String.prototype.trunc = function(n, useWordBoundary) {
		var isTooLong = this.length > n,
		s_ = isTooLong ? this.substr(0,n-1) : this;
		s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
		return  isTooLong ? s_ : s_;
	};

})(angular);
