import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';

export class TariffCleaningItem {
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

    constructor(item: Partial<TariffCleaningItem> = {}) {
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

export interface TariffCleaningResult {
    items: TariffCleaningItem[];
    totalCount: number;
}

export const GET_TARIFF_CLEANING_QUERY = gql`
  query queryTariffCleaning($where: tariff_cleaningFilterInput) {
    lastCargo: queryTariffCleaning(where: $where) {
      nodes {
        guid
        cargo
        flash_point
        remarks
        open_on_gate_cv
      }
    }
  }
`;

export class TariffCleaningDS extends DataSource<TariffCleaningItem> {
    private itemsSubjects = new BehaviorSubject<TariffCleaningItem[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public totalCount = 0;
    constructor(private apollo: Apollo) {
        super();
    }
    loadItems(where?: any, order?: any) {
        this.loadingSubject.next(true);
        this.apollo.watchQuery<any>({
            query: GET_TARIFF_CLEANING_QUERY,
            variables: { where, order }
        })
        .valueChanges
        .pipe(
            map((result) => result.data),
            catchError((error: ApolloError) => {
                console.error('GraphQL Error:', error);
                return of([] as TariffCleaningItem[]); // Return an empty array on error
            }),
            finalize(() => this.loadingSubject.next(false)),
        )
        .subscribe(result => {
            this.itemsSubjects.next(result.lastCargo.nodes);
            this.totalCount = result.totalCount;
        });
    }

    connect(): Observable<TariffCleaningItem[]> {
        return this.itemsSubjects.asObservable();
    }

    disconnect(): void {
        this.itemsSubjects.complete();
        this.loadingSubject.complete();
    }
}
