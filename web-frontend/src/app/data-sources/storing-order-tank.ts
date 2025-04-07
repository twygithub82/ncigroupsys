import { ApolloError } from '@apollo/client/errors';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { BillingSOTItem } from './billing';
import { BookingItem } from './booking';
import { CustomerCompanyItem } from './customer-company';
import { InGateItem } from './in-gate';
import { InGateCleaningItem } from './in-gate-cleaning';
import { OutGateItem } from './out-gate';
import { ReleaseOrderSotItem } from './release-order-sot';
import { RepairItem } from './repair';
import { ResidueItem } from './residue';
import { SchedulingSotItem } from './scheduling-sot';
import { SteamItem } from './steam';
import { StoringOrderItem } from './storing-order';
import { SurveyDetailItem } from './survey-detail';
import { TankItem } from './tank';
import { TankInfoItem } from './tank-info';
import { TariffCleaningItem } from './tariff-cleaning';
import { TransferItem } from './transfer';

export class StoringOrderTank {
  public guid?: string;
  public so_guid?: string | null;
  public unit_type_guid?: string;
  public tank_no?: string;
  public last_cargo_guid?: string;
  public job_no?: string;
  public preinspect_job_no?: string;
  public liftoff_job_no?: string;
  public lifton_job_no?: string;
  public release_job_no?: string;
  public eta_dt?: number | Date;
  public purpose_storage: boolean = false;
  public purpose_steam: boolean = false;
  public purpose_cleaning: boolean = false;
  public purpose_repair_cv?: string;
  public clean_status_cv?: string;
  public certificate_cv?: string;
  public required_temp?: number;
  public remarks?: string;
  public tank_note?: string;
  public release_note?: string;
  public etr_dt?: number | Date;
  public status_cv?: string;
  public tank_status_cv?: string;
  public owner_guid?: string;
  public cleaning_remarks?: string;
  public repair_remarks?: string;
  public steaming_remarks?: string;
  public storage_remarks?: string;
  public last_release_dt?: number;
  public job_no_remarks?: string;
  public last_cargo_remarks?: string;
  public clean_status_remarks?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<StoringOrderTankGO> = {}) {
    this.guid = item.guid;
    this.so_guid = item.so_guid;
    this.unit_type_guid = item.unit_type_guid || '';
    this.tank_no = item.tank_no || '';
    this.last_cargo_guid = item.last_cargo_guid || '';
    this.job_no = item.job_no || '';
    this.preinspect_job_no = item.preinspect_job_no || '';
    this.liftoff_job_no = item.liftoff_job_no || '';
    this.lifton_job_no = item.lifton_job_no || '';
    this.release_job_no = item.release_job_no || '';
    this.eta_dt = item.eta_dt || undefined;
    this.purpose_storage = item.purpose_storage !== undefined ? !!item.purpose_storage : false;
    this.purpose_steam = item.purpose_steam !== undefined ? !!item.purpose_steam : false;
    this.purpose_cleaning = item.purpose_cleaning !== undefined ? !!item.purpose_cleaning : false;
    this.purpose_repair_cv = item.purpose_repair_cv || '';
    this.clean_status_cv = item.clean_status_cv || '';
    this.certificate_cv = item.certificate_cv || '';
    this.required_temp = item.required_temp || undefined;
    this.remarks = item.remarks || '';
    this.tank_note = item.tank_note || '';
    this.release_note = item.release_note || '';
    this.etr_dt = item.etr_dt || undefined;
    this.status_cv = item.status_cv || '';
    this.tank_status_cv = item.tank_status_cv || '';
    this.owner_guid = item.owner_guid || '';
    this.cleaning_remarks = item.cleaning_remarks || '';
    this.repair_remarks = item.repair_remarks || '';
    this.steaming_remarks = item.steaming_remarks || '';
    this.storage_remarks = item.storage_remarks || '';
    this.last_release_dt = item.last_release_dt;
    this.job_no_remarks = item.job_no_remarks;
    this.last_cargo_remarks = item.last_cargo_remarks;
    this.clean_status_remarks = item.clean_status_remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class StoringOrderTankGO extends StoringOrderTank {
  public storing_order?: StoringOrderItem

  constructor(item: Partial<StoringOrderTankGO> = {}) {
    super(item)
    this.storing_order = item.storing_order || undefined;
  }
}

export class StoringOrderTankItem extends StoringOrderTankGO {
  public tariff_cleaning?: TariffCleaningItem;
  public in_gate?: InGateItem[];
  public booking?: BookingItem[];
  public scheduling_sot?: SchedulingSotItem[];
  public release_order_sot?: ReleaseOrderSotItem[];
  public out_gate?: OutGateItem[];
  public customer_company?: CustomerCompanyItem;
  public repair?: RepairItem[];
  public cleaning?: InGateCleaningItem[];
  public residue?: ResidueItem[];
  public tank?: TankItem;
  public steaming?: SteamItem[];
  public survey_detail?: SurveyDetailItem[];
  public transfer?: TransferItem[];
  public actions?: string[] = [];
  public billing_sot?: BillingSOTItem;
  public tank_info?: TankInfoItem;

  constructor(item: Partial<StoringOrderTankItem> = {}) {
    super(item);
    this.tariff_cleaning = item.tariff_cleaning;
    this.in_gate = item.in_gate;
    this.booking = item.booking;
    this.scheduling_sot = item.scheduling_sot;
    this.release_order_sot = item.release_order_sot;
    this.out_gate = item.out_gate;
    this.customer_company = item.customer_company;
    this.repair = item.repair;
    this.residue = item.residue;
    this.tank = item.tank;
    this.steaming = item.steaming;
    this.survey_detail = item.survey_detail;
    this.transfer = item.transfer;
    this.actions = item.actions || [];
    this.billing_sot = item.billing_sot;
    this.tank_info = item.tank_info;
  }
}

export class StoringOrderTankUpdateSO extends StoringOrderTankGO {
  public action?: string;

  constructor(item: Partial<StoringOrderTankUpdateSO> = {}) {
    super(item); // Call the constructor of the parent class
    this.action = item.action || '';
  }
}

export interface StoringOrderResult {
  items: StoringOrderTankItem[];
  totalCount: number;
}

const GET_STORING_ORDER_TANKS_COUNT = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTankCount(where: $where) {
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        guid
        tank_no
        so_guid
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
        }
        storing_order {
          so_no
          so_notes
          customer_company {
            code
            guid
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_IN_GATE = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        eta_dt
        etr_dt
        guid
        job_no
        owner_guid
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
        customer_company {
          code
          guid
          name
        }
        tariff_cleaning {
          alias
          ban_type_cv
          cargo
          class_cv
          cleaning_category_guid
          cleaning_method_guid
          create_by
          create_dt
          delete_dt
          depot_note
          description
          flash_point
          guid
          hazard_level_cv
          in_gate_alert
          nature_cv
          open_on_gate_cv
          remarks
          un_no
          update_by
          update_dt
          cleaning_category {
            name
            description
          }
        }
        storing_order {
          so_no
          so_notes
          haulier
          create_dt
          status_cv
          customer_company_guid
          customer_company {
            code
            guid
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          create_by
          create_dt
          delete_dt
          driver_name
          eir_dt
          eir_no
          eir_status_cv
          guid
          haulier
          lolo_cv
          preinspection_cv
          publish_by
          publish_dt
          remarks
          so_tank_guid
          update_by
          update_dt
          vehicle_no
          yard_cv
          in_gate_survey {
            delete_dt
            guid
            inspection_dt
            last_test_cv
            next_test_cv
            tare_weight
            test_dt
            walkway_cv
            capacity
            take_in_reference
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_OUT_GATE = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        guid
        tank_no
        so_guid
        storing_order {
          so_no
          so_notes
          haulier
          create_dt
          status_cv
          customer_company_guid
          customer_company {
            code
            guid
            name
          }
        }
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
        }
        release_order_sot {
          release_order {
            ro_no
            ro_notes
            customer_company {
              code
              guid
              name
            }
          }
        }
        out_gate {
          eir_no
          eir_dt
          guid
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_BOOKING = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        eta_dt
        etr_dt
        guid
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
        storing_order {
          customer_company_guid
          customer_company {
            code
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
          yard_cv
          in_gate_survey {
            tare_weight
            capacity
          }
        }
        booking {
          book_type_cv
          booking_dt
          create_by
          create_dt
          delete_dt
          guid
          reference
          sot_guid
          status_cv
          test_class_cv
          update_by
          update_dt
        }
        scheduling_sot {
          create_by
          create_dt
          delete_dt
          guid
          scheduling_guid
          sot_guid
          status_cv
          reference
          scheduling_dt
          update_by
          update_dt
          scheduling {
            book_type_cv
            create_by
            create_dt
            delete_dt
            guid
            status_cv
            update_by
            update_dt
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

const GET_STORING_ORDER_TANKS_SURVEY = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        eta_dt
        etr_dt
        guid
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
        tariff_cleaning {
          cargo
        }
        storing_order {
          customer_company_guid
          customer_company {
            code
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
          yard_cv
          in_gate_survey {
            tare_weight
            capacity
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

const GET_STORING_ORDER_TANKS_OTH_SURVEY_BY_ID = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      totalCount
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        eta_dt
        etr_dt
        guid
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
        customer_company {
          code
          name
        }
        tariff_cleaning {
          cargo
        }
        storing_order {
          customer_company_guid
          customer_company {
            code
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
          yard_cv
          in_gate_survey {
            tare_weight
            capacity
            last_test_cv
            test_class_cv
            test_dt
            next_test_cv
          }
        }
        survey_detail(where: { survey_type_cv: { neq: "PERIODIC_TEST" } }) {
          create_by
          create_dt
          delete_dt
          guid
          remarks
          sot_guid
          status_cv
          survey_dt
          survey_type_cv
          test_class_cv
          test_type_cv
          update_by
          update_dt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

const GET_STORING_ORDER_TANKS_PT_SURVEY_BY_ID = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      totalCount
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        eta_dt
        etr_dt
        guid
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
        customer_company {
          code
          name
        }
        tariff_cleaning {
          cargo
        }
        storing_order {
          customer_company_guid
          customer_company {
            code
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
          yard_cv
          in_gate_survey {
            tare_weight
            capacity
            last_test_cv
            test_class_cv
            test_dt
            next_test_cv
          }
        }
        survey_detail(where: { survey_type_cv: { eq: "PERIODIC_TEST" } }) {
          create_by
          create_dt
          delete_dt
          guid
          remarks
          sot_guid
          status_cv
          survey_dt
          survey_type_cv
          test_class_cv
          test_type_cv
          update_by
          update_dt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

const RELOAD_STORING_ORDER_TANKS = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        eta_dt
        etr_dt
        guid
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
        tariff_cleaning {
          guid
          cargo
          flash_point
          remarks
          open_on_gate_cv
        }
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANK_BY_ID = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        eta_dt
        etr_dt
        guid
        job_no
        owner_guid
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
        in_gate(where: { delete_dt: { eq: null } }) {
          create_by
          create_dt
          delete_dt
          driver_name
          eir_dt
          eir_no
          guid
          haulier
          lolo_cv
          preinspection_cv
          so_tank_guid
          update_by
          update_dt
          vehicle_no
          yard_cv
        }
        tariff_cleaning {
          alias
          ban_type_cv
          cargo
          class_cv
          cleaning_category_guid
          cleaning_method_guid
          create_by
          create_dt
          delete_dt
          depot_note
          description
          flash_point
          guid
          hazard_level_cv
          in_gate_alert
          nature_cv
          open_on_gate_cv
          remarks
          un_no
          update_by
          update_dt
        }
        storing_order {
          so_no
          so_notes
          haulier
          create_dt
          status_cv
          customer_company_guid
          customer_company {
            code
            guid
            name
          }
        }
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANK_BY_ID_OUT_GATE = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        eta_dt
        etr_dt
        guid
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
        out_gate {
          create_by
          create_dt
          delete_dt
          driver_name
          eir_dt
          eir_no
          eir_status_cv
          guid
          haulier
          remarks
          so_tank_guid
          update_by
          update_dt
          vehicle_no
        }
        tariff_cleaning {
          alias
          ban_type_cv
          cargo
          class_cv
          cleaning_category_guid
          cleaning_method_guid
          create_by
          create_dt
          delete_dt
          depot_note
          description
          flash_point
          guid
          hazard_level_cv
          in_gate_alert
          nature_cv
          open_on_gate_cv
          remarks
          un_no
          update_by
          update_dt
        }
        release_order_sot {
          create_by
          create_dt
          delete_dt
          guid
          remarks
          ro_guid
          sot_guid
          status_cv
          update_by
          update_dt
          release_order {
            create_by
            create_dt
            customer_company_guid
            delete_dt
            guid
            haulier
            release_dt
            remarks
            ro_generated
            ro_no
            ro_notes
            status_cv
            update_by
            update_dt
            customer_company {
              code
              guid
              name
            }
          }
        }
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_RESIDUE_ESTIMATE = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        etr_dt
        guid
        job_no
        owner_guid
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        so_guid
        status_cv
        tank_no
        tank_status_cv
        update_by
        update_dt
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
        }
        storing_order {
          customer_company {
            guid
            code
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
          in_gate_survey {
            next_test_cv
            last_test_cv
            test_class_cv
            test_dt
            update_by
            update_dt
            delete_dt
          }
        }
        residue {
          estimate_no
          allocate_by
          allocate_dt
          approve_by
          approve_dt
          bill_to_guid
          complete_by
          complete_dt
          delete_dt
          guid
          job_no
          remarks
          sot_guid
          status_cv
          update_by
          update_dt
          storing_order_tank {
            storing_order {
              customer_company_guid
            }
          }
          residue_part {
            action
            approve_part
            approve_cost
            approve_qty
            qty_unit_type_cv
            cost
            delete_dt
            description
            guid
            quantity
            tariff_residue_guid
           
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_STEAM_ESTIMATE = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        etr_dt
        guid
        job_no
        owner_guid
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        so_guid
        status_cv
        tank_no
        tank_status_cv
        update_by
        update_dt
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
        }
        storing_order {
          customer_company {
            guid
            code
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
          in_gate_survey {
            next_test_cv
            last_test_cv
            test_class_cv
            test_dt
            update_by
            update_dt
            delete_dt
          }
        }
        steaming {
          estimate_no
          bill_to_guid
          allocate_by
          allocate_dt
          approve_by
          approve_dt
          complete_by
          complete_dt
          delete_dt
          guid
          job_no
          remarks
          sot_guid
          status_cv
          update_by
          update_dt
          storing_order_tank {
            storing_order {
              customer_company_guid
            }
          }
          steaming_part {
            approve_cost
            approve_labour
            approve_qty
            approve_part
            cost
            labour
            delete_dt
            description
            guid
            quantity
            tariff_steaming_guid
            tariff_steaming{
               cost
               labour
               temp_max
               temp_min
            }
           
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_REPAIR_BILLING = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        guid
        tank_no
        so_guid
        tank_status_cv
        customer_company {
            code
            currency_guid
            guid
            main_customer_guid
            name
            remarks
            type_cv
        }
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
        }
        storing_order {
           customer_company {
              code
              currency_guid
              guid
              name
              remarks
              type_cv
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
        }
        repair {
          guid
          estimate_no
          job_no
          labour_cost
          labour_cost_discount
          material_cost_discount
          status_cv
          total_cost
          sot_guid
          remarks
          owner_enable
          delete_dt
          customer_billing_guid
          customer_billing
          {
            bill_to_guid
            delete_dt
            invoice_dt
            invoice_due
            invoice_no
            remarks
            status_cv
            currency{
              currency_code
              currency_name
              rate
              delete_dt
            }
            customer_company {
                code
                currency_guid
                delete_dt
                effective_dt
                guid
                main_customer_guid
                name
                remarks
                type_cv
            }
          }
          owner_billing_guid
          owner_billing{
            bill_to_guid
            delete_dt
            invoice_dt
            invoice_due
            invoice_no
            remarks
            status_cv
            currency{
              currency_code
              currency_name
              rate
              delete_dt
            }
            customer_company {
                code
                currency_guid
                def_tank_guid
                def_template_guid
                delete_dt
                effective_dt
                guid
                main_customer_guid
                name
                remarks
                type_cv
            }
          }
          storing_order_tank {
            
            customer_company {
                code
                currency_guid
                delete_dt
                effective_dt
                guid
                main_customer_guid
                name
                remarks
                type_cv
            }
            storing_order {
              
              customer_company {
                code
                currency_guid
                delete_dt
                effective_dt
                guid
                main_customer_guid
                name
                remarks
                type_cv
              }
            }
          }
          repair_part {
            hour
            owner
            quantity
            material_cost
            delete_dt
            approve_part
            approve_hour
            approve_qty
            approve_cost
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_REPAIR = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        guid
        tank_no
        so_guid
        tank_status_cv
        purpose_repair_cv
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
        }
        storing_order {
          customer_company {
            code
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
        }
        repair {
          guid
          estimate_no
          job_no
          labour_cost
          labour_cost_discount
          material_cost_discount
          status_cv
          total_cost
          sot_guid
          remarks
          delete_dt
          storing_order_tank {
            storing_order {
              customer_company_guid
            }
          }
          repair_part {
            hour
            quantity
            material_cost
            delete_dt
            approve_part
            approve_hour
            approve_qty
            approve_cost
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_REPAIR_QC = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        guid
        tank_no
        so_guid
        tank_status_cv
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
        }
        storing_order {
          customer_company {
            code
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
        }
        repair {
          guid
          estimate_no
          job_no
          labour_cost
          labour_cost_discount
          material_cost_discount
          status_cv
          total_cost
          sot_guid
          remarks
          delete_dt
          storing_order_tank {
            storing_order {
              customer_company_guid
            }
          }
          repair_part {
            hour
            quantity
            material_cost
            delete_dt
            approve_part
            approve_hour
            approve_qty
            approve_cost
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANK_BY_ID_REPAIR = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        etr_dt
        guid
        job_no
        owner_guid
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        so_guid
        status_cv
        tank_no
        tank_status_cv
        update_by
        update_dt
        in_gate(where: { delete_dt: { eq: null } }) {
          create_by
          create_dt
          delete_dt
          eir_dt
          eir_no
          eir_status_cv
          guid
          so_tank_guid
          update_by
          update_dt
          in_gate_survey {
            next_test_cv
            last_test_cv
            test_class_cv
            test_dt
            update_by
            update_dt
            delete_dt
          }
        }
        tariff_cleaning {
          alias
          cargo
          class_cv
          create_by
          create_dt
          delete_dt
          guid
          update_by
          update_dt
        }
        storing_order {
          create_by
          create_dt
          customer_company_guid
          delete_dt
          guid
          so_no
          update_by
          update_dt
          customer_company {
            code
            guid
            name
            def_template_guid
            delete_dt
          }
        }
        customer_company {
          code
          guid
          name
          delete_dt
        }
        repair {
          aspnetusers_guid
          create_by
          create_dt
          delete_dt
          estimate_no
          guid
          labour_cost
          labour_cost_discount
          material_cost_discount
          owner_enable
          remarks
          sot_guid
          status_cv
          total_cost
          update_by
          update_dt
          repair_part {
            action
            create_by
            create_dt
            delete_dt
            description
            guid
            hour
            location_cv
            comment
            material_cost
            owner
            quantity
            remarks
            repair_guid
            tariff_repair_guid
            update_by
            update_dt
            approve_part
            approve_hour
            approve_qty
            approve_cost
            rp_damage_repair {
              action
              code_cv
              code_type
              create_by
              create_dt
              delete_dt
              guid
              rp_guid
              update_by
              update_dt
            }
            tariff_repair {
              alias
              create_by
              create_dt
              delete_dt
              dimension
              group_name_cv
              guid
              height_diameter
              height_diameter_unit_cv
              labour_hour
              length
              length_unit_cv
              material_cost
              part_name
              remarks
              subgroup_name_cv
              thickness
              thickness_unit_cv
              update_by
              update_dt
              width_diameter
              width_diameter_unit_cv
            }
          }
          aspnetsuser {
            id
            userName
          }
        }
      }
      totalCount
    }
  }
`;

const CHECK_ANY_ACTIVE_SOT = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        guid
        so_guid
        status_cv
        tank_status_cv
        tank_no
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_FOR_MOVEMENT = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        guid
        tank_no
        so_guid
        tank_status_cv
        create_dt
        create_by
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
        }
        storing_order {
          so_no
          so_notes
          customer_company {
            code
            guid
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_FOR_MOVEMENT_REPAIR = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        purpose_repair_cv
        repair {
          aspnetusers_guid
          create_by
          create_dt
          delete_dt
          estimate_no
          guid
          labour_cost
          labour_cost_discount
          material_cost_discount
          owner_enable
          remarks
          sot_guid
          status_cv
          total_cost
          update_by
          update_dt
          bill_to_guid
          approve_dt
          approve_by
          complete_dt
          repair_part {
            action
            create_by
            create_dt
            delete_dt
            description
            guid
            hour
            location_cv
            comment
            material_cost
            owner
            quantity
            remarks
            repair_guid
            tariff_repair_guid
            update_by
            update_dt
            approve_cost
            approve_hour
            approve_part
            approve_qty
            complete_dt
            rp_damage_repair {
              action
              code_cv
              code_type
              create_by
              create_dt
              delete_dt
              guid
              rp_guid
              update_by
              update_dt
            }
            tariff_repair {
              alias
              create_by
              create_dt
              delete_dt
              dimension
              group_name_cv
              guid
              height_diameter
              height_diameter_unit_cv
              labour_hour
              length
              length_unit_cv
              material_cost
              part_name
              remarks
              subgroup_name_cv
              thickness
              thickness_unit_cv
              update_by
              update_dt
              width_diameter
              width_diameter_unit_cv
            }
            job_order {
              guid
              status_cv
            }
          }
          aspnetsuser {
            id
            userName
          }
          storing_order_tank {
            certificate_cv
            clean_status_cv
            create_by
            create_dt
            delete_dt
            estimate_cv
            etr_dt
            guid
            job_no
            owner_guid
            preinspect_job_no
            liftoff_job_no
            lifton_job_no
            release_job_no
            last_cargo_guid
            purpose_cleaning
            purpose_repair_cv
            purpose_steam
            purpose_storage
            so_guid
            status_cv
            tank_no
            tank_status_cv
            update_by
            update_dt
            storing_order {
              customer_company {
                code
                name
                guid
              }
            }
            tariff_cleaning {
              alias
              cargo
              class_cv
              create_by
              create_dt
              delete_dt
              guid
              update_by
              update_dt
            }
            customer_company {
              code
              guid
              name
              delete_dt
            }
            in_gate(where: { delete_dt: { eq: null } }) {
              eir_no
              eir_dt
              delete_dt
              in_gate_survey {
                last_test_cv
                next_test_cv
                test_dt
                test_class_cv
              }
            }
          }
        }
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_FOR_MOVEMENT_STORAGE = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        purpose_storage
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_FOR_MOVEMENT_CLEANING = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        purpose_cleaning
        cleaning {
          allocate_by
          allocate_dt
          approve_by
          approve_dt
          bill_to_guid
          buffer_cost
          cleaning_cost
          complete_by
          complete_dt
          create_by
          create_dt
          delete_dt
          guid
          job_no
          na_dt
          remarks
          sot_guid
          status_cv
          update_by
          update_dt
          job_order {
            team {
              create_by
              create_dt
              delete_dt
              department_cv
              description
              guid
              update_by
              update_dt
            }
            complete_dt
            create_by
            create_dt
            delete_dt
            guid
            job_order_no
            job_type_cv
            qc_dt
            qc_by
            remarks
            sot_guid
            start_dt
            status_cv
            team_guid
            total_hour
            update_by
            update_dt
            working_hour
          }
        }
        residue {
          allocate_by
          allocate_dt
          approve_by
          approve_dt
          bill_to_guid
          complete_by
          complete_dt
          create_by
          create_dt
          delete_dt
          estimate_no
          guid
          job_no
          remarks
          sot_guid
          status_cv
          update_by
          update_dt
          residue_part {
            action
            approve_part
            cost
            create_by
            create_dt
            delete_dt
            description
            guid
            job_order_guid
            approve_qty
            approve_cost
            quantity
            residue_guid
            tariff_residue_guid
            update_by
            update_dt
            job_order {
              team {
                create_by
                create_dt
                delete_dt
                department_cv
                description
                guid
                update_by
                update_dt
              }
              complete_dt
              create_by
              create_dt
              delete_dt
              qc_dt
              qc_by
              guid
              job_order_no
              job_type_cv
              remarks
              sot_guid
              start_dt
              status_cv
              team_guid
              total_hour
              update_by
              update_dt
              working_hour
            }
          }
        }
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_FOR_MOVEMENT_STEAMING = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        purpose_steam
        steaming {
          allocate_by
          allocate_dt
          approve_by
          approve_dt
          begin_by
          begin_dt
          bill_to_guid
          complete_by
          complete_dt
          create_by
          create_dt
          delete_dt
          estimate_by
          estimate_dt
          estimate_no
          guid
          invoice_by
          invoice_dt
          job_no
          na_dt
          remarks
          sot_guid
          status_cv
          total_cost
          update_by
          update_dt
          steaming_part {
            approve_cost
            approve_labour
            approve_part
            approve_qty
            complete_dt
            cost
            create_by
            create_dt
            delete_dt
            description
            guid
            job_order_guid
            labour
            quantity
            steaming_guid
            tariff_steaming_guid
            update_by
            update_dt
            tariff_steaming {
              cost
              create_by
              create_dt
              delete_dt
              guid
              labour
              remarks
              temp_max
              temp_min
              update_by
              update_dt
            }
            job_order {
              guid
              status_cv
              steaming_temp {
                meter_temp
                delete_dt
              }
            }
          }
        }
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_FOR_MOVEMENT_BY_ID = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        guid
        tank_no
        so_guid
        tank_status_cv
        create_dt
        create_by
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        clean_status_cv
        unit_type_guid
        tank_note
        release_note
        last_cargo_guid
        required_temp
        job_no_remarks
        last_cargo_remarks
        clean_status_remarks
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
          nature_cv
          in_gate_alert
          cleaning_category_guid
          flash_point
          cleaning_category {
            name
          }
          cleaning_method_guid
          cleaning_method {
            name
          }
        }
        customer_company {
          code
          guid
          name
        }
        storing_order {
          create_by
          create_dt
          customer_company_guid
          delete_dt
          guid
          haulier
          remarks
          so_no
          so_notes
          status_cv
          update_by
          update_dt
          customer_company {
            code
            guid
            name
          }
        }
        release_order_sot(where: { delete_dt: { eq: null } }) {
          release_order {
            create_by
            create_dt
            customer_company_guid
            delete_dt
            guid
            haulier
            release_dt
            remarks
            ro_generated
            ro_no
            ro_notes
            status_cv
            update_by
            update_dt
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          guid
          eir_no
          eir_dt
          create_dt
          delete_dt
          in_gate_survey {
            tank_comp_guid
          }
        }
        out_gate(where: { delete_dt: { eq: null } }) {
          guid
          eir_no
          eir_dt
          create_dt
          delete_dt
        }
        tank {
          unit_type
          tariff_depot_guid
        }
        repair {
          guid
          status_cv
          complete_dt
          create_dt
          delete_dt
        }
        residue {
          guid
          status_cv
          complete_dt
          create_dt
          delete_dt
        }
        cleaning {
          guid
          status_cv
          complete_dt
          create_dt
          delete_dt
        }
        billing_sot {
          create_by
          create_dt
          delete_dt
          depot_cost_remarks
          free_storage
          gate_in
          gate_out
          gate_in_cost
          gate_out_cost
          gateio_billing_guid
          guid
          lift_off
          lift_off_cost
          lift_on
          lift_on_cost
          lolo_billing_guid
          preinsp_billing_guid
          preinspection
          preinspection_cost
          remarks
          sot_guid
          storage_billing_guid
          storage_cal_cv
          storage_cost
          tariff_depot_guid
          update_by
          update_dt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_FOR_REPAIR_QC = gql`
  query queryStoringOrderTank($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        guid
        tank_no
        so_guid
        tank_status_cv
        create_dt
        create_by
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        clean_status_cv
        unit_type_guid
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
          nature_cv
          in_gate_alert
        }
        customer_company {
          code
          guid
          name
        }
        storing_order {
          create_by
          create_dt
          customer_company_guid
          delete_dt
          guid
          haulier
          remarks
          so_no
          so_notes
          status_cv
          update_by
          update_dt
          customer_company {
            code
            guid
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          guid
          eir_no
          eir_dt
          create_dt
          delete_dt
          in_gate_survey {
            tank_comp_guid
          }
        }
        tank {
          unit_type
          tariff_depot_guid
        }
        repair(where: { delete_dt: { eq: null }, status_cv: { in: ["JOB_COMPLETED"] } }) {
          allocate_by
          allocate_dt
          approve_by
          approve_dt
          aspnetusers_guid
          bill_to_guid
          complete_dt
          create_by
          create_dt
          delete_dt
          estimate_no
          guid
          job_no
          labour_cost
          labour_cost_discount
          material_cost_discount
          na_dt
          owner_enable
          remarks
          sot_guid
          status_cv
          total_cost
          total_hour
          update_by
          update_dt
          repair_part {
            action
            approve_cost
            approve_hour
            approve_part
            approve_qty
            comment
            complete_dt
            create_by
            create_dt
            delete_dt
            description
            guid
            hour
            job_order_guid
            location_cv
            material_cost
            owner
            quantity
            remarks
            repair_guid
            tariff_repair_guid
            update_by
            update_dt
            rp_damage_repair {
              action
              code_cv
              code_type
              create_by
              create_dt
              delete_dt
              guid
              rp_guid
              update_by
              update_dt
            }
            tariff_repair {
              group_name_cv
              subgroup_name_cv
            }
            job_order {
              team {
                description
              }
            }
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          create_by
          create_dt
          delete_dt
          driver_name
          eir_dt
          eir_no
          eir_status_cv
          guid
          haulier
          lolo_cv
          preinspection_cv
          remarks
          so_tank_guid
          update_by
          update_dt
          vehicle_no
          yard_cv
          in_gate_survey {
            last_test_cv
            test_class_cv
            test_dt
            next_test_cv
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_FOR_TRANSFER = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        eta_dt
        etr_dt
        guid
        job_no
        owner_guid
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
        customer_company {
          code
          guid
          name
        }
        tariff_cleaning {
          alias
          ban_type_cv
          cargo
          class_cv
          cleaning_category_guid
          cleaning_method_guid
          create_by
          create_dt
          delete_dt
          depot_note
          description
          flash_point
          guid
          hazard_level_cv
          in_gate_alert
          nature_cv
          open_on_gate_cv
          remarks
          un_no
          update_by
          update_dt
        }
        storing_order {
          so_no
          so_notes
          haulier
          create_dt
          status_cv
          customer_company {
            code
            guid
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          guid
          delete_dt
        }
        tank_info {
          yard_cv
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_FOR_TRANSFER_DETAILS = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        eta_dt
        etr_dt
        guid
        job_no
        owner_guid
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
        customer_company {
          code
          guid
          name
        }
        tariff_cleaning {
          alias
          ban_type_cv
          cargo
          class_cv
          cleaning_category_guid
          cleaning_method_guid
          create_by
          create_dt
          delete_dt
          depot_note
          description
          flash_point
          guid
          hazard_level_cv
          in_gate_alert
          nature_cv
          open_on_gate_cv
          remarks
          un_no
          update_by
          update_dt
        }
        storing_order {
          so_no
          so_notes
          haulier
          create_dt
          status_cv
          customer_company {
            code
            guid
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          create_by
          create_dt
          delete_dt
          driver_name
          eir_dt
          eir_no
          eir_status_cv
          guid
          haulier
          lolo_cv
          preinspection_cv
          publish_by
          publish_dt
          remarks
          so_tank_guid
          update_by
          update_dt
          vehicle_no
          yard_cv
        }
        transfer(where: { delete_dt: { eq: null } }, order: { transfer_out_dt: DESC }) {
          create_by
          create_dt
          delete_dt
          driver_name
          guid
          haulier
          location_from_cv
          location_to_cv
          remarks
          sot_guid
          transfer_in_dt
          transfer_out_dt
          update_by
          update_dt
          vehicle_no
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;
const GET_STORING_ORDER_TANKS_FOR_ACTIVITY = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        tank_status_cv
        release_job_no
        remarks
        guid
        tank_no
        so_guid
        cleaning (where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]}){
         approve_dt
         complete_dt
         delete_dt
        }
        repair (where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]}){
         approve_dt
         complete_dt
         estimate_no
         job_no
         create_dt
         delete_dt
        }
        customer_company {
          code
          guid
          name
        }
        storing_order {
          so_no
          so_notes
          haulier
          create_dt
          status_cv
          customer_company_guid
          customer_company {
            code
            guid
            name
          }
        }
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
        }
        release_order_sot {
          release_order {
            create_dt
            ro_no
            ro_notes
            release_dt
            customer_company {
              code
              guid
              name
            }
          }
        }
        in_gate(where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]}) {
          delete_dt
          eir_dt
          eir_no
          guid
          remarks
          so_tank_guid
          yard_cv
          in_gate_survey {
            delete_dt
            guid
            inspection_dt
            last_test_cv
            next_test_cv
            tare_weight
            test_dt
            test_class_cv
            walkway_cv
            capacity
            take_in_reference
          }
        }
        out_gate(where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]}) {
          eir_no
          eir_dt
          guid
          out_gate_survey {
            delete_dt
            guid
            inspection_dt
            last_test_cv
            next_test_cv
            test_class_cv
            tare_weight
            test_dt
            walkway_cv
            capacity
            take_in_reference
          }
        }
        survey_detail(where: { survey_type_cv: { eq: "CLEAN_CERT" } }) {
          create_by
          create_dt
          delete_dt
          guid
          remarks
          sot_guid
          status_cv
          survey_dt
          survey_type_cv
          test_class_cv
          test_type_cv
          update_by
          update_dt
        }
        transfer(where: { delete_dt: { eq: null } }, order: { transfer_out_dt: DESC }) {
          create_by
          create_dt
          delete_dt
          driver_name
          guid
          haulier
          location_from_cv
          location_to_cv
          remarks
          sot_guid
          transfer_in_dt
          transfer_out_dt
          update_by
          update_dt
          vehicle_no
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_FOR_STATUS_DETAIL = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        eta_dt
        etr_dt
        guid
        job_no
        owner_guid
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
          cleaning (where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]}){
         approve_dt
         complete_dt
         delete_dt
         create_dt
        }
        repair (where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]}){
         approve_dt
         complete_dt
         estimate_no
         job_no
         create_dt
         delete_dt
        }
        booking(where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]}){
          book_type_cv
          booking_dt
          reference
        }
        customer_company {
          code
          guid
          name
        }
        tariff_cleaning {
          alias
          ban_type_cv
          cargo
          class_cv
          cleaning_category_guid
          cleaning_method_guid
          create_by
          create_dt
          delete_dt
          depot_note
          description
          flash_point
          guid
          hazard_level_cv
          in_gate_alert
          nature_cv
          open_on_gate_cv
          remarks
          un_no
          update_by
          update_dt
          cleaning_category {
            name
            description
          }
        }
        storing_order {
          so_no
          so_notes
          haulier
          create_dt
          status_cv
          customer_company_guid
          customer_company {
            code
            guid
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          create_by
          create_dt
          delete_dt
          driver_name
          eir_dt
          eir_no
          eir_status_cv
          guid
          haulier
          lolo_cv
          preinspection_cv
          publish_by
          publish_dt
          remarks
          so_tank_guid
          update_by
          update_dt
          vehicle_no
          yard_cv
          in_gate_survey {
            delete_dt
            guid
            inspection_dt
            last_test_cv
            next_test_cv
            tare_weight
            test_dt
            walkway_cv
            capacity
            take_in_reference
            test_class_cv
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;
const GET_STORING_ORDER_FOR_INVENTORY = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        tank_status_cv
        remarks
        guid
        tank_no
        so_guid
        create_dt
        cleaning (where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]}){
         approve_dt
         complete_dt
         delete_dt
         create_dt
        }
        repair (where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]}){
         approve_dt
         complete_dt
         estimate_no
         status_cv
         create_dt
         delete_dt
        }
        booking(where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]}){
          book_type_cv
          booking_dt
          reference
        }
        customer_company {
          code
          guid
          name
        }
        storing_order {
          so_no
          so_notes
          haulier
          create_dt
          status_cv
          customer_company_guid
          customer_company {
            code
            guid
            name
          }
        }
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
          un_no
          cleaning_method{
           name
          }
        }
        release_order_sot {
          release_order {
            create_dt
            ro_no
            ro_notes
            release_dt
            customer_company {
              code
              guid
              name
            }
          }
        }
        in_gate(where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]}) {
          delete_dt
          eir_dt
          eir_no
          guid
          remarks
          so_tank_guid
          yard_cv
          in_gate_survey {
            delete_dt
            guid
            inspection_dt
            last_test_cv
            next_test_cv
            test_class_cv
            tare_weight
            test_dt
            walkway_cv
            capacity
            take_in_reference
          }
        }
        out_gate(where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]}) {
          eir_no
          eir_dt
          guid
          out_gate_survey {
            delete_dt
            guid
            inspection_dt
            last_test_cv
            next_test_cv
            test_class_cv
            tare_weight
            test_dt
            walkway_cv
            capacity
            take_in_reference
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_FOR_REPAIR_OUTSTANDING = gql`
  query queryStoringOrderTank($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        guid
        tank_no
        so_guid
        tank_status_cv
        create_dt
        create_by
        purpose_cleaning
        purpose_repair_cv
        clean_status_cv
        unit_type_guid
        cleaning {
          allocate_by
          allocate_dt
          approve_by
          approve_dt
          bill_to_guid
          buffer_cost
          cleaning_cost
          complete_by
          complete_dt
          create_by
          create_dt
          delete_dt
        }
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
          nature_cv
          in_gate_alert
        }
        customer_company {
          code
          guid
          name
        }
        storing_order {
          customer_company_guid
          delete_dt
          guid
          haulier
          remarks
          so_no
          so_notes
          status_cv
          update_by
          update_dt
          customer_company {
            code
            guid
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          guid
          eir_no
          eir_dt
          create_dt
          delete_dt
          in_gate_survey {
            tank_comp_guid
          }
        }
        repair(where: { delete_dt: { eq: null }, status_cv: { nin: ["JOB_COMPLETED"] } }) {
          allocate_by
          allocate_dt
          approve_by
          approve_dt
          aspnetusers_guid
          bill_to_guid
          complete_dt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_FOR_YARD_TRANSFER = gql`
  query queryStoringOrderTank($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        guid
        tank_no
        so_guid
        tank_status_cv
        create_dt
        create_by
        purpose_cleaning
        purpose_repair_cv
        clean_status_cv
        unit_type_guid
        transfer(where: { delete_dt: { eq: null } }) {
          delete_dt
          driver_name
          guid
          haulier
          location_from_cv
          location_to_cv
          remarks
          sot_guid
          transfer_in_dt
          transfer_out_dt
          update_by
          update_dt
          vehicle_no
        }
        customer_company {
          code
          guid
          name
        }
        storing_order {
          customer_company_guid
          delete_dt
          guid
          haulier
          remarks
          so_no
          so_notes
          status_cv
          update_by
          update_dt
          customer_company {
            code
            guid
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          guid
          delete_dt
        }
        out_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_ESTIMATES_DETAILS = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        customer_company {
          code
          guid
          name
        }
        tariff_cleaning {
          guid
          cargo
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
        }
        out_gate(where: { delete_dt: { eq: null } }) {
          eir_no
          eir_dt
          delete_dt
        }
        storing_order {
          customer_company_guid
          customer_company {
            code
            guid
            name
          }
        }
        guid
        job_no
        owner_guid
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        so_guid
        status_cv
        tank_no
        tank_status_cv
        cleaning(where: { delete_dt: { eq: null } }) {
          bill_to_guid
          buffer_cost
          cleaning_cost
          delete_dt
          guid
          approve_dt
          customer_billing_guid
          customer_company {
            code
            guid
            name
          }
         
        }
        residue(where: { delete_dt: { eq: null } }) {
          estimate_no
          approve_by
          approve_dt
          bill_to_guid
          complete_by
          complete_dt
          delete_dt
          guid
          job_no
          sot_guid
          customer_billing_guid
          status_cv
          residue_part(where: { delete_dt: { eq: null } }) {
            action
            approve_part
            approve_cost
            approve_qty
            qty_unit_type_cv
            delete_dt
            description
            guid
          }
        }
        steaming(where: { delete_dt: { eq: null } }) {
          estimate_no
          bill_to_guid
          approve_by
          approve_dt
          delete_dt
          status_cv
          guid
          customer_billing_guid
          steaming_part(where: { delete_dt: { eq: null } }) {
            approve_cost
            approve_labour
            approve_qty
            approve_part
            delete_dt
            description
            guid
          }
        }
        repair(where: { delete_dt: { eq: null } }) {
          guid
          estimate_no
          job_no
          labour_cost
          labour_cost_discount
          material_cost_discount
          status_cv
          total_cost
          sot_guid
          remarks
          delete_dt
          approve_dt
          owner_enable
          customer_billing_guid
          owner_billing_guid
          repair_part(where: { delete_dt: { eq: null } }) {
            hour
            quantity
            material_cost
            delete_dt
            approve_part
            approve_hour
            approve_qty
            approve_cost
            owner
          }
        }
        billing_sot {
          delete_dt
          free_storage
          gate_in
          gate_out
          gate_in_cost
          gate_out_cost
          gateio_billing_guid
          guid
          lift_off
          lift_off_cost
          lift_on
          lift_on_cost
          lolo_billing_guid
          preinsp_billing_guid
          preinspection
          preinspection_cost
          remarks
          storage_billing_guid
          storage_cal_cv
          storage_cost
          update_by
          update_dt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS_LOCATION_STATUS_SUMMARY = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        certificate_cv
        clean_status_cv
        create_by
        create_dt
        delete_dt
        estimate_cv
        eta_dt
        etr_dt
        guid
        job_no
        owner_guid
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        release_job_no
        last_cargo_guid
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
        customer_company {
          code
          guid
          name
        }
        storing_order {
          so_no
          so_notes
          haulier
          create_dt
          status_cv
          customer_company_guid
          customer_company {
            code
            guid
            name
          }
        }
        in_gate(where: { delete_dt: { eq: null } }) {
          create_by
          create_dt
          delete_dt
          driver_name
          eir_dt
          eir_no
          eir_status_cv
          guid
          haulier
          lolo_cv
          preinspection_cv
          publish_by
          publish_dt
          remarks
          so_tank_guid
          update_by
          update_dt
          vehicle_no
          yard_cv
          in_gate_survey {
            delete_dt
            guid
            inspection_dt
            last_test_cv
            next_test_cv
            tare_weight
            test_dt
            walkway_cv
            capacity
            take_in_reference
          }
        }
        tank_info {
          yard_cv
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

export const CANCEL_STORING_ORDER_TANK = gql`
  mutation CancelStoringOrderTank($sot: [StoringOrderTankRequestInput!]!) {
    cancelStoringOrderTank(sot: $sot)
  }
`;

export const ROLLBACK_STORING_ORDER_TANK = gql`
  mutation RollbackStoringOrderTank($sot: [StoringOrderTankRequestInput!]!) {
    rollbackStoringOrderTank(sot: $sot)
  }
`;

export const UPDATE_STORING_ORDER_TANK = gql`
  mutation updateStoringOrderTank($soTank: StoringOrderTankRequestInput!) {
    updateStoringOrderTank(soTank: $soTank)
  }
`;

export const UPDATE_TANK_PURPOSE = gql`
  mutation updateTankPurpose($tankPurpose: TankPurposeRequestInput!) {
    updateTankPurpose(tankPurpose: $tankPurpose)
  }
`;

const ON_SOT_PURPOSE_CHANGE_SUBSCRIPTION = gql`
  subscription onPurposeChanged($sot_guid: String!) {
    onPurposeChanged(sot_guid: $sot_guid) {
      purpose
      sot_guid
      tank_status
    }
  }
`;

export const UPDATE_JOB_NO = gql`
  mutation updateJobNo($sot: storing_order_tankInput!) {
    updateJobNo(sot: $sot)
  }
`;

export const UPDATE_LAST_CARGO = gql`
  mutation updateLastCargo($sot: storing_order_tankInput!) {
    updateLastCargo(sot: $sot)
  }
`;

export const UPDATE_CLEAN_STATUS = gql`
  mutation updateCleanStatus($sot: storing_order_tankInput!) {
    updateCleanStatus(sot: $sot)
  }
`;

export class StoringOrderTankDS extends BaseDataSource<StoringOrderTankItem> {
  filterChange = new BehaviorSubject('');
  constructor(private apollo: Apollo) {
    super();
  }

  searchStoringOrderTanksYardTransferReport(where: any): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_YARD_TRANSFER,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTanksRepairOutstandingReport(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_REPAIR_OUTSTANDING,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTanksInventoryReport(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_FOR_INVENTORY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTanksStatusReport(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_STATUS_DETAIL,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }


  searchStoringOrderTanksActivityReport(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_ACTIVITY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTanksEstimateDetails(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_ESTIMATES_DETAILS,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTanksRepairBiling(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_REPAIR_BILLING,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTanks(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTanksInGate(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_IN_GATE,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTanksOutGate(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_OUT_GATE,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTanksRepair(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_REPAIR,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        })
      );
  }

  searchStoringOrderTanksRepairQC(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_REPAIR_QC,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTanksSteamEstimate(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_STEAM_ESTIMATE,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTanksResidueEstimate(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_RESIDUE_ESTIMATE,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  reloadStoringOrderTanks(where: any): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: RELOAD_STORING_ORDER_TANKS,
        variables: { where },
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTankByID(id: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    let where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANK_BY_ID,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ soList: [] })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTankByIDForInGate(id: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_IN_GATE,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const sotList = result?.data.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          return sotList.nodes;
        }),
        catchError(() => of({ soList: [] })),
        finalize(() => this.loadingSubject.next(false)),
      );
  }

  getStoringOrderTankByIDForOutGate(id: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANK_BY_ID_OUT_GATE,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const sotList = result?.data.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          return sotList.nodes;
        }),
        catchError(() => of({ soList: [] })),
        finalize(() => this.loadingSubject.next(false)),
      );
  }

  getWaitingStoringOrderTankCount(): Observable<number> {
    this.loadingSubject.next(true);
    let where: any = { status_cv: { eq: "WAITING" } }
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_COUNT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ soList: [] })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          return sotList.totalCount;
        })
      );
  }

  searchStoringOrderTanksForBooking(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_BOOKING,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTankByIDForRepair(id: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    let where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANK_BY_ID_REPAIR,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ soList: [] })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTanksForSurvey(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_SURVEY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTanksForOtherSurveyByID(sot_guid: any): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    const where = this.addDeleteDtCriteria({
      guid: { eq: sot_guid }
    });
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_OTH_SURVEY_BY_ID,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTanksForPTSurveyByID(sot_guid: any): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    const where = this.addDeleteDtCriteria({
      guid: { eq: sot_guid }
    });
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_PT_SURVEY_BY_ID,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  isTankNoAvailableToAdd(tank_no: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    let where: any = {
      and: [
        { tank_no: { eq: tank_no } },
        {
          or: [
            { status_cv: { in: ["WAITING", "PREORDER"] } },
            {
              and: [{ status_cv: { eq: "ACCEPTED" } }, { tank_status_cv: { neq: "RELEASED" } }]
            }
          ]
        }
      ]
    }
    return this.apollo
      .query<any>({
        query: CHECK_ANY_ACTIVE_SOT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ soList: [] })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          return sotList.nodes;
        })
      );
  }

  searchStoringOrderTankForMovement(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_MOVEMENT,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTankForMovementRepair(sot_guid: any): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    const where = {
      guid: { eq: sot_guid }
    }
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_MOVEMENT_REPAIR,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTankForMovementStorage(sot_guid: any): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    const where = {
      guid: { eq: sot_guid }
    }
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_MOVEMENT_STORAGE,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTankForMovementCleaning(sot_guid: any): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    const where = {
      guid: { eq: sot_guid },
      status_cv: { in: ["APPROVED", "COMPLETED", "JOB_IN_PROGRESS"] }
    }
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_MOVEMENT_CLEANING,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTankForMovementSteaming(sot_guid: any): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    const where = {
      guid: { eq: sot_guid }
    }
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_MOVEMENT_STEAMING,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTankForMovementByID(guid: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    const where = {
      guid: { eq: guid }
    }

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_MOVEMENT_BY_ID,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTankForRepairQC(guid: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    const where = {
      guid: { eq: guid }
    }

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_REPAIR_QC,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTankForTransfer(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_TRANSFER,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const resultList = result.data.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        }),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getStoringOrderTankByIDForTransferDetails(id: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_TRANSFER_DETAILS,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const resultList = result?.data.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          return resultList.nodes;
        }),
        catchError(() => of({ soList: [] })),
        finalize(() => this.loadingSubject.next(false)),
      );
  }

  searchStoringOrderTanksLocationStatusSummary(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_LOCATION_STATUS_SUMMARY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  cancelStoringOrderTank(sot: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: CANCEL_STORING_ORDER_TANK,
      variables: {
        sot
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  rollbackStoringOrderTank(sot: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: ROLLBACK_STORING_ORDER_TANK,
      variables: {
        sot
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateStoringOrderTank(soTank: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_STORING_ORDER_TANK,
      variables: {
        soTank
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateTankPurpose(tankPurpose: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_TANK_PURPOSE,
      variables: {
        tankPurpose
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateJobNo(sot: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_JOB_NO,
      variables: {
        sot
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateLastCargo(sot: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_LAST_CARGO,
      variables: {
        sot
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateCleanStatus(sot: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_CLEAN_STATUS,
      variables: {
        sot
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  subscribeToSotPurposeChange(sot_guid: string): Observable<any> {
    return this.apollo.subscribe({
      query: ON_SOT_PURPOSE_CHANGE_SUBSCRIPTION,
      variables: { sot_guid }
    });
  }

  canAddRemove(sot: StoringOrderTankItem): boolean {
    return sot && !sot.status_cv;
  }

  canCancel(sot: StoringOrderTankItem): boolean {
    if (!sot) return false;
    const hasNotYetToSurvey = sot.in_gate?.some(gate => gate.eir_status_cv !== 'YET_TO_SURVEY');
    if (hasNotYetToSurvey) return false;
    return sot.status_cv === 'WAITING' || sot.status_cv === 'PREORDER';
  }

  canRollbackStatus(sot: StoringOrderTankItem): boolean {
    const status_cv = [
      "SO_GENERATED",
      "IN_GATE",
      "IN_SURVEY"
    ];
    return sot && (sot.status_cv === 'CANCELED' || sot.status_cv === 'ACCEPTED') && status_cv.includes(sot.tank_status_cv || '');
  }

  isCustomerSameAsOwner(sot?: StoringOrderTankItem): boolean {
    return !!(sot && sot.owner_guid === sot.storing_order?.customer_company_guid);
  }

  displayTankPurpose(sot: StoringOrderTankItem, getPurposeOptionDescription: (code: string | undefined) => string | undefined) {
    let purposes: any[] = [];
    if (sot?.purpose_storage) {
      purposes.push(getPurposeOptionDescription('STORAGE'));
    }
    if (sot?.purpose_steam) {
      purposes.push(getPurposeOptionDescription('STEAM'));
    }
    if (sot?.purpose_cleaning) {
      purposes.push(getPurposeOptionDescription('CLEANING'));
    }
    if (sot?.purpose_repair_cv) {
      purposes.push(getPurposeOptionDescription(sot?.purpose_repair_cv));
    }
    return purposes.join('; ');
  }
}
