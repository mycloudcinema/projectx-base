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

 Convert any selected value into an integer representation
 */
(function (ng) {
	
    "use strict";
	
	ng.module("rc.directives").directive("integer", function() {
		return {
			require: 'ngModel',
			link: function(scope, ele, attr, ctrl){
				ctrl.$parsers.unshift(function(viewValue){
					return parseInt(viewValue, 10);
				});
			}
		};
	});	
	
})(angular);
