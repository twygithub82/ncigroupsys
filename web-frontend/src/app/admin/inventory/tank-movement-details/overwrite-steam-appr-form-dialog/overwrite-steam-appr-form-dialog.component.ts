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
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateDS, InGateItem } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { PackageLabourItem } from 'app/data-sources/package-labour';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { SteamPartItem } from 'app/data-sources/steam-part';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';

export interface DialogData {
  action?: string;
  translatedLangText?: any;
  sot?: StoringOrderTankItem;
  steamItem?: SteamItem;
  packageLabourItem?: PackageLabourItem;
  ig?: InGateItem;
  igs?: InGateSurveyItem;
  tcDS: TariffCleaningDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  steamDS: SteamDS;
  populateData: any;
}

@Component({
  selector: 'app-overwrite-steam-appr-form-dialog',
  templateUrl: './overwrite-steam-appr-form-dialog.component.html',
  styleUrls: ['./overwrite-steam-appr-form-dialog.component.scss'],
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
    PreventNonNumericDirective,
    GlobalMaxCharDirective
  ],
})
export class OverwriteSteamingApprovalFormDialogComponent {
  displayedColumns = [
    'seq',
    'desc',
    'qty',
    'unit_price',
    'hour',
    'cost',
    'approve_part'
  ];
  labourCostDisplayedColumns = [
    'seq',
    'desc',
    'qty',
    'labourSummaryUnitPrice',
    'labourSummaryHrs',
    'labourSummaryCost',
    'approve_part'
  ];
  totalCostDisplayedColumns = [
    'seq',
    'desc',
    'qty',
    'totalSummaryUnitPrice',
    'totalSummaryHrs',
    'totalSummaryCost',
    'approve_part'
  ];

  sot: StoringOrderTankItem;
  steamItem: SteamItem;
  packageLabourItem: PackageLabourItem;
  spList: any[] = [];
  igItem: InGateItem;
  igsItem: InGateSurveyItem;
  last_cargoList?: TariffCleaningItem[];
  tcDS: TariffCleaningDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  steamDS: SteamDS;
  dialogTitle: string;
  overwriteForm: UntypedFormGroup;
  lastCargoControl: UntypedFormControl;
  labourHour: number = 1;
  autosteamCost: string = '';
  autosteamTotalCost: string = '';
  valueChangesDisabled: boolean = false;
  isSteamRepair?: boolean = true;
  flat_rate: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<OverwriteSteamingApprovalFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
  ) {
    // Set the defaults
    this.dialogTitle = data.translatedLangText?.OVERWRITE_APPROVAL;
    this.sot = data.sot!;
    this.steamItem = data.steamItem!;
    this.spList = this.steamItem.steaming_part?.map(x => ({ ...x })) ?? [];
    this.packageLabourItem = data.packageLabourItem!;
    this.igItem = data.ig!;
    this.igsItem = data.igs!;
    this.tcDS = data.tcDS;
    this.ccDS = data.ccDS;
    this.igDS = data.igDS;
    this.steamDS = data.steamDS;
    this.lastCargoControl = new UntypedFormControl('', [Validators.required]);
    this.overwriteForm = this.createForm();
    this.initializeValueChange();
  }

  createForm(): UntypedFormGroup {
    const getBillingCustomer = this.data.populateData.billingBranchList?.find((x: any) => x.guid === this.steamItem.bill_to_guid)
    const formGroup = this.fb.group({
      job_no: [{ value: this.steamItem.job_no, disabled: !this.canEdit() }],
      billing_to: [{ value: getBillingCustomer, disabled: !this.canEdit() }],
      overwrite_remarks: [{ value: this.steamItem.overwrite_remarks, disabled: !this.canEdit() }]
    });

    this.labourHour = this.steamItem?.est_hour || 1;
    if (BusinessLogicUtil.isEstimateApproved(this.steamItem!)) {
      this.labourHour = this.steamItem?.total_hour || 1;
    }
    this.isSteamRepair = this.steamDS.IsSteamRepair(this.steamItem!);
    this.flat_rate = ((this.steamItem?.flat_rate || 0) === 0) ? false : true;
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
        steaming_part: this.spList.map(x => ({ ...x, action: 'overwrite' })),
        est_hour: Utility.convertNumber(this.getTotalLabourHour(), 2),
        est_cost: Utility.convertNumber(this.getTotalCost(), 2),
        rate: Utility.convertNumber(this.getRate(), 2),
        flat_rate: this.flat_rate,
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
    return !this.steamItem?.customer_billing_guid;
  }

  isDisabled(): boolean {
    return false;
    const validStatus = ['COMPLETED', 'QC_COMPLETED', 'JOB_IN_PROGRESS']
    return validStatus.includes(this.steamItem?.status_cv!) || this.isAutoApproveSteaming(this.steamItem);
  }

  isAutoApproveSteaming(row: any) {
    return BusinessLogicUtil.isAutoApproveSteaming(row);
  }

  isApproved() {
    const validStatus = ['JOB_IN_PROGRESS', 'APPROVED', 'COMPLETED', 'QC_COMPLETED']
    return validStatus.includes(this.steamItem?.status_cv!);
  }

  selectText(event: FocusEvent) {
    Utility.selectText(event)
  }

  displayDate(input: any): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  updateAction(steamPart: any) {
    if (steamPart?.action === '' || steamPart?.action === null || steamPart?.action === undefined) {
      steamPart.action = 'EDIT';
    }
  }

  getFooterBackgroundColor(): string {
    return '' //'light-green';
  }

  parse2Decimal(input: number | string | undefined) {
    return Utility.formatNumberDisplay(input);
  }

  getProcessStatusBadgeClass(status_cv: string | undefined) {
    return Utility.getProcessStatusBadgeClass(status_cv);
  }

  getProcessStatusDescription(codeValType: string | undefined): string | undefined {
    return BusinessLogicUtil.getCodeDescription(codeValType, this.data.populateData?.processStatusCvList);
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  getTotalLabourHours(): string {
    let ret = 0;
    if (this.isSteamRepair) {
      if (this.spList.length > 0) {
        this.spList.map(d => {
          if ((d.delete_dt === undefined || d.delete_dt === null) && (d.steaming_part || d.steaming_part == null)
            && (d.approve_part == null || d.approve_part == true)) {
            if (this.isApproved()) {
              ret += Utility.convertNumber(d.approve_labour, 2);
            }
            else {
              ret += Utility.convertNumber(d.labour, 2);
            }
          }
        });
      }
      return String(ret);
    }
    else {
      return '';
    }
  }

  getTotalLabourCost(): string {
    let ret = 0;
    if (this.spList.length > 0 && this.isSteamRepair) {
      this.spList.map(d => {
        if ((d.delete_dt === undefined || d.delete_dt === null) && (d.steaming_part || d.steaming_part == null)
          && (d.approve_part == null || d.approve_part == true)) {
          if (this.isApproved()) {
            ret += (d.approve_labour * this.packageLabourItem?.cost!);
          }
          else {
            ret += (d.labour * this.packageLabourItem?.cost!);
          }
        }
      }
      );
      return (ret || 0).toFixed(2);
    }
    else {
      return '-';
    }
  }

  getTotalLabourHour(): number {
    return this.spList.reduce((acc, row) => {
      if (row.delete_dt === undefined || row.delete_dt === null && (row.approve_part == null || row.approve_part == true)) {
        if (this.isApproved()) {
          return acc + (row.approve_labour || 0);
        }
        else {
          return acc + (row.labour || 0);
        }
      }
      return acc; // If row is approved, keep the current accumulator value
    }, 0);
  }

  getTotalCost(): number {
    if (this.isSteamRepair) {
      var retval = this.spList.reduce((acc, row) => {
        if ((row.delete_dt === undefined || row.delete_dt === null) && (row.approve_part == null || row.approve_part == true)) {
          if (this.isApproved()) {
            return acc + ((row.approve_qty || 0) * (row.approve_cost || 0)) + ((row.approve_labour || 0) * (this.packageLabourItem?.cost || 0));
          }
          else {
            return acc + ((row.quantity || 0) * (row.cost || 0)) + ((row.labour || 0) * (this.packageLabourItem?.cost || 0));
          }
        }
        return acc; // If row is approved, keep the current accumulator value
      }, 0);
      return retval;
    }
    else {
      return this.calculateSteamItemCost(this.spList[0]);
    }
  }

  calculateSteamItemCost(steamPart: SteamPartItem): number {
    let calResCost: number = 0;

    if (this.isApproved()) {
      calResCost = steamPart.approve_cost! * steamPart.approve_qty!;
    }
    else {
      calResCost = steamPart.cost! * steamPart.quantity!;
    }

    return calResCost;
  }

  isApprovePart(stm: SteamPartItem) {
    return stm.approve_part;
  }

  toggleApprovePart(event: Event, stm: SteamPartItem) {
    event.stopPropagation(); // Prevents click event from bubbling up
    if (this.isDisabled()) return;
    stm.approve_part = stm.approve_part != null ? !stm.approve_part : false;
    stm.action = 'EDIT';
  }

  getResultTable_HourText(): string {
    var retval = `${this.data.translatedLangText.HOUR_RATE}`;
    if (this.isSteamRepair) {
      retval = `${this.data.translatedLangText.HOUR}`;
    }
    return retval;
  }

  onFlatRateChanged(newValue: boolean) {
    var cost = this.getRate();
    var totalCost = this.parse2Decimal(cost);
    if (!this.flat_rate) {
      cost *= this.labourHour;
      totalCost = this.data.translatedLangText.BY_HOUR;
    }
    this.autosteamCost = this.parse2Decimal(cost);
    this.autosteamTotalCost = totalCost;
  }

  getRateType(): string {
    this.steamItem!.flat_rate = this.flat_rate;
    return this.flat_rate ? this.data.translatedLangText.FLAT : this.data.translatedLangText.HOURLY;
  }

  getRate(): number {
    if (this.isSteamRepair) {
      return this.packageLabourItem?.cost || 0;
    }
    else {
      if (this.spList.length == 0) return 0;

      if (this.flat_rate) return this.isApproved() ? (this.spList[0].approve_cost || 0) : (this.spList[0].cost || 0);
      else return this.isApproved() ? (this.spList[0].approve_labour || 0) : (this.spList[0].labour || 0);
    }
  }

  getLabourCost(): number {
    if (this.isSteamRepair) {
      return this.packageLabourItem?.cost || 0;
    }
    else {
      return 0;
    }
  }
}
