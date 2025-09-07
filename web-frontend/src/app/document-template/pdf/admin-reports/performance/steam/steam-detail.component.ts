import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
// import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { FileManagerService } from '@core/service/filemanager.service';
import { report_billing_customer, report_billing_item } from 'app/data-sources/billing';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { RepairCostTableItem } from 'app/data-sources/repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { SteamDS } from 'app/data-sources/steam';
import { SteamPartDS } from 'app/data-sources/steam-part';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
//import autoTable from 'jspdf-autotable'; // Import autoTable
import autoTable, { Styles, CellInput } from 'jspdf-autotable';
import { SteamPerformance, SteamPerformanceChart } from 'app/data-sources/reports';
// import { fileSave } from 'browser-fs-access';
import { NgApexchartsModule } from "ng-apexcharts";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexPlotOptions,
} from "ng-apexcharts";
import { overflow } from 'html2canvas/dist/types/css/property-descriptors/overflow';
import { PDFUtility } from 'app/utilities/pdf-utility';

export interface DialogData {
  repData: SteamPerformance[],
  date: string

}

@Component({
  selector: 'app-steam-performance-detail',
  templateUrl: './steam-detail.component.html',
  styleUrls: ['./steam-detail.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule,
    MatTooltipModule,
    NgApexchartsModule,
    NgxChartsModule

  ],
})
export class SteamPerformanceDetailPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  chartOptions: any;
  chartVerticalOptions: any;
  pieChartOptions: any;
  pie2ChartOptions: any;
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
    CLEAN_COST: 'COMMON-FORM.CLEAN-COST-REPORT',
    REPAIR_COST: 'COMMON-FORM.REPAIR-COST-REPORT',
    PREINSP_COST: 'COMMON-FORM.PREINSP-COST-REPORT',
    STORAGE_COST: 'COMMON-FORM.STORAGE-COST-REPORT',
    REPORT_TITLE: 'COMMON-FORM.GATE-SURCHAGRGE-PENDING-REPORT',
    CUTOFF_DATE: 'COMMON-FORM.CUTOFF-DATE',
    GATEIO_S: 'COMMON-FORM.GATEIO-S',
    GATE_SURCHAGRGE_PENDING_REPORT: "COMMON-FORM.GATE-SURCHAGRGE-PENDING-REPORT",
    STEAMING_PERFORMANCE_REPORT: "COMMON-FORM.STEAMING-PERFORMANCE-REPORT",
    TOTAL_COST: "COMMON-FORM.TOTAL-COST",
    COMPLETED_DATE: "COMMON-FORM.COMPLETED-DATE",
    CARGO: "COMMON-FORM.CARGO",
    DURATION: "COMMON-FORM.DURATION",
    REQUIRED_TEMP: "COMMON-FORM.REQUIRED-TEMP",
    TEMPERATURE: "COMMON-FORM.TEMPERATURE",
    BEGIN: "COMMON-FORM.BEGIN",
    BAY: "COMMON-FORM.BAY",
    TOP_LASER: "COMMON-FORM.TOP-LASER",
    BOTTOM_LASER: "COMMON-FORM.BOTTOM-LASER",
    STEAMING_PERIOD: "COMMON-FORM.STEAMING-PERIOD",
    DEGREE_CELSIUS_SYMBOL: "COMMON-FORM.DEGREE-CELSIUS-SYMBOL",
    NO_OF_TANKS_BAYS: "COMMON-FORM.NO-OF-TANKS-BAYS",
    NO_OF_TANKS_REQ_TEMP: "COMMON-FORM.NO-OF-TANKS-REQ-TEMP",
    NO_OF_TANKS_STEAM_CARGO: "COMMON-FORM.NO-OF-TANKS-STEAM-CARGO",
    S_N: 'COMMON-FORM.S_N',

  }


  type?: string | null;
  steamDS: SteamDS;
  steamPartDS: SteamPartDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
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
  unitTypeCvList: CodeValuesItem[] = [];

  scale = 2;
  imageQuality = 0.75;
  maxItemPerPage = 25;

  generatedPDF: any;
  existingPdf?: any;
  existingPdfSafeUrl?: any;
  isImageLoading$: Observable<boolean> = this.fileManagerService.loading$;
  isFileActionLoading$: Observable<boolean> = this.fileManagerService.actionLoading$;

  private generatingPdfLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  generatingPdfLoading$: Observable<boolean> = this.generatingPdfLoadingSubject.asObservable();
  generatingPdfProgress = 0;
  repData: SteamPerformance[] = [];
  date: string = "";



  constructor(
    public dialogRef: MatDialogRef<SteamPerformanceDetailPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) {
    super();
    this.translateLangText();
    this.steamDS = new SteamDS(this.apollo);
    this.steamPartDS = new SteamPartDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);

    this.repData = data.repData;//this.removeEstimateWithZeroTotal(data.billing_customers);
    this.date = data.date;

    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);

    this.initChartsDefaultValue();
    //this.onDownloadClick();
  }

  removeEstimateWithZeroTotal(cust: report_billing_customer[]): report_billing_customer[] {
    let retval: report_billing_customer[] = cust.map(c => {
      // Filter the items array and return a new object with modified items
      return {
        ...c, // Spread the existing customer data
        items: c.items?.filter(i => i.total !== "0.00") // Filter items where total is not "0.00"
      };
    });

    return retval;
  }
  async ngOnInit() {
    this.pdfTitle = this.type === "REPAIR" ? this.translatedLangText.IN_SERVICE_ESTIMATE : this.translatedLangText.OFFHIRE_ESTIMATE;

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.onDownloadClick();
    }, 1500);
    // this.onDownloadClick();
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
      const headerHeight = await this.addHeader1(pdf, pageWidth, leftRightMargin, topMargin);
      const footerHeight = await this.addFooter1(pdf, pageWidth, pageHeight, leftRightMargin, bottomMargin, 1, 1); // Placeholder footer height calculation
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
          await this.addFooter1(pdf, pageWidth, pageHeight, leftRightMargin, bottomMargin, currentPage, totalPages);

          // Start a new page
          pdf.addPage();
          currentPage++;
          yOffset = topMargin;

          // Add Header to the new page
          const newHeaderHeight = await this.addHeader1(pdf, pageWidth, leftRightMargin, topMargin);
          yOffset += newHeaderHeight;
        }

        // Add row to the current page
        pdf.addImage(rowImg, 'JPEG', leftRightMarginBody, yOffset, pageWidth - leftRightMarginBody * 2, rowHeight);
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
        await this.addFooter1(pdf, pageWidth, pageHeight, leftRightMargin, bottomMargin, currentPage, totalPages);

        // Start a new page
        pdf.addPage();
        currentPage++;
        yOffset = topMargin;

        // Add Header to the new page
        const newHeaderHeight = await this.addHeader1(pdf, pageWidth, leftRightMargin, topMargin);
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
      await this.addFooter1(pdf, pageWidth, pageHeight, leftRightMargin, bottomMargin, currentPage, totalPages);
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

  async addHeader1(pdf: jsPDF, pageWidth: number, leftRightMargin: number, topMargin: number): Promise<number> {
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

  async addFooter1(pdf: jsPDF, pageWidth: number, pageHeight: number, leftRightMargin: number, bottomMargin: number, currentPage: number, totalPages: number): Promise<number> {
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

  getRepairData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.steamDS.getSteamByIDForPdf(this.repair_guid!).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err),
      });
    });
  }

  getRepairPdf(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.fileManagerService.getFileUrlByGroupGuid([this.repair_guid!]).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err),
      });
    });
  }

  async getCodeValuesData(): Promise<void> {
    const queries = [
      { alias: 'groupNameCv', codeValType: 'GROUP_NAME' },
      { alias: 'yesnoCv', codeValType: 'YES_NO' },
      { alias: 'soTankStatusCv', codeValType: 'SO_TANK_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
      { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
      { alias: 'partLocationCv', codeValType: 'PART_LOCATION' },
      { alias: 'damageCodeCv', codeValType: 'DAMAGE_CODE' },
      { alias: 'repairCodeCv', codeValType: 'REPAIR_CODE' },
      { alias: 'unitTypeCv', codeValType: 'UNIT_TYPE' },
    ];

    await this.cvDS.getCodeValuesByTypeAsync(queries);

    // Wrap all alias connections in promises
    const promises = [
      firstValueFrom(this.cvDS.connectAlias('groupNameCv')).then(async data => {
        this.groupNameCvList = data || [];
        const subqueries: any[] = [];
        data.map(d => {
          if (d.child_code) {
            let q = { alias: d.child_code, codeValType: d.child_code };
            const hasMatch = subqueries.some(subquery => subquery.codeValType === d.child_code);
            if (!hasMatch) {
              subqueries.push(q);
            }
          }
        });

        // Process subqueries if any
        if (subqueries.length > 0) {
          await this.cvDS?.getCodeValuesByTypeAsync(subqueries);

          for (const s of subqueries) {
            const subData = await firstValueFrom(this.cvDS.connectAlias(s.alias));
            if (subData) {
              this.subgroupNameCvList = [...new Set([...this.subgroupNameCvList, ...subData])];
            }
          }
        }

      }),
      firstValueFrom(this.cvDS.connectAlias('yesnoCv')).then(data => {
        this.yesnoCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('soTankStatusCv')).then(data => {
        this.soTankStatusCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('purposeOptionCvList')).then(data => {
        this.purposeOptionCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('testTypeCv')).then(data => {
        this.testTypeCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('testClassCv')).then(data => {
        this.testClassCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('partLocationCv')).then(data => {
        this.partLocationCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('damageCodeCv')).then(data => {
        this.damageCodeCvList = data || [];
        this.chunkedDamageCodeCvList = this.chunkArray(this.damageCodeCvList, 10);
      }),
      firstValueFrom(this.cvDS.connectAlias('repairCodeCv')).then(data => {
        this.repairCodeCvList = data || [];
        this.chunkedRepairCodeCvList = this.chunkArray(this.repairCodeCvList, 10);
      }),
      firstValueFrom(this.cvDS.connectAlias('unitTypeCv')).then(data => {
        this.unitTypeCvList = data || [];
      })
    ];

    // Wait for all promises to resolve
    await Promise.all(promises);
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

  getLastTest(igs: any): string | undefined {
    return this.getLastTestIGS(igs);
  }

  getLastTestIGS(igs: any): string | undefined {
    if (!this.testTypeCvList?.length || !this.testClassCvList?.length || !igs) return "";

    if (igs && igs.last_test_cv && igs.test_class_cv && igs.test_dt) {
      const test_type = igs.last_test_cv;
      const test_class = igs.test_class_cv;
      return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(igs.test_dt as number, 'MM/YYYY') + " - " + test_class;
    }
    return "";
  }

  getTestTypeDescription(codeVal: string): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.testTypeCvList);
  }

  getTestClassDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.testClassCvList);
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getSubgroupNameCodeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.subgroupNameCvList);
  }

  displayDamageRepairCode(damageRepair: any[], filterCode: number): string {
    return damageRepair?.filter((x: any) => x.code_type === filterCode && ((!x.delete_dt && x.action !== 'cancel') || (x.delete_dt && x.action === 'rollback'))).map(item => {
      return item.code_cv;
    }).join('/');
  }

  displayTankPurpose(sot: any) {
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

  GetReportTitle(): string {
    return `${this.translatedLangText.STEAMING_PERFORMANCE_REPORT}`
  }

  async exportToPDF_r1(fileName: string = 'document.pdf') {
    const pageWidth = 297; // A4 width in mm (landscape)
    const pageHeight = 220; // A4 height in mm (landscape)
    const leftMargin = 10;
    const rightMargin = 10;
    const topMargin = 5;
    const bottomMargin = 5;
    const contentWidth = pageWidth - leftMargin - rightMargin;
    const maxContentHeight = pageHeight - topMargin - bottomMargin;

    this.generatingPdfLoadingSubject.next(true);
    this.generatingPdfProgress = 0;

    const pdf = new jsPDF('l', 'mm', 'a4');
    //const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    let pageNumber = 1;

    let reportTitleCompanyLogo = 32;
    let tableHeaderHeight = 12;
    let tableRowHeight = 8.5;
    let minHeightHeaderCol = 3;
    let minHeightBodyCell = 5;
    let fontSize = 5.5;

    const pagePositions: { page: number; x: number; y: number }[] = [];
    // const progressValue = 100 / cardElements.length;

    const reportTitle = this.GetReportTitle();
    const headers: CellInput[][] = [[
      { content: this.translatedLangText.S_N, rowSpan: 3, styles: { halign: 'center', valign: 'bottom' } },
      { content: this.translatedLangText.TANK_NO, rowSpan: 3, styles: { halign: 'center', valign: 'bottom' } },
      // { content: this.translatedLangText.EIR_NO, rowSpan: 3, styles: { halign: 'center', valign: 'bottom' } },  
      { content: this.translatedLangText.CUSTOMER, rowSpan: 3, styles: { halign: 'center', valign: 'bottom' } },
      { content: this.translatedLangText.CARGO, rowSpan: 3, styles: { halign: 'center', valign: 'bottom' } },
      { content: this.translatedLangText.COMPLETED_DATE, rowSpan: 3, styles: { halign: 'center', valign: 'bottom' } },
      { content: this.translatedLangText.DURATION, rowSpan: 3, styles: { halign: 'center', valign: 'bottom' } },
      { content: `${this.translatedLangText.REQUIRED_TEMP} ${this.translatedLangText.DEGREE_CELSIUS_SYMBOL}`, rowSpan: 3, styles: { halign: 'center', valign: 'bottom' } },
      { content: this.translatedLangText.STEAM_COST, rowSpan: 3, styles: { halign: 'center', valign: 'bottom' } },
      { content: this.translatedLangText.BAY, rowSpan: 3, styles: { halign: 'center', valign: 'bottom' } },
      { content: this.translatedLangText.TEMPERATURE, colSpan: 6, styles: { halign: 'center', valign: 'middle' } }


    ], [
      { content: `${this.translatedLangText.THERMOMETER} ${this.translatedLangText.DEGREE_CELSIUS_SYMBOL}`, colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: `${this.translatedLangText.TOP_LASER} ${this.translatedLangText.DEGREE_CELSIUS_SYMBOL}`, colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: `${this.translatedLangText.BOTTOM_LASER} ${this.translatedLangText.DEGREE_CELSIUS_SYMBOL}`, colSpan: 2, styles: { halign: 'center', valign: 'middle' } }
    ], [
      { content: this.translatedLangText.BEGIN, styles: { halign: 'center', valign: 'middle' } },
      { content: this.translatedLangText.CLOSE, styles: { halign: 'center', valign: 'middle' } },
      { content: this.translatedLangText.BEGIN, styles: { halign: 'center', valign: 'middle' } },
      { content: this.translatedLangText.CLOSE, styles: { halign: 'center', valign: 'middle' } },
      { content: this.translatedLangText.BEGIN, styles: { halign: 'center', valign: 'middle' } },
      { content: this.translatedLangText.CLOSE, styles: { halign: 'center', valign: 'middle' } }
    ]];

    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: 'middle', cellWidth: 10, minCellHeight: minHeightBodyCell },
      1: { halign: 'center', valign: 'middle', cellWidth: 20, minCellHeight: minHeightBodyCell },
      2: { halign: 'center', valign: 'middle', cellWidth: 15, minCellHeight: minHeightBodyCell },
      3: { halign: 'left', valign: 'middle', cellWidth: 70, minCellHeight: minHeightBodyCell, overflow: 'ellipsize' },
      4: { halign: 'center', valign: 'middle', cellWidth: 18, minCellHeight: minHeightBodyCell },
      5: { halign: 'center', valign: 'middle', cellWidth: 20, minCellHeight: minHeightBodyCell },
      6: { halign: 'center', valign: 'middle', cellWidth: 20, minCellHeight: minHeightBodyCell },
      7: { halign: 'center', valign: 'middle', cellWidth: 14, minCellHeight: minHeightBodyCell },
      8: { halign: 'center', valign: 'middle', cellWidth: 13, minCellHeight: minHeightBodyCell },
      9: { halign: 'center', valign: 'middle', cellWidth: 13, minCellHeight: minHeightBodyCell },
      10: { halign: 'center', valign: 'middle', cellWidth: 13, minCellHeight: minHeightBodyCell },
      11: { halign: 'center', valign: 'middle', cellWidth: 13, minCellHeight: minHeightBodyCell },
      12: { halign: 'center', valign: 'middle', cellWidth: 13, minCellHeight: minHeightBodyCell },
      13: { halign: 'center', valign: 'middle', cellWidth: 13, minCellHeight: minHeightBodyCell },
      14: { halign: 'center', valign: 'middle', cellWidth: 13, minCellHeight: minHeightBodyCell },
      // 15: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },

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
    var CurrentPage = 1;
    var buffer = 20;
    pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });


    await Utility.addHeaderWithCompanyLogo_Landscape(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    await Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 35);
    // Variable to store the final Y position of the last table
    let lastTableFinalY = 40;


    //const cutoffDate = `${this.translatedLangText.STEAMING_PERIOD} : ${this.date}`;
    //Utility.AddTextAtCenterPage(pdf, cutoffDate, pageWidth, leftMargin, rightMargin + 5, lastTableFinalY + 6, 9);

    //const repGeneratedDate = await Utility.GetReportGeneratedDate(this.translate);
    // Replace with your actual cutoff date
    const cutoffDate = `${this.translatedLangText.STEAMING_PERIOD}: ${this.date}`;
    Utility.AddTextAtRightCornerPage(pdf, cutoffDate, pageWidth, leftMargin, rightMargin, lastTableFinalY + 8, PDFUtility.ReportSubTitleFontSize());
    // Utility.AddTextAtCenterPage(pdf,cutoffDate,pageWidth,leftMargin,rightMargin+6,lastTableFinalY+8,8)
    //pdf.text(cutoffDate, pageWidth - rightMargin, lastTableFinalY + 10, { align: "right" });


    const data: any[][] = []; // Explicitly define data as a 2D array
    //let startY = lastTableFinalY + 15; // Start Y position for the current table


    // Calculate space required for customer name and table
    const customerNameHeight = 10; // Height required for customer name



    var repPage = pdf.getNumberOfPages();
    // if(repPage==1)lastTableFinalY=45;

    if ((repPage == CurrentPage) && (pageHeight - bottomMargin - topMargin) < (lastTableFinalY + buffer + topMargin)) {
      pdf.addPage();
      lastTableFinalY = 5 + topMargin;
    }
    else {
      CurrentPage = repPage;
    }

    let startY = lastTableFinalY + 13; // Start table 20mm below the customer name
    for (let n = 0; n < this.repData.length; n++) {
      let itm = this.repData[n];
      data.push([
        (n + 1).toString(), itm.tank_no || "",
        itm.customer_code || '', itm.last_cargo || "", Utility.convertEpochToDateStr(itm.complete_dt!) || "", itm.duration || "", itm.require_temp,
        Utility.formatNumberDisplay(itm.cost) || "", itm.bay || "", (itm.themometer?.begin_temp) || "", (itm.themometer?.close_temp) || "",
        (itm.top?.begin_temp) || "", (itm.top?.close_temp) || "", (itm.bottom?.begin_temp) || "", (itm.bottom?.close_temp) || "",

      ]);
    }
    pdf.setDrawColor(0, 0, 0); // red line color

    pdf.setLineWidth(0.1);
    pdf.setLineDashPattern([0.01, 0.01], 0.1);
    // Add table using autoTable plugin
    autoTable(pdf, {
      head: headers,
      body: data,
      // startY: startY, // Start table at the current startY value
      theme: 'grid',
      margin: { left: leftMargin, top: topMargin + 45 },
      styles: {
        fontSize: fontSize,
        minCellHeight: minHeightHeaderCol

      },
      tableWidth: pageWidth - leftMargin - rightMargin,
      columnStyles: comStyles,
      headStyles: headStyles, // Custom header styles
      bodyStyles: {
        fillColor: [255, 255, 255],
        halign: 'left', // Left-align content for body by default
        valign: 'middle', // Vertically align content
      },
      didDrawPage: (data: any) => {
        const pageCount = pdf.getNumberOfPages();


        // Capture the final Y position of the table
        lastTableFinalY = data.cursor.y;
        var pg = pagePositions.find(p => p.page == pageCount);
        if (!pg) {
          pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
          if (pageCount > 1) {
            Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 45);
            //Utility.AddTextAtCenterPage(pdf, cutoffDate, pageWidth, leftMargin, rightMargin + 5, lastTableFinalY + 6, 9);
            Utility.AddTextAtRightCornerPage(pdf, cutoffDate, pageWidth, leftMargin, rightMargin, 48, PDFUtility.ReportSubTitleFontSize());
          }

        }
      },
    });


    //   const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');


    //   if(cardElements.length==3)
    //   {
    //     pdf.addPage();


    //     var chartContentWidth=pageWidth/2.2;
    //     var startX=leftMargin;
    //     startY=50;
    //     await Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 15);
    //   for (var i = 0; i < cardElements.length; i++) {


    //       const card1 = cardElements[i];
    //       const canvas1 = await html2canvas(card1, { scale: scale });
    //       const imgData1 = canvas1.toDataURL('image/jpeg', this.imageQuality);

    //       // Calculate aspect ratio
    //       const aspectRatio = canvas1.width / canvas1.height;

    //       // Calculate scaled height based on available width
    //       let imgHeight1 = chartContentWidth / aspectRatio;

    //       // Check if the scaled height exceeds the available page height
    //       const maxPageHeight = pdf.internal.pageSize.height - startY; // Remaining space on the page
    //       if (imgHeight1 > maxPageHeight) {
    //         // Adjust height to fit within the page
    //         imgHeight1 = maxPageHeight;
    //         // Recalculate width to maintain aspect ratio
    //         chartContentWidth = imgHeight1 * aspectRatio;
    //       }



    //       // Add the image to the PDF
    //       pdf.addImage(imgData1, 'JPEG', startX, startY, chartContentWidth, imgHeight1);
    //       if((startX+chartContentWidth+leftMargin+rightMargin+50)>pageWidth )
    //       {
    //         startX=leftMargin;
    //         startY+=imgHeight1+5;
    //         chartContentWidth=chartContentWidth*2;
    //       }
    //       else
    //       {
    //         startX += chartContentWidth+2;
    //       }

    //   }
    // }

    const totalPages = pdf.getNumberOfPages();

    for (const { page, x, y } of pagePositions) {
      pdf.setDrawColor(0, 0, 0); // black line color
      pdf.setLineWidth(0.1);
      pdf.setLineDashPattern([0.01, 0.01], 0.1);
      pdf.setFontSize(8);
      pdf.setPage(page);

      const lineBuffer = 13;
      pdf.text(`Page ${page} of ${totalPages}`, pdf.internal.pageSize.width - 14, pdf.internal.pageSize.height - 8, { align: 'right' });
      pdf.line(leftMargin, pdf.internal.pageSize.height - lineBuffer, pageWidth - rightMargin, pdf.internal.pageSize.height - lineBuffer);

      if (page > 1) {
        await Utility.addHeaderWithCompanyLogo_Portriat(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
      }
    }// Add Second Page, Add For Loop

    // pagePositions.forEach(({ page, x, y }) => {
    //   pdf.setDrawColor(0, 0, 0); // black line color
    //   pdf.setLineWidth(0.1);
    //   pdf.setLineDashPattern([0.01, 0.01], 0.1);
    //   pdf.setFontSize(8);
    //   pdf.setPage(page);
    //   var lineBuffer = 13;
    //   pdf.text(`Page ${page} of ${totalPages}`, pdf.internal.pageSize.width - 20, pdf.internal.pageSize.height - 10, { align: 'right' });
    //   pdf.line(leftMargin, pdf.internal.pageSize.height - lineBuffer, (pageWidth - rightMargin), pdf.internal.pageSize.height - lineBuffer);
    // });

    this.generatingPdfProgress = 100;
    //pdf.save(fileName);
    this.generatingPdfProgress = 0;
    this.generatingPdfLoadingSubject.next(false);
    Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
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

  async addHeaderWithCompanyLogo_Portriat(
    pdf: jsPDF,
    pageWidth: number,
    topMargin: number,
    bottomMargin: number,
    leftMargin: number,
    rightMargin: number
  ) {
    // Set dashed line pattern
    pdf.setLineDashPattern([1, 1], 0.5);

    // Draw top line
    pdf.line(leftMargin, topMargin, (pageWidth - rightMargin), topMargin);

    // Define header height
    const heightHeader: number = 30;

    // Draw bottom line
    pdf.line(leftMargin, topMargin + heightHeader, (pageWidth - rightMargin), topMargin + heightHeader);

    // Add company name
    pdf.setFontSize(18);
    const companyNameWidth = pdf.getStringUnitWidth(customerInfo.companyName) * pdf.getFontSize();
    let posX = pageWidth / 1.75;
    let posY = topMargin + 8;
    pdf.text(customerInfo.companyName, posX, posY);

    // Add company address
    pdf.setFontSize(10);
    posX -= 5;
    posY += 7;
    pdf.text(customerInfo.companyAddress, posX, posY);

    // Add phone, fax, and website
    let nextLine = `${this.translatedLangText.PHONE}:${customerInfo.companyPhone} ${this.translatedLangText.FAX}:${customerInfo.companyFax} ${this.translatedLangText.WEB}:${customerInfo.companyWebsite}`;
    posX -= 20;
    posY += 5;
    pdf.text(nextLine, posX, posY);

    // Add company UEN
    nextLine = `${this.translatedLangText.CRN}:${customerInfo.companyUen}`;
    posX += 35;
    posY += 5;
    pdf.text(nextLine, posX, posY);

    // Load and add company logo
    const imgUrl = "assets/images/logo.png";
    const img = new Image();

    // Wait for the image to load
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imgUrl;
    });

    // Add the image to the PDF
    const posX1_img = leftMargin + 5;
    const posY1_img = topMargin + 10;
    const imgHeight = heightHeader - 21;
    const imgWidth = 60;
    pdf.addImage(img, 'PNG', posX1_img, posY1_img, imgWidth, imgHeight); // (imageElement, format, x, y, width, height)
  }

  addHeader(pdf: jsPDF, title: string, pageWidth: number, leftMargin: number, rightMargin: number) {
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
    const pdf = new jsPDF('l', 'mm', 'a4');
    const leftMargin = 10; // Left margin
    const rightMargin = 10; // Right margin
    const contentWidth = 210 - leftMargin - rightMargin; // 190mm usable width
    const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    let pageNumber = 1;
    let totalPages = 0;

    // Store page positions for later text update
    const pagePositions: { page: number; x: number; y: number }[] = [];
    const progressValue = 100 / cardElements.length;

    const reportTitle = this.translatedLangText.REPORT_TITLE;  // Set your report title here

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
      // pdf.text(reportTitle, titleX, pos); // Position it at the top

      // // Draw underline for the title
      // pdf.setLineWidth(0.5); // Set line width for underline
      // pdf.line(titleX, pos+2, titleX + titleWidth, pos+2); // Draw the line under the title

      // If card height exceeds A4 page height, split across multiple pages
      if (imgHeight > 270) { // 297mm (A4 height) - 20mm (top & bottom margins)
        let yPosition = 0;
        let maxItemPerPage = this.maxItemPerPage;
        let counter = 1;
        while (yPosition != -1) {
          // Serialize the element to XML string
          const serializer = new XMLSerializer();
          const xmlString = serializer.serializeToString(card);

          // Parse the XML string to create a new DOM element
          const parser = new DOMParser();
          const clonedCardDoc = parser.parseFromString(xmlString, "text/html"); // Use text/html for HTML content

          // Extract the clonedCard element from the parsed document
          const clonedCard = clonedCardDoc.body.firstChild as HTMLElement;

          // Now, remove rows starting from index 25
          const rows = clonedCard.querySelectorAll("tr.ng-star-inserted");

          rows.forEach((row: Element, index: number) => {
            if (index < ((counter - 1) * maxItemPerPage) || index >= (counter * maxItemPerPage)) {
              row.remove();
            }
          });

          this.pdfTable.nativeElement.appendChild(clonedCard);
          const canvas = await html2canvas(clonedCard, { scale: this.scale });
          const imgData = canvas.toDataURL('image/jpeg', this.imageQuality); // Convert to JPEG with 80% quality

          const imgHeight = (canvas.height * contentWidth) / canvas.width; // Adjust height proportionally
          pdf.addImage(imgData, 'JPEG', leftMargin, 20, contentWidth, imgHeight); // Adjust y position to leave space for the title

          // Store page position for page numbering
          pagePositions.push({ page: pageNumber, x: 200, y: 287 });
          const bal = rows.length - (counter * maxItemPerPage);
          if (bal > 0) pdf.addPage();
          else break;
          counter++;
        }
      } else {
        if (i > 0) pdf.addPage(); // New page for each card
        pdf.addImage(imgData, 'JPEG', leftMargin, 20, contentWidth, imgHeight); // Adjust y position to leave space for the title

        pdf.text(reportTitle, titleX, pos); // Position it at the top

        // Draw underline for the title
        pdf.setLineWidth(0.5); // Set line width for underline
        pdf.line(titleX, pos + 2, titleX + titleWidth, pos + 2); // Draw the line under the title
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

  displayCleanCost(item: report_billing_item): string {
    let retval: string = '';

    retval = (item.clean_cost === "0.00" || item.clean_cost === undefined ? '' : `${item.clean_cost}`)
    return retval;
  }
  displayStorageCost(item: report_billing_item): string {
    let retval: string = '';

    retval = (item.storage_cost === "0.00" || item.storage_cost === undefined ? '' : `${item.storage_cost}`)
    return retval;
  }
  displaySteamCost(item: report_billing_item): string {
    let retval: string = '';

    retval = (item.steam_cost === "0.00" || item.steam_cost === undefined ? '' : `${item.steam_cost}`)
    return retval;
  }
  displayRepairCost(item: report_billing_item): string {
    let retval: string = '';

    retval = (item.repair_cost === "0.00" || item.repair_cost === undefined ? '' : `${item.repair_cost}`)
    return retval;
  }

  displayResidueCost(item: report_billing_item): string {
    let retval: string = '';

    retval = (item.residue_cost === "0.00" || item.residue_cost === undefined ? '' : `${item.residue_cost}`)
    return retval;
  }

  displayLOLOCost(item: report_billing_item): string {
    let retval: string = '';

    retval = (item.lolo_cost === "0.00" || item.lolo_cost === undefined ? '' : `${item.lolo_cost}`)
    return retval;
  }

  displayPreinsCost(item: report_billing_item): string {
    let retval: string = '';

    retval = (item.preins_cost === "0.00" || item.preins_cost === undefined ? '' : `${item.preins_cost}`)
    return retval;
  }

  displayGateIOCost(item: report_billing_item): string {
    let retval: string = '';

    retval = (item.gateio_cost === "0.00" || item.gateio_cost === undefined ? '' : `${item.gateio_cost}`)
    return retval;
  }

  displayTotalCost(Cust: report_billing_customer): string {
    const total = Cust.items?.reduce((accumulator, item) => {
      return accumulator + (Number(item.total || 0)); // Add item.total to the accumulator (default to 0 if item.total is undefined)
    }, 0); // Start with an initial value of 0

    // Return the total as a string

    return (total || 0).toFixed(2);
  }

  initChartsDefaultValue() {
    const colors = [
      "#1f497d", "#e69f40", "#4f81bd", "#9bbb59", "#8064a2",
      "#c0504d", "#ffcc00", "#66ccff", "#ff6600", "#009933",
      "#ff3366", "#9966ff", "#ff99cc", "#3399ff", "#99cc33",
      "#ff3300", "#33cccc", "#cc6600", "#993399", "#669900"
    ];
    const categories = [
      "SMA-01", "SMB-01"];
    const tankData = [4, 2, 6, 3, 5, 1, 7, 8, 9, 2, 4, 5, 3, 6, 7, 8, 2, 1, 5, 3];
    // const series = categories.map((category, index) => ({
    //   name: category,
    //   data: [tankData[index]], // Single value per category
    //   color: colors[index], // Assign unique color
    // }));

    var bayCharts = this.groupByBay(this.repData);
    const chartData = bayCharts.map((chart, index) => ({
      name: chart.name,
      value: chart.value, // Single value per category
    }));


    this.chartVerticalOptions = {
      view: [700, 400], // Width x Height
      chartData: chartData,
      colorScheme: {
        domain: ['#1f497d', '#e69f40', '#ff6361', '#bc5090', '#58508d', '#003f5c',
          '#7a5195', '#ef5675', '#ffa600', '#FF9F40', '#2f4b7c', '#665191',
          '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600', '#ff4500',
          '#1e90ff', '#008000']
      },
      xAxisLabel: this.translatedLangText.BAY,
      yAxisLabel: this.translatedLangText.NO_OF_TANKS
    }
    var tempGroup = this.groupByRequireTemp(this.repData);
    var tempCargo = this.groupByLastCargo(this.repData);

    this.pie2ChartOptions = {
      colors: colors.slice(0, tempCargo.length), // Use only needed colors
      chart: {
        animations: {
          enabled: false // This disables all animations
        },
        width: 1250,
        height: 362,
        // offsetX: -200, // Moves legend leftward
        type: 'donut',
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,
        },
      },
      legend: {
        show: true,
        position: 'top',
        floating: true, // Overlaps the chart
        offsetY: 10, // Moves legend upward
        offsetX: 800, // Moves legend leftward
        horizontalAlign: 'left', // For top/bottom positioning
        fontSize: '10px',
        markers: {
          width: 12,
          height: 12,
        },
        height: '100%',
        itemMargin: { horizontal: 5, vertical: 2 }
      },
      labels: tempCargo.map(chart => chart.name || '').filter(name => name !== ''),
      series2: tempCargo.map(chart => chart.value || 0),

    };



    this.pieChartOptions = {
      colors: colors.slice(0, tempGroup.length), // Use only needed colors
      chart: {
        animations: {
          enabled: false // This disables all animations
        },
        width: 460,
        type: 'pie',
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,
        },
      },
      labels: tempGroup.map(chart => chart.name || '').filter(name => name !== ''),
      series2: tempGroup.map(chart => chart.value || 0),
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData']) {
      console.log('Chart data changed, re-rendering chart...', changes['chartData'].currentValue);
    }
  }

  groupByRequireTemp(performances: SteamPerformance[]): SteamPerformanceChart[] {
    const tempMap = new Map<number, number>();

    performances.forEach(performance => {
      if (performance.require_temp === undefined) return;

      const currentCount = tempMap.get(performance.require_temp) || 0;
      tempMap.set(performance.require_temp, currentCount + 1);
    });

    return Array.from(tempMap.entries()).map(([name, count]) =>
      new SteamPerformanceChart({ name: name.toString(), count, value: count })
    );
  }

  groupByLastCargo(performances: SteamPerformance[]): SteamPerformanceChart[] {
    const cargoMap = new Map<string, number>();

    performances.forEach(performance => {
      if (!performance.last_cargo) return;

      const currentCount = cargoMap.get(performance.last_cargo) || 0;
      cargoMap.set(performance.last_cargo, currentCount + 1);
    });

    return Array.from(cargoMap.entries()).map(([name, count]) =>
      new SteamPerformanceChart({ name, count, value: count })
    );
  }

  groupByBay(performances: SteamPerformance[]): SteamPerformanceChart[] {
    const bayMap = new Map<string, number>();

    performances.forEach(performance => {
      if (!performance.bay) return;

      const currentCount = bayMap.get(performance.bay) || 0;
      bayMap.set(performance.bay, currentCount + 1);
    });

    return Array.from(bayMap.entries()).map(([name, count]) =>
      new SteamPerformanceChart({ name, count, value: count })
    );
  }

  onChartRendered(event: any) {

  }

}
