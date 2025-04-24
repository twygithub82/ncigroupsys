ALTER TABLE `idms`.`storing_order_tank` 
ADD COLUMN `clean_status_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'For overwrite clean status' AFTER `delete_dt`;
ALTER TABLE `idms`.`storing_order_tank` 
CHANGE COLUMN `clean_status_remarks` `clean_status_remarks` VARCHAR(250) NULL DEFAULT NULL COMMENT 'For overwrite clean status' AFTER `last_cargo_remarks`;
