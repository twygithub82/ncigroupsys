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
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffDepotDS, TariffDepotItem } from 'app/data-sources/tariff-depot';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';

export interface DialogData {
  action?: string;
  selectedValue?: number;
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItem: TariffDepotItem;
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}

interface Condition {
  guid: { eq: string };
  tariff_depot_guid: { eq: null };
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
    MatProgressSpinnerModule,
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
    MatPaginatorModule,
    PreventNonNumericDirective
  ],
})
export class FormDialogComponent_New extends UnsubscribeOnDestroyAdapter {
  displayedColumns = [
    //  'select',
    // 'img',
    'fName',
    'lName',
    'email',
    // 'gender',
    // 'bDate',
    // 'mobile',
    // 'actions',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;

  tnkDS: TankDS;
  trfDepotDS: TariffDepotDS;

  tnkItems?: TankItem[];

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();
  formSubmitted: boolean = false;
  //custCompClnCatDS :CustomerCompanyCleaningCategoryDS;
  //catDS :CleaningCategoryDS;
  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME: 'COMMON-FORM.COMPANY-NAME',
    SO_NO: 'COMMON-FORM.SO-NO',
    SO_NOTES: 'COMMON-FORM.SO-NOTES',
    HAULIER: 'COMMON-FORM.HAULIER',
    ORDER_DETAILS: 'COMMON-FORM.ORDER-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    STORAGE: 'COMMON-FORM.STORAGE',
    STEAM: 'COMMON-FORM.STEAM',
    CLEANING: 'COMMON-FORM.CLEANING',
    REPAIR: 'COMMON-FORM.REPAIR',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    CLEAN_STATUS: 'COMMON-FORM.CLEAN-STATUS',
    CERTIFICATE: 'COMMON-FORM.CERTIFICATE',
    REQUIRED_TEMP: 'COMMON-FORM.REQUIRED-TEMP',
    FLASH_POINT: 'COMMON-FORM.FLASH-POINT',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    REMARKS: 'COMMON-FORM.REMARKS',
    ETR_DATE: 'COMMON-FORM.ETR-DATE',
    ST: 'COMMON-FORM.ST',
    O2_LEVEL: 'COMMON-FORM.O2-LEVEL',
    OPEN_ON_GATE: 'COMMON-FORM.OPEN-ON-GATE',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SEARCH: 'COMMON-FORM.SEARCH',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
    INVALID: 'COMMON-FORM.INVALID',
    EXISTED: 'COMMON-FORM.EXISTED',
    DUPLICATE: 'COMMON-FORM.DUPLICATE',
    SELECT_ATLEAST_ONE: 'COMMON-FORM.SELECT-ATLEAST-ONE',
    ADD_ATLEAST_ONE: 'COMMON-FORM.ADD-ATLEAST-ONE',
    ROLLBACK_STATUS: 'COMMON-FORM.ROLLBACK-STATUS',
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    CARGO_NAME: 'COMMON-FORM.CARGO-NAME',
    CARGO_ALIAS: 'COMMON-FORM.CARGO-ALIAS',
    CARGO_DESCRIPTION: 'COMMON-FORM.CARGO-DESCRIPTION',
    CARGO_CLASS: 'COMMON-FORM.CARGO-CLASS',
    CARGO_CLASS_SELECT: 'COMMON-FORM.CARGO-CLASS-SELECT',
    CARGO_UN_NO: 'COMMON-FORM.CARGO-UN-NO',
    CARGO_METHOD: 'COMMON-FORM.CARGO-METHOD',
    CARGO_CATEGORY: 'COMMON-FORM.CARGO-CATEGORY',
    CARGO_FLASH_POINT: 'COMMON-FORM.CARGO-FLASH-POINT',
    CARGO_COST: 'COMMON-FORM.CARGO-COST',
    CARGO_HAZARD_LEVEL: 'COMMON-FORM.CARGO-HAZARD-LEVEL',
    CARGO_BAN_TYPE: 'COMMON-FORM.CARGO-BAN-TYPE',
    CARGO_NATURE: 'COMMON-FORM.CARGO-NATURE',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    CARGO_NOTE: 'COMMON-FORM.CARGO-NOTE',
    CARGO_CLASS_1: "COMMON-FORM.CARGO-CALSS-1",
    CARGO_CLASS_1_4: "COMMON-FORM.CARGO-CALSS-1-4",
    CARGO_CLASS_1_5: "COMMON-FORM.CARGO-CALSS-1-5",
    CARGO_CLASS_1_6: "COMMON-FORM.CARGO-CALSS-1-6",
    CARGO_CLASS_2_1: "COMMON-FORM.CARGO-CALSS-2-1",
    CARGO_CLASS_2_2: "COMMON-FORM.CARGO-CALSS-2-2",
    CARGO_CLASS_2_3: "COMMON-FORM.CARGO-CALSS-2-3",
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    PROFILE: 'COMMON-FORM.PROFILE',
    VIEW: 'COMMON-FORM.VIEW',
    DEPOT_PROFILE: 'COMMON-FORM.DEPOT-PROFILE',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    PREINSPECTION_COST: "COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST: "COMMON-FORM.LOLO-COST",
    STORAGE_COST: "COMMON-FORM.STORAGE-COST",
    FREE_STORAGE: "COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED',
    ASSIGNED: 'COMMON-FORM.ASSIGNED',
    GATE_IN_COST: 'COMMON-FORM.GATE-IN-COST',
    GATE_OUT_COST: 'COMMON-FORM.GATE-OUT-COST',
  };
  unit_type_control = new UntypedFormControl();

  selectedItem: TariffDepotItem;
  //tcDS: TariffCleaningDS;
  //sotDS: StoringOrderTankDS;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent_New>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    // Set the defaults
    super();
    this.selectedItem = data.selectedItem;
    this.tnkDS = new TankDS(this.apollo);
    this.trfDepotDS = new TariffDepotDS(this.apollo);

    this.pcForm = this.createTariffDepot();
    // this.pcForm.get('last_updated')?.setValue(this.displayLastUpdated(this.selectedItem));
    //this.tcDS = new TariffCleaningDS(this.apollo);
    //this.sotDS = new StoringOrderTankDS(this.apollo);
    //this.custCompClnCatDS=new CustomerCompanyCleaningCategoryDS(this.apollo);
    // this.catDS= new CleaningCategoryDS(this.apollo);


    this.tnkItems = [];
    this.action = data.action!;
    this.translateLangText();
    this.loadData()
    // this.sotExistedList = data.sotExistedList;
    // if (this.action === 'edit') {
    //   this.dialogTitle = 'Edit ' + data.item.tank_no;
    //   this.storingOrderTank = data.item;
    // } else {
    //   this.dialogTitle = 'New Record';
    //   this.storingOrderTank = new StoringOrderTankItem();
    // }
    // this.index = data.index;
    // this.storingOrderTankForm = this.createStorigOrderTankForm();
    // this.initializeValueChange();

    // if (this.storingOrderTank?.tariff_cleaning) {
    //   this.lastCargoControl.setValue(this.storingOrderTank?.tariff_cleaning);
    // }
  }

  createTariffDepot(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: null,
      action: "new",
      name: [''],
      description: [''],
      preinspection_cost: [''],
      lolo_cost: [''],
      storage_cost: [''],
      free_storage: [''],
      gate_in_cost: [''],
      gate_out_cost: [''],
      unit_types: this.unit_type_control,
      last_updated: ['']
    });
  }

  public loadData() {

    const where: any = {};
    where.tariff_depot_guid = { or: [{ eq: null }, { eq: '' }] };
    const order: any = { unit_type: 'ASC' };
    this.subs.sink = this.tnkDS.search(where, order).subscribe(data => {
      this.tnkItems = data;
    }

    );

    // this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }).subscribe(data => {
    //   this.customer_companyList = data
    // });

    // this.clnCatDS.loadItems({ name: { neq: null }},{ sequence: 'ASC' }).subscribe(data=>{
    //   if(this.clnCatDS.totalCount>0)
    //   {
    //     this.cleaning_categoryList=data;
    //   }

    // });


  }

  GetButtonCaption() {
    if (this.pcForm!.value['action'] == "view") {
      return this.translatedLangText.CLOSE;
    }
    else {
      return this.translatedLangText.CANCEL;
    }
  }
  GetTitle() {

    return this.translatedLangText.NEW + " " + this.translatedLangText.PROFILE;

  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }


  canEdit() {
    return this.pcForm!.value['action'] == "new" && this.tnkItems?.length;
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      console.log('valid');
      this.dialogRef.close(count);
    }
  }

  save() {
    this.formSubmitted = true;
    if (!this.pcForm?.valid) return;

    let where: any = {};
    if (this.pcForm!.value['name']) {
      where.profile_name = { contains: this.pcForm!.value['name'] };
    }

    this.subs.sink = this.trfDepotDS.SearchTariffDepot(where).subscribe(data => {
      if (data.length == 0) {
        let conditions: Condition[] = [];
        let unit_types: TankItem[] = [];
        let insert = true;
        if (this.unit_type_control.value.length > 0) {
          this.unit_type_control.value.forEach((data: TankItem) => {
            let cond: Condition = { guid: { eq: String(data.guid) }, tariff_depot_guid: { eq: null } };
            conditions.push(cond);
            let tnk: TankItem = new TankItem();
            tnk.guid = data.guid;
            unit_types.push(tnk);
          });
          let where = { or: conditions };
          this.subs.sink = this.tnkDS.search(where).subscribe(data => {
            if (data.length != this.unit_type_control.value.length) {
              insert = false;
              this.pcForm?.get('unit_types')?.setErrors({ assigned: true });
            }
          });
        }
        if (insert) {
          let newDepot = new TariffDepotItem();
          newDepot.lolo_cost = Number(this.pcForm!.value['lolo_cost']);
          newDepot.free_storage = Number(this.pcForm.value['free_storage']);
          newDepot.description = String(this.pcForm.value['description']);
          newDepot.preinspection_cost = Number(this.pcForm.value['preinspection_cost']);
          newDepot.gate_in_cost = Number(this.pcForm.value['gate_in_cost']);
          newDepot.gate_out_cost = Number(this.pcForm.value['gate_out_cost']);
          newDepot.profile_name = String(this.pcForm.value['name']);
          newDepot.storage_cost = Number(this.pcForm.value['storage_cost']);
          newDepot.tanks = unit_types;
          this.trfDepotDS.addNewTariffDepot(newDepot).subscribe(result => {
            this.handleSaveSuccess(result?.data?.addTariffDepot);
          });
        }
      }
      else {
        this.pcForm?.get('name')?.setErrors({ existed: true });
      }
    });
  }

  onAlphaNumericOnly(event: Event, controlName: string): void {
    Utility.onAlphaNumericOnly(event, this.pcForm?.get(controlName)!);
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

}
