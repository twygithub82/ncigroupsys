import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
// import { CleaningCategoryItem } from './cleaning_category';
// import { CleaningMethodItem } from './cleaning_method';
import { CLEANING_CATEGORY_FRAGMENT, CLEANING_METHOD_FRAGMENT } from './fragments';
import { BaseDataSource } from './base-ds';
export class InGateGO {
  public guid?: string;
  public cleaning_method_guid?: string;
  public cleaning_category_guid?: string;
  public msds_guid?: string;
  public cargo?: string;
  public alias?: string;
  public un_no?: string;
  public flash_point?: string;
  public description?: string;
  public class_cv?: string;
  public hazard_level_cv?: string;
  public ban_type_cv?: string;
  public nature_cv?: string;
  public open_on_gate_cv?: string;
  public in_gate_alert?: string;
  public depot_note?: number;
  public remarks?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<InGateGO> = {}) {
    this.guid = item.guid;
    this.cleaning_method_guid = item.cleaning_method_guid;
    this.cleaning_category_guid = item.cleaning_category_guid;
    this.msds_guid = item.msds_guid;
    this.cargo = item.cargo;
    this.alias = item.alias;
    this.un_no = item.un_no;
    this.flash_point = item.flash_point;
    this.description = item.description;
    this.class_cv = item.class_cv;
    this.hazard_level_cv = item.hazard_level_cv;
    this.ban_type_cv = item.ban_type_cv;
    this.nature_cv = item.nature_cv;
    this.open_on_gate_cv = item.open_on_gate_cv;
    this.in_gate_alert = item.in_gate_alert;
    this.depot_note = item.depot_note;
    this.remarks = item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class InGateItem extends InGateGO {
  // public cleaning_category?: CleaningCategoryItem;
  // public cleaning_method?: CleaningMethodItem;

  // constructor(item: Partial<InGateItem> = {}) {
  //   super(item);
  //   this.cleaning_category = item.cleaning_category;
  //   this.cleaning_method = item.cleaning_method;
  // }
}

export interface InGateResult {
  items: InGateItem[];
  totalCount: number;
}

export const TARIFF_CLEANING_FRAGMENT = gql`
  fragment TariffCleaningFields on storing_order_tariff_cleaning {
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
`;

export const GET_TARIFF_CLEANING_QUERY = gql`
  query queryTariffCleaning($where: tariff_cleaningFilterInput) {
    lastCargo: queryTariffCleaning(where: $where) {
      nodes {
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

export const GET_TARIFF_CLEANING_QUERY_WTIH_CATEGORY_METHOD = gql`
  query queryTariffCleaning($where: tariff_cleaningFilterInput) {
    lastCargo: queryTariffCleaning(where: $where) {
      nodes {
        alias
        ban_type_cv
        cargo
        class_child_cv
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
        cleaning_category_with_tariff {
          ...CleaningCategoryFragment
        }
        cleaning_method_with_tariff {
          ...CleaningMethodFragment
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
  ${CLEANING_METHOD_FRAGMENT}
  ${CLEANING_CATEGORY_FRAGMENT}
`;

export class TariffCleaningDS extends BaseDataSource<InGateItem> {
  public totalCount = 0;
  constructor(private apollo: Apollo) {
    super();
  }

  loadItemsWithCategoryMethod(where?: any, order?: any): Observable<InGateItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_TARIFF_CLEANING_QUERY_WTIH_CATEGORY_METHOD,
        variables: { where, order }
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const lastCargo = result.lastCargo || { nodes: [], totalCount: 0 };
          this.dataSubject.next(lastCargo.nodes);
          this.totalCount = lastCargo.totalCount;
          return lastCargo.nodes;
        })
      );
  }

  loadItems(where?: any, order?: any): Observable<InGateItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_TARIFF_CLEANING_QUERY,
        variables: { where, order }
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const lastCargo = result.lastCargo || { nodes: [], totalCount: 0 };
          this.dataSubject.next(lastCargo.nodes);
          this.totalCount = lastCargo.totalCount;
          return lastCargo.nodes;
        })
      );
  }
}
