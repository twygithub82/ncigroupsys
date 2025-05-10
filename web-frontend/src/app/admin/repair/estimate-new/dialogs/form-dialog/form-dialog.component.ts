import { Direction } from '@angular/cdk/bidi';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairDS, RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { TariffRepairDS } from 'app/data-sources/tariff-repair';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, Subject, tap } from 'rxjs';
import { SearchFormDialogComponent } from '../search-form-dialog/search-form-dialog.component';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';


export interface DialogData {
  action?: string;
  repair?: RepairItem;
  item?: RepairPartItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
  customer_company_guid?: string;
  existedPart?: RepairPartItem[]
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
    MatProgressSpinnerModule,
    PreventNonNumericDirective
  ],
})
export class FormDialogComponent extends UnsubscribeOnDestroyAdapter {
  public dataSubject: Subject<any> = new Subject();
  action: string;
  index: number;
  dialogTitle: string;
  customer_company_guid: string;

  repairPartForm: UntypedFormGroup;
  repairPart: any;
  repair: any;
  partNameControl: UntypedFormControl;
  partNameList?: string[];
  partNameFilteredList?: string[];
  dimensionList?: string[];
  lengthList?: any[];
  valueChangesDisabled: boolean = false;
  subgroupNameCvList?: CodeValuesItem[];
  existedPart?: RepairPartItem[];
  selected4XRepair = "";

  cvDS: CodeValuesDS;
  trDS: TariffRepairDS;
  repDrDS: RPDamageRepairDS;
  prDS: PackageRepairDS;
  repairDS: RepairDS;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private snackBar: MatSnackBar
  ) {
    super();
    // Set the defaults
    this.cvDS = new CodeValuesDS(this.apollo);
    this.trDS = new TariffRepairDS(this.apollo);
    this.repDrDS = new RPDamageRepairDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.repairDS = new RepairDS(this.apollo);
    this.action = data.action!;
    this.customer_company_guid = data.customer_company_guid!;
    if (this.action === 'edit') {
      this.dialogTitle = `${data.translatedLangText.DETAILS}`;
    } else {
      this.dialogTitle = `${data.translatedLangText.DETAILS}`;
    }
    this.repair = data.repair;
    this.repairPart = data.item ? data.item : new RepairPartItem();
    this.index = data.index;
    this.existedPart = data.existedPart;
    this.partNameControl = new UntypedFormControl('', [Validators.required]);
    this.repairPartForm = this.createForm();
    this.initializeValueChange();
    this.patchForm();
  }

  ngAfterViewInit() {
    this.initializePartNameValueChange();
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      guid: [this.repairPart.guid],
      tariff_repair_guid: [this.repairPart.tariff_repair_guid],
      part_name: [{ value: this.repairPart.tariff_repair?.part_name, disabled: !this.repairDS.canAmend(this.repair) }],
      repair_guid: [this.repairPart.repair_guid],
      description: [{ value: this.repairPart.description, disabled: !this.repairDS.canAmend(this.repair) }],
      location_cv: [{ value: this.repairPart.location_cv, disabled: !this.repairDS.canAmend(this.repair) }],
      comment: [{ value: this.repairPart.comment, disabled: !this.repairDS.canAmend(this.repair) }],
      remarks: [{ value: this.repairPart.remarks, disabled: !this.repairDS.canAmend(this.repair) }],
      quantity: [{ value: this.repairPart.quantity, disabled: !this.repairDS.canAmend(this.repair) }],
      hour: [{ value: this.repairPart.hour, disabled: !this.repairDS.canAmend(this.repair) }],
      group_name_cv: [{ value: this.repairPart.tariff_repair?.group_name_cv, disabled: !this.repairDS.canAmend(this.repair) }],
      subgroup_name_cv: [{ value: this.repairPart.tariff_repair?.subgroup_name_cv, disabled: !this.repairDS.canAmend(this.repair) }],
      dimension: [{ value: this.repairPart.tariff_repair?.dimension, disabled: !this.repairDS.canAmend(this.repair) }],
      length: [{ value: this.repairPart.tariff_repair?.length, disabled: !this.repairDS.canAmend(this.repair) }],
      damage: [{ value: this.REPDamageRepairToCV(this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 0 && x.action !== 'cancel' && !x.delete_dt)), disabled: !this.repairDS.canAmend(this.repair) }],
      repair: [{ value: this.REPDamageRepairToCV(this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 1 && x.action !== 'cancel' && !x.delete_dt)), disabled: !this.repairDS.canAmend(this.repair) }],
      material_cost: [{ value: this.repairPart.material_cost, disabled: !this.repairDS.canAmend(this.repair) }]
    });
  }

  patchForm() {
    const selectedCodeValue = this.data.populateData.groupNameCvList.find(
      (item: any) => item.code_val === this.repairPart.tariff_repair?.group_name_cv
    );
    this.repairPartForm.patchValue({
      guid: this.repairPart.guid,
      tariff_repair_guid: this.repairPart.tariff_repair_guid,
      repair_guid: this.repairPart.repair_guid,
      description: this.repairPart.description,
      location_cv: this.repairPart.location_cv,
      comment: this.repairPart.comment,
      remarks: this.repairPart.remarks,
      quantity: this.repairPart.quantity,
      hour: this.repairPart.hour,
      group_name_cv: selectedCodeValue,
      subgroup_name_cv: this.repairPart.tariff_repair?.subgroup_name_cv,
      part_name: this.repairPart.tariff_repair?.part_name,
      dimension: this.repairPart.tariff_repair?.dimension,
      length: this.repairPart.tariff_repair?.length,
      damage: this.REPDamageRepairToCV(this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 0 && x.action !== 'cancel' && !x.delete_dt)),
      repair: this.REPDamageRepairToCV(this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 1 && x.action !== 'cancel' && !x.delete_dt)),
      material_cost: this.repairPart.material_cost
    });
    this.onRepairSelectionChange({ value: this.repairPartForm.get('repair')?.value || [] });
  }

  resetForm() {

  }

  submit(addAnother: boolean) {
    if (this.repairPartForm?.valid) {
      if (this.action === 'new') {
        this.repairPart.action = 'new';
      } else {
        if (this.repairPart.action !== 'new') {
          this.repairPart.action = 'edit';
        }
      }

      var rep: any = {
        ...this.repairPart,
        location_cv: this.repairPartForm.get('location_cv')?.value,
        comment: this.repairPartForm.get('comment')?.value?.trim(),
        tariff_repair_guid: this.repairPart?.tariff_repair_guid,
        tariff_repair: this.repairPart?.tariff_repair,
        rp_damage_repair: [...this.REPDamage(this.repairPartForm.get('damage')?.value), ...this.REPRepair(this.repairPartForm.get('repair')?.value)],
        quantity: this.repairPartForm.get('quantity')?.value,
        hour: this.repairPartForm.get('hour')?.value,
        material_cost: Utility.convertNumber(this.repairPartForm.get('material_cost')?.value, 2),
        remarks: this.repairPartForm.get('remarks')?.value,
        create_dt: this.repairPart.create_dt ? this.repairPart.create_dt : Utility.convertDate(new Date())
      }
      const concludeLength = rep.tariff_repair?.length
        ? `${rep.tariff_repair.length}${this.getUnitTypeDescription(rep.tariff_repair.length_unit_cv)} `
        : '';

      let prefix = (`${this.getLocationDescription(rep.location_cv)}` + ' ' + (rep.comment ? rep.comment : '')).trim();
      prefix = prefix ? `${prefix} - ` : '';

      rep.description = `${prefix}${rep.tariff_repair?.alias} ${concludeLength} ${rep.remarks ?? ''}`.trim();
      console.log(rep)
      if (this.validateExistedPart(rep)) {
        this.confirmationDialog(addAnother, rep);
      } else {
        this.returnAndCloseDialog(addAnother, rep);
      }
    } else {
      this.findInvalidControls();
    }
  }

  confirmationDialog(addAnother: boolean, rep: any) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        headerText: this.data.translatedLangText.DUPLICATE_PART_DETECTED,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.returnAndCloseDialog(addAnother, rep);
      }
    });
  }

  returnAndCloseDialog(addAnother: boolean, rep: any) {
    const returnDialog: DialogData = {
      item: rep,
      index: this.index
    }
    if (addAnother) {
      this.dataSubject.next(returnDialog);
      this.addedSuccessfully();
      this.repairPart = new RepairPartItem();
      this.repairPartForm = this.createForm();
      this.initializeValueChange();
      this.initializePartNameValueChange();
    } else {
      this.dialogRef.close(returnDialog);
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

  initializeValueChange() {
    this.repairPartForm?.get('group_name_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        const subgroupName = this.repairPartForm?.get('subgroup_name_cv');
        if (value) {
          this.subgroupNameCvList = this.data.populateData.subgroupNameCvList.filter((sgcv: CodeValuesItem) => sgcv.code_val_type === value.child_code)
          if (value.child_code) {
            if (this.repairDS.canAmend(this.repair)) {
              subgroupName?.enable();
            }
            if ((this.subgroupNameCvList?.length ?? 0) > 1) {
              this.subgroupNameCvList = addDefaultSelectOption(this.subgroupNameCvList, 'All', '');
            } else {
              subgroupName?.disable();
            }
          } else {
            subgroupName?.setValue('');
            subgroupName?.disable();
          }
        } else {
          subgroupName?.disable();
        }
      })
    ).subscribe();

    this.repairPartForm?.get('subgroup_name_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        const groupName = this.repairPartForm?.get('group_name_cv')?.value;
        if (groupName) {
          this.trDS.searchDistinctPartName(groupName.code_val, value || '').subscribe(data => {
            this.partNameList = data;
          });
        }
      })
    ).subscribe();

    this.repairPartForm?.get('repair')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value.includes('4X')) {
          this.SetRepair4X(false);
        } else {
          this.SetRepair4X(true);
          this.repairPartForm.get('material_cost')?.setValue(this.repairPart?.material_cost?.toFixed(2) ?? 0.00);
        }
      })
    ).subscribe();
  }

  initializePartNameValueChange() {
    this.repairPartForm?.get('part_name')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          this.searchPart();
        }
      })
    ).subscribe();
  }

  // handleValueChange(value: any) {
  //   this.valueChangesDisabled = true;
  //   if (value) {
  //     this.partNameFilteredList = this.partNameList?.filter(item =>
  //       item.toLowerCase().includes(value.toLowerCase()) // case-insensitive filtering
  //     );
  //     const isValid = this.partNameList?.some(item => item === value);
  //     if (isValid) {
  //       // Only search if the value exists in the partNameList
  //       this.trDS.searchDistinctDimension(value).subscribe(data => {
  //         this.dimensionList = data;
  //         if (!this.dimensionList.length) {
  //           this.repairPartForm?.get('dimension')?.disable();
  //           this.getCustomerCost(value, undefined, undefined);
  //         } else {
  //           this.repairPartForm?.get('dimension')?.enable();
  //         }
  //       });
  //     }
  //   } else {
  //     // If no value is entered, reset the filtered list to the full list
  //     this.partNameFilteredList = this.partNameList;
  //   }
  //   this.valueChangesDisabled = false;
  // }

  findInvalidControls() {
    const controls = this.repairPartForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  // REPDamage(damages: any[]): RPDamageRepairItem[] {
  //   const damage = this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 0);

  //   damage.forEach((x: any) => {
  //     if (damages.includes(x.code_cv)) {
  //       x.action = (x.action === '' || x.action === 'new') ? 'new' : 'edit'
  //     }
  //   });

  //   return damages.map(dmg => {
  //     return this.repDrDS.createREPDamage(undefined, undefined, dmg)
  //   });
  // }

  SetRepair4X(isEnable: boolean) {
    const quantity = this.repairPartForm?.get('quantity');
    const hour = this.repairPartForm?.get('hour');
    const material_cost = this.repairPartForm?.get('material_cost');
    if (!isEnable) {
      quantity?.setValue(0);
      quantity?.disable();
      hour?.setValue(0);
      hour?.disable();
    } else {
      quantity?.enable();
      hour?.enable();
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

  REPDamage(damages: string[]): RPDamageRepairItem[] {
    const existingDamage = this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 0);

    const finalDamages: RPDamageRepairItem[] = [];

    existingDamage?.forEach((x: any) => {
      if (damages.includes(x.code_cv)) {
        x.action = (x.action === '' || x.action === 'new') ? 'new' : 'edit';
        if (x.action === 'edit' && x.delete_dt) {
          x.action = 'rollback'
        }
      } else {
        x.action = 'cancel';
      }

      if (x.guid || !x.guid && x.action !== 'cancel') {
        finalDamages.push(x);
      }
    });

    damages.forEach(dmg => {
      const found = existingDamage?.some((x: any) => x.code_cv === dmg);
      if (!found) {
        const newDamage = this.repDrDS.createREPDamage(undefined, undefined, dmg);
        finalDamages.push(newDamage);
      }
    });

    return finalDamages;
  }

  REPRepair(repairs: any[]): RPDamageRepairItem[] {
    const existingRepair = this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 1);

    const finalRepairs: RPDamageRepairItem[] = [];

    existingRepair?.forEach((x: any) => {
      if ((!x.guid && repairs.includes(x.code_cv)) || (x.guid && repairs.includes(x.code_cv))) {
        x.action = (x.action === '' || x.action === 'new') ? 'new' : 'edit';
        if (x.action === 'edit' && x.delete_dt) {
          x.action = 'rollback'
        }
      } else {
        x.action = 'cancel';
      }

      if (x.guid || !x.guid && x.action !== 'cancel') {
        finalRepairs.push(x);
      }
    });

    repairs.forEach(dmg => {
      const found = existingRepair?.some((x: any) => x.code_cv === dmg);
      if (!found) {
        const newDamage = this.repDrDS.createREPRepair(undefined, undefined, dmg);
        finalRepairs.push(newDamage);
      }
    });

    return finalRepairs;
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

  // canEdit(): boolean {
  //   return true;
  // }

  isEdit(): boolean {
    return this.action === 'edit';
  }

  getLocationDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData?.partLocationCvList);
  }

  getUnitTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.data.populateData.unitTypeCvList);
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
        this.repairPart.material_cost = result.selected_repair_part?.material_cost;
        this.repairPart.tariff_repair_guid = result.selected_repair_part?.tariff_repair_guid;
        this.repairPart.tariff_repair = result.selected_repair_part?.tariff_repair;
        this.repairPartForm.get('material_cost')?.setValue(this.repairPart?.material_cost!.toFixed(2));
      }
    });
  }

  addedSuccessfully() {
    ComponentUtil.showNotification('snackbar-success', this.data.translatedLangText.ADD_SUCCESS, 'top', 'center', this.snackBar);
  }

  extractDescription(rep: RepairPartItem) {
    const concludeLength = rep.tariff_repair?.length
      ? `${rep.tariff_repair.length}${this.getUnitTypeDescription(rep.tariff_repair.length_unit_cv)} `
      : '';
    return `${this.getLocationDescription(rep.location_cv)} ${rep.tariff_repair?.part_name} ${concludeLength} ${rep.remarks ?? ''}`.trim();
  }

  validateExistedPart(toValidatePart: RepairPartItem): boolean | undefined {
    return this.existedPart?.some((part: RepairPartItem) => {
      return toValidatePart.guid !== part.guid && this.extractDescription(toValidatePart) === this.extractDescription(part);
    }) || false;
  }
}
