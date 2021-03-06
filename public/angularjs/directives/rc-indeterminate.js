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

 Allow an element to convered to a span that will be sized automatically based
 on a set number of sizing options.
*/

(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcIndeterminate", [rcIndeterminate]);

	function rcIndeterminate() {

		return {
			restrict:		"A",
			transclude:		true,
			replace:		true,
			template:		"<span class='{{class}}' style='{{style}}'>{{text}}</span>",
			scope:{
				class:		"@",
				text:		"="
			},
			link: function (scope, element, attrs, ctrl) {

				$('input[type="checkbox"]').change(function(e) {

				  var checked = $(this).prop("checked"),
				      container = $(this).parent(),
				      siblings = container.siblings();

				  container.find('input[type="checkbox"]').prop({
				    indeterminate: false,
				    checked: checked
				  });

				  function checkSiblings(el) {

				    var parent = el.parent().parent(),
				        all = true;

				    el.siblings().each(function() {
				      return all = ($(this).children('input[type="checkbox"]').prop("checked") === checked);
				    });

				    if (all && checked) {

				      parent.children('input[type="checkbox"]').prop({
				        indeterminate: false,
				        checked: checked
				      });

				      checkSiblings(parent);

				    } else if (all && !checked) {

				      parent.children('input[type="checkbox"]').prop("checked", checked);
				      parent.children('input[type="checkbox"]').prop("indeterminate", (parent.find('input[type="checkbox"]:checked').length > 0));
				      checkSiblings(parent);

				    } else {

				      el.parents("li").children('input[type="checkbox"]').prop({
				        indeterminate: true,
				        checked: false
				      });

				    }

				  }

				  checkSiblings(container);
				});


				scope.$watch("text", function (value) {

					// Check to see if the supplied options can be used to determine the
					// font size to be used. If not then we just use the text unmodified.
					try {
						var sizeOptions = JSON.parse(attrs.options);

						// Find the appropriate font size to use based on the text length
						var textLength = scope.text.length;

						var autoSizeStyle = "";

						sizeOptions.forEach(function(sizeOption) {
							if (textLength >= sizeOption.len) {
								autoSizeStyle = "font-size: " + sizeOption.size + ";";
							}
						})
						scope.style = autoSizeStyle;

					} catch (ex) {
						console.log('Invalid autosize options provided', ex);
					}
				});

			}
		};
	}

})(angular);
