ALTER TABLE `idms`.`cleaning_method` 
CHANGE COLUMN `name` `name` VARCHAR(45) NULL DEFAULT NULL ,
CHANGE COLUMN `description` `description` VARCHAR(150) NULL DEFAULT NULL ;


ALTER TABLE `idms`.`cleaning_category` 
CHANGE COLUMN `name` `name` VARCHAR(45) NULL DEFAULT NULL ,
CHANGE COLUMN `description` `description` VARCHAR(150) NULL DEFAULT NULL ;

