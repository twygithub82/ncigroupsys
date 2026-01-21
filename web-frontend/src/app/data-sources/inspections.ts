import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';
import { UserItem } from './user';

export class InspectionsGO {
  public guid?: string = '';
  public sot_guid?: string;
  public aspnetusers_guid?: string;
  public inspect_dt?: number;
  public marked_tank_section?: string;
  public marked_front_section?: string;
  public marked_rear_section?: string;
  public type_cv?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<InspectionsGO> = {}) {
    this.guid = item?.guid || '';
    this.sot_guid = item?.sot_guid;
    this.aspnetusers_guid = item?.aspnetusers_guid;
    this.inspect_dt = item?.inspect_dt;
    this.marked_tank_section = item?.marked_tank_section;
    this.marked_front_section = item?.marked_front_section;
    this.marked_rear_section = item?.marked_rear_section;
    this.type_cv = item?.type_cv;
    this.create_dt = item?.create_dt;
    this.create_by = item?.create_by;
    this.update_dt = item?.update_dt;
    this.update_by = item?.update_by;
    this.delete_dt = item?.delete_dt;
  }
}

export class InspectionsItem extends InspectionsGO {
  public storing_order_tank?: StoringOrderTankItem;
  public aspnetusers?: UserItem;
  public surface_types?: SurfaceTypesItem[];

  constructor(item: Partial<InspectionsItem> = {}) {
    super(item)
    this.storing_order_tank = item?.storing_order_tank;
    this.aspnetusers = item?.aspnetusers;
    this.surface_types = item?.surface_types;
  }
}

export class SurfaceTypesGO {
  public guid?: string = '';
  public inspection_guid?: string;
  public type_cv?: string;
  public remarks?: string;
  public value?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<SurfaceTypesGO> = {}) {
    this.guid = item?.guid || '';
    this.inspection_guid = item?.inspection_guid;
    this.type_cv = item?.type_cv;
    this.remarks = item?.remarks;
    this.value = item?.value;
    this.create_dt = item?.create_dt;
    this.create_by = item?.create_by;
    this.update_dt = item?.update_dt;
    this.update_by = item?.update_by;
    this.delete_dt = item?.delete_dt;
  }
}

export class SurfaceTypesItem extends SurfaceTypesGO {
  public inspection?: InspectionsItem;

  constructor(item: Partial<SurfaceTypesItem> = {}) {
    super(item)
    this.inspection = item?.inspection;
  }
}

export interface InspectionsResult {
  items: InspectionsGO[];
  totalCount: number;
}

export const GET_INSPECTIONS_FOR_TANK_MOVEMENT = gql`
  query queryInspections($where: inspectionsFilterInput) {
    resultList: queryInspections(where: $where) {
      nodes {
        aspnetusers_guid
        create_by
        create_dt
        delete_dt
        guid
        inspect_dt
        marked_front_section
        marked_rear_section
        marked_tank_section
        sot_guid
        type_cv
        update_by
        update_dt
        surface_types {
          create_by
          create_dt
          delete_dt
          guid
          inspection_guid
          remarks
          type_cv
          update_by
          update_dt
          value
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

export const ADD_INSPECTIONS = gql`
  mutation addInspections($newInspections: inspectionsInput!, $surfaceTypesList: [surface_typesInput!]!) {
    addInspections(newInspections: $newInspections, surfaceTypesList: $surfaceTypesList)
  }
`;

export class InspectionsDS extends BaseDataSource<InspectionsItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  getInspectionsForTankMovement(sot_guid?: any): Observable<InspectionsItem[]> {
    const where = {
      sot_guid: { eq: sot_guid }
    }
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_INSPECTIONS_FOR_TANK_MOVEMENT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InspectionsItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          this.pageInfo = retResult.pageInfo;
          return retResult.nodes;
        })
      );
  }

  addInGate(inspect: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: ADD_INSPECTIONS,
      variables: {
        inspect
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  canAmend(inspect?: any) {
    return true;
  }
}

export interface InspectionType {
  type: string;
  name: string;
  displayName: string;
  color: string;
  shape: 'circle' | 'square' | 'triangle' | 'cross' | 'diagonal';
  description?: string;
  enabled?: boolean;
}

export function getDefaultInspectionTypes(): InspectionType[] {
  return [
    {
      type: 'discoloration',
      name: 'discoloration',
      displayName: 'Discoloration',
      color: '#FF6B35',      // Orange-Red
      shape: 'circle',
      enabled: true
    },
    {
      type: 'scratches',
      name: 'scratches',
      displayName: 'Scratches',
      color: '#4ECDC4',      // Turquoise
      shape: 'diagonal',
      enabled: true
    },
    {
      type: 'gouges',
      name: 'gouges',
      displayName: 'Gouges',
      color: '#C44569',      // Deep Pink
      shape: 'triangle',
      enabled: true
    },
    {
      type: 'rust',
      name: 'rust',
      displayName: 'Rust',
      color: '#F38181',      // Light Coral
      shape: 'square',
      enabled: true
    },
    {
      type: 'stain',
      name: 'stain',
      displayName: 'Stain',
      color: '#AA96DA',      // Lavender Purple
      shape: 'cross',
      enabled: true
    },
    {
      type: 'pitting',
      name: 'pitting',
      displayName: 'Pitting',
      color: '#FFD93D',      // Golden Yellow
      shape: 'circle',
      enabled: true
    },
    {
      type: 'pinhole',
      name: 'pinhole',
      displayName: 'Pinhole',
      color: '#6BCB77',      // Green
      shape: 'square',
      enabled: true
    },
    {
      type: 'crated_pitting',
      name: 'crated_pitting',
      displayName: 'Crated Pitting',
      color: '#4D96FF',      // Sky Blue
      shape: 'diagonal',
      enabled: true
    },
    {
      type: 'harden_stain',
      name: 'harden_stain',
      displayName: 'Harden Stain',
      color: '#845EC2',      // Royal Purple
      shape: 'triangle',
      enabled: true
    }
  ];
}