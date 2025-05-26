import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { CodeValuesDS } from 'app/data-sources/code-values';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateDS, InGateItem } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { PackageLabourItem } from 'app/data-sources/package-labour';
import { ResidueItem } from 'app/data-sources/residue';
import { ResiduePartItem } from 'app/data-sources/residue-part';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';

export interface DialogData {
  action?: string;
  translatedLangText?: any;
  sot?: StoringOrderTankItem;
  residueItem?: ResidueItem;
  packageLabourItem?: PackageLabourItem;
  ig?: InGateItem;
  igs?: InGateSurveyItem;
  tcDS: TariffCleaningDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  igDS: InGateDS;
  populateData: any;
}

@Component({
  selector: 'app-overwrite-residue-appr-form-dialog',
  templateUrl: './overwrite-residue-appr-form-dialog.component.html',
  styleUrls: ['./overwrite-residue-appr-form-dialog.component.scss'],
  providers: [provideNgxMask()],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
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
    MatTableModule,
    MatDividerModule,
    MatCardModule,
    MatProgressSpinnerModule,
    TlxFormFieldComponent,
    PreventNonNumericDirective
  ],
})
export class OverwriteResidueApprovalFormDialogComponent {
  displayedColumns = [
    'seq',
    'desc',
    'qty',
    'qty_unit',
    'unit_price',
    'approve_part',
    'cost',
  ];

  sot: StoringOrderTankItem;
  residueItem: ResidueItem;
  packageLabourItem: PackageLabourItem;
  rdList: any[] = [];
  igItem: InGateItem;
  igsItem: InGateSurveyItem;
  last_cargoList?: TariffCleaningItem[];
  tcDS: TariffCleaningDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  igDS: InGateDS;
  dialogTitle: string;
  overwriteForm: UntypedFormGroup;
  lastCargoControl: UntypedFormControl;
  valueChangesDisabled: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<OverwriteResidueApprovalFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
  ) {
    // Set the defaults
    this.dialogTitle = data.translatedLangText?.OVERWRITE_APPROVAL;
    this.sot = data.sot!;
    this.residueItem = data.residueItem!;
    this.packageLabourItem = data.packageLabourItem!;
    this.igItem = data.ig!;
    this.igsItem = data.igs!;
    this.tcDS = data.tcDS;
    this.ccDS = data.ccDS;
    this.cvDS = data.cvDS;
    this.igDS = data.igDS;
    this.rdList = this.residueItem.residue_part?.map(x => ({ ...x, qty_unit_type: this.cvDS.getCodeObject(x.qty_unit_type_cv, data.populateData.unitTypeCvList) })) ?? [];
    this.lastCargoControl = new UntypedFormControl('', [Validators.required]);
    this.overwriteForm = this.createForm();
    this.initializeValueChange();
  }

  createForm(): UntypedFormGroup {
    const getBillingCustomer = this.data.populateData.billingBranchList?.find((x: any) => x.guid === this.residueItem.bill_to_guid)
    const formGroup = this.fb.group({
      job_no: [{ value: this.residueItem.job_no, disabled: !this.canEdit() }],
      billing_to: [{ value: getBillingCustomer, disabled: !this.canEdit() }],
      overwrite_remarks: [{ value: this.residueItem.overwrite_remarks, disabled: !this.canEdit() }]
    });
    return formGroup;
  }

  initializeValueChange() {
  }

  submit() {
    if (this.overwriteForm?.valid) {
      const returnDialog: any = {
        billing_to: this.overwriteForm.get('billing_to')?.value?.guid,
        job_no: this.overwriteForm.get('job_no')?.value,
        overwrite_remarks: this.overwriteForm.get('overwrite_remarks')?.value,
        residue_part: this.rdList.map(x => ({ ...x, qty_unit_type_cv: x.qty_unit_type.code_val, action: 'overwrite' })),
        total_cost: this.getTotalCost(),
      }
      this.dialogRef.close(returnDialog);
    } else {
      console.log('invalid');
      this.findInvalidControls();
    }
  }

  updateValidators(validOptions: any[]) {
    this.lastCargoControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  findInvalidControls() {
    const controls = this.overwriteForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  canEdit(): boolean {
    return !this.residueItem?.customer_billing_guid;
  }

  isDisabled(): boolean {
    return false;
    const validStatus = ['COMPLETED', 'QC_COMPLETED', 'JOB_IN_PROGRESS']
    return validStatus.includes(this.residueItem?.status_cv!) || this.isAutoApproveSteaming(this.residueItem);
  }

  isAutoApproveSteaming(row: any) {
    return BusinessLogicUtil.isAutoApproveSteaming(row);
  }

  isApproved() {
    const validStatus = ['JOB_IN_PROGRESS', 'APPROVED', 'COMPLETED', 'QC_COMPLETED']
    return validStatus.includes(this.residueItem?.status_cv!);
  }

  selectText(event: FocusEvent) {
    Utility.selectText(event)
  }

  displayDate(input: any): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  updateAction(residuePart: any) {
    if (residuePart?.action === '' || residuePart?.action === null || residuePart?.action === undefined) {
      residuePart.action = 'EDIT';
    }
  }

  getFooterBackgroundColor(): string {
    return '' //'light-green';
  }

  parse2Decimal(input: number | string | undefined) {
    return Utility.formatNumberDisplay(input);
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  getTotalCost(): number {
    return this.rdList.reduce((acc, row) => {
      if (row.delete_dt === undefined || row.delete_dt === null && (row.approve_part == null || row.approve_part == true)) {
        if (this.isApproved()) {
          return acc + ((row.approve_qty || 0) * (row.approve_cost || 0) + ((row.approve_labour || 0) * (this.packageLabourItem?.cost || 0)));
        } else {
          return acc + ((row.quantity || 0) * (row.cost || 0) + ((row.labour || 0) * (this.packageLabourItem?.cost || 0)));
        }
      }
      return acc;
    }, 0);
  }

  calculateResidueItemCost(steamPart: ResiduePartItem): number {
    let calResCost: number = 0;

    if (this.isApproved()) {
      calResCost = steamPart.approve_cost! * steamPart.approve_qty!;
    }
    else {
      calResCost = steamPart.cost! * steamPart.quantity!;
    }

    return calResCost;
  }

  isApprovePart(stm: ResiduePartItem) {
    return stm.approve_part;
  }

  toggleApprovePart(event: Event, stm: ResiduePartItem) {
    event.stopPropagation(); // Prevents click event from bubbling up
    if (this.isDisabled()) return;
    stm.approve_part = stm.approve_part != null ? !stm.approve_part : false;
    stm.action = 'EDIT';
  }

  displayUnitTypeFn(cc: any): string {
    return cc?.description!;
  }
}
