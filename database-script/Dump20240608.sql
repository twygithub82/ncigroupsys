CREATE DATABASE  IF NOT EXISTS `idms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `idms`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: idms
-- ------------------------------------------------------
-- Server version	8.4.0

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
-- Table structure for table `AspNetRoleClaims`
--

DROP TABLE IF EXISTS `AspNetRoleClaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetRoleClaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RoleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetRoleClaims_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `AspNetRoles` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AspNetRoleClaims`
--

LOCK TABLES `AspNetRoleClaims` WRITE;
/*!40000 ALTER TABLE `AspNetRoleClaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `AspNetRoleClaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AspNetRoles`
--

DROP TABLE IF EXISTS `AspNetRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetRoles` (
  `Id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `RoleNameIndex` (`NormalizedName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AspNetRoles`
--

LOCK TABLES `AspNetRoles` WRITE;
/*!40000 ALTER TABLE `AspNetRoles` DISABLE KEYS */;
INSERT INTO `AspNetRoles` VALUES ('36b7c12a-b5e1-4621-aa64-7faa81c89b98','Admin','Admin','1'),('3d069376-cd8f-433d-89b5-6fc3dae2fc73','Customer','Customer','3'),('702e6dc2-02ac-465c-9288-a2c277a5284b','User','User','2'),('8a0ab3c0-481d-4fc6-86d4-55664c257fcd','HR','HR','3');
/*!40000 ALTER TABLE `AspNetRoles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AspNetUserClaims`
--

DROP TABLE IF EXISTS `AspNetUserClaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetUserClaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetUserClaims_UserId` (`UserId`),
  CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AspNetUserClaims`
--

LOCK TABLES `AspNetUserClaims` WRITE;
/*!40000 ALTER TABLE `AspNetUserClaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `AspNetUserClaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AspNetUserRoles`
--

DROP TABLE IF EXISTS `AspNetUserRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetUserRoles` (
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `RoleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`UserId`,`RoleId`),
  KEY `IX_AspNetUserRoles_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `AspNetRoles` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AspNetUserRoles`
--

LOCK TABLES `AspNetUserRoles` WRITE;
/*!40000 ALTER TABLE `AspNetUserRoles` DISABLE KEYS */;
INSERT INTO `AspNetUserRoles` VALUES ('49ad4e8a-31b9-451e-9c3d-5d341c2a227a','36b7c12a-b5e1-4621-aa64-7faa81c89b98'),('b0473331-9b16-4757-aaa3-cc7f95b7e6bd','36b7c12a-b5e1-4621-aa64-7faa81c89b98'),('998a13a5-06ed-4c84-bd39-b3e55238c538','3d069376-cd8f-433d-89b5-6fc3dae2fc73');
/*!40000 ALTER TABLE `AspNetUserRoles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AspNetUserTokens`
--

DROP TABLE IF EXISTS `AspNetUserTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetUserTokens` (
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LoginProvider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`UserId`,`LoginProvider`,`Name`),
  CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AspNetUserTokens`
--

LOCK TABLES `AspNetUserTokens` WRITE;
/*!40000 ALTER TABLE `AspNetUserTokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `AspNetUserTokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AspNetUsers`
--

DROP TABLE IF EXISTS `AspNetUsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetUsers` (
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
-- Dumping data for table `AspNetUsers`
--

LOCK TABLES `AspNetUsers` WRITE;
/*!40000 ALTER TABLE `AspNetUsers` DISABLE KEYS */;
INSERT INTO `AspNetUsers` VALUES ('49ad4e8a-31b9-451e-9c3d-5d341c2a227a',0,1,'bhang2k','BHANG2K','bhang2k@gmail.com','BHANG2K@GMAIL.COM',1,'AQAAAAIAAYagAAAAEO7iuxB17LVp6d3o/5npkiIdCwh4ZNNmx8AcINd1FjaFhcpLfs3QbzayqyWhXbP9QQ==','MDLE3M3YDLYIHH76RU2GHRPD7QM3TRYR','f6ac8942-5ab9-4fad-bc42-9fe860e1021c',NULL,0,0,NULL,1,0),('998a13a5-06ed-4c84-bd39-b3e55238c538',0,0,'johnnyyes2022@gmail.com','JOHNNYYES2022@GMAIL.COM','johnnyyes2022@gmail.com','JOHNNYYES2022@GMAIL.COM',1,'AQAAAAIAAYagAAAAENsLDAnN9PzSzRh0gU700CSy+eQg51VADfIVFgbkvY5J9s2vUrJ0upbhlYbTnV/slw==','7FGR4XUQYJGANLRPGLFC3VNXFKYH3X6C','341459a6-57c8-48b7-a55c-3a5ae988ab75',NULL,0,0,NULL,1,0),('b0473331-9b16-4757-aaa3-cc7f95b7e6bd',0,1,'admin','admin','admin@dwms.com','admin@dwms.com',1,'AQAAAAIAAYagAAAAEAv50U8yR/yGI1IWULZfG4weRGaDIfJHuAqbjhK5CTQJB2FxD6lkxDXsgC3ZMK4fyw==','','1',NULL,0,0,NULL,0,0);
/*!40000 ALTER TABLE `AspNetUsers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `__EFMigrationsHistory`
--

DROP TABLE IF EXISTS `__EFMigrationsHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__EFMigrationsHistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__EFMigrationsHistory`
--

LOCK TABLES `__EFMigrationsHistory` WRITE;
/*!40000 ALTER TABLE `__EFMigrationsHistory` DISABLE KEYS */;
INSERT INTO `__EFMigrationsHistory` VALUES ('20240604113736_NewUser','8.0.6'),('20240605120647_update_script_toadd_staff_admin','8.0.6');
/*!40000 ALTER TABLE `__EFMigrationsHistory` ENABLE KEYS */;
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
-- Table structure for table `code_values`
--

DROP TABLE IF EXISTS `code_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `code_values` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(150) NOT NULL,
  `code_val_type` varchar(15) NOT NULL,
  `code_val` varchar(15) NOT NULL,
  `parent_code` varchar(15) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_val_type` (`code_val_type`,`code_val`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code_values`
--

LOCK TABLES `code_values` WRITE;
/*!40000 ALTER TABLE `code_values` DISABLE KEYS */;
INSERT INTO `code_values` (code_val_type, code_val, description) VALUES 
('YES_NO', 'Y', 'Yes'),
('YES_NO', 'N', 'No'),
('CLEAN_STATUS', 'UNKNOWN', 'Unknown'),
('CLEAN_STATUS', 'CLEAN', 'Clean'),
('CLEAN_STATUS', 'DIRTY', 'Dirty'),
('SO_STATUS', 'PENDING', 'Pending'),
('SO_STATUS', 'COMPLETE', 'Complete'),
('SO_STATUS', 'CANCELED', 'Canceled'),
('SO_STATUS', 'PROSESSING', 'Dirty');
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
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `alias` varchar(100) DEFAULT NULL,
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
  `default_profile` varchar(36) DEFAULT NULL,
  `person_in_charge` varchar(36) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `create_dt` bigint unsigned DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_company`
--

LOCK TABLES `customer_company` WRITE;
/*!40000 ALTER TABLE `customer_company` DISABLE KEYS */;
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
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(150) NOT NULL,
  `param_val_type` varchar(15) NOT NULL,
  `param_val` varchar(15) NOT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
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
  `contact_person_guid` varchar(45) DEFAULT NULL,
  `haulier` varchar(45) DEFAULT NULL,
  `status` int DEFAULT NULL,
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
  `purpose_storage` tinyint DEFAULT NULL,
  `purpose_steam` tinyint DEFAULT NULL,
  `purpose_cleaning` tinyint DEFAULT NULL,
  `purpose_repair` varchar(15) DEFAULT NULL,
  `required_temp` float DEFAULT NULL,
  `clean_status` varchar(15) DEFAULT NULL,
  `certificate` varchar(15) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `etr_dt` bigint DEFAULT NULL,
  `st` tinyint DEFAULT NULL,
  `o2_level` tinyint DEFAULT NULL,
  `open_on_gate` tinyint NOT NULL DEFAULT '0',
  `status` int DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`),
  UNIQUE KEY `so_guid_UNIQUE` (`so_guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storing_order_tank`
--

LOCK TABLES `storing_order_tank` WRITE;
/*!40000 ALTER TABLE `storing_order_tank` DISABLE KEYS */;
/*!40000 ALTER TABLE `storing_order_tank` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-08 17:14:07
