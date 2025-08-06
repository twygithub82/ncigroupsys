import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
//import {CleaningCategoryDS,CleaningCategoryItem} from 'app/data-sources/cleaning-category';
import { TariffDepotItem } from 'app/data-sources/tariff-depot';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ResidueItem } from 'app/data-sources/residue';
import { ResiduePartItem } from 'app/data-sources/residue-part';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { InGateDS } from 'app/data-sources/in-gate';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { MatCardModule } from '@angular/material/card';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { SteamPartItem } from 'app/data-sources/steam-part';
import { ModulePackageService } from 'app/services/module-package.service';
export interface DialogData {
  action?: string;
  selectedValue?: number;
  langText?: any;
  selectedItem: SteamItem;
  nextTestDesc?: string;
  lastTestDesc?: string;

}



@Component({
  selector: 'app-tariff-depot-form-dialog',
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
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    PreventNonNumericDirective,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCardModule
  ],
})
export class SteamEstimateFormDialogComponent_View {
  displayedColumns = [
    'seq',
    'desc',
    'qty',
    'unit_price',
    'hour',
    'cost',
    'approve_part',
    'actions'
  ];

  action: string;
  index?: number;
  dialogTitle?: string;
  deList?: any[] = [];

  plDS: PackageLabourDS;

  sotDS: StoringOrderTankDS;
  igDS: InGateDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  steamDS: SteamDS;
  sotItem?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  unit_type_control = new UntypedFormControl();

  selectedItem: SteamItem;
  startDate = new Date();
  isSteamRepair?: boolean = true;

  lastCargoControl = new UntypedFormControl();
  lastTestDesc: string = '';
  nextTestDesc: string = '';
  groupNameCvList: CodeValuesItem[] = []
  subgroupNameCvList: CodeValuesItem[] = []
  yesnoCvList: CodeValuesItem[] = []
  soTankStatusCvList: CodeValuesItem[] = []
  purposeOptionCvList: CodeValuesItem[] = []
  testTypeCvList: CodeValuesItem[] = []
  testClassCvList: CodeValuesItem[] = []
  partLocationCvList: CodeValuesItem[] = []
  damageCodeCvList: CodeValuesItem[] = []
  repairCodeCvList: CodeValuesItem[] = []
  unitTypeCvList: CodeValuesItem[] = []
  processStatusCvList: CodeValuesItem[] = []
  clean_statusList: CodeValuesItem[] = [];
  isOwner = false;
  labourHour: number = 1;
  packageLabourItem?: PackageLabourItem;
  autosteamCost: string = '';
  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.HEADER',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    SO_NO: 'COMMON-FORM.SO-NO',
    TANK_DETAILS: 'COMMON-FORM.TANK-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    STORAGE: 'COMMON-FORM.STORAGE',
    STEAM: 'COMMON-FORM.STEAM',
    CLEANING: 'COMMON-FORM.CLEANING',
    REPAIR: 'COMMON-FORM.REPAIR',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    REMARKS: 'COMMON-FORM.REMARKS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SAVE: 'COMMON-FORM.SAVE',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    ARE_YOU_SURE_UNO: 'COMMON-FORM.ARE-YOU-SURE-UNDO',
    UNDO: 'COMMON-FORM.UNDO',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
    INVALID: 'COMMON-FORM.INVALID',
    EXISTED: 'COMMON-FORM.EXISTED',
    DUPLICATE: 'COMMON-FORM.DUPLICATE',
    SELECT_ATLEAST_ONE: 'COMMON-FORM.SELECT-ATLEAST-ONE',
    ADD_ATLEAST_ONE: 'COMMON-FORM.ADD-ATLEAST-ONE',
    ROLLBACK_STATUS: 'COMMON-FORM.ROLLBACK-STATUS',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    EXCEEDED: 'COMMON-FORM.EXCEEDED',
    OWNER: 'COMMON-FORM.OWNER',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    LAST_TEST: 'COMMON-FORM.LAST-TEST',
    NEXT_TEST: 'COMMON-FORM.NEXT-TEST',
    GROUP: 'COMMON-FORM.GROUP',
    SUBGROUP: 'COMMON-FORM.SUBGROUP',
    DAMAGE: 'COMMON-FORM.DAMAGE',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    QTY: 'COMMON-FORM.QTY',
    HOUR: 'COMMON-FORM.HOUR',
    PRICE: 'COMMON-FORM.PRICE',
    MATERIAL: 'COMMON-FORM.MATERIAL',
    TEMPLATE: 'COMMON-FORM.TEMPLATE',
    PART_DETAILS: 'COMMON-FORM.PART-DETAILS',
    GROUP_NAME: 'COMMON-FORM.GROUP-NAME',
    SUBGROUP_NAME: 'COMMON-FORM.SUBGROUP-NAME',
    LOCATION: 'COMMON-FORM.LOCATION',
    PART_NAME: 'COMMON-FORM.PART-NAME',
    DIMENSION: 'COMMON-FORM.DIMENSION',
    LENGTH: 'COMMON-FORM.LENGTH',
    PREFIX_DESC: 'COMMON-FORM.PREFIX-DESC',
    MATERIAL_COST: 'COMMON-FORM.MATERIAL-COST$',
    ESTIMATE_DETAILS: 'COMMON-FORM.ESTIMATE-DETAILS',
    ESTIMATE_SUMMARY: 'COMMON-FORM.ESTIMATE-SUMMARY',
    LABOUR: 'COMMON-FORM.LABOUR',
    TOTAL_COST: 'COMMON-FORM.TOTAL-COST',
    LABOUR_DISCOUNT: 'COMMON-FORM.LABOUR-DISCOUNT',
    MATERIAL_DISCOUNT: 'COMMON-FORM.MATERIAL-DISCOUNT',
    NET_COST: 'COMMON-FORM.NET-COST',
    CONVERTED_TO: 'COMMON-FORM.CONVERTED-TO',
    ESTIMATE_NO: 'COMMON-FORM.ESTIMATE-NO',
    SURVEYOR_NAME: 'COMMON-FORM.SURVEYOR-NAME',
    RATE: 'COMMON-FORM.RATE',
    LESSEE: 'COMMON-FORM.LESSEE',
    TOTAL: 'COMMON-FORM.TOTAL',
    PART: 'COMMON-FORM.PART',
    FILTER: 'COMMON-FORM.FILTER',
    DEFAULT: 'COMMON-FORM.DEFAULT',
    COMMENT: 'COMMON-FORM.COMMENT',
    EXPORT: 'COMMON-FORM.EXPORT',
    ADD_ANOTHER: 'COMMON-FORM.ADD-ANOTHER',
    ADD_SUCCESS: 'COMMON-FORM.ADD-SUCCESS',
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    DUPLICATE_PART_DETECTED: 'COMMON-FORM.DUPLICATE-PART-DETECTED',
    BILLING_PROFILE: 'COMMON-FORM.BILLING-PROFILE',
    BILLING_DETAILS: 'COMMON-FORM.BILLING-DETAILS',
    BILLING_TO: 'COMMON-FORM.BILLING-TO',
    BILL_TO: 'COMMON-FORM.BILL-TO',
    BILLING_BRANCH: 'COMMON-FORM.BILLING-BRANCH',
    JOB_REFERENCE: 'COMMON-FORM.JOB-REFERENCE',
    QUANTITY: 'COMMON-FORM.QTY',
    UNIT_PRICE: 'COMMON-FORM.UNIT-PRICE',
    COST: 'COMMON-FORM.COST',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    ROLLBACK_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    APPROVE: 'COMMON-FORM.APPROVE',
    ABORT: 'COMMON-FORM.ABORT',
    DETAILS: 'COMMON-FORM.DETAILS',
    TYPE: 'COMMON-FORM.TYPE',
    STEAMING_ESTIMATE_DETAILS: 'COMMON-FORM.STEAMING-ESTIMATE-DETAILS',
    HOUR_RATE: 'COMMON-FORM.HOUR-RATE',
    FLAT: 'COMMON-FORM.FLAT',
    HOURLY: 'COMMON-FORM.HOURLY',
    BY_HOUR: 'COMMON-FORM.BY-HOUR',
  };

  constructor(
    public dialogRef: MatDialogRef<SteamEstimateFormDialogComponent_View>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private modulePackageService: ModulePackageService,
  ) {
    // Set the defaults
    this.plDS = new PackageLabourDS(this.apollo);
    this.steamDS = new SteamDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.plDS = new PackageLabourDS(this.apollo);
    this.translateLangText();
    this.selectedItem = data.selectedItem;
    this.sotItem = this.selectedItem.storing_order_tank;
    this.deList = this.selectedItem.steaming_part;
    this.lastTestDesc = data.lastTestDesc || '';
    this.nextTestDesc = data.nextTestDesc || '';
    this.action = data.action!;
    this.isSteamRepair = this.steamDS.IsSteamRepair(this.selectedItem);
    this.labourHour = this.selectedItem?.est_hour || 1;
    if (BusinessLogicUtil.isEstimateApproved(this.selectedItem!)) {
      this.labourHour = this.selectedItem?.total_hour || 1;
    }
    this.loadData();
  }

  public loadData() {
    const queries = [
      { alias: 'groupNameCv', codeValType: 'GROUP_NAME' },
      { alias: 'yesnoCv', codeValType: 'YES_NO' },
      { alias: 'soTankStatusCv', codeValType: 'SO_TANK_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
      { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
      { alias: 'partLocationCv', codeValType: 'PART_LOCATION' },
      { alias: 'damageCodeCv', codeValType: 'DAMAGE_CODE' },
      { alias: 'repairCodeCv', codeValType: 'REPAIR_CODE' },
      { alias: 'unitTypeCv', codeValType: 'UNIT_TYPE' },
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
    ];
    this.cvDS.getCodeValuesByType(queries);


    this.cvDS.connectAlias('yesnoCv').subscribe(data => {
      this.yesnoCvList = data;
    });
    this.cvDS.connectAlias('soTankStatusCv').subscribe(data => {
      this.soTankStatusCvList = data;
    });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('testTypeCv').subscribe(data => {
      this.testTypeCvList = data;
    });
    this.cvDS.connectAlias('testClassCv').subscribe(data => {
      this.testClassCvList = data;
    });
    this.cvDS.connectAlias('partLocationCv').subscribe(data => {
      this.partLocationCvList = data;
    });
    this.cvDS.connectAlias('damageCodeCv').subscribe(data => {
      this.damageCodeCvList = data;
    });
    this.cvDS.connectAlias('repairCodeCv').subscribe(data => {
      this.repairCodeCvList = data;
    });
    this.cvDS.connectAlias('unitTypeCv').subscribe(data => {
      this.unitTypeCvList = data;
    });
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });

    var ccGuid = this.sotItem?.storing_order?.customer_company?.guid;
    this.getCustomerLabourPackage(ccGuid!);
  }

  GetTitle() {
    return this.translatedLangText.STEAMING_ESTIMATE_DETAILS;
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {

      console.log('valid');
      this.dialogRef.close(count);
    }
  }

  displayLastUpdated(r: TariffDepotItem) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    const date = new Date(updatedt! * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    // Replace the '/' with '-' to get the required format
    return `${day}/${month}/${year}`;
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

  getFooterBackgroundColor(): string {
    return ''; // 'light-blue';
  }

  IsApproved() {
    const validStatus = ['APPROVED', 'COMPLETED', 'QC_COMPLETED']
    return validStatus.includes(this.selectedItem?.status_cv!);
  }

  parse2Decimal(figure: number | string) {
    return Utility.formatNumberDisplay(figure, this.isAllowViewCost())
  }

  calculateResidueItemCost(residuePart: ResiduePartItem): number {
    let calResCost: number = 0;

    if (this.IsApproved()) {
      calResCost = residuePart.approve_cost! * residuePart.approve_qty!;
    }
    else {
      calResCost = residuePart.cost! * residuePart.quantity!;
    }

    return calResCost;
  }

  IsApprovePart(rep: ResiduePartItem) {
    return rep.approve_part;
  }

  getLastTest(igs: InGateSurveyItem | undefined): string | undefined {
    if (igs) {
      const test_type = igs.last_test_cv;
      const test_class = igs.test_class_cv;
      const testDt = igs.test_dt as number;
      return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(testDt, 'MM/YYYY') + " - " + this.getTestClassDescription(test_class);
    }
    return "";
  }

  getNextTest(igs: InGateSurveyItem | undefined): string | undefined {
    if (igs && igs.next_test_cv && igs.test_dt) {
      const test_type = igs.last_test_cv;
      const yearCount = BusinessLogicUtil.getNextTestYear(test_type);
      const resultDt = Utility.addYearsToEpoch(igs.test_dt as number, yearCount);
      return this.getTestTypeDescription(igs.next_test_cv) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
    }
    return "";
  }

  getTestTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.testTypeCvList);
  }

  getTestClassDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.testClassCvList);
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }
  displayTankPurpose(sot: StoringOrderTankItem) {
    return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this));
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getQtyTable_Text(): string {
    var retval = `${this.translatedLangText.QTY}`;

    return retval;
  }

  getResultTable_HourText(): string {
    var retval = `${this.translatedLangText.HOUR_RATE}`;
    if (this.isSteamRepair) {
      retval = `${this.translatedLangText.HOUR}`;
    }
    return retval;
  }

  getTotalLabourHours(): string {
    let ret = 0;
    if (this.isSteamRepair) {
      if ((this.deList?.length || 0) > 0) {
        this.deList?.map(d => {

          if ((d.delete_dt === undefined || d.delete_dt === null) && (d.steaming_part || d.steaming_part == null)
            && (d.approve_part == null || d.approve_part == true)) {
            if (this.IsApproved()) {
              ret += d.approve_labour;
            }
            else {
              ret += d.labour;
            }
          }

          // ret+=d.labour
        }
        );
      }
      return String(ret);
    }
    else {
      return '';
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

  getCustomerLabourPackage(customer_company_guid: string) {
    const where = {
      and: [
        { customer_company_guid: { eq: customer_company_guid } }
      ]
    }
    this.plDS.getCustomerPackageCost(where).subscribe(data => {
      if (data?.length > 0) {
        this.packageLabourItem = data[0];
      }
    });
  }

  getRateType(): string {
    var flat_rate = this.selectedItem!.flat_rate ?? true;
    return flat_rate ? this.translatedLangText.FLAT : this.translatedLangText.HOURLY;
  }

  calculateSteamItemCost(steamPart: SteamPartItem): number {
    let calResCost: number = 0;

    if (this.isSteamRepair) {
      if (this.IsApproved()) {
        calResCost = steamPart.approve_cost! * steamPart.approve_qty!;
      }
      else {
        calResCost = steamPart.cost! * steamPart.quantity!;
      }
    }

    return this.roundUpCost(calResCost);
  }

  getAutoSteamTotalCost(): String {
    var cost = this.roundUpCost(this.getRate());
    var totalCost = this.parse2Decimal(cost);
    if (!this.selectedItem!.flat_rate ?? true) {
      cost *= this.labourHour;
      totalCost = this.translatedLangText.BY_HOUR;
    }

    return totalCost;
  }

  getRate(): number {
    if (this.isSteamRepair) {
      return this.packageLabourItem?.cost || 0;
    }
    else {
      if (this.deList!.length == 0) return 0;

      if ((this.selectedItem!.flat_rate ?? false)) return this.IsApproved() ? (this.deList![0]!.approve_cost || 0) : (this.deList![0]!.cost || 0);
      else return this.IsApproved() ? (this.deList![0]!.approve_labour || 0) : (this.deList![0]!.labour || 0);
    }
  }

  getTotalLabourCost(): string {
    let ret = 0;
    if (this.deList!.length > 0 && this.isSteamRepair) {
      this.deList!.map(d => {
        if ((d.delete_dt === undefined || d.delete_dt === null) && (d.steaming_part || d.steaming_part == null)
          && (d.approve_part == null || d.approve_part == true)) {
          if (this.IsApproved()) {
            ret += (d.approve_labour * this.packageLabourItem?.cost!);
          }
          else {
            ret += (d.labour * this.packageLabourItem?.cost!);
          }
        }
      }
      );
      return (BusinessLogicUtil.roundUpHour(ret) || 0).toFixed(2);
    }
    else {
      return '-';
    }
  }

  getTotalCost(): number {
    if (this.isSteamRepair) {
      var retval = this.deList!.reduce((acc, row) => {
        if ((row.delete_dt === undefined || row.delete_dt === null) && (row.approve_part == null || row.approve_part == true)) {
          if (this.IsApproved()) {
            return acc + ((row.approve_qty || 0) * (row.approve_cost || 0)) + ((row.approve_labour || 0) * (this.packageLabourItem?.cost || 0));
          }
          else {
            return acc + ((row.quantity || 0) * (row.cost || 0)) + ((row.labour || 0) * (this.packageLabourItem?.cost || 0));
          }
        }
        return acc; // If row is approved, keep the current accumulator value
      }, 0);
      return this.roundUpCost(retval);
    }
    else {
      return this.calculateSteamItemCost(this.deList![0]!);
    }
  }

  isAllowViewCost() {
    return this.modulePackageService.hasFunctions(['EXCLUSIVE_COSTING_VIEW']);
  }

  roundUpCost(cost: any) {
    return BusinessLogicUtil.roundUpCost(cost);
  }
}
