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

 Webservice exposure for the back office user_role_function_groups functions
 */
function getUserRoleFunctionGroups(connnection, callback, requestData) {
    var query = connnection.query("CALL get_user_role_function_groups(?);", [JSON.stringify(requestData)], callback);
}
exports.getUserRoleFunctionGroups = getUserRoleFunctionGroups;
function setUserRoleFunctionGroups(connnection, callback, requestData) {
    var query = connnection.query("CALL set_user_role_function_groups(?);", [JSON.stringify(requestData)], callback);
}
exports.setUserRoleFunctionGroups = setUserRoleFunctionGroups;
function delUserRoleFunctionGroups(connnection, callback, requestData) {
    var query = connnection.query("CALL del_user_role_function_groups(?);", [JSON.stringify(requestData)], callback);
}
exports.delUserRoleFunctionGroups = delUserRoleFunctionGroups;
function getUserRoleFunctionGroupsList(connnection, callback, requestData) {
    var query = connnection.query("CALL get_user_role_function_groups_list(?);", [JSON.stringify(requestData)], callback);
}
exports.getUserRoleFunctionGroupsList = getUserRoleFunctionGroupsList;
function getUserRoleFunctionGroupsRecent(connnection, callback, requestData) {
    var query = connnection.query("CALL get_user_role_function_groups_recent(?);", [JSON.stringify(requestData)], callback);
}
exports.getUserRoleFunctionGroupsRecent = getUserRoleFunctionGroupsRecent;
function searchUserRoleFunctionGroups(connnection, callback, requestData) {
    var query = connnection.query("CALL search_user_role_function_groups(?);", [JSON.stringify(requestData)], callback);
}
exports.searchUserRoleFunctionGroups = searchUserRoleFunctionGroups;
