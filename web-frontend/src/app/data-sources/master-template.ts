import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { CleaningCategoryItem } from './cleaning-category';
import { CleaningMethodItem } from './cleaning-method';
import { TankItem } from './tank';
import { CLEANING_CATEGORY_FRAGMENT, CLEANING_METHOD_FRAGMENT } from './fragments';
import { PageInfo } from '@core/models/pageInfo';
import { BaseDataSource } from './base-ds';
import { lab } from 'd3';
import { CustomerCompanyItem } from './customer-company';
import { TariffRepairItem } from './tariff-repair';
export class MasterTemplateGo {
  public guid?: string;
  public template_name?: string;
  public type_cv?: string;
  public labour_cost_discount?: number;
  public material_cost_discount?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  public remarks?: string | null;

  constructor(item: Partial<MasterTemplateGo> = {}) {
    // Object.assign(this, { guid: '', ...item });
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    this.template_name = item.template_name;
    this.type_cv = item.type_cv;
    this.labour_cost_discount = item.labour_cost_discount;
    this.material_cost_discount = item.material_cost_discount;
    this.remarks = item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class TepDamageRepairItem {
  action?: string;
  code_cv?: string;
  code_type?: number;
  create_by?: string | null;
  create_dt?: string | null;
  delete_dt?: string | null;
  guid?: string | null;
  tep_guid?: string | null;
  update_by?: string | null;
  update_dt?: string | null;
  constructor(item: Partial<TepDamageRepairItem> = {}) {
    // Object.assign(this, { guid: '', ...item });

    this.action = item.action;
    this.guid = item.guid;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
    this.code_cv = item.code_cv;
    this.code_type = item.code_type;
    this.tep_guid = item.tep_guid;
  }
}

export class TemplateEstPartItem {
  no?:number=0;
  index?:number=0;
  action?: string = 'NEW';
  guid?: string | null;
  description?: string;
  delete_dt?: number | null;
  create_by?: number | null;
  create_dt?: number | null;
  hour?: number;
  quantity?: number;
  comment?: string | null;
  location_cv?: string | null;
  remarks?: string | null;
  tariff_repair_guid?: string | null;
  tariff_repair?: TariffRepairItem | null;
  tep_damage_repair?: TepDamageRepairItem[] | null;
  update_by?: string | null;
  update_dt?: string | null;
  public actions?: string[]

  constructor(item: Partial<TemplateEstPartItem> = {}) {
    // Object.assign(this, { guid: '', ...item });
    this.actions = item.actions;
    this.action = item.action;
    this.guid = item.guid;
    this.description = item.description;
    this.comment=item.comment;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
    this.hour = item.hour;
    this.quantity = item.quantity;
    this.location_cv = item.location_cv;
    this.remarks = item.remarks;
    this.tariff_repair_guid = item.tariff_repair_guid;
    this.tariff_repair = item.tariff_repair;
    this.tep_damage_repair = item.tep_damage_repair;


  }
}

export class TemplateEstimateCustomerItem {

  action?: string = 'NEW';
  create_by?: string | null;
  create_dt?: string | null;
  delete_dt?: string | null;
  guid?: string | null;
  template_est_guid?: string | null;
  update_by?: string | null;
  update_dt?: string | null;

  customer_company?: CustomerCompanyItem | null;
  customer_company_guid?: string | null;

  constructor(item: Partial<TemplateEstimateCustomerItem> = {}) {
    // Object.assign(this, { guid: '', ...item });

    this.action = item.action;
    this.guid = item.guid;
    this.template_est_guid = item.template_est_guid;
    this.customer_company_guid = item.customer_company_guid
    this.customer_company = item.customer_company;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;

  }

}
export class MasterTemplateItem extends MasterTemplateGo {
  public template_est_customer?: TemplateEstimateCustomerItem[] | null;
  public template_est_part?: TemplateEstPartItem[] | null;
  public totalMaterialCost?: number = 0;


  constructor(item: Partial<MasterTemplateItem> = {}) {
    super(item);
    this.template_est_customer = item.template_est_customer;
    this.template_est_part = item.template_est_part;
    this.totalMaterialCost = this.getTotalMaterialCost();
  }


  public getTotalMaterialCost(): number {
    if (!this.template_est_part) {
      return 0; // If template_est_part is null, return 0
    }

    return this.template_est_part.reduce((total, part) => {
      // Check if tariff_repair and material_cost are defined
      const materialCost = part.tariff_repair?.material_cost ?? 0;
      return total + materialCost;
    }, 0);
  }

}
export interface MasterTemplateResult {
  items: MasterTemplateItem[];
  totalCount: number;
}

export const GET_ESTIMATE_TEMPLATE_ONLY_QUERY = gql`
  query queryTemplateEstimation($where: template_estFilterInput, $order:[template_estSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    MasterTemplateResult : queryTemplateEstimation(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
      create_by
      create_dt
      delete_dt
      guid
      remarks
      labour_cost_discount
      material_cost_discount
      template_name
      type_cv
      update_by
      update_dt
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

export const GET_ESTIMATE_TEMPLATE_QUERY = gql`
  query queryTemplateEstimation($where: template_estFilterInput, $order:[template_estSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    MasterTemplateResult : queryTemplateEstimation(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
      
      create_by
      create_dt
      delete_dt
      guid
      labour_cost_discount
      material_cost_discount
      template_name
      remarks
      type_cv
      update_by
      update_dt
      template_est_customer(where:{delete_dt:{eq:null}})  {
        create_by
        create_dt
        customer_company_guid
        delete_dt
        guid
        template_est_guid
        update_by
        update_dt
        customer_company {
          guid
          code
          name
        }
      }
      template_est_part(where:{delete_dt:{eq:null}}) {
        guid
        description
        delete_dt
        create_by
        create_dt
        update_by
        update_dt
        hour
        quantity
        comment
        location_cv
        remarks
        tariff_repair_guid
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
        tep_damage_repair {
          code_cv
          code_type
          create_by
          create_dt
          delete_dt
          guid
          tep_guid
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
      totalCount
    }
  }
`;

export const GET_ESTIMATE_TEMPLATE_FOR_REPAIR = gql`
  query queryTemplateEstimation($where: template_estFilterInput, $order:[template_estSortInput!], $customer_company_guid: String) {
    resultList: queryTemplateEstimation(where: $where, order:$order) {
      nodes {
        create_by
        create_dt
        delete_dt
        guid
        labour_cost_discount
        material_cost_discount
        template_name
        remarks
        type_cv
        update_by
        update_dt
        template_est_customer {
          customer_company_guid
          delete_dt
          guid
          update_dt
        }
        template_est_part {
          guid
          description
          delete_dt
          create_by
          create_dt
          update_by
          update_dt
          hour
          quantity
          comment
          location_cv
          remarks
          tariff_repair_guid
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
          tep_damage_repair {
            code_cv
            code_type
            create_by
            create_dt
            delete_dt
            guid
            tep_guid
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
      totalCount
    }
  }
`;

export const ADD_MASTER_TEMPLATE_ESTIMATION = gql`
  mutation addTemplateEstimation($newTemplateEstimate:template_estInput!) {
    addTemplateEstimation(newTemplateEstimate: $newTemplateEstimate)
  }
`;

export const UPDATE_MASTER_TEMPLATE_ESTIMATION = gql`
  mutation updateTemplateEstimation($editTemplateEstimate:template_estInput!) {
    updateTemplateEstimation(editTemplateEsimate: $editTemplateEstimate)
  }
`;

export class MasterEstimateTemplateDS extends BaseDataSource<MasterTemplateItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  SearchEstimateTemplateOnly(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<MasterTemplateItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_ESTIMATE_TEMPLATE_ONLY_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as MasterTemplateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const masterTemplateResult = result.MasterTemplateResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(masterTemplateResult.nodes);
          this.pageInfo = masterTemplateResult.pageInfo;
          this.totalCount = masterTemplateResult.totalCount;
          return masterTemplateResult.nodes;
        })
      );
  }

  SearchEstimateTemplate(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<MasterTemplateItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_ESTIMATE_TEMPLATE_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as MasterTemplateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const masterTemplateResult = result.MasterTemplateResult || { nodes: [], totalCount: 0 };
          const masterTemplateItems: MasterTemplateItem[] = masterTemplateResult.nodes.map((node: any) => new MasterTemplateItem(node));

          this.dataSubject.next(masterTemplateResult.nodes);
          this.pageInfo = masterTemplateResult.pageInfo;
          this.totalCount = masterTemplateResult.totalCount;
          return masterTemplateItems;
        })
      );
  }

  searchEstimateTemplateForRepair(where?: any, order?: any, customer_company_guid?: string): Observable<MasterTemplateItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_ESTIMATE_TEMPLATE_FOR_REPAIR,
        variables: { where, order, customer_company_guid },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as MasterTemplateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          const masterTemplateItems: MasterTemplateItem[] = resultList.nodes.map((node: any) => new MasterTemplateItem(node));
          this.dataSubject.next(resultList.nodes);
          return masterTemplateItems;
        })
      );
  }

  AddMasterTemplate(newTemplateEstimate: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_MASTER_TEMPLATE_ESTIMATION,
      variables: {
        newTemplateEstimate
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  UpdateMasterTemplate(editTemplateEstimate: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_MASTER_TEMPLATE_ESTIMATION,
      variables: {
        editTemplateEstimate
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  createTepDamage(guid: string | undefined, tep_guid: string | undefined, code_val: string): TepDamageRepairItem {
    return new TepDamageRepairItem({ guid: guid, tep_guid: tep_guid, code_cv: code_val, code_type: 0 })
  }

  createTepRepair(guid: string | undefined, tep_guid: string | undefined, code_val: string): TepDamageRepairItem {
    return new TepDamageRepairItem({ guid: guid, tep_guid: tep_guid, code_cv: code_val, code_type: 1 })
  }
}
