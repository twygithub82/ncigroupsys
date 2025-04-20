ALTER TABLE `idms`.`job_order` 
ADD INDEX `job_type_cv` (`job_type_cv` ASC) VISIBLE;


ALTER TABLE `idms`.`cleaning_method` 
ADD COLUMN `category_guid` VARCHAR(36) NULL DEFAULT NULL AFTER `guid`;
