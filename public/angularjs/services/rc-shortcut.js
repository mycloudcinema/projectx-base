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

 Keyboard shortcut tracking service
 */

(function (ng) {

    "use strict";

    ng.module("rc.services").factory("rcShortcut", [rcShortcut]);

    function rcShortcut() {
        function ShortcutListener(shortcuts) {
            if (shortcuts) {
                this.listen(shortcuts);
            }
            var self = this;
            window.addEventListener("keydown", function (event) {
                self._handleEvent(event);
            });
        }

        ShortcutListener.prototype._handleEvent = function (event) {
            //debug.log(this);
            for (var i = 0; i < this.listeners.length; i++) {
                var obj = this.listeners[i];
//                debug.log(obj, event);
                if (obj.keyCode) {
                    if (
                        obj.ctrlKey === event.ctrlKey &&
                        obj.altKey === event.altKey &&
                        obj.shiftKey === event.shiftKey &&
                        obj.keyCode === event.keyCode) {
//                        debug.log("Shortcut found", obj);
                        obj.callback(event);
                    }
                } else if (
                    obj.ctrlKey === event.ctrlKey &&
                    obj.altKey === event.altKey &&
                    obj.shiftKey === event.shiftKey &&
                    obj.key === String.fromCharCode(event.keyCode).toUpperCase()
                ) {
//                    debug.log("Shortcut found", obj);
                    obj.callback(event);
                }
            }
        };
        ShortcutListener.prototype.listeners = [];
        ShortcutListener.prototype.listen = function (shortcuts) {
            for (var key in shortcuts) {
                this.listeners.push(new Shortcut(key, shortcuts[key]));
            }
//            debug.log(this.listeners);
        };


        function Shortcut(key, callback) {
            this.key = null;
            this.ctrlKey = false;
            this.altKey = false;
            this.shiftKey = false;
            this.callback = callback;
            this.parse(key);
        }

        Shortcut.prototype.parse = function (key) {
            var parts = key.toLowerCase().split("+");
//            debug.log(parts);
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i].toLowerCase();
                switch (part) {
                    case "ctrl":
                        this.ctrlKey = true;
                        break;
                    case "alt":
                        this.altKey = true;
                        break;
                    case "shift":
                        this.shiftKey = true;
                        break;
                    case "left":
                        this.keyCode = 37;
                        break;
                    case "right":
                        this.keyCode = 39;
                        break;
                    case "up":
                        this.keyCode = 38;
                        break;
                    case "down":
                        this.keyCode = 40;
                        break;
                    case "del":
                        this.keyCode = 46;
                        break;
					case "tab":
						this.keyCode = 9;
						break;
					case "backspace":
						this.keyCode = 8;
						break;
                    default:
//                        debug.log("DEFAULT", part);
                        this.key = part.toUpperCase();
                        break;
                }
            }
        };

        return ShortcutListener;
    }


})(angular);
