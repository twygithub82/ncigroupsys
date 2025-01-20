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
import { TransferItem } from 'app/data-sources/transfer';
import { TankInfoItem } from 'app/data-sources/tank-info';
import { CodeValuesItem } from 'app/data-sources/code-values';


export interface DialogData {
  action?: string;
  item: TransferItem;
  tiItem?: TankInfoItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
}

@Component({
  selector: 'app-transfer-details-form-dialog',
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
  ],
})
export class FormDialogComponent {
  action: string;
  index: number;
  dialogTitle: string;
  transferForm: UntypedFormGroup;
  transferItem: TransferItem;
  tiItem: TankInfoItem;
  filteredYardCvList: CodeValuesItem[] = [];
  startDateETA = new Date();
  startDateETR = new Date();
  valueChangesDisabled: boolean = false;

  isPreOrder = false;

  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
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
    this.tiItem = data.tiItem || new TankInfoItem();
    this.transferItem = data.item ? data.item : new TransferItem();
    if (this.action === 'edit') {
      this.dialogTitle = data.translatedLangText?.EDIT_TRANSFER_DETAILS;
    } else {
      this.dialogTitle = data.translatedLangText?.NEW_TRANSFER_DETAILS;
    }
    this.filteredYardCvList = data.populateData?.yardCvList?.filter((x: any) => x.code_val !== this.tiItem?.yard_cv);
    this.index = data.index;
    this.transferForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    // this.startDateETA = Utility.getEarlierDate((Utility.convertDate(this.storingOrderTank.eta_dt) as Date), this.startDateETA);
    // this.startDateETR = Utility.getEarlierDate((Utility.convertDate(this.storingOrderTank.etr_dt) as Date), this.startDateETR);
    return this.fb.group({
      guid: [this.transferItem.guid],
      sot_guid: [{ value: this.transferItem.sot_guid, disabled: !this.canEdit() }, [Validators.required]],
      location_from_cv: [{ value: this.transferItem.location_from_cv, disabled: !this.canEdit() }, [Validators.required]],
      location_to_cv: [{ value: this.transferItem.location_to_cv, disabled: !this.canEdit() }, [Validators.required]],
      transfer_out_dt: [{ value: Utility.convertDate(this.transferItem.transfer_out_dt), disabled: !this.canEdit() }],
      transfer_in_dt: [{ value: Utility.convertDate(this.transferItem.transfer_in_dt), disabled: !this.canEdit() }],
      haulier: [{ value: this.transferItem.haulier, disabled: !this.canEdit() }, [Validators.required]],
      vehicle_no: [{ value: this.transferItem.vehicle_no, disabled: !this.canEdit() }, [Validators.required]],
      driver_name: [{ value: this.transferItem.driver_name, disabled: !this.canEdit() }, [Validators.required]],
      remarks: [{ value: this.transferItem?.remarks, disabled: !this.canEdit() }],
    });
  }

  submit() {
    if (this.transferForm?.valid) {
      // let actions = Array.isArray(this.transferItem.actions!) ? [...this.transferItem.actions!] : [];
      var transfer: TransferItem = {
        ...this.transferItem,
        guid: this.transferForm.get('guid')?.value,
        sot_guid: this.transferForm.get('sot_guid')?.value,
        location_from_cv: this.transferForm.get('location_from_cv')?.value,
        location_to_cv: this.transferForm.get('location_to_cv')?.value,
        transfer_out_dt: Utility.convertDate(this.transferForm.get('transfer_out_dt')?.value || new Date(), false, true) as number,
        transfer_in_dt: Utility.convertDate(this.transferForm.get('transfer_in_dt')?.value, false, true) as number,
        haulier: this.transferForm.get('haulier')?.value,
        vehicle_no: this.transferForm.get('vehicle_no')?.value?.toUpperCase(),
        driver_name: this.transferForm.get('driver_name')?.value,
        remarks: this.transferForm.get('remarks')?.value,
      }
      const returnDialog: DialogData = {
        item: transfer,
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

  findInvalidControls() {
    const controls = this.transferForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  canEdit(): boolean {
    return true;
  }
}
