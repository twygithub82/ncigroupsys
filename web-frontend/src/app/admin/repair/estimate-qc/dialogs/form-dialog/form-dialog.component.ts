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
import { startWith, debounceTime, tap } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TariffRepairDS, TariffRepairItem } from 'app/data-sources/tariff-repair';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairDS, RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { Direction } from '@angular/cdk/bidi';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { RepairDS, RepairItem } from 'app/data-sources/repair';


export interface DialogData {
  action?: string;
  item?: RepairPartItem;
  translatedLangText?: any;
  populateData?: any;
  repairItem?: RepairItem;
  index: number;
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
  ],
})
export class FormDialogComponent extends UnsubscribeOnDestroyAdapter {
  action: string;
  index: number;
  dialogTitle: string;

  repairPartForm: UntypedFormGroup;
  repairItem?: RepairItem;
  repairPart: any;
  subgroupNameCvList?: CodeValuesItem[];

  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  trDS: TariffRepairDS;
  repDrDS: RPDamageRepairDS;
  prDS: PackageRepairDS;
  repairDS: RepairDS;
  repairPartDS: RepairPartDS;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    super();
    // Set the defaults
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.trDS = new TariffRepairDS(this.apollo);
    this.repDrDS = new RPDamageRepairDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.repairDS = new RepairDS(this.apollo);
    this.repairPartDS = new RepairPartDS(this.apollo);
    this.action = data.action!;
    this.dialogTitle = data.translatedLangText.APPROVE_INFO;
    this.repairPart = data.item ? data.item : new RepairPartItem();
    this.repairItem = data.repairItem;
    this.index = data.index;
    this.repairPartForm = this.createForm();
    this.initializeValueChange();
    this.patchForm();
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      approve_qty: [{value: '', disabled: !this.repairDS.canApprove(this.repairItem) || this.repairPartDS.is4X(this.repairPart?.rp_damage_repair)}],
      approve_hour: [{value: '', disabled: !this.repairDS.canApprove(this.repairItem) || this.repairPartDS.is4X(this.repairPart?.rp_damage_repair)}],
      approve_cost: [{value: '', disabled: !this.repairDS.canApprove(this.repairItem) || this.repairPartDS.is4X(this.repairPart?.rp_damage_repair)}]
    });
  }

  patchForm() {
    this.repairPartForm.patchValue({
      approve_qty: this.repairDS.canApprove(this.repairItem) ? (this.repairPart.approve_qty ?? this.repairPart.quantity) : this.repairPart.approve_qty,
      approve_hour: this.repairDS.canApprove(this.repairItem) ? (this.repairPart.approve_hour ?? this.repairPart.hour) : this.repairPart.approve_hour,
      approve_cost: this.repairDS.canApprove(this.repairItem) ? (this.repairPart.approve_cost ?? this.repairPart.material_cost) : this.repairPart.approve_cost
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
        approve_qty: this.repairPartForm.get('approve_qty')?.value,
        approve_hour: this.repairPartForm.get('approve_hour')?.value,
        approve_cost: Utility.convertNumber(this.repairPartForm.get('approve_cost')?.value),
      }
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
}