ALTER TABLE `idms`.`storing_order_tank` 
ADD COLUMN `clean_status_remarks` VARCHAR(250) NULL DEFAULT NULL AFTER `last_cargo_remarks`;
