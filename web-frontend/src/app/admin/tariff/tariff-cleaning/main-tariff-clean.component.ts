import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { JobOrderItem } from 'app/data-sources/job-order';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ModulePackageService } from 'app/services/module-package.service';
import { Utility } from 'app/utilities/utility';
import { TariffBufferComponent } from './buffer/tariff-buffer.component';
import { TariffCleaningComponent } from './cleaning/tariff-cleaning.component';
import { TariffResidueComponent } from './residue/tariff-residue.component';
@Component({
  selector: 'app-tariff-main-clean',
  standalone: true,
  templateUrl: './main-tariff-clean.component.html',
  styleUrl: './main-tariff-clean.component.scss',
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
    MatTabsModule,
    TariffCleaningComponent,
    TariffBufferComponent,
    TariffResidueComponent
  ]
})
export class MainTariffCleaningComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  pageTitle = 'COMMON-FORM.CLEANING'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.TARIFF.TEXT', route: '/admin/tariff/tariff-cleaning' }
  ]

  translatedLangText: any = {};
  langText = {
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    PART_NAME: 'COMMON-FORM.PART-NAME',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    CANCEL: 'COMMON-FORM.CANCEL',
    CLOSE: 'COMMON-FORM.CLOSE',
    TO_BE_CANCELED: 'COMMON-FORM.TO-BE-CANCELED',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ADD: 'COMMON-FORM.ADD',
    REFRESH: 'COMMON-FORM.REFRESH',
    EXPORT: 'COMMON-FORM.EXPORT',
    REMARKS: 'COMMON-FORM.REMARKS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    ACCEPTED: 'COMMON-FORM.ACCEPTED',
    WAITING: 'COMMON-FORM.WAITING',
    CANCELED: 'COMMON-FORM.CANCELED',
    TANKS: 'COMMON-FORM.TANKS',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    BILL_COMPLETED: 'COMMON-FORM.BILL-COMPLETED',
    REPAIR_JOB_NO: 'COMMON-FORM.REPAIR-JOB-NO',
    REPAIR_TYPE: 'COMMON-FORM.REPAIR-TYPE',
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    APPROVAL_DATE: 'COMMON-FORM.APPROVAL-DATE',
    ESTIMATE_STATUS: 'COMMON-FORM.ESTIMATE-STATUS',
    CURRENT_STATUS: 'COMMON-FORM.CURRENT-STATUS',
    ESTIMATE_NO: 'COMMON-FORM.ESTIMATE-NO',
    NET_COST: 'COMMON-FORM.NET-COST',
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
    STEAM_BILLING: "MENUITEMS.BILLING.LIST.STEAM-BILL",
    RESIDUE_BILLING: "MENUITEMS.BILLING.LIST.RESIDUE-DISPOSAL-BILL",
    TARIFF_CLEANING: 'MENUITEMS.TARIFF.LIST.TARIFF-CLEANING',
    TARIFF_BUFFER: 'MENUITEMS.TARIFF.LIST.TARIFF-BUFFER',
    TARIFF_RESIDUE: 'MENUITEMS.TARIFF.LIST.TARIFF-RESIDUE'
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

  cleanMethodList: CleaningMethodItem[] = [];
  clnEstList: InGateCleaningItem[] = [];
  jobOrderList: JobOrderItem[] = [];
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  tabConfig = [
    {
      label: this.translatedLangText.TARIFF_CLEANING,
      component: 'app-tariff-cleaning',
      modulePackage: ['starter', 'growth', 'customized'],
      expectedFunctions: ['TARIFF_CLEANING_VIEW', 'TARIFF_CLEANING_EDIT', 'TARIFF_CLEANING_DELETE', 'TARIFF_CLEANING_ADD'],
    },
    {
      label: this.translatedLangText.TARIFF_BUFFER,
      component: 'app-tariff-buffer',
      modulePackage: ['growth', 'customized'],
      expectedFunctions: ['TARIFF_BUFFER_CLEANING_VIEW', 'TARIFF_BUFFER_CLEANING_EDIT', 'TARIFF_BUFFER_CLEANING_DELETE', 'TARIFF_BUFFER_CLEANING_ADD'],
    },
    {
      label: this.translatedLangText.TARIFF_RESIDUE,
      component: 'app-tariff-residue',
      modulePackage: ['growth', 'customized'],
      expectedFunctions: ['TARIFF_RESIDUE_DISPOSAL_VIEW', 'TARIFF_RESIDUE_DISPOSAL_EDIT', 'TARIFF_CLETARIFF_RESIDUE_DISPOSAL_DELETENING_DELETE', 'TARIFF_RESIDUE_DISPOSAL_ADD'],
    }
  ];

  get allowedTabs() {
    return this.tabConfig.filter(tab => {
      return this.modulePackageService.hasFunctions(tab.expectedFunctions)
    });
  }

  selectedTabIndex = 0;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
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

  @ViewChild('tariffBuffer') tariffBuffer!: TariffBufferComponent;
  @ViewChild('tariffClean') tariffClean!: TariffCleaningComponent;
  @ViewChild('tariffResidue') tariffResidue!: TariffResidueComponent;
  onTabSelected(event: MatTabChangeEvent): void {
    console.log(`Selected Index: ${event.index}, Tab Label: ${event.tab.textLabel}`);
    switch (event.index) {
      case 0:
        this.tariffClean?.onTabFocused(); break;
      case 1:
        this.tariffBuffer?.onTabFocused(); break;
      case 2:
        this.tariffResidue?.onTabFocused(); break;
    }
  }
}