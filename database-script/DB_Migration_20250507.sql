CREATE TABLE `role` (
  `guid` varchar(36) NOT NULL,
  `department` varchar(150) DEFAULT NULL,
  `position` varchar(150) DEFAULT NULL,
  `code` varchar(150) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `role_functions` (
  `guid` varchar(36) NOT NULL,
  `functions_guid` varchar(36) DEFAULT NULL,
  `role_guid` varchar(36) DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `functions` (
  `guid` varchar(36) NOT NULL,
  `module` varchar(150) DEFAULT NULL,
  `submodule` varchar(150) DEFAULT NULL,
  `action` varchar(45) DEFAULT NULL,
  `code` varchar(150) DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_functions` (
  `guid` varchar(36) NOT NULL,
  `user_guid` varchar(36) NOT NULL,
  `functions_guid` varchar(36) NOT NULL,
  `adhoc` tinyint DEFAULT NULL,
  `remarks` varchar(150) DEFAULT NULL,
  `create_dt` bigint DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `update_dt` bigint DEFAULT NULL,
  `update_by` varchar(45) DEFAULT NULL,
  `delete_dt` bigint DEFAULT NULL,
  PRIMARY KEY (`guid`),
  UNIQUE KEY `guid_UNIQUE` (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE user_role (
  guid varchar(36) NOT NULL,
  user_guid varchar(36) DEFAULT NULL,
  role_guid varchar(36) DEFAULT NULL,
  create_by varchar(45) DEFAULT NULL,
  create_dt bigint DEFAULT NULL,
  update_by varchar(45) DEFAULT NULL,
  update_dt bigint DEFAULT NULL,
  delete_dt bigint DEFAULT NULL,
  PRIMARY KEY (guid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;