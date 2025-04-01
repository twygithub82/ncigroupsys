ALTER TABLE `idms`.`billing_sot` 
ADD COLUMN `total_storage_cost` DOUBLE NULL DEFAULT NULL AFTER `depot_cost_remarks`,
CHANGE COLUMN `depot_cost_remarks` `depot_cost_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'For overwrite depot cost' AFTER `remarks`;

ALTER TABLE `idms`.`billing_sot` 
CHANGE COLUMN `total_storage_cost` `total_storage_cost` DOUBLE NULL DEFAULT NULL AFTER `depot_cost_remarks`;