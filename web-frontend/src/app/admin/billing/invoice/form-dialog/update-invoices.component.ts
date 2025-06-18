import { Direction } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { BillingDS, BillingGo, BillingItem } from 'app/data-sources/billing';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CurrencyDS, CurrencyItem } from 'app/data-sources/currency';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryDS } from 'app/data-sources/customer-company-category';
import { PackageDepotDS, PackageDepotItem } from 'app/data-sources/package-depot';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';

export interface DialogData {
  action?: string;
  selectedValue?: number;

  // item: StoringOrderTankItem;
  langText?: any;
  selectedItems: BillingItem[];
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}

@Component({
  selector: 'app-package-depot-form-dialog',
  templateUrl: './update-invoices.component.html',
  styleUrls: ['./update-invoices.component.scss'],
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
    MatPaginatorModule,
  ],
  providers: [
    provideNgxMask(),
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class UpdateInvoicesDialogComponent extends UnsubscribeOnDestroyAdapter {
  displayedColumns = [
    //  'select',
    // 'img',
    'inv_dt',
    'inv_no',
    'cust_code',
    'cust_name',


    // 'bDate',
    // 'mobile',
    // 'actions',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;
  distinctCustomerCodes: any;


  customer_companyList?: CustomerCompanyItem[];
  branch_companyList?: CustomerCompanyItem[];

  packageDepotItems?: PackageDepotItem[] = [];
  packageDepotDS?: PackageDepotDS;
  CodeValuesDS?: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  curDS: CurrencyDS;
  billDS?: BillingDS;

  storageCalCvList: CodeValuesItem[] = [];

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  storageCalControl = new UntypedFormControl();
  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  branchCodeControl = new UntypedFormControl();
  currencyControl = new UntypedFormControl();

  profileNameControl = new UntypedFormControl();
  custCompClnCatDS: CustomerCompanyCleaningCategoryDS;

  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME: 'COMMON-FORM.COMPANY-NAME',
    SO_NO: 'COMMON-FORM.SO-NO',
    SO_NOTES: 'COMMON-FORM.SO-NOTES',
    HAULIER: 'COMMON-FORM.HAULIER',
    ORDER_DETAILS: 'COMMON-FORM.ORDER-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    STORAGE: 'COMMON-FORM.STORAGE',
    STEAM: 'COMMON-FORM.STEAM',
    CLEANING: 'COMMON-FORM.CLEANING',
    REPAIR: 'COMMON-FORM.REPAIR',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    CLEAN_STATUS: 'COMMON-FORM.CLEAN-STATUS',
    CERTIFICATE: 'COMMON-FORM.CERTIFICATE',
    REQUIRED_TEMP: 'COMMON-FORM.REQUIRED-TEMP',
    FLASH_POINT: 'COMMON-FORM.FLASH-POINT',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    REMARKS: 'COMMON-FORM.REMARKS',
    ETR_DATE: 'COMMON-FORM.ETR-DATE',
    ST: 'COMMON-FORM.ST',
    O2_LEVEL: 'COMMON-FORM.O2-LEVEL',
    OPEN_ON_GATE: 'COMMON-FORM.OPEN-ON-GATE',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
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
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    CUSTOMER_COMPANY: "COMMON-FORM.CUSTOMER-COMPANY",
    ALIAS_NAME: "COMMON-FORM.ALIAS-NAME",
    AGREEMENT_DUE_DATE: "COMMON-FORM.AGREEMENT-DUE-DATE",
    BILLING_PROFILE: "COMMON-FORM.BILLING-PROFILE",
    PACKAGE_DEPOT: "MENUITEMS.PACKAGE.LIST.PACKAGE-DEPOT",
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    VIEW: 'COMMON-FORM.VIEW',
    DEPOT_PROFILE: 'COMMON-FORM.DEPOT-PROFILE',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    PREINSPECTION_COST: "COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST: "COMMON-FORM.LOLO-COST",
    STORAGE_COST: "COMMON-FORM.STORAGE-COST",
    FREE_STORAGE: "COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED',
    STANDARD_COST: "COMMON-FORM.STANDARD-COST",
    CUSTOMER_COST: "COMMON-FORM.CUSTOMER-COST",
    STORAGE_CALCULATE_BY: "COMMON-FORM.STORAGE-CALCULATE-BY",
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    GATE_IN_COST: 'COMMON-FORM.GATE-IN-COST',
    GATE_OUT_COST: 'COMMON-FORM.GATE-OUT-COST',
    INVOICES: 'MENUITEMS.BILLING.LIST.INVOICES',
    INVOICE_NO: 'COMMON-FORM.INVOICE-NO',
    INVOICE_DATE: 'COMMON-FORM.INVOICE-DATE',
    CURRENCY: 'COMMON-FORM.CURRENCY',
    BILLING_BRANCH: 'COMMON-FORM.BILLING-BRANCH',
    CONVERSION_CURRENCY: 'COMMON-FORM.CONVERSION-CURRENCY',
    CONFIRM_INVALID_INVOICE: 'COMMON-FORM.CONFIRM-INVALID-INVOICE',
    BILLING_CURRENCY: 'COMMON-FORM.BILLING-CURRENCY'

  };

  currencyList?: CurrencyItem[] = [];
  selectedItems: BillingItem[];
  //tcDS: TariffCleaningDS;
  //sotDS: StoringOrderTankDS;

  constructor(
    public dialogRef: MatDialogRef<UpdateInvoicesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    // Set the defaults
    super();
    this.selectedItems = data.selectedItems;
    this.pcForm = this.createInvoiceUpdateGroup();
    this.curDS = new CurrencyDS(this.apollo);
    this.packageDepotDS = new PackageDepotDS(this.apollo);
    this.CodeValuesDS = new CodeValuesDS(this.apollo);
    this.custCompClnCatDS = new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.billDS = new BillingDS(this.apollo);
    this.action = data.action!;
    this.translateLangText();
    this.loadData();
    this.initializeValueChanges();
  }

  createInvoiceUpdateGroup(): UntypedFormGroup {
    return this.fb.group({
      selectedItems: this.selectedItems,
      invoice_no: [''],
      bill_to_customer_company: this.customerCodeControl,
      branch_code: this.branchCodeControl,
      invoice_dt: [''],
      currency: [''],
      remarks: [''],
    });
    this.customerCodeControl.reset('');
    this.branchCodeControl.reset('');
    this.currencyControl.reset('');
  }

  initializeValueChanges() {
    this.pcForm!.get('bill_to_customer_company')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        this.branch_companyList = [];
        //this.branchCodeControl.reset('');
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.code;
        }
        this.ccDS?.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
          this.updateValidators(this.customerCodeControl, this.customer_companyList);
          if (!this.customerCodeControl.invalid) {
            if (this.customerCodeControl.value?.guid) {
              let mainCustomerGuid = this.customerCodeControl.value.guid;
              this.ccDS!.loadItems({ main_customer_guid: { eq: mainCustomerGuid } }).subscribe(data => {
                this.branch_companyList = data;
                this.updateValidators(this.branchCodeControl, this.branch_companyList);
              });
            }
          }
        });
      })
    ).subscribe();


  }
  profileChanged() {
    // if(this.profileNameControl.value)
    // {
    //   const selectedProfile:PackageDepotItem= this.profileNameControl.value;
    //   this.pcForm.patchValue({
    //     preinspection_cost_cust: selectedProfile.preinspection_cost,
    //     preinspection_cost_standard:selectedProfile.preinspection_cost,
    //     lolo_cost_cust:selectedProfile.lolo_cost,
    //     lolo_cost_standard: selectedProfile.tariff_depot?.lolo_cost,
    //     storage_cost_cust:selectedProfile.storage_cost,
    //     storage_cost_standard:selectedProfile.tariff_depot?.storage_cost,
    //     free_storage_days:selectedProfile.free_storage,
    //     gate_in_cost:selectedProfile.gate_in_cost,
    //     gate_out_cost:selectedProfile.gate_out_cost,
    //     remarks:selectedProfile.remarks,
    //     //storage_cal_cv:this.selectStorageCalculateCV_Description(selectedProfile.storage_cal_cv)
    //   });
    //   this.storageCalControl.setValue(this.selectStorageCalculateCV_Description(selectedProfile.storage_cal_cv));


    // }
  }
  displayName(cc?: CustomerCompanyItem): string {
    return cc?.code ? `${cc.code} (${cc.name})` : '';
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  displayDateFromEpoch(epoch: any) {
    if (epoch) {
      var updatedt = Number(epoch);

      const date = new Date(updatedt! * 1000);
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();

      // Replace the '/' with '-' to get the required format


      return `${day}/${month}/${year}`;
    }
    return `-`;

  }
  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  loadData() {
    this.distinctCustomerCodes = [... new Set(this.selectedItems.map(item => item.customer_company?.code))];

    this.curDS.search({}, { sequence: 'ASC' }, 100).subscribe(data => {
      this.currencyList = data;


      if (this.selectedItems.length === 1) {
        var selItm = this.selectedItems[0];
        this.pcForm.patchValue(
          {
            invoice_no: selItm.invoice_no,
            currency: this.getCurrency(selItm.currency?.guid!),
            //  bill_to_customer_company:this.customerCodeControl,
            invoice_dt: Utility.convertDate(selItm.invoice_dt),
            remarks: selItm.remarks,
          }
        );
        this.customerCodeControl.setValue(selItm.customer_company);
        // this.currencyControl.setValue(selItm.currency);
      }
    });

  }

  queryDepotCost() {
    // const where:any={ customer_company: { guid: { eq: this.selectedItem.guid } } };

    // this.packageDepotDS?.SearchPackageDepot(where,{},50).subscribe((data:PackageDepotItem[])=>{
    //   this.packageDepotItems=data;

    // });
  }

  selectStorageCalculateCV_Description(valCode?: string): CodeValuesItem {
    let valCodeObject: CodeValuesItem = new CodeValuesItem();
    if (this.storageCalCvList.length > 0) {
      valCodeObject = this.storageCalCvList.find((d: CodeValuesItem) => d.code_val === valCode) || new CodeValuesItem();

      // If no match is found, description will be undefined, so you can handle it accordingly

    }
    return valCodeObject;

  }




  canEdit() {
    return true;
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)

      });
    }
  }

  save() {

    if (!this.pcForm?.valid) return;

    var bExec: boolean = true;

    if (this.pcForm.get('invoice_no')?.value) {
      var invNo: string = this.pcForm!.get('invoice_no')?.value;
      var where = { invoice_no: { eq: invNo } };
      this.billDS?.searchResidueBilling(where).subscribe(b => {
        if (b.length) {
          var existInvNo = (this.selectedItems.length === 1 ? this.selectedItems[0].invoice_no : "");
          var item: any = b[0];
          if (item.invoice_no != existInvNo) {
            this.ConfirmInvalidEstimate();
          }
          else {
            this.UpdateInvoices();
          }
        }
        else {
          this.UpdateInvoices();
        }

      })
    }
    else {
      this.UpdateInvoices();
    }
  }

  ConfirmInvalidEstimate() {
    //event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_INVALID_INVOICE,
        action: 'confirm_only',
      },
      direction: tempDirection
    });
    dialogRef.afterClosed();
  }

  UpdateInvoices() {
    var billInvoices: BillingGo[] = [];
    this.selectedItems.forEach(b => {

      b.currency_guid = b.currency?.guid;
      var updBilling: BillingGo = new BillingGo(b);

      if (this.pcForm.get('bill_to_customer_company')?.value) {
        updBilling.bill_to_guid = this.pcForm.get('bill_to_customer_company')?.value.guid;
      }

      if (this.pcForm.get('currency')?.value) {
        updBilling.currency_guid = this.pcForm.get('currency')?.value.guid;
      }


      if (this.pcForm.get('branch_code')?.value) {
        updBilling.bill_to_guid = this.pcForm.get('branch_code')?.value.guid;
      }

      if (this.pcForm.get('invoice_no')?.value) {
        updBilling.invoice_no = this.pcForm.get('invoice_no')?.value;
      }

      if (this.pcForm.get('invoice_dt')?.value) {
        updBilling.invoice_dt = Number(Utility.convertDate(this.pcForm!.get('invoice_dt')?.value));
        let invoiceDate: Date = new Date(this.pcForm!.get('invoice_dt')?.value);
        let invoiceDue: Date = new Date(invoiceDate);
        invoiceDue.setMonth(invoiceDate.getMonth() + 1);
        updBilling.invoice_due = Number(Utility.convertDate(invoiceDue));
      }

      if (this.pcForm.get('remarks')?.value) {
        updBilling.remarks = this.pcForm.get('remarks')?.value;
      }
      billInvoices.push(updBilling);
    });

    this.billDS?.updateBillingInvoices(billInvoices).subscribe(result => {
      if (result.data.updateBillingInvoices > 0) {

        console.log('valid');
        this.dialogRef.close(result.data.updateBillingInvoices);

      }
    });
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
  updateValidators(untypedFormControl: UntypedFormControl, validOptions: any[]) {
    untypedFormControl.setValidators([
      AutocompleteSelectionValidator(validOptions)
    ]);
  }
  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  getCurrency(guid: string): CurrencyItem | undefined {
    if (this.currencyList?.length! > 0 && guid) {
      const curItm = this.currencyList?.filter((x: any) => x.guid === guid).map(item => {
        return item;
      });
      if (curItm?.length! > 0)
        return curItm![0];
      else
        return undefined;

    }
    return undefined;

  }

  CustomerCompanyRequired() {
    if (this.distinctCustomerCodes?.length) {
      return this.distinctCustomerCodes.length > 1;
    }

    return false;
  }

}
