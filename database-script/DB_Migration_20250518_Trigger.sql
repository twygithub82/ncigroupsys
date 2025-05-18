DROP TRIGGER IF EXISTS `idms`.`tariff_buffer_AFTER_UPDATE`;

DELIMITER $$
USE `idms`$$
CREATE DEFINER = CURRENT_USER TRIGGER `idms`.`tariff_buffer_AFTER_UPDATE` AFTER UPDATE ON `tariff_buffer` FOR EACH ROW
BEGIN
-- Check if the delete_dt field has changed
    IF (OLD.delete_dt IS NULL AND NEW.delete_dt IS NOT NULL AND NEW.delete_dt > 0) OR
	   (OLD.delete_dt IS NOT NULL AND NEW.delete_dt IS NOT NULL AND OLD.delete_dt <> NEW.delete_dt) THEN
        -- Call the stored procedure if delete_dt is updated
        CALL SP_Del_Tariff_PackageBuffer(NEW.guid, NEW.update_by, NEW.delete_dt);
    END IF;
END$$
DELIMITER ;





DROP TRIGGER IF EXISTS `idms`.`tariff_depot_AFTER_UPDATE`;

DELIMITER $$
USE `idms`$$
CREATE DEFINER = CURRENT_USER TRIGGER `idms`.`tariff_depot_AFTER_UPDATE` AFTER UPDATE ON `tariff_depot` FOR EACH ROW
BEGIN
-- Check if the delete_dt field has changed
    IF (OLD.delete_dt IS NULL AND NEW.delete_dt IS NOT NULL AND NEW.delete_dt > 0) OR
	   (OLD.delete_dt IS NOT NULL AND NEW.delete_dt IS NOT NULL AND OLD.delete_dt <> NEW.delete_dt) THEN
        -- Call the stored procedure if delete_dt is updated
        CALL SP_Del_Tariff_PackageDepot(NEW.guid, NEW.update_by, NEW.delete_dt);
    END IF;
END$$
DELIMITER ;




DROP TRIGGER IF EXISTS `idms`.`tariff_repair_AFTER_UPDATE`;

DELIMITER $$
USE `idms`$$
CREATE DEFINER = CURRENT_USER TRIGGER `idms`.`tariff_repair_AFTER_UPDATE` AFTER UPDATE ON `tariff_repair` FOR EACH ROW
BEGIN
	-- Check if the delete_dt field has changed
    IF (OLD.delete_dt IS NULL AND NEW.delete_dt IS NOT NULL AND NEW.delete_dt > 0) OR
	   (OLD.delete_dt IS NOT NULL AND NEW.delete_dt IS NOT NULL AND OLD.delete_dt <> NEW.delete_dt) THEN
        -- Call the stored procedure if delete_dt is updated
        CALL SP_Del_Tariff_PackageRepair(NEW.guid, NEW.update_by, NEW.delete_dt);
    END IF;
END$$
DELIMITER ;




DROP TRIGGER IF EXISTS `idms`.`tariff_residue_AFTER_UPDATE`;

DELIMITER $$
USE `idms`$$
CREATE DEFINER = CURRENT_USER TRIGGER `idms`.`tariff_residue_AFTER_UPDATE` AFTER UPDATE ON `tariff_residue` FOR EACH ROW
BEGIN
-- Check if the delete_dt field has changed
    IF (OLD.delete_dt IS NULL AND NEW.delete_dt IS NOT NULL AND NEW.delete_dt > 0) OR
	   (OLD.delete_dt IS NOT NULL AND NEW.delete_dt IS NOT NULL AND OLD.delete_dt <> NEW.delete_dt) THEN
        -- Call the stored procedure if delete_dt is updated
        CALL SP_Del_Tariff_PackageResidue(NEW.guid, NEW.update_by, NEW.delete_dt);
    END IF;
END$$
DELIMITER ;




DROP TRIGGER IF EXISTS `idms`.`tariff_steaming_AFTER_UPDATE`;

DELIMITER $$
USE `idms`$$
CREATE DEFINER = CURRENT_USER TRIGGER `idms`.`tariff_steaming_AFTER_UPDATE` AFTER UPDATE ON `tariff_steaming` FOR EACH ROW
BEGIN
-- Check if the delete_dt field has changed
    IF (OLD.delete_dt IS NULL AND NEW.delete_dt IS NOT NULL AND NEW.delete_dt > 0) OR
	   (OLD.delete_dt IS NOT NULL AND NEW.delete_dt IS NOT NULL AND OLD.delete_dt <> NEW.delete_dt) THEN
        -- Call the stored procedure if delete_dt is updated
        CALL SP_Del_Tariff_PackageSteaming(NEW.guid, NEW.update_by, NEW.delete_dt);
    END IF;
END$$
DELIMITER ;




DROP TRIGGER IF EXISTS `idms`.`cleaning_category_AFTER_UPDATE`;

DELIMITER $$
USE `idms`$$
CREATE DEFINER = CURRENT_USER TRIGGER `idms`.`cleaning_category_AFTER_UPDATE` AFTER UPDATE ON `cleaning_category` FOR EACH ROW
BEGIN
-- Check if the delete_dt field has changed
    IF (OLD.delete_dt IS NULL AND NEW.delete_dt IS NOT NULL AND NEW.delete_dt > 0) OR
	   (OLD.delete_dt IS NOT NULL AND NEW.delete_dt IS NOT NULL AND OLD.delete_dt <> NEW.delete_dt) THEN
        -- Call the stored procedure if delete_dt is updated
        CALL SP_Del_Tariff_CleaningCategory(NEW.guid, NEW.update_by, NEW.delete_dt);
    END IF;

END$$
DELIMITER ;






	