import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
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
import { startWith, debounceTime, tap } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { TariffRepairDS, TariffRepairItem } from 'app/data-sources/tariff-repair';
import { CodeValuesDS } from 'app/data-sources/code-values';
import { RepairEstPartItem } from 'app/data-sources/repair-est-part';
import { REPDamageRepairDS, REPDamageRepairItem } from 'app/data-sources/rep-damage-repair';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';


export interface DialogData {
  action?: string;
  item?: RepairEstPartItem;
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
    MatDialogClose,
    DatePipe,
    MatNativeDateModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CommonModule,
    NgxMaskDirective,
  ],
})
export class FormDialogComponent {
  action: string;
  index: number;
  dialogTitle: string;
  customer_company_guid: string;

  repairPartForm: UntypedFormGroup;
  repairPart: RepairEstPartItem;
  //selectedPackageRepair?: PackageRepairItem;
  selectedTariffRepair?:TariffRepairItem;
  partNameControl: UntypedFormControl;
  partNameList?: string[];
  partNameFilteredList?: string[];
  dimensionList?: string[];
  lengthList?: any[];
  valueChangesDisabled: boolean = false;

  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  trDS: TariffRepairDS;
  repDrDS: REPDamageRepairDS;
  prDS: PackageRepairDS;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    // Set the defaults
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.trDS = new TariffRepairDS(this.apollo);
    this.repDrDS = new REPDamageRepairDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.action = data.action!;
    this.customer_company_guid = data.customer_company_guid!;
    if (this.action === 'edit') {
      this.dialogTitle = `${data.translatedLangText.EDIT} ${data.translatedLangText.ESTIMATE_DETAILS}`;
      console.log(data.item)
    } else {
      this.dialogTitle = `${data.translatedLangText.NEW} ${data.translatedLangText.ESTIMATE_DETAILS}`;
    }
    this.repairPart = data.item ? data.item : new RepairEstPartItem();
    this.index = data.index;
    this.partNameControl = new UntypedFormControl('', [Validators.required]);
    this.repairPartForm = this.createForm();
    this.initializeValueChange();
    this.patchForm();
    // if (this.repairPart.tariff_cleaning) {
    //   this.lastCargoControl.setValue(this.storingOrderTank.tariff_cleaning);
    // }
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      guid: [this.repairPart.guid],
      tariff_repair_guid: [this.repairPart.tariff_repair_guid],
      part_name: this.partNameControl,
      repair_est_guid: [this.repairPart.repair_est_guid],
      description: [{ value: this.repairPart.description, disabled: !this.canEdit() }],
      location_cv: [{ value: this.repairPart.location_cv, disabled: !this.canEdit() }],
      remarks: [{ value: this.repairPart.remarks, disabled: !this.canEdit() }],
      qty: [{ value: this.repairPart.qty, disabled: !this.canEdit() }],
      hour: [{ value: this.repairPart.hour, disabled: !this.canEdit() }],
      group_name_cv: [{ value: this.repairPart.tariff_repair?.group_name_cv, disabled: !this.canEdit() }],
      subgroup_name_cv: [{ value: this.repairPart.tariff_repair?.subgroup_name_cv, disabled: !this.canEdit() }],
      dimension: [''],
      length: [''],
      damage: [''],
      repair: [''],
      material_cost: [{ value: '', disabled: true }],
      iq: ['']
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
      remarks: this.repairPart.remarks,
      qty: this.repairPart.qty,
      hour: this.repairPart.hour,
      group_name_cv: selectedCodeValue,
      subgroup_name_cv: this.repairPart.tariff_repair?.subgroup_name_cv,
      part_name: this.repairPart.tariff_repair?.part_name,
      dimension: this.repairPart.tariff_repair?.dimension,
      length: this.repairPart.tariff_repair?.length,
      damage: this.REPDamageRepairToCV(this.repairPart.damage),
      repair: this.REPDamageRepairToCV(this.repairPart.repair),
      material_cost: this.repairPart.tariff_repair?.material_cost
    });
  }

  submit() {
    if (this.repairPartForm?.valid) {
      if (!this.validateLength()) {
        this.repairPartForm.get('remarks')?.setErrors({ required: true });
      } else {
        this.repairPartForm.get('remarks')?.setErrors(null);
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
        var rep: RepairEstPartItem = {
          ...this.repairPart,
          location_cv: this.repairPartForm.get('location_cv')?.value,
          tariff_repair_guid: this.selectedTariffRepair?.guid,
          tariff_repair: this.selectedTariffRepair,
          damage: this.REPDamage(this.repairPartForm.get('damage')?.value),
          repair: this.REPRepair(this.repairPartForm.get('repair')?.value),
          qty: this.repairPartForm.get('qty')?.value,
          hour: this.repairPartForm.get('hour')?.value,
          material_cost: this.repairPartForm.get('material_cost')?.value,
          remarks: this.repairPartForm.get('remarks')?.value,
          actions
        }
        rep.description = `${rep.tariff_repair?.part_name} ${this.getLocationDescription(rep.location_cv)} ${rep.remarks ?? ''}`.trim();
        console.log(rep)
        const returnDialog: DialogData = {
          item: rep,
          index: this.index
        }
        this.dialogRef.close(returnDialog);
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

  initializeValueChange() {
    this.repairPartForm?.get('group_name_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value?.child_code) {
          const queries = [
            { alias: 'subgroupNameCv', codeValType: value.child_code },
          ];
          this.cvDS.getCodeValuesByType(queries);
          this.cvDS.connectAlias('subgroupNameCv').subscribe(data => {
            this.data.populateData.subgroupNameCvList = data;
          });
        }
      })
    ).subscribe();

    this.repairPartForm?.get('subgroup_name_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          const groupName = this.repairPartForm?.get('group_name_cv')?.value;
          this.trDS.searchDistinctPartName(groupName.code_val, value).subscribe(data => {
            //this.partNameControl.setValue('');
            this.repairPartForm?.patchValue({
              part_name: '',
              dimension:'',
              length: '',
            });
            this.dimensionList=[];
            this.lengthList=[];
            this.partNameList = data;
            this.partNameFilteredList = data
            // this.repairPartForm?.get('dimension')?.clearValidators();
            // this.repairPartForm?.get('dimension')?.updateValueAndValidity();
            // this.repairPartForm?.get('length')?.clearValidators();
            // this.repairPartForm?.get('length')?.updateValueAndValidity();
            this.updateValidators(this.partNameList);
            if (this.partNameControl.value) {
              this.handleValueChange(this.partNameControl.value)
            }
          });
        }
      })
    ).subscribe();

    this.partNameControl.valueChanges.subscribe(value => {
      if (!this.valueChangesDisabled ) {
        this.handleValueChange(value);
      }
    });

    this.repairPartForm?.get('dimension')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          const partName = this.partNameControl.value;
          this.trDS.searchDistinctLength(partName, value).subscribe(data => {
            this.lengthList = data;
            if (!this.lengthList.length) {
              this.repairPartForm?.get('length')?.disable();
              
              this.getTariffRepairCost(partName, value, undefined);
            } else {
              this.repairPartForm?.get('length')?.enable();
            }
          });
        }
      })
    ).subscribe();

    this.repairPartForm?.get('length')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          const partName = this.partNameControl.value;
          const dimension = this.repairPartForm?.get('dimension')?.value;
          this.getTariffRepairCost(partName, dimension, value);
        }
      })
    ).subscribe();
  }

  handleValueChange(value: any) {
    this.valueChangesDisabled = true;
    if (value) {
      
      this.partNameFilteredList = this.partNameList?.filter(item =>
        
        
         item.trim().length > 0 && item.toLowerCase().includes(value.toLowerCase()) // case-insensitive filtering
        
      );
      const isValid = this.partNameList?.some(item => item === value);
      if (isValid) {
        // Only search if the value exists in the partNameList
        this.trDS.searchDistinctDimension(value).subscribe(data => {
          this.dimensionList = data;
          if (!this.dimensionList.length) {
            this.repairPartForm?.get('dimension')?.disable();
            this.repairPartForm?.get('dimension')?.clearValidators();
            this.repairPartForm?.get('dimension')?.updateValueAndValidity();
            this.getTariffRepairCost(value, undefined, undefined);
          } else {
            this.repairPartForm?.get('dimension')?.enable();
            this.repairPartForm?.get('dimension')?.setValidators([Validators.required]);
            this.repairPartForm?.get('dimension')?.updateValueAndValidity();
          }
        });
      }
    } else {
      // If no value is entered, reset the filtered list to the full list
      this.partNameFilteredList = this.partNameList;
    }
    this.valueChangesDisabled = false;
  }

  findInvalidControls() {
    const controls = this.repairPartForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  REPDamage(damages: any[]): REPDamageRepairItem[] {
    return damages.map(dmg => this.repDrDS.createREPDamage(undefined, undefined, dmg));
  }

  REPRepair(repairs: any[]): REPDamageRepairItem[] {
    return repairs.map(rp => this.repDrDS.createREPRepair(undefined, undefined, rp));
  }

  REPDamageRepairToCV(damagesRepair: any[]): REPDamageRepairItem[] {
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

  updateValidators(validOptions: any[]) {
    this.partNameControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  getLocationDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData?.partLocationCvList);
  }

  getTariffRepairCost(partName: string | undefined, dimension: string | undefined, length: number | undefined) {

    const group_name_cv = this.repairPartForm.get('group_name_cv')?.value
    const subgroup_name_cv = this.repairPartForm.get('subgroup_name_cv')?.value
    const where = {
      group_name_cv: { eq: group_name_cv.code_val },
      subgroup_name_cv: { eq: subgroup_name_cv },
      part_name: { eq: partName },
      dimension: { eq: dimension },
      length: { eq: length }
    }
    this.trDS.SearchTariffRepair(where).subscribe(data => {
      if (data.length) {
        this.selectedTariffRepair = data[0];
        this.repairPartForm.get('material_cost')?.setValue(this.selectedTariffRepair?.material_cost!.toFixed(2));
      }
    });
  }
  trackByFn(index: number, item: string): any {
    return item;
  }

  calculateCostSummary()
  {
    
  }
  // getCustomerCost(partName: string | undefined, dimension: string | undefined, length: number | undefined) {
  //   // this.trDS.searchTariffRepairByPartNameDimLength(partName, dimension, length).subscribe(data => {
  //   //   if (data.length) {
  //   //     this.selectedTariffRepair = data[0];
  //   //   }
  //   // });
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
  //       this.selectedPackageRepair = data[0];
  //       this.repairPartForm.get('material_cost')?.setValue(this.selectedTariffRepair?.material_cost!.toFixed(2));
  //     }
  //   });
  // }
}
