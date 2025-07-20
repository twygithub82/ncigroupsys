CREATE TABLE IF NOT EXISTS audit_logs (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(255) NOT NULL,
    operation ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    record_id VARCHAR(36), -- Stores the ID (GUID) of the record that was affected
    old_data LONGTEXT, -- Stores the old row data as a string
    new_data LONGTEXT, -- Stores the new row data as a string
    changed_by VARCHAR(255), -- MySQL function to get current user
    change_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kiosk Role
INSERT INTO `idms`.`role` (`guid`, `department`, `position`, `code`, `description`) VALUES ('2a8999bc25cc4c2fa7d3dd6871ab638c', 'KIOSK', 'IN_GATE', 'KIOSK_IN_GATE', 'Kiosk In Gate Role');
INSERT INTO `idms`.`role` (`guid`, `department`, `position`, `code`, `description`) VALUES ('66509c2d3af64a0ebdbe3ac74336aa0a', 'KIOSK', 'OUT_GATE', 'KIOSK_OUT_GATE', 'Kiosk Out Gate Role');

-- Kiosk In Gate and Out Gate
INSERT INTO `idms`.`functions` (`guid`, `module`, `submodule`, `action`, `code`) VALUES ('f6bfbb4982334f9193314ba288bcddad', 'KIOSK', 'IN_GATE', 'ADD', 'KIOSK_IN_GATE_ADD');
INSERT INTO `idms`.`functions` (`guid`, `module`, `submodule`, `action`, `code`) VALUES ('2cba511ed21a47738bd0c613474cc133', 'KIOSK', 'OUT_GATE', 'ADD', 'KIOSK_OUT_GATE_ADD');

-- Kiosk role functions
INSERT INTO `idms`.`role_functions` (`guid`, `functions_guid`, `role_guid`) VALUES ('399ee14ed75e41cb93e9ef0506a8f03b', 'f6bfbb4982334f9193314ba288bcddad', '2a8999bc25cc4c2fa7d3dd6871ab638c');
INSERT INTO `idms`.`role_functions` (`guid`, `functions_guid`, `role_guid`) VALUES ('980c3153065548749cb7a6a09b883461', '2cba511ed21a47738bd0c613474cc133', '66509c2d3af64a0ebdbe3ac74336aa0a');

INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('5290', 'Residue Disposal', 'DEPARTMENT', 'RESIDUE_DISPOSAL');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('5291', 'Dashboard', 'DEPARTMENT', 'DASHBOARD');
INSERT INTO `idms`.`code_values` (`guid`, `description`, `code_val_type`, `code_val`) VALUES ('5292', 'Steaming', 'DEPARTMENT', 'STEAM');
