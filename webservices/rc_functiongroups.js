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

 Webservice exposure for the back office function_groups functions
 */
function getFunctionGroups(connnection, callback, requestData) {
    var query = connnection.query("CALL get_function_groups(?);", [JSON.stringify(requestData)], callback);
}
exports.getFunctionGroups = getFunctionGroups;
function setFunctionGroups(connnection, callback, requestData) {
    var query = connnection.query("CALL set_function_groups(?);", [JSON.stringify(requestData)], callback);
}
exports.setFunctionGroups = setFunctionGroups;
function delFunctionGroups(connnection, callback, requestData) {
    var query = connnection.query("CALL del_function_groups(?);", [JSON.stringify(requestData)], callback);
}
exports.delFunctionGroups = delFunctionGroups;
function getFunctionGroupsList(connnection, callback, requestData) {
    var query = connnection.query("CALL get_function_groups_list(?);", [JSON.stringify(requestData)], callback);
}
exports.getFunctionGroupsList = getFunctionGroupsList;
function getFunctionGroupsRecent(connnection, callback, requestData) {
    var query = connnection.query("CALL get_function_groups_recent(?);", [JSON.stringify(requestData)], callback);
}
exports.getFunctionGroupsRecent = getFunctionGroupsRecent;
function searchFunctionGroups(connnection, callback, requestData) {
    var query = connnection.query("CALL search_function_groups(?);", [JSON.stringify(requestData)], callback);
}
exports.searchFunctionGroups = searchFunctionGroups;
