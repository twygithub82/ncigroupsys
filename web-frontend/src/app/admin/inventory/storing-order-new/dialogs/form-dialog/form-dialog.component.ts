import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ModulePackageService } from 'app/services/module-package.service';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { debounceTime, merge, startWith, tap } from 'rxjs';

export interface DialogData {
  action?: string;
  item: StoringOrderTankItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
  sotExistedList?: StoringOrderTankItem[]
}

@Component({
  selector: 'app-storing-order-new-form-dialog',
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
    NgxMaskDirective,
    PreventNonNumericDirective
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
  isTankNoValidated = false;

  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
  lastCargoControl: UntypedFormControl;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    public modulePackageService: ModulePackageService
  ) {
    // Set the defaults

    this.tcDS = new TariffCleaningDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.action = data.action!;
    this.sotExistedList = data.sotExistedList;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Record';
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
    this.startDateETA = Utility.getEarlierDate((Utility.convertDate(this.storingOrderTank.eta_dt) as Date), this.startDateETA);
    this.startDateETR = Utility.getEarlierDate((Utility.convertDate(this.storingOrderTank.etr_dt) as Date), this.startDateETR);
    const foundUnitType = this.data.populateData.unit_typeList.filter((item: { guid: string | undefined; }) => item.guid === this.storingOrderTank.unit_type_guid);
    return this.fb.group({
      guid: [this.storingOrderTank.guid],
      so_guid: [this.storingOrderTank.so_guid],
      unit_type_guid: [{ value: foundUnitType?.[0], disabled: !this.canEdit() }, [Validators.required]],
      tank_no: [{ value: this.storingOrderTank.tank_no, disabled: !this.canEdit() }, [Validators.required]],
      last_cargo: this.lastCargoControl,
      last_cargo_guid: [{ value: this.storingOrderTank.last_cargo_guid, disabled: !this.canEdit() }, [Validators.required]],
      job_no: [{ value: this.storingOrderTank.job_no, disabled: !this.canEdit() }, [Validators.required]],
      preinspect_job_no: [this.storingOrderTank.preinspect_job_no || this.storingOrderTank.job_no],
      liftoff_job_no: [this.storingOrderTank.liftoff_job_no || this.storingOrderTank.job_no],
      lifton_job_no: [this.storingOrderTank.lifton_job_no || this.storingOrderTank.job_no],
      release_job_no: [this.storingOrderTank.release_job_no || this.storingOrderTank.job_no],
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
    if (this.storingOrderTankForm?.valid && this.isTankNoValidated) {
      if (!this.validatePurpose() || !this.validateRequireTemp()) {
      } else {
        this.storingOrderTankForm.get('purpose')?.setErrors(null);
        let actions = Array.isArray(this.storingOrderTank.actions!) ? [...this.storingOrderTank.actions!] : [];
        if (this.isPreOrder) {
          if (!actions.includes('preorder')) {
            actions = [...new Set([...actions, 'preorder'])];
          }
        } else {
          // remove preorder action
          actions = actions.filter(action => action !== 'preorder');
          if (this.action === 'new') {
            if (!actions.includes('new')) {
              actions = [...new Set([...actions, 'new'])];
            }
          } else {
            if (!actions.includes('new')) {
              actions = [...new Set([...actions, 'edit'])];
            }
          }
        }
        var sot: StoringOrderTankItem = {
          ...this.storingOrderTank,
          unit_type_guid: this.storingOrderTankForm.get('unit_type_guid')?.value?.guid,
          tank_no: Utility.formatContainerNumber(this.storingOrderTankForm.get('tank_no')?.value),
          last_cargo_guid: this.storingOrderTankForm.get('last_cargo_guid')?.value,
          tariff_cleaning: this.lastCargoControl.value,
          job_no: this.storingOrderTankForm.get('job_no')?.value,
          preinspect_job_no: this.storingOrderTankForm.get('preinspect_job_no')?.value,
          liftoff_job_no: this.storingOrderTankForm.get('liftoff_job_no')?.value,
          lifton_job_no: this.storingOrderTankForm.get('lifton_job_no')?.value,
          release_job_no: this.storingOrderTankForm.get('release_job_no')?.value,
          eta_dt: Utility.convertDate(this.storingOrderTankForm.get('eta_dt')?.value),
          purpose_storage: this.storingOrderTankForm.get('purpose_storage')?.value,
          purpose_steam: this.storingOrderTankForm.get('purpose_steam')?.value,
          purpose_cleaning: this.storingOrderTankForm.get('purpose_cleaning')?.value,
          purpose_repair_cv: this.storingOrderTankForm.get('purpose_repair_cv')?.value,
          clean_status_cv: this.storingOrderTankForm.get('clean_status_cv')?.value,
          certificate_cv: this.storingOrderTankForm.get('certificate_cv')?.value,
          required_temp: this.storingOrderTankForm.get('required_temp')?.value,
          etr_dt: Utility.convertDate(this.storingOrderTankForm.get('etr_dt')?.value),
          remarks: this.storingOrderTankForm.get('remarks')?.value,
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
      if (this.canEdit()) {
        const purposeStorage = this.storingOrderTankForm.get('purpose_storage');
        const requiredTempControl = this.storingOrderTankForm.get('required_temp');
        const purposeCleaning = this.storingOrderTankForm.get('purpose_cleaning');
        const purposeRepair = this.storingOrderTankForm.get('purpose_repair_cv');
        if (value) {
          purposeStorage?.setValue(true);
          purposeStorage?.disable();
          requiredTempControl!.enable();
          purposeCleaning!.disable();
          purposeRepair!.disable();
        } else {
          requiredTempControl!.disable();
          requiredTempControl!.setValue(''); // Clear the value if disabled
          purposeStorage?.enable();
          purposeCleaning!.enable();
          purposeRepair!.enable();
        }
      }
    });

    merge(
      this.storingOrderTankForm?.get('unit_type_guid')!.valueChanges,
      this.storingOrderTankForm?.get('tank_no')!.valueChanges
    ).subscribe(() => {
      const value = this.storingOrderTankForm?.get('tank_no')!.value
      this.isPreOrder = false; // Reset PREORDER flag
      if (value) {
        const uppercaseValue = value.toUpperCase();
        this.storingOrderTankForm.get('tank_no')?.setValue(uppercaseValue, { emitEvent: false });
        const isoFormatCheck = this.storingOrderTankForm?.get('unit_type_guid')?.value?.iso_format;

        const isValid = Utility.verifyIsoContainerCheckDigit(uppercaseValue);
        const result = isoFormatCheck === undefined
          ? isValid
          : isoFormatCheck
            ? isValid
            : true;

        if (!result) {
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

              this.sotDS.isTankNoAvailableToAdd(formattedTankNo).subscribe({
                next: (data) => {
                  if (data.length > 0) {
                    const hasWaiting = data.some(item => item.status_cv === 'WAITING' || item.status_cv === 'ACCEPTED');
                    if (hasWaiting) {
                      const hasPreInYardTank = data.some(item => item.status_cv === 'WAITING' || item.status_cv === 'PREORDER');
                      if (hasPreInYardTank) {
                        this.storingOrderTankForm.get('tank_no')?.setErrors({ existed: true });
                        this.isTankNoValidated = false;
                      } else {
                        // Set PREORDER warning without blocking submission
                        this.isPreOrder = true;
                        this.isTankNoValidated = true;
                      }
                    } else {
                      // Additional logic if needed when no WAITING status is found
                      this.isTankNoValidated = true;
                    }
                  } else {
                    this.isTankNoValidated = true;
                  }
                },
                error: (error) => {
                  this.isTankNoValidated = false;
                }
              });
            }
          } else {
            this.storingOrderTankForm.get('tank_no')?.setErrors(null);
            this.isTankNoValidated = true;
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

    this.onPurposeChangeCheck(null);

    this.storingOrderTankForm.get('eta_dt')?.valueChanges.subscribe((eta) => {
      this.storingOrderTankForm.get('etr_dt')?.setValidators([
        this.dateAfter(eta)
      ]);
      this.storingOrderTankForm.get('etr_dt')?.updateValueAndValidity();
    });

    this.storingOrderTankForm.get('etr_dt')?.valueChanges.subscribe((etr) => {
      this.storingOrderTankForm.get('eta_dt')?.setValidators([
        this.dateBefore(etr)
      ]);
      this.storingOrderTankForm.get('eta_dt')?.updateValueAndValidity();
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
        if (this.allowPurposeSteam()) {
          purposeSteamControl!.enable();
          requiredTempControl!.enable();
          requiredTempControl!.setValidators([
            Validators.max(value.flash_point - 1),
            Validators.min(0)
          ]);
        }

        // Handle based on current steam value
        if (purposeSteamControl!.value) {
          requiredTempControl!.enable();
        } else {
          requiredTempControl!.disable();
          requiredTempControl!.setValue('');
        }
      }

      if (!this.canEdit()) {
        purposeSteamControl!.disable();
        requiredTempControl!.disable();
      }

      requiredTempControl!.updateValueAndValidity();
    } else {
      this.storingOrderTankForm.get('flash_point')!.reset();
      this.storingOrderTankForm.get('open_on_gate')!.reset();
    }
    this.lastCargoControl.updateValueAndValidity();
    this.valueChangesDisabled = false;
  }

  onPurposeChangeCheck(event: any) {
    if (this.canEdit()) {
      if (this.storingOrderTankForm.get('purpose_cleaning')?.value || this.storingOrderTankForm.get('purpose_repair_cv')?.value) {
        this.storingOrderTankForm.get('purpose_storage')?.setValue(true);

        this.storingOrderTankForm.get('required_temp')?.setValue('');
        this.storingOrderTankForm.get('required_temp')?.disable();
        this.storingOrderTankForm.get('purpose_steam')?.disable();
        this.storingOrderTankForm.get('purpose_storage')?.disable();
      } else if (!this.storingOrderTankForm.get('purpose_cleaning')?.value && !this.storingOrderTankForm.get('purpose_repair_cv')?.value) {
        this.storingOrderTankForm.get('purpose_storage')?.enable();
        this.storingOrderTankForm.get('purpose_steam')?.enable();
      }
    }
  }

  allowPurposeSteam() {
    return !this.storingOrderTankForm.get('purpose_cleaning')?.value && !this.storingOrderTankForm.get('purpose_repair_cv')?.value;
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

    // Validate that at least one of the purpose checkboxes is checked
    if (!purposeStorage && !purposeSteam && !purposeCleaning && !purposeRepairCV) {
      isValid = false; // At least one purpose must be selected
      this.storingOrderTankForm.get('purpose')?.setErrors({ required: true });
    }

    return isValid;
  }

  validateRequireTemp(): boolean {
    let isValid = true;
    const purposeSteam = this.storingOrderTankForm.get('purpose_steam')?.value;
    const requiredTemp = this.storingOrderTankForm.get('required_temp')?.value;
    const flashPoint = this.storingOrderTankForm.get('flash_point')?.value;

    // Validate that required_temp is filled in if purpose_steam is checked
    if (purposeSteam && !requiredTemp) {
      isValid = false; // required_temp must be filled if purpose_steam is checked
      this.storingOrderTankForm.get('required_temp')?.setErrors({ required: true });
    } else if (requiredTemp && flashPoint) {
      if (requiredTemp >= flashPoint) {
        isValid = false;
        this.storingOrderTankForm.get('required_temp')?.setErrors({ max: true });
      }
    }

    return isValid;
  }

  canEdit(): boolean {
    return this.sotDS.canEdit(this.storingOrderTank) || (!this.sotDS.canRollbackStatus(this.storingOrderTank) && ((this.storingOrderTank.actions?.length ?? 0) > 0) && !this.storingOrderTank.actions!.includes('cancel') && !this.storingOrderTank.actions!.includes('rollback'));
  }

  updateValidators(validOptions: any[]) {
    this.lastCargoControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  dateAfter(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && minDate && control.value < minDate
        ? { dateTooEarly: true }
        : null;
    };
  }

  // Custom validator: ETA before ETR
  dateBefore(maxDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && maxDate && control.value > maxDate
        ? { dateTooLate: true }
        : null;
    };
  }

  getSaveBtnDescription(): string {
    return Utility.getSaveBtnDescription(this.storingOrderTank?.guid);
  }
}
