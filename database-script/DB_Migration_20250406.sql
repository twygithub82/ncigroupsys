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


ALTER TABLE `idms`.`repair` 
ADD COLUMN `est_cost_owner` DOUBLE NULL DEFAULT NULL AFTER `est_cost`,
ADD COLUMN `total_cost_owner` DOUBLE NULL DEFAULT NULL AFTER `est_cost_owner`,
ADD COLUMN `total_hour_owner` DOUBLE NULL DEFAULT NULL AFTER `total_cost_owner`,
ADD COLUMN `total_material_cost_owner` DOUBLE NULL DEFAULT NULL AFTER `total_hour_owner`,
ADD COLUMN `total_labour_cost_owner` DOUBLE NULL DEFAULT NULL AFTER `total_material_cost_owner`,
CHANGE COLUMN `total_cost` `total_cost` DOUBLE NULL DEFAULT NULL AFTER `estimate_no`,
CHANGE COLUMN `total_material_cost` `total_material_cost` DOUBLE NULL DEFAULT NULL AFTER `total_cost`,
CHANGE COLUMN `total_hour` `total_hour` DOUBLE NULL DEFAULT '0' AFTER `total_material_cost`,
CHANGE COLUMN `total_labour_cost` `total_labour_cost` DOUBLE NULL DEFAULT NULL AFTER `labour_cost`,
CHANGE COLUMN `labour_cost_discount` `labour_cost_discount` DOUBLE NOT NULL DEFAULT '0' AFTER `remarks`,
CHANGE COLUMN `material_cost_discount` `material_cost_discount` DOUBLE NOT NULL DEFAULT '0' AFTER `labour_cost_discount`;

