import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
//import {CleaningCategoryDS,CleaningCategoryItem} from 'app/data-sources/cleaning-category';
import { TariffDepotItem } from 'app/data-sources/tariff-depot';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ResidueItem } from 'app/data-sources/residue';
import { ResiduePartItem } from 'app/data-sources/residue-part';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
export interface DialogData {
  action?: string;
  selectedValue?: number;
  langText?: any;
  selectedItem: ResidueItem;
  
}



@Component({
  selector: 'app-tariff-depot-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [provideNgxMask()],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    PreventNonNumericDirective,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
})
export class ResidueEstimateFormDialogComponent_View {
  displayedColumns = [
    //  'select',
    // 'img',
    'seq',
    'desc',
    'qty',
    'qty_unit',
    'unit_price',
    'approve_part',
    'cost'
    // 'gender',
    // 'bDate',
    // 'mobile',
    // 'actions',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;
  deList?: any[]=[];

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  
  lastCargoControl = new UntypedFormControl();
  //custCompClnCatDS :CustomerCompanyCleaningCategoryDS;
  //catDS :CleaningCategoryDS;
  translatedLangText: any = {};
  langText = {
     NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.HEADER',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    SO_NO: 'COMMON-FORM.SO-NO',
    TANK_DETAILS: 'COMMON-FORM.TANK-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    STORAGE: 'COMMON-FORM.STORAGE',
    STEAM: 'COMMON-FORM.STEAM',
    CLEANING: 'COMMON-FORM.CLEANING',
    REPAIR: 'COMMON-FORM.REPAIR',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    REMARKS: 'COMMON-FORM.REMARKS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SAVE: 'COMMON-FORM.SAVE',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    ARE_YOU_SURE_UNO: 'COMMON-FORM.ARE-YOU-SURE-UNDO',
    UNDO: 'COMMON-FORM.UNDO',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
    INVALID: 'COMMON-FORM.INVALID',
    EXISTED: 'COMMON-FORM.EXISTED',
    DUPLICATE: 'COMMON-FORM.DUPLICATE',
    SELECT_ATLEAST_ONE: 'COMMON-FORM.SELECT-ATLEAST-ONE',
    ADD_ATLEAST_ONE: 'COMMON-FORM.ADD-ATLEAST-ONE',
    ROLLBACK_STATUS: 'COMMON-FORM.ROLLBACK-STATUS',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    EXCEEDED: 'COMMON-FORM.EXCEEDED',
    OWNER: 'COMMON-FORM.OWNER',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    LAST_TEST: 'COMMON-FORM.LAST-TEST',
    NEXT_TEST: 'COMMON-FORM.NEXT-TEST',
    GROUP: 'COMMON-FORM.GROUP',
    SUBGROUP: 'COMMON-FORM.SUBGROUP',
    DAMAGE: 'COMMON-FORM.DAMAGE',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    QTY: 'COMMON-FORM.QTY',
    HOUR: 'COMMON-FORM.HOUR',
    PRICE: 'COMMON-FORM.PRICE',
    MATERIAL: 'COMMON-FORM.MATERIAL',
    TEMPLATE: 'COMMON-FORM.TEMPLATE',
    PART_DETAILS: 'COMMON-FORM.PART-DETAILS',
    GROUP_NAME: 'COMMON-FORM.GROUP-NAME',
    SUBGROUP_NAME: 'COMMON-FORM.SUBGROUP-NAME',
    LOCATION: 'COMMON-FORM.LOCATION',
    PART_NAME: 'COMMON-FORM.PART-NAME',
    DIMENSION: 'COMMON-FORM.DIMENSION',
    LENGTH: 'COMMON-FORM.LENGTH',
    PREFIX_DESC: 'COMMON-FORM.PREFIX-DESC',
    MATERIAL_COST: 'COMMON-FORM.MATERIAL-COST$',
    ESTIMATE_DETAILS: 'COMMON-FORM.ESTIMATE-DETAILS',
    ESTIMATE_SUMMARY: 'COMMON-FORM.ESTIMATE-SUMMARY',
    LABOUR: 'COMMON-FORM.LABOUR',
    TOTAL_COST: 'COMMON-FORM.TOTAL-COST',
    LABOUR_DISCOUNT: 'COMMON-FORM.LABOUR-DISCOUNT',
    MATERIAL_DISCOUNT: 'COMMON-FORM.MATERIAL-DISCOUNT',
    NET_COST: 'COMMON-FORM.NET-COST',
    CONVERTED_TO: 'COMMON-FORM.CONVERTED-TO',
    ESTIMATE_NO: 'COMMON-FORM.ESTIMATE-NO',
    SURVEYOR_NAME: 'COMMON-FORM.SURVEYOR-NAME',
    RATE: 'COMMON-FORM.RATE',
    LESSEE: 'COMMON-FORM.LESSEE',
    TOTAL: 'COMMON-FORM.TOTAL',
    PART: 'COMMON-FORM.PART',
    FILTER: 'COMMON-FORM.FILTER',
    DEFAULT: 'COMMON-FORM.DEFAULT',
    COMMENT: 'COMMON-FORM.COMMENT',
    EXPORT: 'COMMON-FORM.EXPORT',
    ADD_ANOTHER: 'COMMON-FORM.ADD-ANOTHER',
    ADD_SUCCESS: 'COMMON-FORM.ADD-SUCCESS',
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    DUPLICATE_PART_DETECTED: 'COMMON-FORM.DUPLICATE-PART-DETECTED',
    BILLING_PROFILE: 'COMMON-FORM.BILLING-PROFILE',
    BILLING_DETAILS: 'COMMON-FORM.BILLING-DETAILS',
    BILLING_TO: 'COMMON-FORM.BILLING-TO',
    BILL_TO: 'COMMON-FORM.BILL-TO',
    BILLING_BRANCH: 'COMMON-FORM.BILLING-BRANCH',
    JOB_REFERENCE: 'COMMON-FORM.JOB-REFERENCE',
    QUANTITY: 'COMMON-FORM.QTY',
    UNIT_PRICE: 'COMMON-FORM.UNIT-PRICE',
    COST: 'COMMON-FORM.COST',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    ROLLBACK_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    APPROVE: 'COMMON-FORM.APPROVE',
    ABORT: 'COMMON-FORM.ABORT',
    DETAILS: 'COMMON-FORM.DETAILS',
    TYPE: 'COMMON-FORM.TYPE',
    RESIDUE_ESTIMATE_DETAILS: 'COMMON-FORM.RESIDUE-ESTIMATE-DETAILS',
  };
  unit_type_control = new UntypedFormControl();

  selectedItem: ResidueItem;

  constructor(
    public dialogRef: MatDialogRef<ResidueEstimateFormDialogComponent_View>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    // Set the defaults
    this.selectedItem = data.selectedItem;
    this.deList=this.selectedItem.residue_part;
    this.action = data.action!;
    this.translateLangText();
  }



 

  GetTitle() {
    return this.translatedLangText.RESIDUE_ESTIMATE_DETAILS;
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }


 

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {

      console.log('valid');
      this.dialogRef.close(count);
    }
  }

  save() {
    // if (!this.pcForm?.valid) return;
    // const where: any = {};
    // if (this.pcForm!.value['name']) {
    //   where.name = { contains: this.pcForm!.value['name'] };
    // }

   
  }

  displayLastUpdated(r: TariffDepotItem) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    const date = new Date(updatedt! * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    // Replace the '/' with '-' to get the required format


    return `${day}/${month}/${year}`;

  }

  markFormGroupTouched(formGroup: UntypedFormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof UntypedFormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control!.markAsTouched();
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  getFooterBackgroundColor(): string {
    return ''; // 'light-blue';
  }

   IsApproved() {
    const validStatus = ['APPROVED', 'COMPLETED', 'QC_COMPLETED']
    return validStatus.includes(this.selectedItem?.status_cv!);
    
  }

  parse2Decimal(figure: number | string) {
      return Utility.formatNumberDisplay(figure)
    }

  calculateResidueItemCost(residuePart: ResiduePartItem): number {
    let calResCost: number = 0;

    if (this.IsApproved()) {
      calResCost = residuePart.approve_cost! * residuePart.approve_qty!;
    }
    else {
      calResCost = residuePart.cost! * residuePart.quantity!;
    }

    return calResCost;

  }

   getTotalCost(): number {
    return this.deList?.reduce((acc, row) => {
      if ((row.delete_dt === null || row.delete_dt === undefined) && (row.approve_part == null || row.approve_part == true)) {
        if (this.IsApproved()) {
          return acc + ((row.approve_qty || 0) * (row.approve_cost || 0));
        }
        else {
          return acc + ((row.quantity || 0) * (row.cost || 0));
        }
      }
      return acc; // If row is approved, keep the current accumulator value
    }, 0);
  }

   IsApprovePart(rep: ResiduePartItem) {
      return rep.approve_part;
    }
}
