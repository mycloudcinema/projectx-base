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

Webservice exposure for the back office mailing_list_members functions
*/
exports.getMailingListMembers = function(connection, callback, requestData) {
    var query = connection.query("CALL get_mailing_list_members(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setMailingListMembers = function(connection, callback, requestData) {
    var query = connection.query("CALL set_mailing_list_members(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delMailingListMembers = function(connection, callback, requestData) {
    var query = connection.query("CALL del_mailing_list_members(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getMailingListMembersList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_mailing_list_members_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getMailingListMembersRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_mailing_list_members_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchMailingListMembers = function(connection, callback, requestData) {
    var query = connection.query("CALL search_mailing_list_members(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
