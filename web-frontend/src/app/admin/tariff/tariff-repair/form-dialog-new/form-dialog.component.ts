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
import { TariffRepairDS, TariffRepairItem } from 'app/data-sources/tariff-repair';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
//import {CleaningCategoryDS,CleaningCategoryItem} from 'app/data-sources/cleaning-category';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { TankItem } from 'app/data-sources/tank';
import { TariffDepotItem } from 'app/data-sources/tariff-depot';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ModulePackageService } from 'app/services/module-package.service';


export interface DialogData {
  action?: string;
  selectedValue?: number;
  langText?: any;
  selectedItem: TariffRepairItem;
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
  action: string;
  index?: number;
  dialogTitle?: string;

  cvDS: CodeValuesDS;
  groupNameCvList: CodeValuesItem[] = [];
  subGroupNameCvList: CodeValuesItem[] = [];
  lengthTypeCvList: CodeValuesItem[] = [];
  unitTypeCvList: CodeValuesItem[] = [];

  selectedItem?: TariffRepairItem;

  tnkItems?: TankItem[];

  trfRepairDS: TariffRepairDS;
  subGrpNames: any[] = [];

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();

  groupNameControl = new UntypedFormControl();
  subGroupNameControl = new UntypedFormControl();
  lengthUnitControl = new UntypedFormControl();
  heightDiameterUnitControl = new UntypedFormControl();
  widthDiameterUnitControl = new UntypedFormControl();
  thicknessUnitControl = new UntypedFormControl();


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
    ITEM: 'COMMON-FORM.ITEM',
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
    PART: 'COMMON-FORM.PART',
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
    ALIAS_NAME: "COMMON-FORM.ALIAS-NAME",
  };
  unit_type_control = new UntypedFormControl();
  unitTypeChangedEventUnsub: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent_New>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private modulePackageService: ModulePackageService
  ) {
    // Set the defaults
    super();
    this.trfRepairDS = new TariffRepairDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.pcForm = this.createTariffRepair();

    this.action = data.action!;
    this.translateLangText();
    this.loadData()
    
    if (data.action == "duplicate") {
      this.selectedItem = data.selectedItem;
      this.pcForm.patchValue({
        part_name: this.selectedItem.part_name,
        alias: this.selectedItem.alias,
        dimension: this.selectedItem.dimension,
        height_diameter: this.selectedItem.height_diameter,
        height_diameter_unit_cv: this.heightDiameterUnitControl,
        width_diameter: this.selectedItem.width_diameter,
        width_diameter_unit_cv: this.widthDiameterUnitControl,
        thickness: this.selectedItem.width_diameter,
        thickness_unit_cv: this.thicknessUnitControl,
        length: this.selectedItem.length,
        labour_hour: '',
        material_cost: '',
      });
    }
  }

  createTariffRepair(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: null,
      action: "new",
      group_name_cv: this.groupNameControl,
      sub_group_name_cv: this.subGroupNameControl,
      alias: ({ value: '', disabled: true }),
      dimension: ({ value: '', disabled: true }),
      part_name: [''],
      height_diameter: [''],
      height_diameter_unit_cv: this.heightDiameterUnitControl,
      width_diameter: [''],
      width_diameter_unit_cv: this.widthDiameterUnitControl,
      thickness: [''],
      thickness_unit_cv: this.thicknessUnitControl,
      length: [''],
      length_unit_cv: this.lengthUnitControl,
      labour_hour: [''],
      material_cost: [''],
    });
  }

  public loadData() {
    const queries = [
      { alias: 'groupName', codeValType: 'GROUP_NAME' },
      // { alias: 'subGroupName', codeValType: 'SUB_GROUP_NAME1' },
      { alias: 'unitType', codeValType: 'UNIT_TYPE' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('groupName').subscribe(data => {
      this.groupNameCvList = data;
      if (this.selectedItem) {
        var rec = this.selectedItem;
        this.groupNameControl.setValue(this.GetCodeValue(rec.group_name_cv!, this.groupNameCvList));
      }
    });
    this.cvDS.connectAlias('subGroupName').subscribe(data => {
      this.subGroupNameCvList = data;
    });
    this.cvDS.connectAlias('unitType').subscribe(data => {
      this.unitTypeCvList = data;
      if (this.selectedItem) {
        var rec = this.selectedItem;
        //this.lengthUnitControl.setValue(this.GetCodeValue(codeValue,this.unitTypeCvList);//this.getUnitTypeCodeValue(rec.length_unit_cv!));
        this.widthDiameterUnitControl.setValue(this.GetCodeValue(rec.width_diameter_unit_cv!, this.unitTypeCvList));
        this.heightDiameterUnitControl.setValue(this.GetCodeValue(rec.height_diameter_unit_cv!, this.unitTypeCvList));
        this.thicknessUnitControl.setValue(this.GetCodeValue(rec.thickness_unit_cv!, this.unitTypeCvList));
      }
    });

    this.pcForm?.get('group_name_cv')?.valueChanges.subscribe(value => {
      console.log('Selected value:', value);
      var aliasName = value.child_code;
      const subqueries: any[] = [{ alias: aliasName, codeValType: aliasName }];
      this.cvDS.getCodeValuesByType(subqueries);
      this.cvDS.connectAlias(aliasName).subscribe(data => {
        this.subGroupNameCvList = data;
        if (this.selectedItem) {
          var rec = this.selectedItem;
          this.subGroupNameControl.setValue(this.GetCodeValue(rec.subgroup_name_cv!, this.subGroupNameCvList));
        }
      });
      // Handle value changes here
    });

    this.listenTheValueChangesForPartNameDiameter();

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
    return this.translatedLangText.NEW + " " + this.translatedLangText.REPAIR + " " + this.translatedLangText.ITEM;
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  canEdit() {
    return this.isAllowAdd() && this.pcForm!.value['action'] == "new";
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      console.log('valid');
      this.dialogRef.close(count);
    }
  }

  isDimensionRequired() {
    return false;
  }

  save() {
    if (!this.pcForm?.valid) return;

    let newRepair = new TariffRepairItem();
    newRepair.part_name = String(this.pcForm.value['part_name']);
    newRepair.alias = String(this.pcForm.get('alias')?.value || this.pcForm.value['part_name']);
    newRepair.dimension = String(this.pcForm.get('dimension')?.value || '');
    newRepair.material_cost = Number(this.pcForm!.value['material_cost']);
    newRepair.height_diameter = Number(this.pcForm.value['height_diameter']);
    newRepair.height_diameter_unit_cv = String(this.RetrieveCodeValue(this.pcForm.value['height_diameter_unit_cv']));
    newRepair.width_diameter = Number(this.pcForm.value['width_diameter']);
    newRepair.width_diameter_unit_cv = String(this.RetrieveCodeValue(this.pcForm.value['width_diameter_unit_cv']));
    newRepair.group_name_cv = String(this.RetrieveCodeValue(this.pcForm.value['group_name_cv']));
    newRepair.subgroup_name_cv = String(this.RetrieveCodeValue(this.pcForm.value['sub_group_name_cv']));
    newRepair.labour_hour = Number(this.pcForm.value['labour_hour']);
    newRepair.length = Number(this.pcForm.value['length']);
    newRepair.length_unit_cv = String(this.RetrieveCodeValue(this.pcForm.value['length_unit_cv']));
    newRepair.thickness = Number(this.pcForm.value['thickness']);
    newRepair.thickness_unit_cv = String(this.RetrieveCodeValue(this.pcForm.value['thickness_unit_cv']));



    let where: any = {};
    if (newRepair.alias) {
      where.alias = { eq: newRepair.alias };
    }

    if (newRepair.length) {
      where.length = { eq: newRepair.length };
      where.length_unit_cv = { eq: newRepair.length_unit_cv };
    }

    this.subs.sink = this.trfRepairDS.SearchTariffRepair(where).subscribe(data => {
      if (data.length == 0) {
        this.trfRepairDS.addNewTariffRepair(newRepair).subscribe(result => {

          this.handleSaveSuccess(result?.data?.addTariffRepair);
        });
      }
      else {
        this.pcForm?.get('part_name')?.setErrors({ existed: true });
        // this.pcForm?.get('length')?.setErrors({ existed: true });
      }


    });





  }

  RetrieveCodeDesc(CdValue: CodeValuesItem): String {
    let retCodeValue: String = '';

    if (CdValue) {
      retCodeValue = CdValue.description || '';
    }
    return retCodeValue;

  }

  RetrieveCodeValue(CdValue: CodeValuesItem): String {
    let retCodeValue: String = '';

    if (CdValue) {
      retCodeValue = CdValue.code_val || '';
    }
    return retCodeValue;

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

  listenTheValueChangesForPartNameDiameter(): void {

    this.pcForm.get("part_name")?.valueChanges.subscribe(
      value => { this.updateDimensionAndAliasName() });
    this.pcForm.get("height_diameter")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get("height_diameter_unit_cv")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get("width_diameter")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get("width_diameter_unit_cv")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get("thickness")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get("thickness_unit_cv")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get('length')?.valueChanges.subscribe(value => {
      let len = `${this.pcForm?.get("length")?.value || ''}`;
      if (len == '') {
        this.lengthUnitControl.reset();
      }

    });
  }

  updateDimensionAndAliasName(): void {
    if (this.unitTypeChangedEventUnsub) return;
    let heightDimension = `${this.pcForm?.get("height_diameter")?.value || ''}`;
    let widthDimension = `${this.pcForm?.get("width_diameter")?.value || ''}`;
    let thicknessDimension = `${this.pcForm?.get("thickness")?.value || ''}`;
    let dimension = '';
    if (heightDimension != "") dimension = `${heightDimension}${this.RetrieveCodeDesc(this.heightDiameterUnitControl.value) || ''}`;
    else {
      this.unitTypeChangedEventUnsub = true;
      this.heightDiameterUnitControl.reset();
      this.unitTypeChangedEventUnsub = false;
    }

    if (widthDimension != "") {
      if (dimension != "") dimension += " x ";
      dimension += `${widthDimension}${this.RetrieveCodeDesc(this.widthDiameterUnitControl.value) || ''}`;
    }
    else {
      this.unitTypeChangedEventUnsub = true;
      this.widthDiameterUnitControl.reset();
      this.unitTypeChangedEventUnsub = false;
    }
    if (thicknessDimension != "") {
      if (dimension != "") dimension += " x ";
      dimension += `${thicknessDimension}${this.RetrieveCodeDesc(this.thicknessUnitControl.value) || ''}`;
    }
    else {
      this.unitTypeChangedEventUnsub = true;
      this.thicknessUnitControl.reset();
      this.unitTypeChangedEventUnsub = false;
    }

    let aliasName = `${this.pcForm?.get("part_name")?.value}`;
    if (dimension != "") aliasName += `  ${dimension}`
    this.pcForm.patchValue({
      alias: aliasName,
      dimension: dimension
    });
  }

  GetCodeValue(codeValue: String, codeValueItems: CodeValuesItem[]) {

    return codeValueItems.find(item => item.code_val === codeValue);

  }

  isRequired(path: string): boolean {
    // Assuming `pcForm` is a FormGroup or similar Angular reactive form object
    const control = this.pcForm.get(path); // Get the form control using the provided path
    if (control) {
      // Check if the control has a value (truthy or falsy)
      return !!control.value; // Convert the value to a boolean
    }
    return false; // Return false if the control doesn't exist
  }

  isAllowAdd() {
    return this.modulePackageService.hasFunctions(['TARIFF_REPAIR_ADD']);
  }
}
