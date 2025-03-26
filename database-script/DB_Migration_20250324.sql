INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('611', 'Pre-Inspection Cost', 'SALES_COST_TYPE', 'PREINSPECTION');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('612', 'LOLO Cost', 'SALES_COST_TYPE', 'LOLO');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('613', 'Residue Disposal', 'SALES_COST_TYPE', 'RESIDUE');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('614', 'Cleaning Cost', 'SALES_COST_TYPE', 'CLEANING');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('615', 'Repair Cost', 'SALES_COST_TYPE', 'REPAIR');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('616', 'Steam Cost', 'SALES_COST_TYPE', 'STEAMING');



ALTER TABLE `idms`.`steaming` 
ADD COLUMN `total_material_cost` DOUBLE NULL DEFAULT NULL AFTER `owner_billing_guid`,
ADD COLUMN `total_labour_cost` DOUBLE NULL DEFAULT NULL AFTER `total_material_cost`;
