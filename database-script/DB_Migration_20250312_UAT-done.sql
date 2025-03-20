ALTER TABLE `idms`.`repair` 
ADD COLUMN `est_cost` DOUBLE NULL DEFAULT NULL AFTER `total_cost`,
CHANGE COLUMN `total_cost` `total_cost` DOUBLE NULL DEFAULT NULL ;

ALTER TABLE `idms`.`steaming` 
ADD COLUMN `est_cost` DOUBLE NULL DEFAULT NULL AFTER `total_cost`,
CHANGE COLUMN `total_cost` `total_cost` DOUBLE NULL DEFAULT NULL ;

ALTER TABLE `idms`.`cleaning` 
ADD COLUMN `est_buffer_cost` DOUBLE NULL DEFAULT NULL AFTER `buffer_cost`,
ADD COLUMN `est_cleaning_cost` DOUBLE NULL DEFAULT NULL AFTER `est_buffer_cost`,
CHANGE COLUMN `cleaning_cost` `cleaning_cost` DOUBLE NULL DEFAULT NULL ,
CHANGE COLUMN `buffer_cost` `buffer_cost` DOUBLE NULL DEFAULT NULL ;

ALTER TABLE `idms`.`residue` 
ADD COLUMN `total_cost` DOUBLE NULL DEFAULT NULL AFTER `estimate_no`,
ADD COLUMN `est_cost` DOUBLE NULL DEFAULT NULL AFTER `total_cost`;

ALTER TABLE `idms`.`repair` 
ADD COLUMN `total_material_cost` DOUBLE NULL DEFAULT NULL AFTER `total_hour`,
ADD COLUMN `total_labour_cost` DOUBLE NULL DEFAULT NULL AFTER `total_material_cost`;
