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

 Directive for handling state for applications that require the ability to undo
 user actions.
 */

 (function(ng) {

 	'use strict';

 	ng.module("rc.services")
		.factory("rcState", [factory])

 	function factory($) {

 		function rcState(stack_size, scope, model){

 			var self = this;
 			self._skip_watch = true;
 			self.stack_size = stack_size || 10;
 			self.stack = [];
 			self.index = -1;

 			if (scope && model) {
 				scope.$watch(model, function(newValue, oldValue){
 					if (newValue && !self.skip_watch) {
 						self.update(newValue);
 					}
 					self.skip_watch = false;
 				}, true);
 			}
 		};

 		rcState.prototype.undo = function () {
 			// debug.log("UNDO");
 			if (this.index > 0) {
 				// debug.log("UNDO return", this.index - 1, this.stack);
 				this._skip_watch = true;
 				return ng.copy(this.stack[--this.index]);
 			}
 		};

 		rcState.prototype.redo = function () {
 			if (this.index < this.stack_size - 1) {
 				this._skip_watch = true;
 				return this.stack[++this.index];
 			}
 			return {};
 		};

 		rcState.prototype.update = function (model) {
 			if (this.index < this.stack_size - 1) {
 				++this.index;
 				this.stack.push(ng.copy(model));
 			} else {
 				this.stack.shift();
 				this.stack.push(ng.copy(model));
 			}
 			this.stack.splice(this.index+1, this.stack.length - this.index + 1);
 		};
 		return rcState;
 	}
 }(angular));
