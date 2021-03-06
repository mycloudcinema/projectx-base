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

Webservice exposure for the back office media_types functions
*/
exports.getMediaTypes = function(connection, callback, requestData) {
    var query = connection.query("CALL get_media_types(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setMediaTypes = function(connection, callback, requestData) {
    var query = connection.query("CALL set_media_types(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delMediaTypes = function(connection, callback, requestData) {
    var query = connection.query("CALL del_media_types(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getMediaTypesList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_media_types_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getMediaTypesRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_media_types_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchMediaTypes = function(connection, callback, requestData) {
    var query = connection.query("CALL search_media_types(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
