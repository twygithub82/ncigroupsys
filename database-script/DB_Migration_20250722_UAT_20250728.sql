
UPDATE `idms`.`code_values` SET `sequence` = '1' WHERE (`guid` = '604');
UPDATE `idms`.`code_values` SET `sequence` = '6' WHERE (`guid` = '102');
UPDATE `idms`.`code_values` SET `sequence` = '3' WHERE (`guid` = '103');
UPDATE `idms`.`code_values` SET `sequence` = '2' WHERE (`guid` = '601');

INSERT INTO `idms`.`team` (`guid`, `description`, `department_cv`, `update_dt`, `update_by`, `create_dt`, `create_by`) VALUES ('07194b5e7a2a48299eef8c3a538fbe01', 'YARD_1', 'YARD', '1752979695', 'daniel', '1752979695', 'daniel');
INSERT INTO `idms`.`team` (`guid`, `description`, `department_cv`, `update_dt`, `update_by`, `create_dt`, `create_by`) VALUES ('670f071d079246418df83fa5958bcd2e', 'YARD_2', 'YARD', '1752979695', 'daniel', '1752979695', 'daniel');
INSERT INTO `idms`.`team_user` (`guid`, `userId`, `team_guid`, `create_dt`, `create_by`, `update_dt`, `update_by`) VALUES ('9a44cdee4c794454b7e494a46dea7347', '54c6e920-0505-405e-b7a9-c4e1734aabd3', '07194b5e7a2a48299eef8c3a538fbe01', '1742121595', 'daniel', '1742121595', 'daniel');
INSERT INTO `idms`.`team_user` (`guid`, `userId`, `team_guid`, `create_dt`, `create_by`, `update_dt`, `update_by`) VALUES ('168409a9a54c46ada56a2ff279908264', '3a514f47-9cfa-4f4a-8395-64584cc9f807', '670f071d079246418df83fa5958bcd2e', '1742121595', 'daniel', '1742121595', 'daniel');
