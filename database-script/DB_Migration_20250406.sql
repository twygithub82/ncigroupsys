CREATE TABLE `storage_detail` (
  `guid` varchar(36) NOT NULL,
  `sot_guid` varchar(36) DEFAULT NULL,
  `billing_guid` varchar(36) DEFAULT NULL,
  `start_dt` bigint DEFAULT NULL,
  `end_dt` bigint DEFAULT NULL,
  `total_cost` double DEFAULT NULL,
  `remaining_free_storage` int DEFAULT 0,
  `state_cv` varchar(20) DEFAULT NULL,
  `remarks` varchar(120) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

