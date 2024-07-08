import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';

export class TankItem {
  public guid?: string;
  public unit_type?: string;
  public description?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<TankItem> = {}) {
    this.guid = item.guid;
    this.unit_type = item.unit_type;
    this.description = item.description || '';
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export interface TankResult {
  items: TankItem[];
  totalCount: number;
}

export const GET_TANK = gql`
  query queryTank {
    queryTank {
      guid
      unit_type
      description
    }
  }
`;

export class TankDS extends BaseDataSource<TankItem> {
  public totalCount = 0;
  constructor(private apollo: Apollo) {
    super();
  }

  loadItems(): Observable<TankItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_TANK
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tankList = result.queryTank || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tankList);
          this.totalCount = tankList.length;
          return tankList;
        })
      );
    // .subscribe((result) => {
    //   this.itemsSubject.next(result.queryTank);
    //   this.totalCount = result.totalCount;
    // });
  }
}
