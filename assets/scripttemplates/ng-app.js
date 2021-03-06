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

Base Angular declaration that includes all the required modules into the rc
module, making them available to all angular applications.
*/
(function(ng){

	ng.module("rc", ["rc.controllers", "rc.services", "rc.entities", "rc.directives", "rc.factories", "rc.modules", "rc.filters", "rc.external"]);

	ng.element(document).ready(function(){
		ng.bootstrap(document, ["rc"], {
			// strictDi: true
		});
	});

})(angular);
