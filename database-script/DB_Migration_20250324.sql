INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('611', 'Pre-Inspection Cost', 'SALES_COST_TYPE', 'PREINSPECTION');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('612', 'LOLO Cost', 'SALES_COST_TYPE', 'LOLO');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('613', 'Residue Disposal', 'SALES_COST_TYPE', 'RESIDUE');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('614', 'Cleaning Cost', 'SALES_COST_TYPE', 'CLEANING');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('615', 'Repair Cost', 'SALES_COST_TYPE', 'REPAIR');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('616', 'Steam Cost', 'SALES_COST_TYPE', 'STEAMING');



ALTER TABLE `idms`.`steaming` 
ADD COLUMN `total_material_cost` DOUBLE NULL DEFAULT NULL AFTER `owner_billing_guid`,
ADD COLUMN `total_labour_cost` DOUBLE NULL DEFAULT NULL AFTER `total_material_cost`;

ALTER TABLE `idms`.`billing_sot` 
ADD COLUMN `gate_in` TINYINT NULL DEFAULT NULL AFTER `lift_off`,
ADD COLUMN `gate_out` TINYINT NULL DEFAULT NULL AFTER `gate_in`;

ALTER TABLE `idms`.`storing_order_tank` 
ADD COLUMN `job_no_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'For overwrite job no' AFTER `delete_dt`,
ADD COLUMN `last_cargo_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'For overwrite last cargo' AFTER `job_no_remarks`;

ALTER TABLE `idms`.`billing_sot` 
ADD COLUMN `depot_cost_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'For overwrite depot cost' AFTER `delete_dt`;

ALTER TABLE `idms`.`cleaning` 
ADD COLUMN `overwrite_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'for overwrite costing remarks' AFTER `delete_dt`;
ALTER TABLE `idms`.`cleaning` 
CHANGE COLUMN `overwrite_remarks` `overwrite_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'for overwrite costing remarks' AFTER `owner_billing_guid`;

ALTER TABLE `idms`.`repair` 
ADD COLUMN `overwrite_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'for overwrite costing remarks' AFTER `running_number`;
ALTER TABLE `idms`.`repair` 
CHANGE COLUMN `overwrite_remarks` `overwrite_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'for overwrite costing remarks' AFTER `na_dt`;

ALTER TABLE `idms`.`residue` 
ADD COLUMN `overwrite_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'for overwrite costing remarks' AFTER `running_number`;

ALTER TABLE `idms`.`steaming` 
ADD COLUMN `overwrite_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'for overwrite costing remarks' AFTER `total_labour_cost`;
