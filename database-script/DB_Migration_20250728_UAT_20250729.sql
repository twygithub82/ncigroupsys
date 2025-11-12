ALTER TABLE idms.billing 
ADD COLUMN invoice_type VARCHAR(20) NULL DEFAULT NULL COMMENT 'code_value_type = INVOICE_TYPE' AFTER invoice_due;