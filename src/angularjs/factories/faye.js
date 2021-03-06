var client_id = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
})();
var _faye_clients = {};
var FayeModule;
(function (FayeModule) {
    var FayeChannel = (function () {
        function FayeChannel(fayeUrl, channelName, callback) {
            var _this = this;
            this.channelName = channelName;
            this.fayeUrl = fayeUrl;
            this.onMessageCallback = callback;
            if (_faye_clients.hasOwnProperty(fayeUrl)) {
                this.subscription = _faye_clients[fayeUrl].subscribe(channelName, function (message) { _this.handleMessage(message); });
            }
            else {
                _faye_clients[fayeUrl] = new Faye.Client(fayeUrl, { timeout: 120, retry: 5 });
                this.subscription = _faye_clients[fayeUrl].subscribe(channelName, function (message) { _this.handleMessage(message); });
            }
        }
        FayeChannel.prototype.publish = function (data, callback) {
            _faye_clients[this.fayeUrl].publish(this.channelName, {
                client_id: client_id,
                data: data
            }, function () {
                callback();
            });
        };
        FayeChannel.prototype.handleMessage = function (message) {
            if (message.client_id !== client_id) {
                if (this.onMessageCallback) {
                    this.onMessageCallback(message.data);
                }
            }
        };
        return FayeChannel;
    }());
    FayeModule.FayeChannel = FayeChannel;
})(FayeModule || (FayeModule = {}));
(function (ng) {
    "use strict";
    ng.module("rc.factories").factory("FayeChannel", [function () {
            return FayeModule.FayeChannel;
        }]);
})(angular, FayeModule);
