import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialog } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Apollo } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { startWith, debounceTime, tap, Subject } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { TariffRepairDS, TariffRepairItem } from 'app/data-sources/tariff-repair';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairDS, RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { Direction } from '@angular/cdk/bidi';
import { SearchFormDialogComponent } from '../search-form-dialog/search-form-dialog.component';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ComponentUtil } from 'app/utilities/component-util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';


export interface DialogData {
  action?: string;
  item?: RepairPartItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
  customer_company_guid?: string;
  existedPart?: RepairPartItem[]
}

@Component({
  selector: 'app-residue-approval-estimate-form-dialog',
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
    MatDialogClose,
    DatePipe,
    MatNativeDateModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CommonModule,
    NgxMaskDirective,
    MatProgressSpinnerModule,
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
  partNameControl: UntypedFormControl;
  partNameList?: string[];
  partNameFilteredList?: string[];
  dimensionList?: string[];
  lengthList?: any[];
  valueChangesDisabled: boolean = false;
  subgroupNameCvList?: CodeValuesItem[];
  existedPart?: RepairPartItem[];

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
    private snackBar: MatSnackBar
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
      dimension: [{ value: this.repairPart.tariff_repair?.dimension, disabled: !this.canEdit() }],
      length: [{ value: this.repairPart.tariff_repair?.length, disabled: !this.canEdit() }],
      damage: [{ value: this.REPDamageRepairToCV(this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 0 && x.action !== 'cancel' && !x.delete_dt)), disabled: !this.canEdit() }],
      repair: [{ value: this.REPDamageRepairToCV(this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 1 && x.action !== 'cancel' && !x.delete_dt)), disabled: !this.canEdit() }],
      material_cost: [{ value: this.repairPart.material_cost }]
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
      damage: this.REPDamageRepairToCV(this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 0 && x.action !== 'cancel' && !x.delete_dt)),
      repair: this.REPDamageRepairToCV(this.repairPart.rp_damage_repair?.filter((x: any) => x.code_type === 1 && x.action !== 'cancel' && !x.delete_dt)),
      material_cost: this.repairPart.material_cost
    });
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
        console.log(value)
        const subgroupName = this.repairPartForm?.get('subgroup_name_cv');
        if (value) {
          this.subgroupNameCvList = this.data.populateData.subgroupNameCvList.filter((sgcv: CodeValuesItem) => sgcv.code_val_type === value.child_code)
          if (value.child_code) {
            subgroupName?.enable();
            if ((this.subgroupNameCvList?.length ?? 0) > 1) {
              this.subgroupNameCvList = addDefaultSelectOption(this.subgroupNameCvList, 'All', '');
            } else {
              subgroupName?.disable();
            }
          } else {
            subgroupName?.setValue('');
            subgroupName?.disable();
            const partName = this.repairPartForm?.get('part_name');
            // this.trDS.searchDistinctPartName(value.code_val, '').subscribe(data => {
            //   this.partNameList = data;
            //   // if (this.partNameList.length) {
            //   //   partName?.enable()
            //   // } else {
            //   //   partName?.disable()
            //   // }
            // });
          }
        } else {
          subgroupName?.disable();
          // this.subgroupNameCvList = addDefaultSelectOption(this.subgroupNameCvList, '-', '')
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
          this.trDS.searchDistinctPartName(groupName.code_val, value || '').subscribe(data => {
            this.partNameList = data;
            // if (this.partNameList.length) {
            //   partName?.enable()
            // } else {
            //   partName?.disable()
            // }
          });
        }
      })
    ).subscribe();

    this.repairPartForm?.get('repair')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        console.log(`${value}`)
        if (value.includes('4X')) {
          this.SetRepair4X(false);
        } else {
          this.SetRepair4X(true);
          this.repairPartForm.get('material_cost')?.setValue(this.repairPart?.material_cost!.toFixed(2) ?? 0.00);
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
      quantity?.setValue(1);
      quantity?.disable();
      hour?.setValue(0);
      hour?.disable();
      material_cost?.setValue(0);
      material_cost?.disable();
    } else {
      quantity?.enable();
      hour?.enable();
      material_cost?.enable();
    }
  }

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
        this.repairPart = result.selected_repair_est_part;
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
