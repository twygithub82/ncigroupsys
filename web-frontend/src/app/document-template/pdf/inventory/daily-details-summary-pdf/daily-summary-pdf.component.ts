import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { InGateDS, InGateItem } from 'app/data-sources/in-gate';
import { customerInfo } from 'environments/environment.development';
import { Utility } from 'app/utilities/utility';
import { TranslateService } from '@ngx-translate/core';
import { OutGateItem } from 'app/data-sources/out-gate';
import { InGateSurveyDS } from 'app/data-sources/in-gate-survey';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { PackageBufferItem } from 'app/data-sources/package-buffer';
import { NgClass } from '@angular/common';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
// import { saveAs } from 'file-saver';
import { FileManagerService } from '@core/service/filemanager.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComponentUtil } from 'app/utilities/component-util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { RepairCostTableItem, RepairDS } from 'app/data-sources/repair';
import { RepairPartDS } from 'app/data-sources/repair-part';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SteamDS } from 'app/data-sources/steam';
import { SteamPartDS } from 'app/data-sources/steam-part';
import { report_billing_customer } from 'app/data-sources/billing';
import { daily_inventory_summary, report_customer_inventory, report_status, openingBalance } from 'app/data-sources/reports';
import {
  ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis,
  ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexLegend,
  ApexStroke, ApexFill, ApexTooltip, ApexTitleSubtitle,
  ApexGrid, ApexMarkers, ApexNonAxisChartSeries, ApexResponsive,
  NgApexchartsModule
} from 'ng-apexcharts';
import { BarChartModule, Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts'
import autoTable, { Styles } from 'jspdf-autotable';

export type HorizontalBarOptions = {
  showXAxis?: boolean;
  showYAxis?: boolean;
  gradient?: boolean;
  showLegend?: boolean;
  showXAxisLabel?: boolean;
  showYAxisLabel?: boolean;
  legendPosition: LegendPosition;
  timeline?: boolean;
  colorScheme?: Color;
  showLabels?: boolean;
  // data goes here
  single?: any;
  hbarxAxisLabel?: string;
};

export type ChartOptions = {
  animations?: any;
  series?: ApexAxisChartSeries;
  series2?: ApexNonAxisChartSeries;
  chart?: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  xaxis?: ApexXAxis;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  stroke?: ApexStroke;
  legend?: ApexLegend;
  title?: ApexTitleSubtitle;
  colors?: string[];
  grid?: ApexGrid;
  markers?: ApexMarkers;
  labels: string[];
  responsive: ApexResponsive[];
};

export interface DialogData {
  report_daily_inventory_summary: daily_inventory_summary[],
  type: string,
  date: string,
  queryType: number



}

@Component({
  selector: 'app-daily-summary-pdf',
  templateUrl: './daily-summary-pdf.component.html',
  styleUrls: ['./daily-summary-pdf.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule,
    NgApexchartsModule,
    BarChartModule,
    MatProgressBarModule,
    NgApexchartsModule
  ],
})
export class DailyDetailSummaryPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  translatedLangText: any = {};
  barChartOptions!: Partial<ChartOptions>;
  langText = {
    SURVEY_FORM: 'COMMON-FORM.SURVEY-FORM',
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
    ORDER_DETAILS: "COMMON-FORM.ORDER-DETAILS",
    CUSTOMER: "COMMON-FORM.CUSTOMER",
    OWNER: "COMMON-FORM.OWNER",
    CLEAN_STATUS: "COMMON-FORM.CLEAN-STATUS",
    CURRENT_STATUS: "COMMON-FORM.CURRENT-STATUS",
    EIR_DATE_TIME: "COMMON-FORM.EIR-DATE-TIME",
    SURVEY_INFO: "COMMON-FORM.SURVEY-INFO",
    DATE_OF_INSPECTION: "COMMON-FORM.DATE-OF-INSPECTION",
    PERIODIC_TEST: "COMMON-FORM.PERIODIC-TEST",
    LAST_TEST: "COMMON-FORM.LAST-TEST",
    NEXT_TEST: "COMMON-FORM.NEXT-TEST",
    TEST_TYPE: "COMMON-FORM.TEST-TYPE",
    DATE: "COMMON-FORM.DATE",
    CLASS: "COMMON-FORM.CLASS",
    IN_GATE_DETAILS: "COMMON-FORM.IN-GATE-DETAILS",
    IN_GATE_REMARKS: "COMMON-FORM.IN-GATE-REMARKS",
    HAULIER: 'COMMON-FORM.HAULIER',
    VEHICLE_NO: 'COMMON-FORM.VEHICLE-NO',
    DRIVER_NAME: 'COMMON-FORM.DRIVER-NAME',
    LAST_UPDATE_BY: 'COMMON-FORM.LAST-UPDATE-BY',
    LAST_UPDATE_ON: 'COMMON-FORM.LAST-UPDATE-ON',
    TANK_DETAILS: 'COMMON-FORM.TANK-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    MANUFACTURER_DOM: 'COMMON-FORM.MANUFACTURER-AND-DOM',
    CLADDING: 'COMMON-FORM.CLADDING',
    CAPACITY: 'COMMON-FORM.CAPACITY',
    TARE_WEIGHT: 'COMMON-FORM.TARE-WEIGHT',
    MAX_GROSS_WEIGHT: 'COMMON-FORM.MAX-GROSS-WEIGHT',
    TANK_HEIGHT: 'COMMON-FORM.TANK-HEIGHT',
    WALKWAY: 'COMMON-FORM.WALKWAY',
    BOTTOM_DISCHARGE_TYPE: 'COMMON-FORM.BOTTOM-DISCHARGE-TYPE',
    COMPARTMENT_TYPE: 'COMMON-FORM.COMPARTMENT-TYPE',
    BACK: 'COMMON-FORM.BACK',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    BOTTOM_DIS_COMP: 'COMMON-FORM.BOTTOM-DIS-COMP',
    FOOT_VALVE: 'COMMON-FORM.FOOT-VALVE',
    BOTTOM_DIS_VALVE: 'COMMON-FORM.BOTTOM-DIS-VALVE',
    THERMOMETER: 'COMMON-FORM.THERMOMETER',
    LADDER: 'COMMON-FORM.LADDER',
    DATA_SCS_TRANSPORT_PLATE: 'COMMON-FORM.DATA-SCS-TRANSPORT-PLATE',
    TOP_DIS_COMP: 'COMMON-FORM.TOP-DIS-COMP',
    TOP_DIS_VALVE: 'COMMON-FORM.TOP-DIS-VALVE',
    AIRLINE_VALVE: 'COMMON-FORM.AIRLINE-VALVE',
    AIRLINE_VALVE_CONNECTIONS: 'COMMON-FORM.AIRLINE-VALVE-CONNECTIONS',
    MANLID_COMPARTMENT: 'COMMON-FORM.MANLID-COMPARTMENT',
    MANLID_COVER: 'COMMON-FORM.MANLID-COVER',
    MANLID_SEAL: 'COMMON-FORM.MANLID-SEAL',
    PV: 'COMMON-FORM.PV',
    SAFETY_HANDRAIL: 'COMMON-FORM.SAFETY-HANDRAIL',
    BUFFER_PLATE: 'COMMON-FORM.BUFFER-PLATE',
    RESIDUE: 'COMMON-FORM.RESIDUE',
    DIPSTICK: 'COMMON-FORM.DIPSTICK',
    SPECIFICATION: 'COMMON-FORM.SPECIFICATION',
    DIAMITER: 'COMMON-FORM.DIAMITER',
    PIECES: 'COMMON-FORM.PIECES',
    VOLUME: 'COMMON-FORM.VOLUME',
    OTHER_COMMENTS: 'COMMON-FORM.OTHER-COMMENTS',
    BRAND: 'COMMON-FORM.BRAND',
    BOTTOM: 'COMMON-FORM.BOTTOM',
    TOP: 'COMMON-FORM.TOP',
    MANLID: 'COMMON-FORM.MANLID',
    FRAME_TYPE: 'COMMON-FORM.FRAME-TYPE',
    LEFT_SIDE: 'COMMON-FORM.LEFT-SIDE',
    REAR_SIDE: 'COMMON-FORM.REAR-SIDE',
    RIGHT_SIDE: 'COMMON-FORM.RIGHT-SIDE',
    TOP_SIDE: 'COMMON-FORM.TOP-SIDE',
    FRONT_SIDE: 'COMMON-FORM.FRONT-SIDE',
    BOTTOM_SIDE: 'COMMON-FORM.BOTTOM-SIDE',
    TANK_PHOTOS: 'COMMON-FORM.TANK-PHOTOS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    MARK_DAMAGE: 'COMMON-FORM.MARK-DAMAGE',
    FILL_IN_REMARKS: 'COMMON-FORM.FILL-IN-REMARKS',
    LEFT_REMARKS: 'COMMON-FORM.LEFT-REMARKS',
    REAR_REMARKS: 'COMMON-FORM.REAR-REMARKS',
    RIGHT_REMARKS: 'COMMON-FORM.RIGHT-REMARKS',
    TOP_REMARKS: 'COMMON-FORM.TOP-REMARKS',
    FRONT_REMARKS: 'COMMON-FORM.FRONT-REMARKS',
    BOTTOM_REMARKS: 'COMMON-FORM.BOTTOM-REMARKS',
    SIDES: 'COMMON-FORM.SIDES',
    SAVE_ERROR: 'COMMON-FORM.SAVE-ERROR',
    DAMAGE_PHOTOS: 'COMMON-FORM.DAMAGE-PHOTOS',
    PREVIEW: 'COMMON-FORM.PREVIEW',
    DELETE: 'COMMON-FORM.DELETE',
    CONFIRM_DELETE: 'COMMON-FORM.CONFIRM-DELETE',
    DELETE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    PREVIEW_PHOTOS: 'COMMON-FORM.PREVIEW-PHOTOS',
    PHOTOS: 'COMMON-FORM.PHOTOS',
    PUBLISH: 'COMMON-FORM.PUBLISH',
    PHONE: 'COMMON-FORM.PHONE',
    FAX: 'COMMON-FORM.FAX',
    EMAIL: 'COMMON-FORM.EMAIL',
    WEB: 'COMMON-FORM.WEB',
    IN_GATE: 'COMMON-FORM.IN-GATE',
    OUT_GATE: 'COMMON-FORM.OUT-GATE',
    EQUIPMENT_INTERCHANGE_RECEIPT: 'COMMON-FORM.EQUIPMENT-INTERCHANGE-RECEIPT',
    TAKE_IN_DATE: 'COMMON-FORM.TAKE-IN-DATE',
    LAST_RELEASE_DATE: 'COMMON-FORM.LAST-RELEASE-DATE',
    TAKE_IN_REFERENCE: 'COMMON-FORM.TAKE-IN-REFERENCE',
    OPERATOR: 'COMMON-FORM.OPERATOR',
    TAKE_IN_STATUS: 'COMMON-FORM.TAKE-IN-STATUS',
    YES: 'COMMON-FORM.YES',
    NO: 'COMMON-FORM.NO',
    BOTTOM_DIS_COMP__ABB: 'COMMON-FORM.BOTTOM-DIS-COMP--ABB',
    BOTTOM_DIS_VALVE__ABB: 'COMMON-FORM.BOTTOM-DIS-VALVE--ABB',
    TOP_DIS_COMP__ABB: 'COMMON-FORM.TOP-DIS-COMP--ABB',
    TOP_DIS_VALVE__ABB: 'COMMON-FORM.TOP-DIS-VALVE--ABB',
    MANLID_COMP__ABB: 'COMMON-FORM.MANLID-COMP--ABB',
    CRN: 'COMMON-FORM.CRN',
    EIR_COMPANY_DECLARATION: 'COMMON-FORM.EIR-COMPANY-DECLARATION',
    EIR_HAULIER_DECLARATION: 'COMMON-FORM.EIR-HAULIER-DECLARATION',
    SURVEY_BY: 'COMMON-FORM.SURVEY-BY',
    REVIEW_BY: 'COMMON-FORM.REVIEW-BY',
    DISCLAIMER: 'COMMON-FORM.DISCLAIMER',
    COMPUTER_GENERATED_NOTE: 'COMMON-FORM.COMPUTER-GENERATED-NOTE',
    DOWNLOAD: 'COMMON-FORM.DOWNLOAD',
    EXPORT_NEW: 'COMMON-FORM.EXPORT-NEW',
    PREVIEW_PDF: 'COMMON-FORM.PREVIEW-PDF',
    EXPORT_SUCCESS: 'COMMON-FORM.EXPORT-SUCCESS',
    IN_SERVICE_ESTIMATE: 'COMMON-FORM.IN-SERVICE-ESTIMATE',
    OFFHIRE_ESTIMATE: 'COMMON-FORM.OFFHIRE-ESTIMATE',
    ESTIMATE_NO: 'COMMON-FORM.ESTIMATE-NO',
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    MANUFACTURER: 'COMMON-FORM.MANUFACTURER',
    DAMAGE_CODE: 'COMMON-FORM.DAMAGE-CODE',
    REPAIR_CODE: 'COMMON-FORM.REPAIR-CODE',
    NO_DOT: 'COMMON-FORM.NO-DOT',
    ITEM: 'COMMON-FORM.ITEM',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    DEPOT_ESTIMATE: 'COMMON-FORM.DEPOT-ESTIMATE',
    CUSTOMER_APPROVAL: 'COMMON-FORM.CUSTOMER-APPROVAL',
    QTY: 'COMMON-FORM.QTY',
    LABOUR: 'COMMON-FORM.LABOUR',
    MATERIAL: 'COMMON-FORM.MATERIAL',
    LESSEE_OWNER__ABB: 'COMMON-FORM.LESSEE-OWNER--ABB',
    REMARKS: 'COMMON-FORM.REMARKS',
    APPROVED_COST: 'COMMON-FORM.APPROVED-COST',
    RATE_PERC: 'COMMON-FORM.RATE-PERC',
    ESTIMATE_COST: 'COMMON-FORM.ESTIMATE-COST',
    FOR: 'COMMON-FORM.FOR',
    NET_COST: 'COMMON-FORM.NET-COST',
    LABOUR_DISCOUNT: 'COMMON-FORM.LABOUR-DISCOUNT',
    MATERIAL_DISCOUNT: 'COMMON-FORM.MATERIAL-DISCOUNT',
    PAGE: 'COMMON-FORM.PAGE',
    OF: 'COMMON-FORM.OF',
    INVOICE_PERIOD: 'COMMON-FORM.INVOICE-PERIOD',
    CUSTOMER_INVOICE: 'MENUITEMS.BILLING.LIST.CUSTOMER-INVOICE',
    LOLO_COST: 'COMMON-FORM.LOLO-COST-REPORT',
    STEAM_COST: 'COMMON-FORM.STEAM-COST-REPORT',
    RESIDUE_COST: 'COMMON-FORM.RESIDUE-COST-REPORT',
    IN_DATE: 'COMMON-FORM.IN-DATE',
    OUT_DATE: 'COMMON-FORM.OUT-DATE',
    TOTAL: 'COMMON-FORM.TOTAL',
    DAYS: 'COMMON-FORM.DAYS',
    GATEIO: 'COMMON-FORM.GATEIO',
    INVENTORY_TYPE: 'COMMON-FORM.INVENTORY-TYPE',
    TANK_ACTIVITY: 'COMMON-FORM.TANK-ACTIVITY',
    SUMMARY_REPORT: 'COMMON-FORM.SUMMARY-REPORT',
    INVENTORY_PERIOD: 'COMMON-FORM.INVENTORY-PERIOD',
    TANK_STATUS: 'COMMON-FORM.TANK-STATUS',
    YARD_STATUS: 'COMMON-FORM.YARD-STATUS',
    TOP_TEN_CUSTOMER: 'COMMON-FORM.TOP-TEN-CUSTOMER',
    OPENING_BALANCE: 'COMMON-FORM.OPENING-BALANCE',
    CLOSING_BALANCE: 'COMMON-FORM.CLOSING-BALANCE',
    LOCATION: 'COMMON-FORM.LOCATION',
    INVENTORY_DATE: 'COMMON-FORM.INVENTORY-DATE',
    DAILY_INVENTORY_SUMMARY: 'MENUITEMS.REPORTS.LIST.INVENTORY-SUMMARY',
    S_N:'COMMON-FORM.S_N',
    

  }

  public pieChartOptions!: Partial<ChartOptions>;
  public columnChartOptions!: Partial<ChartOptions>;
  public horizontalBarOptions!: Partial<HorizontalBarOptions>;

  type?: string | null;
  // steamDS: SteamDS;
  // steamPartDS: SteamPartDS;
  // sotDS: StoringOrderTankDS;
  // ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  repair_guid?: string | null;
  customer_company_guid?: string | null;
  estimate_no?: string | null;

  customerInfo: any = customerInfo;
  disclaimerNote: string = "";
  pdfTitle: string = "";
  repairItem: any;

  last_test_desc?: string = ""

  repairCost?: RepairCostTableItem;
  repList?: any[] = [];
  groupNameCvList: CodeValuesItem[] = [];
  subgroupNameCvList: CodeValuesItem[] = [];
  yesnoCvList: CodeValuesItem[] = [];
  soTankStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  testTypeCvList: CodeValuesItem[] = [];
  testClassCvList: CodeValuesItem[] = [];
  partLocationCvList: CodeValuesItem[] = [];
  damageCodeCvList: CodeValuesItem[] = [];
  chunkedDamageCodeCvList: any[][] = [];
  repairCodeCvList: CodeValuesItem[] = [];
  chunkedRepairCodeCvList: any[][] = [];
  yardCvList: CodeValuesItem[] = [];

  scale = 2.5;
  imageQuality = 0.7;

  generatedPDF: any;
  existingPdf?: any;
  existingPdfSafeUrl?: any;
  isImageLoading$: Observable<boolean> = this.fileManagerService.loading$;
  isFileActionLoading$: Observable<boolean> = this.fileManagerService.actionLoading$;

  private generatingPdfLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  generatingPdfLoading$: Observable<boolean> = this.generatingPdfLoadingSubject.asObservable();
  generatingPdfProgress = 0;
  report_inventory: daily_inventory_summary[] = [];
  date: string = '';
  invType: string = '';
  queryType: number = 0;



  constructor(
    public dialogRef: MatDialogRef<DailyDetailSummaryPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) {
    super();

    this.translateLangText();
    this.InitialDefaultData();

    // this.steamDS = new SteamDS(this.apollo);
    // this.steamPartDS = new SteamPartDS(this.apollo);
    // this.sotDS = new StoringOrderTankDS(this.apollo);
    // this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    // this.repair_guid = data.repair_guid;
    // this.customer_company_guid = data.customer_company_guid;
    // this.estimate_no = data.estimate_no;
    // this.existingPdf = data.existingPdf;
    this.report_inventory = data.report_daily_inventory_summary;
    this.queryType = data.queryType;
    this.invType = data.type;
    this.date = data.date;

    this.processBarCharValue(this.report_inventory);

    this.loadData();
    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);


    //this.onDownloadClick();

  }

  async ngOnInit() {
    this.pdfTitle = this.type === "REPAIR" ? this.translatedLangText.IN_SERVICE_ESTIMATE : this.translatedLangText.OFFHIRE_ESTIMATE;

  }

  async ngAfterViewInit() {
   
    var delay = 2000;
   setTimeout(() => { this.onDownloadClick(); }, delay);
   
  }

  public loadData() {
    const queries = [
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'yardCv', codeValType: 'YARD' },
      // { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      // { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      // { alias: 'yardCv', codeValType: 'YARD' },
      // { alias: 'depotCv', codeValType: 'DEPOT_STATUS' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      if (data.length) {
        this.purposeOptionCvList = data;
        //this.processHorizontalBarValue(this.report_summary_status);
        //this.processCustomerStatus(this.report_summary_status);
      }
    });

    this.cvDS.connectAlias('yardCv').subscribe(data => {
      if (data.length) {
        this.yardCvList = data;
        // this.processTankStatus(this.report_summary_status);
      }

    });


  }

  async getCodeValuesData(): Promise<void> {
    const queries = [
      // { alias: 'groupNameCv', codeValType: 'GROUP_NAME' },
      // { alias: 'yesnoCv', codeValType: 'YES_NO' },
      // { alias: 'TankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      // { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
      // { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
      // { alias: 'partLocationCv', codeValType: 'PART_LOCATION' },
      // { alias: 'damageCodeCv', codeValType: 'DAMAGE_CODE' },
      // { alias: 'repairCodeCv', codeValType: 'REPAIR_CODE' },
      { alias: 'yardCv', codeValType: 'YARD' },
    ];

    await this.cvDS.getCodeValuesByTypeAsync(queries);

    // Wrap all alias connections in promises
    const promises = [


      firstValueFrom(this.cvDS.connectAlias('purposeOptionCvList')).then(data => {
        this.purposeOptionCvList = data || [];

      }),

      firstValueFrom(this.cvDS.connectAlias('yardCv')).then(data => {
        this.yardCvList = data || [];

      }),

    ];

    // Wait for all promises to resolve
    await Promise.all(promises);
  }

  async generatePDF(): Promise<void> {
    const repTableElement = document.getElementById('steam-heating-log-table');
    const summaryElement = document.getElementById('summary-content');

    if (!repTableElement || !summaryElement) {
      console.error('Template element not found');
      return;
    }

    try {
      console.log('Start generate', new Date());
      this.generatingPdfLoadingSubject.next(true);
      this.generatingPdfProgress = 0;

      const rows = Array.from(repTableElement.querySelectorAll('tr'));
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.width; // A4 page width
      const pageHeight = pdf.internal.pageSize.height; // A4 page height
      const leftRightMargin = 5; // Fixed left and right margins
      const leftRightMarginBody = 7.5; // Fixed left and right margins for body
      const topMargin = 5; // Top margin
      const bottomMargin = 5; // Bottom margin

      // Add Header for the first page
      const headerHeight = await this.addHeader(pdf, pageWidth, leftRightMargin, topMargin);
      const footerHeight = await this.addFooter(pdf, pageWidth, pageHeight, leftRightMargin, bottomMargin, 1, 1); // Placeholder footer height calculation
      const usableHeight = pageHeight - topMargin - bottomMargin - footerHeight;

      console.log('Header Height:', headerHeight);
      console.log('Footer Height:', footerHeight);
      console.log('Usable Height:', usableHeight);

      let yOffset = topMargin + headerHeight; // Tracks vertical position on the page
      let currentPage = 1; // Current page number

      const summaryCanvas = await html2canvas(summaryElement, { scale: this.scale });
      const summaryHeight = (summaryCanvas.height * (pageWidth - leftRightMarginBody * 2)) / summaryCanvas.width;
      this.generatingPdfProgress += 20;

      // Calculate total height of rows
      const totalRowHeight = rows.reduce((total, row) => {
        const rowCanvas = document.createElement('canvas');
        rowCanvas.width = row.offsetWidth;
        rowCanvas.height = row.offsetHeight;
        const rowHeight = (row.offsetHeight * (pageWidth - leftRightMarginBody * 2)) / row.offsetWidth;
        return total + rowHeight;
      }, 0);

      // Calculate the total required height
      const totalContentHeight = totalRowHeight + summaryHeight;

      // Calculate total pages
      const totalPages = Math.ceil(totalContentHeight / (usableHeight));
      console.log('Total Pages:', totalPages);

      let rowsCount = rows.length;
      let currentRowCount = 0;
      const rowProgressWeight = 0.7;
      for (const row of rows) {
        // Render each row to canvas
        const rowCanvas = await html2canvas(row as HTMLElement, { scale: this.scale });
        const rowImg = rowCanvas.toDataURL('image/jpeg', this.imageQuality);
        const rowHeight = (rowCanvas.height * (pageWidth - leftRightMarginBody * 2)) / rowCanvas.width;
        currentRowCount++;

        // Check if row fits on the current page
        if (yOffset + rowHeight > usableHeight) {
          console.log('Starting new page...');
          // Add Footer to the current page
          await this.addFooter(pdf, pageWidth, pageHeight, leftRightMargin, bottomMargin, currentPage, totalPages);

          // Start a new page
          pdf.addPage();
          currentPage++;
          yOffset = topMargin;

          // Add Header to the new page
          const newHeaderHeight = await this.addHeader(pdf, pageWidth, leftRightMargin, topMargin);
          yOffset += newHeaderHeight;
        }

        // Add row to the current page
        pdf.addImage(rowImg, 'PNG', leftRightMarginBody, yOffset, pageWidth - leftRightMarginBody * 2, rowHeight);
        yOffset += rowHeight;
        const rowProgress = (rowProgressWeight / rowsCount) * 100;
        this.generatingPdfProgress += rowProgress;
        console.log('generatingPdfProgress', this.generatingPdfProgress);
      }

      // Add summary content
      const summaryImg = summaryCanvas.toDataURL('image/jpeg', this.imageQuality);

      // Calculate remaining space for summary content
      const remainingSpace = pageHeight - yOffset - footerHeight - bottomMargin;

      if (summaryHeight > remainingSpace) {
        console.log('Adding new page for summary...');
        // Add Footer to the current page
        await this.addFooter(pdf, pageWidth, pageHeight, leftRightMargin, bottomMargin, currentPage, totalPages);

        // Start a new page
        pdf.addPage();
        currentPage++;
        yOffset = topMargin;

        // Add Header to the new page
        const newHeaderHeight = await this.addHeader(pdf, pageWidth, leftRightMargin, topMargin);
        yOffset += newHeaderHeight;

        // Align summary content to the bottom of the page
        const newRemainingSpace = pageHeight - footerHeight - bottomMargin;
        yOffset = newRemainingSpace - summaryHeight;
      } else {
        // Align summary content to the bottom of the current page
        yOffset = pageHeight - footerHeight - bottomMargin - summaryHeight;
      }

      pdf.addImage(summaryImg, 'PNG', leftRightMargin, yOffset, pageWidth - leftRightMargin * 2, summaryHeight);

      // Update yOffset after adding summary
      yOffset += summaryHeight;

      // Add Footer to the last page
      await this.addFooter(pdf, pageWidth, pageHeight, leftRightMargin, bottomMargin, currentPage, totalPages);
      this.generatingPdfProgress = 100;

      // Save PDF
      // pdf.save(`ESTIMATE-${this.estimate_no}.pdf`);
      this.generatedPDF = pdf.output('blob');
      this.uploadPdf(this.repairItem?.guid, this.generatedPDF);
      this.generatingPdfLoadingSubject.next(false);
      console.log('End generate', new Date());
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.generatingPdfLoadingSubject.next(false);
    }
  }

  async addHeader(pdf: jsPDF, pageWidth: number, leftRightMargin: number, topMargin: number): Promise<number> {
    const headerElement = document.getElementById('pdf-form-header');
    if (headerElement) {
      const canvas = await html2canvas(headerElement, {
        scale: this.scale,
      });
      const imgData = canvas.toDataURL('image/jpeg', this.imageQuality);

      const availableWidth = pageWidth - leftRightMargin * 2; // Width available between margins
      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', leftRightMargin, topMargin, imgWidth, imgHeight);
      return imgHeight; // Return header height
    }
    return 0;
  }

  async addFooter(pdf: jsPDF, pageWidth: number, pageHeight: number, leftRightMargin: number, bottomMargin: number, currentPage: number, totalPages: number): Promise<number> {
    const footerElement = document.getElementById('pdf-form-footer');
    if (footerElement) {
      // Update dynamic content in the footer
      const currentPageSpan = footerElement.querySelector('#current-page');
      const totalPagesSpan = footerElement.querySelector('#total-pages');
      if (currentPageSpan) currentPageSpan.textContent = currentPage.toString();
      if (totalPagesSpan) totalPagesSpan.textContent = totalPages.toString();

      // Render the footer to a canvas
      const canvas = await html2canvas(footerElement, {
        scale: this.scale, // Set scale to match PDF resolution
      });
      const imgData = canvas.toDataURL('image/jpeg', this.imageQuality);

      // Calculate dimensions for the footer image
      const availableWidth = pageWidth - leftRightMargin * 2;
      const imgWidth = availableWidth; // Width matches the available page width
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      // Add the footer to the PDF
      pdf.addImage(imgData, 'PNG', leftRightMargin, pageHeight - imgHeight - bottomMargin, imgWidth, imgHeight);

      // Return the calculated footer height
      return imgHeight;
    }

    // If no footer element is found, return 0 as the height
    return 0;
  }

  async getImageBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  cleanupTemplate(template: HTMLElement) {
    if (template && template.parentNode) {
      template.parentNode.removeChild(template);
    }
  }



  chunkArray(array: any[], chunkSize: number): any[][] {
    const chunks: any[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  updateData(newData: RepairPartItem[] | undefined): void {

  }

  getGroupSeq(codeVal: string | undefined): number | undefined {
    const gncv = this.groupNameCvList?.filter(x => x.code_val === codeVal);
    if (gncv.length) {
      return gncv[0].sequence;
    }
    return -1;
  }


  displayDamageRepairCode(damageRepair: any[], filterCode: number): string {
    return damageRepair?.filter((x: any) => x.code_type === filterCode && ((!x.delete_dt && x.action !== 'cancel') || (x.delete_dt && x.action === 'rollback'))).map(item => {
      return item.code_cv;
    }).join('/');
  }


  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  parse2Decimal(input: number | string | undefined) {
    return Utility.formatNumberDisplay(input);
  }

  calculateCost() {
    // this.repairCost = this.steamDS.calculateCost(this.repairItem, this.repairItem?.repair_part);
    // console.log(this.repairCost)
  }

  async onDownloadClick() {
    this.exportToPDF_r1();

  }

  downloadFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();

    // Revoke the URL to free memory
    URL.revokeObjectURL(url);
  }



  async uploadPdf(group_guid: string, pdfBlob: Blob) {
    const pdfDescription = 'REPAIR_ESTIMATE';
    const uploadRequest: any = {
      file: pdfBlob,
      metadata: {
        TableName: 'repair',
        FileType: 'pdf',
        GroupGuid: group_guid,
        Description: pdfDescription
      }
    }

    this.fileManagerService.uploadFiles([uploadRequest]).subscribe({
      next: (response) => {
        console.log('Files uploaded successfully:', response);
        if (response?.affected) {
          this.existingPdf = [
            {
              description: pdfDescription,
              url: response?.url?.[0]
            }
          ];
        }
      },
      error: (error) => {
        console.error('Error uploading files:', error);
      },
      complete: () => {
        console.log('Upload process completed.');
      }
    });
  }

  deleteFile() {
    if (this.existingPdf?.[0]?.url) {
      this.fileManagerService.deleteFile([this.existingPdf?.[0]?.url]).subscribe({
        next: (response) => {
          console.log('Files delete successfully:', response);
          this.generatePDF();
        },
        error: (error) => {
          console.error('Error delete files:', error);
        },
        complete: () => {
          console.log('Delete process completed.');
        }
      });
    }
  }

  @ViewChild('pdfTable') pdfTable!: ElementRef; // Reference to the HTML content

  async exportToPDF_r1(fileName: string = 'document.pdf') {
    const pageWidth = 210; // A4 width in mm (portrait)
    const pageHeight = 297; // A4 height in mm (portrait)
    const leftMargin = 10;
    const rightMargin = 10;
    const topMargin = 5;
    const bottomMargin = 5;
    const contentWidth = pageWidth - leftMargin - rightMargin;
    const maxContentHeight = pageHeight - topMargin - bottomMargin;

    this.generatingPdfLoadingSubject.next(true);
    this.generatingPdfProgress = 0;

    const pdf = new jsPDF('p', 'mm', 'a4'); // Changed orientation to portrait
    // const pdf = new jsPDF({
    //   orientation: 'portrait',
    //   unit: 'pt',
    //   format: 'a4',
    //   putOnlyUsedFonts: true,
    //   compress: true
    // });
    
    let pageNumber = 1;

    let reportTitleCompanyLogo = 32;
    let tableHeaderHeight = 12;
    let tableRowHeight = 8.5;
    let minHeightHeaderCol = 3;
    let minHeightBodyCell = 5;
    let fontSz = 7;
    const pagePositions: { page: number; x: number; y: number }[] = [];
    // const progressValue = 100 / cardElements.length;

    const reportTitle = this.GetReportTitle();
    const headers = [[
      this.translatedLangText.S_N, this.translatedLangText.CUSTOMER_CODE,
      this.translatedLangText.CUSTOMER, this.translatedLangText.IN_GATE,
      this.translatedLangText.OUT_GATE
    ]];

    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: 'middle', cellWidth: 15, minCellHeight: minHeightBodyCell },
      1: { halign: 'center', valign: 'middle', cellWidth: 35,  minCellHeight: minHeightBodyCell },
      2: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      3: { halign: 'center', valign: 'middle', cellWidth: 25, minCellHeight: minHeightBodyCell },
      4: { halign: 'center', valign: 'middle', cellWidth: 25, minCellHeight: minHeightBodyCell },
    };

    // Define headStyles with valid fontStyle
    const headStyles: Partial<Styles> = {
      fillColor: [211, 211, 211], // Background color
      textColor: 0, // Text color (white)
      fontStyle: "bold", // Valid fontStyle value
      halign: 'center', // Centering header text
      valign: 'middle',
      lineColor: 201,
      lineWidth: 0.1
    };

    let currentY = topMargin;
    let scale = this.scale;
    pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });


    await Utility.addHeaderWithCompanyLogo_Portriat(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    await Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 38);

    // Variable to store the final Y position of the last table
    let lastTableFinalY = 40;
    let startY = lastTableFinalY + 13; // Start table 20mm below the customer name
    const data: any[][] = []; // Explicitly define data as a 2D array
    //  pdf.setFontSize(8);
    //  pdf.setTextColor(0, 0, 0); // Black text

  const invDate = `${this.translatedLangText.INVENTORY_PERIOD}:  ${this.date}`; // Replace with your actual cutoff date
    Utility.AddTextAtRightCornerPage(pdf, invDate, pageWidth, leftMargin, rightMargin + 5, lastTableFinalY + 8, 8)

    
    if (this.report_inventory.length > 0) {
      if ((this.report_inventory[0].opening_balance?.length || 0) > 0) {

        startY = lastTableFinalY + 15;
        const subHeaders = [[
          this.translatedLangText.S_N, this.translatedLangText.LOCATION,
          this.translatedLangText.OPENING_BALANCE, this.translatedLangText.IN_GATE,
          this.translatedLangText.OUT_GATE, this.translatedLangText.CLOSING_BALANCE
        ]];

        const subComStyles: any = {
          // Set columns 0 to 16 to be center aligned
          0: { halign: 'center', cellWidth: 10, minCellHeight: minHeightBodyCell },
          1: { halign: 'center', minCellHeight: minHeightBodyCell },
          2: { halign: 'center', cellWidth: 30, minCellHeight: minHeightBodyCell },
          3: { halign: 'center', cellWidth: 30, minCellHeight: minHeightBodyCell },
          4: { halign: 'center', cellWidth: 30, minCellHeight: minHeightBodyCell },
          5: { halign: 'center', cellWidth: 30, minCellHeight: minHeightBodyCell },
        };
        idx = 0;
        const subData: any[][] = [];
        for (let n = 0; n < (this.report_inventory[0].opening_balance?.length || 0); n++) {
          //let startY = lastTableFinalY + 15; // Start Y position for the current table
          let itm = this.report_inventory[0].opening_balance?.[n];
          subData.push([
            (++idx).toString(), this.DisplayYard(String(itm!.yard!)) || "", itm!.open_balance || "0",
            itm!.in_count || "0", itm!.out_count || "0", this.displayClosingBalanceForYard(itm) || "0"
          ]);
        }
        subData.push([this.translatedLangText.TOTAL, "", this.displayOpeningBalance(), this.displayTotalInGate(),
        this.displayTotalOutGate(), this.displayClosingBalance()]);

        autoTable(pdf, {
          head: subHeaders,
          body: subData,
          startY: startY - 5, // Start table at the current startY value
          
          theme: 'grid',
          styles: {
            fontSize: fontSz,
            minCellHeight: minHeightHeaderCol
          },
          columnStyles: subComStyles,
          headStyles: headStyles, // Custom header styles
          bodyStyles: {
            fillColor: [255, 255, 255],
            //halign: 'left', // Left-align content for body by default
            //valign: 'middle', // Vertically align content
          },
          didParseCell: (data: any) => {
            let lastRowIndex = data.table.body.length - 1; // Ensure the correct last row index
            if (data.row.index === lastRowIndex) {
              data.cell.styles.fillColor = [221, 221, 221]; // Light gray background
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.valign = 'middle'; // Center text vertically
              if (data.column.index === 0) {
                data.cell.colSpan = 2;  // Merge 4 columns into one
                data.cell.styles.halign = 'right'; // Center text horizontally
              }
            }
            if (data.row.index === idx && data.column.index > 0 && data.column.index < 2) {
              data.cell.text = ''; // Remove text from hidden columns
              data.cell.colSpan = 0; // Hide these columns
            }
          },
          didDrawPage: (d: any) => {
            const pageCount = pdf.getNumberOfPages();

            lastTableFinalY = d.cursor.y;

            var pg = pagePositions.find(p => p.page == pageCount);
            if (!pg) {
              pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
              if (pageCount > 1) {
                Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin+5);
              }
            }

          },
        });

      }
    }

    startY = lastTableFinalY + 10; 

  
    // pdf.text(invDate, pageWidth - rightMargin, lastTableFinalY + 10, { align: "right" });

    var idx = 0;
    for (let n = 0; n < this.report_inventory.length; n++) {

      //let startY = lastTableFinalY + 15; // Start Y position for the current table
      let itm = this.report_inventory[n];
      data.push([
        (++idx).toString(), itm.code || "", itm.name || "0",
        this.displayInGate(itm) || "0", this.displayOutGate(itm) || "0"
      ]);
    }

    data.push([this.translatedLangText.TOTAL, "", "", this.displayTotalInGate(), this.displayTotalOutGate()]);
    autoTable(pdf, {
      head: headers,
      body: data,
      startY: startY, // Start table at the current startY value
      theme: 'grid',
      styles: {
        fontSize: fontSz,
        minCellHeight: minHeightHeaderCol

      },
      columnStyles: comStyles,
      headStyles: headStyles, // Custom header styles
      bodyStyles: {
        fillColor: [255, 255, 255],
        //halign: 'left', // Left-align content for body by default
        //valign: 'middle', // Vertically align content
      },
      didParseCell: (data: any) => {
        let lastRowIndex = data.table.body.length - 1; // Ensure the correct last row index
        if (data.row.index === lastRowIndex) {
          data.cell.styles.fillColor = [221, 221, 221]; // Light gray background
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.valign = 'middle'; // Center text vertically
          if (data.column.index === 0) {
            data.cell.colSpan = 3;  // Merge 4 columns into one
            data.cell.styles.halign = 'right'; // Center text horizontally


          }
        }
        if (data.row.index === idx && data.column.index > 0 && data.column.index <= 2) {
          data.cell.text = ''; // Remove text from hidden columns
          data.cell.colSpan = 0; // Hide these columns
        }
      },
      didDrawPage: (d: any) => {
        const pageCount = pdf.getNumberOfPages();

        lastTableFinalY = d.cursor.y;

        var pg = pagePositions.find(p => p.page == pageCount);
        if (!pg) {
          pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
          if (pageCount > 1) {
            Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin+5);
          }
        }

      },
    });

    

      pdf.addPage();

      await this.AddOverviewSummary(pdf,topMargin,pageNumber,pageWidth,pageHeight,rightMargin,leftMargin,
        minHeightBodyCell,minHeightHeaderCol,bottomMargin,pagePositions);




    const totalPages = pdf.getNumberOfPages();


    pagePositions.forEach(({ page, x, y }) => {
      pdf.setDrawColor(0, 0, 0); // black line color
      pdf.setLineWidth(0.1);
      pdf.setLineDashPattern([0.001, 0.001], 0);
      pdf.setFontSize(8);
      pdf.setPage(page);
      var lineBuffer = 13;
      pdf.text(`Page ${page} of ${totalPages}`, pdf.internal.pageSize.width - 14, pdf.internal.pageSize.height - 8, { align: 'right' });
      pdf.line(leftMargin, pdf.internal.pageSize.height - lineBuffer, (pageWidth - rightMargin - 4), pdf.internal.pageSize.height - lineBuffer);
    });

    this.generatingPdfProgress = 100;
    //pdf.save(fileName);
    this.generatingPdfProgress = 0;
    this.generatingPdfLoadingSubject.next(false);
    Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
    this.dialogRef.close();
  }


  async AddOverviewSummary(pdf:jsPDF,topMargin:number,pageNumber:number,
    pageWidth:number,pageHeight:number,
    rightMargin:number,leftMargin:number,
    minHeightBodyCell:number,minHeightHeaderCol:number,
    bottomMargin:number,pagePositions:any[])
  {
    const tablewidth=10;
    const fontSz=6;
    const contentWidth = pageWidth - leftMargin - rightMargin;
    const chartContentWidth= contentWidth ;
    const reportTitle = this.GetReportTitle();
    // const headers = [[
    //   this.translatedLangText.DESCRIPTION,
    //   this.translatedLangText.NO_OF_TANKS
    // ]];

    const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    // Define headStyles with valid fontStyle
    const headStyles: Partial<Styles> = {
      fillColor: [211, 211, 211], // Background color
      textColor: 0, // Text color (white)
      fontStyle: "bold", // Valid fontStyle value
      halign: 'center', // Centering header text
      valign: 'middle',
      lineColor: 201,
      lineWidth: 0.1
    };

    let currentY = topMargin;
    let scale = this.scale;


    await Utility.addHeaderWithCompanyLogo_Portriat(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    await Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 38);


 pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });
    var gap = 8;

    let lastTableFinalY = 40;




     const invDate = `${this.translatedLangText.INVENTORY_PERIOD}:  ${this.date}`; // Replace with your actual cutoff date
    Utility.AddTextAtRightCornerPage(pdf, invDate, pageWidth, leftMargin, rightMargin , lastTableFinalY + 8, 8)

   

    let startY = lastTableFinalY + 10;
    let startX = pageWidth - rightMargin - tablewidth;

   
    //Add table using autoTable plugin

    const headers = [[
      this.translatedLangText.OPENING_BALANCE, this.translatedLangText.IN_GATE,
      this.translatedLangText.OUT_GATE, this.translatedLangText.CLOSING_BALANCE,
    ]];

    var cWidth =contentWidth/4;
    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: 'middle', cellWidth: cWidth,minCellHeight: minHeightBodyCell },
      1: { halign: 'center', valign: 'middle', cellWidth: cWidth,minCellHeight: minHeightBodyCell },
      2: { halign: 'center', valign: 'middle', cellWidth: cWidth,minCellHeight: minHeightBodyCell },
      3: { halign: 'center', valign: 'middle', cellWidth: cWidth, minCellHeight: minHeightBodyCell },
    };

    const data: any[][] = [];
    data.push([this.displayOpeningBalance(),this.displayTotalInGate(),this.displayTotalOutGate(),this.displayClosingBalance()]);
    
    //var bufferX:number =65;
    autoTable(pdf, {
      head: headers,
      body: data,
      startY: startY , // Start table at the current startY value
      margin: { left: leftMargin },
      theme: 'grid',
      styles: {
        fontSize: fontSz,
        minCellHeight: minHeightHeaderCol

      },
      columnStyles: comStyles,
      headStyles: headStyles, // Custom header styles
      bodyStyles: {
        fillColor: [255, 255, 255],
        halign: 'center', // Left-align content for body by default
        valign: 'middle', // Vertically align content
      },
      didDrawPage: (data: any) => {
        const pageCount = pdf.getNumberOfPages();

       // if (pageCount > 1) Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin+5);
        // Capture the final Y position of the table
        lastTableFinalY = data.cursor.y;
        var pg = pagePositions.find(p => p.page == pageCount);
        if (!pg) pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
      },
    });


    var bufferY :number=10;
    startY =lastTableFinalY +bufferY;
     if (cardElements.length > 0) {
      const card = cardElements[0];
      const canvas = await html2canvas(card, { scale: scale });
      let imgData = canvas.toDataURL('image/JPEG', this.imageQuality);
      const imgHeight = (canvas.height * chartContentWidth) / canvas.width;
      pdf.addImage(imgData, 'JPG', leftMargin, startY, chartContentWidth, imgHeight);
    }
    

  }



  async CopyCanvas(canvas: HTMLCanvasElement, sx: number, sy: number, sw: number, sh: number): Promise<HTMLCanvasElement> {


    const splitCanvas = document.createElement('canvas');
    splitCanvas.width = sw;
    splitCanvas.height = sh;

    const ctx = splitCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, splitCanvas.width, splitCanvas.height);
    }

    return splitCanvas;
  }
  async exportToPDF_r2(fileName: string = 'document.pdf') {
    const pageWidth = 210; // A4 width in mm (portrait)
    const pageHeight = 297; // A4 height in mm (portrait)
    const leftMargin = 10; // Left margin
    const rightMargin = 10; // Right margin
    const topMargin = 20; // Top margin for header
    const bottomMargin = 20; // Bottom margin for footer
    const contentWidth = pageWidth - leftMargin - rightMargin; // Usable width
    const maxContentHeight = pageHeight - topMargin - bottomMargin; // Usable height

    this.generatingPdfLoadingSubject.next(true);
    this.generatingPdfProgress = 0;

    const pdf = new jsPDF('p', 'mm', 'a4'); // Change orientation to portrait ('p')
    const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    let pageNumber = 1;
    let totalPages = 1;

    // Store page positions for later text update
    const pagePositions: { page: number; x: number; y: number }[] = [];
    const progressValue = 100 / cardElements.length;

    const reportTitle = this.GetReportTitle(); // Set your report title here

    // Add header to the first page
    this.addHeader_r1(pdf, reportTitle, pageWidth, leftMargin, rightMargin);

    let currentY = topMargin; // Start Y position after the header

    for (let i = 0; i < cardElements.length; i++) {
      const card = cardElements[i];

      // Convert card to image (JPEG format)
      const canvas = await html2canvas(card, { scale: this.scale });
      const imgData = canvas.toDataURL('image/jpeg', this.imageQuality); // Convert to JPEG with specified quality

      const imgHeight = (canvas.height * contentWidth) / canvas.width; // Adjust height proportionally

      // Check if the card fits on the current page
      if (currentY + imgHeight > maxContentHeight) {
        // Add page number to the current page before creating a new one
        pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 2 });

        // Add a new page
        pdf.addPage();
        pageNumber++;
        totalPages++;

        // Reset Y position for the new page
        currentY = topMargin;

        // Add the report title and underline to the new page
        this.addHeader_r1(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
      }

      // Add the card image to the PDF
      pdf.addImage(imgData, 'JPEG', leftMargin, currentY, contentWidth, imgHeight);

      // Update the Y position for the next card
      currentY += imgHeight + 10; // Add a small gap between cards

      // Update progress
      this.generatingPdfProgress += progressValue;
    }

    // Add page numbers in a second pass
    pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 2 }); // Add last page number
    pagePositions.forEach(({ page, x, y }) => {
      pdf.setPage(page);
      pdf.setFontSize(10);
      pdf.text(`Page ${page} of ${totalPages}`, x, y, { align: 'right' });
    });

    // Save the PDF
    this.generatingPdfProgress = 100;
    pdf.save(fileName);
    this.generatingPdfProgress = 0;
    this.generatingPdfLoadingSubject.next(false);
  }

  // Helper function to add the header (title and underline) to a page
  addHeader_r1(pdf: jsPDF, title: string, pageWidth: number, leftMargin: number, rightMargin: number) {
    const titleWidth = pdf.getStringUnitWidth(title) * pdf.getFontSize() / pdf.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2; // Centering the title

    pdf.setFontSize(14); // Title font size
    pdf.text(title, titleX, 15); // Position it at the top

    // Draw underline for the title
    pdf.setLineWidth(0.5); // Set line width for underline
    pdf.line(titleX, 17, titleX + titleWidth, 17); // Draw the line under the title
  }
  async exportToPDF(fileName: string = 'document.pdf') {
    this.generatingPdfLoadingSubject.next(true);
    this.generatingPdfProgress = 0;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const leftMargin = 10; // Left margin
    const rightMargin = 10; // Right margin
    const contentWidth = 210 - leftMargin - rightMargin; // 190mm usable width
    const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    let pageNumber = 1;
    let totalPages = 0;

    // Store page positions for later text update
    const pagePositions: { page: number; x: number; y: number }[] = [];
    const progressValue = 100 / cardElements.length;

    const reportTitle = this.GetReportTitle();  // Set your report title here

    // Set font for the title
    pdf.setFontSize(14); // Title font size

    for (let i = 0; i < cardElements.length; i++) {
      const card = cardElements[i];

      // Convert card to image (JPEG format)
      const canvas = await html2canvas(card, { scale: this.scale });
      const imgData = canvas.toDataURL('image/jpeg', this.imageQuality); // Convert to JPEG with 80% quality

      const imgHeight = (canvas.height * contentWidth) / canvas.width; // Adjust height proportionally

      // Add the report title at the top of every page, centered
      const titleWidth = pdf.getStringUnitWidth(reportTitle) * pdf.getFontSize() / pdf.internal.scaleFactor;
      const titleX = (210 - titleWidth) / 2; // Centering the title (210mm is page width)

      const pos = 15;
      pdf.text(reportTitle, titleX, pos); // Position it at the top

      // Draw underline for the title
      pdf.setLineWidth(0.5); // Set line width for underline
      pdf.line(titleX, pos + 2, titleX + titleWidth, pos + 2); // Draw the line under the title

      // If card height exceeds A4 page height, split across multiple pages
      if (imgHeight > 277) { // 297mm (A4 height) - 20mm (top & bottom margins)
        let yPosition = 0;
        while (yPosition < canvas.height) {
          const sectionCanvas = document.createElement('canvas');
          sectionCanvas.width = canvas.width;
          sectionCanvas.height = Math.min(1122, canvas.height - yPosition); // A4 height in pixels

          const sectionCtx = sectionCanvas.getContext('2d');
          sectionCtx?.drawImage(canvas, 0, -yPosition);

          const sectionImgData = sectionCanvas.toDataURL('image/jpeg', this.imageQuality); // Convert section to JPEG

          pdf.addImage(sectionImgData, 'JPEG', leftMargin, 20, contentWidth, (sectionCanvas.height * contentWidth) / canvas.width); // Adjust y position to leave space for the title

          // Store page position for page numbering
          pagePositions.push({ page: pageNumber, x: 200, y: 287 });

          yPosition += sectionCanvas.height;
          if (yPosition < canvas.height) {
            pdf.addPage();
            pageNumber++;
            pdf.text(reportTitle, titleX, 10); // Add title on new page
            pdf.line(titleX, 12, titleX + titleWidth, 12); // Draw underline on new page
          }
        }
      } else {
        if (i > 0) pdf.addPage(); // New page for each card
        pdf.addImage(imgData, 'JPEG', leftMargin, 20, contentWidth, imgHeight); // Adjust y position to leave space for the title

        // Store page position for page numbering
        pagePositions.push({ page: pageNumber, x: 200, y: 287 });
      }
      pageNumber++;
      this.generatingPdfProgress += progressValue;
    }

    totalPages = pageNumber - 1;

    // Add page numbers in a second pass
    pagePositions.forEach(({ page, x, y }) => {
      pdf.setPage(page);
      pdf.setFontSize(10);
      pdf.text(`Page ${page} of ${totalPages}`, x, y, { align: 'right' });
    });

    this.generatingPdfProgress = 100;
    pdf.save(fileName);
    this.generatingPdfProgress = 0;
    this.generatingPdfLoadingSubject.next(false);
  }


  GeneratedDate(): string {
    return Utility.convertDateToStr(new Date());
  }
  GetReportTitle(): string {
    return `${this.translatedLangText.DAILY_INVENTORY_SUMMARY}`
  }

  processCustomerStatus(repStatus: report_status[]) {
    if (this.columnChartOptions.xaxis) {
      const topTenReports = repStatus
        .sort((a, b) => (b.number_tank ?? 0) - (a.number_tank ?? 0)) // Sort in descending order
        .slice(0, 10); // Get the top 10

      var categories: any = [
      ];
      topTenReports.map(p =>

        categories.push(p.code)
      );

      var series: any = [];

      this.purposeOptionCvList.map(c => {

        var values: number[] = [];
        switch (c.code_val) {
          case "STEAM":
            topTenReports.forEach(t => {
              var value: number = 0;
              t.yards?.forEach(y => {
                value += Number(y.noTank_steam || 0);
              });
              values.push(value);
            });
            series.push({ name: c.description, data: values });
            break;
          case "CLEANING":
            topTenReports.forEach(t => {
              var value: number = 0;
              t.yards?.forEach(y => {
                value += Number(y.noTank_clean || 0);
              });
              values.push(value);
            });
            series.push({ name: c.description, data: values });
            break;
          case "REPAIR":
            topTenReports.forEach(t => {
              var value: number = 0;
              t.yards?.forEach(y => {
                value += Number(y.noTank_repair || 0);
              });
              values.push(value);
            });
            series.push({ name: c.description, data: values });
            break;
          case "STORAGE":
            topTenReports.forEach(t => {
              var value: number = 0;
              t.yards?.forEach(y => {
                value += Number(y.noTank_storage || 0);
              });
              values.push(value);
            });
            series.push({ name: c.description, data: values });
            break;
          case "IN_SURVEY":
            topTenReports.forEach(t => {
              var value: number = 0;
              t.yards?.forEach(y => {
                value += Number(y.noTank_in_survey || 0);
              });
              values.push(value);
            });
            series.push({ name: c.description, data: values });
            break;
        }
      });


      this.columnChartOptions.xaxis = {
        type: 'category',
        categories: categories,
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
      };
      //categories;


      this.columnChartOptions.series = series;
    }
  }
  processTankStatus(repStatus: report_status[]) {
    var yardInfo: any = [
    ];
    this.yardCvList.map(p => {

      yardInfo.push({ code: p.code_val, name: p.description, value: 0 });
    });
    repStatus.map(r => {
      r.yards?.map(y => {
        var yInfo = yardInfo.find((i: { code: string, name: string, value: number }) => (i.code === y.code));
        if (yInfo) {
          yInfo.value += Number(y.noTank_repair) + Number(y.noTank_steam) + Number(y.noTank_clean) + Number(y.noTank_storage) + Number(y.noTank_in_survey);
        }
      });
    });
    var labels: any = [];
    var series: any = [];
    yardInfo.forEach((y: { code: string, name: string, value: number }) => {
      labels.push(y.name);
      series.push(y.value);
    });

    this.pieChartOptions.labels = labels;
    this.pieChartOptions.series2 = series;
  }

  processHorizontalBarValue(repStatus: report_status[]) {
    var singleValues: any = [
    ];
    this.purposeOptionCvList.map(p => {

      singleValues.push({ name: p.description, value: 0 });
    });
    repStatus.map(r => {
      r.yards?.map(y => {
        this.purposeOptionCvList.map(p => {
          var s = singleValues.find((g: { name: string }) => (g.name === p.description));
          if (s) {
            switch (p.code_val) {
              case "STEAM":
                s.value += y.noTank_steam;
                break;
              case "CLEANING":
                s.value += y.noTank_clean;
                break;
              case "OFFHIRE":
              case "REPAIR":
                s.value += y.noTank_repair;
                break;
              case "STORAGE":
                s.value += y.noTank_storage;
                break;
              case "IN_SURVEY":
                s.value += y.noTank_in_survey;
                break;
            }
          }
        });

      });
      //let s = singleValues.find(s=>s.name===r.)
    });

    this.horizontalBarOptions.single = singleValues.filter((s: { name: string }) => s.name != "Offhire");
  }

  InitialDefaultData() {
    // pie chart
    this.pieChartOptions = {
      chart: {
        width: 360,
        type: 'pie',
        foreColor: '#9aa0ac',
        toolbar: {
          show: true,
        },
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      series2: [44, 55, 13, 43, 22],
      series: [
        {
          name: 'PRODUCT A',
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: 'PRODUCT B',
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: 'PRODUCT C',
          data: [11, 17, 15, 15, 21, 14],
        },
        {
          name: 'PRODUCT D',
          data: [21, 7, 25, 13, 22, 8],
        },
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      xaxis: {
        type: 'category',
        categories: [
          '2018-09-19T00:00:00',
          '2018-09-19T01:30:00',
          '2018-09-19T02:30:00',
          '2018-09-19T03:30:00',
          '2018-09-19T04:30:00',
        ],
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
      },
    };
    // radar chart

    this.columnChartOptions = {
      chart: {
        height: 350,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -5,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          // endingShape: 'rounded',
          columnWidth: '180%',
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      series: [
        {
          name: 'PRODUCT A',
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: 'PRODUCT B',
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: 'PRODUCT C',
          data: [11, 17, 15, 15, 21, 14],
        },
        {
          name: 'PRODUCT D',
          data: [21, 7, 25, 13, 22, 8],
        },
      ],
      xaxis: {
        type: 'category',
        categories: [
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
        ],
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
      },
      yaxis: {
        // labels: {
        //   show:false,
        //   style: {
        //     colors: ['#000000'],
        //   },
        // },
      },
      legend: {
        position: 'bottom',
        offsetY: 0,
      },
      fill: {
        opacity: 1,
      },
    };

    this.horizontalBarOptions = {
      hbarxAxisLabel: this.translatedLangText.NO_OF_TANKS,
      showXAxis: true,
      showYAxis: true,
      gradient: false,
      showLegend: false,
      showXAxisLabel: true,
      showYAxisLabel: true,
      legendPosition: LegendPosition.Right,
      timeline: true,
      colorScheme: {
        domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB'],
        group: ScaleType.Ordinal,
        selectable: true,
        name: 'Customer Usage',
      },
      showLabels: true,
      // data goes here
      single: [
        {
          name: 'China',
          value: 2243772,
        },
        {
          name: 'USA',
          value: 1826000,
        },
        {
          name: 'India',
          value: 1173657,
        },
        {
          name: 'Japan',
          value: 857363,
        },
        {
          name: 'Germany',
          value: 496750,
        },
        {
          name: 'France',
          value: 204617,
        },
      ]
    };

    this.barChartOptions = {
      legend: {
        offsetY: 10,
        show: true,
        position: 'bottom',
        formatter: function (seriesName: string, opts?: any) {
          return seriesName; // Return the series name as is
        },
        fontSize: '9px', // Adjust font size
        width: 300, // Set a fixed width for the legend container
        height: 50,
        itemMargin: {
          horizontal: 2, // Reduce horizontal spacing between legend items
          vertical: 0,
        },
      },
      animations: {
        enabled: false,
        easing: 'linear',
        speed: 0,
        animateGradually: {
          enabled: false,
          delay: 0
        },
        dynamicAnimation: {
          enabled: false,
          speed: 0
        }
      },
      series: [
        {
          name: 'Net Profit',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        {
          name: 'Revenue',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        },
        {
          name: 'Free Cash Flow',
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
        },
      ],
      chart: {
        type: 'bar',
        
        height: 350,
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: false,
          color: '#bbb',
          top: 3,
          left: 2,
          blur: 3,
          opacity: 1,
        }
        
      },
      stroke: {
        width: 7,
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '10%',
          borderRadius: 3,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val; // Display the value as is
        },
        offsetY: -20, // Move the labels upward by 20 pixels
        style: {
          fontSize: '12px',
          colors: ['#9aa0ac'],
        },
      },
      xaxis: {
        categories: [
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
        ],
        labels: {
          style: {
            colors: '#9aa0ac',

          },
        },
      },
     yaxis: {
        title: {
          text: '$ (thousands)',
        },
        labels: {
          formatter: function (val: number) {
            return Number.isInteger(val) ? val.toString() : '';
          },
        },
        forceNiceScale: true,
        tickAmount: 5, // Adjust based on your data range
        decimalsInFloat: 0
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  displayOpeningBalance() {
    var OpenBal: number = 0;
    OpenBal = this.report_inventory?.[0]?.opening_balance?.reduce((total, item) => {
      return total + (item.open_balance ?? 0);
    }, 0) || 0;

    return OpenBal;
  }

  displayOutGate(dailyInv: daily_inventory_summary) {
    return dailyInv.out_gate_count || 0;
  }
  displayInGate(dailyInv: daily_inventory_summary) {
    return dailyInv.in_gate_count || 0;
  }
  displayTotalInGate() {
    var totalInGate: number = 0;
    totalInGate = this.report_inventory?.reduce((total, item) => {
      return total + (item.in_gate_count ?? 0);
    }, 0) || 0;

    return totalInGate;
  }

  displayTotalOutGate() {
    var totalOutGate: number = 0;
    totalOutGate = this.report_inventory?.reduce((total, item) => {
      return total + (item.out_gate_count ?? 0);
    }, 0) || 0;

    return totalOutGate;

  }

  displayClosingBalanceForYard(openBal?: openingBalance) {
    return (openBal?.open_balance || 0) + (openBal?.in_count || 0) - (openBal?.out_count || 0);
  }

  displayClosingBalance() {
    var openBal = this.displayOpeningBalance();
    var inGate = this.displayTotalInGate();
    var outGate = this.displayTotalOutGate();
    return openBal + inGate - outGate;
  }

  DisplayYard(yard: string): string {

    return this.cvDS.getCodeDescription(yard, this.yardCvList) || '';;
  }

  processBarCharValue(repInv: daily_inventory_summary[]) {
    if (this.barChartOptions.xaxis) {
      var categories: any = [
      ];
      var series: any = [];
      var in_gate_tank_no: number[] = [];
      var out_gate_tank_no: number[] = [];
      var all_values: number[] = [];
      repInv.map(c => {
        categories.push(c.code)
        in_gate_tank_no.push(c.in_gate_count || 0);
        out_gate_tank_no.push(c.out_gate_count || 0);
        all_values.push(c.in_gate_count || 0);
        all_values.push(c.out_gate_count || 0);

      });

      const maxValue = Math.max(...all_values); // Find the maximum value in the data
      const maxYAxisValue = Math.round(maxValue * 1.5); // Add 10% to the maximum value
      const computedTickAmount = maxYAxisValue + 1; // since range starts at 0
      const tickAmount = computedTickAmount < 5 ? computedTickAmount : undefined;
      var series: any;
      if (this.queryType == 3) {
        series = [
          {
            name: this.translatedLangText.IN_GATE,
            data: in_gate_tank_no
          },
          {
            name: this.translatedLangText.OUT_GATE,
            data: out_gate_tank_no
          }
        ];
      } else if (this.queryType == 1) {
        series = [
          {
            name: this.translatedLangText.IN_GATE,
            data: in_gate_tank_no
          },
          {
            name: this.translatedLangText.OUT_GATE,
            data: []
          }
        ];
      }
      else {
        series = [
          {
            name: this.translatedLangText.IN_GATE,
            data: []
          },
          {
            name: this.translatedLangText.OUT_GATE,
            data: out_gate_tank_no
          }
        ];
      }

      this.barChartOptions.xaxis = {
        type: 'category',
        categories: categories,
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
      };
      //categories;

      this.barChartOptions.yaxis = {
       // max: maxYAxisValue,
        min: 0,
        max: function (max: number) {
          return max * 1.2; // Increase max by 20%
        },
        title: {
          text: `${this.translatedLangText.NO_OF_TANKS}`,
        },
        labels: {
          align: 'right', // Align labels to the right
          minWidth: 50,   // Set a minimum width for the labels
          maxWidth: 100,  // Set a maximum width for the labels
          offsetX: 10,    // Add horizontal offset to the labels
          formatter: (value: number) => {
           return Math.round(value).toString(); // Return string, not number
          },
        },
        forceNiceScale: true,
        ...(tickAmount ? { tickAmount } : {}), // Only include tickAmount if it's valid
        decimalsInFloat: 0
      }
      // if(series.length==1)
      //    if(series[0].data.length==1)
      //    {
      //      series[0].data.push(0);
      //    }
      this.barChartOptions.series = series;
      this.barChartOptions!.chart!.events = {

       
      }
    }
  }
  
}
