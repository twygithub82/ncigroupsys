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
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { TariffRepairDS, TariffRepairItem } from 'app/data-sources/tariff-repair';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairDS, RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { Direction } from '@angular/cdk/bidi';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { JobOrderItem } from 'app/data-sources/job-order';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';


export interface DialogData {
  action?: string;
  selectedItem?: StoringOrderTankItem;
  translatedLangText?: any;
  dialogTitle?:string;
}

@Component({
  selector: 'app-cleaning-tank-info-form-dialog',
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

  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  sotDS:StoringOrderTankDS;
  partNameControl: UntypedFormControl;
  partNameList?: string[];
  partNameFilteredList?: string[];
  dimensionList?: string[];
  lengthList?: any[];
  valueChangesDisabled: boolean = false;
  timeTableList: JobOrderItem[] = [];
  translatedLangText: any = {}
  testTypeCvList:CodeValuesItem[]=[];
  purposeOptionCvList:CodeValuesItem[]=[];
  testClassCvList:CodeValuesItem[]=[];
  sotItem?:StoringOrderTankItem;
  cvDS: CodeValuesDS;
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
    this.sotItem =data.selectedItem!;
    this.dialogTitle = `${data.dialogTitle}`;
    this.translatedLangText=data.translatedLangText;
    //this.timeTableList = data.item ?? [];
   // this.index = data.index;
    this.ccDS= new CustomerCompanyDS(this.apollo);
    this.igDS= new InGateDS(this.apollo);
    this.sotDS=new StoringOrderTankDS(this.apollo);
    this.partNameControl = new UntypedFormControl('', [Validators.required]);
    this.initializeValueChange();
    this.loadData();
    this.patchForm();
    this.initializePartNameValueChange();
  }

  loadData(){
    const queries = [
      // { alias: 'groupNameCv', codeValType: 'GROUP_NAME' },
      // { alias: 'yesnoCv', codeValType: 'YES_NO' },
      // { alias: 'soTankStatusCv', codeValType: 'SO_TANK_STATUS' },
       { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
       { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
      { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
      // { alias: 'partLocationCv', codeValType: 'PART_LOCATION' },
      // { alias: 'damageCodeCv', codeValType: 'DAMAGE_CODE' },
      // { alias: 'repairCodeCv', codeValType: 'REPAIR_CODE' },
      // { alias: 'unitTypeCv', codeValType: 'UNIT_TYPE' },
      // { alias: 'jobStatusCv', codeValType: 'JOB_STATUS' },
      // { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' }
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
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('testTypeCv').subscribe(data => {
      this.testTypeCvList = data;
    });
    this.cvDS.connectAlias('testClassCv').subscribe(data => {
      this.testClassCvList = data;
    });
    if(this.sotItem)
    {
      //  var where:any={};
      //  where.guid={eq:this.sotItem.guid};
        this.sotDS.getStoringOrderTanksForOtherSurveyByID(this.sotItem.guid).subscribe(result=>{

          if(result.length>0)
          {
            //let sotExist = this.sotItem;
            result[0].tariff_cleaning = this.sotItem?.tariff_cleaning;
            this.sotItem= result[0];
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

  displayTimeTaken(stop_time: number | undefined, start_time: number | undefined): string | undefined {
    if (!stop_time || !start_time) return '';
    const timeTakenMs = stop_time - start_time;

    const hours = Math.floor(timeTakenMs / 3600);
    const minutes = Math.floor((timeTakenMs % 3600) / 60);

    return `${hours} hr ${minutes} min`;
  }

 
    displayDate(input: number | undefined): string | undefined {
      return Utility.convertEpochToDateStr(input);
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
        const match = test_type?.match(/^[0-9]*\.?[0-9]+/);
        const yearCount = parseFloat(match ? match[0] : "0");
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

    
    displayTankPurpose(sot: StoringOrderTankItem) {
      return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this));
    }
  
    getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
      return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
    }
}
