// src/app/search-criteria.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class SearchCriteriaService {
  private criteria: any = {};

  constructor() {}

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
