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


export interface DialogData {
  action?: string;
  item: StoringOrderTankItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
  sotExistedList?: StoringOrderTankItem[]
}

@Component({
  selector: 'app-form-dialog',
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
  storingOrderTankForm: UntypedFormGroup;
  storingOrderTank: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDateETA = new Date();
  startDateETR = new Date();
  valueChangesDisabled: boolean = false;

  isPreOrder = false;

  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
  lastCargoControl: UntypedFormControl;;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    // Set the defaults

    this.tcDS = new TariffCleaningDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.action = data.action!;
    this.sotExistedList = data.sotExistedList;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit ' + data.item.tank_no;
      this.storingOrderTank = data.item;
    } else {
      this.dialogTitle = 'New Record';
      this.storingOrderTank = data.item ? data.item : new StoringOrderTankItem();
    }
    this.index = data.index;
    this.lastCargoControl = new UntypedFormControl('', [Validators.required]);
    this.storingOrderTankForm = this.createStorigOrderTankForm();
    this.initializeValueChange();

    if (this.storingOrderTank.tariff_cleaning) {
      this.lastCargoControl.setValue(this.storingOrderTank.tariff_cleaning);
    }
  }

  createStorigOrderTankForm(): UntypedFormGroup {
    if (!this.canEdit()) {
      this.lastCargoControl.disable();
    } else {
      this.lastCargoControl.enable();
    }
    this.startDateETA = this.storingOrderTank.eta_dt ? (Utility.convertDate(this.storingOrderTank.eta_dt) as Date) : this.startDateETA;
    this.startDateETR = this.storingOrderTank.etr_dt ? (Utility.convertDate(this.storingOrderTank.etr_dt) as Date) : this.startDateETR;
    return this.fb.group({
      guid: [this.storingOrderTank.guid],
      so_guid: [this.storingOrderTank.so_guid],
      unit_type_guid: [{ value: this.storingOrderTank.unit_type_guid, disabled: !this.canEdit() }, [Validators.required]],
      tank_no: [{ value: this.storingOrderTank.tank_no, disabled: !this.canEdit() }, [Validators.required]],
      last_cargo: this.lastCargoControl,
      last_cargo_guid: [{ value: this.storingOrderTank.last_cargo_guid, disabled: !this.canEdit() }, [Validators.required]],
      job_no: [{ value: this.storingOrderTank.job_no, disabled: !this.canEdit() }, [Validators.required]],
      eta_dt: [{ value: Utility.convertDate(this.storingOrderTank.eta_dt), disabled: !this.canEdit() }],
      purpose: [''],
      purpose_storage: [{ value: this.storingOrderTank.purpose_storage, disabled: !this.canEdit() }],
      purpose_steam: [{ value: this.storingOrderTank.purpose_steam, disabled: !this.canEdit() }],
      purpose_cleaning: [{ value: this.storingOrderTank.purpose_cleaning, disabled: !this.canEdit() }],
      purpose_repair_cv: [{ value: this.storingOrderTank.purpose_repair_cv, disabled: !this.canEdit() }],
      clean_status_cv: [{ value: this.storingOrderTank.clean_status_cv, disabled: !this.canEdit() }],
      certificate_cv: [{ value: this.storingOrderTank.certificate_cv, disabled: !this.canEdit() }],
      required_temp: [{ value: this.storingOrderTank.required_temp, disabled: !this.storingOrderTank.purpose_steam || !this.canEdit() }, [Validators.min(0)]],
      etr_dt: [{ value: Utility.convertDate(this.storingOrderTank.etr_dt), disabled: !this.canEdit() }],
      remarks: [{ value: this.storingOrderTank?.remarks, disabled: !this.canEdit() }],
      open_on_gate: [{ value: this.storingOrderTank.tariff_cleaning?.open_on_gate_cv, disabled: true }],
      flash_point: [this.storingOrderTank.tariff_cleaning?.flash_point]
    });
  }

  submit() {
    this.storingOrderTankForm.get('purpose')?.setErrors(null);
    this.storingOrderTankForm.get('required_temp')?.setErrors(null);
    if (this.storingOrderTankForm?.valid) {
      if (!this.validatePurpose()) {
        this.storingOrderTankForm.get('purpose')?.setErrors({ required: true });
      } else {
        this.storingOrderTankForm.get('purpose')?.setErrors(null);
        let actions = Array.isArray(this.storingOrderTank.actions!) ? [...this.storingOrderTank.actions!] : [];
        if (this.action === 'new') {
          if (this.isPreOrder) {
            actions = [...new Set([...actions, 'preorder'])];
          } else {
            actions = [...new Set([...actions, 'new'])];
          }
        } else {
          if (this.isPreOrder) {
            actions = [...new Set([...actions, 'preorder'])];
          } else {
            actions = [...new Set([...actions, 'edit'])];
          }
        }
        var sot: StoringOrderTankItem = {
          ...this.storingOrderTank,
          unit_type_guid: this.storingOrderTankForm.value['unit_type_guid'],
          tank_no: Utility.formatContainerNumber(this.storingOrderTankForm.value['tank_no']),
          last_cargo_guid: this.storingOrderTankForm.value['last_cargo_guid'],
          tariff_cleaning: this.lastCargoControl.value,
          job_no: this.storingOrderTankForm.value['job_no'],
          eta_dt: Utility.convertDate(this.storingOrderTankForm.value['eta_dt']),
          purpose_storage: this.storingOrderTankForm.value['purpose_storage'],
          purpose_steam: this.storingOrderTankForm.value['purpose_steam'],
          purpose_cleaning: this.storingOrderTankForm.value['purpose_cleaning'],
          purpose_repair_cv: this.storingOrderTankForm.value['purpose_repair_cv'],
          clean_status_cv: this.storingOrderTankForm.value['clean_status_cv'],
          certificate_cv: this.storingOrderTankForm.value['certificate_cv'],
          required_temp: this.storingOrderTankForm.value['required_temp'],
          etr_dt: Utility.convertDate(this.storingOrderTankForm.value['etr_dt']),
          remarks: this.storingOrderTankForm.value['remarks'],
          actions
        }
        const returnDialog: DialogData = {
          item: sot,
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
    this.storingOrderTankForm?.get('purpose_steam')!.valueChanges.subscribe(value => {
      const requiredTempControl = this.storingOrderTankForm.get('required_temp');
      if (value) {
        requiredTempControl!.enable();
      } else {
        requiredTempControl!.disable();
        requiredTempControl!.setValue(''); // Clear the value if disabled
      }
    });

    this.storingOrderTankForm?.get('tank_no')?.valueChanges.subscribe(value => {
      this.isPreOrder = false; // Reset PREORDER flag
    
      if (value) {
        const uppercaseValue = value.toUpperCase();
        this.storingOrderTankForm.get('tank_no')?.setValue(uppercaseValue, { emitEvent: false });
    
        const isValid = Utility.verifyIsoContainerCheckDigit(uppercaseValue);
        if (!isValid) {
          this.storingOrderTankForm.get('tank_no')?.setErrors({ invalidCheckDigit: true });
        } else {
          const formattedTankNo = Utility.formatContainerNumber(uppercaseValue);
    
          // Handle new entry or edit
          if (this.action !== 'edit' || (this.action === 'edit' && formattedTankNo !== this.storingOrderTank.tank_no)) {
            const foundInExistedList = this.sotExistedList?.filter(sot => sot.tank_no === formattedTankNo);
            if (foundInExistedList?.length) {
              this.storingOrderTankForm.get('tank_no')?.setErrors({ existed: true });
            } else {
              this.storingOrderTankForm.get('tank_no')?.setErrors(null);
    
              this.sotDS.isTankNoAvailableToAdd(formattedTankNo).subscribe(data => {
                if (data.length > 0) {
                  const hasWaiting = data.some(item => item.status_cv === 'WAITING');
                  if (hasWaiting) {
                    const hasPreOrder = data.some(item => item.status_cv === 'PREORDER');
                    if (hasPreOrder) {
                      this.storingOrderTankForm.get('tank_no')?.setErrors({ existed: true });
                    } else {
                      // Set PREORDER warning without blocking submission
                      this.isPreOrder = true;
                    }
                  } else {
                    // Additional logic if needed when no WAITING status is found
                  }
                }
              });
            }
          } else {
            this.storingOrderTankForm.get('tank_no')?.setErrors(null);
          }
        }
      }
    });

    this.storingOrderTankForm?.get('last_cargo')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.cargo;
          this.storingOrderTankForm!.get('last_cargo_guid')!.setValue(value.guid);
        }
        this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
          this.last_cargoList = data
          this.updateValidators(this.last_cargoList);
        });
      })
    ).subscribe();

    this.lastCargoControl.valueChanges.subscribe(value => {
      if (!this.valueChangesDisabled) {
        this.handleValueChange(value);
      }
    });
  }

  handleValueChange(value: any) {
    this.valueChangesDisabled = true;
    if (value && value.guid) {
      this.storingOrderTankForm.get('flash_point')!.setValue(value.flash_point);
      this.storingOrderTankForm.get('open_on_gate')!.setValue(value.open_on_gate_cv);

      const requiredTempControl = this.storingOrderTankForm.get('required_temp');
      const purposeSteamControl = this.storingOrderTankForm.get('purpose_steam');
      if (value.flash_point <= 0) {
        requiredTempControl!.reset();
        purposeSteamControl!.reset();
        purposeSteamControl!.disable();
        requiredTempControl!.disable();
      } else {
        purposeSteamControl!.enable();
        requiredTempControl!.enable();
        requiredTempControl!.setValidators([
          Validators.max(value.flash_point - 1),
          Validators.min(0)
        ]);
      }

      const isBooleanConditionMet = purposeSteamControl!.value
      if (isBooleanConditionMet) {
        requiredTempControl!.enable();
      } else {
        requiredTempControl!.disable();
        requiredTempControl!.setValue(''); // Clear the value if disabled
      }

      requiredTempControl!.updateValueAndValidity();
    } else {
      this.storingOrderTankForm.get('flash_point')!.reset();
      this.storingOrderTankForm.get('open_on_gate')!.reset();
    }
    this.lastCargoControl.updateValueAndValidity();
    this.valueChangesDisabled = false;
  }

  findInvalidControls() {
    const controls = this.storingOrderTankForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  validatePurpose(): boolean {
    let isValid = true;
    const purposeStorage = this.storingOrderTankForm.get('purpose_storage')?.value;
    const purposeSteam = this.storingOrderTankForm.get('purpose_steam')?.value;
    const purposeCleaning = this.storingOrderTankForm.get('purpose_cleaning')?.value;
    const purposeRepairCV = this.storingOrderTankForm.get('purpose_repair_cv')?.value;
    const requiredTemp = this.storingOrderTankForm.get('required_temp')?.value;

    // Validate that at least one of the purpose checkboxes is checked
    if (!purposeStorage && !purposeSteam && !purposeCleaning && !purposeRepairCV) {
      isValid = false; // At least one purpose must be selected
      this.storingOrderTankForm.get('purpose')?.setErrors({ required: true });
    }

    // Validate that required_temp is filled in if purpose_steam is checked
    if (purposeSteam && !requiredTemp) {
      isValid = false; // required_temp must be filled if purpose_steam is checked
      this.storingOrderTankForm.get('required_temp')?.setErrors({ required: true });
    }

    return isValid;
  }

  canEdit(): boolean {
    return !this.sotDS.canRollbackStatus(this.storingOrderTank) && !this.storingOrderTank.actions!.includes('cancel') && !this.storingOrderTank.actions!.includes('rollback');
  }

  updateValidators(validOptions: any[]) {
    this.lastCargoControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }
}
