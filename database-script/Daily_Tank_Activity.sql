CREATE OR REPLACE VIEW v_daily_tank_activity AS

WITH activity_cte AS (
    SELECT sot_guid, estimate_no, create_by, create_dt
    FROM steaming
    WHERE delete_dt IS NULL AND create_by <> 'system'
    UNION ALL
    SELECT sot_guid, estimate_no, create_by, create_dt
    FROM residue
    WHERE delete_dt IS NULL AND create_by <> 'system'
    UNION ALL
    SELECT sot_guid, estimate_no, create_by, create_dt
    FROM repair
    WHERE delete_dt IS NULL
),
cleaning_cte AS (
    SELECT sot_guid, complete_dt
    FROM cleaning
    WHERE delete_dt IS NULL
),
release_cte AS (
    SELECT r1.sot_guid, r2.release_dt, r2.ro_notes
    FROM release_order_sot r1
    JOIN release_order r2 ON r1.ro_guid = r2.guid
    WHERE r1.delete_dt IS NULL
),
in_gate_cte AS (
    SELECT i.so_tank_guid, i.eir_dt, i.yard_cv, igs.last_test_cv, igs.next_test_cv, 
           igs.test_class_cv, igs.test_dt, igs.tare_weight, igs.capacity
    FROM in_gate i
    LEFT JOIN in_gate_survey igs ON i.guid = igs.in_gate_guid
    WHERE i.delete_dt IS NULL
),
out_gate_cte AS (
    SELECT so_tank_guid, eir_dt, yard_cv
    FROM out_gate
    WHERE delete_dt IS NULL
),
survey_cte AS (
    SELECT sot_guid, survey_dt
    FROM survey_detail
    WHERE survey_type_cv = 'CLEAN_CERT' AND delete_dt IS NULL
),
deduplicated AS (
    SELECT 
        t.tank_no,
        ig.eir_dt AS in_date,
        t.job_no AS take_in_ref,
        ig.capacity,
        ig.tare_weight,
        tf.cargo AS last_cargo,
        cl.complete_dt AS clean_date,
        c0.code AS customer,
        c0.name AS customer_name,
        c1.code as owner,
        ig.last_test_cv AS last_test,
        ig.next_test_cv AS next_test,
        ig.test_class_cv,
        ig.test_dt as test_date,
        rp.complete_dt AS av_date,
        sv.survey_dt AS clean_cert_date,
        rl.release_dt AS release_booking,
        og.eir_dt AS release_date,
        t.release_job_no AS release_ref,
        t.tank_status_cv AS status,
        t.purpose_cleaning,
        t.purpose_repair_cv,
        t.purpose_steam,
        t.purpose_storage,
        t.remarks,
        ig.yard_cv as in_yard_cv,
        og.yard_cv as out_yard_cv,
        COALESCE(st.create_by, rs.create_by, rp.create_by) AS created_by,
        COALESCE(st.estimate_no, rs.estimate_no, rp.estimate_no) AS estimate_no,
        COALESCE(st.job_no, rs.job_no, rp.job_no) AS approval_ref,
        COALESCE(st.create_dt, rs.create_dt, rp.create_dt) AS estimate_date,
        ROW_NUMBER() OVER (
            PARTITION BY t.tank_no, COALESCE(st.estimate_no, rs.estimate_no, rp.estimate_no)
            ORDER BY t.create_dt DESC
        ) AS rn
    FROM storing_order_tank t
    JOIN customer_company c1 ON t.owner_guid = c1.guid and c1.delete_dt IS NULL
    JOIN storing_order s0 ON t.so_guid = s0.guid AND s0.delete_dt IS NULL
    JOIN customer_company c0 ON s0.customer_company_guid = c0.guid AND c0.delete_dt IS NULL
    LEFT JOIN tariff_cleaning tf ON t.last_cargo_guid = tf.guid AND tf.delete_dt IS NULL
    LEFT JOIN in_gate_cte ig ON t.guid = ig.so_tank_guid
    LEFT JOIN cleaning_cte cl ON t.guid = cl.sot_guid
    LEFT JOIN repair rp ON t.guid = rp.sot_guid AND rp.delete_dt IS NULL
    LEFT JOIN steaming st ON t.guid = st.sot_guid AND st.delete_dt IS NULL AND st.create_by <> 'system'
    LEFT JOIN residue rs ON t.guid = rs.sot_guid AND rs.delete_dt IS NULL AND rs.create_by <> 'system'
    LEFT JOIN release_cte rl ON t.guid = rl.sot_guid
    LEFT JOIN out_gate_cte og ON t.guid = og.so_tank_guid
    LEFT JOIN survey_cte sv ON t.guid = sv.sot_guid
)
SELECT *
FROM deduplicated
WHERE rn = 1;
