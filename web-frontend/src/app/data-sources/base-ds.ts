import { DataSource } from '@angular/cdk/collections';
import { PageInfo } from '@core/models/pageInfo';
import { BehaviorSubject, Observable, of } from 'rxjs';

export abstract class BaseDataSource<T> extends DataSource<T> {
    public dataSubject = new BehaviorSubject<T[]>([]);
    public loadingSubject = new BehaviorSubject<boolean>(false);
    public pageInfo?: PageInfo;

    public loading$ = this.loadingSubject.asObservable();

    connect(): Observable<T[]> {
        return this.dataSubject.asObservable();
    }

    disconnect(): void {
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }

    public addDeleteDtCriteria(criteria: any) {
      return {
        and: [
          { delete_dt: { eq: null } },
          criteria
        ]
      };
    }

    // public addCreateDtDescOrder(order: any) {
    //   return {
    //     ...order,
    //     create_dt: "DESC"
    //   };
    // }
}
