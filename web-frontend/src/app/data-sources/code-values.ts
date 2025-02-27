import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { BaseDataSource } from './base-ds';
import { ApolloError } from '@apollo/client/errors';

export class CodeValuesItem {
  public guid?: string;
  public description?: string;
  public code_val_type?: string;
  public code_val?: string;
  public child_code?: string;
  public sequence?: number;
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
    this.sequence = item.sequence;
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
      sequence
    }
  `).join('\n');

  return gql`
    query queryCodeValuesByTypeQueries(${aliases.map(alias => `$${alias}Type: CodeValuesRequestInput!`).join(', ')}) {
      ${queries}
    }
  `;
}

export function addDefaultSelectOption(list: CodeValuesItem[] | undefined, desc: string = '-- Select --', val: string = ''): CodeValuesItem[] {
  // Check if the list already contains the default value
  list = list ?? [];
  const containsDefault = list.some(item => item.code_val === val);

  // If the default value is not present, add it to the list
  if (!containsDefault) {
    // Create a new array with the default option added at the beginning
    return [{ code_val: val, description: desc }, ...list];
  }

  return list;
}

export const GET_ALL_CLASS_NO = gql`
 query {
 resultList: queryCodeValues(
    where: { code_val_type: { startsWith: "CLASS" } },
    order: {  code_val_type: ASC,sequence: ASC },
    first:100
  ) {
    totalCount
    nodes {
      code_val
      code_val_type
      description
      guid
      sequence
    }
  }
}
`;



export class CodeValuesDS extends BaseDataSource<CodeValuesItem> {
  private itemsSubjects = new Map<string, BehaviorSubject<CodeValuesItem[]>>();
  private itemsSubject = new BehaviorSubject<CodeValuesItem[]>([]);
  public totalCounts = new Map<string, number>();
  constructor(private apollo: Apollo) {
    super();
  }

  getAllClassNo(): Observable<CodeValuesItem[]> {
   this.loadingSubject.next(true);
  
      return this.apollo
        .query<any>({
          query: GET_ALL_CLASS_NO,
          fetchPolicy: 'no-cache' // Ensure fresh data
        })
        .pipe(
          map((result) => result.data),
          catchError((error: ApolloError) => {
            console.error('GraphQL Error:', error);
            return of([] as CodeValuesItem[]); // Return an empty array on error
          }),
          finalize(() => this.loadingSubject.next(false)),
          map((result) => {
            const resultList = result.resultList || { nodes: [], totalCount: 0 };
            this.dataSubject.next(resultList.nodes);
            this.totalCount = resultList.totalCount;
            this.pageInfo = resultList.pageInfo;
            return resultList.nodes;
          })
        );
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

  getCodeValuesByTypeAsync(queries: { alias: string, codeValType: string }[]): Promise<void> {
    this.loadingSubject.next(true);

    return new Promise((resolve, reject) => {
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
          catchError(() => {
            const fallbackData = aliases.reduce((acc: any, alias) => {
              acc[alias] = [];
              return acc;
            }, {});
            return of(fallbackData);
          }),
          finalize(() => this.loadingSubject.next(false))
        )
        .subscribe({
          next: (result) => {
            aliases.forEach(alias => {
              const subject = this.itemsSubjects.get(alias) || new BehaviorSubject<CodeValuesItem[]>([]);
              subject.next(result[alias]);
              this.itemsSubjects.set(alias, subject);
              this.totalCounts.set(alias, result[alias].length);
            });
            resolve();
          },
          error: (err) => reject(err),
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

  getCodeObject(codeValType: string | undefined, codeValItem: CodeValuesItem[]): CodeValuesItem | undefined {
    let cv = codeValItem?.filter(cv => cv.code_val === codeValType);
    if (cv?.length) {
      return cv[0];
    }
    return undefined;
  }


}
