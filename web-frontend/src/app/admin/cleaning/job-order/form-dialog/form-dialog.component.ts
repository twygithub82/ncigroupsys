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
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryDS } from 'app/data-sources/customer-company-category';
import { InGateCleaningDS, InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { ClnJobOrderRequest, JobOrderDS, JobOrderGO, JobOrderItem, JobOrderRequest, JobProcessRequest } from 'app/data-sources/job-order';
import { PackageDepotDS, PackageDepotItem } from 'app/data-sources/package-depot';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { TeamDS, TeamItem } from 'app/data-sources/teams';
import { TimeTableDS, TimeTableItem } from 'app/data-sources/time-table';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import { CancelFormDialogComponent } from '../dialogs/cancel-form-dialog/cancel-form-dialog.component';
import { ConfirmationDialogComponent } from '../dialogs/confirm-form-dialog/confirm-form-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';

export interface DialogData {
  action?: string;
  selectedValue?: number;
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItems: PackageDepotItem[];
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}



@Component({
  selector: 'app-package-depot-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
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
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    provideNgxMask(),
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class FormDialogComponent extends UnsubscribeOnDestroyAdapter {
  displayedColumns = [
    'index',
    'desc',
    'depot',
    'package',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;

  packageDepotItems?: PackageDepotItem[] = [];
  packageDepotDS?: PackageDepotDS;

  jobOrderDS?: JobOrderDS;
  CodeValuesDS?: CodeValuesDS;
  ttDS: TimeTableDS;

  teamList?: any[];

  storageCalCvList: CodeValuesItem[] = [];
  natureTypeCvList: CodeValuesItem[] = [];

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  storageCalControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  profileNameControl = new UntypedFormControl();
  custCompClnCatDS: CustomerCompanyCleaningCategoryDS;
  cleaningTotalHours: number = 3;

  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    CLOSE: 'COMMON-FORM.CLOSE',
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
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    DELETE: 'COMMON-FORM.DELETE',
    INVALID: 'COMMON-FORM.INVALID',
    EXISTED: 'COMMON-FORM.EXISTED',
    DUPLICATE: 'COMMON-FORM.DUPLICATE',
    SELECT_ATLEAST_ONE: 'COMMON-FORM.SELECT-ATLEAST-ONE',
    ADD_ATLEAST_ONE: 'COMMON-FORM.ADD-ATLEAST-ONE',
    ROLLBACK_STATUS: 'COMMON-FORM.ROLLBACK-STATUS',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    ARE_YOU_SURE_ABORT: 'COMMON-FORM.ARE-YOU-SURE-ABORT',
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
    CLEANING_APPROVAL: "MENUITEMS.CLEANING.LIST.APPROVAL",
    KIV: "COMMON-FORM.KIV",
    NO_ACTION: "COMMON-FORM.NO-ACTION",
    APPROVE: "COMMON-FORM.APPROVE",
    APPROVED_DATE: "COMMON-FORM.APPROVED-DATE",
    DATE: "COMMON-FORM.DATE",
    FLAMMABLE_NOTIFICATION: "COMMON-FORM.FLAMMABLE-NOTIFICATION",
    REMARKS_NOTIFICATION: "COMMON-FORM.REMARK-NOTIFICATION",
    DETAILS: "COMMON-FORM.DETAILS",
    EIR_NO: "COMMON-FORM.EIR-NO",
    EIR_DATE: "COMMON-FORM.EIR-DATE",
    QUOTATION_DATE: "COMMON-FORM.QUOTATION-DATE",
    CARGO_NAME: "COMMON-FORM.CARGO-NAME",
    DEPOT_ESTIMATE: "COMMON-FORM.DEPOT-ESTIMATE",
    CUSTOMER_APPROVAL: "COMMON-FORM.CUSTOMER-APPROVAL",
    UPDATED_BY: "COMMON-FORM.UPDATED-BY",
    UPDATED_ON: "COMMON-FORM.UPDATED-ON",
    APPROVAL: "COMMON-FORM.APPROVAL",
    JOB_ALLOCATION: "COMMON-FORM.JOB-ALLOCATION",
    JOB_COMPLETION: "COMMON-FORM.JOB-COMPLETION",
    BILLING_DETAILS: "COMMON-FORM.BILLING-DETAILS",
    INOUT_GATE: "COMMON-FORM.INTOUT-GATE",
    CLEANING_COST_FOR: "COMMON-FORM.CLEANING-COST-FOR",
    LAST_CARGO_CLEANING_QUOTATION: "COMMON-FORM.LAST-CARGO-CLEANING-QUOTATION",
    TOTAL_COST: "COMMON-FORM.TOTAL-COST",
    PAGE_TITLE: "MENUITEMS.CLEANING.LIST.JOB-ORDER",
    TEAM_DETAILS: 'COMMON-FORM.TEAM-DETAILS',
    TEAM: 'COMMON-FORM.TEAM',
    BAY_ALLOCATION: 'COMMON-FORM.BAY-ALLOCATION',
    ABORT: 'COMMON-FORM.ABORT',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    ARE_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
  };


  selectedItems: any;
  selectedItem: any;
  igCleanDS: InGateCleaningDS;
  teamDS: TeamDS;
  igCleanItems: any = [];
  totalCost_depot: number = 0;
  totalCost_customer: number = 0;
  //tcDS: TariffCleaningDS;
  //sotDS: StoringOrderTankDS;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    // Set the defaults
    super();
    this.selectedItems = data.selectedItems;
    this.pcForm = this.createPackageCleaning();
    this.igCleanDS = new InGateCleaningDS(this.apollo);
    this.packageDepotDS = new PackageDepotDS(this.apollo);
    this.CodeValuesDS = new CodeValuesDS(this.apollo);
    this.custCompClnCatDS = new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.teamDS = new TeamDS(this.apollo);
    this.jobOrderDS = new JobOrderDS(this.apollo);
    this.ttDS = new TimeTableDS(this.apollo);
    this.action = data.action!;
    this.translateLangText();
    this.loadData();
  }

  createCleaningChargesItem() {
    this.igCleanItems = [
      {
        description: this.getDescription(),
        depotEstimate: this.pcForm?.get('depot_estimate_cost')?.value,
        customerApproval: this.pcForm?.get('customer_approval_cost')?.value,
      }
    ]
    this.calculateTotalCost();
  }

  calculateTotalCost() {
    this.totalCost_depot = this.igCleanItems.reduce((acc: number, item: any) => acc + (Number(item.depotEstimate) || 0), 0);
    this.totalCost_customer = this.igCleanItems.reduce((acc: number, item: any) => acc + (Number(item.customerApproval) || 0), 0);
  }

  createPackageCleaning(): UntypedFormGroup {
    return this.fb.group({
      selectedItems: this.selectedItems,
      job_no_input: [''],
      approved_dt: [new Date()],
      no_action_dt: [new Date()],
      remarks: [''],
      tank_no: [''],
      customer: [''],
      eir_no: [''],
      eir_dt: [''],
      quotation_dt: [''],
      cargo: [''],
      job_no: ['-'],
      depot_estimate_cost: [''],
      customer_approval_cost: ['-'],
      update_by: [''],
      update_on: [''],
      status_cv: [''],
      approve_dt: [''],
      na_dt: [''],
      team_allocation: [undefined],
    });
  }

  displayDateFromEpoch(epoch: any) {
    if (epoch) {
      if (typeof epoch === "string") return epoch;
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

  displayDate(input: number | undefined): string | undefined {
    if (input === null) return "-";
    return Utility.convertEpochToDateStr(input);
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }


  queryOccupiedTeam() {
    const teamGuids = this.teamList?.map(team => team.guid);

    const where: any = {
      and: []
    };
    where.and.push({ team: { guid: { in: teamGuids } } });
    where.and.push({ job_type_cv: { eq: 'CLEANING' } });
    where.and.push({ status_cv: { in: ['JOB_IN_PROGRESS', 'PENDING', 'ASSIGNED'] } });
    where.and.push({ delete_dt: { eq: null } });

    this.jobOrderDS?.searchStartedJobOrder(where).subscribe(data => {
      if (data?.length) {
        data.forEach(d => {
          this.teamList?.forEach(team => {
            if (team.guid === d.team?.guid && d.cleaning?.length || 0 > 0) {
              // If the team GUID matches, update isOccupied to true
              team.isOccupied = true;
              team.tank_no = d.storing_order_tank?.tank_no;
              team.isEditable = team.tank_no === this.selectedItems[0].storing_order_tank?.tank_no;
              // if(team.isEditable)
              // {
              //   this.toggleTeam(team);
              //   team.isOccupied=false;
              // }
            }
          });
        });
      }
    });

  }

  buttonViewOnly(): boolean {
    let bView: boolean = false;
    let viewOnlyStatus: string[] = ['JOB_IN_PROGRESS', 'COMPLETED', 'NO_ACTION', 'CANCELED'];
    if (this.selectedItems?.length > 0) {
      bView = viewOnlyStatus.includes(this.selectedItems[0]?.status_cv!);
      //  if(bView && this.selectedItems[0]?.status_cv==="APPROVED" )
      //  {
      //   var tankNo = this.selectedItems[0].storing_order_tank?.tank_no;
      //   bView=this.isTeamContainTheTank(tankNo);
      //  }
    }
    return bView;
  }

  isTeamContainTheTank(tankNo: string): boolean {
    let bRetval: boolean = false;
    let tnk = this.teamList?.filter(t => t.tank_no === tankNo);
    bRetval = tnk?.length! > 0;
    return bRetval;
  }
  loadData() {
    this.subs.sink = this.teamDS.getTeamListByDepartment(["CLEANING"]).subscribe(data => {
      if (data?.length) {
        this.teamList = data.map((row, index) => ({
          ...row,
          index: index,
          isSelected: false,
          isOccupied: false,
          isEditable: false,
          isViewOnly: this.buttonViewOnly() || this.action == "view"
        }));
        this.sortBayList(this.teamList);
        this.queryOccupiedTeam();
      }
    });

    const queries = [
      { alias: 'storageCalCv', codeValType: 'STORAGE_CAL' },
      { alias: 'natureTypeCv', codeValType: 'NATURE_TYPE' },
    ];
    this.CodeValuesDS?.getCodeValuesByType(queries);
    this.CodeValuesDS?.connectAlias('storageCalCv').subscribe(data => {
      this.storageCalCvList = data;
      if (this.selectedItems.length == 1) {
        this.selectedItem = this.selectedItems[0]
        var inGateClnItem = this.selectedItem;
        this.pcForm.patchValue({
          tank_no: inGateClnItem.storing_order_tank?.tank_no,
          customer: this.displayCustomerName(inGateClnItem.storing_order_tank?.storing_order?.customer_company),
          eir_no: inGateClnItem.storing_order_tank?.in_gate[0]?.eir_no,
          eir_dt: this.displayDate(inGateClnItem.storing_order_tank?.in_gate[0]?.eir_dt),
          quotation_dt: this.displayDate(inGateClnItem.storing_order_tank?.in_gate[0]?.eir_dt),
          cargo: inGateClnItem.storing_order_tank?.tariff_cleaning.cargo,
          job_no: inGateClnItem.job_no,
          depot_estimate_cost: Number(inGateClnItem.storing_order_tank?.tariff_cleaning?.cleaning_category?.cost).toFixed(2),
          customer_approval_cost: Number(inGateClnItem.cleaning_cost!)!.toFixed(2),
          update_by: inGateClnItem.approve_by,
          update_on: this.displayDate(inGateClnItem.approve_dt),
          job_no_input: inGateClnItem.job_no,
          status_cv: inGateClnItem.status_cv,
          approve_dt: this.displayDate(inGateClnItem.approve_dt),
          na_dt: this.displayDate(inGateClnItem.na_dt),
          remarks: inGateClnItem.remarks,
        });
        this.createCleaningChargesItem();
      }
    });
    this.CodeValuesDS?.connectAlias('natureTypeCv').subscribe(data => {
      this.natureTypeCvList = data;
    });
  }

  displayCustomerName(cc?: CustomerCompanyItem): string {
    return String(cc?.code ? `${cc.code} (${cc.name})` : '');
  }

  selectStorageCalculateCV_Description(valCode?: string): CodeValuesItem {
    let valCodeObject: CodeValuesItem = new CodeValuesItem();
    if (this.storageCalCvList.length > 0) {
      valCodeObject = this.storageCalCvList.find((d: CodeValuesItem) => d.code_val === valCode) || new CodeValuesItem();
    }
    return valCodeObject;
  }

  canEdit() {
    if (this.action != "view") {
      return true;
    }
    else {
      return false;
    }
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
        this.dialogRef.close(count);

      });
    }
  }

  canRollBack(): boolean {
    var validActions: string[] = ["COMPLETED", 'JOB_IN_PROGRESS'];
    var selItem = this.selectedItems[0];
    if (validActions.includes(selItem.status_cv)) {
      return (selItem.job_order);
    }
    else {
      return false;
    }
  }

  canAbort(): boolean {
    let retval: boolean = true;
    var selItem = this.selectedItems[0];
    return selItem.status_cv === "ASSIGNED" || selItem.status_cv === "PARTIAL_ASSIGNED";
    // retval =selItem.job_order?.status_cv==="COMPLETED" && selItem.status_cv!=="COMPLETED";
    // if(!retval)
    // {
    //   if(selItem.status_cv==="APPROVED")
    //   {
    //     var tankNo = this.selectedItems[0].storing_order_tank?.tank_no;
    //     retval=this.isTeamContainTheTank(tankNo);
    //   }
    // }
    //return retval;
  }

  abort(event: Event) {
    event.preventDefault();
    var selItem = this.selectedItems[0];
    if (selItem.status_cv != "JOB_IN_PROGRESS") return;
    const distinctJobOrders: any[] = [];
    const jobOrder: JobOrderGO = new JobOrderGO(this.selectedItems[0].job_order);
    distinctJobOrders.push(jobOrder);
    const repJobOrder = new ClnJobOrderRequest({
      guid: this.selectedItems[0]?.guid,
      sot_guid: this.selectedItems[0]?.storing_order_tank?.guid,
      remarks: this.selectedItems[0]?.remarks,
      job_order: distinctJobOrders
    });

    console.log(repJobOrder)
    this.igCleanDS?.abortInGateCleaning(repJobOrder).subscribe(result => {
      console.log(result)
      this.handleSaveSuccess(result?.data?.abortCleaning);
    });

  }

  save() {
    if (!this.pcForm?.valid) return;
    var selItem = this.selectedItems[0];
    var newJobOrderReq: JobOrderRequest = new JobOrderRequest();
    let job_type = "CLEANING";
    var team: TeamItem = this.pcForm!.get("team_allocation")?.value;
    newJobOrderReq.job_type_cv = job_type;
    newJobOrderReq.team_guid = team?.guid;
    newJobOrderReq.sot_guid = selItem.storing_order_tank?.guid;
    newJobOrderReq.total_hour = this.cleaningTotalHours;
    //newJobOrderReq.process_guid=selItem.guid;
    newJobOrderReq.part_guid = [];
    newJobOrderReq.part_guid.push(selItem.guid);

    if (selItem.job_order) {
      newJobOrderReq.guid = selItem.job_order.guid;
      // var joGuids:string[]=[];
      // joGuids.push(selItem.job_order.guid);
      // this.jobOrderDS?.deleteJobOrder(joGuids).subscribe(result=>{
      //   console.log(result);
      // });
    }

    this.jobOrderDS?.assignJobOrder(newJobOrderReq).subscribe(result => {
      if (result.data.assignJobOrder > 0) {


        // let cleanGuid =selItem.guid;
        // let process_status="ASSIGN";
        // this.updateJobProcessStatus(cleanGuid,job_type,process_status);


        var cleanItem: InGateCleaningItem = new InGateCleaningItem();
        cleanItem.guid = selItem.guid;
        cleanItem.action = "ASSIGN";
        cleanItem.job_no = selItem.job_no;
        cleanItem.remarks = selItem.remarks;
        this.igCleanDS.updateInGateCleaning(cleanItem).subscribe(result => {
          if (result.data.updateCleaning > 0) {
            this.startCleaningJobOrder(selItem.guid);
          }
        });
      }
    });
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  onAbort(event: Event) {
    this.preventDefault(event);
    console.log(this.selectedItem)

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      width: '1000px',
      data: {
        action: 'cancel',
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_ABORT,
        item: [this.selectedItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const distinctJobOrders: any[] = [];
        const jobOrder: JobOrderGO = new JobOrderGO(this.selectedItems[0].job_order);
        distinctJobOrders.push(jobOrder);
        const repJobOrder = new ClnJobOrderRequest({
          guid: this.selectedItems[0]?.guid,
          sot_guid: this.selectedItems[0]?.storing_order_tank?.guid,
          remarks: this.selectedItems[0]?.remarks,
          job_order: distinctJobOrders
        });

        console.log(repJobOrder)
        this.igCleanDS?.abortInGateCleaning(repJobOrder).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.abortCleaning);
        });
      }
    });
  }

  updateJobProcessStatus(cleaningGuid: string, job_type: string, process_status: string) {
    var updateJobProcess: JobProcessRequest = new JobProcessRequest();
    updateJobProcess.guid = cleaningGuid;
    updateJobProcess.job_type_cv = job_type;
    updateJobProcess.process_status = process_status;
    this.jobOrderDS?.updateJobProcessStatus(updateJobProcess).subscribe(result => {
      if (result.data.updateJobProcessStatus > 0) {
        this.handleSaveSuccess(result.data.updateJobProcessStatus);
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

  getAction(): String {
    let retval = "";
    switch (this.action) {
      case "kiv":
        retval = this.translatedLangText.KIV;
        break;
      case "approve":
        retval = this.translatedLangText.APPROVE;
        break;
      case "no_action":
        retval = this.translatedLangText.NO_ACTION;
        break;
      case "view":
        retval = this.translatedLangText.VIEW;
        break;
      case "allocation":
        retval = this.translatedLangText.JOB_ALLOCATION;
        break;
    }

    return retval;
  }

  ShowNoActionDtView() {
    if (this.action == "view") {
      var status_cv = this.pcForm.get('status_cv')?.value;
      var validActions: string[] = ["no_action"];
      return validActions.includes(status_cv.toLocaleLowerCase());
    }
    return false;
  }

  ShowApproveDtView() {
    if (this.action == "view") {
      var status_cv = this.pcForm.get('status_cv')?.value;
      var validActions: string[] = ["approve"];
      return validActions.includes(status_cv.toLocaleLowerCase());
    }
    return false;
  }

  ShowRemarksView() {
    if (this.action == "view") {
      var status_cv = this.pcForm.get('status_cv')?.value;
      var validActions: string[] = ["kiv", "no_action"];
      return validActions.includes(status_cv.toLocaleLowerCase());
    }
    return false;
  }

  ShowStatusView() {
    var validActions: string[] = ["view"];
    return validActions.includes(this.action);
  }

  ShowJobNo() {
    var validActions: string[] = ["kiv", "approve"];
    return validActions.includes(this.action);
  }

  ShowRemarks() {
    var validActions: string[] = ["kiv", "no_action"];
    return validActions.includes(this.action);
  }

  ShowApprovedDate() {
    var validActions: string[] = ["approve"];
    return validActions.includes(this.action);
  }

  ShowNoActionDate() {
    var validActions: string[] = ["no_action"];
    return validActions.includes(this.action);
  }

  getDescription() {
    return `${this.translatedLangText.CLEANING_COST_FOR} ${this.pcForm?.value["cargo"]}`;
  }

  getNatureTypeDescription(codeVal: string | undefined): string | undefined {
    return this.CodeValuesDS?.getCodeDescription(codeVal, this.natureTypeCvList)
  }

  getNatureInGateAlert() {
    return BusinessLogicUtil.getNatureInGateAlert(this.getNatureTypeDescription(this.selectedItem.storing_order_tank?.tariff_cleaning?.nature_cv), this.selectedItem.storing_order_tank?.tariff_cleaning?.in_gate_alert)
  }

  getBackgroundColorFromNature() {
    return Utility.getBackgroundColorFromNature(this.selectedItem.storing_order_tank?.tariff_cleaning?.nature_cv);
  }

  toggleTeam(team: any) {
    let selected: boolean = !team.isSelected;
    if (team.isViewOnly) return;
    if (selected) {
      this.teamList!.forEach(team => team.isSelected = false);
      this.pcForm.patchValue({
        team_allocation: team
      });
    }
    else {
      this.pcForm.patchValue({
        team_allocation: ''
      });
    }
    team.isSelected = !team.isSelected;
  }

  canSave(): boolean {
    let retval: boolean = false;

    retval = !!this.pcForm?.get("team_allocation")?.value;
    return retval;
  }

  trackByTeam(index: number, team: any): any {
    return team.guid;  // Or any unique identifier from your team object
  }

  sortBayList(bayList: any[]) {
    bayList.sort((a: any, b: any) => {
      const numA = parseInt(a.description.replace(/[^\d]/g, ""), 10); // Remove all non-digit characters
      const numB = parseInt(b.description.replace(/[^\d]/g, ""), 10); // Remove all non-digit characters
      return numA - numB;
    });
  }

  getTariffCleaningRemarks() {
    return this.selectedItem.storing_order_tank?.tariff_cleaning?.remarks ? this.selectedItem.storing_order_tank?.tariff_cleaning?.remarks : "-";
  }

  startCleaningJobOrder(clean_guid: string) {
    if (clean_guid) {
      const where: any = {
        job_type_cv: { eq: "CLEANING" }
      };

      where.cleaning = { some: { guid: { eq: clean_guid } } };

      let lastOrderByJobOrder: any = { create_dt: "DESC" };
      this.jobOrderDS?.searchStartedJobOrder(where, lastOrderByJobOrder)
        .subscribe(data => {
          let jobOrderList = data;
          if (jobOrderList.length) {
            this.toggleJobState(jobOrderList[0]);
          }
        });
    }
  }

  toggleJobState(jobOrderItem: JobOrderItem) {
    //this.stopPropagation(event);  // Prevents the form submission
    // if (!isStarted) {
    const param = [new TimeTableItem({ job_order_guid: jobOrderItem?.guid, job_order: new JobOrderGO({ ...jobOrderItem }) })];
    console.log(param)
    const firstValidRepairPart = jobOrderItem.cleaning?.find(
      (cleaning) => cleaning?.guid !== null
    );
    this.ttDS.startJobTimer(param, firstValidRepairPart?.guid!).subscribe(result => {
      if (result.data.startJobTimer > 0) {
        var item: InGateCleaningItem = new InGateCleaningItem(jobOrderItem.cleaning![0]!);
        this.UpdateCleaningStatusInProgress(item.guid!);
      }
    });
    // } else {
    //   const found = jobOrderItem?.time_table?.filter(x => x?.start_time && !x?.stop_time);
    //   if (found?.length) {
    //     const newParam = new TimeTableItem(found[0]);
    //     newParam.stop_time = Utility.convertDate(new Date()) as number;
    //     newParam.job_order = new JobOrderGO({ ...jobOrderItem });
    //     const param = [newParam];
    //     console.log(param)
    //     this.ttDS.stopJobTimer(param).subscribe(result => {
    //       console.log(result)
    //     });
    //   }
    // }
  }

  UpdateCleaningStatusInProgress(clean_guid: string) {


    const where: any = {
      and: []
    };


    where.and.push({
      guid: { eq: clean_guid }
    });


    this.subs.sink = this.igCleanDS.search(where)
      .subscribe(data => {
        if (data.length > 0) {
          var cln = data[0];
          var rep: InGateCleaningItem = new InGateCleaningItem(cln);
          rep.action = 'IN_PROGRESS';
          delete rep.storing_order_tank;
          delete rep.job_order;
          delete rep.customer_company;
          this.igCleanDS.updateInGateCleaning(rep).subscribe(result => {

            console.log(result);
            if (result.data.updateCleaning > 0) {
              this.handleSaveSuccess(result.data.updateCleaning);
            }

          });
          //  this.clnDS.
        }
      });
  }



  onRollback(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30vw',
      //height: '250px',
      data: {
        action: "EDIT",
        item: this.selectedItems[0].storing_order_tank,
        langText: this.translatedLangText,
        confirmStatement: this.translatedLangText.ARE_SURE_ROLLBACK,
        index: -1

      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action == "confirmed") {
        const distinctJobOrders: any[] = [];
        const jobOrder: JobOrderGO = new JobOrderGO(this.selectedItems[0].job_order);
        distinctJobOrders.push(jobOrder);
        const clnJobOrder = new ClnJobOrderRequest({
          guid: this.selectedItems[0]?.guid,
          sot_guid: this.selectedItems[0]?.storing_order_tank?.guid,
          remarks: result?.remarks,
          job_order: distinctJobOrders,
          sot_status: this.selectedItems[0]?.storing_order_tank?.tank_status_cv
        });

        console.log(clnJobOrder);
        if (this.selectedItems[0]?.status_cv === "COMPLETED") {
          this.igCleanDS?.rollbackCompletedCleaning(clnJobOrder).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.rollbackCompletedCleaning);
          });
        }
        else if (this.selectedItems[0]?.status_cv === "JOB_IN_PROGRESS") {
          this.jobOrderDS?.rollbackJobInProgressCleaning(clnJobOrder).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.rollbackJobInProgressCleaning);
          });
        }
      }
    });
  }

}
