import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class SearchCriteriaService {
  private criteria: any = {};

  constructor() { }

  setCriteria(criteria: any): void {
    this.criteria = criteria;
  }

  getCriteria(): any {
    return this.criteria;
  }

  clearCriteria(): void {
    this.criteria = {};
  }
}


@Injectable({ providedIn: 'root' })
export class SearchStateService {
  private searchStates: { [pageKey: string]: { criteria: any, pagination: any } } = {};

  constructor() { }

  setCriteria(pageKey: string, criteria: any): void {
    if (!this.searchStates[pageKey]) {
      this.searchStates[pageKey] = { criteria: null, pagination: null };
    }
    this.searchStates[pageKey].criteria = criteria;
  }

  getCriteria(pageKey: string): any {
    return this.searchStates[pageKey]?.criteria || null;
  }

  setPagination(pageKey: string, pagination: any): void {
    if (!this.searchStates[pageKey]) {
      this.searchStates[pageKey] = { criteria: null, pagination: null };
    }
    this.searchStates[pageKey].pagination = pagination;
  }

  getPagination(pageKey: string): any {
    return this.searchStates[pageKey]?.pagination || null;
  }

  clear(pageKey: string): void {
    delete this.searchStates[pageKey];
  }

  clearOtherPages(currentPageKey: string): void {
    for (const key in this.searchStates) {
      if (key !== currentPageKey) {
        delete this.searchStates[key];
      }
    }
  }

  clearOtherPagesKeys(currentPageKey: string[]): void {
    for (const key in this.searchStates) {
      if (!currentPageKey.includes(key)) {
        delete this.searchStates[key];
      }
    }
  }
}
