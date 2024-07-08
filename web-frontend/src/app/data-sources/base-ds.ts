import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';

export abstract class BaseDataSource<T> extends DataSource<T> {
    public dataSubject = new BehaviorSubject<T[]>([]);
    public loadingSubject = new BehaviorSubject<boolean>(false);

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
}
