import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { TransferItem } from 'app/data-sources/transfer';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';


export interface DialogData {
  action?: string;
  item: TransferItem;
  lastLocation?: string;
  lastTransfer?: TransferItem;
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
  lastLocation: string;
  lastTransfer?: TransferItem;
  filteredYardCvList: CodeValuesItem[] = [];
  startDateETA = new Date();
  startDateETR = new Date();

  cvDS: CodeValuesDS;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    // Set the defaults
    this.cvDS = new CodeValuesDS(this.apollo);
    this.action = data.action!;
    this.lastLocation = data.lastLocation || '';
    this.transferItem = data.item ? data.item : new TransferItem();
    this.lastTransfer = data.lastTransfer;
    if (this.action === 'edit') {
      this.dialogTitle = data.translatedLangText?.EDIT_TRANSFER_DETAILS;
      this.filteredYardCvList = data.populateData?.yardCvList?.filter((x: any) => x.code_val !== this.lastTransfer?.location_from_cv);
    } else {
      this.dialogTitle = data.translatedLangText?.NEW_TRANSFER_DETAILS;
      this.filteredYardCvList = data.populateData?.yardCvList?.filter((x: any) => x.code_val !== this.lastLocation);
    }
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
      location_to_cv: [{ value: this.transferItem.location_to_cv, disabled: this.transferItem?.transfer_in_dt && this.transferItem?.transfer_in_dt > 0 }, [Validators.required]],
      transfer_out_dt: [{ value: Utility.convertDate(this.transferItem.transfer_out_dt), disabled: !this.canEdit() }],
      transfer_in_dt: [{ value: Utility.convertDate(this.transferItem.transfer_in_dt), disabled: !this.canEdit() }],
      haulier: [{ value: this.transferItem.haulier, disabled: false }, [Validators.required]],
      vehicle_no: [{ value: this.transferItem.vehicle_no, disabled: false }, [Validators.required]],
      driver_name: [{ value: this.transferItem.driver_name, disabled: false }, [Validators.required]],
      remarks: [{ value: this.transferItem?.remarks, disabled: false }],
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
        haulier: this.transferForm.get('haulier')?.value?.toUpperCase(),
        vehicle_no: this.transferForm.get('vehicle_no')?.value?.toUpperCase(),
        driver_name: this.transferForm.get('driver_name')?.value?.toUpperCase(),
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

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data?.populateData?.yardCvList);
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
    if (this.action === 'new') return true;
    const lastTransfer = this.lastTransfer;
    if (this.transferItem && lastTransfer?.guid !== this.transferItem?.guid) {
      return false;
    }
    return true;
  }
}
