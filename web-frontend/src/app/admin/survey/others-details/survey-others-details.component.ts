import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
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
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { SurveyDetailDS, SurveyDetailItem } from 'app/data-sources/survey-detail';
import { TankInfoDS, TankInfoItem } from 'app/data-sources/tank-info';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';

@Component({
  selector: 'app-survey-others-details',
  standalone: true,
  templateUrl: './survey-others-details.component.html',
  styleUrl: './survey-others-details.component.scss',
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
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
    RouterModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class SurveyOthersDetailsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'surveyor',
    'survey_type_cv',
    'survey_dt',
    'status_cv',
    'remarks',
    'actions',
  ];

  pageTitle = 'MENUITEMS.SURVEY.LIST.OTHERS-SURVEY-DETAILS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.SURVEY.TEXT', route: '/admin/survey/others' },
    { text: 'MENUITEMS.SURVEY.LIST.OTHERS-SURVEY', route: '/admin/survey/others' }
  ]

  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_NAME: 'COMMON-FORM.CUSTOMER-NAME',
    SO_DATE: 'COMMON-FORM.SO-DATE',
    NO_OF_TANKS: 'COMMON-FORM.NO-OF-TANKS',
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
    SEARCH: "COMMON-FORM.SEARCH",
    EIR_NO: "COMMON-FORM.EIR-NO",
    EIR_DATE: "COMMON-FORM.EIR-DATE",
    BOOKING_DATE: "COMMON-FORM.BOOKING-DATE",
    CLEAN_CERTIFICATE: "COMMON-FORM.CLEAN-CERTIFICATE",
    BOOKING_REFERENCE: "COMMON-FORM.BOOKING-REFERENCE",
    REFERENCE: "COMMON-FORM.REFERENCE",
    SURVEYOR: "COMMON-FORM.SURVEYOR",
    BOOKING_TYPE: "COMMON-FORM.BOOKING-TYPE",
    CURRENT_STATUS: "COMMON-FORM.CURRENT-STATUS",
    CUSTOMER: "COMMON-FORM.CUSTOMER",
    TANK_STATUS: "COMMON-FORM.TANK-STATUS",
    TARE_WEIGHT: "COMMON-FORM.TARE-WEIGHT",
    ADD_NEW_BOOKING: "COMMON-FORM.ADD-NEW-BOOKING",
    BOOKINGS: "COMMON-FORM.BOOKINGS",
    SELECT_ALL: "COMMON-FORM.SELECT-ALL",
    ACTION_DATE: "COMMON-FORM.ACTION-DATE",
    BOOKING_DETAILS: "COMMON-FORM.BOOKING-DETAILS",
    SAVE_AND_SUBMIT: "COMMON-FORM.SAVE",
    SO_REQUIRED: "COMMON-FORM.IS-REQUIRED",
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    CLEAN_DATE: 'COMMON-FORM.CLEAN-DATE',
    SURVEY_DATE: 'COMMON-FORM.SURVEY-DATE',
    BOOKED: 'COMMON-FORM.BOOKED',
    SCHEDULED: 'COMMON-FORM.SCHEDULED',
    REMARKS: 'COMMON-FORM.REMARKS',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    EXISTED: 'COMMON-FORM.EXISTED',
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    DELETE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    LAST_TEST: 'COMMON-FORM.LAST-TEST',
    CLEAN_STATUS: 'COMMON-FORM.CLEAN-STATUS',
    OWNER: 'COMMON-FORM.OWNER',
    TANK_DETAILS: 'COMMON-FORM.TANK-DETAILS',
    SURVEY_DETAILS: 'COMMON-FORM.SURVEY-DETAILS',
    EDIT_SURVEY: 'COMMON-FORM.EDIT-SURVEY',
    NEW_SURVEY: 'COMMON-FORM.NEW-SURVEY',
    SURVEY_TYPE: 'COMMON-FORM.SURVEY-TYPE',
    BACK: 'COMMON-FORM.BACK',
  }

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;
  igDS: InGateDS;
  surveyDS: SurveyDetailDS;
  tiDS: TankInfoDS;

  sotItem?: StoringOrderTankItem;
  tiItem?: TankInfoItem;
  surveyDetailItem: SurveyDetailItem[] = [];
  selectedItemsPerPage: { [key: number]: Set<string> } = {};
  // surveyorList: CustomerCompanyItem[] = [];
  last_cargoList?: TariffCleaningItem[];
  yardCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  bookingTypeCvList: CodeValuesItem[] = [];
  bookingTypeCvListNewBooking: CodeValuesItem[] = [];
  bookingStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  cleanStatusCvList: CodeValuesItem[] = [];
  testTypeCvList: CodeValuesItem[] = [];
  testClassCvList: CodeValuesItem[] = [];
  surveyTypeCvList: CodeValuesItem[] = [];
  surveyStatusCvList: CodeValuesItem[] = [];

  sot_guid?: string | null;
  last_test_desc? = "";

  lastSearchCriteria: any;
  lastOrderBy: any = { storing_order: { so_no: 'DESC' } };
  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private router: Router,
    private translate: TranslateService,
    private route: ActivatedRoute,
  ) {
    super();
    this.translateLangText();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.surveyDS = new SurveyDetailDS(this.apollo);
    this.tiDS = new TankInfoDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initSearchForm();
    this.initializeValueChanges();
    this.loadData();
  }

  initSearchForm() {
  }

  public loadData() {
    const queries = [
      { alias: 'yardCv', codeValType: 'YARD' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'bookingTypeCv', codeValType: 'BOOKING_TYPE' },
      { alias: 'bookingStatusCv', codeValType: 'BOOKING_STATUS' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'cleanStatusCv', codeValType: 'CLEAN_STATUS' },
      { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
      { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
      { alias: 'surveyTypeCv', codeValType: 'SURVEY_TYPE' },
      { alias: 'surveyStatusCv', codeValType: 'SURVEY_STATUS' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = data;
    });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('bookingTypeCv').subscribe(data => {
      this.bookingTypeCvListNewBooking = data;
      this.bookingTypeCvList = data;
    });
    this.cvDS.connectAlias('bookingStatusCv').subscribe(data => {
      this.bookingStatusCvList = data;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data;
    });
    this.cvDS.connectAlias('cleanStatusCv').subscribe(data => {
      this.cleanStatusCvList = addDefaultSelectOption(data, "Unknown");
    });
    this.cvDS.connectAlias('testTypeCv').subscribe(data => {
      this.testTypeCvList = data;
      this.last_test_desc = this.getLastTest();
    });
    this.cvDS.connectAlias('testClassCv').subscribe(data => {
      this.testClassCvList = this.sortByDescription(data);
      this.last_test_desc = this.getLastTest();
    });
    this.cvDS.connectAlias('surveyTypeCv').subscribe(data => {
      this.surveyTypeCvList = this.sortByDescription(data);
    });
    this.cvDS.connectAlias('surveyStatusCv').subscribe(data => {
      this.surveyStatusCvList = data;
    });

    // this.ccDS.getSurveyorList({}, {}).subscribe(data => {
    //   if (data.length > 0) {
    //     this.surveyorList = data;
    //   }
    // });

    this.sot_guid = this.route.snapshot.paramMap.get('id');
    if (this.sot_guid) {
      // EDIT
      this.subs.sink = this.sotDS.getStoringOrderTanksForOtherSurveyByID(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          this.sotItem = data[0];
          this.surveyDetailItem = this.sotItem?.survey_detail || [];
          this.tiItem = this.sotItem?.tank_info;
          this.last_test_desc = this.getLastTest();
        }
      });
    } else {
      // NEW
    }
  }

  refreshSurveyDetail() {
    const where = {
      sot_guid: { eq: this.sot_guid },
      survey_type_cv: { neq: 'PERIODIC_TEST' }
    }
    this.subs.sink = this.surveyDS.searchSurveyDetail(where, { survey_dt: "DESC" }).subscribe(data => {
      this.surveyDetailItem = data;
    });
  }

  sortByDescription<T extends { description?: string }>(list: T[]): T[] {
    return [...list].sort((a, b) => (a.description || '').localeCompare(b.description || ''));
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

  // context menu
  onContextMenu(event: MouseEvent, item: StoringOrderItem) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  initializeValueChanges() {
  }

  addSurveyDetail(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1000px',
      data: {
        action: 'new',
        translatedLangText: this.translatedLangText,
        populateData: {
          // surveyorList: this.surveyorList,
          testClassCvList: this.testClassCvList,
          surveyTypeCvList: this.surveyTypeCvList,
          surveyStatusCvList: this.surveyStatusCvList,
        },
        sot: this.sotItem,
        surveyDS: this.surveyDS
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && result.savedSuccess) {
        ComponentUtil.showNotification('snackbar-success', this.translatedLangText.SAVE_SUCCESS, 'top', 'center', this.snackBar);
        this.refreshSurveyDetail();
      }
    });
  }

  editSurveyDetail(event: Event, row: SurveyDetailItem) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1000px',
      data: {
        action: 'edit',
        translatedLangText: this.translatedLangText,
        populateData: {
          // surveyorList: this.surveyorList,
          testClassCvList: this.testClassCvList,
          surveyTypeCvList: this.surveyTypeCvList,
          surveyStatusCvList: this.surveyStatusCvList,
        },
        surveyDetail: row,
        sot: this.sotItem,
        surveyDS: this.surveyDS
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && result.savedSuccess) {
        ComponentUtil.showNotification('snackbar-success', this.translatedLangText.SAVE_SUCCESS, 'top', 'center', this.snackBar);
        this.refreshSurveyDetail();
      }
    });
  }

  deleteSurveyDialog(event: Event, row: SurveyDetailItem) {
    this.stopPropagation(event); // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.ARE_YOU_SURE_DELETE,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.deleteSurveyDetail(row);
        console.log('confirm delete survey');
      }
    });
  }

  deleteSurveyDetail(row: SurveyDetailItem) {
    const deletedGuid = row.guid!;
    const surveyDetail = new SurveyDetailItem(row);
    this.surveyDS.deleteSurveyDetail(deletedGuid, surveyDetail, null).subscribe(result => {
      this.handleDeleteSuccess(result?.data?.handleDeleteSuccess);
      this.refreshSurveyDetail()
    });
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
    }
  }

  handleDeleteSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.DELETE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation(); // Stops event propagation
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayDate(input: number | null | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input as number);
  }

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  displayTankPurpose(sot: StoringOrderTankItem | undefined) {
    let purposes: any[] = [];
    if (sot?.purpose_storage) {
      purposes.push(this.getPurposeOptionDescription('STORAGE'));
    }
    if (sot?.purpose_cleaning) {
      purposes.push(this.getPurposeOptionDescription('CLEANING'));
    }
    if (sot?.purpose_steam) {
      purposes.push(this.getPurposeOptionDescription('STEAM'));
    }
    if (sot?.purpose_repair_cv) {
      purposes.push(this.getPurposeOptionDescription(sot?.purpose_repair_cv));
    }
    return purposes.join('; ');
  }

  getPurposeOptionDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getCleanStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.cleanStatusCvList);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
  }

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yardCvList);
  }

  getTestTypeDescription(codeVal: string): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.testTypeCvList);
  }

  getTestClassDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.testClassCvList);
  }

  getSurveyTypeDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.surveyTypeCvList);
  }

  getSurveyStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.surveyStatusCvList);
  }

  getLastTest(): string | undefined {
    return this.getLastTestTI() || this.getLastTestIGS();
  }

  getLastTestIGS(): string | undefined {
    if (!this.testTypeCvList?.length || !this.testClassCvList?.length || !this.igDS.getInGateItem(this.sotItem?.in_gate)?.in_gate_survey) return "";

    const igs = this.igDS.getInGateItem(this.sotItem?.in_gate)?.in_gate_survey
    if (igs && igs.last_test_cv && igs.test_class_cv && igs.test_dt) {
      const test_type = igs.last_test_cv;
      const test_class = igs.test_class_cv;
      return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(igs.test_dt as number, 'MM/YYYY') + " - " + this.getTestClassDescription(test_class);
    }
    return "";
  }

  getLastTestTI(): string | undefined {
    if (!this.testTypeCvList?.length || !this.testClassCvList?.length || !this.tiItem) return "";

    if (this.tiItem.last_test_cv && this.tiItem.test_class_cv && this.tiItem.test_dt) {
      const test_type = this.tiItem.last_test_cv;
      const test_class = this.tiItem.test_class_cv;
      return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(this.tiItem.test_dt as number, 'MM/YYYY') + " - " + this.getTestClassDescription(test_class);
    }
    return "";
  }

  updateValidators(untypedFormControl: UntypedFormControl, validOptions: any[]) {
    untypedFormControl.setValidators([
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
  }
}