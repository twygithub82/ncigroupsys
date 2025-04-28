import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class SearchCriteriaService {
  private searchCriteriaSubject = new BehaviorSubject<any>(null);
  searchCriteria$ = this.searchCriteriaSubject.asObservable();
  private criteria: any = {};

  constructor() { }

  setCriteria(criteria: any): void {
    this.criteria = criteria;
    this.searchCriteriaSubject.next(criteria);
  }

  getCriteria(): any {
    return this.criteria;
  }

  getCurrentCriteria(): any {
    return this.searchCriteriaSubject.getValue();
  }

  clearCriteria(): void {
    this.criteria = {};
    this.searchCriteriaSubject.next(null);
  }
}
