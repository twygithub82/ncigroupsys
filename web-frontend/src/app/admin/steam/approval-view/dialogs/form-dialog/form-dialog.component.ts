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
import { TranslateModule } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairDS, RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS } from 'app/data-sources/tariff-cleaning';
import { TariffRepairDS } from 'app/data-sources/tariff-repair';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';


export interface DialogData {
  action?: string;
  item?: RepairPartItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
  customer_company_guid?: string;
}

@Component({
  selector: 'app-steam-approval-view-form-dialog',
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
  customer_company_guid: string;

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
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

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
    } else {
      this.dialogTitle = `${data.translatedLangText.NEW} ${data.translatedLangText.ESTIMATE_DETAILS}`;
    }
    this.repairPart = data.item ? data.item : new RepairPartItem();
    this.index = data.index;
    this.partNameControl = new UntypedFormControl('', [Validators.required]);
    this.repairPartForm = this.createForm();
    this.initializeValueChange();
    this.patchForm();
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
      comment: [{ value: this.repairPart.comment, disabled: !this.canEdit() }],
      remarks: [{ value: this.repairPart.remarks, disabled: !this.canEdit() }],
      quantity: [{ value: this.repairPart.quantity, disabled: !this.canEdit() }],
      hour: [{ value: this.repairPart.hour, disabled: !this.canEdit() }],
      group_name_cv: [{ value: this.repairPart.tariff_repair?.group_name_cv, disabled: !this.canEdit() }],
      subgroup_name_cv: [{ value: this.repairPart.tariff_repair?.subgroup_name_cv, disabled: !this.canEdit() }],
      dimension: [''],
      length: [''],
      damage: [''],
      repair: [''],
      material_cost: [{ value: '' }]
    });
  }

  patchForm() {
    const selectedCodeValue = this.data.populateData.groupNameCvList.find(
      (item: any) => item.code_val === this.repairPart.tariff_repair?.group_name_cv
    );
    this.repairPartForm.patchValue({
      guid: this.repairPart.guid,
      tariff_repair_guid: this.repairPart.tariff_repair_guid,
      repair_est_guid: this.repairPart.repair_est_guid,
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
      damage: this.REPDamageRepairToCV(this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 0)),
      repair: this.REPDamageRepairToCV(this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 1)),
      material_cost: this.repairPart.material_cost
    });
  }

  submit() {
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
        comment: this.repairPartForm.get('comment')?.value,
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
      rep.description = `${this.getLocationDescription(rep.location_cv)} (${rep.comment}) - ${rep.tariff_repair?.part_name} ${concludeLength} ${rep.remarks ?? ''}`.trim();
      console.log(rep)
      const returnDialog: DialogData = {
        item: rep,
        index: this.index
      }
      this.dialogRef.close(returnDialog);
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

  initializeValueChange() {
    this.repairPartForm?.get('group_name_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        console.log(value)
        if (value) {
          if (value.child_code) {
            const subgroupName = this.repairPartForm?.get('subgroup_name_cv');
            this.subgroupNameCvList = this.data.populateData.subgroupNameCvList.filter((sgcv: CodeValuesItem) => sgcv.code_val_type === value.child_code)
            this.subgroupNameCvList = addDefaultSelectOption(this.subgroupNameCvList, '-', '');
          } else {
            this.trDS.searchDistinctPartName(value.code_val, '').subscribe(data => {
              this.partNameList = data;
            });
          }
        } else {
          this.subgroupNameCvList = addDefaultSelectOption(this.subgroupNameCvList, '-', '')
        }
      })
    ).subscribe();

    this.repairPartForm?.get('subgroup_name_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        const groupName = this.repairPartForm?.get('group_name_cv')?.value;
        if (groupName) {
          console.log(`${groupName.code_val}, ${value}`)
          const partName = this.repairPartForm?.get('part_name');
          this.trDS.searchDistinctPartName(groupName.code_val, value === '' ? null : value).subscribe(data => {
            this.partNameList = data;
          });
        }
      })
    ).subscribe();

    // this.repairPartForm?.get('part_name')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     if (value) {
    //       //this.searchPart();
    //     }
    //   })
    // ).subscribe();

    // this.partNameControl.valueChanges.subscribe(value => {
    //   if (!this.valueChangesDisabled) {
    //     this.handleValueChange(value);
    //   }
    // });

    // this.repairPartForm?.get('dimension')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     if (value) {
    //       const partName = this.partNameControl.value;
    //       this.trDS.searchDistinctLength(partName, value).subscribe(data => {
    //         this.lengthList = data;
    //         if (!this.lengthList.length) {
    //           this.repairPartForm?.get('length')?.disable();
    //           this.getCustomerCost(partName, value, undefined);
    //         } else {
    //           this.repairPartForm?.get('length')?.enable();
    //         }
    //       });
    //     }
    //   })
    // ).subscribe();

    // this.repairPartForm?.get('length')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     if (value) {
    //       const partName = this.partNameControl.value;
    //       const dimension = this.repairPartForm?.get('dimension')?.value;
    //       this.getCustomerCost(partName, dimension, value);
    //     }
    //   })
    // ).subscribe();
  }

  initializePartNameValueChange() {
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

  REPDamage(damages: string[]): RPDamageRepairItem[] {
    const existingDamage = this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 0);

    const finalDamages: RPDamageRepairItem[] = [];

    existingDamage?.forEach((x: any) => {
      if (damages.includes(x.code_cv)) {
        x.action = (x.action === '' || x.action === 'new') ? 'new' : 'edit';
      } else {
        x.action = 'cancel';
      }

      finalDamages.push(x);
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
      if (repairs.includes(x.code_cv)) {
        x.action = (x.action === '' || x.action === 'new') ? 'new' : 'edit';
      } else {
        x.action = 'cancel';
      }

      finalRepairs.push(x);
    });

    repairs.forEach(dmg => {
      const found = existingRepair?.some((x: any) => x.code_cv === dmg);
      if (!found) {
        const newDamage = this.repDrDS.createREPRepair(undefined, undefined, dmg);
        finalRepairs.push(newDamage);
      }
    });

    return finalRepairs;
    // return repairs.map(rp => this.repDrDS.createREPRepair(undefined, undefined, rp));
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

  // getCustomerCost(partName: string | undefined, dimension: string | undefined, length: number | undefined) {
  //   const group_name_cv = this.repairPartForm.get('group_name_cv')?.value
  //   const subgroup_name_cv = this.repairPartForm.get('subgroup_name_cv')?.value
  //   const where = {
  //     and: [
  //       { customer_company_guid: { eq: this.customer_company_guid } },
  //       {
  //         or: [
  //           { tariff_repair_guid: { eq: null } },
  //           {
  //             tariff_repair: {
  //               group_name_cv: { eq: group_name_cv.code_val },
  //               subgroup_name_cv: { eq: subgroup_name_cv },
  //               part_name: { eq: partName },
  //               dimension: { eq: dimension },
  //               length: { eq: length }
  //             }
  //           }
  //         ]
  //       }
  //     ]
  //   }
  //   this.prDS.getCustomerPackageCost(where).subscribe(data => {
  //     if (data.length) {
  //       // this.selectedPackageRepair = data[0];
  //       // this.repairPartForm.get('material_cost')?.setValue(this.selectedPackageRepair?.material_cost!.toFixed(2));
  //     }
  //   });
  // }
}
