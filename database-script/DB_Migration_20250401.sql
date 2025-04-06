ALTER TABLE `idms`.`billing_sot` 
ADD COLUMN `total_storage_cost` DOUBLE NULL DEFAULT NULL AFTER `depot_cost_remarks`,
CHANGE COLUMN `depot_cost_remarks` `depot_cost_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'For overwrite depot cost' AFTER `remarks`;

ALTER TABLE `idms`.`billing_sot` 
CHANGE COLUMN `total_storage_cost` `total_storage_cost` DOUBLE NULL DEFAULT NULL AFTER `depot_cost_remarks`;

update idms.tariff_cleaning set nature_cv ='FLAMMABLE' where nature_cv='FLAMABLE';
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('583', 'In and Out', 'INVENTORY_TYPE', 'IN_OUT');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('584', 'Steam', 'INVENTORY_TYPE', 'STEAMING');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('585', 'Cleaning', 'INVENTORY_TYPE', 'CLEANING');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('586', 'Repair', 'INVENTORY_TYPE', 'REPAIR');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('587', 'Depot', 'INVENTORY_TYPE', 'DEPOT');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('606', 'Month wise', 'REPORT_TYPE', 'MONTH_WISE');

INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`, `sequence`) VALUES ('617', 'Start Billing', 'STORAGE_DETAIL', 'START', '1');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`, `sequence`) VALUES ('618', 'Billing', 'STORAGE_DETAIL', 'BILLING', '2');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`, `sequence`) VALUES ('619', 'End Billing', 'STORAGE_DETAIL', 'END', '3');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`, `sequence`) VALUES ('620', 'Start and End Billing', 'STORAGE_DETAIL', 'START_END', '4');
