import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StoringOrderItem } from './storing-order';
import { TARIFF_CLEANING_FRAGMENT, TariffCleaningItem } from './tariff-cleaning';
import { BaseDataSource } from './base-ds';
import { InGateItem } from './in-gate';
import { BookingItem } from './booking';
import { SchedulingItem } from './scheduling';
import { SchedulingSotItem } from './scheduling-sot';
import { ReleaseOrderSotItem } from './release-order-sot';
import { OutGateItem } from './out-gate';
import { CustomerCompanyItem } from './customer-company';
import { RepairItem } from './repair';
import { ResidueItem } from './residue';
import { TankItem } from './tank';
import { InGateCleaningItem } from './in-gate-cleaning';
import { SteamItem } from './steam';

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
  public takein_job_no?: string;
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
    this.takein_job_no = item.takein_job_no || '';
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
  public steaming?:SteamItem[];
  public actions?: string[] = [];

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
    this.actions = item.actions || [];
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
    sotList: queryStoringOrderTank(where: $where) {
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
        takein_job_no
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
        takein_job_no
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
        in_gate {
          eir_no
          eir_dt
          guid
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

const GET_STORING_ORDER_TANKS_OUT_GATE = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        takein_job_no
        release_job_no
        guid
        tank_no
        so_guid
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
        takein_job_no
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
        in_gate {
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
          surveyor_guid
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
        takein_job_no
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
        takein_job_no
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
        in_gate {
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
        takein_job_no
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
        takein_job_no
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
        in_gate {
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
        takein_job_no
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
        in_gate {
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

const GET_STORING_ORDER_TANKS_REPAIR = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        takein_job_no
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
        in_gate {
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
        takein_job_no
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
        in_gate {
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
        takein_job_no
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
        in_gate {
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
        takein_job_no
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

const GET_STORING_ORDER_TANKS_FOR_MOVEMENT_BY_ID = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        job_no
        preinspect_job_no
        liftoff_job_no
        lifton_job_no
        takein_job_no
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
        takein_job_no
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

export class StoringOrderTankDS extends BaseDataSource<StoringOrderTankItem> {
  filterChange = new BehaviorSubject('');
  constructor(private apollo: Apollo) {
    super();
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
        catchError(() => of({ items: [], totalCount: 0 })),
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
        catchError(() => of({ items: [], totalCount: 0 })),
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
        catchError(() => of({ items: [], totalCount: 0 })),
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
        catchError(() => of({ items: [], totalCount: 0 })),
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
        catchError(() => of({ items: [], totalCount: 0 })),
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
        catchError(() => of({ items: [], totalCount: 0 })),
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
        catchError(() => of({ items: [], totalCount: 0 })),
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
        catchError(() => of({ items: [], totalCount: 0 })),
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
        catchError(() => of({ items: [], totalCount: 0 })),
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

  isTankNoAvailableToAdd(tank_no: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    let where: any = {
      and: [
        { tank_no: { eq: tank_no } },
        {
          or: [
            { status_cv: { in: ["WAITING", "PREORDER"] } },
            {
              and: [{ status_cv: { eq: "ACCEPTED" } }, { tank_status_cv: { neq: "RO_GENERATED" } }]
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
        catchError(() => of({ items: [], totalCount: 0 })),
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
        catchError(() => of({ items: [], totalCount: 0 })),
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
        catchError(() => of({ items: [], totalCount: 0 })),
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
    return this.apollo.mutate({
      mutation: CANCEL_STORING_ORDER_TANK,
      variables: {
        sot
      }
    });
  }

  rollbackStoringOrderTank(sot: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_STORING_ORDER_TANK,
      variables: {
        sot
      }
    });
  }

  updateStoringOrderTank(soTank: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_STORING_ORDER_TANK,
      variables: {
        soTank
      }
    });
  }

  updateTankPurpose(tankPurpose: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_TANK_PURPOSE,
      variables: {
        tankPurpose
      }
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
    const status_cv = ["CLEANING", "REPAIR", "STEAM", "STORAGE", "RO_GENERATED", "RESIDUE", "OUT_SURVEY", "OUT_GATE"];
    return sot && (sot.status_cv === 'CANCELED' || sot.status_cv === 'ACCEPTED') && !status_cv.includes(sot.tank_status_cv || '');
  }
}
