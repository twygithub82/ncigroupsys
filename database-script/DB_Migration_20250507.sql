UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '8');
UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '149');
UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '228');
UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '30');
UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '508');
UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '545');
UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '571');

ALTER TABLE idms.steaming 
ADD COLUMN est_hour DOUBLE NULL AFTER est_cost,
ADD COLUMN total_hour DOUBLE NULL AFTER est_hour,
ADD COLUMN flat_rate TINYINT NULL AFTER total_hour,
ADD COLUMN hourly_rate DOUBLE NULL AFTER flat_rate;

INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`, `sequence`) VALUES ('621', 'Others', 'VALVE_BRAND', 'OTHERS', '5');

UPDATE `idms`.`code_values` SET `sequence` = '2' WHERE (`guid` = '126');
UPDATE `idms`.`code_values` SET `sequence` = '1' WHERE (`guid` = '127');

CREATE TABLE `role` (
  `guid` varchar(36) NOT NULL,
  `department` varchar(150) DEFAULT NULL,
  `position` varchar(150) DEFAULT NULL,
  `code` varchar(150) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `role_functions` (
  `guid` varchar(36) NOT NULL,
  `functions_guid` varchar(36) DEFAULT NULL,
  `role_guid` varchar(36) DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `functions` (
  `guid` varchar(36) NOT NULL,
  `module` varchar(150) DEFAULT NULL,
  `submodule` varchar(150) DEFAULT NULL,
  `action` varchar(45) DEFAULT NULL,
  `code` varchar(150) DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_functions` (
  `guid` varchar(36) NOT NULL,
  `user_guid` varchar(36) NOT NULL,
  `functions_guid` varchar(36) NOT NULL,
  `adhoc` tinyint DEFAULT NULL,
  `remarks` varchar(150) DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;