import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { BaseDataSource } from './base-ds';

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

export function getCodeValuesByTypeQueries(aliases: string[]): DocumentNode {
  const queries = aliases.map(alias => `
    ${alias}: queryCodeValuesByType(codeValuesType: $${alias}Type, order: { sequence: ASC }) {
      child_code
      code_val_type
      code_val
      description
      guid
    }
  `).join('\n');

  return gql`
    query queryCodeValuesByTypeQueries(${aliases.map(alias => `$${alias}Type: CodeValuesRequestInput!`).join(', ')}) {
      ${queries}
    }
  `;
}

export function addDefaultSelectOption(list: CodeValuesItem[], desc: string = '-- Select --', val: string = ''): CodeValuesItem[] {
  // Check if the list already contains the default value
  const containsDefault = list.some(item => item.code_val === val);

  // If the default value is not present, add it to the list
  if (!containsDefault) {
    // Create a new array with the default option added at the beginning
    return [{ code_val: val, description: desc }, ...list];
  }

  return list;
}

export class CodeValuesDS extends BaseDataSource<CodeValuesItem> {
  private itemsSubjects = new Map<string, BehaviorSubject<CodeValuesItem[]>>();
  private itemsSubject = new BehaviorSubject<CodeValuesItem[]>([]);
  public totalCounts = new Map<string, number>();
  constructor(private apollo: Apollo) {
    super();
  }
  getCodeValuesByType(queries: { alias: string, codeValType: string }[]) {
    this.loadingSubject.next(true);

    const aliases = queries.map(query => query.alias);
    const variables = queries.reduce((acc, query) => {
      acc[`${query.alias}Type`] = { code_val_type: query.codeValType };
      return acc;
    }, {} as any);
      
    const dynamicQuery: DocumentNode = getCodeValuesByTypeQueries(aliases);
    
    this.apollo
      .query<any>({
        query: dynamicQuery,
        variables: variables
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of(aliases.reduce((acc: any, alias) => {
          acc[alias] = [];
          return acc;
        }, {}))),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(result => {
        aliases.forEach(alias => {
          const subject = this.itemsSubjects.get(alias) || new BehaviorSubject<CodeValuesItem[]>([]);
          subject.next(result[alias]);
          this.itemsSubjects.set(alias, subject);
          this.totalCounts.set(alias, result[alias].length);
        });
      });
  }

  override disconnect(): void {
    this.itemsSubjects.forEach(subject => subject.complete());
    this.itemsSubject.complete();
    this.loadingSubject.complete();
  }

  connectAlias(alias: string): Observable<CodeValuesItem[]> {
    let subject = this.itemsSubjects.get(alias);
    if (!subject) {
      subject = new BehaviorSubject<CodeValuesItem[]>([]);
      this.itemsSubjects.set(alias, subject);
    }
    return subject.asObservable();
  }

  getCodeDescription(codeValType: string | undefined, codeValItem: CodeValuesItem[]): string | undefined {
    let cv = codeValItem?.filter(cv => cv.code_val === codeValType);
    if (cv?.length) {
      return cv[0].description;
    }
    return '';
  }
}
