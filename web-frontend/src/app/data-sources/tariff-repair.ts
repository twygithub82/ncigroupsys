import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';

export class TariffRepairItem {
  public guid?: string;
  public alias?: string;

  public group_name_cv?: string;
  public subgroup_name_cv?: string;
  public part_name?: string;
  public dimension?: string;
  public height_diameter?: number
  public height_diameter_unit_cv?: string;
  public width_diameter?: number;
  public width_diameter_unit_cv?: string;
  public thickness?: number;
  public thickness_unit_cv?: string;
  public length?: number;
  public length_unit_cv?: string;
  public labour_hour?: number;
  public material_cost?: number;
  public remarks?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<TariffRepairItem> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    this.group_name_cv = item.group_name_cv;
    this.subgroup_name_cv = item.subgroup_name_cv;
    this.part_name = item.part_name;
    this.alias = item.alias;
    this.dimension = item.dimension;
    this.height_diameter = item.height_diameter;
    this.height_diameter_unit_cv = item.height_diameter_unit_cv;
    this.width_diameter = item.width_diameter;
    this.width_diameter_unit_cv = item.width_diameter_unit_cv;
    this.thickness = item.thickness;
    this.thickness_unit_cv = item.thickness_unit_cv;
    this.length = item.length;
    this.length_unit_cv = item.length_unit_cv;
    this.labour_hour = item.labour_hour;
    this.material_cost = item.material_cost;
    this.remarks = item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class TariffRepairLengthItem {
  public length?: number;
  public length_unit_cv?: string;
  constructor(item: Partial<TariffRepairItem> = {}) {
    Object.assign(this, { ...item });
  }

  public ToString(): any {
    let ret = '';
    if (this.length_unit_cv) {
      ret = `${this.length}${this.length_unit_cv}`;
    }
    return ret;
  }
}

export interface TariffLabourResult {
  items: TariffRepairItem[];
  totalCount: number;
}

export const GET_TARIFF_REPAIR_QUERY = gql`
  query queryTariffRepair($where: tariff_repairFilterInput, $order:[tariff_repairSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    tariffRepairResult : queryTariffRepair(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
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

export const GET_TARIFF_REPAIR_QUERY_WITH_COUNT = gql`
  query queryTariffRepairWithCount($where: TariffRepairResultFilterInput, $order:[TariffRepairResultSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    tariffRepairResult : queryTariffRepairWithCount(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        tank_count
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

export const GET_DISTINCT_PART_NAME = gql`
  query queryDistinctPartName($groupName: String, $subgroupName: String, $part_name: String) {
    resultList: queryDistinctPartName(groupName: $groupName, subgroupName: $subgroupName, part_name: $part_name)
  }
`;

export const GET_DISTINCT_DIMENSION = gql`
  query queryDistinctDimension($partName: String) {
    resultList: queryDistinctDimension(partName: $partName)
  }
`;

export const GET_DISTINCT_LENGTH = gql`
  query queryDistinctLength($partName: String, $dimension: String) {
    resultList: queryDistinctLength(partName: $partName, dimension: $dimension) {
      length
      length_unit_cv
    }
  }
`;

export const ADD_TARIFF_REPAIR = gql`
  mutation addTariffRepair($td: tariff_repairInput!) {
    addTariffRepair(newTariffRepair: $td)
  }
`;

export const UPDATE_TARIFF_REPAIR = gql`
  mutation updateTariffRepair($td: tariff_repairInput!) {
    updateTariffRepair(updateTariffRepair: $td)
  }
`;

export const UPDATE_TARIFF_REPAIRS_MATERIAL_COST = gql`
  mutation updateTariffRepair_MaterialCost($group_name_cv: [String!], $subgroup_name_cv: [String!],
    $part_name: String,$dimension: String, $length: Int, $guid: [String], $material_cost_percentage: Float!, $labour_hour_percentage: Float!) {
    updateTariffRepair_MaterialCost(group_name_cv: $group_name_cv, subgroup_name_cv: $subgroup_name_cv,
    part_name: $part_name, dimension: $dimension, length: $length, guid: $guid, material_cost_percentage: $material_cost_percentage,
    labour_hour_percentage: $labour_hour_percentage)
  }
`;

export const UPDATE_TARIFF_REPAIRS = gql`
  mutation updateTariffRepairs($updatedTariffRepair_guids: [String!]!,$group_name_cv:String!,$subgroup_name_cv:String!,
    $dimension:String!,$height_diameter:Float!,$height_diameter_unit_cv:String!,$width_diameter:Float!,$width_diameter_unit_cv:String!,$labour_hour:Float!,$length:Float!,
    $length_unit_cv:String!,$material_cost:Float!,$part_name:String!,$alias:String!,$thickness:Float!,$thickness_unit_cv:String!,$remarks:String!) {
    updateTariffRepairs(updatedTariffRepair_guids: $updatedTariffRepair_guids,group_name_cv:$group_name_cv,
    subgroup_name_cv:$subgroup_name_cv,dimension:$dimension,height_diameter:$height_diameter,height_diameter_unit_cv:$height_diameter_unit_cv,width_diameter:$width_diameter,
    width_diameter_unit_cv:$width_diameter_unit_cv,labour_hour:$labour_hour,length:$length,length_unit_cv:$length_unit_cv,
    material_cost:$material_cost,part_name:$part_name,alias:$alias,thickness:$thickness,thickness_unit_cv:$thickness_unit_cv,remarks:$remarks)
  }
`;

export const DELETE_TARIFF_REPAIR = gql`
  mutation deleteTariffRepair($deleteTariffRepair_guids: [String!]!) {
    deleteTariffRepair(deleteTariffRepair_guids: $deleteTariffRepair_guids)
  }
`;

export class TariffRepairDS extends BaseDataSource<TariffRepairItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  SearchTariffRepair(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TariffRepairItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_TARIFF_REPAIR_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffRepairItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tariffRepairResult = result.tariffRepairResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tariffRepairResult.nodes);
          this.pageInfo = tariffRepairResult.pageInfo;
          this.totalCount = tariffRepairResult.totalCount;
          return tariffRepairResult.nodes;
        })
      );
  }

  searchDistinctPartName(groupName?: string, subgroupName?: string | null, part_name?: string): Observable<string[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_DISTINCT_PART_NAME,
        variables: { groupName, subgroupName, part_name },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffRepairItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList;
          return resultList;
        })
      );
  }

  searchDistinctDimension(partName?: string): Observable<string[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_DISTINCT_DIMENSION,
        variables: { partName },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffRepairItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList;
          return resultList;
        })
      );
  }

  searchDistinctLength(partName?: string, dimension?: string): Observable<TariffRepairLengthItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_DISTINCT_LENGTH,
        variables: { partName, dimension },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffRepairItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList;
          const tariffRepairLengthItems: TariffRepairLengthItem[] = resultList.map((node: any) => new TariffRepairLengthItem(node));
          return tariffRepairLengthItems;
        })
      );
  }

  searchTariffRepairByPartNameDimLength(partName?: string, dimension?: string, length?: string): Observable<string[]> {
    this.loadingSubject.next(true);
    const where = {
      part_name: { eq: partName },
      dimension: { eq: dimension },
      length: { eq: length }
    }
    return this.apollo
      .query<any>({
        query: GET_TARIFF_REPAIR_QUERY,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffRepairItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tariffRepairResult = result.tariffRepairResult || { nodes: [], totalCount: 0 };
          return tariffRepairResult.nodes;
        })
      );
  }

  SearchTariffRepairWithCount(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TariffRepairItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_TARIFF_REPAIR_QUERY_WITH_COUNT,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffRepairItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tariffRepairResult = result.tariffRepairResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tariffRepairResult.nodes);
          this.pageInfo = tariffRepairResult.pageInfo;
          this.totalCount = tariffRepairResult.totalCount;
          return tariffRepairResult.nodes;
        })
      );
  }

  addNewTariffRepair(td: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_TARIFF_REPAIR,
      variables: {
        td
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  updateTariffRepair(td: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_TARIFF_REPAIR,
      variables: {
        td
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  updateTariffRepairs(updatedTariffRepair_guids: any, group_name_cv: any, subgroup_name_cv: any,
    dimension: any, height_diameter: any, height_diameter_unit_cv: any, width_diameter: any, width_diameter_unit_cv: any, labour_hour: any,
    length: any, length_unit_cv: any, material_cost: any, part_name: any, alias: any, thickness: any, thickness_unit_cv: any, remarks: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_TARIFF_REPAIRS,
      variables: {
        updatedTariffRepair_guids,
        group_name_cv,
        subgroup_name_cv,
        dimension,
        height_diameter,
        height_diameter_unit_cv,
        width_diameter,
        width_diameter_unit_cv,
        labour_hour,
        length,
        length_unit_cv,
        material_cost,
        part_name,
        alias,
        thickness,
        thickness_unit_cv,
        remarks
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  updateTariffRepairs_MaterialCost(group_name_cv: any, subgroup_name_cv: any, part_name: any, dimension: any, length: any,
    guid: any, material_cost_percentage: any, labour_hour_percentage: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_TARIFF_REPAIRS_MATERIAL_COST,
      variables: {
        group_name_cv,
        subgroup_name_cv,
        part_name,
        dimension,
        length,
        guid,
        material_cost_percentage,
        labour_hour_percentage
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  deleteTariffRepair(deleteTariffRepair_guids: any): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_TARIFF_REPAIR,
      variables: {
        deleteTariffRepair_guids
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  displayRepairAlias(row: TariffRepairItem) {
    if (row.length) {
      return `${row.alias} ${row.length}`;
    }
    return `${row.alias}`;
  }
}
