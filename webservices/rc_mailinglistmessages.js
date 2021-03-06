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

Webservice exposure for the back office mailing_list_messages functions
*/
exports.getMailingListMessages = function(connection, callback, requestData) {
    var query = connection.query("CALL get_mailing_list_messages(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setMailingListMessages = function(connection, callback, requestData) {
    var query = connection.query("CALL set_mailing_list_messages(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delMailingListMessages = function(connection, callback, requestData) {
    var query = connection.query("CALL del_mailing_list_messages(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getMailingListMessagesList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_mailing_list_messages_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getMailingListMessagesRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_mailing_list_messages_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchMailingListMessages = function(connection, callback, requestData) {
    var query = connection.query("CALL search_mailing_list_messages(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
