ALTER TABLE `idms`.`billing_sot` 
ADD COLUMN `loff_billing_guid` VARCHAR(36) NULL DEFAULT NULL AFTER `lon_billing_guid`,
ADD COLUMN `gout_billing_guid` VARCHAR(36) NULL DEFAULT NULL AFTER `gin_billing_guid`,
CHANGE COLUMN `lolo_billing_guid` `lon_billing_guid` VARCHAR(36) NULL DEFAULT NULL ,
CHANGE COLUMN `gateio_billing_guid` `gin_billing_guid` VARCHAR(36) NULL DEFAULT NULL ;
