/*
 __  __          _____ _                 _    _____ _
|  \/  |        / ____| |               | |  / ____(_)
| \  / |_   _  | |    | | ___  _   _  __| | | |     _ _ __   ___ _ __ ___   __ _
| |\/| | | | | | |    | |/ _ \| | | |/ _` | | |    | | '_ \ / _ \ '_ ` _ \ / _` |
| |  | | |_| | | |____| | (_) | |_| | (_| | | |____| | | | |  __/ | | | | | (_| |
|_|  |_|\__, |  \_____|_|\___/ \__,_|\__,_|  \_____|_|_| |_|\___|_| |_| |_|\__,_|
         __/ |
        |___/

Webservice exposure for the back office online_help functions
*/
exports.getOnlineHelp = function(connection, callback, requestData) {
	var query = connection.query("CALL get_online_help(?);", [JSON.stringify(requestData)], callback);
}
exports.setOnlineHelp = function(connection, callback, requestData) {
	var query = connection.query("CALL set_online_help(?);", [JSON.stringify(requestData)], callback);
}
exports.delOnlineHelp = function(connection, callback, requestData) {
	var query = connection.query("CALL del_online_help(?);", [JSON.stringify(requestData)], callback);
}
exports.getOnlineHelpList = function(connection, callback, requestData) {
	var query = connection.query("CALL get_online_help_list(?);", [JSON.stringify(requestData)], callback);
}
exports.getOnlineHelpRecent = function(connection, callback, requestData) {
	var query = connection.query("CALL get_online_help_recent(?);", [JSON.stringify(requestData)], callback);
}
exports.searchOnlineHelp = function(connection, callback, requestData) {
	var query = connection.query("CALL search_online_help(?);", [JSON.stringify(requestData)], callback);
}

exports.getOnlineHelpByPage = function(connection, callback, requestData) {
	var query = connection.query("CALL get_online_help_bypage(?);", [JSON.stringify(requestData)], callback);
	console.log(query.sql);
}
