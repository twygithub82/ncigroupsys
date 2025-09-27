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
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { RepairCostTableItem } from 'app/data-sources/repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { report_customer_tank_activity } from 'app/data-sources/reports';
import { SteamDS } from 'app/data-sources/steam';
import { SteamPartDS } from 'app/data-sources/steam-part';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import autoTable, { Styles } from 'jspdf-autotable';
import { PDFUtility } from 'app/utilities/pdf-utility';
import { overflow } from 'html2canvas/dist/types/css/property-descriptors/overflow';
// import { fileSave } from 'browser-fs-access';

export interface DialogData {
  report_customer_tank_activity: report_customer_tank_activity[],
  queryType:number,
  type:string,
  date:string,

  // repair_guid: string;
  // customer_company_guid: string;
  // sotDS: StoringOrderTankDS;
  // repairDS: RepairDS;
  // ccDS: CustomerCompanyDS;
  // cvDS: CodeValuesDS;
  // existingPdf?: any;
  // estimate_no?: string;
  // retrieveFile: boolean;
}

@Component({
  selector: 'app-yard-detail-pdf',
  templateUrl: './yard-detail-pdf.component.html',
  styleUrls: ['./yard-detail-pdf.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
})
export class YardDetailPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  translatedLangText: any = {};
  langText = {
    SURVEY_FORM: 'COMMON-FORM.SURVEY-FORM',
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    S_N: 'COMMON-FORM.S_N',
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
    LAST_RELEASE_DATE: 'COMMON-FORM.LAST-RELEASE-DATE-S',
    //TAKE_IN_REFERENCE: 'COMMON-FORM.TAKE-IN-REFERENCE-S',
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
    // ESTIMATE_NO: 'COMMON-FORM.ESTIMATE-NO-S',
    // ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE-S',
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
    GATEIO: 'COMMON-FORM.GATEIO-S',
    INVENTORY_TYPE: 'COMMON-FORM.INVENTORY-TYPE',
    TANK_ACTIVITY: 'COMMON-FORM.TANK-ACTIVITY',
    YARD_REPORT:'COMMON-FORM.YARD-REPORT',
    DETAILS: 'COMMON-FORM.DETAILS',
    DETAIL_REPORT: 'COMMON-FORM.DETAIL-REPORT',
    CLEAN_DATE: 'COMMON-FORM.CLEAN-DATE',
    APPROVAL_DATE: 'COMMON-FORM.APPROVAL-DATE',
    //APPROVAL_DATE: 'COMMON-FORM.APPROVAL-DATE-S',
    //APPROVAL_REFERENCE: 'COMMON-FORM.APPROVAL-REFERENCE-S',
    APPROVAL_REFERENCE: 'COMMON-FORM.APPROVAL-REFERENCE',
    AV_DATE: 'COMMON-FORM.AV-DATE',
    //RELEASE_DATE: 'COMMON-FORM.RELEASE-DATE-S',
    RELEASE_DATE: 'COMMON-FORM.RELEASE-DATE',
    RELEASE_REFERENCE: 'COMMON-FORM.RELEASE-REFERENCE',
    //RELEASE_REFERENCE: 'COMMON-FORM.RELEASE-REFERENCE-S',
    INVENTORY_PERIOD: 'COMMON-FORM.INVENTORY-PERIOD',
    CUSTOMER_REPORT: 'COMMON-FORM.CUSTOMER-REPORT',
    TANK_STATUS: 'COMMON-FORM.TANK-STATUS',
    RELEASE_BOOKING: 'COMMON-FORM.RELEASE-BOOKING',
    //RELEASE_BOOKING: 'COMMON-FORM.RELEASE-BOOKING-S',
    CLEAN_CERT_DATE:'COMMON-FORM.CLEAN-CERT-DATE',
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
  TankStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  testTypeCvList: CodeValuesItem[] = [];
  testClassCvList: CodeValuesItem[] = [];
  partLocationCvList: CodeValuesItem[] = [];
  damageCodeCvList: CodeValuesItem[] = [];
  chunkedDamageCodeCvList: any[][] = [];
  repairCodeCvList: CodeValuesItem[] = [];
  chunkedRepairCodeCvList: any[][] = [];
  unitTypeCvList: CodeValuesItem[] = [];

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
  report_customer_tank_activity:report_customer_tank_activity[]=[];
  date:string='';
  invType:string='';
  queryType:number=1;

  

  constructor(
    public dialogRef: MatDialogRef<YardDetailPdfComponent>,
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
    // this.repair_guid = data.repair_guid;
    // this.customer_company_guid = data.customer_company_guid;
    // this.estimate_no = data.estimate_no;
    // this.existingPdf = data.existingPdf;
    this.report_customer_tank_activity= data.report_customer_tank_activity;
    this.invType=data.type;
    this.date=data.date;
    this.queryType=data.queryType;
    
    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
   
  }

  async ngOnInit() {
    this.pdfTitle = this.type === "REPAIR" ? this.translatedLangText.IN_SERVICE_ESTIMATE : this.translatedLangText.OFFHIRE_ESTIMATE;
    await this.getCodeValuesData();
    await this.onDownloadClick();
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
          const newHeaderHeight = await this.addHeader1(pdf, pageWidth, leftRightMargin, topMargin);
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
      { alias: 'TankStatusCv', codeValType: 'TANK_STATUS' },
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
      firstValueFrom(this.cvDS.connectAlias('TankStatusCv')).then(data => {
        this.TankStatusCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('purposeOptionCv')).then(data => {
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

  // getLastTestTI(): string | undefined {
  //   if (!this.populateCodeValues?.testTypeCvList?.length || !this.populateCodeValues?.testClassCvList?.length || !this.tiItem) return "";

  //   if (this.tiItem.last_test_cv && this.tiItem.test_class_cv && this.tiItem.test_dt) {
  //     const test_type = this.tiItem.last_test_cv;
  //     const test_class = this.tiItem.test_class_cv;
  //     return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(this.tiItem.test_dt as number, 'MM/YYYY') + " - " + test_class;
  //   }
  //   return "";
  // }

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

  displayTankPurpose(sot: any){
    return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this), true);
  }

  // displayTankPurpose(sot: any) {
  //   let purposes: any[] = [];
  //   if (sot?.purpose_storage) {
  //     purposes.push(this.getPurposeOptionDescription('STORAGE'));
  //   }
  //   if (sot?.purpose_cleaning) {
  //     purposes.push(this.getPurposeOptionDescription('CLEANING'));
  //   }
  //   if (sot?.purpose_steam) {
  //     purposes.push(this.getPurposeOptionDescription('STEAM'));
  //   }
  //   if (sot?.purpose_repair_cv) {
  //     purposes.push(this.getPurposeOptionDescription(sot?.purpose_repair_cv));
  //   }
  //   return purposes.join('; ');
  // }

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
    //this.exportToPDF();
    await this.exportToPDF_r1();
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
        const topMargin = 5;
        const bottomMargin = 5;
        const contentWidth = pageWidth - leftMargin - rightMargin;
        const maxContentHeight = pageHeight - topMargin - bottomMargin;
      
        this.generatingPdfLoadingSubject.next(true);
        this.generatingPdfProgress = 0;
      
        const pdf = new jsPDF('l', 'mm', 'a4');
       // const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
        let pageNumber = 1;
      
        let reportTitleCompanyLogo = 32;
        let tableHeaderHeight = 12;
        let tableRowHeight = 8.5;
        let minHeightBodyCell=5;
        let fontSz_hdr = PDFUtility.TableHeaderFontSizeXS_Landscape() - 1;
        let fontSz_body= PDFUtility.TableContentFontSizeXS_Landscape() - 0.5;
        //  let fontSz_hdr = PDFUtility.TableHeaderFontSize_Landscape();
        // let fontSz_body= PDFUtility.ContentFontSize_Landscape()

        const pagePositions: { page: number; x: number; y: number }[] = [];
     //   const progressValue = 100 / cardElements.length;
      
        const reportTitle = this.GetReportTitle() + " : " + `${this.invType}`;
        const headers = [[
          this.translatedLangText.S_N,this.translatedLangText.TANK_NO, 
          this.translatedLangText.IN_DATE,this.translatedLangText.TAKE_IN_REFERENCE, 
          this.translatedLangText.CAPACITY,this.translatedLangText.TARE_WEIGHT,
          this.translatedLangText.LAST_CARGO,this.translatedLangText.CLEAN_DATE, 
          this.translatedLangText.ESTIMATE_NO,this.translatedLangText.ESTIMATE_DATE, 
          this.translatedLangText.APPROVAL_DATE, this.translatedLangText.APPROVAL_REFERENCE,
          this.translatedLangText.AV_DATE,this.translatedLangText.LAST_TEST,
          this.translatedLangText.RELEASE_DATE,
          this.translatedLangText.RELEASE_REFERENCE, this.translatedLangText.CURRENT_STATUS,
          this.translatedLangText.REMARKS, this.translatedLangText.PURPOSE
        ]];
      
        const comStyles : any={ 
          0: { halign: 'center' ,valign:'middle',cellWidth:7 , minCellHeight:minHeightBodyCell},
          1: { halign: 'left'   ,valign:'middle',cellWidth: PDFUtility.TankNo_ColWidth_Landscape_xs(), minCellHeight:minHeightBodyCell },
          2: { halign: 'center' ,valign:'middle',cellWidth: 12 , minCellHeight:minHeightBodyCell},
          3: { halign: 'center' ,valign:'middle',cellWidth: 16 , minCellHeight:minHeightBodyCell, overflow: 'ellipsize' },
          4: { halign: 'center' ,valign:'middle',cellWidth: 12 , minCellHeight:minHeightBodyCell },
          5: { halign: 'center' ,valign:'middle',cellWidth: 11 , minCellHeight:minHeightBodyCell},
          6: { halign: 'left'   ,valign:'middle',cellWidth: 35 , minCellHeight:minHeightBodyCell, overflow: 'ellipsize' },
          7: { halign: 'center' ,valign:'middle',cellWidth: 13 , minCellHeight:minHeightBodyCell},
          8: { halign: 'center' ,valign:'middle',cellWidth: 18 , minCellHeight:minHeightBodyCell},
          9: { halign: 'center' ,valign:'middle',cellWidth: 12 , minCellHeight:minHeightBodyCell},
          10: { halign: 'center',valign:'middle',cellWidth: 12 , minCellHeight:minHeightBodyCell},
          11: { halign: 'center',valign:'middle',cellWidth: 18 , minCellHeight:minHeightBodyCell, overflow: 'ellipsize'},
          12: { halign: 'center',valign:'middle',cellWidth: 12 , minCellHeight:minHeightBodyCell},
          13: { halign: 'center',valign:'middle',cellWidth: 18 , minCellHeight:minHeightBodyCell}, //Last-Test
          14: { halign: 'center',valign:'middle',cellWidth: 12 , minCellHeight:minHeightBodyCell}, //Release Date
          15: { halign: 'center',valign:'middle',cellWidth: 16 , minCellHeight:minHeightBodyCell, overflow: 'ellipsize'}, //Release-Reference
          16: { halign: 'center',valign:'middle',cellWidth: 17 , minCellHeight:minHeightBodyCell},
          17: { halign: 'left'  ,valign:'middle',cellWidth: 16 , minCellHeight:minHeightBodyCell, overflow: 'ellipsize'},
          18: { halign: 'left'  ,valign:'middle',cellWidth: 13 , minCellHeight:minHeightBodyCell},
          };
          
  
        // Define headStyles with valid fontStyle
        const headStyles: Partial<Styles> = {
          fillColor: [211, 211, 211], // Background color
          textColor: 0, // Text color (white)
          fontStyle: "bold", // Valid fontStyle value
          fontSize:fontSz_hdr,
          halign: 'center', // Centering header text
          valign:'middle',
          lineColor:201,
          lineWidth:0.1
        };
      
        let currentY = topMargin;
        let scale = this.scale;
        pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });
        var gap=8;
        
        // await Utility.addHeaderWithCompanyLogo_Landscape(pdf,pageWidth,topMargin,bottomMargin,leftMargin,rightMargin,this.translate);
        // await PDFUtility.addReportTitle(pdf,reportTitle,pageWidth,leftMargin,rightMargin,topMargin+35);
        // Variable to store the final Y position of the last table
        let lastTableFinalY = 40;
        let minHeightHeaderCol=3;
        let fontSize=5;
        
        lastTableFinalY +=8;
        pdf.setFontSize(8);
        const invDate =`${this.translatedLangText.INVENTORY_PERIOD}:${this.date}`;

        let startPosY = await PDFUtility.addHeaderWithCompanyLogoWithTitleSubTitle_Landscape(pdf, pageWidth, topMargin, bottomMargin, leftMargin, 
      rightMargin, this.translate, reportTitle, invDate);
      startPosY+=PDFUtility.GapBetweenSubTitleAndTable_Landscape();
      // startPosY += PDFUtility.GapBetweenLeftTitleAndTable()-3;
      // lastTableFinalY=startPosY;
        // Utility.AddTextAtRightCornerPage(pdf,invDate,pageWidth,leftMargin,rightMargin,48,8);
  
        // const invType=`(${this.invType})`
        // Utility.AddTextAtCenterPage(pdf,invType,pageWidth,leftMargin,rightMargin,lastTableFinalY-2,9);

        var CurrentPage=1;
        var buffer=25;
        for (let n = 0; n < this.report_customer_tank_activity.length; n++) {
            if (n>0) lastTableFinalY+=5;
            else lastTableFinalY=startPosY;
            const data: any[][] = []; // Explicitly define data as a 2D array
            //let startY = lastTableFinalY + 15; // Start Y position for the current table
            let cust = this.report_customer_tank_activity[n];
      
              // Calculate space required for customer name and table
            // var subTitleHeight = 20; // Height required for customer name
            // var tableHeight = ((cust.storing_order_tank?.length||0) * tableRowHeight + tableHeaderHeight); // Approximate table height
        
            // // Check if there is enough space on the current page
            // if (lastTableFinalY + subTitleHeight + tableHeight > maxContentHeight) {
            //   // Add a new page if there isn't enough space
            //   pdf.addPage();
            //   pageNumber++;
            //   lastTableFinalY = topMargin; // Reset Y position for the new page
            //   if (n>0) lastTableFinalY+=8;
            // }

            
          var repPage = pdf.getNumberOfPages();
          //if(repPage==1)lastTableFinalY=45;
          
          if((pageHeight-bottomMargin-topMargin)<(lastTableFinalY+buffer+topMargin))
          {
            pdf.addPage();
            lastTableFinalY=startPosY;
            
          }
          else
          {
            CurrentPage=repPage;
          }
            
            
            //lastTableFinalY+=gap;
            // pdf.setFontSize(10);
            // pdf.setTextColor(0, 0, 0); // Black text
            // pdf.text(`${this.translatedLangText.CUSTOMER} : ${cust.customer}`, leftMargin, lastTableFinalY ); // Add customer name 10mm below the last table
            var leftContent=`${cust.customer}`;
            Utility.AddTextAtLeftCornerPage(pdf,leftContent,pageWidth,leftMargin,rightMargin,lastTableFinalY,PDFUtility.RightSubTitleFontSize());

            let startY =startPosY+PDFUtility.GapBetweenLeftTitleAndTable();
            if((cust.storing_order_tank?.length||0)>0)
            {
              // lastTableFinalY+=5;
              // pdf.setFontSize(8);
              // var subTitle =  `${this.translatedLangText.TANK_STATUS} : ${this.translatedLangText.IN_YARD}`;
              // pdf.text(subTitle, leftMargin, lastTableFinalY);
              // lastTableFinalY+=2;            
              // startY = lastTableFinalY; // Start table 20mm below the customer name
          
              for (let b = 0; b < (cust.storing_order_tank?.length||0); b++) {
                var itm = cust.storing_order_tank?.[b]!;
                data.push([
                  (b+1).toString(), itm.tank_no || "",this.DisplayInDate(itm) || "", this.DisplayTakeInRef(itm) || "",
                  this.DisplayCapacity(itm)|| "", this.DisplayTareWeight(itm) || "", itm.tariff_cleaning?.cargo || "",
                  this.DisplayCleanDate(itm) || "", this.DisplayEstimateNo(itm) || "", this.DisplayEstimateDate(itm) || "",
                  this.DisplayApprovalDate(itm) || "", this.DisplayApprovalRef(itm)||"", this.DisplayAVDate(itm) || "",this.DisplayLastTest(itm) || "",
                  this.DisplayReleaseDate(itm)||"",this.DisplayReleaseRef(itm)||"",this.DisplayCurrentStatus(itm)||"",
                  this.DisplayRemarks(itm)||"",this.displayTankPurpose(itm)||""
                ]);
  
                if(itm.repair)
                {
                  if(itm.repair?.length||0>1)
                    {
                      for(let r=1;r<itm.repair!.length;r++)
                      {
                      var rp = itm.repair?.[r]!;
                      data.push([
                        "", "","","","", "","","",
                        rp.estimate_no|| "", this.displayDate(rp.create_dt) || "", "",
                        "","","","","",this.DisplayCurrentStatus(itm)  || "","", ""
                      ]);
                    }
                  }
                }
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
                margin:{left:leftMargin,top:startY},
                styles: { 
                  fontSize: fontSz_body,
                  minCellHeight: minHeightHeaderCol
                
                },
                columnStyles:comStyles,
                headStyles: headStyles, // Custom header styles
                bodyStyles: { 
                  fillColor: [255, 255, 255],
                  halign: 'left', // Left-align content for body by default
                  valign: 'middle', // Vertically align content
                },
                didDrawPage: (data: any) => {
                  const pageCount = pdf.getNumberOfPages();
                
                  lastTableFinalY = data.cursor.y;
              
                  var pg = pagePositions.find(p=>p.page==pageCount);
                  if(!pg){
                    pagePositions.push({page:pageCount,x:pdf.internal.pageSize.width - 20,y: pdf.internal.pageSize.height - 10});
                    if(pageCount>1)
                    {
                      PDFUtility.addReportTitle_Portrait(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
                  PDFUtility.addReportSubTitle_Portrait(pdf, invDate, pageWidth, leftMargin, rightMargin);
                      // PDFUtility.addReportTitle(pdf,reportTitle,pageWidth,leftMargin,rightMargin,topMargin+45);
                      // Utility.AddTextAtRightCornerPage(pdf,invDate,pageWidth,leftMargin,rightMargin,48,8);
                    }
                  } 
                  },
              });
            }
  
      
        }
      await PDFUtility.addFooterWithPageNumberAndCompanyLogo_Landscape(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate, pagePositions);
        // const totalPages = pdf.getNumberOfPages();
      
         
        // for (const { page, x, y } of pagePositions) {
        //   pdf.setDrawColor(0, 0, 0); // black line color
        //   pdf.setLineWidth(0.1);
        //   pdf.setLineDashPattern([0.01, 0.01], 0.1);
        //   pdf.setFontSize(8);
        //   pdf.setPage(page);

        //   const lineBuffer = 13;
        //   pdf.text(`Page ${page} of ${totalPages}`, pdf.internal.pageSize.width - 14, pdf.internal.pageSize.height - 8, { align: 'right' });
        //   pdf.line(leftMargin, pdf.internal.pageSize.height - lineBuffer, pageWidth - rightMargin, pdf.internal.pageSize.height - lineBuffer);

        //   if (page > 1) {
        //     await Utility.addHeaderWithCompanyLogo_Landscape(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
        //   }
        // }// Add Second Page, Add For Loop

       
        // pagePositions.forEach(({ page, x, y }) => {
        //   pdf.setDrawColor(0, 0, 0); // black line color
        //   pdf.setLineWidth(0.1);
        //  pdf.setLineDashPattern([0.01, 0.01], 0.1);
        //   pdf.setFontSize(8);
        //   pdf.setPage(page);
        //   var lineBuffer=13;
        //   pdf.text(`Page ${page} of ${totalPages}`, pdf.internal.pageSize.width - 20, pdf.internal.pageSize.height - 10, { align: 'right' });
        //   pdf.line(leftMargin, pdf.internal.pageSize.height - lineBuffer, (pageWidth - rightMargin), pdf.internal.pageSize.height - lineBuffer);
        // });
      
        this.generatingPdfProgress = 100;
        Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
  
    //     const pdfBlob = pdf.output('blob');
    //     const blobUrl = URL.createObjectURL(pdfBlob);
    // // Open the PDF in a new browser tab
    // window.open(blobUrl, '_blank');
    // setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  
      //  pdf.save(fileName);
        this.generatingPdfProgress = 0;
        this.generatingPdfLoadingSubject.next(false);
        this.dialogRef.close();
      }

  async exportToPDF_r2(fileName: string = 'document.pdf') {
    const pageWidth = 297; // A4 width in mm (landscape)
    const pageHeight = 220; // A4 height in mm (landscape)
    const leftMargin = 10; 
    const rightMargin = 10;
    const topMargin = 20;
    const bottomMargin = 20;
    const contentWidth = pageWidth - leftMargin - rightMargin; 
    const maxContentHeight = pageHeight - topMargin - bottomMargin; 
  
    this.generatingPdfLoadingSubject.next(true);
    this.generatingPdfProgress = 0;
  
    const pdf = new jsPDF('l', 'mm', 'a4');
    const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    let pageNumber = 1;
  
    let tableHeaderHeight = 10.6153;
    let tableRowHeight = 5.8974;
  
    const pagePositions: { page: number; x: number; y: number }[] = [];
    const progressValue = 100 / cardElements.length;
  
    const reportTitle = this.GetReportTitle();
  
    this.addHeader(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
    let currentY = topMargin; 
    let scale = this.scale;
    pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });
    for (let i = 0; i < cardElements.length; i++) {
        const card = cardElements[i];
        console.log("card : " + i);
  
        const canvas = await html2canvas(card, { scale: scale });
        let imgData = canvas.toDataURL('image/jpeg', this.imageQuality);
        const imgHeight = (canvas.height * contentWidth) / canvas.width;
  
        if (currentY + imgHeight > maxContentHeight) {
            let currentY_canvas = 0;
            let nextPage = false;
            const tableHeaderHeight_canvas = Math.floor((tableHeaderHeight * canvas.width) / contentWidth);
            let tableRowHeight_canvas = Math.floor((tableRowHeight * canvas.width) / contentWidth);
  
            const canvasTHeader = await this.CopyCanvas(canvas, 0, 0, canvas.width, tableHeaderHeight_canvas);
            const pageTHeaderHeight = tableHeaderHeight;
  
            do {
                nextPage = false;
  
                if ((currentY + pageTHeaderHeight + tableRowHeight) < maxContentHeight) {
                    imgData = canvasTHeader.toDataURL('image/jpeg', this.imageQuality);
                    pdf.addImage(imgData, 'JPEG', leftMargin, currentY, contentWidth, pageTHeaderHeight);
                    currentY += pageTHeaderHeight;
                    currentY_canvas += tableHeaderHeight_canvas;
  
                    const remainingPageImgHeight_canvas = ((pageHeight - currentY - bottomMargin) * canvas.width) / contentWidth;
                    const remainingTableHeight_canvas = canvas.height - currentY_canvas;
                    const copyTableHeight_canvas = Math.min(remainingPageImgHeight_canvas, remainingTableHeight_canvas);
                    let cpImgHeight_canvas = Math.floor(copyTableHeight_canvas / tableRowHeight_canvas) * tableRowHeight_canvas;
                    let cpImgHeight = (cpImgHeight_canvas * contentWidth) / canvas.width;
  
                    const cpImgPage_canvas = await this.CopyCanvas(canvas, 0, currentY_canvas, canvas.width, cpImgHeight_canvas);
                    imgData = cpImgPage_canvas.toDataURL('image/jpeg', this.imageQuality);
                    pdf.addImage(imgData, 'JPEG', leftMargin, currentY, contentWidth, cpImgHeight);
  
                    currentY_canvas += cpImgHeight_canvas;
                    currentY += cpImgHeight;
  
                    nextPage = (currentY_canvas + tableRowHeight_canvas) < canvas.height;
                } else {
                  if ((currentY + tableHeaderHeight + tableRowHeight) > maxContentHeight) {
                    pdf.addPage();
                    pageNumber++;
                    this.addHeader(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
                    pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });
                    currentY=topMargin;
                  }
                  
                  nextPage = (currentY + imgHeight > maxContentHeight);
                  if(!nextPage)
                  {
                    pdf.addImage(imgData, 'JPEG', leftMargin, currentY, contentWidth, imgHeight);
                    currentY += imgHeight + 5;
                  }
                }
  
                if (nextPage) {
                    pdf.addPage();
                    currentY = topMargin;
                    pageNumber++;
                    this.addHeader(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
                    currentY_canvas -= tableHeaderHeight_canvas;
                    pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });
                } else {
                    currentY += 5;
                }
  
            } while (nextPage);
  
        } else {
            if ((currentY + tableHeaderHeight + tableRowHeight) > maxContentHeight) {
                pdf.addPage();
                pageNumber++;
                this.addHeader(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
                pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });
                currentY=topMargin;
            }
  
            pdf.addImage(imgData, 'JPEG', leftMargin, currentY, contentWidth, imgHeight);
            currentY += imgHeight + 5;
        }
  
        this.generatingPdfProgress += progressValue;
    }
  
    const totalPages = pdf.getNumberOfPages();
  
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
  
  async CopyCanvas(canvas: HTMLCanvasElement, sx:number , sy:number, sw:number,sh:number): Promise<HTMLCanvasElement> {
    
  
    const splitCanvas = document.createElement('canvas');
    splitCanvas.width = sw;
    splitCanvas.height = sh;
  
    const ctx = splitCanvas.getContext('2d');
    if (ctx) {
        ctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, splitCanvas.width, splitCanvas.height);
    }
  
    return splitCanvas;
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
  
  
  async exportToPDF_r3(fileName: string = 'document.pdf') {
    const pageWidth = 297; // A4 width in mm (landscape)
    const pageHeight = 210; // A4 height in mm (landscape)
    const leftMargin = 10; // Left margin
    const rightMargin = 10; // Right margin
    const topMargin = 20; // Top margin for header
    const bottomMargin = 20; // Bottom margin for footer
    const contentWidth = pageWidth - leftMargin - rightMargin; // Usable width
    const maxContentHeight = pageHeight - topMargin - bottomMargin; // Usable height

    this.generatingPdfLoadingSubject.next(true);
    this.generatingPdfProgress = 0;

    const pdf = new jsPDF('l', 'mm', 'a4');
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
    let pageWidth=297;
    this.generatingPdfLoadingSubject.next(true);
    this.generatingPdfProgress = 0;
    const pdf = new jsPDF('l', 'mm', 'a4');
    const leftMargin = 10; // Left margin
    const rightMargin = 10; // Right margin
    const contentWidth = pageWidth - leftMargin - rightMargin; // 190mm usable width
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
      const titleX = (pageWidth - titleWidth) / 2; // Centering the title (210mm is page width)
  
      const pos=15;
      // pdf.text(reportTitle, titleX, pos); // Position it at the top
  
      // // Draw underline for the title
      // pdf.setLineWidth(0.5); // Set line width for underline
      // pdf.line(titleX, pos+2, titleX + titleWidth, pos+2); // Draw the line under the title
  
      // If card height exceeds A4 page height, split across multiple pages
      if (imgHeight > 190) { // 297mm (A4 height) - 20mm (top & bottom margins)
        let yPosition = 0;
        while (yPosition < canvas.height) {
          const sectionCanvas = document.createElement('canvas');
          sectionCanvas.width = canvas.width;
          sectionCanvas.height = Math.min(800, canvas.height - yPosition); // A4 height in pixels
  
          const sectionCtx = sectionCanvas.getContext('2d');
          sectionCtx?.drawImage(canvas, 0, -yPosition);
  
          const sectionImgData = sectionCanvas.toDataURL('image/jpeg', this.imageQuality); // Convert section to JPEG
  
          pdf.addImage(sectionImgData, 'JPEG', leftMargin, 20, contentWidth, (sectionCanvas.height * contentWidth) / canvas.width); // Adjust y position to leave space for the title
  
          // Store page position for page numbering
          pagePositions.push({ page: pageNumber, x: 280, y: 200 });
  
          yPosition += sectionCanvas.height;
          if (yPosition < canvas.height) {
            pdf.addPage();
            pageNumber++;
            pdf.text(reportTitle, titleX, pos); // Add title on new page
            pdf.setLineWidth(0.5); // Set line width for underline
            pdf.line(titleX,  pos + 2, titleX + titleWidth,  pos + 2); // Draw underline on new page
          }
        }
      } else {
        if (i > 0) pdf.addPage(); // New page for each card
        pdf.addImage(imgData, 'JPEG', leftMargin, 20, contentWidth, imgHeight); // Adjust y position to leave space for the title
        pdf.text(reportTitle, titleX, pos); // Position it at the top

        // Draw underline for the title
        pdf.setLineWidth(0.5); // Set line width for underline
        pdf.line(titleX, pos + 2, titleX + titleWidth, pos + 2); // Draw the line under the title
  
        // Store page position for page numbering
        pagePositions.push({ page: pageNumber, x: 280, y: 200 });
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

 
   GeneratedDate():string
   {
     return  Utility.convertDateToStr(new Date());
   }
   GetReportTitle():string
   {
     return `${this.translatedLangText.YARD_REPORT}`
   }

   removeDeletedInGateAndOutGate(sot:StoringOrderTankItem)
   {
    sot.in_gate = sot?.in_gate?.filter(i=>i.delete_dt==null||i.delete_dt==0)||[];
    sot.out_gate = sot?.out_gate?.filter(i=>i.delete_dt==null||i.delete_dt==0)||[];
    sot.cleaning=sot?.cleaning?.filter(i=>i.delete_dt==null||i.delete_dt==0)||[];
    sot.repair=sot?.repair?.filter(i=>i.delete_dt==null||i.delete_dt==0)||[];
   }

   DisplayInDate(sot:StoringOrderTankItem):string
   {
      this.removeDeletedInGateAndOutGate(sot);
      return Utility.convertEpochToDateStr(sot.in_gate?.[0]?.eir_dt!)!;

   }

   DisplayCleanDate(sot:StoringOrderTankItem):string
   {
    this.removeDeletedInGateAndOutGate(sot);
     return Utility.convertEpochToDateStr(sot.cleaning?.[0]?.complete_dt!)!;;
   }

   DisplayTakeInRef(sot:StoringOrderTankItem):string
   {
    this.removeDeletedInGateAndOutGate(sot);
    //return sot.in_gate?.[0]?.in_gate_survey?.take_in_reference || '';
    return sot.job_no||'';
      

   }

   DisplayTareWeight(sot:StoringOrderTankItem):string
   {
     this.removeDeletedInGateAndOutGate(sot);
     return `${sot.in_gate?.[0]?.in_gate_survey?.tare_weight||''}`;
     

   }

   DisplayCapacity(sot:StoringOrderTankItem):string
   {
     this.removeDeletedInGateAndOutGate(sot);
     return `${sot.in_gate?.[0]?.in_gate_survey?.capacity||''}`;
     

   }

   DisplayEstimateNo(sot:StoringOrderTankItem):string
   {
     this.removeDeletedInGateAndOutGate(sot);
     return `${sot.repair?.[0]?.estimate_no||''}`;

   }

   DisplayEstimateDate(sot:StoringOrderTankItem):string
   {
     this.removeDeletedInGateAndOutGate(sot);
     return Utility.convertEpochToDateStr(sot.repair?.[0]?.create_dt!)!;;
   }
  
   
   DisplayApprovalDate(sot:StoringOrderTankItem):string
   {
     this.removeDeletedInGateAndOutGate(sot);
      return Utility.convertEpochToDateStr(sot.repair?.[0]?.approve_dt!)!;;
     

   }

   DisplayApprovalRef(sot:StoringOrderTankItem):string
   {
     this.removeDeletedInGateAndOutGate(sot);
      return `${sot.repair?.[0]?.job_no||''}`;
     

   }

   DisplayAVDate(sot:StoringOrderTankItem):string
   {

      return Utility.convertEpochToDateStr(sot.repair?.[0]?.complete_dt!)!;;
  }

  DisplayLastTest(sot: StoringOrderTankItem): string {
    var lastTest: string = '';
    lastTest = Utility.DisplayLastTest(sot);
  //   this.removeDeletedInGateAndOutGate(sot);

  //   if (sot.in_gate?.length) {
  //     var last_test_dt :Date = new Date();
  //     if(sot.in_gate?.[0]?.in_gate_survey?.test_dt)
  //     {
  //       last_test_dt = Utility.convertDate(sot.in_gate?.[0]?.in_gate_survey?.test_dt) as Date||new Date();
  //     }
      
  //     lastTest = sot.in_gate?.[0]?.in_gate_survey?.test_class_cv||"";
  //     lastTest += ` ${Utility.convertDateToStr_MonthYear(last_test_dt)}`;
  //     if(sot.in_gate?.[0]?.in_gate_survey?.last_test_cv)
  //     {
  //       lastTest +=` ${(sot.in_gate?.[0]?.in_gate_survey?.last_test_cv=="2.5"?"(A)":"(H)")}`;
  //     }
  //   //nextTest = this.cvDS.getCodeDescription(sot.in_gate?.[0]?.in_gate_survey?.next_test_cv, this.testTypeCvList) || '';
  // }

  // if (sot.out_gate?.length) {
  //   var last_test_dt :Date = new Date();
  //   if(sot.out_gate?.[0]?.out_gate_survey?.test_dt)
  //   {
  //     last_test_dt = Utility.convertDate(sot.out_gate?.[0]?.out_gate_survey?.test_dt) as Date||new Date();
  //   }
    
  //   lastTest = sot.out_gate?.[0]?.out_gate_survey?.test_class_cv||"";
  //   lastTest += ` ${Utility.convertDateToStr_MonthYear(last_test_dt)}`;
  //   if(sot.out_gate?.[0]?.out_gate_survey?.last_test_cv)
  //     {
  //        lastTest +=` ${(sot.out_gate?.[0]?.out_gate_survey?.last_test_cv=="2.5"?"(A)":"(H)")}`;
  //     }
  // }
    // if (this.queryType == 1) {
    //   //lastTest = this.cvDS.getCodeDescription(sot.in_gate?.[0]?.in_gate_survey?.last_test_cv, this.testTypeCvList) || '';
    // }
    // else {
    //   lastTest = this.cvDS.getCodeDescription(sot.out_gate?.[0]?.out_gate_survey?.last_test_cv, this.testTypeCvList) || '';
    // }
    return lastTest;
  }

  DisplayNextTest(sot: StoringOrderTankItem): string {
    var nextTest: string = '';
    nextTest = Utility.DisplayNextTest(sot);
    // var yearsToAdd=2.5;
    // var next_test_dt :Date = new Date();
    // this.removeDeletedInGateAndOutGate(sot);
    // if (sot.in_gate?.length) {
        
    //     if(sot.in_gate?.[0]?.in_gate_survey?.test_dt)
    //     {
    //       next_test_dt = Utility.convertDate(sot.in_gate?.[0]?.in_gate_survey?.test_dt) as Date||new Date();
    //     }
        
    //     next_test_dt.setMonth(next_test_dt.getMonth() + (yearsToAdd * 12));
    //     nextTest = sot.in_gate?.[0]?.in_gate_survey?.test_class_cv||"";
    //     nextTest += ` ${Utility.convertDateToStr_MonthYear(next_test_dt)}`;
    //     if(sot.in_gate?.[0]?.in_gate_survey?.last_test_cv)
    //       {
    //     nextTest +=` ${(sot.in_gate?.[0]?.in_gate_survey?.next_test_cv=="2.5"?"(A)":"(H)")}`;
    //       }
    //   //nextTest = this.cvDS.getCodeDescription(sot.in_gate?.[0]?.in_gate_survey?.next_test_cv, this.testTypeCvList) || '';
    // }

    // if (sot.out_gate?.length) {
    //     if(sot.out_gate?.[0]?.out_gate_survey?.test_dt)
    //     {
    //       next_test_dt = Utility.convertDate(sot.out_gate?.[0]?.out_gate_survey?.test_dt) as Date||new Date();
    //     }
    //     next_test_dt.setMonth(next_test_dt.getMonth() + (yearsToAdd * 12));
    //     nextTest = sot.in_gate?.[0]?.in_gate_survey?.test_class_cv||"";
    //     nextTest += ` ${Utility.convertDateToStr_MonthYear(next_test_dt)}`;
    //     if(sot.out_gate?.[0]?.out_gate_survey?.last_test_cv)
    //       {
    //     nextTest +=` ${(sot.in_gate?.[0]?.in_gate_survey?.next_test_cv=="2.5"?"(A)":"(H)")}`;
    //       }
    // }
    return nextTest;
  }


   DisplayPostInsp(sot:StoringOrderTankItem):string
   {

    return '';
  }
   DisplayReleaseDate(sot:StoringOrderTankItem):string
   {
    this.removeDeletedInGateAndOutGate(sot);
    return Utility.convertEpochToDateStr(sot.out_gate?.[0]?.eir_dt!)!;
    return '';
  }
   DisplayReleaseRef(sot:StoringOrderTankItem):string
   {
    this.removeDeletedInGateAndOutGate(sot);
    return sot.release_job_no||'';
  }
   DisplayCurrentStatus(sot:StoringOrderTankItem):string
   {

    return this.cvDS.getCodeDescription(sot.tank_status_cv,this.TankStatusCvList)||'';;
  }
   DisplayRemarks(sot:StoringOrderTankItem):string
   {

    return sot?.remarks||'';
  }
  
 
  
}
