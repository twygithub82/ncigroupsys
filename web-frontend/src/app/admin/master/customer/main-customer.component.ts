import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ModulePackageService } from 'app/services/module-package.service';
import { Utility } from 'app/utilities/utility';
import { BillingBranchComponent } from './billing-branch/billing-branch.component';
import { CustomerComponent } from './customer/customer.component';

@Component({
  selector: 'app-customer-main',
  standalone: true,
  templateUrl: './main-customer.component.html',
  styleUrl: './main-customer.component.scss',
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
    BillingBranchComponent,
    CustomerComponent
  ]
})
export class MainCustomerComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  tabIndex = 0;
  pageTitle = 'MENUITEMS.MASTER.LIST.CUSTOMER'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.MASTER.TEXT', route: '/admin/master/customer', queryParams: { tabIndex: this.tabIndex } }
  ]

  translatedLangText: any = {};
  langText = {
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    BILLING_BRANCH: 'MENUITEMS.MASTER.LIST.BILLING-BRANCH'
  }

  selectedTabIndex = 0;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService
  ) {
    super();
    this.translateLangText();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tabIndex = params['tabIndex'];
      if (tabIndex) {
        this.selectedTabIndex = tabIndex
      }
    });
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
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

  onTabChange(index: number) {
    this.router.navigate([], { queryParams: { tabIndex: index }, queryParamsHandling: 'merge' });
  }

  tabConfig = [
    {
      label: this.translatedLangText.CUSTOMER,
      component: 'app-customer',
      modulePackage: ['starter', 'growth', 'customized'],
      expectedFunctions: ['MASTER_CUSTOMER_ADD', 'MASTER_CUSTOMER_DELETE', 'MASTER_CUSTOMER_EDIT', 'MASTER_CUSTOMER_VIEW'],
    },
    {
      label: this.translatedLangText.BILLING_BRANCH,
      component: 'app-billing-branch',
      modulePackage: ['growth', 'customized'],
      expectedFunctions: ['MASTER_BILLING_BRANCH_ADD', 'MASTER_BILLING_BRANCH_DELETE', 'MASTER_BILLING_BRANCH_EDIT', 'MASTER_BILLING_BRANCH_VIEW'],
    }
  ];

  get allowedTabs() {
    return this.tabConfig.filter(tab => {
      return this.modulePackageService.hasFunctions(tab.expectedFunctions)
    });
  }

  @ViewChild('customer') customer!: CustomerComponent;
  @ViewChild('billBranch') billBranch!: BillingBranchComponent;
  onTabSelected(event: MatTabChangeEvent): void {
    console.log(`Selected Index: ${event.index}, Tab Label: ${event.tab.textLabel}`);
    switch (event.index) {
      case 0:
        this.customer?.onTabFocused(); break;
      case 1:
        this.billBranch?.onTabFocused(); break;
    }
  }
}