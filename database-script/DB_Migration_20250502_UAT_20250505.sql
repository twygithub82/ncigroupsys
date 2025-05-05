ALTER TABLE `idms`.`tank` 
ADD COLUMN `flat_rate` TINYINT NULL DEFAULT '1' AFTER `gate_out`;
