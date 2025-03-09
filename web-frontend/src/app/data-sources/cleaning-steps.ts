import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { CLEANING_METHOD_FRAGMENT } from './fragments';
import { BaseDataSource } from './base-ds';
import { CleaningFormulaItem } from './cleaning-formulas';


export const UPDATE_CLEANING_STEPS = gql`
  mutation updateCleaningMethodFormula($cf: CleaningMethodFormulaRequestInput!) {
    updateCleaningMethodFormula(newCleanFormula: $cf)
  }
  `;

  

export class CleaningStepItem {
    public guid?: string;
     public sequence?: number;
     public method_guid?:string;
     public formula_guid?:string;
     public create_dt?: number;
     public create_by?: string;
     public update_dt?: number;
     public update_by?: string;
     public delete_dt?: number;
     public cleaning_formula?:CleaningFormulaItem;
   
     constructor(item: Partial<CleaningStepItem> = {}) {
         this.guid = item.guid;
         this.sequence = item.sequence;
         this.formula_guid = item.formula_guid;
         this.method_guid = item.method_guid;
         this.create_dt = item.create_dt;
         this.create_by = item.create_by;
         this.update_dt = item.update_dt;
         this.update_by = item.update_by;
         this.delete_dt = item.delete_dt;
         this.cleaning_formula=item.cleaning_formula;
     }
}

