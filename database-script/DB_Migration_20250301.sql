ALTER TABLE `idms`.`in_gate_survey` 
ADD COLUMN `btm_dis_valve_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `right_remarks`,
ADD COLUMN `btm_dis_valve_spec_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `btm_dis_valve_oth`,
ADD COLUMN `foot_valve_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `btm_dis_valve_spec_oth`,
ADD COLUMN `top_dis_valve_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `foot_valve_oth`,
ADD COLUMN `top_dis_valve_spec_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `top_dis_valve_oth`,
ADD COLUMN `airline_valve_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `top_dis_valve_spec_oth`,
ADD COLUMN `airline_valve_conn_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `airline_valve_oth`,
ADD COLUMN `airline_valve_conn_spec_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `airline_valve_conn_oth`,
ADD COLUMN `manlid_cover_oth` VARCHAR(50) NULL DEFAULT NULL AFTER `airline_valve_conn_spec_oth`;

ALTER TABLE `idms`.`out_gate` 
ADD COLUMN `yard_cv` VARCHAR(20) NULL AFTER `running_number`;