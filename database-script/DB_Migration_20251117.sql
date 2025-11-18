CREATE TABLE `idms`.`user_customer` (
  `guid` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NULL,
  `customer_company_guid` VARCHAR(36) NULL,
  `create_dt` BIGINT NULL DEFAULT NULL,
  `create_by` VARCHAR(45) NULL DEFAULT NULL,
  `update_dt` BIGINT NULL DEFAULT NULL,
  `update_by` VARCHAR(45) NULL DEFAULT NULL,
  `delete_dt` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`guid`));

ALTER TABLE `idms`.`customer_company` 
ADD COLUMN `approval_threshold` INT NULL DEFAULT NULL AFTER `country_code`;

ALTER TABLE `idms`.`user_customer` 
ADD INDEX `user_id_index` (`user_id` ASC) INVISIBLE,
ADD INDEX `customer_guid_index` (`customer_company_guid` ASC) INVISIBLE,
ADD INDEX `user_customer_id_index` (`customer_company_guid` ASC, `user_id` ASC) VISIBLE;
;
