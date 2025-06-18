import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Apollo } from 'apollo-angular';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { Utility } from 'app/utilities/utility';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { CleaningPerformanceReportComponent } from './cleaning/cleaning-performance-report.component';
import { SteamPerformanceReportComponent } from './steam/steam-performance-report.component';
import { SurveyorPerformanceReportComponent } from './surveyor/surveyor-performance-report.component';

@Component({
  selector: 'app-performance-team',
  standalone: true,
  templateUrl: './main-performance.component.html',
  styleUrl: './main-performance.component.scss',
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    TranslateModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatCardModule,
    MatTabsModule,
    SteamPerformanceReportComponent,
    SurveyorPerformanceReportComponent,
    CleaningPerformanceReportComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class MainPerformanceComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  // @ViewChild(BayOverviewComponent) bayOverviewComponent!: BayOverviewComponent;
  // displayedColumns = [
  //   'tank_no',
  //   'customer',
  //   'eir_no',
  //   'eir_dt',
  //   'last_cargo',
  //   'tank_status_cv'
  // ];

  displayedColumnsRepair = [
    'tank_no',
    'customer',
    'eir_no',
    'eir_dt',
    'last_cargo',
    'method',
    'status_cv',
    'actions'
  ];

  displayedColumnsJobOrder = [
    'tank_no',
    'job_order_no',
    'customer',
    'estimate_no',
    'status_cv'
  ];

  pageTitle = 'MENUITEMS.ADMIN-REPORTS.LIST.PERFORMANCE-REPORTS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.ADMIN-REPORTS.TEXT', route: '/admin/admin-reports/main-performance-report' }
  ]

  translatedLangText: any = {};
  langText = {

    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    AMEND: 'COMMON-FORM.AMEND',
    CHANGE_REQUEST: 'COMMON-FORM.CHANGE-REQUEST',
    REPAIR_EST_TAB_TITLE: 'COMMON-FORM.JOB-ALLOCATION',
    JOB_ORDER_TAB_TITLE: 'COMMON-FORM.JOBS',
    JOB_ORDER_NO: 'COMMON-FORM.JOB-ORDER-NO',
    METHOD: "COMMON-FORM.METHOD",
    QC: 'COMMON-FORM.QC',
    BAY_OVERVIEW: "COMMON-FORM.BAY-OVERVIEW",
    CLEANER: "COMMON-FORM.CLEANER",
    STEAM: "COMMON-FORM.STEAM",
    SURVEYOR: "COMMON-FORM.SURVEYOR",
    CLEANING_BILLING: "MENUITEMS.BILLING.LIST.CLEANING-BILL",
    SURVEYOR_PERFORMANCE_REPORT: "COMMON-FORM.SURVEYOR-PERFORMANCE-REPORT",
    CLEANING_PERFORMANCE_REPORT: "COMMON-FORM.CLEANING-PERFORMANCE-REPORT",
    STEAMING_PERFORMANCE_REPORT: "COMMON-FORM.STEAMING-PERFORMANCE-REPORT",

  }

  filterCleanForm?: UntypedFormGroup;
  filterJobOrderForm?: UntypedFormGroup;



  availableProcessStatus: string[] = [
    'APPROVED',
    'JOB_IN_PROGRESS',
    'COMPLETED',
    'ASSIGNED',
    'NO_ACTION',
    'CANCELED'
  ]
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService
  ) {
    super();
    this.translateLangText();
  }
  
  ngOnInit() {
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  displayCleanMethodFn(cm: CleaningMethodItem): string {
    return cm ? `${cm.description} ` : '';
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  stopEventTrigger(event: Event) {
    this.preventDefault(event);
    this.stopPropagation(event);
  }

  stopPropagation(event: Event) {
    event.stopPropagation(); // Stops event propagation
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  @ViewChild('cleanPerformRep') cleanPerformRep!: CleaningPerformanceReportComponent;
  @ViewChild('steamPerformRep') steamPerformRep!: SteamPerformanceReportComponent;
  @ViewChild('surveyorPerformRep') surveyorPerformRep!: SurveyorPerformanceReportComponent;

  onTabSelected(event: MatTabChangeEvent): void {
    console.log(`Selected Index: ${event.index}, Tab Label: ${event.tab.textLabel}`);
    switch (event.index) {
      case 0:
        this.cleanPerformRep?.onTabFocused(); break;
      case 1:
        this.steamPerformRep?.onTabFocused(); break;
      case 2:
        this.surveyorPerformRep?.onTabFocused(); break;
    }
  }
}