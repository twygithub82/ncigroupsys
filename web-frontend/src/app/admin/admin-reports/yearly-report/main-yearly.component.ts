import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
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
import { Utility } from 'app/utilities/utility';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { ModulePackageService } from 'app/services/module-package.service';
import { CleanYearlyAdminReportComponent } from './clean-yearly/clean-yearly.component';
import { RepairYearlyAdminReportComponent } from './repair-yearly/repair-yearly.component';
import { ResidueYearlyAdminReportComponent } from './residue-yearly/residue-yearly.component';
import { SteamYearlyAdminReportComponent } from './steam-yearly/steam-yearly.component';

@Component({
  selector: 'app-main-yearly',
  standalone: true,
  templateUrl: './main-yearly.component.html',
  styleUrl: './main-yearly.component.scss',
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
    SteamYearlyAdminReportComponent,
    ResidueYearlyAdminReportComponent,
    RepairYearlyAdminReportComponent,
    CleanYearlyAdminReportComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class MainYearlyComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  pageTitle = 'MENUITEMS.ADMIN-REPORTS.LIST.YEARLY-REPORTS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.ADMIN-REPORTS.TEXT', route: '/admin/admin-reports/main-yearly' }
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
    STEAM_REPORT: 'COMMON-FORM.STEAM-REPORT',
    RESIDUE_REPORT: 'COMMON-FORM.RESIDUE-REPORT',
    REPAIR_REPORT: 'COMMON-FORM.REPAIR-REPORT',
    CLEAN_REPORT: 'COMMON-FORM.CLEAN-REPORT',
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

  tabConfig = [
    {
      label: this.translatedLangText.CLEAN_REPORT,
      component: 'app-clean-yearly',
      modulePackage: ['starter', 'growth', 'customized']
    },
    {
      label: this.translatedLangText.REPAIR_REPORT,
      component: 'app-repair-yearly',
      modulePackage: ['starter', 'growth', 'customized']
    },
    {
      label: this.translatedLangText.STEAM_REPORT,
      component: 'app-steam-yearly',
      modulePackage: ['growth', 'customized']
    },
    {
      label: this.translatedLangText.RESIDUE_REPORT,
      component: 'app-residue-yearly',
      modulePackage: ['growth', 'customized']
    },
    // {
    //   label: this.translatedLangText.CUSTOMER_REPORT,
    //   component: 'app-customer-yaerly',
    //   modulePackage: ['starter', 'growth', 'customized']
    // }
  ];

  get allowedTabs() {
    return this.tabConfig.filter(tab =>
      tab.modulePackage.includes(this.modulePackageService.getModulePackage())
    );
  }

  @ViewChild('cleanYearlyAdminRep') cleanYearlyAdminRep!: CleanYearlyAdminReportComponent;
  @ViewChild('steamYearlyAdminRep') steamYearlyAdminRep!: SteamYearlyAdminReportComponent;
  @ViewChild('repairYearlyAdminRep') repairYearlyAdminRep!: RepairYearlyAdminReportComponent;
  @ViewChild('residueYearlyAdminRep') residueYearlyAdminRep!: ResidueYearlyAdminReportComponent;

  onTabSelected(event: MatTabChangeEvent): void {
    console.log(`Selected Index: ${event.index}, Tab Label: ${event.tab.textLabel}`);
    switch (event.index) {

      case 0:
        this.steamYearlyAdminRep?.onTabFocused(); break;
      case 1:
        this.residueYearlyAdminRep?.onTabFocused(); break;
      case 2:
        this.repairYearlyAdminRep?.onTabFocused(); break;

      case 3:
        this.cleanYearlyAdminRep?.onTabFocused(); break;
    }
  }
}