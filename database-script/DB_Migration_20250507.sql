UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '8');
UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '149');
UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '228');
UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '30');
UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '508');
UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '545');
UPDATE `idms`.`code_values` SET `description` = 'Cancelled' WHERE (`guid` = '571');

ALTER TABLE idms.steaming 
ADD COLUMN est_hour DOUBLE NULL AFTER est_cost,
ADD COLUMN total_hour DOUBLE NULL AFTER est_hour,
ADD COLUMN flat_rate TINYINT NULL AFTER total_hour,
ADD COLUMN hourly_rate DOUBLE NULL AFTER flat_rate;