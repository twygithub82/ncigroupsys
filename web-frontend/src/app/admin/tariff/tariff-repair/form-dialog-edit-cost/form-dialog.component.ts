import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
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
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';
//import {CleaningCategoryDS,CleaningCategoryItem} from 'app/data-sources/cleaning-category';
import { Direction } from '@angular/cdk/bidi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { TankItem } from 'app/data-sources/tank';
import { TariffDepotItem } from 'app/data-sources/tariff-depot';
import { TariffRepairDS, TariffRepairItem, TariffRepairLengthItem } from 'app/data-sources/tariff-repair';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ConfirmDialogComponent } from './confirm/confirm.component';
import { ModulePackageService } from 'app/services/module-package.service';
import { NumericTextDirective } from 'app/directive/numeric-text.directive';

export interface DialogData {
  action?: string;
  selectedValue?: number;
  langText?: any;
  selectedItems: TariffRepairItem[];
}
interface Condition {
  guid: { eq: string };
  tariff_depot_guid: { eq: null };
}

@Component({
  selector: 'app-tariff-repair-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [provideNgxMask()],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    MatProgressSpinnerModule,
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
    NumericTextDirective
  ],
})
export class FormDialogComponent_Edit_Cost extends UnsubscribeOnDestroyAdapter {
  UpdateInProgress: boolean = false;
  action: string;
  index?: number;
  dialogTitle?: string;

  minMaterialCost: number = -20;
  warningMaterialCost: number = 20;
  maxMaterialCost: number = 100;

  cvDS: CodeValuesDS;
  groupNameCvList: CodeValuesItem[] = [];
  subGroupNameCvList: CodeValuesItem[] = [];
  lengthTypeCvList: CodeValuesItem[] = [];
  unitTypeCvList: CodeValuesItem[] = [];
  allSubGroupNameCvList: CodeValuesItem[] = [];

  trfRepairDS: TariffRepairDS;
  tnkItems?: TankItem[] = [];

  partNameFilteredList?: string[];
  partNameList?: string[];
  dimensionList?: string[];
  lengthList?: TariffRepairLengthItem[];
  selectedTariffRepair?: TariffRepairItem;

  valueChangesDisabled: Boolean = false;

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();

  partNameControl = new UntypedFormControl();
  lengthControl = new UntypedFormControl();
  dimensionControl = new UntypedFormControl();
  widthDiadmeterUnitControl = new UntypedFormControl();
  thicknessUnitControl = new UntypedFormControl();

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
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SEARCH: 'COMMON-FORM.SEARCH',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
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
    GROUP_NAME: "COMMON-FORM.GROUP-NAME",
    SUB_GROUP_NAME: "COMMON-FORM.SUB-GROUP-NAME",
    PART_NAME: "COMMON-FORM.PART-NAME",
    MIN_COST: "COMMON-FORM.MIN-COST",
    MAX_COST: "COMMON-FORM.MAX-COST",
    LENGTH: "COMMON-FORM.LENGTH",
    MIN_LENGTH: "COMMON-FORM.MIN-LENGTH",
    MAX_LENGTH: "COMMON-FORM.MAX-LENGTH",
    MIN_LABOUR: "COMMON-FORM.MIN-LABOUR",
    MAX_LABOUR: "COMMON-FORM.MAX-LABOUR",
    HANDLED_ITEM: "COMMON-FORM.HANDLED-ITEM",
    LABOUR_HOUR: "COMMON-FORM.LABOUR-HOUR",
    MATERIAL_COST: "COMMON-FORM.MATERIAL-COST",
    TEST_TYPE: "COMMON-FORM.TEST-TYPE",
    DIMENSION: "COMMON-FORM.DIMENSION",
    HEIGHT_DIAMETER: "COMMON-FORM.HEIGHT-DIAMETER",
    WIDTH_DIAMETER: "COMMON-FORM.WIDTH-DIAMETER",
    THICKNESS: "COMMON-FORM.THICKNESS",
    COST_TYPE: "COMMON-FORM.COST-TYPE",
    REBATE_TYPE: "COMMON-FORM.REBATE-TYPE",
    JOB_TYPE: "COMMON-FORM.JOB-TYPE",
    CANNOT_EXCEED: "COMMON-FORM.CANNOT-EXCEED",
    CANNOT_SMALLER: "COMMON-FORM.CANNOT-SMALLER",
    SMALLER_THAN: "COMMON-FORM.SMALLER-THAN",
    EXCEED: "COMMON-FORM.EXCEEDED",
    ONE_CONDITION: "COMMON-FORM.ENTER-ATLEAST-ONE-CONDITION",
    NO_VALUE_CHNAGE: "COMMON-FORM.NO-VALUE-CHNAGE",
    MARKED_UP_OVER: 'COMMON-FORM.MARKED-UP-OVER'
  };
  unit_type_control = new UntypedFormControl();
  selectedItems: TariffRepairItem[];

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent_Edit_Cost>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private modulePackageService: ModulePackageService
  ) {
    // Set the defaults
    super();
    this.selectedItems = data.selectedItems;
    this.cvDS = new CodeValuesDS(this.apollo);
    this.trfRepairDS = new TariffRepairDS(this.apollo);
    this.pcForm = this.createTarifRepair();
    this.action = data.action!;
    this.translateLangText();
    this.loadData();
  }

  createTarifRepair(): UntypedFormGroup {
    return this.fb.group({
      selectedItems: this.selectedItems,
      action: this.action,
      group_name_cv: [''],
      sub_group_name_cv: [''],
      part_name: this.partNameControl,
      dimension: this.dimensionControl,
      length: this.lengthControl,
      material_cost_percentage: [''],
      labour_hour_percentage: [''],
    });
  }

  GetButtonCaption() {
    return this.translatedLangText.CANCEL;
  }

  GetTitle() {
    return this.translatedLangText.EDIT + " " + this.translatedLangText.MATERIAL_COST;
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  public loadData() {
    const queries = [
      { alias: 'groupName', codeValType: 'GROUP_NAME' },
      { alias: 'unitType', codeValType: 'UNIT_TYPE' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('groupName').subscribe(data => {
      this.groupNameCvList = data;
      const subqueries: any[] = [];
      data.map(d => {
        if (d.child_code) {
          let q = { alias: d.child_code, codeValType: d.child_code };
          const hasMatch = subqueries.some(subquery => subquery.codeValType === d.child_code);
          if (!hasMatch) {
            subqueries.push(q);
          }
        }
      });
      if (subqueries.length > 0) {
        this.cvDS.getCodeValuesByType(subqueries)
        subqueries.map(s => {
          this.cvDS.connectAlias(s.alias).subscribe(data => {
            this.allSubGroupNameCvList.push(...data);
          });
        });
      }
    });

    this.pcForm?.get('group_name_cv')?.valueChanges.subscribe(value => {
      console.log('Selected value:', value);
      var aliasName = value.child_code;
      if (aliasName === undefined) return;
      const subGroupForm = this.pcForm?.get('group_name_cv');
      const subqueries: any[] = [{ alias: aliasName, codeValType: aliasName }];
      this.cvDS.getCodeValuesByType(subqueries);
      this.cvDS.connectAlias(aliasName).subscribe(data => {
        this.subGroupNameCvList = data;
        if (this.selectedItems.length == 1) {
          var rec = this.selectedItems[0];
          var subgroupNameCodeValue = this.GetCodeValue(rec.subgroup_name_cv!, this.subGroupNameCvList);
          subGroupForm?.setValue(subgroupNameCodeValue);
        }
        this.partNameControl.reset('');
        const groupName = this.pcForm?.get('group_name_cv')?.value;
        this.trfRepairDS.searchDistinctPartName(groupName.code_val, '').subscribe(data => {
          this.partNameControl.reset('');
          this.partNameList = data;
          this.partNameFilteredList = data
          this.updateValidators(this.partNameControl, this.partNameList);
        });
      });
    });
    this.pcForm?.get('sub_group_name_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        const codeValue = value.code_val;
        if (value) {
          const groupName = this.pcForm?.get('group_name_cv')?.value;
          this.trfRepairDS.searchDistinctPartName(groupName.code_val, codeValue).subscribe(data => {
            this.partNameControl.reset('');
            this.partNameList = data;
            this.partNameFilteredList = data
            this.updateValidators(this.partNameControl, this.partNameList);
          });
        }
      })
    ).subscribe();

    this.partNameControl.valueChanges.subscribe(value => {
      if (!this.valueChangesDisabled) {
        this.handleValueChange(value);
      }
    });

    this.pcForm?.get('dimension')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          const partName = this.partNameControl.value;
          this.trfRepairDS.searchDistinctLength(partName, value).subscribe(data => {
            this.lengthList = data;
            console.log(this.lengthList)
          });
        }
      })
    ).subscribe();

    this.pcForm?.get('length')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          const partName = this.partNameControl.value;
          const dimension = this.pcForm?.get('dimension')?.value;
          this.trfRepairDS.searchTariffRepairByPartNameDimLength(partName, dimension, value).subscribe(data => {
            if (data.length) {
              this.selectedTariffRepair = data[0];
            }
          });
        }
      })
    ).subscribe();

    this.pcForm.get('material_cost_percentage')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          const nValue = Utility.convertNumber(value)
          if (nValue >= this.warningMaterialCost) {
            this.pcForm.get('material_cost_percentage')?.setErrors({ 'mark-up-warning': true });
          } else {
            this.pcForm.get('material_cost_percentage')?.setErrors(null);
          }
        }
      })
    ).subscribe();

    this.pcForm.get('labour_hour_percentage')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          const nValue = Utility.convertNumber(value)
          if (nValue >= this.warningMaterialCost) {
            this.pcForm.get('labour_hour_percentage')?.setErrors({ 'mark-up-warning': true });
          } else {
            this.pcForm.get('labour_hour_percentage')?.setErrors(null);
          }
        }
      })
    ).subscribe();
  }

  handleValueChange(value: any) {
    this.valueChangesDisabled = true;
    if (value) {
      this.partNameFilteredList = this.partNameList?.filter(item =>
        item.toLowerCase().includes(value.toLowerCase()) // case-insensitive filtering
      );
      const isValid = this.partNameList?.some(item => item === value);
      console.log(isValid);
      if (isValid) {
        // Only search if the value exists in the partNameList
        this.trfRepairDS.searchDistinctDimension(value).subscribe(data => {
          this.dimensionList = data;
        });
      }
    } else {
      // If no value is entered, reset the filtered list to the full list
      this.partNameFilteredList = this.partNameList;
    }
    this.valueChangesDisabled = false;
  }

  isFieldRequired() {
    return this.selectedItems.length == 1;
  }

  canEdit() {
    return this.isAllowEdit();
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {

      console.log('valid');
      this.dialogRef.close(count);
    }
  }

  getGroupNameCodeValue(codeValue: String) {
    return this.GetCodeValue(codeValue, this.groupNameCvList);
  }

  getSubGroupNameCodeValue(codeValue: String) {
    return this.GetCodeValue(codeValue, this.allSubGroupNameCvList);
  }

  getUnitTypeCodeValue(codeValue: String) {
    return this.GetCodeValue(codeValue, this.unitTypeCvList);
  }

  GetCodeValue(codeValue: String, codeValueItems: CodeValuesItem[]) {
    return codeValueItems.find(item => item.code_val === codeValue);
  }

  RetrieveCodeValue(CdValue: CodeValuesItem): String {
    let retCodeValue: String = '';

    if (CdValue) {
      retCodeValue = CdValue.code_val || '';
    }
    return retCodeValue;
  }

  EnableValidator(path: string) {
    this.pcForm.get(path)?.setValidators([
      Validators.min(this.minMaterialCost),
      Validators.max(this.maxMaterialCost),
      Validators.required  // If you have a required validator
    ]);
    this.pcForm.get(path)?.updateValueAndValidity();  // Revalidate the control
  }

  DisableValidator(path: string) {
    this.pcForm.get(path)?.clearValidators();
    this.pcForm.get(path)?.updateValueAndValidity();
  }

  ConfirmItem(msg: String) {
    var retval: string = "CANCEL";
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: msg,
        langText: this.langText

      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action == "confirmed") {
        this.updateTariffRepair();
      }
    });
  }

  update() {
    this.DisableValidator('material_cost_percentage');
    this.DisableValidator('labour_hour_percentage');
    if (!this.pcForm?.valid) return;
    this.UpdateInProgress = true;
    this.updateTariffRepair();
  }

  updateTariffRepair() {
    var trfRepairItem = new TariffRepairItem();
    trfRepairItem.part_name = this.pcForm!.value['part_name'];

    trfRepairItem.subgroup_name_cv = String(this.RetrieveCodeValue(this.pcForm!.value['sub_group_name_cv']));
    trfRepairItem.group_name_cv = String(this.RetrieveCodeValue(this.pcForm!.value['group_name_cv']));
    trfRepairItem.material_cost = 1;
    if (this.pcForm!.value['material_cost_percentage']) {
      trfRepairItem.material_cost = (Number(this.pcForm!.value['material_cost_percentage']) / 100) + 1;
    }
    trfRepairItem.labour_hour = 1;
    if (this.pcForm!.value['labour_hour_percentage']) {
      trfRepairItem.labour_hour = (Number(this.pcForm!.value['labour_hour_percentage']) / 100) + 1;
    }
    trfRepairItem.dimension = String(this.pcForm!.value['dimension'] || '');
    trfRepairItem.length = Number(this.pcForm!.value['length'] || -1);

    if (this.checkCondition(trfRepairItem)) {
      this.trfRepairDS.updateTariffRepairs_MaterialCost([trfRepairItem.group_name_cv], [trfRepairItem.subgroup_name_cv],
        trfRepairItem.part_name, trfRepairItem.dimension, trfRepairItem.length, [], trfRepairItem.material_cost, trfRepairItem.labour_hour).subscribe(result => {
          this.handleSaveSuccess(result?.data?.updateTariffRepair_MaterialCost);
          this.EnableValidator('material_cost_percentage');
          this.EnableValidator('labour_hour_percentage');
          this.UpdateInProgress = false;
        });
    }
    else {
      this.EnableValidator('material_cost_percentage');
      this.EnableValidator('labour_hour_percentage');
      this.UpdateInProgress = false;
    }
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

  updateValidators(control: UntypedFormControl, validOptions: any[]) {
    control.setValidators([
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  displayPartNameFn(tr: string): string {
    return tr;
  }

  checkCondition(trfRepairItem: TariffRepairItem): Boolean {
    var retval: Boolean = false;
    var maxCustomerAllowed: number = 10;
    var msg: String = "";

    retval = (trfRepairItem.group_name_cv?.trim() != "");
    if (!retval) retval = (trfRepairItem.subgroup_name_cv?.trim() != "" && trfRepairItem.subgroup_name_cv != undefined);
    if (!retval) retval = (trfRepairItem.part_name?.trim() != "" && trfRepairItem.part_name != undefined);
    if (!retval) retval = (trfRepairItem.dimension?.trim() != "" && trfRepairItem.dimension != undefined);
    if (!retval) retval = (trfRepairItem.guid?.trim() != "" && trfRepairItem.guid != undefined);
    retval = true;
    if (!retval)
      msg = `${this.translatedLangText.ONE_CONDITION}`;

    if (trfRepairItem.labour_hour == 1 && trfRepairItem.material_cost == 1 && retval) {
      msg = `${this.translatedLangText.NO_VALUE_CHNAGE}`;
      retval = false;
    }
    else if (msg.trim() == "") {
      retval = true;
    }

    if (!retval && msg.trim() != "") {
      this.ConfirmItem(msg);
    }
    return retval;
  }

  selectAll(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    input.select();  // Selects all text in the input
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['TARIFF_REPAIR_EDIT']);
  }
}
