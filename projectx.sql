-- MySQL dump 10.13  Distrib 5.7.18, for macos10.12 (x86_64)
--
-- Host: localhost    Database: projectx
-- ------------------------------------------------------
-- Server version	5.7.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_log`
--

DROP TABLE IF EXISTS `activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_log` (
  `activity_log_id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_log_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `function` varchar(50) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `log_data` text,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP,
  `replication_source` varchar(255) DEFAULT NULL,
  `replication_id` bigint(20) DEFAULT NULL,
  `deleted` bit(1) DEFAULT b'0',
  PRIMARY KEY (`activity_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_log`
--

LOCK TABLES `activity_log` WRITE;
/*!40000 ALTER TABLE `activity_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dictionary`
--

DROP TABLE IF EXISTS `dictionary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dictionary` (
  `dictionary_id` int(11) NOT NULL AUTO_INCREMENT,
  `site_name` varchar(50) DEFAULT 'all',
  `dictionary_language` varchar(50) NOT NULL,
  `dictionary_key` varchar(128) NOT NULL,
  `dictionary_category` varchar(50) NOT NULL,
  `dictionary_data` text,
  `needs_update` tinyint(1) NOT NULL DEFAULT '1',
  `dont_translate` tinyint(1) DEFAULT '0',
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime DEFAULT CURRENT_TIMESTAMP,
  `replication_id` bigint(20) DEFAULT '0',
  `replication_source` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`dictionary_language`,`dictionary_key`),
  UNIQUE KEY `dictionary_id_UNIQUE` (`dictionary_id`),
  KEY `idx_dictionary_bylanguage` (`dictionary_category`,`dictionary_language`,`dictionary_key`),
  KEY `idx_dictionary_bykey` (`dictionary_key`,`dictionary_language`,`dictionary_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dictionary`
--

LOCK TABLES `dictionary` WRITE;
/*!40000 ALTER TABLE `dictionary` DISABLE KEYS */;
/*!40000 ALTER TABLE `dictionary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `function_group_functions`
--

DROP TABLE IF EXISTS `function_group_functions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `function_group_functions` (
  `function_group_functions_id` int(11) NOT NULL AUTO_INCREMENT,
  `function_group_id` int(11) DEFAULT NULL,
  `function_id` int(11) DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `replication_source` varchar(255) DEFAULT NULL,
  `replication_id` bigint(20) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`function_group_functions_id`),
  UNIQUE KEY `function_group_functions_id_UNIQUE` (`function_group_id`,`function_id`),
  KEY `fk_functions_function_group_functions_idx` (`function_id`),
  KEY `fk_functiongroups_function_group_functions_idx` (`function_group_id`),
  CONSTRAINT `fk_function_group_functions_function_groups` FOREIGN KEY (`function_group_id`) REFERENCES `function_groups` (`function_group_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_function_group_functions_functions` FOREIGN KEY (`function_id`) REFERENCES `functions` (`function_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `function_group_functions`
--

LOCK TABLES `function_group_functions` WRITE;
/*!40000 ALTER TABLE `function_group_functions` DISABLE KEYS */;
/*!40000 ALTER TABLE `function_group_functions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `function_groups`
--

DROP TABLE IF EXISTS `function_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `function_groups` (
  `function_group_id` int(11) NOT NULL AUTO_INCREMENT,
  `function_group_name` varchar(50) NOT NULL DEFAULT '',
  `function_group_category` varchar(50) NOT NULL DEFAULT '',
  `last_updated` datetime DEFAULT NULL,
  `replication_source` varchar(255) DEFAULT NULL,
  `replication_id` bigint(20) DEFAULT '0',
  `not_for_replication` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`function_group_name`,`function_group_category`),
  UNIQUE KEY `function_group_id_UNIQUE` (`function_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `function_groups`
--

LOCK TABLES `function_groups` WRITE;
/*!40000 ALTER TABLE `function_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `function_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `functions`
--

DROP TABLE IF EXISTS `functions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `functions` (
  `function_id` int(11) NOT NULL AUTO_INCREMENT,
  `function_name` varchar(100) NOT NULL DEFAULT '',
  `public_function` tinyint(1) DEFAULT '0',
  `last_updated` datetime DEFAULT NULL,
  `replication_source` varchar(255) DEFAULT NULL,
  `replication_id` bigint(20) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`function_name`),
  UNIQUE KEY `function_id_UNIQUE` (`function_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `functions`
--

LOCK TABLES `functions` WRITE;
/*!40000 ALTER TABLE `functions` DISABLE KEYS */;
/*!40000 ALTER TABLE `functions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` char(36) COLLATE utf8_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text COLLATE utf8_bin,
  `creation_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_access_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `max_inactive_interval` int(11) NOT NULL DEFAULT '30',
  `principal_name` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('euWX1yV11GV8FTRTNgjMaSKamglDPzTk',1506635755,'{\"cookie\":{\"originalMaxAge\":false,\"expires\":false,\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"language\":\"DE\",\"redirect_to\":\"/server/upload\"}','2017-09-27 09:22:48','2017-09-27 09:22:48',30,NULL);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role_function_groups`
--

DROP TABLE IF EXISTS `user_role_function_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_role_function_groups` (
  `user_role_function_groups_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_role_id` int(11) DEFAULT NULL,
  `function_group_id` int(11) DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `replication_source` varchar(255) DEFAULT NULL,
  `replication_id` bigint(20) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_role_function_groups_id`),
  UNIQUE KEY `user_role_function_groups_id_UNIQUE` (`user_role_function_groups_id`),
  UNIQUE KEY `ux_user_role_function_groups` (`function_group_id`,`user_role_id`),
  KEY `fk_ user_role_function_groups_user_roles_idx` (`user_role_id`),
  KEY `fk_ user_role_function_groups_function_groups_idx` (`function_group_id`),
  CONSTRAINT `fk_ user_role_function_groups_function_groups` FOREIGN KEY (`function_group_id`) REFERENCES `function_groups` (`function_group_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ user_role_function_groups_user_roles` FOREIGN KEY (`user_role_id`) REFERENCES `user_roles` (`user_role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role_function_groups`
--

LOCK TABLES `user_role_function_groups` WRITE;
/*!40000 ALTER TABLE `user_role_function_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_role_function_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_roles` (
  `user_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_role_name` varchar(50) DEFAULT NULL,
  `user_role_level` int(11) DEFAULT NULL,
  `default_role` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_role_id`),
  UNIQUE KEY `user_role_id_UNIQUE` (`user_role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `full_name` varchar(101) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email_confirmed` tinyint(1) DEFAULT '0',
  `email_confirmation_code` varchar(50) DEFAULT NULL,
  `phone_confirmed` tinyint(1) DEFAULT '0',
  `phone_confirmation_code` varchar(50) DEFAULT NULL,
  `user_roles` varchar(255) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `last_activity` datetime DEFAULT CURRENT_TIMESTAMP,
  `default_page` varchar(45) DEFAULT '/index',
  `import_id` bigint(20) DEFAULT NULL,
  `internal_id` varchar(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `note` text,
  `last_updated` datetime DEFAULT NULL,
  `replication_source` varchar(255) DEFAULT NULL,
  `replication_id` bigint(20) DEFAULT NULL,
  `id` varchar(50) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `IX_LOGIN_ID` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'projectx'
--
/*!50003 DROP FUNCTION IF EXISTS `fn_add_activity_log` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_add_activity_log`(var_function VARCHAR(50), var_action VARCHAR(50), var_Data LONGTEXT CHARACTER SET utf8mb4) RETURNS bigint(20)
BEGIN

	DECLARE key_userId					INTEGER;
	DECLARE key_language				VARCHAR(255);

	DECLARE value_query					JSON;
	DECLARE value_payload				JSON;

	DECLARE value_activity_log_id		BIGINT;
	DECLARE value_activity_log_date		DATETIME;
	DECLARE value_site_name				VARCHAR(50);
	DECLARE value_user_class			VARCHAR(50);
	DECLARE value_cinema_id				INT;

	SET key_userId						= fn_get_json_int(var_Data, '$.user_id');
	SET key_language					= fn_get_json_varchar(var_Data, '$.language');

	SET value_query						= fn_get_json_object(var_Data, '$.query');
	SET value_payload					= fn_get_json_object(var_Data, '$.payload');

	-- Some functions (like refunds) change the user id so to keep the logging
	-- accurate we need to extract that user id and use that instead.
	IF var_function = 'Add Refund' THEN
		SET key_userId					= fn_get_json_int(value_payload, '$.refunded_by');
	END IF;

	INSERT INTO `activity_log` (

		activity_log_date,
		user_id,
		function,
		action,
		log_data

	) VALUES (

		CURRENT_TIMESTAMP,
		key_userId,
		var_function,
		var_action,
		var_Data

	);

	SET value_activity_log_id = LAST_INSERT_ID();

	RETURN value_activity_log_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_array` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_array`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS json
BEGIN

	IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN JSON_MERGE('[]', NULL);
	ELSE
		RETURN JSON_MERGE('[]', json_unquote(json_extract(value_jsonObject, value_key)));
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_bigint` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_bigint`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS bigint(20)
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN NULL;
	ELSE
		RETURN json_unquote(json_extract(value_jsonObject, value_key));
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_bigint_d` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_bigint_d`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default BIGINT) RETURNS bigint(20)
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN value_default;
	ELSE
		RETURN COALESCE(json_unquote(json_extract(value_jsonObject, value_key)), value_default);
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_boolean` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_boolean`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS tinyint(1)
BEGIN

    IF (LOWER(json_unquote(json_extract(value_jsonObject, value_key))) = 'null') THEN
		RETURN 0;
	ELSE
		IF (LOWER(json_unquote(json_extract(value_jsonObject, value_key))) = 'true') THEN
			RETURN 1;
        ELSEIF (json_unquote(json_extract(value_jsonObject, value_key)) = '1') THEN
			RETURN 1;
		ELSE
			RETURN 0;
		END IF;
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_boolean_d` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_boolean_d`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default TINYINT(1)) RETURNS tinyint(1)
BEGIN

    IF (LOWER(json_unquote(json_extract(value_jsonObject, value_key))) = 'null') THEN
		RETURN value_default;
	ELSE
		IF (LOWER(json_unquote(json_extract(value_jsonObject, value_key))) = 'true') THEN
			RETURN 1;
        ELSEIF (json_unquote(json_extract(value_jsonObject, value_key)) = '1') THEN
			RETURN 1;
		ELSE
			RETURN value_default;
		END IF;
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_date` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_date`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS datetime
BEGIN

	IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null' OR json_unquote(json_extract(value_jsonObject, value_key)) IS NULL) THEN
		RETURN NULL;
	ELSE
		RETURN DATE(STR_TO_DATE(json_unquote(json_extract(value_jsonObject, value_key)), '%Y-%m-%dT%H:%i:%s.%fZ'));
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_datetime` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_datetime`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS datetime
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN NULL;
	ELSE
		RETURN STR_TO_DATE(json_unquote(json_extract(value_jsonObject, value_key)), '%Y-%m-%dT%H:%i:%s.%fZ');
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_datetime_d` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_datetime_d`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default DATETIME) RETURNS datetime
BEGIN

	IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null' OR json_unquote(json_extract(value_jsonObject, value_key)) IS NULL) THEN
		RETURN value_default;
	ELSE
		RETURN COALESCE(STR_TO_DATE(json_unquote(json_extract(value_jsonObject, value_key)), '%Y-%m-%dT%H:%i:%s.%fZ'), value_default);
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_datetime_gmt` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_datetime_gmt`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS datetime
BEGIN

	DECLARE var_dateTime					DATETIME;

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN NULL;
	ELSE
		SET var_dateTime = STR_TO_DATE(json_unquote(json_extract(value_jsonObject, value_key)), '%Y-%m-%dT%H:%i:%s.%fZ');

		RETURN CONVERT_TZ(var_dateTime, 'UTC', '+01:00');
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_datetime_utc` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_datetime_utc`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS datetime
BEGIN

	DECLARE var_dateTime					DATETIME;
	DECLARE var_timeOffset					INTEGER;
    DECLARE var_timeZone					VARCHAR(6);

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null' OR json_unquote(json_extract(value_jsonObject, value_key)) = 'undefined') THEN
		RETURN NULL;
	ELSE

		SET var_dateTime = STR_TO_DATE(json_unquote(json_extract(value_jsonObject, value_key)), '%Y-%m-%dT%H:%i:%s.%fZ');
		SET var_timeOffset = TIMESTAMPDIFF(HOUR, UTC_TIMESTAMP(), NOW());
		SET var_timeZone = CONCAT('+', var_timeOffset, ':00');

		IF var_timeOffset > 0 THEN
			RETURN CONVERT_TZ(var_dateTime, 'UTC', var_timeZone);
		ELSE
			RETURN CONVERT_TZ(var_dateTime, 'UTC', var_timeZone);
		END IF;

	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_datetime_utc_d` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_datetime_utc_d`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default DATETIME) RETURNS datetime
BEGIN

	DECLARE var_dateTime					DATETIME;
	DECLARE var_timeOffset					INTEGER;
    DECLARE var_timeZone					VARCHAR(6);

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null' OR json_unquote(json_extract(value_jsonObject, value_key)) IS NULL) THEN
		RETURN value_default;
	ELSE

		SET var_dateTime = STR_TO_DATE(json_unquote(json_extract(value_jsonObject, value_key)), '%Y-%m-%dT%H:%i:%s.%fZ');
		SET var_timeOffset = TIMESTAMPDIFF(HOUR, UTC_TIMESTAMP(), NOW());
		SET var_timeZone = CONCAT('+', var_timeOffset, ':00');

		IF var_timeOffset > 0 THEN
			RETURN CONVERT_TZ(var_dateTime, 'UTC', var_timeZone);
		ELSE
			RETURN CONVERT_TZ(var_dateTime, 'UTC', var_timeZone);
		END IF;

	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_date_d` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_date_d`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default DATETIME) RETURNS datetime
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null' OR json_unquote(json_extract(value_jsonObject, value_key)) = 'undefined' OR json_unquote(json_extract(value_jsonObject, value_key)) IS NULL) THEN
		RETURN value_default;
	ELSE
		RETURN DATE(COALESCE(STR_TO_DATE(json_unquote(json_extract(value_jsonObject, value_key)), '%Y-%m-%dT%H:%i:%s.%fZ'), value_default));
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_decimal` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_decimal`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS decimal(10,0)
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN NULL;
	ELSE
		RETURN json_unquote(json_extract(value_jsonObject, value_key));
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_decimal_d` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_decimal_d`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default BIGINT) RETURNS decimal(10,0)
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN value_default;
	ELSE
		RETURN COALESCE(json_unquote(json_extract(value_jsonObject, value_key)), value_default);
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_float` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_float`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS float
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN NULL;
	ELSE
		RETURN json_unquote(json_extract(value_jsonObject, value_key));
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_float_d` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_float_d`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default FLOAT) RETURNS float
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN value_default;
	ELSE
		RETURN COALESCE(json_unquote(json_extract(value_jsonObject, value_key)), value_default);
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_int` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_int`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS int(11)
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null' OR json_unquote(json_extract(value_jsonObject, value_key)) = 'undefined') THEN
		RETURN NULL;
	ELSE
		RETURN json_unquote(json_extract(value_jsonObject, value_key));
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_integer` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_integer`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default INTEGER) RETURNS int(11)
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN value_default;
	ELSE
		RETURN COALESCE(json_unquote(json_extract(value_jsonObject, value_key)), value_default);
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_int_d` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_int_d`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default INTEGER) RETURNS int(11)
BEGIN

	-- This function is a copy of the fn_get_json_int function with the addition
	-- of a default parameter that can be passed by the calling SP.
	IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null' OR json_unquote(json_extract(value_jsonObject, value_key)) = 'undefined' OR json_unquote(json_extract(value_jsonObject, value_key)) = '') THEN
		RETURN value_default;
	ELSE
		RETURN COALESCE(json_unquote(json_extract(value_jsonObject, value_key)), value_default);
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_longtext` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_longtext`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS longtext CHARSET utf8mb4
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN NULL;
	ELSE
		RETURN json_unquote(json_extract(value_jsonObject, value_key));
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_longtext_d` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_longtext_d`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default LONGTEXT CHARSET utf8mb4) RETURNS longtext CHARSET utf8mb4
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN value_default;
	ELSE
		RETURN COALESCE(json_unquote(json_extract(value_jsonObject, value_key)), value_default);
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_object` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_object`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS json
BEGIN

	IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN JSON_MERGE('{}', NULL);
	ELSE
		RETURN JSON_MERGE('{}', json_unquote(json_extract(value_jsonObject, value_key)));
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_time` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_time`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS time
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN NULL;
	ELSE
		RETURN json_unquote(json_extract(value_jsonObject, value_key));
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_time_d` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_time_d`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default DATETIME) RETURNS time
BEGIN

	IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null' OR json_unquote(json_extract(value_jsonObject, value_key)) IS NULL) THEN
		RETURN value_default;
	ELSE
		RETURN COALESCE(STR_TO_TIME(json_unquote(json_extract(value_jsonObject, value_key)), '%i:%s.%f'), value_default);
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_tinyint` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_tinyint`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS tinyint(4)
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN NULL;
	ELSE
		RETURN json_unquote(json_extract(value_jsonObject, value_key));
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_tinyint_d` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_tinyint_d`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default INTEGER) RETURNS tinyint(4)
BEGIN

	-- This function is a copy of the fn_get_json_int function with the addition
	-- of a default parameter that can be passed by the calling SP.
    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN value_default;
	ELSE
		RETURN COALESCE(json_unquote(json_extract(value_jsonObject, value_key)), value_default);
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_varchar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_varchar`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255)) RETURNS varchar(255) CHARSET utf8mb4
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN NULL;
	ELSE
		RETURN json_unquote(json_extract(value_jsonObject, value_key));
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_json_varchar_d` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_json_varchar_d`(value_jsonObject LONGTEXT CHARACTER SET utf8mb4, value_key VARCHAR(255), value_default VARCHAR(255)) RETURNS varchar(255) CHARSET utf8mb4
BEGIN

    IF (json_unquote(json_extract(value_jsonObject, value_key)) = 'null') THEN
		RETURN value_default;
	ELSE
		RETURN COALESCE(json_unquote(json_extract(value_jsonObject, value_key)), value_default);
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_user_role_names` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE FUNCTION `fn_get_user_role_names`(value_data CHARACTER VARYING(255)) RETURNS longtext CHARSET utf8mb4
BEGIN

	-- This function takes a JSON array of user roles ids and returns a comma
	-- seperated list of user roles names.
	DECLARE var_Return			LONGTEXT CHARACTER SET utf8mb4;
	DECLARE var_roleName		LONGTEXT CHARACTER SET utf8mb4;
	DECLARE var_firstThrough	BOOLEAN;

	SET var_firstThrough		= true;
	SET var_Return				= '';

	SET @separator				= ',';
	SET @separatorLength		= CHAR_LENGTH(@separator);
	SET value_data				= REPLACE(REPLACE(value_data, '[', ''), ']', '');

	WHILE value_data != '' > 0 DO

		SET @currentValue = SUBSTRING_INDEX(value_data, @separator, 1);

		SET var_roleName = (SELECT user_role_name FROM user_roles WHERE user_role_id = @currentValue);

		IF NOT var_firstThrough THEN
			SET var_Return = CONCAT(var_Return, ', ', var_roleName);
		ELSE
			SET var_Return = var_roleName;
		END IF;
		SET var_firstThrough = false;

		SET value_data = SUBSTRING(value_data, CHAR_LENGTH(@currentValue) + @separatorLength + 1);

	END WHILE;

	RETURN var_Return;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `del_activity_log` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `del_activity_log`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id');

	UPDATE activity_log SET deleted = true WHERE activity_log_id = value_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `del_functions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `del_functions`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id');

	UPDATE functions SET deleted = true WHERE function_id = value_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `del_function_groups` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `del_function_groups`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id');

	UPDATE function_groups SET deleted = true WHERE function_group_id = value_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `del_function_group_functions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `del_function_group_functions`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id');

	UPDATE function_group_functions SET deleted = true WHERE function_group_functions_id = value_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `del_users` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `del_users`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id');

	UPDATE users SET deleted = true WHERE user_id = value_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `del_user_roles` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `del_user_roles`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id');

	UPDATE user_roles SET deleted = true WHERE user_role_id = value_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `del_user_role_function_groups` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `del_user_role_function_groups`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id');

	UPDATE user_role_function_groups SET deleted = true WHERE user_role_function_groups_id = value_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_activity_log` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_activity_log`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			LONGTEXT CHARACTER SET utf8mb4;
	DECLARE value_payload		LONGTEXT CHARACTER SET utf8mb4;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id', 0);

	SELECT

		activity_log.activity_log_id	AS activity_log_id,
		activity_log.activity_log_date	AS activity_log_date,
		activity_log.user_id			AS user_id,
		users.full_name					AS user_name,
		activity_log.function			AS function,
		activity_log.action				AS action,
		activity_log.log_data			AS log_data,
		activity_log.deleted			AS deleted

	FROM activity_log

	INNER JOIN users	USING (user_id)

	WHERE activity_log_id = value_id AND NOT activity_log.deleted = true;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_activity_log_list` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_activity_log_list`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			LONGTEXT CHARACTER SET utf8mb4;
	DECLARE value_payload		LONGTEXT CHARACTER SET utf8mb4;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		activity_log.activity_log_id	AS activity_log_id,
		activity_log.activity_log_date	AS activity_log_date,
		activity_log.user_id			AS user_id,
		users.full_name					AS user_name,
		activity_log.function			AS function,
		activity_log.action				AS action,
		activity_log.log_data			AS log_data,
		activity_log.deleted			AS deleted

	FROM activity_log

	INNER JOIN users	USING (user_id)

	WHERE NOT activity_log.deleted = true;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_activity_log_recent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_activity_log_recent`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			LONGTEXT CHARACTER SET utf8mb4;
	DECLARE value_payload		LONGTEXT CHARACTER SET utf8mb4;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		activity_log.activity_log_id	AS activity_log_id,
		activity_log.activity_log_date	AS activity_log_date,
		activity_log.user_id			AS user_id,
		users.full_name					AS user_name,
		activity_log.function			AS function,
		activity_log.action				AS action,
		activity_log.log_data			AS log_data,
		activity_log.deleted			AS deleted

	FROM activity_log

	INNER JOIN users	USING (user_id)

	WHERE

	activity_log.activity_log_date > DATE_ADD(CURRENT_TIMESTAMP, INTERVAL -7 DAY)
	AND NOT activity_log.deleted = true;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_dictionary` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_dictionary`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			LONGTEXT CHARACTER SET utf8mb4;
	DECLARE value_payload		LONGTEXT CHARACTER SET utf8mb4;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id', 0);

	SELECT

		dictionary.dictionary_id			AS dictionary_id,
		dictionary.dictionary_language		AS dictionary_language,
		dictionary.dictionary_key			AS dictionary_key,
		dictionary.dictionary_category		AS dictionary_category,
		dictionary.dictionary_data			AS dictionary_data,
		dictionary.needs_update				AS needs_update,
		dictionary.dont_translate			AS dont_translate,
		DATE(dictionary.date_added)			AS date_added,
		DATE(dictionary.date_updated)		AS date_updated,
		dictionary.deleted					AS deleted

	FROM dictionary

	WHERE

		dictionary_id = value_id
		AND NOT dictionary.deleted
		;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_dictionary_items` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_dictionary_items`(IN var_language VARCHAR(50), IN var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	SELECT

		dictionary.dictionary_key,
        dictionary.dictionary_data,
		dictionary.dictionary_category,
		dictionary.dictionary_language

    FROM dictionary

    WHERE

	CASE WHEN
		var_language IS NULL THEN true
	ELSE
		dictionary.dictionary_language LIKE var_language
	END
	;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_functions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_functions`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id', 0);

	SELECT

		functions.function_id		AS function_id,
		functions.function_name		AS function_name,
		functions.public_function	AS public_function,
		functions.deleted			AS deleted

	FROM functions

	WHERE

		function_id = value_id
		AND NOT functions.deleted
		;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_functions_list` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_functions_list`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		functions.function_id		AS function_id,
		functions.function_name		AS function_name,
		functions.public_function	AS public_function,
		functions.deleted			AS deleted

	FROM functions

	WHERE

	NOT functions.deleted
	;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_functions_recent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_functions_recent`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		functions.function_id AS function_id,
		functions.function_name AS function_name,
		functions.public_function AS public_function,
		functions.deleted AS deleted

	FROM functions

	WHERE

	NOT functions.deleted
	;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_function_groups` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_function_groups`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id', 0);

	SELECT

		function_groups.function_group_id AS function_group_id,
		function_groups.function_group_name AS function_group_name,
		function_groups.function_group_category AS function_group_category,
		function_groups.not_for_replication AS not_for_replication,
		function_groups.deleted AS deleted

	FROM function_groups

	WHERE function_group_id = value_id AND NOT function_groups.deleted = true;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_function_groups_list` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_function_groups_list`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		function_groups.function_group_id					AS function_group_id,
		function_groups.function_group_name					AS function_group_name,
		function_groups.function_group_category				AS function_group_category,
		function_groups.not_for_replication					AS not_for_replication,
		function_groups.deleted								AS deleted,
		fn_has_access(key_userId, 'edit_function_group')	AS editable

	FROM function_groups

	WHERE NOT function_groups.deleted = true;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_function_groups_recent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_function_groups_recent`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		function_groups.function_group_id AS function_group_id,
		function_groups.function_group_name AS function_group_name,
		function_groups.function_group_category AS function_group_category,
		function_groups.not_for_replication AS not_for_replication,
		function_groups.deleted AS deleted

	FROM function_groups

	WHERE NOT function_groups.deleted = true;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_function_group_functions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_function_group_functions`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id', 0);

	SELECT

		function_group_functions.function_group_functions_id AS function_group_functions_id,
		function_group_functions.function_group_id AS function_group_id,
		function_groups.function_group_name AS function_group_name,
		function_group_functions.function_id AS function_id,
		functions.function_name AS function_name,
		function_groups.not_for_replication AS not_for_replication,
		function_group_functions.deleted AS deleted

	FROM function_group_functions

	INNER JOIN function_groups ON function_groups.function_group_id = function_group_functions.function_group_id
	INNER JOIN functions ON functions.function_id = function_group_functions.function_id

	WHERE function_group_functions_id = value_id AND NOT function_group_functions.deleted = true;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_function_group_functions_list` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_function_group_functions_list`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		function_group_functions.function_group_functions_id AS function_group_functions_id,
		function_group_functions.function_group_id AS function_group_id,
		function_groups.function_group_name AS function_group_name,
		function_group_functions.function_id AS function_id,
		functions.function_name AS function_name,
		function_groups.not_for_replication AS not_for_replication,
		function_group_functions.deleted AS deleted

	FROM function_group_functions

	INNER JOIN function_groups ON function_groups.function_group_id = function_group_functions.function_group_id
	INNER JOIN functions ON functions.function_id = function_group_functions.function_id

	WHERE NOT function_group_functions.deleted = true;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_function_group_functions_recent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_function_group_functions_recent`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		function_group_functions.function_group_functions_id AS function_group_functions_id,
		function_group_functions.function_group_id AS function_group_id,
		function_groups.function_group_name AS function_group_name,
		function_group_functions.function_id AS function_id,
		functions.function_name AS function_name,
		function_groups.not_for_replication AS not_for_replication,
		function_group_functions.deleted AS deleted

	FROM function_group_functions

	INNER JOIN function_groups ON function_groups.function_group_id = function_group_functions.function_group_id
	INNER JOIN functions ON functions.function_id = function_group_functions.function_id

	WHERE NOT function_group_functions.deleted = true;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_security_functiongroupfunctions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_security_functiongroupfunctions`(var_group_id INT)
BEGIN

	SELECT function_id FROM function_group_functions WHERE function_group_id = var_group_id AND NOT deleted;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_security_functiongroups` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_security_functiongroups`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	SELECT

		function_groups.function_group_category,
		function_groups.function_group_name,
		function_groups.function_group_id

	FROM function_groups

	WHERE NOT deleted

	ORDER BY function_group_category, function_group_name;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_security_functions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_security_functions`(var_Data LONGTEXT CHARACTER SET utf8mb4, var_group_id INT)
BEGIN

	IF (var_group_id = 0) THEN
		SELECT function_id, function_name FROM functions WHERE NOT deleted;
	ELSE
		SELECT function_id, function_name FROM functions WHERE function_id IN (SELECT function_id FROM function_group_functions WHERE function_group_id = var_group_id AND deleted = false) AND NOT deleted;
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_security_function_group_functions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_security_function_group_functions`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			LONGTEXT CHARACTER SET utf8mb4;
	DECLARE value_payload		LONGTEXT CHARACTER SET utf8mb4;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id', 0);

	SELECT

		function_group_functions.function_group_functions_id	AS function_group_functions_id,
		function_group_functions.function_group_id				AS function_group_id,
		function_groups.function_group_name						AS function_group_name,
		function_group_functions.function_id					AS function_id,
		functions.function_name									AS function_name,
		function_groups.not_for_replication						AS not_for_replication,
		function_group_functions.deleted						AS deleted

	FROM function_group_functions

	INNER JOIN function_groups	ON function_groups.function_group_id = function_group_functions.function_group_id AND NOT function_groups.deleted
	INNER JOIN functions		ON functions.function_id = function_group_functions.function_id AND NOT functions.deleted

	WHERE

	(function_group_functions.function_group_id = value_id OR value_id = 0)
	AND NOT function_group_functions.deleted;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_security_publicfunctions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_security_publicfunctions`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	SELECT

	functions.function_id AS ID,
	functions.function_name

	FROM

	functions

	WHERE

	public_function = 1
	AND NOT functions.deleted

	ORDER BY

	functions.function_name;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_security_userrolefunctions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_security_userrolefunctions`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	SELECT

	user_roles.user_role_name,
	user_roles.user_role_id,
	function_groups.function_group_name AS function_group,
	functions.function_id AS ID,
	functions.function_name

	FROM

	user_role_function_groups

	INNER JOIN user_roles USING (user_role_id)
	INNER JOIN function_group_functions USING (function_group_id)
 	INNER JOIN function_groups ON function_groups.function_group_id = user_role_function_groups.function_group_id
	INNER JOIN functions USING (function_id)

	WHERE NOT user_role_function_groups.deleted AND NOT function_group_functions.deleted AND NOT functions.deleted

	ORDER BY

	user_roles.user_role_name,
	functions.function_name;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_security_userroles` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_security_userroles`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		user_roles.user_role_id		AS user_role_id,
		user_roles.user_role_name	AS user_role_name,
		user_roles.default_role		AS default_role,
		user_roles.deleted			AS deleted,
		(
			SELECT GROUP_CONCAT(user_role_function_groups.function_group_id)
			FROM user_role_function_groups
			WHERE (
				user_role_function_groups.user_role_id = user_roles.user_role_id
				AND NOT user_role_function_groups.deleted
			)
		) AS function_group_ids

	FROM user_roles

	WHERE

	NOT user_roles.deleted

	ORDER BY user_role_name;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_users` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_users`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);
	DECLARE value_internal_id	VARCHAR(20);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar(value_query, '$.id');
	SET value_internal_id		= fn_get_json_varchar(value_query, '$.internal_id');

	SELECT

		users.user_id							AS user_id,
		users.login								AS login,
		users.password							AS password,
		users.first_name						AS first_name,
		users.last_name							AS last_name,
		users.full_name							AS full_name,
		users.email								AS email,
		users.phone								AS phone,
		users.email_confirmed					AS email_confirmed,
		users.email_confirmation_code			AS email_confirmation_code,
		users.phone_confirmed					AS phone_confirmed,
		users.phone_confirmation_code			AS phone_confirmation_code,
		users.internal_id						AS internal_id,
		users.active							AS active,
		users.deleted							AS deleted,
		users.user_roles						AS user_roles,
		users.user_sites						AS user_sites,
		users.last_login						AS last_login,
		users.last_activity						AS last_activity,
		users.default_page						AS default_page,

		fn_get_user_role_names(users.user_roles)	AS user_role_names

	FROM users

	WHERE (value_internal_id IS NULL AND user_id = value_id) OR (value_internal_id IS NOT NULL AND users.internal_id = value_internal_id);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_users_list` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_users_list`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		users.user_id							AS user_id,
		users.login								AS login,
		users.password							AS password,
		users.first_name						AS first_name,
		users.last_name							AS last_name,
		users.full_name							AS full_name,
		users.email								AS email,
		users.phone								AS phone,
		users.email_confirmed					AS email_confirmed,
		users.email_confirmation_code			AS email_confirmation_code,
		users.phone_confirmed					AS phone_confirmed,
		users.phone_confirmation_code			AS phone_confirmation_code,
		users.internal_id						AS internal_id,
		users.active							AS active,
		users.deleted							AS deleted,
		users.user_roles						AS user_roles,
		users.user_sites						AS user_sites,
		users.last_login						AS last_login,
		users.last_activity						AS last_activity,
		users.default_page						AS default_page,

		fn_get_user_role_names(users.user_roles)	AS user_role_names

	FROM users

	WHERE

		NOT users.deleted
		AND users.active

	ORDER BY users.first_name, users.last_name;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_users_recent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_users_recent`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		users.user_id							AS user_id,
		users.login								AS login,
		users.password							AS password,
		users.first_name						AS first_name,
		users.last_name							AS last_name,
		users.full_name							AS full_name,
		users.email								AS email,
		users.phone								AS phone,
		users.email_confirmed					AS email_confirmed,
		users.email_confirmation_code			AS email_confirmation_code,
		users.phone_confirmed					AS phone_confirmed,
		users.phone_confirmation_code			AS phone_confirmation_code,
		users.internal_id						AS internal_id,
		users.active							AS active,
		users.deleted							AS deleted,
		users.user_roles						AS user_roles,
		users.user_sites						AS user_sites,
		users.last_login						AS last_login,
		users.last_activity						AS last_activity,
		users.default_page						AS default_page,

		fn_get_user_role_names(users.user_roles)	AS user_role_names

	FROM users

	WHERE NOT users.deleted;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_user_roles` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_user_roles`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);

	DECLARE var_user_roles		VARCHAR(255);
	DECLARE var_user_role_level	INTEGER;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id', 0);

	-- First we have to determine the maximum role that the user can assign
	-- to another user.
	SELECT users.user_roles					INTO var_user_roles FROM users WHERE user_id = key_userId;
	SELECT MAX(user_roles.user_role_level)	INTO var_user_role_level FROM user_roles WHERE user_roles.user_role_id IN (REPLACE(REPLACE(var_user_roles, "[", ""), "]", ""));

	SELECT

		user_roles.user_role_id				AS user_role_id,
		user_roles.user_role_name			AS user_role_name,
		user_roles.user_role_level			AS user_role_level,
		user_roles.default_role				AS default_role,
		user_roles.deleted					AS deleted

	FROM user_roles

	WHERE NOT
		user_role_id = value_id
		AND NOT user_roles.user_role_level > @user_role_level
		AND NOT user_roles.deleted
	;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_user_roles_list` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_user_roles_list`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE var_user_roles		VARCHAR(255);
	DECLARE var_user_role_level	INTEGER;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	-- First we have to determine the maximum role that the user can assign
	-- to another user.
	SELECT users.user_roles					INTO var_user_roles FROM users WHERE user_id = key_userId;
	SELECT MAX(user_roles.user_role_level)	INTO var_user_role_level FROM user_roles WHERE user_roles.user_role_id IN (REPLACE(REPLACE(var_user_roles, "[", ""), "]", ""));

	SELECT

		user_roles.user_role_id				AS user_role_id,
		user_roles.user_role_name			AS user_role_name,
		user_roles.user_role_level			AS user_role_level,
		user_roles.default_role				AS default_role,
		user_roles.deleted					AS deleted

	FROM user_roles

	WHERE NOT
		NOT user_roles.user_role_level > @user_role_level
		AND NOT user_roles.deleted
	;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_user_roles_recent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_user_roles_recent`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE var_user_roles		VARCHAR(255);
	DECLARE var_user_role_level	INTEGER;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	-- First we have to determine the maximum role that the user can assign
	-- to another user.
	SELECT users.user_roles					INTO var_user_roles FROM users WHERE user_id = key_userId;
	SELECT MAX(user_roles.user_role_level)	INTO var_user_role_level FROM user_roles WHERE user_roles.user_role_id IN (REPLACE(REPLACE(var_user_roles, "[", ""), "]", ""));

	SELECT

		user_roles.user_role_id				AS user_role_id,
		user_roles.user_role_name			AS user_role_name,
		user_roles.user_role_level			AS user_role_level,
		user_roles.default_role				AS default_role,
		user_roles.deleted					AS deleted

	FROM user_roles

	WHERE NOT
		NOT user_roles.user_role_level > @user_role_level
		AND NOT user_roles.deleted
	;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_user_role_function_groups` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_user_role_function_groups`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_id			VARCHAR(255);

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_id				= fn_get_json_varchar_d(value_query, '$.id', 0);

	SELECT

		user_role_function_groups.user_role_function_groups_id AS user_role_function_groups_id,
		user_role_function_groups.user_role_id AS user_role_id,
		user_roles.user_role_name AS user_role_name,
		user_role_function_groups.function_group_id AS function_group_id,
		function_groups.function_group_name AS function_group_name,
		user_role_function_groups.deleted AS deleted

	FROM user_role_function_groups

	INNER JOIN user_roles ON user_roles.user_role_id = user_role_function_groups.user_role_id
	INNER JOIN function_groups ON function_groups.function_group_id = user_role_function_groups.function_group_id

	WHERE user_role_function_groups_id = value_id AND NOT user_role_function_groups.deleted = true;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_user_role_function_groups_list` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_user_role_function_groups_list`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		user_role_function_groups.user_role_function_groups_id AS user_role_function_groups_id,
		user_role_function_groups.user_role_id AS user_role_id,
		user_roles.user_role_name AS user_role_name,
		user_role_function_groups.function_group_id AS function_group_id,
		function_groups.function_group_name AS function_group_name,
		user_role_function_groups.deleted AS deleted

	FROM user_role_function_groups

	INNER JOIN user_roles ON user_roles.user_role_id = user_role_function_groups.user_role_id
	INNER JOIN function_groups ON function_groups.function_group_id = user_role_function_groups.function_group_id

	WHERE NOT user_role_function_groups.deleted = true;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_user_role_function_groups_recent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_user_role_function_groups_recent`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SELECT

		user_role_function_groups.user_role_function_groups_id AS user_role_function_groups_id,
		user_role_function_groups.user_role_id AS user_role_id,
		user_roles.user_role_name AS user_role_name,
		user_role_function_groups.function_group_id AS function_group_id,
		function_groups.function_group_name AS function_group_name,
		user_role_function_groups.deleted AS deleted

	FROM user_role_function_groups

	INNER JOIN user_roles ON user_roles.user_role_id = user_role_function_groups.user_role_id
	INNER JOIN function_groups ON function_groups.function_group_id = user_role_function_groups.function_group_id

	WHERE NOT user_role_function_groups.deleted = true;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `search_activity_log` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `search_activity_log`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_searchTerm	VARCHAR(255) CHARACTER SET utf8mb4;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_searchTerm		= fn_get_json_object(value_payload, '$.searchTerm');

	SELECT

	activity_log.activity_log_id	AS activity_log_id,
	activity_log.activity_log_date	AS activity_log_date,
	activity_log.user_id			AS user_id,
	users.full_name					AS user_name,
	activity_log.function			AS function,
	activity_log.action				AS action,
	activity_log.log_data			AS log_data,
	activity_log.deleted			AS deleted

FROM activity_log

INNER JOIN users	USING (user_id)

WHERE
	NOT activity_log.deleted
	AND (
		users.full_name			LIKE CONCAT('%', value_searchTerm, '%')
		OR activity_log.function	LIKE CONCAT('%', value_searchTerm, '%')
		OR activity_log.action		LIKE CONCAT('%', value_searchTerm, '%')
		OR activity_log.log_data	LIKE CONCAT('%', value_searchTerm, '%')
	);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `search_functions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `search_functions`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_searchTerm	VARCHAR(255) CHARACTER SET utf8mb4;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_searchTerm		= fn_get_json_object(value_payload, '$.searchTerm');

	SELECT

		functions.function_id		AS function_id,
		functions.function_name		AS function_name,
		functions.public_function	AS public_function,
		functions.deleted			AS deleted

	FROM functions

	WHERE NOT functions.deleted = true
	AND (
		function_name LIKE  CONCAT('%', value_searchTerm, '%')
	);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `search_function_groups` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `search_function_groups`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_searchTerm	VARCHAR(255) CHARACTER SET utf8mb4;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_searchTerm		= fn_get_json_object(value_payload, '$.searchTerm');

	SELECT

		function_groups.function_group_id AS function_group_id,
		function_groups.function_group_name AS function_group_name,
		function_groups.function_group_category AS function_group_category,
		function_groups.not_for_replication AS not_for_replication,
		function_groups.deleted AS deleted

	FROM function_groups

	WHERE NOT function_groups.deleted = true
	AND (
		function_group_name LIKE  CONCAT('%', value_searchTerm, '%')
		OR function_group_category LIKE  CONCAT('%', value_searchTerm, '%')
	);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `search_function_group_functions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `search_function_group_functions`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_searchTerm	VARCHAR(255) CHARACTER SET utf8mb4;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_searchTerm		= fn_get_json_object(value_payload, '$.searchTerm');

	SELECT

		function_group_functions.function_group_functions_id AS function_group_functions_id,
		function_group_functions.function_group_id AS function_group_id,
		function_groups.function_group_name AS function_group_name,
		function_group_functions.function_id AS function_id,
		functions.function_name AS function_name,
		function_groups.not_for_replication AS not_for_replication,
		function_group_functions.deleted AS deleted

	FROM function_group_functions

	INNER JOIN function_groups ON function_groups.function_group_id = function_group_functions.function_group_id
	INNER JOIN functions ON functions.function_id = function_group_functions.function_id

	WHERE

	NOT function_group_functions.deleted
	;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `search_users` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `search_users`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_searchTerm	VARCHAR(255) CHARACTER SET utf8mb4;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_searchTerm		= fn_get_json_object(value_payload, '$.searchTerm');

	SELECT

		users.user_id							AS user_id,
		users.login								AS login,
		users.password							AS password,
		users.first_name						AS first_name,
		users.last_name							AS last_name,
		users.full_name							AS full_name,
		users.email								AS email,
		users.phone								AS phone,
		users.email_confirmed					AS email_confirmed,
		users.email_confirmation_code			AS email_confirmation_code,
		users.phone_confirmed					AS phone_confirmed,
		users.phone_confirmation_code			AS phone_confirmation_code,
		users.internal_id						AS internal_id,
		users.active							AS active,
		users.deleted							AS deleted,
		users.user_roles						AS user_roles,
		users.user_sites						AS user_sites,
		users.last_login						AS last_login,
		users.last_activity						AS last_activity,
		users.default_page						AS default_page,

		fn_get_user_role_names(users.user_roles)	AS user_role_names

	FROM users

	WHERE (
		login LIKE  CONCAT('%', value_searchTerm, '%')
		OR password LIKE  CONCAT('%', value_searchTerm, '%')
		OR first_name LIKE  CONCAT('%', value_searchTerm, '%')
		OR last_name LIKE  CONCAT('%', value_searchTerm, '%')
		OR full_name LIKE  CONCAT('%', value_searchTerm, '%')
		OR email LIKE  CONCAT('%', value_searchTerm, '%')
		OR phone LIKE  CONCAT('%', value_searchTerm, '%')
		OR email_confirmation_code LIKE  CONCAT('%', value_searchTerm, '%')
		OR phone_confirmation_code LIKE  CONCAT('%', value_searchTerm, '%')
		OR user_class LIKE  CONCAT('%', value_searchTerm, '%')
		OR user_roles LIKE  CONCAT('%', value_searchTerm, '%')
		OR fn_get_user_role_names(users.user_roles) LIKE  CONCAT('%', value_searchTerm, '%')
		OR default_page LIKE  CONCAT('%', value_searchTerm, '%')
	);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `search_user_roles` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `search_user_roles`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_searchTerm	VARCHAR(255) CHARACTER SET utf8mb4;

	DECLARE var_user_roles		VARCHAR(255);
	DECLARE var_user_role_level	INTEGER;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_searchTerm		= fn_get_json_object(value_payload, '$.searchTerm');

	-- First we have to determine the maximum role that the user can assign
	-- to another user.
	SELECT users.user_roles					INTO var_user_roles FROM users WHERE user_id = key_userId;
	SELECT MAX(user_roles.user_role_level)	INTO var_user_role_level FROM user_roles WHERE user_roles.user_role_id IN (REPLACE(REPLACE(var_user_roles, "[", ""), "]", ""));

	SELECT

		user_roles.user_role_id				AS user_role_id,
		user_roles.user_role_name			AS user_role_name,
		user_roles.user_role_level			AS user_role_level,
		user_roles.default_role				AS default_role,
		user_roles.deleted					AS deleted

	FROM user_roles

	WHERE NOT
		user_role_id = value_id
		AND NOT user_roles.user_role_level > @user_role_level
		AND NOT user_roles.deleted
		AND (
			user_roles.user_role_name LIKE  CONCAT('%', value_searchTerm, '%')
		);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `search_user_role_function_groups` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `search_user_role_function_groups`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_searchTerm	VARCHAR(255) CHARACTER SET utf8mb4;

	SET key_userId				= fn_get_json_varchar_d(var_Data, '$.user_id', '');
	SET key_language			= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query				= fn_get_json_object(var_Data, '$.query');
	SET value_payload			= fn_get_json_object(var_Data, '$.payload');

	SET value_searchTerm		= fn_get_json_object(value_payload, '$.searchTerm');

	SELECT

		user_role_function_groups.user_role_function_groups_id AS user_role_function_groups_id,
		user_role_function_groups.user_role_id AS user_role_id,
		user_roles.user_role_name AS user_role_name,
		user_role_function_groups.function_group_id AS function_group_id,
		function_groups.function_group_name AS function_group_name,
		user_role_function_groups.deleted AS deleted

	FROM user_role_function_groups

	INNER JOIN user_roles ON user_roles.user_role_id = user_role_function_groups.user_role_id
	INNER JOIN function_groups ON function_groups.function_group_id = user_role_function_groups.function_group_id

	WHERE NOT user_role_function_groups.deleted = true
	AND (
		user_role_id LIKE  CONCAT('%', value_searchTerm, '%')
		OR function_group_id LIKE  CONCAT('%', value_searchTerm, '%')
	);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_activity_log` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `set_activity_log`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId							INTEGER;
	DECLARE key_language						VARCHAR(255);

	DECLARE value_query							JSON;
	DECLARE value_payload						JSON;

	DECLARE value_activity_log_id				INT;
	DECLARE value_activity_log_date				DATETIME;
	DECLARE value_user_id						INT;
	DECLARE value_function						VARCHAR(50);
	DECLARE value_action						VARCHAR(50);
	DECLARE value_log_data						TEXT;
	DECLARE value_deleted						TINYINT(1);

	SET key_userId								= fn_get_json_int_d(var_Data, '$.user_id', 0);
	SET key_language							= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query								= fn_get_json_object(var_Data, '$.query');
	SET value_payload							= fn_get_json_object(var_Data, '$.payload');

	SET value_activity_log_id					= fn_get_json_int_d(value_payload, '$.activity_log_id', 0);
	SET value_activity_log_date					= fn_get_json_datetime_d(value_payload, '$.activity_log_date', CURRENT_TIMESTAMP);
	SET value_user_id							= fn_get_json_int_d(value_payload, '$.user_id', 0);
	SET value_function							= fn_get_json_varchar_d(value_payload, '$.function', '');
	SET value_action							= fn_get_json_varchar_d(value_payload, '$.action', '');
	SET value_log_data							= fn_get_json_longtext_d(value_payload, '$.log_data', '');
	SET value_deleted							= fn_get_json_boolean(value_payload, '$.deleted');

	IF value_activity_log_id = 0 THEN

		INSERT INTO `activity_log` (

			activity_log_date,
			user_id,
			function,
			action,
			log_data,
			deleted

		) VALUES (

			value_activity_log_date,
			value_user_id,
			value_function,
			value_action,
			value_log_data,
			value_deleted

		);

		SET value_activity_log_id = LAST_INSERT_ID();

	ELSE

		UPDATE `activity_log` SET

			activity_log_date = value_activity_log_date,
			user_id = value_user_id,
			function = value_function,
			action = value_action,
			log_data = value_log_data,
			deleted = value_deleted

		WHERE activity_log_id = value_activity_log_id;

	END If;

	-- To prevent the title of the tab and other data from being dropped from the
	-- user we need to return the full user object.
	SET var_Data = JSON_SET(var_Data, '$.query.id', value_activity_log_id);
	CALL get_activity_log(var_Data);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_functions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `set_functions`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId						INTEGER;
	DECLARE key_language					VARCHAR(255);

	DECLARE value_query						JSON;
	DECLARE value_payload					JSON;

	DECLARE value_function_id				INT;
	DECLARE value_function_name				VARCHAR(255);
	DECLARE value_public_function			TINYINT(1);
	DECLARE value_deleted					TINYINT(1);

	SET key_userId							= fn_get_json_int_d(var_Data, '$.user_id', 0);
	SET key_language						= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query							= fn_get_json_object(var_Data, '$.query');
	SET value_payload						= fn_get_json_object(var_Data, '$.payload');

	SET value_function_id					= fn_get_json_int_d(value_payload, '$.function_id', 0);
	SET value_function_name					= fn_get_json_varchar_d(value_payload, '$.function_name', '');
	SET value_public_function				= fn_get_json_boolean(value_payload, '$.public_function');
	SET value_deleted						= fn_get_json_boolean(value_payload, '$.deleted');

	IF value_function_id = 0 THEN

		INSERT INTO `functions` (

			function_name,
			public_function,
			deleted

		) VALUES (

			value_function_name,
			value_public_function,
			value_deleted

		);

		SET value_function_id = LAST_INSERT_ID();

	ELSE

		UPDATE `functions` SET

			function_name = value_function_name,
			public_function = value_public_function,
			deleted = value_deleted

		WHERE function_id = value_function_id;

	END If;

	-- To prevent the title of the tab and other data from being dropped from the
	-- user we need to return the full user object.
	SET var_Data = JSON_SET(var_Data, '$.query.id', value_function_id);
	CALL get_functions(var_Data);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_function_groups` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `set_function_groups`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);


	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_function_group_id			INT;
	DECLARE value_function_group_name		VARCHAR(50);
	DECLARE value_function_group_category	VARCHAR(50);
	DECLARE value_not_for_replication		TINYINT(1);
	DECLARE value_deleted					TINYINT(1);

	SET key_userId							= fn_get_json_int_d(var_Data, '$.user_id', 0);
	SET key_language						= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query							= fn_get_json_object(var_Data, '$.query');
	SET value_payload						= fn_get_json_object(var_Data, '$.payload');

	SET value_function_group_id				= fn_get_json_int_d(var_Data, '$.user_id', 0);
	SET value_function_group_name			= fn_get_json_varchar_d(var_Data, '$.device_id', '');
	SET value_function_group_category		= fn_get_json_varchar_d(var_Data, '$.device_id', '');
	SET value_not_for_replication			= fn_get_json_boolean(var_Data, '$.not_for_replication');
	SET value_deleted						= fn_get_json_boolean(var_Data, '$.deleted');

	IF value_function_group_id = 0 THEN

		INSERT INTO `function_groups` (

			function_group_name,
			function_group_category,
			not_for_replication,
			deleted

		) VALUES (

			value_function_group_name,
			value_function_group_category,
			value_not_for_replication,
			value_deleted

		);

		SET value_function_group_id = LAST_INSERT_ID();

	ELSE

		UPDATE `function_groups` SET

			function_group_name = value_function_group_name,
			function_group_category = value_function_group_category,
			not_for_replication = value_not_for_replication,
			deleted = value_deleted

		WHERE function_group_id = value_function_group_id;

	END If;

	-- To prevent the title of the tab and other data from being dropped from the
	-- user we need to return the full user object.
	SET var_Data = JSON_SET(var_Data, '$.query.id', value_function_group_id);
	CALL get_function_groups(var_Data);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_function_group_functions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `set_function_group_functions`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId							INTEGER;
	DECLARE key_language						VARCHAR(255);

	DECLARE value_query							JSON;
	DECLARE value_payload						JSON;

	DECLARE value_function_group_functions_id	INT;
	DECLARE value_function_group_id				INT;
	DECLARE value_function_id					INT;
	DECLARE value_deleted						TINYINT(1);

	SET key_userId								= fn_get_json_int_d(var_Data, '$.user_id', 0);
	SET key_language							= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query								= fn_get_json_object(var_Data, '$.query');
	SET value_payload							= fn_get_json_object(var_Data, '$.payload');

	SET value_function_group_functions_id		= fn_get_json_int_d(var_Data, '$.function_group_functions_id', 0);
	SET value_function_group_id					= fn_get_json_int_d(var_Data, '$.function_group_id', 0);
	SET value_function_id						= fn_get_json_int_d(var_Data, '$.function_id', 0);
	SET value_deleted							= fn_get_json_boolean(var_Data, '$.deleted');

	IF value_function_group_functions_id = 0 THEN

		INSERT INTO `function_group_functions` (

			function_group_id,
			function_id,
			deleted

		) VALUES (

			value_function_group_id,
			value_function_id,
			value_deleted

		);

		SET value_function_group_functions_id = LAST_INSERT_ID();

	ELSE

		UPDATE `function_group_functions` SET

			function_group_id = value_function_group_id,
			function_id = value_function_id,
			deleted = value_deleted

		WHERE function_group_functions_id = value_function_group_functions_id;

	END If;

	-- To prevent the title of the tab and other data from being dropped from the
	-- user we need to return the full user object.
	SET var_Data = JSON_SET(var_Data, '$.query.id', value_function_group_functions_id);
	CALL get_function_group_functions(var_Data);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_security_functiongroup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `set_security_functiongroup`(var_Data LONGTEXT CHARACTER SET utf8mb4, var_name VARCHAR(50), var_category VARCHAR(50))
BEGIN

	INSERT INTO `function_groups` (function_group_name, function_group_category, replication_id) VALUES (var_name, var_category)
	ON DUPLICATE KEY UPDATE
	deleted = false;

	UPDATE function_group_functions SET deleted = true WHERE function_group_id IN (SELECT function_group_id FROM function_groups WHERE function_group_name = var_name AND function_group_category = var_category);

	SELECT function_group_id FROM function_groups WHERE function_group_name = var_name AND function_group_category = var_category;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_security_functiongroupfunction` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `set_security_functiongroupfunction`(var_Data LONGTEXT CHARACTER SET utf8mb4, var_group_id INT, var_name VARCHAR(255))
BEGIN

	DECLARE var_function_id INT;

	INSERT INTO `functions` (function_name) VALUES (var_name)
	ON DUPLICATE KEY UPDATE
	deleted = false;

	SET var_function_id = (SELECT function_id FROM `functions` WHERE function_name = var_name);

	INSERT INTO `function_group_functions` (function_group_id, function_id) VALUES (var_group_id, var_function_id)
	ON DUPLICATE KEY UPDATE
	deleted = false;

	SELECT ROW_COUNT();

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_security_functiongroupfunctions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `set_security_functiongroupfunctions`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId						INTEGER;
	DECLARE key_language					VARCHAR(255);

	DECLARE value_query						JSON;
	DECLARE value_payload					JSON;

	DECLARE var_functionId					INTEGER;

	SET key_userId							= fn_get_json_int_d(var_Data, '$.user_id', 0);
	SET key_language						= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query							= fn_get_json_object(var_Data, '$.query');
	SET value_payload						= fn_get_json_object(var_Data, '$.payload');

    WHILE value_payload IS NOT NULL DO

		-- Use the utility Stored Procedure to extract the JSON objects from the Array
		CALL _util_getJSONObject(value_payload, @functionGroupData, value_payload);

        IF @functionGroupData IS NOT NULL THEN

			SET @functionGroupId		= fn_get_json_int_d(@functionGroupData, '$.function_group_id', 0);
			SET @functionGroupName		= fn_get_json_varchar_d(@functionGroupData, '$.function_group_name', '');
			SET @functionGroupCategory	= fn_get_json_varchar_d(@functionGroupData, '$.function_group_category', '');
			SET @notForReplication		= fn_get_json_boolean(@functionGroupData, '$.not_for_replication');
			SET @functionData			= fn_get_json_longtext_d(@functionGroupData, '$.functions', '[]');

			IF @functionGroupId = 0 THEN
				INSERT INTO function_groups (function_group_name, function_group_category, not_for_replication) VALUES (@functionGroupName, @functionGroupCategory, @notForReplication);
				SET @functionGroupId = LAST_INSERT_ID();
			ELSE
				UPDATE function_groups SET function_group_name = @functionGroupName, function_group_category = @functionGroupCategory, not_for_replication = @notForReplication, deleted = false WHERE function_group_id = @functionGroupId;
			END IF;

			UPDATE function_group_functions SET deleted = true WHERE function_group_id = @functionGroupId;

			SET @separator2 = ',';
			SET @separator2Length = CHAR_LENGTH(@separator2);
			SET @functionData = REPLACE(REPLACE(@functionData, '[', ''), ']', '');

			WHILE @functionData != '' > 0 DO

				SET @functionName = SUBSTRING_INDEX(@functionData, @separator2, 1);
				SET var_functionId = (SELECT function_id FROM functions WHERE function_name = TRIM(REPLACE(@functionName, '"', '')));

				IF var_functionId IS NULL THEN
					INSERT INTO functions(function_name) VALUES (TRIM(REPLACE(@functionName, '"', '')));
					SET var_functionId = LAST_INSERT_ID();
				ELSE
					UPDATE functions SET deleted = false WHERE function_id = var_functionId;
				END IF;

  				INSERT INTO function_group_functions(function_group_id, function_id) VALUES (@functionGroupId, var_functionId)
				ON DUPLICATE KEY UPDATE deleted = false;

				SET @functionData = SUBSTRING(@functionData, CHAR_LENGTH(@functionName) + @separator2Length + 1);

			END WHILE;

		END IF;

 	END WHILE;

	SELECT @functionGroupId AS function_group_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_security_userrolefunctiongroup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `set_security_userrolefunctiongroup`(user_role_id INT, function_group_ids TEXT)
BEGIN

	SET @separator = ',';
	SET @separatorLength = CHAR_LENGTH(@separator);

	WHILE function_group_ids != '' > 0 DO

		SET @currentValue = SUBSTRING_INDEX(function_group_ids, @separator, 1);

		INSERT INTO user_role_function_groups(user_role_id, function_group_id) VALUES (user_role_id, @currentValue);

		SET function_group_ids = SUBSTRING(function_group_ids, CHAR_LENGTH(@currentValue) + @separatorLength + 1);

	END WHILE;

	SELECT ROW_COUNT();

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_security_userrolefunctiongroups` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `set_security_userrolefunctiongroups`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId						INTEGER;
	DECLARE key_language					VARCHAR(255);

	DECLARE value_query						JSON;
	DECLARE value_payload					JSON;

	DECLARE var_functionId					INTEGER;

	SET key_userId							= fn_get_json_int_d(var_Data, '$.user_id', 0);
	SET key_language						= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query							= fn_get_json_object(var_Data, '$.query');
	SET value_payload						= fn_get_json_object(var_Data, '$.payload');

	UPDATE user_role_function_groups SET deleted = true WHERE NOT deleted;

    WHILE value_payload IS NOT NULL DO

		CALL _util_getJSONObject(value_payload, @functionGroupData, value_payload);

        IF @functionGroupData IS NOT NULL THEN

			SET @functionGroupId = COALESCE(json_unquote(json_extract(@functionGroupData, '$.function_group_id')), 0);
			SET @userRoleData = COALESCE(json_unquote(json_extract(@functionGroupData, '$.user_roles')), '[]');

			SET @separator2 = ',';
			SET @separator2Length = CHAR_LENGTH(@separator2);
			SET @userRoleData = REPLACE(REPLACE(@userRoleData, '[', ''), ']', '');

			WHILE @userRoleData != '' > 0 DO

				SET @userRoleId = SUBSTRING_INDEX(@userRoleData, @separator2, 1);

 				INSERT INTO user_role_function_groups(user_role_id, function_group_id) VALUES (@userRoleId, @functionGroupId)
                ON DUPLICATE KEY UPDATE deleted = false;

				SET @userRoleData = SUBSTRING(@userRoleData, CHAR_LENGTH(@userRoleId) + @separator2Length + 1);

			END WHILE;

		END IF;

 	END WHILE;

	SELECT ROW_COUNT();

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_users` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `set_users`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE key_activityLog					TINYINT(1);
	DECLARE key_activityLogFunction			VARCHAR(255);
	DECLARE value_activity_log_id			BIGINT;

	DECLARE value_user_id					INT;
	DECLARE value_login						VARCHAR(50);
	DECLARE value_password					VARCHAR(255);
	DECLARE value_first_name				VARCHAR(50) CHARACTER SET utf8mb4;
	DECLARE value_last_name					VARCHAR(50) CHARACTER SET utf8mb4;
	DECLARE value_email						VARCHAR(255);
	DECLARE value_phone						VARCHAR(50);
	DECLARE value_email_confirmed			TINYINT(1);
	DECLARE value_email_confirmation_code	VARCHAR(50);
	DECLARE value_phone_confirmed			TINYINT(1);
	DECLARE value_phone_confirmation_code	VARCHAR(50);
	DECLARE value_internal_id				VARCHAR(20);
	DECLARE value_active					TINYINT(1);
	DECLARE value_deleted					TINYINT(1);
	DECLARE value_user_class				VARCHAR(50);
	DECLARE value_user_roles				VARCHAR(255);
	DECLARE value_user_sites				TEXT;
	DECLARE value_user_cinemas				TEXT;
	DECLARE value_user_cinema				VARCHAR(255);
	DECLARE value_default_page				VARCHAR(45);

	SET key_userId							= fn_get_json_int_d(var_Data, '$.user_id', 0);
	SET key_language						= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query							= fn_get_json_object(var_Data, '$.query');
	SET value_payload						= fn_get_json_object(var_Data, '$.payload');

	SET value_user_id						= fn_get_json_int_d(value_payload, '$.user_id', 0);
	SET value_login							= fn_get_json_varchar_d(value_payload, '$.login', '');
	SET value_password						= fn_get_json_varchar_d(value_payload, '$.password', '');
	SET value_first_name					= fn_get_json_varchar_d(value_payload, '$.first_name', '');
	SET value_last_name						= fn_get_json_varchar_d(value_payload, '$.last_name', '');
	SET value_email							= fn_get_json_varchar_d(value_payload, '$.email', '');
	SET value_phone							= fn_get_json_varchar_d(value_payload, '$.phone', '');
	SET value_email_confirmed				= fn_get_json_boolean(value_payload, '$.email_confirmed');
	SET value_email_confirmation_code		= fn_get_json_varchar_d(value_payload, '$.email_confirmation_code', '');
	SET value_phone_confirmed				= fn_get_json_boolean(value_payload, '$.phone_confirmed');
	SET value_phone_confirmation_code		= fn_get_json_varchar_d(value_payload, '$.phone_confirmation_code', '');
	SET value_internal_id					= fn_get_json_varchar(value_payload, '$.internal_id');
	SET value_active						= fn_get_json_boolean(value_payload, '$.active');
	SET value_deleted						= fn_get_json_boolean(value_payload, '$.deleted');
	SET value_user_roles					= fn_get_json_varchar_d(value_payload, '$.user_roles', '');
	SET value_default_page					= fn_get_json_varchar_d(value_payload, '$.default_page', '/index');

	-- Flags to indicate if we need to be logging this transaction to the activity log
	SET key_activityLog						= fn_get_json_boolean_d(var_Data, '$.activity_log', false);
	SET key_activityLogFunction				= fn_get_json_varchar(var_Data, '$.activity_log_function');

	-- If this activity needs to be logged we pass the information directly
	-- to the activity log function to save it to the logs.
	IF key_activityLog THEN
		SET value_activity_log_id = fn_add_activity_log(key_activityLogFunction, 'set_users', var_Data);
	END IF;

	IF value_user_id = 0 THEN

		INSERT INTO `users` (

			login,
			`password`,
			first_name,
			last_name,
			full_name,
			email,
			phone,
			email_confirmed,
			email_confirmation_code,
			phone_confirmed,
			phone_confirmation_code,
			internal_id,
			active,
			deleted,
			default_page,
			user_roles

		) VALUES (

			value_login,
			value_password,
			value_first_name,
			value_last_name,
			CONCAT(value_first_name, ' ', value_last_name),
			value_email,
			value_phone,
			value_email_confirmed,
			value_email_confirmation_code,
			value_phone_confirmed,
			value_phone_confirmation_code,
			value_internal_id,
			value_active,
			value_deleted,
			value_default_page,
			value_user_roles

		);

		SET value_user_id = LAST_INSERT_ID();

	ELSE

		UPDATE `users` SET

			login = value_login,
			first_name = value_first_name,
			last_name = value_last_name,
			full_name = CONCAT(value_first_name, ' ', value_last_name),
			email = value_email,
			phone = value_phone,
			email_confirmed = value_email_confirmed,
			email_confirmation_code = value_email_confirmation_code,
			phone_confirmed = value_phone_confirmed,
			phone_confirmation_code = value_phone_confirmation_code,
			internal_id = value_internal_id,
			active = value_active,
			deleted = value_deleted,
			user_roles = value_user_roles,
			default_page = value_default_page

		WHERE user_id = value_user_id;

		IF value_password <> '' THEN
			UPDATE users SET `password` = value_password WHERE user_id = value_user_id;
		END IF;

	END IF;

	-- To prevent the title of the tab and other data from being dropped from the
	-- user we need to return the full user object.
	SET var_Data = JSON_SET(var_Data, '$.query.id', value_user_id);
	CALL get_users(var_Data);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_user_roles` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `set_user_roles`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId			INTEGER;
	DECLARE key_language		VARCHAR(255);

	DECLARE value_query			JSON;
	DECLARE value_payload		JSON;

	DECLARE value_user_role_id				INTEGER;
	DECLARE value_user_role_name			VARCHAR(50);
	DECLARE value_user_role_level			INTEGER;
	DECLARE value_default_role				TINYINT(1);
	DECLARE value_deleted					TINYINT(1);

	DECLARE var_user_roles					VARCHAR(255);
	DECLARE var_user_role_level				INTEGER;

	SET key_userId							= fn_get_json_int_d(var_Data, '$.user_id', 0);
	SET key_language						= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query							= fn_get_json_object(var_Data, '$.query');
	SET value_payload						= fn_get_json_object(var_Data, '$.payload');

	SET value_user_role_id					= fn_get_json_int_d(value_payload, '$.user_role_id', 0);
	SET value_user_role_name				= fn_get_json_varchar_d(value_payload, '$.user_role_name', '');
	SET value_user_role_level				= fn_get_json_int_d(value_payload, '$.user_role_level', 0);
	SET value_default_role					= fn_get_json_boolean(value_payload, '$.default_role');
	SET value_deleted						= fn_get_json_boolean(value_payload, '$.deleted');

	-- First we have to determine the maximum role that the user can assign
	-- to another user.
	SELECT users.user_roles					INTO var_user_roles FROM users WHERE user_id = key_userId;
	SELECT MAX(user_roles.user_role_level)	INTO var_user_role_level FROM user_roles WHERE user_roles.user_role_id IN (REPLACE(REPLACE(var_user_roles, "[", ""), "]", ""));

	-- If the user is trying to assign a role level greater than their own, then
	-- we prevent them from doing it.
	IF value_user_role_level > var_user_role_level THEN
		SET value_user_role_level = var_user_role_level;
	END IF;

	IF value_user_role_id = 0 THEN

		INSERT INTO `user_roles` (

			user_role_name,
			user_role_level,
			default_role,
			deleted

		) VALUES (

			value_user_role_name,
			value_user_role_level,
			value_default_role,
			value_deleted

		);

		SET value_user_role_id = LAST_INSERT_ID();

	ELSE

		UPDATE `user_roles` SET

			user_role_name = value_user_role_name,
			user_role_level = value_user_role_level,
			default_role = value_default_role,
			deleted = value_deleted

		WHERE user_role_id = value_user_role_id;

	END IF;

	-- To prevent the title of the tab and other data from being dropped from the
	-- user we need to return the full user object.
	SET var_Data = JSON_SET(var_Data, '$.query.id', value_user_role_id);
	CALL get_user_roles(var_Data);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_user_role_function_groups` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `set_user_role_function_groups`(var_Data LONGTEXT CHARACTER SET utf8mb4)
BEGIN

	DECLARE key_userId						INTEGER;
	DECLARE key_language					VARCHAR(255);

	DECLARE value_query						JSON;
	DECLARE value_payload					JSON;

	DECLARE value_user_role_function_groups_id	INT;
	DECLARE value_user_role_id				VARCHAR(45);
	DECLARE value_function_group_id			VARCHAR(45);
	DECLARE value_deleted					TINYINT(1);

	SET key_userId							= fn_get_json_int_d(var_Data, '$.user_id', 0);
	SET key_language						= fn_get_json_varchar_d(var_Data, '$.language', '');

	SET value_query							= fn_get_json_object(var_Data, '$.query');
	SET value_payload						= fn_get_json_object(var_Data, '$.payload');


	SET value_user_role_function_groups_id	= fn_get_json_int_d(var_Data, '$.user_role_function_groups_id', 0);
	SET value_user_role_id					= fn_get_json_int(var_Data, '$.user_role_id');
	SET value_function_group_id				= fn_get_json_int(var_Data, '$.function_group_id');
	SET value_deleted						= fn_get_json_boolean(var_Data, '$.deleted');

	IF value_user_role_function_groups_id = 0 THEN

		INSERT INTO `user_role_function_groups` (

			user_role_id,
			function_group_id,
			deleted

		) VALUES (

			value_user_role_id,
			value_function_group_id,
			value_deleted

		);

		SET value_user_role_function_groups_id = LAST_INSERT_ID();

	ELSE

		UPDATE `user_role_function_groups` SET

			user_role_id = value_user_role_id,
			function_group_id = value_function_group_id,
			deleted = value_deleted

		WHERE user_role_function_groups_id = value_user_role_function_groups_id;

	END If;

	-- To prevent the title of the tab and other data from being dropped from the
	-- user we need to return the full user object.
	SET var_Data = JSON_SET(var_Data, '$.query.id', value_user_role_function_groups_id);
	CALL get_user_role_function_groups(var_Data);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-09-28  0:48:40
