(function (ng) {

	"use strict";

	ng.module("rc.external", ["NgSwitchery", "ui.bootstrap"]);

	ng.module("rc")
		.controller("LoginController", ["dialogs", "rcDevice", "FayeChannel", "LanguagesManager", "$interval", LoginController]);

	// function LoginController(dialogs) {
	function LoginController(dialogs, rcDevice, FayeChannel, LanguagesManager, $interval) {

		var self = this;

		// The rcDevice service will supply us with configuration information
		// about the device and this controls how the UI is presented.
		self.device = rcDevice.device;
		self.language = '$sess{language}';

		// This entity is used internally so we don't attach it to the scope.
		var languagesManager = new LanguagesManager();

		/**
		*	Place a message on the Secondary Display that the station is not in use
		*/
		var fayeUrl = "$setting{faye_server}";
		var fayeChannelName = "/" + rcDevice.device.id;
		var fayeSecondaryDisplay = new FayeChannel(fayeUrl, fayeChannelName);

		var fayeMessage = {
			messageId: 'login',
			messageData: {}
		}

		fayeSecondaryDisplay.publish(fayeMessage)
		$interval(function () {
			fayeSecondaryDisplay.publish(fayeMessage)
		}, 60000)

		languagesManager.getSupported().then(function (supportedLanguages) {
			self.supportedLanguages = supportedLanguages
		});

		self.login = function () {

			// TODO: We are using a jQuery post at the moment because this request
			//		 is directed through the framework directly and not through the
			//		 webservices.
			var request = $.post("/login", {
				password:		sjcl.codec.hex.fromBits(sjcl.hash.sha512.hash(self.password)),
				username:		self.username,
				remember:		self.remember,
				loginBarcode:	self.loginBarcode
			});

			request.success(function (data) {
				if (data && data.resultCode === 0) {
					window.location.href = data.redirect;
				} else {
					dialogs.error("$dict{login_error}", "$dict{invalid_login}");
				}
			});

			// Handle network errors
			request.error(function (response) {
				if (response.status === 401) {
					// Handle 401 (Unauthorized) error
					dialogs.error("$dict{login_error}", "$dict{invalid_login}");
				} else {
					// Handle other possible network errors
					dialogs.error("$dict{login_error}", "$dict{network_error} " + response.status);
				}
			})

		};

	}

})(angular);

$(document).ready(function () {

	// Clear any session storage so that we don't have left overs from the previous
	// sessions. We do this here to make sure that it is actioned before any code
	// that would access the session storage is called.
	if (window.sessionStorage) {
		window.sessionStorage.clear();
	}

	$('#username').bind('keypress', function (e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code === 13) {
			$("#password").focus();
			e.preventDefault();
			e.stopPropagation();
		}
	}).focus();

	setPageTitle("$dict{login}");

});
