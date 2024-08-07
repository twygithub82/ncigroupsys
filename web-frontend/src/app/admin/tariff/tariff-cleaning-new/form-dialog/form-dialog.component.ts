import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit,ViewChild } from '@angular/core';
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
import { TranslateModule,TranslateService } from '@ngx-translate/core';
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
import { MatTabBody, MatTabGroup, MatTabHeader, MatTabsModule } from '@angular/material/tabs';

export interface DialogData {
  action?: string;
  selectedValue?:string;
  // item: StoringOrderTankItem;
   langText?: any;
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
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
    MatTabsModule,
    MatTabGroup,
    MatTabHeader,
    MatTabBody,
  ],
})
export class FormDialogComponent {
  action: string;
  index?: number;
  dialogTitle?: string;
  storingOrderTankForm?: UntypedFormGroup;
  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();

  translatedLangText: any = {};
  langText = {
    CARGO_CLASS_1 :"COMMON-FORM.CARGO-CLASS-1",
    CARGO_CLASS_1_4 :"COMMON-FORM.CARGO-CLASS-1-4",
    CARGO_CLASS_1_5 :"COMMON-FORM.CARGO-CLASS-1-5",
    CARGO_CLASS_1_6 :"COMMON-FORM.CARGO-CLASS-1-6",
    CARGO_CLASS_2_1 :"COMMON-FORM.CARGO-CLASS-2-1",
    CARGO_CLASS_2_2 :"COMMON-FORM.CARGO-CLASS-2-2",
    CARGO_CLASS_2_3 :"COMMON-FORM.CARGO-CLASS-2-3",
    CARGO_CLASS_3: "COMMON-FORM.CARGO-CLASS-3",
    CARGO_CLASS_4_1: "COMMON-FORM.CARGO-CLASS-4-1",
    CARGO_CLASS_4_2:"COMMON-FORM.CARGO-CLASS-4-2",
    CARGO_CLASS_4_3:"COMMON-FORM.CARGO-CLASS-4-3",
    CARGO_CLASS_5_1:"COMMON-FORM.CARGO-CLASS-5-1",
    CARGO_CLASS_5_2:"COMMON-FORM.CARGO-CLASS-5-2",
    CARGO_CLASS_6_1:"COMMON-FORM.CARGO-CLASS-6-1",
    CARGO_CLASS_6_2:"COMMON-FORM.CARGO-CLASS-6-2",
    CARGO_CLASS_7_1:"COMMON-FORM.CARGO-CLASS-7-1",
    CARGO_CLASS_7_2:"COMMON-FORM.CARGO-CLASS-7-2",
    CARGO_CLASS_7_3:"COMMON-FORM.CARGO-CLASS-7-3",
    CARGO_CLASS_8:"COMMON-FORM.CARGO-CLASS-8",
    CARGO_CLASS_9_1:"COMMON-FORM.CARGO-CLASS-9-1",
    CARGO_CLASS_9_2:"COMMON-FORM.CARGO-CLASS-9-2"
  };

  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
  lastCargoControl = new UntypedFormControl('', [Validators.required, AutocompleteSelectionValidator(this.last_cargoList)]);
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService
  ) {
    // Set the defaults

    this.tcDS = new TariffCleaningDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.action = data.action!;
    this.translateLangText();
    // this.sotExistedList = data.sotExistedList;
    // if (this.action === 'edit') {
    //   this.dialogTitle = 'Edit ' + data.item.tank_no;
    //   this.storingOrderTank = data.item;
    // } else {
    //   this.dialogTitle = 'New Record';
    //   this.storingOrderTank = new StoringOrderTankItem();
    // }
    // this.index = data.index;
    // this.storingOrderTankForm = this.createStorigOrderTankForm();
    // this.initializeValueChange();

    // if (this.storingOrderTank?.tariff_cleaning) {
    //   this.lastCargoControl.setValue(this.storingOrderTank?.tariff_cleaning);
    // }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }
  // tabs = Array.from(Array(20).keys());

  // @ViewChild('tabGroup')
  // tabGroup;

  // scrollTabs(event: Event) {
  //   const children = this.tabGroup._tabHeader._elementRef.nativeElement.children;
  //   const back = children[0];
  //   const forward = children[2];
  //   if (event.deltaY > 0) {
  //     forward.click();
  //   } else {
  //     back.click();
  //   }
  // }

  // createStorigOrderTankForm(): UntypedFormGroup {

  //   if (!this.canEdit()) {
  //     this.lastCargoControl.disable();
  //   } else {
  //     this.lastCargoControl.enable();
  //   }
  //   return this.fb.group({
  //     guid: [this.storingOrderTank?.guid],
  //     so_guid: [this.storingOrderTank?.so_guid],
  //     unit_type_guid: [{ value: this.storingOrderTank?.unit_type_guid, disabled: !this.canEdit() }, [Validators.required]],
  //     tank_no: [{ value: this.storingOrderTank?.tank_no, disabled: !this.canEdit() }, [Validators.required]],
  //     last_cargo: this.lastCargoControl,
  //     last_cargo_guid: [{ value: this.storingOrderTank?.last_cargo_guid, disabled: !this.canEdit() }, [Validators.required]],
  //     job_no: [{ value: this.storingOrderTank?.job_no, disabled: !this.canEdit() }, [Validators.required]],
  //     eta_dt: [{ value: Utility.convertDate(this.storingOrderTank?.eta_dt), disabled: !this.canEdit() }],
  //     purpose: [''],
  //     purpose_storage: [{ value: this.storingOrderTank?.purpose_storage, disabled: !this.canEdit() }],
  //     purpose_steam: [{ value: this.storingOrderTank?.purpose_steam, disabled: !this.canEdit() }],
  //     purpose_cleaning: [{ value: this.storingOrderTank?.purpose_cleaning, disabled: !this.canEdit() }],
  //     purpose_repair_cv: [{ value: this.storingOrderTank?.purpose_repair_cv, disabled: !this.canEdit() }],
  //     clean_status_cv: [{ value: this.storingOrderTank?.clean_status_cv, disabled: !this.canEdit() }],
  //     certificate_cv: [{ value: this.storingOrderTank?.certificate_cv, disabled: !this.canEdit() }],
  //     required_temp: [{ value: this.storingOrderTank?.required_temp, disabled: !this.storingOrderTank?.purpose_steam || !this.canEdit() }],
  //     etr_dt: [{ value: Utility.convertDate(this.storingOrderTank?.etr_dt), disabled: !this.canEdit() }],
  //     remarks: [{ value: this.storingOrderTank?.tariff_cleaning?.remarks, disabled: true }],
  //     open_on_gate: [{ value: this.storingOrderTank?.tariff_cleaning?.open_on_gate_cv, disabled: true }],
  //     flash_point: [this.storingOrderTank?.tariff_cleaning?.flash_point]
  //   });
  // }

  
  selectClassNo(value:string):void{
    const returnDialog: DialogData = {
      selectedValue:value
    }
    console.log('valid');
    this.dialogRef.close(returnDialog);
  }

  // submit() {
  //   this.storingOrderTankForm?.get('purpose')?.setErrors(null);
  //   this.storingOrderTankForm?.get('required_temp')?.setErrors(null);
  //   debugger
  //   if (this.storingOrderTankForm?.valid) {
  //     if (!this.validatePurpose()) {
  //       this.storingOrderTankForm?.get('purpose')?.setErrors({ required: true });
  //     } else {
  //       this.storingOrderTankForm?.get('purpose')?.setErrors(null);
       
  //       const returnDialog: DialogData = {
  //         // item: sot,
  //         // index: this.index
  //       }
  //       console.log('valid');
  //       this.dialogRef.close(returnDialog);
  //     }
  //   } else {
  //     console.log('invalid');
  //     this.findInvalidControls();
  //   }
  // }
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
  // initializeValueChange() {
  //   this.storingOrderTankForm!.get('purpose_steam')!.valueChanges.subscribe(value => {
  //     const requiredTempControl = this.storingOrderTankForm?.get('required_temp');
  //     if (value) {
  //       requiredTempControl!.enable();
  //     } else {
  //       requiredTempControl!.disable();
  //       requiredTempControl!.setValue(''); // Clear the value if disabled
  //     }
  //   });

  //   this.storingOrderTankForm?.get('tank_no')?.valueChanges.subscribe(value => {
  //     // Custom validation logic for tank_no
  //     const isValid = Utility.verifyIsoContainerCheckDigit(value);
  //     if (!isValid) {
  //       // Set custom error if the value is invalid
  //       this.storingOrderTankForm?.get('tank_no')?.setErrors({ invalidCheckDigit: true });
  //     } else {
  //       // Clear custom error if the value is valid
  //       if (this.action !== 'edit') {
  //         const found = this.sotExistedList?.filter(sot => sot.tank_no === value);
  //         if (found?.length) {
  //           this.storingOrderTankForm?.get('tank_no')?.setErrors({ existed: true });
  //         } else {
  //           this.storingOrderTankForm?.get('tank_no')?.setErrors(null);
  //         }
  //       }
  //     }
  //   });

  //   this.storingOrderTankForm!.get('last_cargo')!.valueChanges.pipe(
  //     startWith(''),
  //     debounceTime(300),
  //     tap(value => {
  //       var searchCriteria = '';
  //       if (typeof value === 'string') {
  //         searchCriteria = value;
  //       } else {
  //         searchCriteria = value.cargo;
  //         this.storingOrderTankForm!.get('last_cargo_guid')!.setValue(value.guid);
  //       }
  //       this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
  //         this.last_cargoList = data
  //       });
  //     })
  //   ).subscribe();

  //   this.lastCargoControl.valueChanges.subscribe(value => {
  //     if (value.guid) {
  //       this.storingOrderTankForm?.get('remarks')!.setValue(value.remarks);
  //       this.storingOrderTankForm?.get('flash_point')!.setValue(value.flash_point);
  //       this.storingOrderTankForm?.get('open_on_gate')!.setValue(value.open_on_gate_cv);
  //     }
  //   });
  // }
  // findInvalidControls() {
  //   const controls = this.storingOrderTankForm?.controls;
  //   for (const name in controls) {
  //     if (controls[name].invalid) {
  //       console.log(name);
  //     }
  //   }
  // }
  // displayLastCargoFn(tc: TariffCleaningItem): string {
  //   return tc && tc.cargo ? `${tc.cargo}` : '';
  // }
  // validatePurpose(): boolean {
  //   let isValid = true;
  //   const purposeStorage = this.storingOrderTankForm?.get('purpose_storage')?.value;
  //   const purposeSteam = this.storingOrderTankForm?.get('purpose_steam')?.value;
  //   const purposeCleaning = this.storingOrderTankForm?.get('purpose_cleaning')?.value;
  //   const purposeRepairCV = this.storingOrderTankForm?.get('purpose_repair_cv')?.value;
  //   const requiredTemp = this.storingOrderTankForm?.get('required_temp')?.value;

  //   // Validate that at least one of the purpose checkboxes is checked
  //   if (!purposeStorage && !purposeSteam && !purposeCleaning && !purposeRepairCV) {
  //     isValid = false; // At least one purpose must be selected
  //     this.storingOrderTankForm?.get('purpose')?.setErrors({ required: true });
  //   }

  //   // Validate that required_temp is filled in if purpose_steam is checked
  //   if (purposeSteam && !requiredTemp) {
  //     isValid = false; // required_temp must be filled if purpose_steam is checked
  //     this.storingOrderTankForm?.get('required_temp')?.setErrors({ required: true });
  //   }

  //   return isValid;
  // }
  // canEdit(): boolean {
  //   return true;//!this.sotDS.canRollbackStatus(this.storingOrderTank) && !this.storingOrderTank?.actions.includes('cancel') && !this.storingOrderTank?.actions.includes('rollback');
  // }
}
