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

CREATE TABLE `idms`.`surface_types` (
  `guid` VARCHAR(36) NOT NULL,
  `inspection_guid` VARCHAR(36) NULL,
  `type` VARCHAR(20) NULL,
  `remarks` VARCHAR(200) NULL,
  `value` DOUBLE NULL,
  `update_dt` BIGINT NULL,
  `update_by` VARCHAR(45) NULL,
  `create_dt` BIGINT NULL,
  `create_by` VARCHAR(45) NULL,
  `delete_dt` BIGINT NULL,
  PRIMARY KEY (`guid`));

ALTER TABLE `idms`.`inspections` 
ADD COLUMN `type_cv` VARCHAR(20) NULL AFTER `marked_section`;

ALTER TABLE `idms`.`cleaning` 
ADD COLUMN `clean_statement_dt` BIGINT NULL DEFAULT NULL AFTER `overwrite_remarks`;
