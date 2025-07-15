USE idms;

-- 2. Create the 'role' Table (as per your provided schema)
CREATE TABLE IF NOT EXISTS role (
    guid VARCHAR(36) NOT NULL PRIMARY KEY,
    department VARCHAR(150) DEFAULT NULL,
    position VARCHAR(150) DEFAULT NULL,
    code VARCHAR(150) DEFAULT NULL,
    description VARCHAR(150) DEFAULT NULL,
    create_dt BIGINT DEFAULT NULL,
    create_by VARCHAR(45) DEFAULT NULL,
    update_dt BIGINT DEFAULT NULL,
    update_by VARCHAR(45) DEFAULT NULL,
    delete_dt BIGINT DEFAULT NULL
);

-- 3. Create the Audit Log Table
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

-- Drop existing triggers to avoid errors if rerunning the script
DROP TRIGGER IF EXISTS trg_role_insert;
DROP TRIGGER IF EXISTS trg_role_update;
DROP TRIGGER IF EXISTS trg_role_delete;

-- Trigger for INSERT operations on 'role'
DELIMITER //
CREATE TRIGGER trg_role_insert
AFTER INSERT ON role
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, operation, record_id, new_data, changed_by)
    VALUES (
        'role',
        'INSERT',
        NEW.guid,
        CONCAT_WS(', ',
            CONCAT('guid:', NEW.guid),
            CONCAT('department:', NEW.department),
            CONCAT('position:', NEW.position),
            CONCAT('code:', NEW.code),
            CONCAT('description:', NEW.description),
            CONCAT('create_dt:', NEW.create_dt),
            CONCAT('create_by:', NEW.create_by),
            CONCAT('update_dt:', NEW.update_dt),
            CONCAT('update_by:', NEW.update_by),
            CONCAT('delete_dt:', NEW.delete_dt)
        ),
        NEW.create_by
    );
END//
DELIMITER ;

-- Trigger for UPDATE operations on 'role'
DELIMITER //
CREATE TRIGGER trg_role_update
AFTER UPDATE ON role
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, operation, record_id, old_data, new_data, changed_by)
    VALUES (
        'role',
        'UPDATE',
        NEW.guid,
        CONCAT_WS(', ',
            CONCAT('guid:', OLD.guid),
            CONCAT('department:', OLD.department),
            CONCAT('position:', OLD.position),
            CONCAT('code:', OLD.code),
            CONCAT('description:', OLD.description),
            CONCAT('create_dt:', OLD.create_dt),
            CONCAT('create_by:', OLD.create_by),
            CONCAT('update_dt:', OLD.update_dt),
            CONCAT('update_by:', OLD.update_by),
            CONCAT('delete_dt:', OLD.delete_dt)
        ),
        CONCAT_WS(', ',
            CONCAT('guid:', NEW.guid),
            CONCAT('department:', NEW.department),
            CONCAT('position:', NEW.position),
            CONCAT('code:', NEW.code),
            CONCAT('description:', NEW.description),
            CONCAT('create_dt:', NEW.create_dt),
            CONCAT('create_by:', NEW.create_by),
            CONCAT('update_dt:', NEW.update_dt),
            CONCAT('update_by:', NEW.update_by),
            CONCAT('delete_dt:', NEW.delete_dt)
        ),
        NEW.update_by
    );
END//
DELIMITER ;

-- Trigger for DELETE operations on 'role'
DELIMITER //
CREATE TRIGGER trg_role_delete
AFTER DELETE ON role
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, operation, record_id, old_data, changed_by)
    VALUES (
        'role',
        'DELETE',
        OLD.guid,
        CONCAT_WS(', ',
            CONCAT('guid:', OLD.guid),
            CONCAT('department:', OLD.department),
            CONCAT('position:', OLD.position),
            CONCAT('code:', OLD.code),
            CONCAT('description:', OLD.description),
            CONCAT('create_dt:', OLD.create_dt),
            CONCAT('create_by:', OLD.create_by),
            CONCAT('update_dt:', OLD.update_dt),
            CONCAT('update_by:', OLD.update_by),
            CONCAT('delete_dt:', OLD.delete_dt)
        ),
        OLD.update_by
    );
END//
DELIMITER ;

-- Insert a new role
SET @new_guid = UUID();
INSERT INTO role (guid, department, position, code, description, create_dt, create_by)
VALUES (@new_guid, 'IT', 'Software Engineer', 'SE001', 'Develops software applications', UNIX_TIMESTAMP(), 'admin');

-- Update the role we just inserted
UPDATE role 
SET position = 'Senior Software Engineer', 
    update_dt = UNIX_TIMESTAMP(), 
    update_by = 'admin'
WHERE guid = @new_guid;

-- Delete the role we just updated
DELETE FROM role WHERE guid = @new_guid;

-- Check the audit logs
SELECT * FROM audit_logs;


-- Kiosk Role
INSERT INTO `idms`.`role` (`guid`, `department`, `position`, `code`, `description`) VALUES ('2a8999bc25cc4c2fa7d3dd6871ab638c', 'KIOSK', 'IN_GATE', 'KIOSK_IN_GATE', 'Kiosk In Gate Role');
INSERT INTO `idms`.`role` (`guid`, `department`, `position`, `code`, `description`) VALUES ('66509c2d3af64a0ebdbe3ac74336aa0a', 'KIOSK', 'OUT_GATE', 'KIOSK_OUT_GATE', 'Kiosk Out Gate Role');

-- Kiosk In Gate and Out Gate
INSERT INTO `idms`.`functions` (`guid`, `module`, `submodule`, `action`, `code`) VALUES ('f6bfbb4982334f9193314ba288bcddad', 'KIOSK', 'IN_GATE', 'ADD', 'KIOSK_IN_GATE_ADD');
INSERT INTO `idms`.`functions` (`guid`, `module`, `submodule`, `action`, `code`) VALUES ('2cba511ed21a47738bd0c613474cc133', 'KIOSK', 'OUT_GATE', 'ADD', 'KIOSK_OUT_GATE_ADD');

-- Kiosk role functions
INSERT INTO `idms`.`role_functions` (`guid`, `functions_guid`, `role_guid`) VALUES ('399ee14ed75e41cb93e9ef0506a8f03b', 'f6bfbb4982334f9193314ba288bcddad', '2a8999bc25cc4c2fa7d3dd6871ab638c');
INSERT INTO `idms`.`role_functions` (`guid`, `functions_guid`, `role_guid`) VALUES ('980c3153065548749cb7a6a09b883461', '2cba511ed21a47738bd0c613474cc133', '66509c2d3af64a0ebdbe3ac74336aa0a');
