ALTER TABLE `idms`.`in_gate_survey` 
ADD COLUMN `btm_dis_valve_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `right_remarks`,
ADD COLUMN `btm_dis_valve_spec_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `btm_dis_valve_oth`,
ADD COLUMN `foot_valve_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `btm_dis_valve_spec_oth`,
ADD COLUMN `top_dis_valve_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `foot_valve_oth`,
ADD COLUMN `top_dis_valve_spec_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `top_dis_valve_oth`,
ADD COLUMN `airline_valve_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `top_dis_valve_spec_oth`,
ADD COLUMN `airline_valve_conn_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `airline_valve_oth`,
ADD COLUMN `airline_valve_conn_spec_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `airline_valve_conn_oth`,
ADD COLUMN `manlid_cover_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `airline_valve_conn_spec_oth`;


ALTER TABLE `idms`.`out_gate_survey` 
ADD COLUMN `btm_dis_valve_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `right_remarks`,
ADD COLUMN `btm_dis_valve_spec_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `btm_dis_valve_oth`,
ADD COLUMN `foot_valve_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `btm_dis_valve_spec_oth`,
ADD COLUMN `top_dis_valve_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `foot_valve_oth`,
ADD COLUMN `top_dis_valve_spec_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `top_dis_valve_oth`,
ADD COLUMN `airline_valve_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `top_dis_valve_spec_oth`,
ADD COLUMN `airline_valve_conn_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `airline_valve_oth`,
ADD COLUMN `airline_valve_conn_spec_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `airline_valve_conn_oth`,
ADD COLUMN `manlid_cover_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `airline_valve_conn_spec_oth`;


ALTER TABLE `idms`.`out_gate` 
ADD COLUMN `yard_cv` VARCHAR(20) NULL AFTER `running_number`;

ALTER TABLE `idms`.`customer_company` 
ADD COLUMN `country_code` VARCHAR(5) NULL DEFAULT NULL AFTER `def_tank_guid`;

CREATE TABLE `cleaning_formula` (
  `guid` varchar(36) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `duration` double DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cleaning_method_formula` (
  `guid` varchar(36) NOT NULL,
  `method_guid` varchar(36) DEFAULT NULL,
  `formula_guid` varchar(36) DEFAULT NULL,
  `sequence` int DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `idms`.`tank` 
ADD COLUMN `preinspect` TINYINT NULL DEFAULT 1 AFTER `description`,
ADD COLUMN `lift_on` TINYINT NULL DEFAULT 1 AFTER `preinspect`,
ADD COLUMN `lift_off` TINYINT NULL DEFAULT 1 AFTER `lift_on`,
ADD COLUMN `gate_in` TINYINT NULL DEFAULT 1 AFTER `lift_off`,
ADD COLUMN `gate_out` TINYINT NULL DEFAULT 1 AFTER `gate_in`,
ADD COLUMN `iso_format` TINYINT NULL DEFAULT 1 AFTER `gate_out`;
