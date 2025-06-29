import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { ModulePackageService } from 'app/services/module-package.service';
import { Utility } from 'app/utilities/utility';
import { CleanMonthlyAdminReportComponent } from './clean-monthly/clean-monthly.component';
import { CustomerMonthlyAdminReportComponent } from './customer-monthly/customer-monthly.component';
import { RepairMonthlyAdminReportComponent } from './repair-monthly/repair-monthly.component';
import { ResidueMonthlyAdminReportComponent } from './residue-monthly/residue-monthly.component';
import { SteamMonthlyAdminReportComponent } from './steam-monthly/steam-monthly.component';

@Component({
  selector: 'app-main-monthly',
  standalone: true,
  templateUrl: './main-monthly.component.html',
  styleUrl: './main-monthly.component.scss',
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
    SteamMonthlyAdminReportComponent,
    ResidueMonthlyAdminReportComponent,
    RepairMonthlyAdminReportComponent,
    CleanMonthlyAdminReportComponent,
    CustomerMonthlyAdminReportComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class MainMonthlyComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  pageTitle = 'MENUITEMS.ADMIN-REPORTS.LIST.MONTHLY-REPORTS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.ADMIN-REPORTS.TEXT', route: '/admin/admin-reports/main-monthly' }
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
    CLEANING: "COMMON-FORM.CLEANING",
    CLEANING_BILLING: "MENUITEMS.BILLING.LIST.CLEANING-BILL",
    STEAM_REPORT: 'MENUITEMS.TARIFF.LIST.TARIFF-STEAM',
    RESIDUE_REPORT: 'MENUITEMS.TARIFF.LIST.TARIFF-RESIDUE',
    REPAIR_REPORT: 'MENUITEMS.TARIFF.LIST.TARIFF-REPAIR',
    CLEAN_REPORT: 'MENUITEMS.TARIFF.LIST.TARIFF-CLEANING',
    CUSTOMER_REPORT: 'COMMON-FORM.CUSTOMER'
  }

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService

  ) {
    super();
    this.translateLangText();
  }

  ngOnInit() {
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

  tabConfig = [
    {
      label: this.translatedLangText.CLEAN_REPORT,
      component: 'app-clean-monthly',
      modulePackage: ['starter', 'growth', 'customized']
    },
    {
      label: this.translatedLangText.REPAIR_REPORT,
      component: 'app-repair-monthly',
      modulePackage: ['starter', 'growth', 'customized']
    },
    {
      label: this.translatedLangText.STEAM_REPORT,
      component: 'app-steam-monthly',
      modulePackage: ['growth', 'customized']
    },
    {
      label: this.translatedLangText.RESIDUE_REPORT,
      component: 'app-residue-monthly',
      modulePackage: ['growth', 'customized']
    },
    {
      label: this.translatedLangText.CUSTOMER_REPORT,
      component: 'app-customer-monthly',
      modulePackage: ['starter', 'growth', 'customized']
    }
  ];

  get allowedTabs() {
    return this.tabConfig.filter(tab =>
      tab.modulePackage.includes(this.modulePackageService.getModulePackage())
    );
  }

  @ViewChild('steamAdminReport') steamAdminReport!: SteamMonthlyAdminReportComponent;
  @ViewChild('residueAdminReport') residueAdminReport!: ResidueMonthlyAdminReportComponent;
  @ViewChild('repairAdminReport') repairAdminReport!: RepairMonthlyAdminReportComponent;
  @ViewChild('customerAdminReport') customerAdminReport!: CustomerMonthlyAdminReportComponent;
  @ViewChild('cleanAdminReport') cleanAdminReport!: CleanMonthlyAdminReportComponent;

  onTabSelected(event: MatTabChangeEvent): void {
    console.log(`Selected Index: ${event.index}, Tab Label: ${event.tab.textLabel}`);
    switch (event.index) {
      case 0:
        this.steamAdminReport?.onTabFocused(); break;
      case 1:
        this.residueAdminReport?.onTabFocused(); break;
      case 2:
        this.repairAdminReport?.onTabFocused(); break;
      case 3:
        this.cleanAdminReport?.onTabFocused(); break;
      case 4:
        this.customerAdminReport?.onTabFocused(); break;

    }
  }
}