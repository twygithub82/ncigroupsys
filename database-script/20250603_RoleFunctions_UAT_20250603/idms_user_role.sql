-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: tlx-idms.mysql.database.azure.com    Database: idms
-- ------------------------------------------------------
-- Server version	8.0.40-azure

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
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `guid` varchar(36) NOT NULL,
  `user_guid` varchar(36) DEFAULT NULL,
  `role_guid` varchar(36) DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES ('4fa5e9c24a8c48f5b2d1d39ff30cde4a','b0473331-9b16-4757-aaa3-cc7f95b7e6bd','5b98740efc2b4b608c06842e4cf20A13','system',1747666930,NULL,NULL,NULL),('8818b5ce377442babdfe4bc24c8a2936','0fb29219-2f2d-4468-834a-7b792b16714b','5b98740efc2b4b608c06842e4cf20A03','system',1747666930,NULL,NULL,NULL),('a3d27f0c4b7f42aebce41ea2b8a6b7f3','3f6e51f1-e763-4aa4-9307-233809452d34','5b98740efc2b4b608c06842e4cf20A07','system',1747666930,NULL,NULL,NULL),('e3c9f1b7a3e54f3fb8215c1b2c0f4e47','20bbebc1-80ce-4bfd-bbef-4e4db225d7e8','5b98740efc2b4b608c06842e4cf20A10','system',1747666930,NULL,NULL,NULL),('f3cda3b2c4f14835a4b21bb56d4629a3','e31aec70-5fb9-4a47-b91f-1f2e048d577e','5b98740efc2b4b608c06842e4cf20A13','system',1747666930,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-04  0:00:30
