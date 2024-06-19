CREATE DATABASE  IF NOT EXISTS `idms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `idms`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: idms
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__efmigrationshistory`
--

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT INTO `__efmigrationshistory` VALUES ('20240604113736_NewUser','8.0.6'),('20240605120647_update_script_toadd_staff_admin','8.0.6');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetroleclaims`
--

DROP TABLE IF EXISTS `aspnetroleclaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetroleclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RoleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetRoleClaims_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetroleclaims`
--

LOCK TABLES `aspnetroleclaims` WRITE;
/*!40000 ALTER TABLE `aspnetroleclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetroleclaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetroles`
--

DROP TABLE IF EXISTS `aspnetroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetroles` (
  `Id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `RoleNameIndex` (`NormalizedName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetroles`
--

LOCK TABLES `aspnetroles` WRITE;
/*!40000 ALTER TABLE `aspnetroles` DISABLE KEYS */;
INSERT INTO `aspnetroles` VALUES ('36b7c12a-b5e1-4621-aa64-7faa81c89b98','Admin','Admin','1'),('3d069376-cd8f-433d-89b5-6fc3dae2fc73','Customer','Customer','3'),('702e6dc2-02ac-465c-9288-a2c277a5284b','User','User','2'),('8a0ab3c0-481d-4fc6-86d4-55664c257fcd','HR','HR','3');
/*!40000 ALTER TABLE `aspnetroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetuserclaims`
--

DROP TABLE IF EXISTS `aspnetuserclaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetuserclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetUserClaims_UserId` (`UserId`),
  CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetuserclaims`
--

LOCK TABLES `aspnetuserclaims` WRITE;
/*!40000 ALTER TABLE `aspnetuserclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetuserclaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetuserroles`
--

DROP TABLE IF EXISTS `aspnetuserroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetuserroles` (
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `RoleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`UserId`,`RoleId`),
  KEY `IX_AspNetUserRoles_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetuserroles`
--

LOCK TABLES `aspnetuserroles` WRITE;
/*!40000 ALTER TABLE `aspnetuserroles` DISABLE KEYS */;
INSERT INTO `aspnetuserroles` VALUES ('49ad4e8a-31b9-451e-9c3d-5d341c2a227a','36b7c12a-b5e1-4621-aa64-7faa81c89b98'),('b0473331-9b16-4757-aaa3-cc7f95b7e6bd','36b7c12a-b5e1-4621-aa64-7faa81c89b98'),('998a13a5-06ed-4c84-bd39-b3e55238c538','3d069376-cd8f-433d-89b5-6fc3dae2fc73');
/*!40000 ALTER TABLE `aspnetuserroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetusers`
--

DROP TABLE IF EXISTS `aspnetusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetusers` (
  `Id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CorporateID` int NOT NULL,
  `isStaff` tinyint(1) NOT NULL,
  `UserName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedUserName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Email` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedEmail` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `SecurityStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PhoneNumber` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `LockoutEnabled` tinyint(1) NOT NULL,
  `AccessFailedCount` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  KEY `EmailIndex` (`NormalizedEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetusers`
--

LOCK TABLES `aspnetusers` WRITE;
/*!40000 ALTER TABLE `aspnetusers` DISABLE KEYS */;
INSERT INTO `aspnetusers` VALUES ('49ad4e8a-31b9-451e-9c3d-5d341c2a227a',0,1,'bhang2k','BHANG2K','bhang2k@gmail.com','BHANG2K@GMAIL.COM',1,'AQAAAAIAAYagAAAAEO7iuxB17LVp6d3o/5npkiIdCwh4ZNNmx8AcINd1FjaFhcpLfs3QbzayqyWhXbP9QQ==','MDLE3M3YDLYIHH76RU2GHRPD7QM3TRYR','f6ac8942-5ab9-4fad-bc42-9fe860e1021c',NULL,0,0,NULL,1,0),('998a13a5-06ed-4c84-bd39-b3e55238c538',0,0,'johnnyyes2022@gmail.com','JOHNNYYES2022@GMAIL.COM','johnnyyes2022@gmail.com','JOHNNYYES2022@GMAIL.COM',1,'AQAAAAIAAYagAAAAENsLDAnN9PzSzRh0gU700CSy+eQg51VADfIVFgbkvY5J9s2vUrJ0upbhlYbTnV/slw==','7FGR4XUQYJGANLRPGLFC3VNXFKYH3X6C','341459a6-57c8-48b7-a55c-3a5ae988ab75',NULL,0,0,NULL,1,0),('b0473331-9b16-4757-aaa3-cc7f95b7e6bd',0,1,'admin','admin','admin@dwms.com','admin@dwms.com',1,'AQAAAAIAAYagAAAAEAv50U8yR/yGI1IWULZfG4weRGaDIfJHuAqbjhK5CTQJB2FxD6lkxDXsgC3ZMK4fyw==','','1',NULL,0,0,NULL,0,0);
/*!40000 ALTER TABLE `aspnetusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetusertokens`
--

DROP TABLE IF EXISTS `aspnetusertokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetusertokens` (
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LoginProvider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`UserId`,`LoginProvider`,`Name`),
  CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetusertokens`
--

LOCK TABLES `aspnetusertokens` WRITE;
/*!40000 ALTER TABLE `aspnetusertokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetusertokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargo`
--

DROP TABLE IF EXISTS `cargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargo` (
  `guid` varchar(36) NOT NULL,
  `name` varchar(120) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `alias` varchar(120) DEFAULT NULL,
  `cass_no` varchar(20) DEFAULT NULL,
  `un_no` varchar(20) DEFAULT NULL,
  `flash_point` varchar(50) DEFAULT NULL,
  `hazard_level` varchar(50) DEFAULT NULL,
  `cleanning_category` varchar(15) DEFAULT NULL,
  `sds` varchar(20) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo`
--

LOCK TABLES `cargo` WRITE;
/*!40000 ALTER TABLE `cargo` DISABLE KEYS */;
/*!40000 ALTER TABLE `cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cleaning_group`
--

DROP TABLE IF EXISTS `cleaning_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cleaning_group` (
  `guid` varchar(36) NOT NULL,
  `group_name` varchar(45) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `category` varchar(45) DEFAULT NULL,
  `minimum_cost` float DEFAULT NULL,
  `maximum_cost` float DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cleaning_group`
--

LOCK TABLES `cleaning_group` WRITE;
/*!40000 ALTER TABLE `cleaning_group` DISABLE KEYS */;
INSERT INTO `cleaning_group` VALUES ('8b113d1540ed4cd89ae0a3e48db8c3fe','group1','group1',NULL,105,205,NULL,1718591884,'anonymous user',NULL,'anonymous user','remark');
/*!40000 ALTER TABLE `cleaning_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cleaning_group_procedure`
--

DROP TABLE IF EXISTS `cleaning_group_procedure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cleaning_group_procedure` (
  `guid` varchar(36) NOT NULL,
  `cleaning_group_guid` varchar(36) DEFAULT NULL,
  `cleaning_procedure_guid` varchar(36) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cleaning_group_procedure`
--

LOCK TABLES `cleaning_group_procedure` WRITE;
/*!40000 ALTER TABLE `cleaning_group_procedure` DISABLE KEYS */;
INSERT INTO `cleaning_group_procedure` VALUES ('0b416fa4fb3c411181df7e938c355ac2','8b113d1540ed4cd89ae0a3e48db8c3fe','cd504c3ef7b14983bd22190ab5a61589',NULL,1718591884,'anonymous user',NULL,'anonymous user'),('26eeb13a6dad405ba995f2be4c6b6862','8b113d1540ed4cd89ae0a3e48db8c3fe','f6f8c9e154ea48188cdc696c3667ea4b',NULL,1718591884,'anonymous user',NULL,'anonymous user');
/*!40000 ALTER TABLE `cleaning_group_procedure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cleaning_procedure`
--

DROP TABLE IF EXISTS `cleaning_procedure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cleaning_procedure` (
  `guid` varchar(36) NOT NULL,
  `procedure_name` varchar(45) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `clean_group_guid` varchar(36) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cleaning_procedure`
--

LOCK TABLES `cleaning_procedure` WRITE;
/*!40000 ALTER TABLE `cleaning_procedure` DISABLE KEYS */;
INSERT INTO `cleaning_procedure` VALUES ('82a333ea04244ef6b68f9d18905135a7','procedurename1','procedure1',5,'',1718288209,1718282813,'anonymous user',1718288209,'anonymous user'),('cd504c3ef7b14983bd22190ab5a61589','procedurename1','proc',3,'',NULL,1718282869,'anonymous user',1718287771,'anonymous user'),('f6f8c9e154ea48188cdc696c3667ea4b','procedurename112345','proc12345',3,'',1718288209,1718287968,'anonymous user',1718288209,'anonymous user');
/*!40000 ALTER TABLE `cleaning_procedure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cleaning_procedure_steps`
--

DROP TABLE IF EXISTS `cleaning_procedure_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cleaning_procedure_steps` (
  `guid` varchar(36) NOT NULL,
  `cleaning_procedure_guid` varchar(36) DEFAULT NULL,
  `cleaning_step_guid` varchar(36) DEFAULT NULL,
  `duration` int DEFAULT '0',
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cleaning_procedure_steps`
--

LOCK TABLES `cleaning_procedure_steps` WRITE;
/*!40000 ALTER TABLE `cleaning_procedure_steps` DISABLE KEYS */;
INSERT INTO `cleaning_procedure_steps` VALUES ('08e007fc465341d4ac0ec0f1cb18b94d','cd504c3ef7b14983bd22190ab5a61589','177f84705d244e09a77ff61aeae9e1b8',5,20240613140931,1718287735,'anonymous user',20240613140931,'anonymous user'),('0d4de6d3fd33423d81b089165b3fc00c','f6f8c9e154ea48188cdc696c3667ea4b','44486b3067f24ba492ba9b654cef47ba',2,NULL,1718287968,'anonymous user',NULL,'anonymous user'),('234e062692634900bf573f92c43bf328','cd504c3ef7b14983bd22190ab5a61589','177f84705d244e09a77ff61aeae9e1b8',5,NULL,1718287771,'anonymous user',NULL,'anonymous user'),('3d659d32044b4ee5bb0791c18d976afc','cd504c3ef7b14983bd22190ab5a61589','44486b3067f24ba492ba9b654cef47ba',2,20240613140805,1718287439,'anonymous user',20240613140805,'anonymous user'),('6c6826e4d2be4c009d004da801ea8a03','cd504c3ef7b14983bd22190ab5a61589','177f84705d244e09a77ff61aeae9e1b8',2,20240613140805,1718282869,'anonymous user',20240613140805,'anonymous user'),('7a4df52212a2465e9f2a777fb14ec3be','cd504c3ef7b14983bd22190ab5a61589','44486b3067f24ba492ba9b654cef47ba',2,20240613140805,1718287610,'anonymous user',20240613140805,'anonymous user'),('9033a1aa8e4b4d0b860d868d4a4e8357','cd504c3ef7b14983bd22190ab5a61589','177f84705d244e09a77ff61aeae9e1b8',5,20240613140805,1718287610,'anonymous user',20240613140805,'anonymous user'),('a525b7a6fe794be7acd49e0f8f1d8f6a','cd504c3ef7b14983bd22190ab5a61589','177f84705d244e09a77ff61aeae9e1b8',5,20240613140902,1718287682,'anonymous user',20240613140902,'anonymous user'),('a5e1e05fb48b403290820ed2a0ad690c','cd504c3ef7b14983bd22190ab5a61589','44486b3067f24ba492ba9b654cef47ba',2,20240613140805,1718282869,'anonymous user',20240613140805,'anonymous user'),('c9d9b9d03993457a9e36d1c102fe3df6','cd504c3ef7b14983bd22190ab5a61589','44486b3067f24ba492ba9b654cef47ba',2,NULL,1718287771,'anonymous user',NULL,'anonymous user'),('d1313bcf17264050b0721013e1cdb939','82a333ea04244ef6b68f9d18905135a7','44486b3067f24ba492ba9b654cef47ba',2,NULL,1718282813,'anonymous user',NULL,'anonymous user'),('e0e5570e5c06486aa48ee0379870bbbb','82a333ea04244ef6b68f9d18905135a7','177f84705d244e09a77ff61aeae9e1b8',2,NULL,1718282813,'anonymous user',NULL,'anonymous user'),('e1808ce6c5a644a98fc7594c7b429c8e','f6f8c9e154ea48188cdc696c3667ea4b','177f84705d244e09a77ff61aeae9e1b8',5,NULL,1718287968,'anonymous user',NULL,'anonymous user'),('e4d52e3787324a0a94e98fb368878085','cd504c3ef7b14983bd22190ab5a61589','44486b3067f24ba492ba9b654cef47ba',2,20240613140931,1718287735,'anonymous user',20240613140931,'anonymous user'),('eabe022502b64e0790d341de6c1ca801','cd504c3ef7b14983bd22190ab5a61589','44486b3067f24ba492ba9b654cef47ba',2,20240613140902,1718287682,'anonymous user',20240613140902,'anonymous user');
/*!40000 ALTER TABLE `cleaning_procedure_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cleaning_steps`
--

DROP TABLE IF EXISTS `cleaning_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cleaning_steps` (
  `guid` varchar(36) NOT NULL,
  `step_name` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`),
  UNIQUE KEY `step_name_UNIQUE` (`step_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cleaning_steps`
--

LOCK TABLES `cleaning_steps` WRITE;
/*!40000 ALTER TABLE `cleaning_steps` DISABLE KEYS */;
/*!40000 ALTER TABLE `cleaning_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `code_values`
--

DROP TABLE IF EXISTS `code_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `code_values` (
  `guid` varchar(36) NOT NULL,
  `description` varchar(150) NOT NULL,
  `code_val_type` varchar(20) NOT NULL,
  `code_val` varchar(15) NOT NULL,
  `child_code` varchar(15) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `code_val_type` (`code_val_type`,`code_val`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code_values`
--

LOCK TABLES `code_values` WRITE;
/*!40000 ALTER TABLE `code_values` DISABLE KEYS */;
INSERT INTO `code_values` VALUES ('1','Yes','YES_NO','Y',NULL,NULL,NULL,NULL,NULL,NULL),('10','Easy','CLEANING_CATEGORY','EASY',NULL,NULL,NULL,NULL,NULL,NULL),('11','Standard','CLEANING_CATEGORY','STANDARD',NULL,NULL,NULL,NULL,NULL,NULL),('12','Difficult','CLEANING_CATEGORY','DIFFICULT',NULL,NULL,NULL,NULL,NULL,NULL),('13','Special','CLEANING_CATEGORY','SPECIAL',NULL,NULL,NULL,NULL,NULL,NULL),('14','Owner','CUSTOMER_TYPE','OWNER',NULL,NULL,NULL,NULL,NULL,NULL),('15','Lessor','CUSTOMER_TYPE','LESSOR',NULL,NULL,NULL,NULL,NULL,NULL),('16','Sgd','CURRENCY','SGD',NULL,NULL,NULL,NULL,NULL,NULL),('17','Usd','CURRENCY','USD',NULL,NULL,NULL,NULL,NULL,NULL),('18','Repair','REPAIR_OPTION','REPAIR',NULL,NULL,NULL,NULL,NULL,NULL),('19','No Repair','REPAIR_OPTION','NO_REPAIR',NULL,NULL,NULL,NULL,NULL,NULL),('2','No','YES_NO','N',NULL,NULL,NULL,NULL,NULL,NULL),('20','Offhire','REPAIR_OPTION','OFFHIRE',NULL,NULL,NULL,NULL,NULL,NULL),('3','Unknown','CLEAN_STATUS','UNKNOWN',NULL,NULL,NULL,NULL,NULL,NULL),('4','Clean','CLEAN_STATUS','CLEAN',NULL,NULL,NULL,NULL,NULL,NULL),('5','Dirty','CLEAN_STATUS','DIRTY',NULL,NULL,NULL,NULL,NULL,NULL),('6','Pending','SO_STATUS','PENDING',NULL,NULL,NULL,NULL,NULL,NULL),('7','Complete','SO_STATUS','COMPLETE',NULL,NULL,NULL,NULL,NULL,NULL),('8','Canceled','SO_STATUS','CANCELED',NULL,NULL,NULL,NULL,NULL,NULL),('9','Dirty','SO_STATUS','PROSESSING',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `code_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_company`
--

DROP TABLE IF EXISTS `customer_company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_company` (
  `guid` varchar(36) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `alias` varchar(100) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `postal` varchar(20) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `fax` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `website` varchar(45) DEFAULT NULL,
  `currency` varchar(36) DEFAULT NULL,
  `tariff_depot_cost_guid` varchar(36) DEFAULT NULL,
  `effective_dt` bigint DEFAULT NULL,
  `agreement_due_dt` bigint DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `create_dt` bigint unsigned DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_company`
--

LOCK TABLES `customer_company` WRITE;
/*!40000 ALTER TABLE `customer_company` DISABLE KEYS */;
INSERT INTO `customer_company` VALUES ('5d8f899e2e5011ef91a300ff079339a5','Tech Innovations Ltd.','TIL','A leading technology solutions provider','TechInnov_Alias','OWNER','123 Tech Park','Suite 400','San Francisco','USA','94107','+1-800-555-0100','+1-800-555-0200','info@techinnov.com','https://www.techinnov.com','USD','5d8f8a9d2e5011ef91a300ff079339a5',1704038400,1735660800,NULL,1718810817,1701360000,'admin','admin'),('5d8fa01e2e5011ef91a300ff079339a5','Global Trade Corp.','GTC','International trading company specializing in raw materials','GlobalTrade_Alias','OWNER','456 Market St','Floor 5','New York','USA','10005','+1-800-555-0300','+1-800-555-0400','contact@globaltrade.com','https://www.globaltrade.com','USD','5d8fa0862e5011ef91a300ff079339a5',1682870400,1714492800,NULL,1718810817,1680278400,'admin','admin'),('5d8fa4f02e5011ef91a300ff079339a5','Eco Solutions Inc.','ESI','Sustainable energy solutions provider','EcoSolutions_Alias','OWNER','789 Green Way','Building 2','Austin','USA','73301','+1-800-555-0500','+1-800-555-0600','support@ecosolutions.com','https://www.ecosolutions.com','USD','5d8fa5422e5011ef91a300ff079339a5',1693497600,1725120000,NULL,1718810817,1690819200,'admin','admin'),('5d8fa7822e5011ef91a300ff079339a5','MediCare Health Ltd.','MCH','Provider of healthcare and medical services','MediCare_Alias','OWNER','123 Wellness Blvd','Room 101','Chicago','USA','60601','+1-800-555-0700','+1-800-555-0800','info@medicare.com','https://www.medicare.com','USD','5d8fa7cc2e5011ef91a300ff079339a5',1709222400,1740758400,NULL,1718810817,1675180800,'admin','admin'),('5d8faa9d2e5011ef91a300ff079339a5','NextGen Automotive','NGA','Manufacturer of electric vehicles and components','NextGenAuto_Alias','OWNER','456 Drive St','Suite 202','Detroit','USA','48201','+1-800-555-0900','+1-800-555-1000','sales@nextgenauto.com','https://www.nextgenauto.com','USD','5d8faafb2e5011ef91a300ff079339a5',1688140800,1719763200,NULL,1718810817,1685548800,'admin','admin');
/*!40000 ALTER TABLE `customer_company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_company_contact_person`
--

DROP TABLE IF EXISTS `customer_company_contact_person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_company_contact_person` (
  `guid` varchar(36) NOT NULL,
  `customer_guid` varchar(36) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `title` varchar(4) NOT NULL,
  `job_title` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `department_id` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email_alert` tinyint DEFAULT '0',
  `delete_dt` bigint unsigned DEFAULT NULL,
  `update_dt` bigint unsigned DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `create_dt` bigint unsigned DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_company_contact_person`
--

LOCK TABLES `customer_company_contact_person` WRITE;
/*!40000 ALTER TABLE `customer_company_contact_person` DISABLE KEYS */;
INSERT INTO `customer_company_contact_person` VALUES ('deaee9142e5011ef91a300ff079339a5','5d8f899e2e5011ef91a300ff079339a5','John Doe','Mr.','Sales Manager','john.doe@example.com','Sales','SA001','+1-800-555-1000',0,NULL,1718811034,'admin',1718811034,'admin'),('deaeef022e5011ef91a300ff079339a5','5d8f899e2e5011ef91a300ff079339a5','Jane Smith','Ms.','Marketing Director','jane.smith@example.com','Marketing','MA002','+1-800-555-2000',1,NULL,1718811034,'admin',1718811034,'admin'),('deaeefe82e5011ef91a300ff079339a5','5d8fa01e2e5011ef91a300ff079339a5','Michael Johnson','Mr.','Operations Manager','michael.johnson@example.com','Operations','OP003','+1-800-555-3000',0,NULL,1718811034,'admin',1718811034,'admin'),('deaef04a2e5011ef91a300ff079339a5','5d8fa01e2e5011ef91a300ff079339a5','Emily Brown','Ms.','HR Manager','emily.brown@example.com','Human Resources','HR004','+1-800-555-4000',1,NULL,1718811034,'admin',1718811034,'admin'),('deaef0a32e5011ef91a300ff079339a5','5d8fa01e2e5011ef91a300ff079339a5','David Wilson','Mr.','IT Manager','david.wilson@example.com','Information Technology','IT005','+1-800-555-5000',0,NULL,1718811034,'admin',1718811034,'admin'),('deaef1012e5011ef91a300ff079339a5','5d8fa4f02e5011ef91a300ff079339a5','Olivia Martinez','Ms.','Finance Director','olivia.martinez@example.com','Finance','FI006','+1-800-555-6000',1,NULL,1718811034,'admin',1718811034,'admin'),('deaef1d92e5011ef91a300ff079339a5','5d8fa4f02e5011ef91a300ff079339a5','Daniel Thompson','Mr.','Customer Support Manager','daniel.thompson@example.com','Customer Support','CS007','+1-800-555-7000',0,NULL,1718811034,'admin',1718811034,'admin'),('deaef2262e5011ef91a300ff079339a5','5d8fa7822e5011ef91a300ff079339a5','Sophia Garcia','Ms.','Product Manager','sophia.garcia@example.com','Product Management','PM008','+1-800-555-8000',1,NULL,1718811034,'admin',1718811034,'admin'),('deaef2de2e5011ef91a300ff079339a5','5d8faa9d2e5011ef91a300ff079339a5','James Robinson','Mr.','Sales Representative','james.robinson@example.com','Sales','SA009','+1-800-555-9000',0,NULL,1718811034,'admin',1718811034,'admin'),('deaef3632e5011ef91a300ff079339a5','5d8faa9d2e5011ef91a300ff079339a5','Isabella Thomas','Ms.','Marketing Coordinator','isabella.thomas@example.com','Marketing','MA010','+1-800-555-0000',1,NULL,1718811034,'admin',1718811034,'admin');
/*!40000 ALTER TABLE `customer_company_contact_person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foreign_currencies`
--

DROP TABLE IF EXISTS `foreign_currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foreign_currencies` (
  `currency_id` int NOT NULL AUTO_INCREMENT,
  `currency_code` char(3) NOT NULL,
  `currency_name` varchar(50) NOT NULL,
  `symbol` char(5) DEFAULT NULL,
  `exchange_rate` decimal(10,4) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`currency_id`),
  UNIQUE KEY `currency_code` (`currency_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foreign_currencies`
--

LOCK TABLES `foreign_currencies` WRITE;
/*!40000 ALTER TABLE `foreign_currencies` DISABLE KEYS */;
/*!40000 ALTER TABLE `foreign_currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `in_gate`
--

DROP TABLE IF EXISTS `in_gate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `in_gate` (
  `guid` varchar(36) NOT NULL,
  `eir_no` varchar(36) DEFAULT NULL,
  `vehicle_no` varchar(20) DEFAULT NULL,
  `yard_guid` varchar(36) DEFAULT NULL,
  `driver_name` varchar(120) DEFAULT NULL,
  `LOLO` varchar(15) DEFAULT NULL,
  `preinspection` varchar(15) DEFAULT NULL,
  `eir_doc` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `in_gate`
--

LOCK TABLES `in_gate` WRITE;
/*!40000 ALTER TABLE `in_gate` DISABLE KEYS */;
/*!40000 ALTER TABLE `in_gate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `param_values`
--

DROP TABLE IF EXISTS `param_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `param_values` (
  `guid` varchar(36) NOT NULL,
  `description` varchar(150) NOT NULL,
  `param_val_type` varchar(15) NOT NULL,
  `param_val` varchar(15) NOT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `param_val_type` (`param_val_type`,`param_val`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `param_values`
--

LOCK TABLES `param_values` WRITE;
/*!40000 ALTER TABLE `param_values` DISABLE KEYS */;
/*!40000 ALTER TABLE `param_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storing_order`
--

DROP TABLE IF EXISTS `storing_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storing_order` (
  `guid` varchar(36) NOT NULL,
  `customer_company_guid` varchar(36) NOT NULL,
  `so_notes` varchar(45) DEFAULT NULL,
  `so_no` varchar(20) NOT NULL,
  `contact_person` varchar(45) DEFAULT NULL,
  `haulier` varchar(45) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `so_status` varchar(45) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storing_order`
--

LOCK TABLES `storing_order` WRITE;
/*!40000 ALTER TABLE `storing_order` DISABLE KEYS */;
INSERT INTO `storing_order` VALUES ('14d366b72e5611ef91a300ff079339a5','5d8f899e2e5011ef91a300ff079339a5','TechInnov SO','SO001','John Doe','ABC Logistics','Urgent service required','PROCESSING',NULL,1718813272,'admin',1718813272,'admin'),('14d36c992e5611ef91a300ff079339a5','5d8fa01e2e5011ef91a300ff079339a5','GlobalTrade SO','SO002','Michael Johnson','XYZ Transport','Standard service','PROCESSING',NULL,1718813272,'admin',1718813272,'admin'),('14d36d752e5611ef91a300ff079339a5','5d8fa4f02e5011ef91a300ff079339a5','EcoSolutions SO','SO003','Olivia Martinez','Global Shipping','Special tank','COMPLETE',NULL,1718813272,'admin',1718813272,'admin'),('14d36dda2e5611ef91a300ff079339a5','5d8fa7822e5011ef91a300ff079339a5','MediCare SO','SO004','Sophia Garcia','Swift Haulage','Requested to cancel','CANCELED',NULL,1718813272,'admin',1718813272,'admin'),('14d36e3a2e5611ef91a300ff079339a5','5d8faa9d2e5011ef91a300ff079339a5','NextGenAuto SO','SO005','James Robinson','Fast Freight','Awaiting confirmation','PENDING',NULL,1718813272,'admin',1718813272,'admin');
/*!40000 ALTER TABLE `storing_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storing_order_tank`
--

DROP TABLE IF EXISTS `storing_order_tank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storing_order_tank` (
  `guid` varchar(36) NOT NULL,
  `so_guid` varchar(36) DEFAULT NULL,
  `unit_type_guid` varchar(36) DEFAULT NULL,
  `tank_no` varchar(45) DEFAULT NULL,
  `last_cargo_guid` varchar(36) DEFAULT NULL,
  `job_no` varchar(45) DEFAULT NULL,
  `eta_dt` bigint DEFAULT NULL,
  `purpose_storage` tinyint NOT NULL DEFAULT '0',
  `purpose_steam` tinyint NOT NULL DEFAULT '0',
  `purpose_cleaning` tinyint NOT NULL DEFAULT '0',
  `purpose_repair` varchar(15) DEFAULT NULL,
  `required_temp` float DEFAULT NULL,
  `clean_status` varchar(15) DEFAULT NULL,
  `certificate` varchar(15) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `etr_dt` bigint DEFAULT NULL,
  `st` tinyint NOT NULL DEFAULT '0',
  `o2_level` tinyint NOT NULL DEFAULT '0',
  `open_on_gate` tinyint NOT NULL DEFAULT '0',
  `status` int DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storing_order_tank`
--

LOCK TABLES `storing_order_tank` WRITE;
/*!40000 ALTER TABLE `storing_order_tank` DISABLE KEYS */;
INSERT INTO `storing_order_tank` VALUES ('09ab0e502e5911ef91a300ff079339a5','14d366b72e5611ef91a300ff079339a5','706915bd2e5411ef91a300ff079339a5','EXFU1234567','32345678901234567890123456789012','1234567890',1719280800,1,0,1,'Repair',25.5,'Clean','Yes','Needs inspection',1719471600,1,0,0,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab13942e5911ef91a300ff079339a5','14d366b72e5611ef91a300ff079339a5','706925452e5411ef91a300ff079339a5','EHRN2345678','42345678901234567890123456789012','2345678901',1719360000,1,1,0,NULL,30,'Dirty',NULL,'Routine check',1719547200,0,1,1,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab148b2e5911ef91a300ff079339a5','14d366b72e5611ef91a300ff079339a5','706915bd2e5411ef91a300ff079339a5','TRYI3456789','52345678901234567890123456789012','3456789012',1719460800,0,0,1,'REPAIR',28,'CLEAN','YES',NULL,NULL,1,0,0,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab14f82e5911ef91a300ff079339a5','14d36c992e5611ef91a300ff079339a5','706925fe2e5411ef91a300ff079339a5','EHYK4567890','62345678901234567890123456789012','4567890123',1719536400,1,0,0,'NO_REPAIR',27,'DIRTY','NO','Inspect after usage',NULL,0,1,0,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab154e2e5911ef91a300ff079339a5','14d36c992e5611ef91a300ff079339a5','70691d1f2e5411ef91a300ff079339a5','TYUI5678901','72345678901234567890123456789012','5678901234',1719640800,1,1,1,'REPAIR',26,'CLEAN','YES','Maintenance required',1719799200,1,1,0,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab15bb2e5911ef91a300ff079339a5','14d36d752e5611ef91a300ff079339a5','70691d1f2e5411ef91a300ff079339a5','YUIO6789012','82345678901234567890123456789012','6789012345',1719716400,0,1,0,'NO_REPAIR',29.5,'DIRTY','NO','Routine check',NULL,0,1,1,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab160b2e5911ef91a300ff079339a5','14d36d752e5611ef91a300ff079339a5','706926b22e5411ef91a300ff079339a5','YUEK7890123','92345678901234567890123456789012','7890123456',1719810000,1,0,1,'REPAIR',27.5,'CLEAN','YES',NULL,NULL,1,0,0,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab16632e5911ef91a300ff079339a5','14d36d752e5611ef91a300ff079339a5','706926b22e5411ef91a300ff079339a5','SQWR8901234','12345678901234567890123456789012','8901234567',1719885600,0,0,0,'NO_REPAIR',25,'DIRTY','NO','Needs maintenance',1720054800,0,1,0,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab16b12e5911ef91a300ff079339a5','14d36d752e5611ef91a300ff079339a5','706928282e5411ef91a300ff079339a5','VRYF9012345','22345678901234567890123456789012','9012345678',1719993600,1,1,1,'REPAIR',28.5,'CLEAN','YES','Urgent inspection',NULL,1,1,1,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab17152e5911ef91a300ff079339a5','14d36dda2e5611ef91a300ff079339a5','706928282e5411ef91a300ff079339a5','ZEET0123456','32345678901234567890123456789012','0123456789',1720072800,1,0,0,'NO_REPAIR',26.5,'UNKNOWN','NO','Routine check',NULL,0,1,0,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab175e2e5911ef91a300ff079339a5','14d36dda2e5611ef91a300ff079339a5','7069276e2e5411ef91a300ff079339a5','PODW1234567','42345678901234567890123456789012','1234567890',1720152000,0,1,1,'REPAIR',27,'CLEAN','YES',NULL,NULL,1,0,0,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab17ab2e5911ef91a300ff079339a5','14d36e3a2e5611ef91a300ff079339a5','7069276e2e5411ef91a300ff079339a5','JMKF2345678','52345678901234567890123456789012','2345678901',1720234800,1,0,0,'NO_REPAIR',25,'Dirty','NO','Inspect after usage',1720404000,0,1,1,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab18002e5911ef91a300ff079339a5','14d36e3a2e5611ef91a300ff079339a5','706926b22e5411ef91a300ff079339a5','LTES3456789','62345678901234567890123456789012','3456789012',1720332000,0,1,1,'REPAIR',28,'UNKNOWN','YES','Maintenance required',NULL,1,1,0,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab184a2e5911ef91a300ff079339a5','14d36e3a2e5611ef91a300ff079339a5','70692a652e5411ef91a300ff079339a5','QWER4567890','72345678901234567890123456789012','4567890123',1720404000,1,0,1,'REPAIR',26.5,'CLEAN','YES','Needs inspection',NULL,1,0,1,NULL,NULL,1718814542,'admin',1718814542,'admin'),('09ab18b22e5911ef91a300ff079339a5','14d36e3a2e5611ef91a300ff079339a5','706926b22e5411ef91a300ff079339a5','AERY5678901','82345678901234567890123456789012','5678901234',1720501200,0,0,0,'NO_REPAIR',27.5,'UNKNOWN','NO','Routine check',1720659600,0,1,0,NULL,NULL,1718814542,'admin',1718814542,'admin');
/*!40000 ALTER TABLE `storing_order_tank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tank`
--

DROP TABLE IF EXISTS `tank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tank` (
  `guid` varchar(36) NOT NULL,
  `unit_type` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `unit_typecol_UNIQUE` (`unit_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tank`
--

LOCK TABLES `tank` WRITE;
/*!40000 ALTER TABLE `tank` DISABLE KEYS */;
INSERT INTO `tank` VALUES ('706915bd2e5411ef91a300ff079339a5','T11',NULL,NULL,NULL,1718812566,NULL,'admin'),('70691d1f2e5411ef91a300ff079339a5','IMO7',NULL,NULL,NULL,1718812566,NULL,'admin'),('70691e542e5411ef91a300ff079339a5','Baby Tank',NULL,NULL,NULL,1718812566,NULL,'admin'),('70691f662e5411ef91a300ff079339a5','Bitutainer',NULL,NULL,NULL,1718812566,NULL,'admin'),('706920352e5411ef91a300ff079339a5','Cryogenic',NULL,NULL,NULL,1718812566,NULL,'admin'),('706920f82e5411ef91a300ff079339a5','Swap Body Tank',NULL,NULL,NULL,1718812566,NULL,'admin'),('706921cd2e5411ef91a300ff079339a5','Baffle',NULL,NULL,NULL,1718812566,NULL,'admin'),('706922d92e5411ef91a300ff079339a5','Reefer',NULL,NULL,NULL,1718812566,NULL,'admin'),('706924672e5411ef91a300ff079339a5','Specialized',NULL,NULL,NULL,1718812566,NULL,'admin'),('706925452e5411ef91a300ff079339a5','T12',NULL,NULL,NULL,1718812566,NULL,'admin'),('706925fe2e5411ef91a300ff079339a5','T14',NULL,NULL,NULL,1718812566,NULL,'admin'),('706926b22e5411ef91a300ff079339a5','T50',NULL,NULL,NULL,1718812566,NULL,'admin'),('7069276e2e5411ef91a300ff079339a5','T75',NULL,NULL,NULL,1718812566,NULL,'admin'),('706928282e5411ef91a300ff079339a5','IMO1',NULL,NULL,NULL,1718812566,NULL,'admin'),('706928e12e5411ef91a300ff079339a5','IMO2',NULL,NULL,NULL,1718812566,NULL,'admin'),('7069299c2e5411ef91a300ff079339a5','IMO4',NULL,NULL,NULL,1718812566,NULL,'admin'),('70692a652e5411ef91a300ff079339a5','IMO5',NULL,NULL,NULL,1718812566,NULL,'admin');
/*!40000 ALTER TABLE `tank` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-20  1:05:58
