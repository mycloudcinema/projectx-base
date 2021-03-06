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

Collaborative directive to indicate which users are online at the current time
and to notify of arriving and leaving users.
*/

(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcCollaborate", ["rcGuid", "FayeChannel", "$interval", rcCollaborateDirective])

	function rcCollaborateDirective(rcGuid, FayeChannel, $interval) {

		var myCollaboration;
		var fayeComm;

		return {

			restrict:		"E",
			templateUrl:	"/_templates/base/rc-collaborate",
			replace:		true,
			scope: {
				options:	"=",
				message:	"=",
				onMessage:	"="
			},

			link: function (scope, element, attrs, ctrl) {

				scope.collaborators = [];

				function cycleCollaborators(fayeMessage) {

					var addCollaborator = (fayeMessage);

					// Check to see if this user is already in the channel and
					// if not then we add them. We also check to see which users
					// have expired and remove them from the list.
					for (var collaboratorId = 0; collaboratorId < scope.collaborators.length; collaboratorId++) {

						var collaborator = scope.collaborators[collaboratorId];

						if (fayeMessage && collaborator.id === fayeMessage.id) {
							if (fayeMessage.left) {
								scope.collaborators.splice(collaboratorId, 1);
							} else {
								collaborator.last_seen = moment();
								collaborator.inactive = false;
								addCollaborator = false;
							}
						} else {
							// Remove anyone who has been active for the length of the timeout
							// or one minute if no timeout supplied.
							if (collaborator.last_seen) {
								var inactivityTime = moment.duration(moment().diff(moment(collaborator.last_seen))).asMinutes();
								if (inactivityTime >= (scope.options.timeout || 1)) {
									scope.collaborators.splice(collaboratorId, 1);
								} else if (inactivityTime >= .5) {
									collaborator.inactive = true;
								}
							}
						}
					}

					// New collaborator arrived so we add them to the list.
					if (addCollaborator) {
						fayeMessage.myself = false;
						fayeMessage.inactive = false;
						fayeMessage.last_seen = new moment();
						scope.collaborators.push(fayeMessage)
					}
				}
				scope.init = function() {

					if (!scope.options) {
						console.warn('rcCollaborate cannot be used without options');
					} else if (!scope.options.fayeServer) {
						console.warn('rcCollaborate cannot be used without a Faye Server');
					} else if (!scope.options.fayeChannel) {
						console.warn('rcCollaborate cannot be used without a Faye Channel');
					} else {

						fayeComm = new FayeChannel(scope.options.fayeServer, "/collaborate/" + scope.options.fayeChannel, function(fayeMessage) {

							if (fayeMessage.type === 'user') {
								cycleCollaborators(fayeMessage);
								scope.$apply();
							} else if (typeof scope.onMessage === 'function') {
								scope.onMessage(fayeMessage);
							} else {
								debug.log('Nowhere for this message to go', fayeMessage);
							}

						});

						myCollaboration = {
							type:			'user',
							id:				"$user{user_id}",
							initials:		scope.options.collaborator.initials,
							name:			scope.options.collaborator.name,
							active:			true
						}

						// Broadcasting that we have arrived.
						fayeComm.publish(myCollaboration);
						myCollaboration.myself = true;
						scope.collaborators.push(myCollaboration);

						// Setup a broadcast timer that will notify the other collaborators
						// that we are still online.
						$interval(function() {
							fayeComm.publish(myCollaboration);
							cycleCollaborators();
						}, 5000);

						// When we leave this page we'll let everyone know that we have gone
						window.onbeforeunload = function (e) {
							myCollaboration.left = true;
							fayeComm.publish(myCollaboration);
						}

						scope.message = function(fayeMessage){
							if (fayeMessage) {
								fayeComm.publish(fayeMessage);
							}
						};
					}
				};
				scope.init();
			}
		};
	}
})(angular);
