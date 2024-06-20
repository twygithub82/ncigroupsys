import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';

export class CodeValuesItem {
    public guid?: string;
    public description?: string;
    public code_val_type?: string;
    public code_val?: string;
    public child_code?: string;
    public create_dt?: number;
    public create_by?: string;
    public update_dt?: number;
    public update_by?: string;
    public delete_dt?: number;

    constructor(item: Partial<CodeValuesItem> = {}) {
        this.guid = item.guid;
        this.description = item.description;
        this.code_val_type = item.code_val_type;
        this.code_val = item.code_val;
        this.child_code = item.child_code;
        this.create_dt = item.create_dt;
        this.create_by = item.create_by;
        this.update_dt = item.update_dt;
        this.update_by = item.update_by;
        this.delete_dt = item.delete_dt;
    }
}

export interface CodeValuesResult {
    items: CodeValuesItem[];
    totalCount: number;
}

const GET_ITEMS_QUERY = gql`
  query GetItems($pageIndex: Int, $pageSize: Int, $sortField: String, $sortDirection: String) {
    items(pageIndex: $pageIndex, pageSize: $pageSize, sortField: $sortField, sortDirection: $sortDirection) {
      items {
        id
        name
        value
      }
      totalCount
    }
  }
`;

export class CodeValuesDS extends DataSource<CodeValuesItem> {
    private itemsSubject = new BehaviorSubject<CodeValuesItem[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public totalCount = 0;
    constructor(private apollo: Apollo) {
        super();
    }
    loadItems(pageIndex: number, pageSize: number, sortField: string, sortDirection: string) {
        this.loadingSubject.next(true);

        this.apollo
            .watchQuery<CodeValuesResult>({
                query: GET_ITEMS_QUERY,
                variables: { pageIndex, pageSize, sortField, sortDirection },
            })
            .valueChanges.pipe(
                map((result) => result.data),
                catchError(() => of({ items: [], totalCount: 0 })),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((result) => {
                this.itemsSubject.next(result.items);
                this.totalCount = result.totalCount;
            });
    }
    connect(): Observable<CodeValuesItem[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
    }
}
