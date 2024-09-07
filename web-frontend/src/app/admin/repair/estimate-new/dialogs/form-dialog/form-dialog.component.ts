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


export interface DialogData {
  action?: string;
  item?: StoringOrderTankItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
  sotExistedList?: StoringOrderTankItem[]
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
  repairPartForm: UntypedFormGroup;
  repairPart: any;
  sotExistedList?: StoringOrderTankItem[];
  partNameList?: string[];
  partNameFilteredList?: string[];
  startDateETA = new Date();
  startDateETR = new Date();
  valueChangesDisabled: boolean = false;

  isPreOrder = false;

  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  trDS: TariffRepairDS;
  partNameControl: UntypedFormControl;
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
    this.action = data.action!;
    this.sotExistedList = data.sotExistedList;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit ' + data.item?.tank_no;
      this.repairPart = data.item;
    } else {
      this.dialogTitle = 'New Record';
      this.repairPart = data.item ? data.item : new StoringOrderTankItem();
    }
    this.index = data.index;
    this.partNameControl = new UntypedFormControl('', [Validators.required]);
    this.repairPartForm = this.createForm();
    this.initializeValueChange();

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
      description: [{ value: this.repairPart.description, disabled: !this.canEdit() }, [Validators.required]],
      location_cv: [{ value: this.repairPart.location_cv, disabled: !this.canEdit() }, [Validators.required]],
      remarks: [{ value: this.repairPart.remarks, disabled: !this.canEdit() }, [Validators.required]],
      qty: [{ value: this.repairPart.qty, disabled: !this.canEdit() }, [Validators.required]],
      hour: [{ value: this.repairPart.hour, disabled: !this.canEdit() }],
      group_name_cv: [{ value: this.repairPart.group_name, disabled: !this.canEdit() }],
      subgroup_name_cv: [{ value: this.repairPart.subgroup_name, disabled: !this.canEdit() }],
      dimension: [''],
      length: [''],
      damage: [''],
      repair: [''],
      prefix_desc: [''],
      additional_dim: [''],
      mat_cost: [''],
      iq: ['']
    });
  }

  submit() {
    if (this.repairPartForm?.valid) {
      if (!this.validatePurpose()) {
        this.repairPartForm.get('purpose')?.setErrors({ required: true });
      } else {
        this.repairPartForm.get('purpose')?.setErrors(null);
        // let actions = Array.isArray(this.storingOrderTank.actions!) ? [...this.storingOrderTank.actions!] : [];
        // if (this.isPreOrder) {
        //   if (!actions.includes('preorder')) {
        //     actions = [...new Set([...actions, 'preorder'])];
        //   }
        // } else {
        //   // remove preorder action
        //   actions = actions.filter(action => action !== 'preorder');
        //   if (this.action === 'new') {
        //     if (!actions.includes('new')) {
        //       actions = [...new Set([...actions, 'new'])];
        //     }
        //   } else {
        //     if (!actions.includes('new')) {
        //       actions = [...new Set([...actions, 'edit'])];
        //     }
        //   }
        // }
        // var sot: StoringOrderTankItem = {
        //   ...this.storingOrderTank,
        //   unit_type_guid: this.repairPartForm.value['unit_type_guid'],
        //   tank_no: Utility.formatContainerNumber(this.repairPartForm.value['tank_no']),
        //   last_cargo_guid: this.repairPartForm.value['last_cargo_guid'],
        //   tariff_cleaning: this.lastCargoControl.value,
        //   job_no: this.repairPartForm.value['job_no'],
        //   eta_dt: Utility.convertDate(this.repairPartForm.value['eta_dt']),
        //   purpose_storage: this.repairPartForm.value['purpose_storage'],
        //   purpose_steam: this.repairPartForm.value['purpose_steam'],
        //   purpose_cleaning: this.repairPartForm.value['purpose_cleaning'],
        //   purpose_repair_cv: this.repairPartForm.value['purpose_repair_cv'],
        //   clean_status_cv: this.repairPartForm.value['clean_status_cv'],
        //   certificate_cv: this.repairPartForm.value['certificate_cv'],
        //   required_temp: this.repairPartForm.value['required_temp'],
        //   etr_dt: Utility.convertDate(this.repairPartForm.value['etr_dt']),
        //   remarks: this.repairPartForm.value['remarks'],
        //   actions
        // }
        const returnDialog: DialogData = {
          //item: sot,
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
            this.partNameControl.reset('');
            this.partNameList = data;
            this.partNameFilteredList = data
            this.updateValidators(this.partNameList);
          });
        }
      })
    ).subscribe();

    this.partNameControl.valueChanges.subscribe(value => {
      if (!this.valueChangesDisabled) {
        this.handleValueChange(value);
      }
    });
  }

  handleValueChange(value: any) {
    this.valueChangesDisabled = true;
    if (value) {
      this.partNameFilteredList = this.partNameList?.filter(item =>
        item.toLowerCase().includes(value.toLowerCase()) // case-insensitive filtering
      );
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

  displayPartNameFn(tr: string): string {
    return tr;
  }

  validatePurpose(): boolean {
    let isValid = true;
    const purposeStorage = this.repairPartForm.get('purpose_storage')?.value;
    const purposeSteam = this.repairPartForm.get('purpose_steam')?.value;
    const purposeCleaning = this.repairPartForm.get('purpose_cleaning')?.value;
    const purposeRepairCV = this.repairPartForm.get('purpose_repair_cv')?.value;
    const requiredTemp = this.repairPartForm.get('required_temp')?.value;

    // Validate that at least one of the purpose checkboxes is checked
    if (!purposeStorage && !purposeSteam && !purposeCleaning && !purposeRepairCV) {
      isValid = false; // At least one purpose must be selected
      this.repairPartForm.get('purpose')?.setErrors({ required: true });
    }

    // Validate that required_temp is filled in if purpose_steam is checked
    if (purposeSteam && !requiredTemp) {
      isValid = false; // required_temp must be filled if purpose_steam is checked
      this.repairPartForm.get('required_temp')?.setErrors({ required: true });
    }

    return isValid;
  }

  canEdit(): boolean {
    return !this.sotDS.canRollbackStatus(this.repairPart) && !this.repairPart.actions!.includes('cancel') && !this.repairPart.actions!.includes('rollback');
  }

  updateValidators(validOptions: any[]) {
    this.partNameControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }
}
