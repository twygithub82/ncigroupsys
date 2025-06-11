ALTER TABLE `idms`.`tank_info` 
ADD COLUMN `previous_tank_no` VARCHAR(45) NULL DEFAULT NULL COMMENT 'this is to store the previous tank no if the tank no renumber from the depot' AFTER `yard_cv`,
ADD COLUMN `previous_owner_guid` VARCHAR(36) NULL DEFAULT NULL COMMENT 'this is to store the previous owner of the tank' AFTER `previous_tank_no`,
ADD COLUMN `last_eir_no` VARCHAR(36) NULL DEFAULT NULL COMMENT 'this is to store the last eir no used by the tank' AFTER `previous_owner_guid`;