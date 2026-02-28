CREATE TABLE `idms`.`inspections` (
  `guid` VARCHAR(36) NOT NULL,
  `sot_guid` VARCHAR(36) NULL,
  `aspnetusers_guid` VARCHAR(36) NULL,
  `inspect_dt` BIGINT NULL,
  `marked_section` JSON NULL,
  `update_dt` BIGINT NULL,
  `update_by` VARCHAR(45) NULL,
  `create_dt` BIGINT NULL,
  `create_by` VARCHAR(45) NULL,
  `delete_dt` BIGINT NULL,
  PRIMARY KEY (`guid`));

ALTER TABLE `idms`.`inspections` 
ADD COLUMN `type_cv` VARCHAR(20) NULL AFTER `marked_section`;

ALTER TABLE `idms`.`inspections` 
ADD COLUMN `marked_front_section` JSON NULL AFTER `delete_dt`,
ADD COLUMN `marked_rear_section` JSON NULL AFTER `marked_front_section`,
CHANGE COLUMN `marked_section` `marked_tank_section` JSON NULL DEFAULT NULL;

CREATE TABLE `idms`.`surface_types` (
  `guid` VARCHAR(36) NOT NULL,
  `inspection_guid` VARCHAR(36) NULL,
  `type_cv` VARCHAR(20) NULL,
  `remarks` VARCHAR(200) NULL,
  `value` DOUBLE NULL,
  `update_dt` BIGINT NULL,
  `update_by` VARCHAR(45) NULL,
  `create_dt` BIGINT NULL,
  `create_by` VARCHAR(45) NULL,
  `delete_dt` BIGINT NULL,
  PRIMARY KEY (`guid`));

ALTER TABLE `idms`.`cleaning` 
ADD COLUMN `clean_statement_dt` BIGINT NULL DEFAULT NULL AFTER `overwrite_remarks`;

INSERT INTO `idms`.`functions` (`guid`, `module`, `submodule`, `action`, `code`) VALUES ('c43b97f3a7c64f6fb9816f216f20B941', 'MASTER', 'CURRENCY', 'VIEW', 'MASTER_CURRENCY_VIEW');
INSERT INTO `idms`.`functions` (`guid`, `module`, `submodule`, `action`, `code`) VALUES ('c43b97f3a7c64f6fb9816f216f20B942', 'MASTER', 'CURRENCY', 'EDIT', 'MASTER_CURRENCY_EDIT');
INSERT INTO `idms`.`functions` (`guid`, `module`, `submodule`, `action`, `code`) VALUES ('c43b97f3a7c64f6fb9816f216f20B943', 'MASTER', 'CURRENCY', 'DELETE', 'MASTER_CURRENCY_DELETE');
INSERT INTO `idms`.`functions` (`guid`, `module`, `submodule`, `action`, `code`) VALUES ('c43b97f3a7c64f6fb9816f216f20B944', 'MASTER', 'CURRENCY', 'ADD', 'MASTER_CURRENCY_ADD');

INSERT INTO `idms`.`functions` (`guid`, `module`, `submodule`, `action`, `code`) VALUES ('ede930b8e6994815881d5dfefb8ed266', 'TANK_MOVEMENT', 'INSPECTION_MAPPING_IN', 'VIEW', 'TANK_MOVEMENT_INSPECTION_MAPPING_IN_VIEW');
INSERT INTO `idms`.`functions` (`guid`, `module`, `submodule`, `action`, `code`) VALUES ('592094bec8484bbc9961d0384e1930dd', 'TANK_MOVEMENT', 'INSPECTION_MAPPING_IN', 'EDIT', 'TANK_MOVEMENT_INSPECTION_MAPPING_IN_EDIT');
INSERT INTO `idms`.`functions` (`guid`, `module`, `submodule`, `action`, `code`) VALUES ('9a0bc1de895f45b988feebe1cbc93ce5', 'TANK_MOVEMENT', 'INSPECTION_MAPPING_OUT', 'VIEW', 'TANK_MOVEMENT_INSPECTION_MAPPING_OUT_VIEW');
INSERT INTO `idms`.`functions` (`guid`, `module`, `submodule`, `action`, `code`) VALUES ('685d267b73334a12ad74cf221f24ebeb', 'TANK_MOVEMENT', 'INSPECTION_MAPPING_OUT', 'EDIT', 'TANK_MOVEMENT_INSPECTION_MAPPING_OUT_EDIT');