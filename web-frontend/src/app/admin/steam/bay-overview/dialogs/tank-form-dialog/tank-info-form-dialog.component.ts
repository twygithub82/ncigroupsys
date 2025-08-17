import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateDS, InGateItem } from 'app/data-sources/in-gate';
import { InGateSurveyDS, InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { JobOrderItem } from 'app/data-sources/job-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TankInfoDS, TankInfoItem } from 'app/data-sources/tank-info';
import { TransferDS, TransferItem } from 'app/data-sources/transfer';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';


export interface DialogData {
  action?: string;
  selectedItem?: StoringOrderTankItem;
  translatedLangText?: any;
  dialogTitle?: string;
}

@Component({
  selector: 'app-steam-tank-info-form-dialog',
  templateUrl: './tank-info-form-dialog.component.html',
  styleUrls: ['./tank-info-form-dialog.component.scss'],
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
    MatTableModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
})
export class TankInfoFormDialogComponent extends UnsubscribeOnDestroyAdapter {
  displayedColumns = [
    'start_time',
    'stop_time',
    'duration'
  ];

  action: string;
  // index: number;
  dialogTitle: string;

  transferDS:TransferDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  sotDS: StoringOrderTankDS;
  tiDS: TankInfoDS;
   igsDS: InGateSurveyDS;
  partNameControl: UntypedFormControl;
  partNameList?: string[];
  partNameFilteredList?: string[];
  dimensionList?: string[];
  lengthList?: any[];
  valueChangesDisabled: boolean = false;
  timeTableList: JobOrderItem[] = [];
  translatedLangText: any = {}
  testTypeCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  testClassCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  cleanStatusCvList: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];
  sotItem?: StoringOrderTankItem;
  transferList: TransferItem[] = [];
  ig?:InGateItem;
  igs?: InGateSurveyItem;
  tiItem?:TankInfoItem;
  cvDS: CodeValuesDS;
  last_test_desc?: string = "";
  next_test_desc?: string = "";
  
  constructor(
    public dialogRef: MatDialogRef<TankInfoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    super();
    // Set the defaults
    this.cvDS = new CodeValuesDS(this.apollo);

    this.action = data.action!;
    this.sotItem = data.selectedItem!;
    this.dialogTitle = `${data.dialogTitle}`;
    this.translatedLangText = data.translatedLangText;
   
    //this.timeTableList = data.item ?? [];
    // this.index = data.index;
    this.igsDS = new InGateSurveyDS(this.apollo);
    this.transferDS= new TransferDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.tiDS=new TankInfoDS(this.apollo);
    this.partNameControl = new UntypedFormControl('', [Validators.required]);
    this.initializeValueChange();
    this.loadData();
    // this.patchForm();
  this.initializePartNameValueChange();
  
  this.loadDataHandling_transfer(this.sotItem?.guid!);
  this.loadDataHandling_ig(this.sotItem?.guid!);
  this.loadDataHandling_ti(this.sotItem?.guid!);
  this.loadDataHandling_igs(this.sotItem?.guid!);
  
  }

  loadData() {
    const queries = [
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'cleanStatusCv', codeValType: 'CLEAN_STATUS' },
      { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
      { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
      { alias: 'manufacturerCv', codeValType: 'MANUFACTURER' },
      { alias: 'claddingCv', codeValType: 'CLADDING' },
      { alias: 'maxGrossWeightCv', codeValType: 'MAX_WEIGHT' },
      { alias: 'tankHeightCv', codeValType: 'TANK_HEIGHT' },
      { alias: 'walkwayCv', codeValType: 'WALKWAY' },
      { alias: 'airlineCv', codeValType: 'AIRLINE_VALVE' },
      { alias: 'airlineConnCv', codeValType: 'AIRLINE_VALVE_CONN' },
      { alias: 'disCompCv', codeValType: 'DIS_COMP' },
      { alias: 'disValveCv', codeValType: 'DIS_VALVE' },
      { alias: 'disValveSpecCv', codeValType: 'DIS_VALVE_SPEC' },
      { alias: 'disTypeCv', codeValType: 'DISCHARGE_TYPE' },
      { alias: 'footValveCv', codeValType: 'FOOT_VALVE' },
      { alias: 'manlidCoverCv', codeValType: 'MANLID_COVER' },
      { alias: 'manlidSealCv', codeValType: 'MANLID_SEAL' },
      { alias: 'pvSpecCv', codeValType: 'PV_SPEC' },
      { alias: 'pvTypeCv', codeValType: 'PV_TYPE' },
      { alias: 'thermometerCv', codeValType: 'THERMOMETER' },
      { alias: 'valveBrandCv', codeValType: 'VALVE_BRAND' },
      { alias: 'tankSideCv', codeValType: 'TANK_SIDE' },
      { alias: 'storageCalCv', codeValType: 'STORAGE_CAL' },
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'bookingStatusCv', codeValType: 'BOOKING_STATUS' },
      { alias: 'bookingTypeCv', codeValType: 'BOOKING_TYPE' },
      { alias: 'repairOptionCv', codeValType: 'REPAIR_OPTION' },
      { alias: 'yardCv', codeValType: 'YARD' },
      { alias: 'yesnoCv', codeValType: 'YES_NO' },
      { alias: 'surveyTypeCv', codeValType: 'SURVEY_TYPE' },
      { alias: 'unitTypeCv', codeValType: 'UNIT_TYPE' },
      { alias: 'damageCodeCv', codeValType: 'DAMAGE_CODE' },
      { alias: 'repairCodeCv', codeValType: 'REPAIR_CODE' },
      { alias: 'groupNameCv', codeValType: 'GROUP_NAME' },
    ];
    this.cvDS.getCodeValuesByType(queries);

    // this.cvDS.connectAlias('groupNameCv').subscribe(data => {
    //   this.groupNameCvList = data;
    //   this.updateData(this.repList);
    //   const subqueries: any[] = [];
    //   data.map(d => {
    //     if (d.child_code) {
    //       let q = { alias: d.child_code, codeValType: d.child_code };
    //       const hasMatch = subqueries.some(subquery => subquery.codeValType === d.child_code);
    //       if (!hasMatch) {
    //         subqueries.push(q);
    //       }
    //     }
    //   });
    //   if (subqueries.length > 0) {
    //     this.cvDS?.getCodeValuesByType(subqueries);
    //     subqueries.map(s => {
    //       this.cvDS?.connectAlias(s.alias).subscribe(data => {
    //         this.subgroupNameCvList.push(...data);
    //       });
    //     });
    //   }
    // });
    // this.cvDS.connectAlias('yesnoCv').subscribe(data => {
    //   this.yesnoCvList = data;
    // });
    // this.cvDS.connectAlias('soTankStatusCv').subscribe(data => {
    //   this.soTankStatusCvList = data;
    // });
  this.cvDS.connectAlias('cleanStatusCv').subscribe(data => {
      this.cleanStatusCvList = addDefaultSelectOption(data, "Unknown");
    });
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = data;
    });
     this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data;
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
    if (this.sotItem) {
      //  var where:any={};
      //  where.guid={eq:this.sotItem.guid};
      this.sotDS.getStoringOrderTanksForOtherSurveyByID(this.sotItem.guid).subscribe(result => {

        if (result.length > 0) {
          //let sotExist = this.sotItem;
          result[0].tariff_cleaning = this.sotItem?.tariff_cleaning;
          this.sotItem = result[0];
        }

      });
    }
  }
  patchForm() { }

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

  initializePartNameValueChange() {
  }

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  displayTimeTaken(stop_time: number | undefined, start_time: number | undefined): string {
    return Utility.getDisplayTimeTaken(stop_time, start_time);
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  // getLastTest(igs: InGateSurveyItem | undefined): string | undefined {
  //   if (igs) {
  //     const test_type = igs.last_test_cv;
  //     const test_class = igs.test_class_cv;
  //     const testDt = igs.test_dt as number;
  //     return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(testDt, 'MM/YYYY') + " - " + this.getTestClassDescription(test_class);
  //   }
  //   return "";
  // }

  // getNextTest(igs: InGateSurveyItem | undefined): string | undefined {
  //   if (igs && igs.next_test_cv && igs.test_dt) {
  //     const test_type = igs.last_test_cv;
  //     const yearCount = BusinessLogicUtil.getNextTestYear(test_type);
  //     const resultDt = Utility.addYearsToEpoch(igs.test_dt as number, yearCount);
  //     return this.getTestTypeDescription(igs.next_test_cv) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
  //   }
  //   return "";
  // }

  getTestTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.testTypeCvList);
  }

  getTestClassDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.testClassCvList);
  }


  displayTankPurpose(sot: StoringOrderTankItem) {
    return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this));
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }
    getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
  }
   getCleanStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.cleanStatusCvList);
  }

   getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yardCvList);
  }
    getLastLocation() {
    return BusinessLogicUtil.getLastLocation(this.sotItem, this.ig, this?.tiItem, this.transferList)
  }

   loadDataHandling_transfer(sot_guid: string) {
    this.subs.sink = this.transferDS.getTransferBySotIDForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`transfer: `, data);
        this.transferList = data;
      }
    });
  }

   loadDataHandling_ig(sot_guid: string) {
    this.subs.sink = this.igDS.getInGateByIDForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`ig: `, data)
        this.ig = data[0];
      }
    });
  }
   loadDataHandling_ti(tank_no: string) {
    this.tiDS.getTankInfoForMovement(tank_no).subscribe(data => {
      console.log(`tankInfo: `, data)
      this.tiItem = data[0];
      this.last_test_desc = this.getLastTest();
      this.next_test_desc = this.getNextTest();
    });
  }

  loadDataHandling_igs(sot_guid: string) {
    this.subs.sink = this.igsDS.getInGateSurveyByIDForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`igs: `, data)
        this.igs = data[0];
        this.last_test_desc = this.getLastTest();
        this.next_test_desc = this.getNextTest();
      }
    });
  }

  
  getLastTest(): string | undefined {
    return this.getLastTestTI() || this.getLastTestIGS();
  }

  getNextTest(): string | undefined {
    return this.getNextTestTI() || this.getNextTestIGS();
  }

  getLastTestIGS(): string | undefined {
    if (!this.testTypeCvList?.length || !this.testClassCvList?.length || !this.igs) return "";

    const igs = this.igs
    if (igs && igs.last_test_cv && igs.test_class_cv && igs.test_dt) {
      const test_type = igs.last_test_cv;
      const test_class = igs.test_class_cv;
      return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(igs.test_dt as number, 'MM/YYYY') + " - " + test_class;
    }
    return "";
  }

  getLastTestTI(): string | undefined {
    if (!this.testTypeCvList?.length || !this.testClassCvList?.length || !this.tiItem) return "";

    if (this.tiItem.last_test_cv && this.tiItem.test_class_cv && this.tiItem.test_dt) {
      const test_type = this.tiItem.last_test_cv;
      const test_class = this.tiItem.test_class_cv;
      return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(this.tiItem.test_dt as number, 'MM/YYYY') + " - " + test_class;
    }
    return "";
  }

  getNextTestIGS(): string | undefined {
    if (!this.testTypeCvList?.length || !this.igs) return "";

    const igs = this.igs
    if (!igs?.test_dt || !igs?.last_test_cv) return "-";
    const test_type = igs?.last_test_cv;
    const match = test_type?.match(/^[0-9]*\.?[0-9]+/);
    const yearCount = BusinessLogicUtil.getNextTestYear(test_type);
    const resultDt = Utility.addYearsToEpoch(igs?.test_dt as number, yearCount) as number;
    const output = this.getTestTypeDescription(igs?.next_test_cv) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
    return output;
  }

   getNextTestTI(): string | undefined {
    if (!this.testTypeCvList?.length || !this.tiItem) return "";

    if (!this.tiItem?.test_dt || !this.tiItem?.last_test_cv) return "-";
    const test_type = this.tiItem?.last_test_cv;
    const match = test_type?.match(/^[0-9]*\.?[0-9]+/);
    const yearCount = BusinessLogicUtil.getNextTestYear(test_type);
    const resultDt = Utility.addYearsToEpoch(this.tiItem?.test_dt as number, yearCount) as number;
    const output = this.getTestTypeDescription(this.tiItem?.next_test_cv) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
    return output;
  }
}
