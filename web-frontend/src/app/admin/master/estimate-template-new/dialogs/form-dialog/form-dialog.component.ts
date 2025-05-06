import { Direction } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { TemplateEstPartItem } from 'app/data-sources/master-template';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairDS, RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS } from 'app/data-sources/tariff-cleaning';
import { TariffRepairDS, TariffRepairItem } from 'app/data-sources/tariff-repair';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ComponentUtil } from 'app/utilities/component-util';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';
import { SearchFormDialogComponent } from '../search-form-dialog/search-form-dialog.component';

export interface DialogData {
  action?: string;
  item?: TemplateEstPartItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
  customer_company_guid?: string;
}

@Component({
  selector: 'app-repair-estimate-form-dialog',
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
    PreventNonNumericDirective
  ],
})
export class FormDialogComponent extends UnsubscribeOnDestroyAdapter {
  action: string;
  index: number;
  dialogTitle: string;
  buttonContent: string;
  customer_company_guid: string;
  selected4XRepair = "";

  repairPartForm: UntypedFormGroup;
  repairPart: any;
  partNameControl: UntypedFormControl;
  partNameList?: string[];
  partNameFilteredList?: string[];
  dimensionList?: string[];
  lengthList?: any[];
  valueChangesDisabled: boolean = false;
  subgroupNameCvList?: CodeValuesItem[];

  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  trDS: TariffRepairDS;
  repDrDS: RPDamageRepairDS;
  prDS: PackageRepairDS;
  currentParts: TemplateEstPartItem[] = [];
  //popupPartSelectionDialog:boolean=true;

  @Output() InsertEstimationPartEvent = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private snackBar: MatSnackBar,

  ) {
    super();
    // Set the defaults
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.trDS = new TariffRepairDS(this.apollo);
    this.repDrDS = new RPDamageRepairDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.action = data.action!;
    this.customer_company_guid = data.customer_company_guid!;
    if (this.action === 'edit') {
      this.dialogTitle = `${data.translatedLangText.EDIT} ${data.translatedLangText.ESTIMATE_DETAILS}`;
      this.buttonContent = `${data.translatedLangText.UPDATE}`;
    } else {
      this.dialogTitle = `${data.translatedLangText.NEW} ${data.translatedLangText.ESTIMATE_DETAILS}`;
      this.buttonContent = `${data.translatedLangText.SAVE}`;
    }
    this.currentParts = data.populateData.currentParts ? data.populateData.currentParts : [];
    this.repairPart = data.item ? data.item : new RepairPartItem();
    if (this.repairPart.tariff_repair.material_cost) this.repairPart.material_cost = this.repairPart.tariff_repair.material_cost.toFixed(2);

    this.index = data.index;
    this.partNameControl = new UntypedFormControl('', [Validators.required]);
    this.repairPartForm = this.createForm();
    this.patchForm();
    this.initializeValueChange();
    this.initializePartNameValueChange();

  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      guid: [this.repairPart.guid],
      tariff_repair_guid: [this.repairPart.tariff_repair_guid],
      part_name: [this.repairPart.tariff_repair?.part_name],
      repair_est_guid: [this.repairPart.repair_est_guid],
      description: [{ value: this.repairPart.description, disabled: !this.canEdit() }],
      location_cv: [{ value: this.repairPart.location_cv, disabled: !this.canEdit() }],
      remarks: [{ value: this.repairPart.remarks, disabled: !this.canEdit() }],
      quantity: [{ value: this.repairPart.quantity, disabled: !this.canEdit() }],
      hour: [{ value: this.repairPart.hour, disabled: !this.canEdit() }],
      group_name_cv: [{ value: this.repairPart.tariff_repair?.group_name_cv, disabled: !this.canEdit() }],
      subgroup_name_cv: [{ value: this.repairPart.tariff_repair?.subgroup_name_cv, disabled: !this.canEdit() }],
      dimension: [''],
      length: [''],
      damage: [''],
      repair: [''],
      material_cost: [{ value: '' }],
      comment: [{ value: this.repairPart.comment, disabled: !this.canEdit() }],
    });
  }

  patchForm() {
    const selectedCodeValue = this.data.populateData.groupNameCvList.find(
      (item: any) => item.code_val === this.repairPart.tariff_repair?.group_name_cv
    );
    if (selectedCodeValue) {
      this.subgroupNameCvList = this.data.populateData.subgroupNameCvList.filter((sgcv: CodeValuesItem) => sgcv.code_val_type === selectedCodeValue.child_code)
      this.subgroupNameCvList = addDefaultSelectOption(this.subgroupNameCvList, '-', '');
    }
    this.repairPartForm.patchValue({
      guid: this.repairPart.guid,
      tariff_repair_guid: this.repairPart.tariff_repair_guid,
      repair_est_guid: this.repairPart.repair_est_guid,
      description: this.repairPart.description,
      location_cv: this.repairPart.location_cv,
      remarks: this.repairPart.remarks,
      quantity: this.repairPart.quantity,
      hour: this.repairPart.hour,
      group_name_cv: selectedCodeValue,
      subgroup_name_cv: this.repairPart.tariff_repair?.subgroup_name_cv,
      part_name: this.repairPart.tariff_repair?.part_name,
      dimension: this.repairPart.tariff_repair?.dimension,
      length: this.repairPart.tariff_repair?.length,
      damage: this.REPDamageRepairToCV(this.repairPart.tep_damage_repair?.filter((x: any) => x.code_type === 0)),
      repair: this.REPDamageRepairToCV(this.repairPart.tep_damage_repair?.filter((x: any) => x.code_type === 1)),
      material_cost: this.repairPart.tariff_repair?.material_cost,
      comment: this.repairPart.comment
    });

  }


  CheckPartExistInTheList(rep: any): boolean {
    let existPart = this.currentParts.filter((data, index) => { return data.description === rep.description && index != this.data.index });
    return existPart.length > 0;
  }
  submit(addAnother: boolean) {
    if (this.repairPartForm?.valid) {
      let actions = Array.isArray(this.repairPart.actions!) ? [...this.repairPart.actions!] : [];
      if (this.action === 'new') {
        if (!actions.includes('new')) {
          actions = [...new Set([...actions, 'new'])];
        }
      } else {
        if (!actions.includes('new')) {
          actions = [...new Set([...actions, 'edit'])];
        }
      }
      var rep: any = {
        ...this.repairPart,
        comment: this.repairPartForm.get('comment')?.value,
        location_cv: this.repairPartForm.get('location_cv')?.value,
        tariff_repair_guid: this.repairPart?.tariff_repair_guid,
        tariff_repair: this.repairPart?.tariff_repair,
        tep_damage_repair: [...this.REPDamage(this.repairPartForm.get('damage')?.value), ...this.REPRepair(this.repairPartForm.get('repair')?.value)],
        // repair: this.REPRepair(this.repairPartForm.get('repair')?.value),
        quantity: this.repairPartForm.get('quantity')?.value,
        hour: this.repairPartForm.get('hour')?.value,
        material_cost: this.repairPartForm.get('material_cost')?.value,
        remarks: this.repairPartForm.get('remarks')?.value,

        actions
      }
      let delimiter = '';
      if (rep.location_cv || rep.comment) {
        delimiter = '-';
      }

      rep.description = `${this.getLocationDescription(rep.location_cv)} ${rep.comment ?? ''} ${delimiter} ${rep.tariff_repair?.part_name ?? ''} ${rep.tariff_repair?.length ?? ''}${this.getUnitTypeDescription(rep.tariff_repair?.length_unit_cv)} ${rep.remarks ?? ''}`.trim();
      console.log(rep)
      const returnDialog: DialogData = {
        item: rep,
        index: this.index
      }
      var dupFound: boolean = false;
      dupFound = this.CheckPartExistInTheList(rep);

      if (dupFound) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            headerText: this.data.translatedLangText.DUPLICATE_ESTIMATION_DETECTED,
            action: 'new',
          }

        });
        this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
          if (result.action === 'confirmed') {
            // if(this.buttonContent==this.data.translatedLangText.UPDATE)
            //   { 
            if (addAnother) {
              this.InsertEstimationPartEvent.emit(rep);
              this.repairPart = new RepairPartItem();
              this.repairPart.tariff_repair = new TariffRepairItem();
              this.repairPartForm = this.createForm();
              this.initializeValueChange();
              this.patchForm();
              this.initializePartNameValueChange();
              this.handleSaveSuccess(1);
              this.currentParts.push(rep);
            }
            else {
              this.handleSaveSuccess(1);
              this.dialogRef.close(returnDialog);
            }

            // }
            // else
            // {
            //   this.InsertEstimationPartEvent.emit(rep);
            //   this.repairPart =  new RepairPartItem();
            //   this.repairPart.tariff_repair= new TariffRepairItem();
            //   this.repairPartForm = this.createForm();
            //   this.initializeValueChange();
            //   this.patchForm();
            //   this.initializePartNameValueChange();
            //   this.handleSaveSuccess(1);
            //   this.currentParts.push(rep);
            // }
          }
        });
      }
      else {

        if (addAnother) {
          this.InsertEstimationPartEvent.emit(rep);
          this.repairPart = new RepairPartItem();
          this.repairPart.tariff_repair = new TariffRepairItem();
          this.repairPartForm = this.createForm();
          this.initializeValueChange();
          this.patchForm();
          this.initializePartNameValueChange();
          this.handleSaveSuccess(1);
          this.currentParts.push(rep);

        }
        else {
          this.handleSaveSuccess(1);
          this.dialogRef.close(returnDialog);
        }
        // if(this.buttonContent==this.data.translatedLangText.UPDATE)
        // { 
        // this.handleSaveSuccess(1);
        // this.dialogRef.close(returnDialog);

        // }
        // else
        // {
        //   this.InsertEstimationPartEvent.emit(rep);
        //   this.repairPart =  new RepairPartItem();
        //   this.repairPart.tariff_repair= new TariffRepairItem();
        //   this.repairPartForm = this.createForm();
        //   this.initializeValueChange();
        //   this.patchForm();
        //   this.initializePartNameValueChange();
        //   this.handleSaveSuccess(1);
        //   this.currentParts.push(rep);
        // }
      }
    } else {
      this.findInvalidControls();
    }
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

  initializePartNameValueChange() {

    this.repairPartForm?.get('part_name')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          // if(this.popupPartSelectionDialog)
          {

            this.resetPartSelectedDetail();
            this.searchPart();
          }
          //this.popupPartSelectionDialog=true;
        }
      })
    ).subscribe();
  }

  initializeValueChange() {
    this.repairPartForm?.get('group_name_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {

        if (!value) return;
        this.partNameList = [];
        this.subgroupNameCvList = [];
        this.resetPartSelectedDetail();
        this.repairPartForm.patchValue({
          subgroup_name_cv: undefined,
          part_name: undefined
        });

        if (value?.child_code) {

          this.subgroupNameCvList = this.data.populateData.subgroupNameCvList.filter((sgcv: CodeValuesItem) => sgcv.code_val_type === value.child_code)
          this.subgroupNameCvList = addDefaultSelectOption(this.subgroupNameCvList, '-', '');
          // const queries = [
          //   { alias: 'subgroupNameCv', codeValType: value.child_code },
          // ];
          // this.cvDS.getCodeValuesByType(queries);
          // this.cvDS.connectAlias('subgroupNameCv').subscribe(data => {
          //   this.data.populateData.subgroupNameCvList = data;
          // });

        }

        if (value) {
          this.trDS.searchDistinctPartName(value.code_val, '').subscribe(data => {
            this.partNameList = data;
          });
        }
        // if(value){
        // this.trDS.searchDistinctPartName(value.code_val, '').subscribe(data => {
        //   this.partNameList = data;
        // }); 
        //}

      })
    ).subscribe();

    this.repairPartForm?.get('subgroup_name_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        const groupName = this.repairPartForm?.get('group_name_cv')?.value;
        if (value) {


          this.trDS.searchDistinctPartName(groupName.code_val, value).subscribe(data => {
            this.partNameList = data;
            // this.partNameFilteredList = data
            // this.updateValidators(this.partNameList);
            // if (this.partNameControl.value) {
            //   this.handleValueChange(this.partNameControl.value)
            // }
          });
        }
        else if (groupName) {
          if (this.repairPartForm?.get('subgroup_name_cv')?.value !== undefined) {
            this.trDS.searchDistinctPartName(groupName.code_val, '').subscribe(data => {
              this.partNameList = data;
            });
          }
        }
      })
    ).subscribe();
  }

  findInvalidControls() {
    const controls = this.repairPartForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  REPDamage(damages: any[]): RPDamageRepairItem[] {
    return damages.map(dmg => this.repDrDS.createREPDamage(undefined, undefined, dmg));
  }

  REPRepair(repairs: any[]): RPDamageRepairItem[] {
    return repairs.map(rp => this.repDrDS.createREPRepair(undefined, undefined, rp));
  }

  REPDamageRepairToCV(damagesRepair: any[] | undefined): RPDamageRepairItem[] {
    return damagesRepair?.map(dmgRp => dmgRp.code_cv) || [];
  }

  displayPartNameFn(tr: string): string {
    return tr;
  }

  validateLength(): boolean {
    let isValid = true;
    const length = this.repairPartForm.get('length')?.value;
    const remarks = this.repairPartForm.get('remarks')?.value;

    // Validate that at least one of the purpose checkboxes is checked
    if (!length && !remarks) {
      isValid = false; // At least one purpose must be selected
      this.repairPartForm.get('remarks')?.setErrors({ required: true });
    }

    return isValid;
  }

  canAddAnother(): boolean {
    return this.buttonContent !== this.data.translatedLangText.EDIT;
  }

  canEdit(): boolean {
    return true;
  }

  // updateValidators(validOptions: any[]) {
  //   this.partNameControl.setValidators([
  //     Validators.required,
  //     AutocompleteSelectionValidator(validOptions)
  //   ]);
  // }

  getLocationDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData?.partLocationCvList);
  }

  getUnitTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.data.populateData.unitTypeCvList);
  }


  resetPartSelectedDetail() {
    this.repairPart.tariff_repair_guid = undefined;
    this.repairPart.tariff_repair.alias = '';
    this.repairPart.tariff_repair.length = '';
    this.repairPart.tariff_repair.length_unit_cv = '';
    this.repairPart.tariff_repair.material_cost = '';
  }

  searchPart() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(SearchFormDialogComponent, {
      width: '1050px',
      data: {
        customer_company_guid: this.customer_company_guid,
        group_name_cv: this.repairPartForm?.get('group_name_cv')!.value?.code_val,
        subgroup_name_cv: this.repairPartForm?.get('subgroup_name_cv')!.value,
        part_name: this.repairPartForm?.get('part_name')!.value,
        translatedLangText: this.data.translatedLangText,
        populateData: this.data.populateData,
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.repairPart = result.selected_repair_est_part;
        this.repairPartForm.get('material_cost')?.setValue(this.repairPart?.material_cost!.toFixed(2));
      }

    });
  }

  EnableValidator(path: string) {
    this.repairPartForm.get(path)?.setValidators([
      Validators.required  // If you have a required validator
    ]);

    this.repairPartForm.get(path)?.updateValueAndValidity();  // Revalidate the control

  }

  DisableValidator(path: string) {
    this.repairPartForm.get(path)?.clearValidators();

  }

  DisableAllRequireValidator() {
    this.DisableValidator('part_name');
    this.DisableValidator('group_name_cv');
    this.DisableValidator('hour');
    this.DisableValidator('quantity');
    this.DisableValidator('damage');
    this.DisableValidator('repair');
  }

  EnableAllRequireValidator() {
    this.EnableValidator('part_name');
    this.EnableValidator('group_name_cv');
    this.EnableValidator('hour');
    this.EnableValidator('quantity');
    this.EnableValidator('damage');
    this.EnableValidator('repair');
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.data.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
    }
  }

  onRepairSelectionChange(event: any) {
    if (event.value.includes('4X')) {
      this.selected4XRepair = "4X";
    } else {
      if (event.value.length) {
        this.selected4XRepair = "oth";
      } else {
        this.selected4XRepair = "";
      }
    }
  }

  isDisabledOption(compareValue?: string) {
    if (!this.selected4XRepair) return false;

    if (this.selected4XRepair === "oth") {
      if (compareValue !== "4X") {
        return false;
      } else {
        return true;
      }
    } else if (this.selected4XRepair === "4X") {
      if (compareValue !== "4X") {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}
