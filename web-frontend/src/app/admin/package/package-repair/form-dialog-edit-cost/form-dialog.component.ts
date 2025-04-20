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
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';
//import {CleaningCategoryDS,CleaningCategoryItem} from 'app/data-sources/cleaning-category';
import { Direction } from '@angular/cdk/bidi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { TankItem } from 'app/data-sources/tank';
import { TariffDepotItem } from 'app/data-sources/tariff-depot';
import { TariffRepairDS, TariffRepairItem, TariffRepairLengthItem } from 'app/data-sources/tariff-repair';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ConfirmDialogComponent } from './confirm/confirm.component';

export interface DialogData {
  action?: string;
  selectedValue?: number;
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItems: TariffRepairItem[];
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}
interface Condition {
  guid: { eq: string };
  tariff_depot_guid: { eq: null };
}

@Component({
  selector: 'app-package-repair-form-edit-dialog',
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
    MatPaginatorModule,
    PreventNonNumericDirective
  ],
})
export class FormDialogComponent_Edit_Cost extends UnsubscribeOnDestroyAdapter {
  displayedColumns = [
    'fName',
    'lName',
    'email',
  ];

  valueChangesDisabled: boolean = false;
  action: string;
  index?: number;
  dialogTitle?: string;
  minMaterialCost: number = -20;
  maxMaterialCost: number = 20;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  trDS: TariffRepairDS;
  groupNameCvList: CodeValuesItem[] = [];
  subGroupNameCvList: CodeValuesItem[] = [];
  lengthTypeCvList: CodeValuesItem[] = [];
  unitTypeCvList: CodeValuesItem[] = [];
  allSubGroupNameCvList: CodeValuesItem[] = [];
  partNameFilteredList: string[] = [];
  partNameList: string[] = [];
  dimensionList?: string[];
  lengthList?: TariffRepairLengthItem[];

  pckRepairDS: PackageRepairDS;
  tnkItems?: TankItem[] = [];

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();

  partNameControl = new UntypedFormControl();
  groupNameControl = new UntypedFormControl();
  subGroupNameControl = new UntypedFormControl();
  lengthControl = new UntypedFormControl();
  dimensionControl = new UntypedFormControl();
  widthDiadmeterUnitControl = new UntypedFormControl();
  thicknessUnitControl = new UntypedFormControl();
  customerCompanyControl = new UntypedFormControl();

  selectedTariffRepair?: TariffRepairItem;

  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME: 'COMMON-FORM.COMPANY-NAME',
    HAULIER: 'COMMON-FORM.HAULIER',
    ORDER_DETAILS: 'COMMON-FORM.ORDER-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    REPAIR: 'COMMON-FORM.REPAIR',
    REMARKS: 'COMMON-FORM.REMARKS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
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
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    VIEW: 'COMMON-FORM.VIEW',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED',
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
    CUSTOMER_EXCEED: "COMMON-FORM.CUSTOMER-EXCEED",
    ONE_CONDITION: "COMMON-FORM.ENTER-ATLEAST-ONE-CONDITION",
    NO_VALUE_CHNAGE: "COMMON-FORM.NO-VALUE-CHNAGE",
    CARGO_REQUIRED:'COMMON-FORM.IS-REQUIRED'
  };
  unit_type_control = new UntypedFormControl();

  selectedItems: PackageRepairItem[];
  UpdateInProgress: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent_Edit_Cost>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    // Set the defaults
    super();
    this.selectedItems = data.selectedItems;
    this.trDS = new TariffRepairDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.pckRepairDS = new PackageRepairDS(this.apollo);
    this.pcForm = this.createPackageRepair();
    this.action = data.action!;
    this.translateLangText();
    this.loadData();
  }

  createPackageRepair(): UntypedFormGroup {
    return this.fb.group({
      action: this.action,
      group_name_cv: this.groupNameControl,
      sub_group_name_cv: this.subGroupNameControl,
      customer_code: this.customerCompanyControl,
      part_name: this.partNameControl,
      dimension: this.dimensionControl,
      length: this.lengthControl,
      material_cost_percentage: [''],
      labour_hour_percentage: [''],
    });
  }

  displayPartNameFn(tr: string): string {
    return tr;
  }

  GetButtonCaption() {
    // if(this.pcForm!.value['action']== "view")
    //   {
    //     return this.translatedLangText.CLOSE ;      
    //   }
    //   else
    //   {
    return this.translatedLangText.CANCEL;
    // }
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
    this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }, 100).subscribe(data => {
      // this.customer_companyList1 = data
    });

    const queries = [
      { alias: 'groupName', codeValType: 'GROUP_NAME' },
      //{ alias: 'subGroupName', codeValType: 'SUB_GROUP_NAME' },
      // { alias: 'unitType', codeValType: 'UNIT_TYPE' }
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
      const subqueries: any[] = [{ alias: aliasName, codeValType: aliasName }];
      this.cvDS.getCodeValuesByType(subqueries);
      this.cvDS.connectAlias(aliasName).subscribe(data => {
        this.subGroupNameCvList = data;
        if (this.selectedItems.length == 1) {
          var rec = this.selectedItems[0];
          var subgroupNameCodeValue = this.GetCodeValue(rec.tariff_repair?.subgroup_name_cv!, this.subGroupNameCvList);
          this.subGroupNameControl.setValue(subgroupNameCodeValue);
        }

        const groupName = this.pcForm?.get('group_name_cv')?.value;
        this.trDS.searchDistinctPartName(groupName.code_val, '').subscribe(data => {
          this.partNameControl.reset('');
          this.partNameList = data || [];
          this.partNameFilteredList = data || [];
          this.updateValidators(this.partNameControl, this.partNameList);
        });

      });
      // Handle value changes here
    });

    this.pcForm?.get('sub_group_name_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        const codeValue = value.code_val;
        if (value) {
          const groupName = this.pcForm?.get('group_name_cv')?.value;
          this.trDS.searchDistinctPartName(groupName.code_val, codeValue).subscribe(data => {
            this.partNameControl.reset('');
            this.partNameList = data || [];
            this.partNameFilteredList = data || [];
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
          this.trDS.searchDistinctLength(partName, value).subscribe(data => {
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
          this.trDS.searchTariffRepairByPartNameDimLength(partName, dimension, value).subscribe(data => {
            if (data.length) {
              this.selectedTariffRepair = data[0];
            }
          });
        }
      })
    ).subscribe();
  }

  handleValueChange(value: any) {
    this.valueChangesDisabled = true;
    if (value) {
      this.partNameFilteredList = this.partNameList.filter(item =>
        item.toLowerCase().includes(value.toLowerCase()) // case-insensitive filtering
      ) || [];
      const isValid = this.partNameList.some(item => item === value);
      console.log(isValid);
      if (isValid) {
        // Only search if the value exists in the partNameList
        this.trDS.searchDistinctDimension(value).subscribe(data => {
          this.dimensionList = data;
        });
      }
    } else {
      // If no value is entered, reset the filtered list to the full list
      this.partNameFilteredList = this.partNameList || [];
    }
    this.valueChangesDisabled = false;
  }

  isFieldRequired() {
    return this.selectedItems.length == 1;
  }

  canEdit() {
    return true;
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
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
      // if(result.action=="confirmed")
      // {
      //   this.updatePackageRepair();
      // }
      // else
      // {
      //   this.onNoClick();
      // }
    });
  }

  update() {
    this.DisableValidator('material_cost_percentage');
    this.DisableValidator('labour_hour_percentage');

    if (!this.pcForm?.valid) return;

    this.UpdateInProgress = true;
    this.updatePackageRepair();
  }

  updatePackageRepair() {
    var trfRepairItem = new TariffRepairItem();
    trfRepairItem.part_name = this.pcForm!.value['part_name'];

    trfRepairItem.subgroup_name_cv = String(this.RetrieveCodeValue(this.pcForm!.value['sub_group_name_cv']));
    trfRepairItem.group_name_cv = String(this.RetrieveCodeValue(this.pcForm!.value['group_name_cv']));
    trfRepairItem.material_cost = 1;

    if (this.pcForm!.value['material_cost_percentage']) trfRepairItem.material_cost = (Number(this.pcForm!.value['material_cost_percentage']) / 100) + 1;
    trfRepairItem.labour_hour = 1;
    if (this.pcForm!.value['labour_hour_percentage']) trfRepairItem.labour_hour = (Number(this.pcForm!.value['labour_hour_percentage']) / 100) + 1;
    trfRepairItem.dimension = String(this.pcForm!.value['dimension'] || '');
    trfRepairItem.length = Number(this.pcForm!.value['length'] || -1);
    if (this.selectedTariffRepair) trfRepairItem.guid = this.selectedTariffRepair?.guid;

    var guids: string[] = [];
    if (this.customerCompanyControl.value) {
      if (this.customerCompanyControl.value.length > 0) {
        const customerCodes: CustomerCompanyItem[] = this.customerCompanyControl.value;
        guids.push(...customerCodes.map(cc => cc.guid!));  // Corrected push syntax
      }
    }

    //var material_cost_percentage=(Number(this.pcForm!.value['material_cost_percentage'])/100)+1;

    if (this.checkCondition(trfRepairItem, guids)) {
      this.pckRepairDS.updatePackageRepairs_MaterialCost(trfRepairItem.group_name_cv, trfRepairItem.subgroup_name_cv,
        trfRepairItem.part_name, trfRepairItem.dimension, trfRepairItem.length, trfRepairItem.guid,
        guids, trfRepairItem.material_cost, trfRepairItem.labour_hour).subscribe(result => {
          this.handleSaveSuccess(result?.data?.updatePackageRepair_MaterialCost);
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

  checkCondition(trfRepairItem: TariffRepairItem, CustomerGuids?: string[]): Boolean {
    var retval: Boolean = false;
    var maxCustomerAllowed: number = 10;
    var msg: String = "";

    // if (CustomerGuids?.length! > maxCustomerAllowed) {
    //   msg = `${this.translatedLangText.CUSTOMER_EXCEED} ${CustomerGuids?.length!}/${maxCustomerAllowed}`;
    // }
    // else if (CustomerGuids?.length == 0) {
    //   retval = (trfRepairItem.group_name_cv?.trim() != "");
    //   if (!retval) retval = (trfRepairItem.subgroup_name_cv?.trim() != "" && trfRepairItem.subgroup_name_cv != undefined);
    //   if (!retval) retval = (trfRepairItem.part_name?.trim() != "" && trfRepairItem.part_name != undefined);
    //   if (!retval) retval = (trfRepairItem.dimension?.trim() != "" && trfRepairItem.dimension != undefined);
    //   if (!retval) retval = (trfRepairItem.guid?.trim() != "" && trfRepairItem.guid != undefined);

    //   if (!retval)
    //     msg = `${this.translatedLangText.ONE_CONDITION}`;

    // }
    // else 
    if (trfRepairItem.labour_hour == 1 && trfRepairItem.material_cost == 1) {
      msg = `${this.translatedLangText.NO_VALUE_CHNAGE}`;
    }
    else {
      retval = true;
    }

    if (!retval && msg.trim() != "") {
      this.ConfirmItem(msg);
    }

    return retval;
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
}
