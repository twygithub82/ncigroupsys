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
import { InventoryYearlyAdminReportComponent } from './inventory-yearly/inventory-yearly.component';
import { ManHourYearlyAdminReportComponent } from './manhour-yearly/manhour-yearly.component';
import { RevenueYearlyAdminReportComponent } from './revenue-yearly/revenue-yearly.component';

@Component({
  selector: 'app-main-management-yearly',
  standalone: true,
  templateUrl: './main-management-yearly.component.html',
  styleUrl: './main-management-yearly.component.scss',
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
    RevenueYearlyAdminReportComponent,
    InventoryYearlyAdminReportComponent,
    ManHourYearlyAdminReportComponent
  ]
})
export class MainManagementYearlyComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  pageTitle = 'MENUITEMS.MANAGEMENT.LIST.YEARLY-REPORTS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.MANAGEMENT.TEXT', route: '/admin/management/reports/yearly' }
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
    INVENTORY_REPORT: 'COMMON-FORM.INVENTORY-REPORT',
    REVENUE_REPORT: 'COMMON-FORM.REVENUE-REPORT',
    MANHOUR_REPORT: 'COMMON-FORM.MANHOUR-REPORT',
  }

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

  @ViewChild('inventoryYearlyReport') inventoryYearlyReport!: InventoryYearlyAdminReportComponent;
  @ViewChild('revenueYearlyReport') revenueYearlyReport!: RevenueYearlyAdminReportComponent;
  onTabSelected(event: MatTabChangeEvent): void {
    console.log(`Selected Index: ${event.index}, Tab Label: ${event.tab.textLabel}`);
    switch (event.index) {
      case 0:
        this.inventoryYearlyReport?.onTabFocused(); break;
      case 1:
        this.revenueYearlyReport?.onTabFocused(); break;
    }
  }
}