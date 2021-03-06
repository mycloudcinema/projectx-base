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

 Angular implementation of Drag and Drop.
 */

(function (ng) {
	
    "use strict";
	
    ng.module("rc.directives").directive("rcDraggable", function() {
		
		return function(scope, element) {

			// this gives us the native JS object
			var el = element[0];

			el.draggable = true;

			el.addEventListener('dragstart', function(e) {
				e.dataTransfer.effectAllowed = 'move';
				e.dataTransfer.setData('srcId', this.id);
				e.dataTransfer.setData('offsetX', e.offsetX);
				e.dataTransfer.setData('offsetY', e.offsetY);
				this.classList.add('drag');
				return false;
			},
				false
			);

			el.addEventListener('dragend', function(e) {
				this.classList.remove('drag');
				return false;
			},
				false
			);
		};
	});
})(angular);
