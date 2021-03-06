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

Webservice exposure for the back office media functions
*/
exports.getMedia = function(connection, callback, requestData) {
    var query = connection.query("CALL get_media(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setMedia = function(connection, callback, requestData) {
    var query = connection.query("CALL set_media(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delMedia = function(connection, callback, requestData) {
    var query = connection.query("CALL del_media(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getMediaList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_media_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getMediaRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_media_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchMedia = function(connection, callback, requestData) {
    var query = connection.query("CALL search_media(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
