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
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { TankItem } from 'app/data-sources/tank';
import { TariffDepotItem } from 'app/data-sources/tariff-depot';
import { TariffRepairDS, TariffRepairItem } from 'app/data-sources/tariff-repair';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ModulePackageService } from 'app/services/module-package.service';

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
  selector: 'app-tariff-repair-edit-form-dialog',
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
export class FormDialogComponent_Edit extends UnsubscribeOnDestroyAdapter {
  displayedColumns = [
    'fName',
    'lName',
    'email',
    'gender',
    'bDate',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;


  cvDS: CodeValuesDS;
  groupNameCvList: CodeValuesItem[] = [];
  subGroupNameCvList: CodeValuesItem[] = [];
  lengthTypeCvList: CodeValuesItem[] = [];
  unitTypeCvList: CodeValuesItem[] = [];
  allSubGroupNameCvList: CodeValuesItem[] = [];

  trfRepairDS: TariffRepairDS;
  tnkItems?: TankItem[] = [];

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
    ALIAS_NAME: "COMMON-FORM.ALIAS-NAME"
  };
  unit_type_control = new UntypedFormControl();

  unitTypeChangedEventUnsub: boolean = false;
  selectedItems: TariffRepairItem[];

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent_Edit>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
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

    if (this.selectedItems.length == 1) {
      var rec = this.selectedItems[0];
      this.pcForm.patchValue({
        group_name_cv: this.groupNameControl,
        sub_group_name_cv: this.subGroupNameControl,
        part_name: rec.part_name,
        alias: rec.alias,
        dimension: rec.dimension,
        height_diameter: rec.height_diameter,
        height_diameter_unit_cv: this.heightDiameterUnitControl,
        width_diameter: rec.width_diameter,
        width_diameter_unit_cv: this.widthDiameterUnitControl,
        thickness: rec.thickness,
        thickness_unit_cv: this.thicknessUnitControl,
        length: rec.length,
        length_unit_cv: this.lengthUnitControl,
        labour_hour: rec.labour_hour,
        material_cost: rec.material_cost?.toFixed(2),
      });

      if (!this.canEdit()) {
        this.pcForm.get('part_name')?.disable();
        this.pcForm.get('alias')?.disable();
        this.pcForm.get('dimension')?.disable();
        this.pcForm.get('height_diameter')?.disable();
        this.pcForm.get('width_diameter')?.disable();
        this.pcForm.get('thickness')?.disable();
        this.pcForm.get('length')?.disable();
        this.pcForm.get('labour_hour')?.disable();
        this.pcForm.get('material_cost')?.disable();

        this.groupNameControl.disable();
        this.subGroupNameControl.disable();
        this.heightDiameterUnitControl.disable();
        this.widthDiameterUnitControl.disable();
        this.thicknessUnitControl.disable();
        this.lengthUnitControl.disable();
      }
    }
    else if (this.selectedItems.length > 1) {
      this.assignEditableForUI();
    }
  }

  assignEditableForUI() {
    this.groupNameControl.disable();
    this.subGroupNameControl.disable();
    this.thicknessUnitControl.disable();
    this.lengthUnitControl.disable();
    this.groupNameControl.disable();
    this.subGroupNameControl.disable();
    this.widthDiameterUnitControl.disable();
    this.heightDiameterUnitControl.disable();
    this.pcForm.get('part_name')?.disable();
    this.pcForm.get('height_diameter')?.disable();
    this.pcForm.get('width_diameter')?.disable();
    this.pcForm.get('thickness')?.disable();
    this.pcForm.get('length')?.disable();
  }

  createTarifRepair(): UntypedFormGroup {
    return this.fb.group({
      selectedItems: this.selectedItems,
      action: this.action,
      group_name_cv: this.groupNameControl,
      sub_group_name_cv: this.subGroupNameControl,
      part_name: [''],
      alias: ({ value: '', disabled: true }),
      dimension: ({ value: '', disabled: true }),
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

  GetButtonCaption() {
    return this.translatedLangText.CANCEL;
  }

  GetTitle() {
    return this.translatedLangText.EDIT + " " + this.translatedLangText.REPAIR + " " + this.translatedLangText.ITEM;
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
      if (this.groupNameCvList) {
        this.groupNameCvList = [...this.groupNameCvList].sort((a, b) => a.description!.localeCompare(b.description!));
      }
      const subqueries: any[] = [];
      data.map(d => {
        if (d?.child_code) {
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
            if (data.length > 0)
              this.allSubGroupNameCvList.push(...data);
          });
        });
      }
      if (this.selectedItems.length == 1) {
        var rec = this.selectedItems[0];
        var group_name_codeValue = this.getGroupNameCodeValue(rec.group_name_cv!) || new CodeValuesItem();
        this.groupNameControl.setValue(group_name_codeValue);
      }
    });

    this.cvDS.connectAlias('unitType').subscribe(data => {
      this.unitTypeCvList = this.sortByDescription(data);
      if (this.selectedItems.length == 1) {
        var rec = this.selectedItems[0];
        this.lengthUnitControl.setValue(this.getUnitTypeCodeValue(rec.length_unit_cv!));
        this.widthDiameterUnitControl.setValue(this.getUnitTypeCodeValue(rec.width_diameter_unit_cv!));
        this.heightDiameterUnitControl.setValue(this.getUnitTypeCodeValue(rec.height_diameter_unit_cv!));
        this.thicknessUnitControl.setValue(this.getUnitTypeCodeValue(rec.thickness_unit_cv!));
      }
    });

    this.pcForm?.get('group_name_cv')?.valueChanges.subscribe(value => {
      console.log('Selected value:', value);
      var aliasName = value?.child_code;
      if (aliasName === undefined) return;
      const subqueries: any[] = [{ alias: aliasName, codeValType: aliasName }];
      this.cvDS.getCodeValuesByType(subqueries);
      this.cvDS.connectAlias(aliasName).subscribe(data => {
        this.subGroupNameCvList = data;
        if (this.selectedItems.length == 1) {
          var rec = this.selectedItems[0];
          var subgroupNameCodeValue = this.GetCodeValue(rec.subgroup_name_cv!, this.subGroupNameCvList);
          this.subGroupNameControl.setValue(subgroupNameCodeValue);
        }
      });
    });
    this.listenTheValueChangesForPartNameDiameter();
  }

  isFieldRequiredSubGroup() {
    return this.selectedItems.length == 1 || !!this.pcForm.controls['group_name_cv'].value;;
  }

  isFieldRequired() {
    return this.selectedItems.length == 1;
  }

  canEdit() {
    return this.isAllowEdit();
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      console.log('valid');
      this.dialogRef.close(count);
    }
  }

  sortByDescription<T extends { description?: string }>(list: T[]): T[] {
    return [...list].sort((a, b) => (a.description || '').localeCompare(b.description || ''));
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

  RetrieveCodeDesc(CdValue: CodeValuesItem): String {
    let retCodeValue: String = '';
    if (CdValue) {
      retCodeValue = CdValue.description || '';
    }
    return retCodeValue;
  }

  RetrieveCodeValue(CdValue: CodeValuesItem): string {
    let retCodeValue: string = '';
    if (CdValue) {
      retCodeValue = CdValue.code_val || '';
    }
    return retCodeValue;
  }

  update() {
    let update = true;
    if (!this.pcForm?.valid) return;

    if (this.selectedItems.length == 1) {
      let where: any = {};
      if (this.pcForm!.get('alias')?.value) {
        where.alias = { eq: this.pcForm!.get('alias')?.value };
      }

      if (this.pcForm!.value['length']) {
        where.length = { eq: this.pcForm!.value['length'] };
        where.length_unit_cv = { eq: this.RetrieveCodeValue(this.pcForm!.value['length_unit_cv']) };
      }

      this.subs.sink = this.trfRepairDS.SearchTariffRepair(where).subscribe(data => {

        update = true;
        if (data.length > 0) {
          var queriedRec = data[0];
          if (this.selectedItems.length > 1) {
            update = false;
            this.pcForm?.get('part_name')?.setErrors({ existed: true });
          }
          else if (queriedRec.guid != this.selectedItems[0].guid) {

            update = false;
            this.pcForm?.get('part_name')?.setErrors({ existed: true });
          }
        }
        if (update) {
          if (this.selectedItems.length == 1) {
            var trfRepairItem = new TariffRepairItem(this.selectedItems[0]);
            trfRepairItem.part_name = this.pcForm!.value['part_name'];
            trfRepairItem.alias = this.pcForm!.get('alias')?.value;
            trfRepairItem.dimension = this.pcForm!.get('dimension')?.value;
            trfRepairItem.height_diameter = this.pcForm!.value['height_diameter'];
            trfRepairItem.height_diameter_unit_cv = String(this.RetrieveCodeValue(this.pcForm!.value['height_diameter_unit_cv']));

            trfRepairItem.subgroup_name_cv = String(this.RetrieveCodeValue(this.pcForm!.value['sub_group_name_cv']));
            trfRepairItem.group_name_cv = String(this.RetrieveCodeValue(this.pcForm!.value['group_name_cv']));
            trfRepairItem.labour_hour = this.pcForm!.value['labour_hour'];
            trfRepairItem.material_cost = Number(this.pcForm!.value['material_cost']);
            trfRepairItem.length = this.pcForm!.value['length'];
            trfRepairItem.length_unit_cv = String(this.RetrieveCodeValue(this.pcForm!.value['length_unit_cv']));

            trfRepairItem.width_diameter = this.pcForm!.value['width_diameter'];
            trfRepairItem.width_diameter_unit_cv = String(this.RetrieveCodeValue(this.pcForm!.value['width_diameter_unit_cv']));
            trfRepairItem.thickness = this.pcForm!.value['thickness'];
            trfRepairItem.thickness_unit_cv = String(this.RetrieveCodeValue(this.pcForm!.value['thickness_unit_cv']));

            this.trfRepairDS.updateTariffRepair(trfRepairItem).subscribe(result => {
              this.handleSaveSuccess(result?.data?.updateTariffRepair);
            });
          }
          else {

          }
        }
      });
    }
    else if (this.selectedItems.length > 1) {
      this.updateMaterialCostAndLabourCostByPercentage();
      // let pd_guids: string[] = this.selectedItems
      //   .map(cc => cc.guid)
      //   .filter((guid): guid is string => guid !== undefined);

      // var trfRepairItem = new TariffRepairItem();
      // trfRepairItem.part_name = this.pcForm!.get('part_name')?.value;
      // trfRepairItem.dimension = this.pcForm!.get('dimension')?.value;
      // trfRepairItem.height_diameter = -1;
      // trfRepairItem.height_diameter_unit_cv = this.RetrieveCodeValue(this.pcForm!.value['height_diameter_unit_cv']);
      // trfRepairItem.width_diameter = -1;
      // trfRepairItem.width_diameter_unit_cv = String(this.RetrieveCodeValue(this.pcForm!.value['width_diameter_unit_cv']));
      // trfRepairItem.subgroup_name_cv = String(this.RetrieveCodeValue(this.pcForm!.value['sub_group_name_cv']));
      // trfRepairItem.group_name_cv = String(this.RetrieveCodeValue(this.pcForm!.value['group_name_cv']));
      // trfRepairItem.labour_hour = -1;
      // if (this.pcForm!.value['labour_hour']) trfRepairItem.labour_hour = this.pcForm!.value['labour_hour'];
      // trfRepairItem.material_cost = -1;
      // if (this.pcForm!.value['material_cost']) trfRepairItem.material_cost = this.pcForm!.value['material_cost'];
      // trfRepairItem.alias = this.pcForm!.get('alias')?.value;
      // trfRepairItem.length = -1;
      // trfRepairItem.length_unit_cv = this.RetrieveCodeValue(this.pcForm!.value['length_unit_cv']);
      // trfRepairItem.width_diameter = -1;
      // trfRepairItem.thickness = -1;
      // trfRepairItem.thickness_unit_cv = this.RetrieveCodeValue(this.pcForm!.value['thickness_unit_cv']);

      // trfRepairItem.remarks = this.RetrieveCodeValue(this.pcForm!.value['remarks']);

      // if (!update) return;

      // this.trfRepairDS.updateTariffRepairs(pd_guids, trfRepairItem.group_name_cv, trfRepairItem.subgroup_name_cv, trfRepairItem.dimension, trfRepairItem.height_diameter,
      //   trfRepairItem.height_diameter_unit_cv, trfRepairItem.width_diameter, trfRepairItem.width_diameter_unit_cv, trfRepairItem.labour_hour,
      //   trfRepairItem.length, trfRepairItem.length_unit_cv, trfRepairItem.material_cost, trfRepairItem.part_name, trfRepairItem.alias, trfRepairItem.thickness, trfRepairItem.thickness_unit_cv,
      //   trfRepairItem.remarks
      // ).subscribe(result => {
      //   this.handleSaveSuccess(result?.data?.updateTariffRepairs);
      // });
    }
  }

  updateMaterialCostAndLabourCostByPercentage() {
    let pd_guids = this.selectedItems.map(i => i.guid) || [];
    let materialCostPercentage = 1;
    let labourCostPercentage = 1;
    if (this.pcForm!.value['labour_hour']) labourCostPercentage = (Number(this.pcForm!.value['labour_hour']) / 100) + 1;
    if (this.pcForm!.value['material_cost']) materialCostPercentage = (Number(this.pcForm!.value['material_cost']) / 100) + 1;

    this.trfRepairDS.updateTariffRepairs_MaterialCost("", "",
      "", "", -1, pd_guids, materialCostPercentage, labourCostPercentage
    ).subscribe(result => {
      this.handleSaveSuccess(result?.data?.updateTariffRepair_MaterialCost);
    });

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
    this.pcForm.get("part_name")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get("height_diameter")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get("height_diameter_unit_cv")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get("width_diameter")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get("width_diameter_unit_cv")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get("thickness")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get("thickness_unit_cv")?.valueChanges.subscribe(value => { this.updateDimensionAndAliasName() });
    this.pcForm.get('length')?.valueChanges.subscribe(value => {
      if (this.pcForm.get("part_name")?.hasError("existed")) {
        const partNameControl = this.pcForm.get("part_name");
        partNameControl?.setErrors(null);
      }

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

  isRequired(path: string): boolean {
    // Assuming `pcForm` is a FormGroup or similar Angular reactive form object
    const control = this.pcForm.get(path); // Get the form control using the provided path
    if (control) {
      // Check if the control has a value (truthy or falsy)
      return !!control.value; // Convert the value to a boolean
    }
    return false; // Return false if the control doesn't exist
  }

  isMultiSelect(): boolean {
    var bRetval: boolean = this.selectedItems.length > 1;
    return bRetval;
  }

  GetLabourCostLabel() {
    var content = this.translatedLangText.LABOUR_HOUR;
    if (this.isMultiSelect()) content += '(%)';
    content += ' :';
    return content
  }

  GetMaterialCostLabel() {
    var content = this.translatedLangText.MATERIAL_COST;
    if (this.isMultiSelect()) content += '(%)';
    content += ' :';
    return content
  }

  allowNegative(event: KeyboardEvent) {
    const allowedChars = /[0-9-]/;
    const allowedControlChars = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

    if (!allowedChars.test(event.key) && !allowedControlChars.includes(event.key)) {
      event.preventDefault();
    }

    // Additional logic to prevent multiple minus signs
    const input = event.target as HTMLInputElement;
    if (event.key === '-' && input.value.includes('-')) {
      event.preventDefault();
    }
  }

  positiveOnly(event: KeyboardEvent) {
    const allowedChars = /[0-9]/;
    const allowedControlChars = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

    if (!allowedChars.test(event.key) && !allowedControlChars.includes(event.key)) {
      event.preventDefault();
    }
  }

  selectAll(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    input.select();  // Selects all text in the input
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['TARIFF_REPAIR_EDIT']);
  }
}