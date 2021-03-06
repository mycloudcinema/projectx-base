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

Webservice exposure for the back office mailing_lists functions
*/
exports.getMailingLists = function(connection, callback, requestData) {
    var query = connection.query("CALL get_mailing_lists(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setMailingLists = function(connection, callback, requestData) {
    var query = connection.query("CALL set_mailing_lists(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delMailingLists = function(connection, callback, requestData) {
    var query = connection.query("CALL del_mailing_lists(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getMailingListsList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_mailing_lists_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getMailingListsRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_mailing_lists_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchMailingLists = function(connection, callback, requestData) {
    var query = connection.query("CALL search_mailing_lists(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
