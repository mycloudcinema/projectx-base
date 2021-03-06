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

Directive to handle the delivery of growl messages to the user and storage of any
unread messages.
*/

(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcGrowl", ["FayeChannel", "rcDateHandler", "rcGuid", "rcWebservice", rcGrowlDirective])

	function rcGrowlDirective(FayeChannel, rcDateHandler, rcGuid, rcWebservice) {

		var fayeCommPublic;
		var fayeCommPersonal;
		var fayeCommAuthorisation;

		return {

			restrict:		"E",
			templateUrl:	"/_templates/base/rc-growl",
			replace:		true,
			scope: {
				options:	"=",
				message:	"="
			},

			link: function (scope, element, attrs, ctrl) {

				scope.messages = [
				];

				function isValidMessage(fayeMessage) {
					if (!fayeMessage.expires) {
						return true;
					} else {
						var messageExpiry = rcDateHandler.diffMins(rcDateHandler.getUIDate(fayeMessage.expires));
						if (messageExpiry >= 0) {
							return false;
						} else {
							return true;
						}
					}
				}

				scope.messageAge = function(messageDate) {
					var minutesAgo = rcDateHandler.diffMins(rcDateHandler.getUIDate(messageDate));
					if (minutesAgo < 1) {
						return '$dict{just_now}';
					} else if (minutesAgo === 1) {
						return '$dict{one_minute_ago}';
					} else {
						return minutesAgo + ' $dict{mins_ago}';
					}
				};

				scope.init = function() {

					if (!scope.options) {
						console.warn('rcGrowl cannot be used without options');
					} else if (!scope.options.fayeServer) {
						console.warn('rcGrowl cannot be used without a Faye Server');
					} else {

						// Subscription to the public growl message channel
						fayeCommPublic = new FayeChannel(scope.options.fayeServer, "/growl", function(fayeMessage) {

							if (fayeMessage && fayeMessage.type == 'broadcast') {

								if (fayeMessage && isValidMessage(fayeMessage)) {
									var growlMessage = {
										id:				new rcGuid().newGuid(),
										visible:		true,
										broadcast:		true,
										message_from:	fayeMessage.message_from,
										message_date:	rcDateHandler.getUIDate(),
										message_text:	fayeMessage.message_text,
									}
									scope.messages.push(growlMessage);
									scope.saveMessages();
									scope.$apply();
								}

							} else {
								debug.log('Nowhere for this message to go', fayeMessage);
							}
						});

						// Subscription to the personal message channel
						fayeCommPersonal = new FayeChannel(scope.options.fayeServer, "/personal/$user{user_id}", function(fayeMessage) {

							if (fayeMessage && fayeMessage.type == "personal") {

								if (fayeMessage && isValidMessage(fayeMessage)) {
									var growlMessage = {
										id:				new rcGuid().newGuid(),
										visible:		true,
										personal:		true,
										message_from:	fayeMessage.message_from,
										message_date:	rcDateHandler.getUIDate(),
										message_text:	fayeMessage.message_text,
										link:			fayeMessage.link
									}
									scope.messages.push(growlMessage);
									scope.saveMessages();
									scope.$apply();
								}

							} else {
								debug.log('Nowhere for this message to go', fayeMessage);
							}
						});

						// Subscription to the authorisation message channel.
						// Messages in this channel are only sent to individual
						// users based on who is logged in at the time and has
						// the rights to authorise a particular action.
						fayeCommAuthorisation = new FayeChannel(scope.options.fayeServer, "/authorisation/$user{user_id}", function(fayeMessage) {

							if (fayeMessage && isValidMessage(fayeMessage)) {

								var growlMessage = {
									id:					new rcGuid().newGuid(),
									visible:			true,
									authorisation:		true,
									message_from:		fayeMessage.message_from,
									message_date:		rcDateHandler.getUIDate(),
									message_expires:	fayeMessage.authorisation_request_id,
									message_text:		fayeMessage.message_text,
									link:				fayeMessage.link,
									authorisation:		fayeMessage.authorisation,
									authorisation_request_id:	fayeMessage.authorisation_request_id
								}
								scope.messages.push(growlMessage);
								scope.saveMessages();
								scope.$apply();

							} else {
								debug.log('Nowhere for this message to go', fayeMessage);
							}
						});

						scope.messageRead = function(message) {
							message.visible = false;
							scope.saveMessages();
						};

						scope.authoriseRequest = function(fayeMessage) {

							rcWebservice.post('authorisationrequests/approveAuthorisationRequest', {fayeMessage: fayeMessage}).then(function (response) {
// console.log('response', response);
								fayeMessage.visible = false;
								scope.saveMessages();
							}, function(error) {
// console.log('error', error);
								fayeMessage.visible = false;
								scope.saveMessages();
							});

						};

						scope.rejectRequest = function(fayeMessage) {

							rcWebservice.post('authorisationrequests/rejectAuthorisationRequest', {fayeMessage: fayeMessage}).then(function (response) {
// console.log('response', response);
								fayeMessage.visible = false;
								scope.saveMessages();
							}, function(error) {
// console.log('error', error);
								fayeMessage.visible = false;
								scope.saveMessages();
							});

						};

						// Used to send a faye message to a particular channel
						scope.message = function(fayeMessage) {
							if (fayeMessage) {
								if (fayeMessage.type === "personal") {
									var fayePersonalChannel = new FayeChannel(scope.options.fayeServer, "/personal/" + fayeMessage.user_id);
									fayePersonalChannel.publish(fayeMessage);
								} else if (fayeMessage.type === "authorisation") {
									var fayeAuthorisationChannel = new FayeChannel(scope.options.fayeServer, "/authorisation/" + fayeMessage.user_id);
									fayeAuthorisationChannel.publish(fayeMessage);
								} else {
									fayeCommPublic.publish(fayeMessage);
								}
							}
						};

						scope.saveMessages = function() {
							if (window.sessionStorage) {
								window.sessionStorage.setItem('growlMessages', JSON.stringify(scope.messages));
							}
						}

						// Look to see if there are any messages already saved in
						// the users session storage. If there are then we restore
						// them to the messages list.
						$(document).ready(function() {
							if (window.sessionStorage) {
								if (window.sessionStorage.getItem('growlMessages')) {
									var growlMessages = JSON.parse(window.sessionStorage.getItem('growlMessages'));
									for (var growlMessage = 0; growlMessage < growlMessages.length; growlMessage++) {
										if (growlMessages[growlMessage].visible && isValidMessage(growlMessage)) {
											scope.messages.push(growlMessages[growlMessage]);
										}
									}
								}
							}
						});
					}
				};
				scope.init();
			}
		};
	}
})(angular);
