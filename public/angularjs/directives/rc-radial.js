
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
 */

 (function(ng){
	 "use strict";
	 ng.module("rc.directives").directive("rcRadial", [rcradial]);
	 function rcradial(){
		 return {
			 restrict:"E",
			 template:'<div class="radial-progress" title="{{title}}"><div class="circle"><div class="mask full"><div class="fill"></div></div><div class="mask half"><div class="fill"></div><div class="fill fix"></div></div><div class="shadow"></div></div><div class="inset"><div class="percentage"><div class="numbers"></div></div></div></div>',
			 replace:true,
			 scope: {
				 title:		'@'
			 },
			 link: function (scope, element, attrs, ctrl) {
			 }
		 };
	 }
 })(angular);
