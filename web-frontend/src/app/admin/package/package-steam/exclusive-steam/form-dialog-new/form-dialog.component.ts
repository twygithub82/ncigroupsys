import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';
//import {CleaningCategoryDS,CleaningCategoryItem} from 'app/data-sources/cleaning-category';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { ExclusiveSteamingItem, PackageSteamingExclusiveDS } from 'app/data-sources/exclusive-steam';
import { PackageSteamingItem } from 'app/data-sources/package-steam';
import { TankItem } from 'app/data-sources/tank';
import { TariffDepotItem } from 'app/data-sources/tariff-depot';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { tempRangeValidator } from '../validators/temp-range.validator';

export interface DialogData {
  action?: string;
  selectedValue?: number;
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItem: ExclusiveSteamingItem;
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}

interface Condition {
  guid: { eq: string };
  tariff_depot_guid: { eq: null };
}


@Component({
  selector: 'app-tariff-residue-form-dialog',
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
    PreventNonNumericDirective
  ],
})
export class FormDialogComponent_New extends UnsubscribeOnDestroyAdapter {
  displayedColumns = [
    'fName',
    'lName',
    'email',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;


  pckSteamExclusiveDS: PackageSteamingExclusiveDS;
  trfCleanDS: TariffCleaningDS;
  ccDS: CustomerCompanyDS;
  tnkItems?: TankItem[];

  customer_companyList?: CustomerCompanyItem[];
  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();
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
    OPEN_AT_GATE: 'COMMON-FORM.OPEN-AT-GATE',
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
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
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
    COST: 'COMMON-FORM.COST',
    LAST_UPDATED: "COMMON-FORM.LAST-UPDATED",
    BUFFER_TYPE: "COMMON-FORM.BUFFER-TYPE",
    TARIFF_RESIDUE: 'MENUITEMS.TARIFF.LIST.TARIFF-RESIDUE',
    MAX_TEMP: 'COMMON-FORM.MAX-TEMP',
    MIN_TEMP: 'COMMON-FORM.MIN-TEMP',
    QTY: 'COMMON-FORM.QTY',
    LABOUR: 'COMMON-FORM.LABOUR',
    TEMP_RANGE_ERROR: 'COMMON-FORM.TEMP-RANGE-ERROR',
    TEMP_RANGE_OVERLAPS_ERROR: 'COMMON-FORM.TEMP-RANGE-OVERLAPS-ERROR',
    TARIFF_STEAM: 'MENUITEMS.TARIFF.LIST.TARIFF-STEAM',
    EXCLUSIVE_STEAM: 'MENUITEMS.PACKAGE.LIST.EXCLUSIVE-STEAMING'
  };
  unit_type_control = new UntypedFormControl();

  selectedItem: ExclusiveSteamingItem;

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

    this.pckSteamExclusiveDS = new PackageSteamingExclusiveDS(this.apollo);
    this.trfCleanDS = new TariffCleaningDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);

    this.pcForm = this.createExclusiveSteam();

    this.tnkItems = [];
    this.action = data.action!;
    this.translateLangText();
    this.InitValueChanges()
    if (this.action === "edit") this.patchExclusiveSteam(data.selectedItem);
  }

  patchExclusiveSteam(row: ExclusiveSteamingItem) {
    this.pcForm.patchValue({
      selectedItem: row,
      action: "edit",
      min_temp: row.temp_min,
      max_temp: row.temp_max === 9999 ? "" : row.temp_max,
      labour: row.package_steaming?.labour,
      last_cargo: [row.tariff_cleaning],
      customer_code: row.package_steaming?.customer_company,
      // qty:[''],
      cost: row.package_steaming?.cost?.toFixed(2),
      remarks: row.remarks
    });
  }

  createExclusiveSteam(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: null,
      action: "new",
      min_temp: ['', [Validators.required]],
      max_temp: [''],
      labour: [''],
      cost: [''],
      remarks: [''],
      customer_code: [''],
      last_cargo: ['']
    },
      { validators: tempRangeValidator });
  }

  public InitValueChanges() {
    this.pcForm!.get('customer_code')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.code;
        }
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
        });
      })
    ).subscribe();

    var searchCriteria = '';
    this.subs.sink = this.trfCleanDS.getAllTariffCleaning({ or: [{ cargo: { contains: searchCriteria } }], delete_dt: { eq: null } }, 1000).subscribe(data => {
      this.last_cargoList = data
      if (this.action === "edit") {
        const found = this.last_cargoList?.filter(x => x.guid === this.data.selectedItem?.tariff_cleaning?.guid);
        this.pcForm?.get('last_cargo')?.setValue(found);
      }
    });
  }
  displayLastCargoFn(lc: TariffCleaningItem): string {
    return lc ? `${lc.cargo}` : '';
  }
  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
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

    if (this.action === "new") {
      return `${this.translatedLangText.NEW} ${this.translatedLangText.EXCLUSIVE_STEAM}`;
    }
    return `${this.translatedLangText.EDIT} ${this.translatedLangText.EXCLUSIVE_STEAM}`;
    //  return this.action==="new"?this.translatedLangText.NEW:this.translatedLangText.EDIT + " " + this.translatedLangText.TARIFF_STEAM;      

  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }


  canEdit() {
    return this.pcForm!.value['action'] == "new";
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {

      console.log('valid');
      this.dialogRef.close(count);
      // let successMsg = this.langText.SAVE_SUCCESS;
      // this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
      //   successMsg = res;
      //   ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);

      // });
    }
  }



  save() {

    if (!this.pcForm?.valid) return;

    let where: any = { and: [] };

    let maxTemp = this.pcForm?.value['max_temp'];
    let minTemp = this.pcForm?.value['min_temp']
    let custGuid = this.pcForm?.value['customer_code'].guid;
    let lastCargoGuid = this.pcForm?.value['last_cargo'].guid;
    if (!maxTemp) maxTemp = 9999;

    where.and.push({ package_steaming: { customer_company_guid: { eq: custGuid } } });
    where.and.push({ or: [{ package_steaming: { delete_dt: { eq: null } } }, { package_steaming: { delete_dt: { eq: 0 } } }] });
    if (this.pcForm?.value['last_cargo'].length > 0) {
      var lastCargoGuids: string[] = this.pcForm.value['last_cargo'].map((cargo: { guid: string }) => cargo.guid);
      where.and.push({ tariff_cleaning_guid: { in: lastCargoGuids } });
    }

    let tempCond: any = { or: [] };
    tempCond.or.push({ and: [{ temp_min: { lte: minTemp } }, { temp_max: { gte: minTemp } }] })
    tempCond.or.push({ and: [{ temp_min: { lte: maxTemp } }, { temp_max: { gte: maxTemp } }] })
    tempCond.or.push({ and: [{ temp_min: { gte: minTemp } }, { temp_min: { lte: maxTemp } }] })
    tempCond.or.push({ and: [{ temp_max: { gte: minTemp } }, { temp_max: { lte: maxTemp } }] })
    where.and.push(tempCond);
    this.subs.sink = this.pckSteamExclusiveDS.SearchExclusiveSteam(where).subscribe(data => {
      if (data.length == 0) {
        let newSteams: ExclusiveSteamingItem[] = [];

        var lastCargoGuids: string[] = this.pcForm.value['last_cargo'].map((cargo: { guid: string }) => cargo.guid);
        lastCargoGuids.map(cargoGuid => {



          let newSteam = new ExclusiveSteamingItem();

          // newSteam.cost= Number(this.pcForm!.value['cost']);
          newSteam.remarks = String(this.pcForm.value['remarks']);
          newSteam.temp_max = Number(maxTemp);
          newSteam.temp_min = Number(minTemp);
          newSteam.labour = Number(this.pcForm.value['labour']);
          newSteam.package_steaming = new PackageSteamingItem();
          newSteam.package_steaming.cost = Number(this.pcForm!.value['cost']);
          newSteam.package_steaming.labour = newSteam.labour;
          newSteam.package_steaming.remarks = newSteam.remarks;
          newSteam.package_steaming.customer_company_guid = custGuid;
          newSteam.tariff_cleaning_guid = cargoGuid;
          newSteams.push(newSteam);
        });
        this.pckSteamExclusiveDS.AddExclusiveSteams(newSteams).subscribe(result => {

          this.handleSaveSuccess(result?.data?.addSteamingExclusive);
        });
      }
      else {
        this.pcForm?.setErrors({ overlaps: true });
      }


    });





  }

  update() {

    if (!this.pcForm?.valid) return;



    let where: any = { and: [] };

    let maxTemp = this.pcForm?.value['max_temp'];
    let minTemp = this.pcForm?.value['min_temp']
    let custGuid = this.pcForm?.value['customer_code'].guid;
    let lastCargoGuid = this.pcForm?.value['last_cargo'].guid;
    if (!maxTemp) maxTemp = 9999;

    where.and.push({ package_steaming: { customer_company_guid: { eq: custGuid } } });
    where.and.push({ or: [{ package_steaming: { delete_dt: { eq: null } } }, { package_steaming: { delete_dt: { eq: 0 } } }] });

    if (this.pcForm?.value['last_cargo'].length > 0) {
      var lastCargoGuids: string[] = this.pcForm.value['last_cargo'].map((cargo: { guid: string }) => cargo.guid);
      where.and.push({ tariff_cleaning_guid: { in: lastCargoGuids } });
    }
    //where.and.push({ tariff_cleaning_guid: { eq: lastCargoGuid } });

    let tempCond: any = { or: [] };
    tempCond.or.push({ and: [{ temp_min: { lte: minTemp } }, { temp_max: { gte: minTemp } }] })
    tempCond.or.push({ and: [{ temp_min: { lte: maxTemp } }, { temp_max: { gte: maxTemp } }] })
    tempCond.or.push({ and: [{ temp_min: { gte: minTemp } }, { temp_min: { lte: maxTemp } }] })
    tempCond.or.push({ and: [{ temp_max: { gte: minTemp } }, { temp_max: { lte: maxTemp } }] })
    where.and.push(tempCond);
    this.subs.sink = this.pckSteamExclusiveDS.SearchExclusiveSteam(where).subscribe(data => {
      if (data.length <= 1) {
        let bUpd: boolean = true;

        if (data.length == 1) {
          bUpd = this.selectedItem.guid === data[0].guid;

        }
        let updsteam = new ExclusiveSteamingItem();
        updsteam.guid = this.selectedItem.guid;
        // newSteam.cost= Number(this.pcForm!.value['cost']);
        updsteam.remarks = String(this.pcForm.value['remarks']);

        updsteam.temp_max = Number(maxTemp);
        updsteam.temp_min = Number(minTemp);
        updsteam.labour = Number(this.pcForm.value['labour']);
        updsteam.package_steaming = new PackageSteamingItem(this.selectedItem.package_steaming);
        delete updsteam.package_steaming.customer_company;
        updsteam.package_steaming.cost = Number(this.pcForm!.value['cost']);
        updsteam.package_steaming.labour = updsteam.labour;
        updsteam.package_steaming.remarks = updsteam.remarks;
        updsteam.package_steaming.customer_company_guid = custGuid;
        updsteam.tariff_cleaning_guid = lastCargoGuids[0];
        this.pckSteamExclusiveDS.updateExclusiveSteam(updsteam).subscribe(result => {

          this.handleSaveSuccess(result?.data?.updateSteamingExclusive);
        });
      }
      else {
        this.pcForm?.setErrors({ overlaps: true });
      }


    });

    // let where: any = { or:[]};

    // let maxTemp =this.pcForm?.value['max_temp'];
    // let minTemp=this.pcForm?.value['min_temp']
    // if(!maxTemp)maxTemp=9999;
    // where.or.push ({and:[{temp_min:{lte:minTemp}},{temp_max:{gte:minTemp}}]})
    // where.or.push ({and:[{temp_min:{lte:maxTemp}},{temp_max:{gte:maxTemp}}]})
    // where.or.push ({and:[{temp_min:{gte:minTemp}},{temp_min:{lte:maxTemp}}]})
    // where.or.push ({and:[{temp_max:{gte:minTemp}},{temp_max:{lte:maxTemp}}]})

    // this.subs.sink= this.trfSteamDS.SearchTariffSteam(where).subscribe(data=>{
    //     if(data.length<=1)
    //     {
    //       let bUpd:boolean=true;

    //       if(data.length==1)
    //       {
    //         bUpd=this.selectedItem.guid===data[0].guid;

    //       }

    //       if(bUpd)
    //       {
    //         let updSteam = new TariffSteamingItem();
    //         updSteam.guid = this.selectedItem.guid;
    //         updSteam.cost= Number(this.pcForm!.value['cost']);
    //         updSteam.remarks= String(this.pcForm.value['remarks']);
    //         updSteam.temp_max= Number(maxTemp);
    //         updSteam.temp_min= Number(this.pcForm.value['min_temp']);
    //         updSteam.labour= Number(this.pcForm.value['labour']);
    //         this.trfSteamDS.updateTariffSteam(updSteam).subscribe(result=>{
    //           this.handleSaveSuccess(result?.data?.updateTariffSteaming);
    //         });
    //       }
    //       else
    //       {
    //         this.pcForm?.setErrors({ overlaps: true });
    //       }

    //     }
    //     else
    //     {
    //         this.pcForm?.setErrors({ overlaps: true });
    //     }


    // });





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

  onMaxTempInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.split('.')[0];
    this.pcForm.get('max_temp')?.setValue(Number(inputElement.value));
  }

  onMinTempInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.split('.')[0];
    this.pcForm.get('min_temp')?.setValue(Number(inputElement.value));
  }
}
