import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';
import { SchedulingItem } from './scheduling';
import { TariffRepairItem } from './tariff-repair';
import { RepairPartItem } from './repair-part';
import { UserItem } from './user';
import { ApolloError } from '@apollo/client/errors';
import { BillingItem } from './billing';

export class RepairGO {
  public guid?: string;
  public sot_guid?: string;
  public aspnetusers_guid?: string;
  public estimate_no?: string;
  public labour_cost_discount?: number;
  public material_cost_discount?: number;
  public labour_cost?: number;
  public total_cost?: number;
  public status_cv?: string;
  public remarks?: string;
  public owner_enable?: boolean;
  public bill_to_guid?: string;
  public job_no?: string;
  public total_hour?: number;
  public allocate_by?: string;
  public allocate_dt?: number;
  public approve_by?: string;
  public approve_dt?: number;
  public complete_dt?: number;
  public na_dt?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  public customer_billing_guid?:string;
  public owner_billing_guid?:string;

  constructor(item: Partial<RepairGO> = {}) {
    this.guid = item.guid;
    this.sot_guid = item.sot_guid;
    this.aspnetusers_guid = item.aspnetusers_guid;
    this.estimate_no = item.estimate_no;
    this.labour_cost_discount = item.labour_cost_discount || 0;
    this.material_cost_discount = item.material_cost_discount || 0;
    this.labour_cost = item.labour_cost || 0;
    this.total_cost = item.total_cost || 0;
    this.status_cv = item.status_cv;
    this.remarks = item.remarks;
    this.owner_enable = item.owner_enable || false;
    this.bill_to_guid = item.bill_to_guid;
    this.job_no = item.job_no;
    this.total_hour = item.total_hour || 0;
    this.allocate_by = item.allocate_by;
    this.allocate_dt = item.allocate_dt;
    this.approve_by = item.approve_by;
    this.approve_dt = item.approve_dt;
    this.complete_dt = item.complete_dt;
    this.na_dt = item.na_dt;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
    this.customer_billing_guid=item.customer_billing_guid;
    this.owner_billing_guid=item.owner_billing_guid;
  
  }
}

export class RepairItem extends RepairGO {
  public repair_part?: RepairPartItem[];
  public storing_order_tank?: StoringOrderTankItem;
  public aspnetsuser?: UserItem;
  public actions?: string[]
  public customer_billing?:BillingItem;
  public owner_billing?:BillingItem;
  constructor(item: Partial<RepairItem> = {}) {
    super(item)
    this.repair_part = item.repair_part;
    this.storing_order_tank = item.storing_order_tank;
    this.aspnetsuser = item.aspnetsuser;
    this.actions = item.actions;
    this.customer_billing=item.customer_billing;
    this.owner_billing=item.owner_billing;
  }
}

export class RepairRequest {
  public customer_guid?: string;
  public estimate_no?: string;
  public guid?: string;
  public is_approved?: boolean;
  public remarks?: string;
  public sot_guid?: string;

  constructor(item: Partial<RepairRequest> = {}) {
    this.customer_guid = item.customer_guid;
    this.estimate_no = item.estimate_no;
    this.guid = item.guid;
    this.is_approved = item.is_approved;
    this.remarks = item.remarks;
    this.sot_guid = item.sot_guid;
  }
}

export class RepairStatusRequest {
  public action?: string;
  public guid?: string;
  public remarks?: string;
  public sot_guid?: string;
  public repairPartRequests?: any[] | undefined;

  constructor(item: Partial<RepairStatusRequest> = {}) {
    this.action = item.action;
    this.guid = item.guid;
    this.remarks = item.remarks;
    this.sot_guid = item.sot_guid;
    this.repairPartRequests = item.repairPartRequests;
  }
}

export class RepairCostTableItem extends RepairGO {
  public total_owner_hour?: string;
  public total_owner_labour_cost?: string;
  public total_owner_mat_cost?: string;
  public total_owner_cost?: string;
  public discount_labour_owner_cost?: string;
  public discount_mat_owner_cost?: string;
  public net_owner_cost?: string;

  public total_lessee_hour?: string;
  public total_lessee_labour_cost?: string;
  public total_lessee_mat_cost?: string;
  public total_lessee_cost?: string;
  public discount_labour_lessee_cost?: string;
  public discount_mat_lessee_cost?: string;
  public net_lessee_cost?: string;

  public total_hour_table?: string;
  public total_labour_cost?: string;
  public total_mat_cost?: string;
  public total_cost_table?: string;
  public discount_labour_cost?: string;
  public discount_mat_cost?: string;
  public net_cost?: string;

  constructor(item: Partial<RepairCostTableItem> = {}) {
    super(item)
    this.total_owner_hour = item.total_owner_hour;
    this.total_owner_labour_cost = item.total_owner_labour_cost;
    this.total_owner_mat_cost = item.total_owner_mat_cost;
    this.total_owner_cost = item.total_owner_cost;
    this.discount_labour_owner_cost = item.discount_labour_owner_cost;
    this.discount_mat_owner_cost = item.discount_mat_owner_cost;
    this.net_owner_cost = item.net_owner_cost;

    this.total_lessee_hour = item.total_lessee_hour;
    this.total_lessee_labour_cost = item.total_lessee_labour_cost;
    this.total_lessee_mat_cost = item.total_lessee_mat_cost;
    this.total_lessee_cost = item.total_lessee_cost;
    this.discount_labour_lessee_cost = item.discount_labour_lessee_cost;
    this.discount_mat_lessee_cost = item.discount_mat_lessee_cost;
    this.net_lessee_cost = item.net_lessee_cost;

    this.total_hour_table = item.total_hour_table;
    this.total_labour_cost = item.total_labour_cost;
    this.total_mat_cost = item.total_mat_cost;
    this.total_cost_table = item.total_cost_table;
    this.discount_labour_cost = item.discount_labour_cost;
    this.discount_mat_cost = item.discount_mat_cost;
    this.net_cost = item.net_cost;
  }
}


export const GET_REPAIR_BILLING = gql`
  query QueryRepair($where: repairFilterInput, $order: [repairSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryRepair(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
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
        approve_dt
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
          guid
          job_no
          tank_no
          tank_status_cv
          tariff_cleaning
          {
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
          }
          out_gate{
            guid
            out_gate_survey{
              guid
              create_dt
              delete_dt
            }
          }
        }
        repair_part {
          approve_cost
          approve_hour
          approve_part
          approve_qty
          material_cost
          quantity
          hour
          owner
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

export const GET_REPAIR = gql`
  query QueryRepair($where: repairFilterInput, $order: [repairSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryRepair(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
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
        approve_dt
        storing_order_tank {
          guid
          job_no
          tank_no
          storing_order {
            customer_company {
              code
              name
              guid
            }
          }
        }
        repair_part {
          approve_cost
          approve_hour
          approve_part
          approve_qty
          material_cost
          quantity
          hour
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

export const GET_REPAIR_BY_ID = gql`
  query QueryRepair($where: repairFilterInput, $customer_company_guid: String) {
    resultList: queryRepair(where: $where) {
      nodes {
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
            package_repair(where: { customer_company_guid: { eq: $customer_company_guid } }) {
              material_cost
            }
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

export const GET_REPAIR_FOR_APPROVAL = gql`
  query QueryRepair($where: repairFilterInput) {
    resultList: queryRepair(where: $where) {
      nodes {
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
          in_gate {
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

export const GET_REPAIR_FOR_QC_DETAILS = gql`
  query QueryRepair($where: repairFilterInput) {
    resultList: queryRepair(where: $where) {
      nodes {
        aspnetusers_guid
        create_by
        create_dt
        delete_dt
        estimate_no
        guid
        owner_enable
        remarks
        sot_guid
        status_cv
        update_by
        update_dt
        bill_to_guid
        approve_dt
        approve_by
        allocate_dt
        allocate_by
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
            create_dt
            create_by
            qc_dt
            qc_by
            team {
              description
            }
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
          in_gate {
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

export const GET_REPAIR_FOR_JOB_ORDER = gql`
  query QueryRepair($where: repairFilterInput, $repair_part_where: inventory_repair_partFilterInput) {
    resultList: queryRepair(where: $where) {
      nodes {
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
        approve_by
        approve_dt
        allocate_by
        allocate_dt
        repair_part(where: $repair_part_where) {
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
          job_order_guid
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
          in_gate {
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

const GET_REPAIR_FOR_QC = gql`
  query queryRepair($where: repairFilterInput, $order: [repairSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryRepair(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        aspnetusers_guid
        create_by
        create_dt
        delete_dt
        estimate_no
        guid
        remarks
        sot_guid
        status_cv
        update_by
        update_dt
        approve_dt
        complete_dt
        storing_order_tank {
          guid
          job_no
          tank_no
          purpose_repair_cv
          storing_order {
            customer_company {
              code
              name
              guid
            }
          }
        }
        repair_part {
          job_order_guid
          approve_part
          rp_damage_repair {
            code_cv
            delete_dt
            code_type
          }
          job_order {
            qc_dt
            status_cv
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
`

const GET_REPAIR_FOR_MOVEMENT = gql`
  query QueryRepair($where: repairFilterInput) {
    resultList: queryRepair(where: $where) {
      nodes {
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
        allocate_dt
        allocate_by
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
            qc_dt
            qc_by
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
          in_gate {
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
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`

export const GET_REPAIR_BY_ID_FOR_PDF = gql`
  query queryRepair($where: repairFilterInput, $customer_company_guid: String) {
    resultList: queryRepair(where: $where) {
      nodes {
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
            package_repair(where: { customer_company_guid: { eq: $customer_company_guid } }) {
              material_cost
            }
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
              manufacturer_cv
              dom_dt
              last_test_cv
              next_test_cv
              test_dt
              test_class_cv
            }
          }
          tank {
            description
            unit_type
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

export const ADD_REPAIR = gql`
  mutation AddRepair($repair: repairInput!, $customerCompany: customer_companyInput) {
    addRepair(repair: $repair, customerCompany: $customerCompany)
  }
`;

export const UPDATE_REPAIR = gql`
  mutation UpdateRepair($repair: repairInput!, $customerCompany: customer_companyInput) {
    updateRepair(repair: $repair, customerCompany: $customerCompany)
  }
`;

export const CANCEL_REPAIR = gql`
  mutation CancelRepair($repair: [repairInput!]!) {
    cancelRepair(repair: $repair)
  }
`

export const ROLLBACK_REPAIR = gql`
  mutation RollbackRepair($repair: [RepairRequestInput!]!) {
    rollbackRepair(repair: $repair)
  }
`

export const ROLLBACK_REPAIR_APPROVAL = gql`
  mutation RollbackRepairApproval($repair: [RepairRequestInput!]!) {
    rollbackRepairApproval(repair: $repair)
  }
`

export const ROLLBACK_REPAIR_STATUS = gql`
  mutation RollbackRepairStatus($repair: RepairRequestInput!) {
    rollbackRepairStatus(repair: $repair)
  }
`

export const APPROVE_REPAIR = gql`
  mutation ApproveRepair($repair: repairInput!) {
    approveRepair(repair: $repair)
  }
`

const ABORT_REPAIR = gql`
  mutation abortRepair($repJobOrder: RepJobOrderRequestInput!) {
    abortRepair(repJobOrder: $repJobOrder)
  }
`

const UPDATE_REPAIR_STATUS = gql`
  mutation UpdateRepairStatus($repair: RepairStatusRequestInput!) {
    updateRepairStatus(repair: $repair)
  }
`

const ROLLBACK_QC_REPAIR = gql`
  mutation rollbackQCRepair($repJobOrder: [RepJobOrderRequestInput!]!) {
    rollbackQCRepair(repJobOrder: $repJobOrder)
  }
`

const OVERWRITE_QC_REPAIR = gql`
  mutation overwriteQCRepair($repJobOrder: [RepJobOrderRequestInput!]!) {
    overwriteQCRepair(repJobOrder: $repJobOrder)
  }
`

export class RepairDS extends BaseDataSource<RepairItem> {
  constructor(private apollo: Apollo) {
    super();
  }


  searchRepairWithBilling(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<RepairItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_REPAIR_BILLING,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as RepairItem[]); // Return an empty array on error
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

  searchRepair(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<RepairItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_REPAIR,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as RepairItem[]); // Return an empty array on error
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

  getRepairByID(id: string, customer_company_guid: string): Observable<RepairItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_REPAIR_BY_ID,
        variables: { where, customer_company_guid },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
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

  getRepairByIDForApproval(id: string): Observable<RepairItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_REPAIR_FOR_APPROVAL,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
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

  getRepairByIDForQC(id: string): Observable<RepairItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_REPAIR_FOR_QC_DETAILS,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
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

  getRepairByIDForJobOrder(id: string, job_order_guid: string | undefined): Observable<RepairItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    const repair_part_where: any = {}
    if (job_order_guid) {
      repair_part_where.job_order_guid = { eq: job_order_guid };
    }
    return this.apollo
      .query<any>({
        query: GET_REPAIR_FOR_JOB_ORDER,
        variables: { where, repair_part_where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
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

  getRepairForQC(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<RepairItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_REPAIR_FOR_QC,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
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

  getRepairForMovement(sot_guid: any): Observable<RepairItem[]> {
    this.loadingSubject.next(true);
    const where: any = { sot_guid: { eq: sot_guid } }
    return this.apollo
      .query<any>({
        query: GET_REPAIR_FOR_MOVEMENT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
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

  getRepairByIDForPdf(id: string, customer_company_guid: string): Observable<RepairItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_REPAIR_BY_ID_FOR_PDF,
        variables: { where, customer_company_guid },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
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

  addRepair(repair: any, customerCompany: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: ADD_REPAIR,
      variables: {
        repair,
        customerCompany
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateRepair(repair: any, customerCompany: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_REPAIR,
      variables: {
        repair,
        customerCompany
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  cancelRepair(repair: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: CANCEL_REPAIR,
      variables: {
        repair
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  rollbackRepair(repair: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: ROLLBACK_REPAIR,
      variables: {
        repair
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  // rollbackRepairStatus(repair: any): Observable<any> {
  //   return this.apollo.mutate({
  //     mutation: ROLLBACK_REPAIR_STATUS,
  //     variables: {
  //       repair
  //     }
  //   });
  // }

  rollbackRepairApproval(repair: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: ROLLBACK_REPAIR_APPROVAL,
      variables: {
        repair
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  approveRepair(repair: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: APPROVE_REPAIR,
      variables: {
        repair
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  abortRepair(repJobOrder: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: ABORT_REPAIR,
      variables: {
        repJobOrder
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateRepairStatus(repair: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_REPAIR_STATUS,
      variables: {
        repair
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  rollbackQCRepair(repJobOrder: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: ROLLBACK_QC_REPAIR,
      variables: {
        repJobOrder
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  overwriteQCRepair(repJobOrder: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: OVERWRITE_QC_REPAIR,
      variables: {
        repJobOrder
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  canAmend(re: RepairItem | undefined): boolean {
    return !re?.status_cv || re?.status_cv === 'PENDING' || re?.status_cv === 'APPROVED';
  }

  canApprove(re: RepairItem | undefined): boolean {
    return (re?.status_cv === 'PENDING' || re?.status_cv === 'APPROVED');
    // return (re?.status_cv === 'PENDING' || re?.status_cv === 'APPROVED' || re?.status_cv === 'JOB_IN_PROGRESS');
  }

  canCancel(re: RepairItem | undefined): boolean {
    return re?.status_cv === 'PENDING';
  }

  canAbort(re: RepairItem | undefined, rp: RepairPartItem[]): boolean {
    return (re?.status_cv === 'ASSIGNED' || re?.status_cv === 'PARTIAL_ASSIGNED');
  }

  canRollback(re: RepairItem | undefined): boolean {
    return re?.status_cv === 'PENDING' || re?.status_cv === 'CANCELED';
  }

  canRollbackStatus(re: RepairItem | undefined, rp: RepairPartItem[]): boolean {
    return (re?.status_cv === 'NO_ACTION' || re?.status_cv === 'APPROVED' || re?.status_cv === 'PENDING');
  }

  canAssign(re: RepairItem | undefined): boolean {
    return re?.status_cv === 'APPROVED' || re?.status_cv === 'PARTIAL_ASSIGNED';
  }

  canQCComplete(re: RepairItem | undefined): boolean {
    return (re?.status_cv === 'COMPLETED');
  }

  canRollbackQC(re: RepairItem | undefined): boolean {
    return (re?.status_cv === 'QC_COMPLETED');
  }

  canRollbackJobInProgress(re: RepairItem | undefined): boolean {
    return re?.status_cv === 'ASSIGNED' || re?.status_cv === 'PARTIAL_ASSIGNED' || re?.status_cv === 'JOB_IN_PROGRESS';
  }

  canRemovePurpose(re: RepairItem[] | undefined): boolean {
    return !re || re.length === 0 || re.every(item => item.status_cv === 'PENDING' || item.status_cv === 'CANCELED');
  }

  canCopy(re: RepairItem): boolean {
    return true;
  }

  getTotal(repairPartList: any[] | undefined): any {
    const totalSums = repairPartList?.filter(data => !data.delete_dt && (data.approve_part ?? true))?.reduce((totals: any, owner) => {
      return {
        hour: (totals.hour ?? 0) + (owner.approve_hour ?? owner.hour ?? 0),
        total_mat_cost: totals.total_mat_cost + (((owner.approve_qty ?? owner.quantity ?? 0) * (owner.approve_cost ?? owner.material_cost ?? 0)))
      };
    }, { hour: 0, total_mat_cost: 0 }) || 0;
    return totalSums;
  }

  getTotalLabourCost(total_hour: number | undefined, labour_cost: number | undefined): any {
    return ((total_hour ?? 0) * (labour_cost ?? 0));
  }

  getTotalCost(total_labour_cost: number | undefined, total_material_cost: number | undefined): any {
    return ((total_labour_cost ?? 0) + (total_material_cost ?? 0));
  }

  getDiscountCost(discount: number | undefined, total_cost: number | undefined): any {
    return ((discount ?? 0) * (total_cost ?? 0)) / 100;
  }

  getNetCost(total_cost: number | undefined, discount_labour_cost: number | undefined, discount_mat_cost: number | undefined): any {
    return (total_cost ?? 0) - (discount_labour_cost ?? 0) - (discount_mat_cost ?? 0);
  }

  getRepairBeginDate(repair: RepairItem[] | undefined) {
    if (!repair || repair.length === 0) {
      return undefined;
    }

    const earliestApproveDt = repair.reduce((earliest, item) => {
      if (item.approve_dt !== null && item.approve_dt !== undefined) {
        return earliest === undefined || item.approve_dt < earliest ? item.approve_dt : earliest;
      }
      return earliest;
    }, undefined as number | undefined);

    return earliestApproveDt;
  }

  getRepairCompleteDate(repair: RepairItem[] | undefined) {
    if (!repair || repair.length === 0) {
      return undefined;
    }

    const allCompleteDatesValid = repair.every(item => item.complete_dt !== null && item.complete_dt !== undefined);
    if (!allCompleteDatesValid) {
      return undefined;
    }

    const earliestApproveDt = repair.reduce((latest, item) => {
      if (item.complete_dt !== null && item.complete_dt !== undefined) {
        return latest === undefined || item.complete_dt > latest ? item.complete_dt : latest;
      }
      return latest;
    }, undefined as number | undefined);

    return earliestApproveDt;
  }

  getRepairProcessingDays(repair: RepairItem[] | undefined) {
    if (!repair || repair.length === 0) {
      return undefined;
    }

    const beginDate = this.getRepairBeginDate(repair);
    const completeDate = this.getRepairCompleteDate(repair);

    if (!beginDate || !completeDate) {
      return undefined;
    }

    const timeTakenMs = completeDate - beginDate;

    if (timeTakenMs === undefined || timeTakenMs < 0) {
      return "Invalid time data";
    }

    const days = Math.ceil(timeTakenMs / (3600 * 24));

    return `${days}`;
  }

  calculateCost(repair: RepairItem, repList: RepairPartItem[], packageLabourCost?: number) {
    const costResult = new RepairCostTableItem();
    const ownerList = repList.filter(item => item.owner && !item.delete_dt && (item.approve_part ?? true));
    const lesseeList = repList.filter(item => !item.owner && !item.delete_dt && (item.approve_part ?? true));
    const labourDiscount = repair.labour_cost_discount;
    const matDiscount = repair.material_cost_discount;

    let total_hour = 0;
    let total_labour_cost = 0;
    let total_mat_cost = 0;
    let total_cost = 0;
    let discount_labour_cost = 0;
    let discount_mat_cost = 0;
    let net_cost = 0;
    costResult.labour_cost_discount = labourDiscount;
    costResult.material_cost_discount = matDiscount;

    const totalOwner = this.getTotal(ownerList);
    const total_owner_hour = totalOwner.hour;
    const total_owner_labour_cost = this.getTotalLabourCost(total_owner_hour, repair.labour_cost ?? packageLabourCost);
    const total_owner_mat_cost = totalOwner.total_mat_cost;
    const total_owner_cost = this.getTotalCost(total_owner_labour_cost, total_owner_mat_cost);
    const discount_labour_owner_cost = this.getDiscountCost(labourDiscount, total_owner_labour_cost);
    const discount_mat_owner_cost = this.getDiscountCost(matDiscount, total_owner_mat_cost);
    const net_owner_cost = this.getNetCost(total_owner_cost, discount_labour_owner_cost, discount_mat_owner_cost);

    costResult.total_owner_cost = total_owner_hour.toFixed(2);
    costResult.total_owner_labour_cost = total_owner_labour_cost.toFixed(2);
    costResult.total_owner_mat_cost = total_owner_mat_cost.toFixed(2);
    costResult.total_owner_cost = total_owner_cost.toFixed(2);
    costResult.discount_labour_owner_cost = discount_labour_owner_cost.toFixed(2);
    costResult.discount_mat_owner_cost = discount_mat_owner_cost.toFixed(2);
    costResult.net_owner_cost = net_owner_cost.toFixed(2);

    total_hour += total_owner_hour;
    total_labour_cost += total_owner_labour_cost;
    total_mat_cost += total_owner_mat_cost;
    total_cost += total_owner_cost;
    discount_labour_cost += discount_labour_owner_cost;
    discount_mat_cost += discount_mat_owner_cost;
    net_cost += net_owner_cost;

    const totalLessee = this.getTotal(lesseeList);
    const total_lessee_hour = totalLessee.hour;
    const total_lessee_labour_cost = this.getTotalLabourCost(total_lessee_hour, repair.labour_cost ?? packageLabourCost);
    const total_lessee_mat_cost = totalLessee.total_mat_cost;
    const total_lessee_cost = this.getTotalCost(total_lessee_labour_cost, total_lessee_mat_cost);
    const discount_labour_lessee_cost = this.getDiscountCost(labourDiscount, total_lessee_labour_cost);
    const discount_mat_lessee_cost = this.getDiscountCost(matDiscount, total_lessee_mat_cost);
    const net_lessee_cost = this.getNetCost(total_lessee_cost, discount_labour_lessee_cost, discount_mat_lessee_cost);

    costResult.total_lessee_hour = total_lessee_hour.toFixed(2);
    costResult.total_lessee_labour_cost = total_lessee_labour_cost.toFixed(2);
    costResult.total_lessee_mat_cost = total_lessee_mat_cost.toFixed(2);
    costResult.total_lessee_cost = total_lessee_cost.toFixed(2);
    costResult.discount_labour_lessee_cost = discount_labour_lessee_cost.toFixed(2);
    costResult.discount_mat_lessee_cost = discount_mat_lessee_cost.toFixed(2);
    costResult.net_lessee_cost = net_lessee_cost.toFixed(2);

    total_hour += total_lessee_hour;
    total_labour_cost += total_lessee_labour_cost;
    total_mat_cost += total_lessee_mat_cost;
    total_cost += total_lessee_cost;
    discount_labour_cost += discount_labour_lessee_cost;
    discount_mat_cost += discount_mat_lessee_cost;
    net_cost += net_lessee_cost;

    costResult.total_hour_table = total_hour.toFixed(2);
    costResult.total_labour_cost = total_labour_cost.toFixed(2);
    costResult.total_mat_cost = total_mat_cost.toFixed(2);
    costResult.total_cost_table = total_cost.toFixed(2);
    costResult.discount_labour_cost = discount_labour_cost.toFixed(2);
    costResult.discount_mat_cost = discount_mat_cost.toFixed(2);
    costResult.net_cost = net_cost.toFixed(2);

    return costResult;
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'QC_COMPLETED':
      case 'COMPLETED':
      case 'APPROVED':
        return 'badge-solid-green';
      case 'PENDING':
        return 'badge-solid-cyan';
      case 'CANCEL':
      case 'NO_ACTION':
        return 'badge-solid-red';
      case 'JOB_IN_PROGRESS':
      case 'PARTIAL_ASSIGNED':
      case 'ASSIGNED':
        return 'badge-solid-purple';
      default:
        return '';
    }
  }

  getRepairJobQcDt(re: RepairItem | undefined): number | undefined {
    if (!re?.repair_part || re.repair_part.length === 0) {
      return undefined; // Return undefined if no parts exist
    }

    // Extract all qc_dt values, filter valid ones, and find the max
    const qcDates = re.repair_part
      .map(part => part.job_order?.qc_dt)
      .filter((qcDt): qcDt is number => qcDt !== undefined); // Filter valid numbers

    // Find the maximum qc_dt if qcDates array is not empty
    const latestQcDt = qcDates.length > 0 ? Math.max(...qcDates) : undefined;

    // Convert the epoch time to a readable date string
    return latestQcDt;
  }
}
