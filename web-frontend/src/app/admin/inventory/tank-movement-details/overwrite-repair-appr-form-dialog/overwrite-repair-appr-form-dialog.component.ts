import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { CodeValuesDS } from 'app/data-sources/code-values';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateDS, InGateItem } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { PackageLabourItem } from 'app/data-sources/package-labour';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { ResiduePartItem } from 'app/data-sources/residue-part';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ModulePackageService } from 'app/services/module-package.service';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';

import { debounceTime, startWith, tap } from 'rxjs';
import { PreventNonNumDirective } from 'app/directive/prevent-non-num.directive';

export interface DialogData {
  action?: string;
  translatedLangText?: any;
  sot?: StoringOrderTankItem;
  repairItem?: RepairItem;
  packageLabourItem?: PackageLabourItem;
  ig?: InGateItem;
  igs?: InGateSurveyItem;
  tcDS: TariffCleaningDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  igDS: InGateDS;
  sotDS: StoringOrderTankDS;
  repairDS: RepairDS;
  repairPartDS: RepairPartDS;
  populateData: any;
}

@Component({
  selector: 'app-overwrite-repair-appr-form-dialog',
  templateUrl: './overwrite-repair-appr-form-dialog.component.html',
  styleUrls: ['./overwrite-repair-appr-form-dialog.component.scss'],
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
    MatTooltipModule,
    // PreventNonNumDirective,
  ],
})
export class OverwriteRepairApprovalFormDialogComponent {
  displayedColumns = [
    'seq',
    'subgroup_name_cv',
    'damange',
    'repair',
    'description',
    'quantity',
    'hour',
    'price',
    'material',
    'isOwner',
    'approve_part',
    'approve_qty',
    'approve_hour',
    'approve_cost'
  ];

  sot: StoringOrderTankItem;
  repairItem: RepairItem;
  packageLabourItem: PackageLabourItem;
  repList: any[] = [];
  igItem: InGateItem;
  igsItem: InGateSurveyItem;
  last_cargoList?: TariffCleaningItem[];
  tcDS: TariffCleaningDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  igDS: InGateDS;
  sotDS: StoringOrderTankDS;
  repairDS: RepairDS;
  repairPartDS: RepairPartDS;
  dialogTitle: string;
  overwriteForm: UntypedFormGroup;
  summaryTableForm: UntypedFormGroup;
  lastCargoControl: UntypedFormControl;
  isOwner = false;
  canApproveFlag = false;
  constructor(
    public dialogRef: MatDialogRef<OverwriteRepairApprovalFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private modulePackageService: ModulePackageService,
  ) {
    // Set the defaults
    this.dialogTitle = data.translatedLangText?.OVERWRITE_APPROVAL;
    this.sot = data.sot!;
    this.repairItem = data.repairItem!;
    this.packageLabourItem = data.packageLabourItem!;
    this.igItem = data.ig!;
    this.igsItem = data.igs!;
    this.tcDS = data.tcDS;
    this.ccDS = data.ccDS;
    this.cvDS = data.cvDS;
    this.igDS = data.igDS;
    this.sotDS = data.sotDS;
    this.repairDS = data.repairDS;
    this.repairPartDS = data.repairPartDS;
    this.repList = this.repairItem.repair_part?.map(x => ({ ...x })) ?? [];
    this.lastCargoControl = new UntypedFormControl('', [Validators.required]);
    this.overwriteForm = this.createForm();
    this.summaryTableForm = this.createSummaryForm();
    this.initializeValueChange();
  }

  createForm(): UntypedFormGroup {
    const getBillingCustomer = this.data.populateData.billingBranchList?.find((x: any) => x.guid === this.repairItem.bill_to_guid)
    const formGroup = this.fb.group({
      job_no: [{ value: this.repairItem.job_no, disabled: !this.canEdit() }],
      billing_to: [{ value: getBillingCustomer, disabled: !this.canEdit() }],
      overwrite_remarks: [{ value: this.repairItem.overwrite_remarks, disabled: !this.canEdit() }],
    });
    return formGroup;
  }

  createSummaryForm(): UntypedFormGroup {
    this.isOwner = this.repairItem.owner_enable ?? false;
    this.isOwnerChanged();
    const formGroup = this.fb.group({
      surveyor_id: [''],
      labour_cost_discount: [this.repairItem.labour_cost_discount],
      material_cost_discount: [this.repairItem.material_cost_discount],
      // cost
      total_owner_hour: [0],
      total_lessee_hour: [0],
      total_hour: [0],
      total_owner_labour_cost: [0],
      total_lessee_labour_cost: [0],
      total_labour_cost: [0],
      total_owner_mat_cost: [0],
      total_lessee_mat_cost: [0],
      total_mat_cost: [0],
      total_owner_cost: [0],
      total_lessee_cost: [0],
      total_cost: [0],
      discount_labour_owner_cost: [0],
      discount_labour_lessee_cost: [0],
      discount_labour_cost: [0],
      discount_mat_owner_cost: [0],
      discount_mat_lessee_cost: [0],
      discount_mat_cost: [0],
      net_owner_cost: [0],
      net_lessee_cost: [0],
      net_cost: [0],
      total_owner_hour_est: [0],
      total_lessee_hour_est: [0],
      total_hour_est: [0],
      total_owner_labour_cost_est: [0],
      total_lessee_labour_cost_est: [0],
      total_labour_cost_est: [0],
      total_owner_mat_cost_est: [0],
      total_lessee_mat_cost_est: [0],
      total_mat_cost_est: [0],
      total_owner_cost_est: [0],
      total_lessee_cost_est: [0],
      total_cost_est: [0],
      discount_labour_owner_cost_est: [0],
      discount_labour_lessee_cost_est: [0],
      discount_labour_cost_est: [0],
      discount_mat_owner_cost_est: [0],
      discount_mat_lessee_cost_est: [0],
      discount_mat_cost_est: [0],
      net_owner_cost_est: [0],
      net_lessee_cost_est: [0],
      net_cost_est: [0],
    });
    this.updateData(formGroup, this.repairItem.repair_part);
    return formGroup;
  }

  initializeValueChange() {
    this.summaryTableForm?.get('labour_cost_discount')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        this.calculateCost(this.summaryTableForm);
        this.calculateCostEst(this.summaryTableForm);
      })
    ).subscribe();

    this.summaryTableForm?.get('material_cost_discount')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        this.calculateCost(this.summaryTableForm);
        this.calculateCostEst(this.summaryTableForm);
      })
    ).subscribe();
  }

  submit() {
    if (this.overwriteForm?.valid && this.summaryTableForm.valid) {
      const returnDialog: any = {
        billing_to: this.overwriteForm.get('billing_to')?.value?.guid,
        job_no: this.overwriteForm.get('job_no')?.value,
        owner_enable: this.isOwner,
        labour_cost_discount: Utility.convertNumber(this.summaryTableForm.get('labour_cost_discount')?.value, 2),
        material_cost_discount: Utility.convertNumber(this.summaryTableForm.get('material_cost_discount')?.value, 2),
        total_cost: Utility.convertNumber(this.summaryTableForm?.get('net_cost')?.value, 2),
        total_hour: Utility.convertNumber(this.summaryTableForm.get('total_hour')?.value, 2),
        total_labour_cost: Utility.convertNumber(this.summaryTableForm.get('total_labour_cost')?.value, 2),
        total_material_cost: Utility.convertNumber(this.summaryTableForm.get('total_mat_cost')?.value, 2),
        overwrite_remarks: this.overwriteForm.get('overwrite_remarks')?.value,
        repair_part: this.repList.map(x => ({ ...x, action: 'overwrite' })),
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
    const controls2 = this.summaryTableForm.controls;
    for (const name in controls2) {
      if (controls2[name].invalid) {
        console.log(name);
      }
    }
  }

  canEdit(): boolean {
    return !this.repairItem?.customer_billing_guid;
  }

  isDisabled(): boolean {
    return false;
    const validStatus = ['COMPLETED', 'QC_COMPLETED', 'JOB_IN_PROGRESS']
    return validStatus.includes(this.repairItem?.status_cv!) || this.isAutoApproveSteaming(this.repairItem);
  }

  isAutoApproveSteaming(row: any) {
    return BusinessLogicUtil.isAutoApproveSteaming(row);
  }

  isApproved() {
    const validStatus = ['JOB_IN_PROGRESS', 'ASSIGNED', 'PARTIAL_ASSIGNED', 'APPROVED', 'COMPLETED', 'QC_COMPLETED']
    return validStatus.includes(this.repairItem?.status_cv!);
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
    return this.repList.reduce((acc, row) => {
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

  toggleApprovePart(event: Event, part: ResiduePartItem) {
    event.stopPropagation(); // Prevents click event from bubbling up
    if (this.isDisabled()) return;
    part.approve_part = part.approve_part != null ? !part.approve_part : false;
    this.calculateCost(this.summaryTableForm)
    this.calculateCostEst(this.summaryTableForm)
  }

  displayUnitTypeFn(cc: any): string {
    return cc?.description!;
  }

  getGroupNameCodeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.data.populateData.groupNameCvList);
  }

  getSubgroupNameCodeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.data.populateData.subgroupNameCvList);
  }

  displayDamageRepairCode(damageRepair: any[], filterCode: number): string {
    return damageRepair?.filter((x: any) => x.code_type === filterCode && (!x.delete_dt && x.action !== 'cancel') || (x.delete_dt && x.action === 'edit')).map(item => {
      return item.code_cv;
    }).join('/');
  }

  getDamageCodeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.data.populateData.damageCodeCvList);
  }

  getRepairCodeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.data.populateData.repairCodeCvList);
  }

  displayDamageRepairCodeDescription(damageRepair: any[], filterCode: number): string {
    const concate = damageRepair?.filter((x: any) => x.code_type === filterCode && (!x.delete_dt && x.action !== 'cancel') || (x.delete_dt && x.action === 'edit')).map(item => {
      const codeCv = item.code_cv;
      const description = `(${codeCv})` + (item.code_type == 0 ? this.getDamageCodeDescription(codeCv) : this.getRepairCodeDescription(codeCv));
      return description ? description : '';
    }).join('\n');

    return concate;
  }

  updateData(form: UntypedFormGroup, newData: RepairPartItem[] | undefined): void {
    if (newData?.length) {
      newData = newData.map((row) => ({
        ...row,
        approve_qty: this.displayApproveQty(row),
        approve_hour: this.displayApproveHour(row),
        approve_cost: this.displayApproveCost(row),
        tariff_repair: {
          ...row.tariff_repair,
          sequence: this.getGroupSeq(row.tariff_repair?.group_name_cv)
        }
      }));

      newData = this.repairPartDS.sortAndGroupByGroupName(newData);
      // newData = [...this.sortREP(newData)];

      this.repList = newData.map((row, index) => ({
        ...row,
        index: index
      }));
      this.calculateCost(form);
      this.calculateCostEst(form);
    }
  }

  selectOwner(event: Event, row: RepairPartItem) {
    event.stopPropagation();
    row.owner = !(row.owner || false);
    this.calculateCost(this.summaryTableForm);
    this.calculateCostEst(this.summaryTableForm);
  }

  onOwnerToggle(event: MatCheckboxChange): void {
    this.isOwner = event.checked;
    this.isOwnerChanged();
  }

  getGroupSeq(codeVal: string | undefined): number | undefined {
    const gncv = this.data.populateData.groupNameCvList.filter((x: any) => x.code_val === codeVal);
    if (gncv.length) {
      return gncv[0].sequence;
    }
    return -1;
  }

  displayApproveQty(rep: RepairPartItem) {
    return (rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_qty !== null && rep.approve_qty !== undefined ? rep.approve_qty : rep.quantity) : 0;
  }

  displayApproveHour(rep: RepairPartItem) {
    return (rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_hour !== null && rep.approve_hour !== undefined ? rep.approve_hour : rep.hour) : 0;
  }

  displayApproveCost(rep: RepairPartItem) {
    return Utility.convertNumber((rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_cost !== null && rep.approve_cost !== undefined ? rep.approve_cost : rep.material_cost) : 0, 2);
  }

  checkApprovePart() {
    this.canApproveFlag = this.repList.some(rep => rep.approve_part || (rep.approve_part === null && !this.repairPartDS.is4X(rep.rp_damage_repair)));
  }

  canApprove() {
    return this.canApproveFlag && (this.repairDS.canApproveOverwrite(this.repairItem))
  }

  canToggleOwner() {
    return !this.sotDS.isCustomerSameAsOwner(this.sot) && this.repairDS.canAmend(this.repairItem);
  }

  isDisabledPart(repairPart: RepairPartItem): boolean {
    const packageCheck = (!this.modulePackageService.isGrowthPackage() && !this.modulePackageService.isCustomizedPackage());
    const repairCheck = !this.repairDS.canApproveOverwrite(this.repairItem);
    const repairPartCheck = (this.repairPartDS.is4X(repairPart?.rp_damage_repair) ?? true) || !(repairPart?.approve_part ?? true);
    // const isBilled = (!this.repairItem?.customer_billing_guid && !this.repairItem?.customer_billing_guid);
    // return (packageCheck) || (repairCheck || repairPartCheck || isBilled)
    return (packageCheck) || (repairCheck || repairPartCheck)
  }

  calculateCost(form: UntypedFormGroup) {
    const ownerList = this.repList.filter(item => item.owner && !item.delete_dt && (item.approve_part ?? true));
    const lesseeList = this.repList.filter(item => !item.owner && !item.delete_dt && (item.approve_part ?? true));
    const labourDiscount = form?.get('labour_cost_discount')?.value;
    const matDiscount = form?.get('material_cost_discount')?.value;

    let total_hour = 0;
    let total_labour_cost = 0;
    let total_mat_cost = 0;
    let total_cost = 0;
    let discount_labour_cost = 0;
    let discount_mat_cost = 0;
    let net_cost = 0;

    const totalOwner = this.repairDS.getTotal(ownerList);
    const total_owner_hour = totalOwner.hour;
    const total_owner_labour_cost = this.repairDS.getTotalLabourCost(total_owner_hour, this.getLabourCost());
    const total_owner_mat_cost = totalOwner.total_mat_cost;
    const total_owner_cost = this.repairDS.getTotalCost(total_owner_labour_cost, total_owner_mat_cost);
    const discount_labour_owner_cost = this.repairDS.getDiscountCost(labourDiscount, total_owner_labour_cost);
    const discount_mat_owner_cost = this.repairDS.getDiscountCost(matDiscount, total_owner_mat_cost);
    const net_owner_cost = this.repairDS.getNetCost(total_owner_cost, discount_labour_owner_cost, discount_mat_owner_cost);

    form?.get('total_owner_hour')?.setValue(this.parse2Decimal(total_owner_hour));
    form?.get('total_owner_labour_cost')?.setValue(this.parse2Decimal(total_owner_labour_cost));
    form?.get('total_owner_mat_cost')?.setValue(this.parse2Decimal(total_owner_mat_cost));
    form?.get('total_owner_cost')?.setValue(this.parse2Decimal(total_owner_cost));
    form?.get('discount_labour_owner_cost')?.setValue(this.parse2Decimal(discount_labour_owner_cost));
    form?.get('discount_mat_owner_cost')?.setValue(this.parse2Decimal(discount_mat_owner_cost));
    form?.get('net_owner_cost')?.setValue(this.parse2Decimal(net_owner_cost));

    total_hour += total_owner_hour;
    total_labour_cost += total_owner_labour_cost;
    total_mat_cost += total_owner_mat_cost;
    total_cost += total_owner_cost;
    discount_labour_cost += discount_labour_owner_cost;
    discount_mat_cost += discount_mat_owner_cost;
    net_cost += net_owner_cost;

    const totalLessee = this.repairDS.getTotal(lesseeList);
    const total_lessee_hour = totalLessee.hour;
    const total_lessee_labour_cost = this.repairDS.getTotalLabourCost(total_lessee_hour, this.getLabourCost());
    const total_lessee_mat_cost = totalLessee.total_mat_cost;
    const total_lessee_cost = this.repairDS.getTotalCost(total_lessee_labour_cost, total_lessee_mat_cost);
    const discount_labour_lessee_cost = this.repairDS.getDiscountCost(labourDiscount, total_lessee_labour_cost);
    const discount_mat_lessee_cost = this.repairDS.getDiscountCost(matDiscount, total_lessee_mat_cost);
    const net_lessee_cost = this.repairDS.getNetCost(total_lessee_cost, discount_labour_lessee_cost, discount_mat_lessee_cost);

    form?.get('total_lessee_hour')?.setValue(this.parse2Decimal(total_lessee_hour));
    form?.get('total_lessee_labour_cost')?.setValue(this.parse2Decimal(total_lessee_labour_cost));
    form?.get('total_lessee_mat_cost')?.setValue(this.parse2Decimal(total_lessee_mat_cost));
    form?.get('total_lessee_cost')?.setValue(this.parse2Decimal(total_lessee_cost));
    form?.get('discount_labour_lessee_cost')?.setValue(this.parse2Decimal(discount_labour_lessee_cost));
    form?.get('discount_mat_lessee_cost')?.setValue(this.parse2Decimal(discount_mat_lessee_cost));
    form?.get('net_lessee_cost')?.setValue(this.parse2Decimal(net_lessee_cost));

    total_hour += total_lessee_hour;
    total_labour_cost += total_lessee_labour_cost;
    total_mat_cost += total_lessee_mat_cost;
    total_cost += total_lessee_cost;
    discount_labour_cost += discount_labour_lessee_cost;
    discount_mat_cost += discount_mat_lessee_cost;
    net_cost += net_lessee_cost;

    form?.get('total_hour')?.setValue(this.parse2Decimal(total_hour));
    form?.get('total_labour_cost')?.setValue(this.parse2Decimal(total_labour_cost));
    form?.get('total_mat_cost')?.setValue(this.parse2Decimal(total_mat_cost));
    form?.get('total_cost')?.setValue(this.parse2Decimal(total_cost));
    form?.get('discount_labour_cost')?.setValue(this.parse2Decimal(discount_labour_cost));
    form?.get('discount_mat_cost')?.setValue(this.parse2Decimal(discount_mat_cost));
    form?.get('net_cost')?.setValue(this.parse2Decimal(net_cost));

    this.checkApprovePart();
  }

  calculateCostEst(form: UntypedFormGroup) {
    const ownerList = this.repList.filter(item => item.owner && !item.delete_dt);
    const lesseeList = this.repList.filter(item => !item.owner && !item.delete_dt);
    const labourDiscount = form?.get('labour_cost_discount')?.value;
    const matDiscount = form?.get('material_cost_discount')?.value;

    let total_hour = 0;
    let total_labour_cost = 0;
    let total_mat_cost = 0;
    let total_cost = 0;
    let discount_labour_cost = 0;
    let discount_mat_cost = 0;
    let net_cost = 0;

    const totalOwner = this.repairDS.getTotalEst(ownerList);
    const total_owner_hour = totalOwner.hour;
    const total_owner_labour_cost = this.repairDS.getTotalLabourCost(total_owner_hour, this.getLabourCost());
    const total_owner_mat_cost = totalOwner.total_mat_cost;
    const total_owner_cost = this.repairDS.getTotalCost(total_owner_labour_cost, total_owner_mat_cost);
    const discount_labour_owner_cost = this.repairDS.getDiscountCost(labourDiscount, total_owner_labour_cost);
    const discount_mat_owner_cost = this.repairDS.getDiscountCost(matDiscount, total_owner_mat_cost);
    const net_owner_cost = this.repairDS.getNetCost(total_owner_cost, discount_labour_owner_cost, discount_mat_owner_cost);

    form?.get('total_owner_hour_est')?.setValue(this.parse2Decimal(total_owner_hour));
    form?.get('total_owner_labour_cost_est')?.setValue(this.parse2Decimal(total_owner_labour_cost));
    form?.get('total_owner_mat_cost_est')?.setValue(this.parse2Decimal(total_owner_mat_cost));
    form?.get('total_owner_cost_est')?.setValue(this.parse2Decimal(total_owner_cost));
    form?.get('discount_labour_owner_cost_est')?.setValue(this.parse2Decimal(discount_labour_owner_cost));
    form?.get('discount_mat_owner_cost_est')?.setValue(this.parse2Decimal(discount_mat_owner_cost));
    form?.get('net_owner_cost_est')?.setValue(this.parse2Decimal(net_owner_cost));

    total_hour += total_owner_hour;
    total_labour_cost += total_owner_labour_cost;
    total_mat_cost += total_owner_mat_cost;
    total_cost += total_owner_cost;
    discount_labour_cost += discount_labour_owner_cost;
    discount_mat_cost += discount_mat_owner_cost;
    net_cost += net_owner_cost;

    const totalLessee = this.repairDS.getTotal(lesseeList);
    const total_lessee_hour = totalLessee.hour;
    const total_lessee_labour_cost = this.repairDS.getTotalLabourCost(total_lessee_hour, this.getLabourCost());
    const total_lessee_mat_cost = totalLessee.total_mat_cost;
    const total_lessee_cost = this.repairDS.getTotalCost(total_lessee_labour_cost, total_lessee_mat_cost);
    const discount_labour_lessee_cost = this.repairDS.getDiscountCost(labourDiscount, total_lessee_labour_cost);
    const discount_mat_lessee_cost = this.repairDS.getDiscountCost(matDiscount, total_lessee_mat_cost);
    const net_lessee_cost = this.repairDS.getNetCost(total_lessee_cost, discount_labour_lessee_cost, discount_mat_lessee_cost);

    form?.get('total_lessee_hour_est')?.setValue(this.parse2Decimal(total_lessee_hour));
    form?.get('total_lessee_labour_cost_est')?.setValue(this.parse2Decimal(total_lessee_labour_cost));
    form?.get('total_lessee_mat_cost_est')?.setValue(this.parse2Decimal(total_lessee_mat_cost));
    form?.get('total_lessee_cost_est')?.setValue(this.parse2Decimal(total_lessee_cost));
    form?.get('discount_labour_lessee_cost_est')?.setValue(this.parse2Decimal(discount_labour_lessee_cost));
    form?.get('discount_mat_lessee_cost_est')?.setValue(this.parse2Decimal(discount_mat_lessee_cost));
    form?.get('net_lessee_cost_est')?.setValue(this.parse2Decimal(net_lessee_cost));

    total_hour += total_lessee_hour;
    total_labour_cost += total_lessee_labour_cost;
    total_mat_cost += total_lessee_mat_cost;
    total_cost += total_lessee_cost;
    discount_labour_cost += discount_labour_lessee_cost;
    discount_mat_cost += discount_mat_lessee_cost;
    net_cost += net_lessee_cost;

    form?.get('total_hour_est')?.setValue(this.parse2Decimal(total_hour));
    form?.get('total_labour_cost_est')?.setValue(this.parse2Decimal(total_labour_cost));
    form?.get('total_mat_cost_est')?.setValue(this.parse2Decimal(total_mat_cost));
    form?.get('total_cost_est')?.setValue(this.parse2Decimal(total_cost));
    form?.get('discount_labour_cost_est')?.setValue(this.parse2Decimal(discount_labour_cost));
    form?.get('discount_mat_cost_est')?.setValue(this.parse2Decimal(discount_mat_cost));
    form?.get('net_cost_est')?.setValue(this.parse2Decimal(net_cost));
  }

  isOwnerChanged(): void {
    if (this.isOwner) {
      this.displayedColumns = [
        'seq',
        'subgroup_name_cv',
        'damange',
        'repair',
        'description',
        'quantity',
        'hour',
        'price',
        'material',
        'isOwner',
        'approve_part',
        'approve_qty',
        'approve_hour',
        'approve_cost'
      ];
    } else {
      this.displayedColumns = [
        'seq',
        'subgroup_name_cv',
        'damange',
        'repair',
        'description',
        'quantity',
        'hour',
        'price',
        'material',
        'approve_part',
        'approve_qty',
        'approve_hour',
        'approve_cost'
      ];
    }
  }

  getLabourCost() {
    return this.repairItem?.labour_cost;
  }

  shouldDisplay() {
    return this.modulePackageService.isGrowthPackage() ||
      this.modulePackageService.isCustomizedPackage();
  }
}
