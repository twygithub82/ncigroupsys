UPDATE `idms`.`code_values` SET `sequence` = '4' WHERE (`guid` = '97');
UPDATE `idms`.`code_values` SET `sequence` = '3' WHERE (`guid` = '98');

INSERT INTO idms.code_values (guid, description, code_val_type, code_val, sequence) VALUES ('622', 'KG', 'RESIDUE_UNIT', 'KG', '1');
INSERT INTO idms.code_values (guid, description, code_val_type, code_val, sequence) VALUES ('623', 'Pcs', 'RESIDUE_UNIT', 'PCS', '2');
INSERT INTO idms.code_values (guid, description, code_val_type, code_val, sequence) VALUES ('624', 'Drum', 'RESIDUE_UNIT', 'DRUM', '3');
INSERT INTO idms.code_values (guid, description, code_val_type, code_val, sequence) VALUES ('625', 'IBC', 'RESIDUE_UNIT', 'IBC', '4');
INSERT INTO idms.code_values (guid, description, code_val_type, code_val, sequence) VALUES ('626', 'Job', 'RESIDUE_UNIT', 'JOB', '5');

UPDATE `idms`.`code_values` SET `sequence` = '4' WHERE (`guid` = '31');
UPDATE `idms`.`code_values` SET `sequence` = '5' WHERE (`guid` = '33');
UPDATE `idms`.`code_values` SET `sequence` = '6' WHERE (`guid` = '38');
