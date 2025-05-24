import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { Utility } from 'app/utilities/utility';
import { customerInfo } from 'environments/environment';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BehaviorSubject, delay, firstValueFrom, Observable } from 'rxjs';
// import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { FileManagerService } from '@core/service/filemanager.service';
import { BarChartModule, Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { RepairCostTableItem } from 'app/data-sources/repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { AdminReportYearlyReport, report_status } from 'app/data-sources/reports';
import { Styles ,autoTable } from 'jspdf-autotable';
import {
  ApexAxisChartSeries, ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers, ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
  
} from 'ng-apexcharts';




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
  showDataLabel?: boolean;
  // data goes here
  single?: any;
  hbarxAxisLabel?: string;
};

export type ChartOptions = {
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
  repData: AdminReportYearlyReport,
   date:string,
   repType:string,
   customer:string

}

@Component({
  selector: 'app-yearly-chart-pdf',
  templateUrl: './yearly-chart-pdf.component.html',
  styleUrls: ['./yearly-chart-pdf.component.scss'],
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
  ],
})
export class YearlyChartPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  translatedLangText: any = {};
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
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
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
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
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
    DELETE_SUCCESS: 'COMMON-FORM.DELETE-SUCCESS',
    PREVIEW_PHOTOS: 'COMMON-FORM.PREVIEW-PHOTOS',
    PHOTOS: 'COMMON-FORM.PHOTOS',
    PUBLISH: 'COMMON-FORM.PUBLISH',
    PHONE: 'COMMON-FORM.PHONE',
    FAX: 'COMMON-FORM.FAX',
    EMAIL: 'COMMON-FORM.EMAIL',
    WEB: 'COMMON-FORM.WEB',
    IN_GATE: 'COMMON-FORM.IN-GATE',
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
    MONTH:'COMMON-FORM.MONTH',
    DAYS: 'COMMON-FORM.DAYS',
    GATEIO: 'COMMON-FORM.GATEIO',
    INVENTORY_TYPE: 'COMMON-FORM.INVENTORY-TYPE',
    TANK_ACTIVITY: 'COMMON-FORM.TANK-ACTIVITY',
    SUMMARY_REPORT: 'COMMON-FORM.SUMMARY-REPORT',
    INVENTORY_PERIOD: 'COMMON-FORM.INVENTORY-PERIOD',
    TANK_STATUS: 'COMMON-FORM.TANK-STATUS',
    YARD_STATUS: 'COMMON-FORM.YARD-STATUS',
    TOP_TEN_CUSTOMER: 'COMMON-FORM.TOP-TEN-CUSTOMER',
    TOTAL_TANK:'COMMON-FORM.TOTAL-TANK',
    AVERAGE:'COMMON-FORM.AVERAGE',
    STEAM_YEARLY_OVERVIEW_REPORT:'COMMON-FORM.STEAM-YEARLY-OVERVIEW-REPORT',
    RESIDUE_YEARLY_OVERVIEW_REPORT:'COMMON-FORM.RESIDUE-YEARLY-OVERVIEW-REPORT',
    REPAIR_YEARLY_OVERVIEW_REPORT:'COMMON-FORM.REPAIR-YEARLY-OVERVIEW-REPORT',
    CLEAN_YEARLY_OVERVIEW_REPORT:'COMMON-FORM.CLEAN-YEARLY-OVERVIEW-REPORT',
  }

  // public pieChartOptions!: Partial<ChartOptions>;
  // public columnChartOptions!: Partial<ChartOptions>;
  // public horizontalBarOptions!: Partial<HorizontalBarOptions>;
  public lineChart2Options!: Partial<ChartOptions>;

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
  repData?: AdminReportYearlyReport;
  date?:string;
  repType?:string;
  customer?:string;
  chartAnimatedCounter = 0;

  constructor(
    public dialogRef: MatDialogRef<YearlyChartPdfComponent>,
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

    this.cvDS = new CodeValuesDS(this.apollo);
  //  this.report_summary_status = data.report_summary_status;

    this.loadData();
    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  ngAfterViewInit() {
    this.repData = this.data.repData;
    this.date= this.data.date;
    this.repType=this.data.repType;
    this.customer=this.data.customer;
    this.processTankStatus(this.repData);
   // this.onDownloadClick();
  }

  async ngOnInit() {
    this.pdfTitle = this.type === "REPAIR" ? this.translatedLangText.IN_SERVICE_ESTIMATE : this.translatedLangText.OFFHIRE_ESTIMATE;
   
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
        this.chartAnimatedCounter = 0;
        this.purposeOptionCvList = data;
      //  this.processHorizontalBarValue(this.report_summary_status);
       // this.processCustomerStatus(this.report_summary_status);
      }
    });

    this.cvDS.connectAlias('yardCv').subscribe(data => {
      if (data.length) {
        this.yardCvList = data;
        this.processTankStatus(this.repData!);
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

  // parse2Decimal(input: number | string | undefined) {
  //   return Utility.formatNumberDisplay(input);
  // }

  calculateCost() {
    // this.repairCost = this.steamDS.calculateCost(this.repairItem, this.repairItem?.repair_part);
    // console.log(this.repairCost)
  }

  async onDownloadClick() {
    // this.exportToPDF();
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
    const pageWidth = 297; // A4 width in mm (landscape)
    const pageHeight = 220; // A4 height in mm (landscape)
    const leftMargin = 5;
    const rightMargin = 5;
    const topMargin = 8;
    const bottomMargin = 5;
    const contentWidth = pageWidth - leftMargin - rightMargin;
    const maxContentHeight = pageHeight - topMargin - bottomMargin;

    this.generatingPdfLoadingSubject.next(true);
    this.generatingPdfProgress = 0;

    const pdf = new jsPDF('l', 'mm', 'a4');

    let pageNumber = 1;

    let reportTitleCompanyLogo = 32;
    let tableHeaderHeight = 12;
    let tableRowHeight = 8.5;

    const pagePositions: { page: number; x: number; y: number }[] = [];

    const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    const reportTitle = this.GetReportTitle();

    let currentY = topMargin;
    let scale = this.scale;

    pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });
    var gap = 8;

    await Utility.addHeaderWithCompanyLogo_Landscape(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 40);
    // Variable to store the final Y position of the last table
    let lastTableFinalY = 50;
    let minHeightHeaderCol = 9;
    let fontSize = 6;
    let startY = lastTableFinalY + 8;

    const repGeneratedDate = `${this.date}`; // Replace with your actual cutoff date
    Utility.AddTextAtCenterPage(pdf, repGeneratedDate, pageWidth, leftMargin, rightMargin + 5, startY, 13);

    if(this.customer)
      {
        const customer=`${this.translatedLangText.CUSTOMER} : ${this.customer}`
        Utility.addText(pdf, customer,startY - 2 , leftMargin, 9);
      }

    let chartContentWidth = pageWidth - leftMargin - rightMargin;
    pagePositions.push({ page: 1, x: 0, y: 0 });
    for (var i = 0; i < cardElements.length; i++) {
      if (i > 0) {
        pdf.addPage();
        Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 5);
        pagePositions.push({ page: pdf.getNumberOfPages(), x: 0, y: 0 });
      }
      const card1 = cardElements[i];
      const canvas1 = await html2canvas(card1, { scale: scale });
      const imgData1 = canvas1.toDataURL('image/jpeg', this.imageQuality);

      // Calculate aspect ratio
      const aspectRatio = canvas1.width / canvas1.height;

      // Calculate scaled height based on available width
      let imgHeight1 = chartContentWidth / aspectRatio;

      // Check if the scaled height exceeds the available page height
      const maxPageHeight = pdf.internal.pageSize.height - startY; // Remaining space on the page
      if (imgHeight1 > maxPageHeight) {
        // Adjust height to fit within the page
        imgHeight1 = maxPageHeight;
        // Recalculate width to maintain aspect ratio
        chartContentWidth = imgHeight1 * aspectRatio;
      }

      // Add the image to the PDF
      pdf.addImage(imgData1, 'JPEG', leftMargin, startY + 5, chartContentWidth, imgHeight1);
    }


    
    let minHeightBodyCell = 9;
    let fontSz = 6;
    const headers = [[
          this.translatedLangText.DESCRIPTION,
          this.translatedLangText.NO_OF_TANKS
        ]];
    
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

    const comStyles: any = {
      0: { halign: 'center', cellWidth: 25, minCellHeight: minHeightBodyCell },
      1: { halign: 'center', cellWidth: 'auto', minCellHeight: minHeightBodyCell },
    };

    const data: any[][] = [];
    data.push([this.translatedLangText.TOTAL_TANK, this.repData?.total]);
    data.push([this.translatedLangText.AVERAGE, this.repData?.average]);
   
        let tablewidth=55;
        startY = lastTableFinalY + 10;
        let startX = pageWidth - rightMargin - tablewidth+4;
        //Add table using autoTable plugin
    
        // pdf.setFontSize(8);
        // pdf.setTextColor(0, 0, 0); // Black text
        // const invDate = `${this.translatedLangText.INVENTORY_DATE}:${this.date}`; // Replace with your actual cutoff date
        // Utility.AddTextAtCenterPage(pdf, invDate, pageWidth, leftMargin, rightMargin, lastTableFinalY, 9);
    
        autoTable(pdf, {
          head: headers,
          body: data,
          startY: startY + 5, // Start table at the current startY value
          margin: { left: startX },
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
    
            if (pageCount > 1) Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin);
            // Capture the final Y position of the table
            lastTableFinalY = data.cursor.y;
            var pg = pagePositions.find(p => p.page == pageCount);
            if (!pg) pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
          },
        });

    const totalPages = pdf.getNumberOfPages();

    //pagePositions.forEach(({ page, x, y }) => {
    for (var pg = 0; pg < pdf.getNumberOfPages(); pg++) {
      var page = pg + 1;
      pdf.setDrawColor(0, 0, 0); // black line color
      pdf.setLineWidth(0.1);
      pdf.setLineDashPattern([0.001, 0.001], 0);
      pdf.setFontSize(8);
      pdf.setPage(page);
      var lineBuffer = 13;
      pdf.text(`Page ${page} of ${totalPages}`, pdf.internal.pageSize.width - 6, pdf.internal.pageSize.height - 8, { align: 'right' });
      pdf.line(leftMargin, pdf.internal.pageSize.height - lineBuffer, (pageWidth - rightMargin), pdf.internal.pageSize.height - lineBuffer);
    }
    this.generatingPdfProgress = 100;
    Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
    //pdf.save(fileName);
    this.generatingPdfProgress = 0;
    this.generatingPdfLoadingSubject.next(false);
    this.dialogRef.close();
  }

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
    var title:string='';
    switch(this.repType)
    {
      case "CLEANING":
         title = `${this.translatedLangText.CLEAN_YEARLY_OVERVIEW_REPORT}`
        break;
        case "STEAMING":
          title = `${this.translatedLangText.STEAM_YEARLY_OVERVIEW_REPORT}`
        break;
        case "REPAIR":
          title = `${this.translatedLangText.REPAIR_YEARLY_OVERVIEW_REPORT}`
        break;
        case "RESIDUE":
          title = `${this.translatedLangText.RESIDUE_YEARLY_OVERVIEW_REPORT}`
        break;
    }
    return `${title}`
  }
 
  processTankStatus(repStatus: AdminReportYearlyReport) {

    
    var maxYAxisValue=12;
    var months = repStatus.result_per_month?.map((i,index)=>i.month);
    const counts: number[] = repStatus.result_per_month
  ?.map(i => i.count) // Extract the count property
  .filter(count => count !== undefined && count !== null) as number[]; // Filter out undefined/null values
  maxYAxisValue = counts.length > 0 ? Math.max(...counts) : maxYAxisValue;
  maxYAxisValue = maxYAxisValue*1.2;
    this.lineChart2Options.yaxis = {
      max: maxYAxisValue,
      min: 0,
      title: {
        text: `${this.translatedLangText.NO_OF_TANKS}`,
      },
      labels: {
        align: 'right', // Align labels to the right
        minWidth: 50,   // Set a minimum width for the labels
        maxWidth: 100,  // Set a maximum width for the labels
        offsetX: 10,    // Add horizontal offset to the labels
      }
    }

    for(var i=counts.length;i<=3;i++)
    {
      counts.push(0);
    }
    
    this.lineChart2Options.series=[
      {
        name: 'Inflation',
        data: counts,
      },
    ]
    

  
    this.lineChart2Options.xaxis={
      categories: months,
      position: 'bottom',
      labels: {
        offsetY: -2,
        style: {
          colors: '#9aa0ac',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      }
      
    }
      
    this.lineChart2Options.chart!.events = {
        animationEnd: () => {
          this.onChartRendered();
        }
      }
   
  }

 

  InitialDefaultData() {
    this.lineChart2Options = {
      series: [
        {
          name: 'Inflation',
          data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
        },
      ],
      chart: {
        height: 400,
        type: 'bar',
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,
         
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4, // 👈 Adds curve to top corners
          columnWidth:'15%',
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          if(val===0)
          {
            return '';
          }
          return val;

        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#9aa0ac'],
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        position: 'top',
        labels: {
          offsetY: -10,
          style: {
            colors: '#9aa0ac',
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val: number) {
            return val + '%';
          },
        },
      },
      title: {
        text: this.translatedLangText.MONTH,
        offsetY: 380,
        align: 'center',
        style: {
          color: '#9aa0ac',
        },
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: false,
        },
        x: {
          show: false,
        },
      },
    };
  }

  onChartRendered() {
   // if (this.chartAnimatedCounter == 3) 
    {
      this.onDownloadClick();
      // var timeout = 3000;
      // setTimeout(() => {
      //   this.onDownloadClick();
      // }, timeout);
    }
  }

}
