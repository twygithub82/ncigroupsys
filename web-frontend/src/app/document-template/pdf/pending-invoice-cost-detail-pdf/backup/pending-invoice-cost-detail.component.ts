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
import { report_billing_customer, report_billing_item } from 'app/data-sources/billing';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { RepairCostTableItem } from 'app/data-sources/repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { SteamDS } from 'app/data-sources/steam';
import { SteamPartDS } from 'app/data-sources/steam-part';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
// import { fileSave } from 'browser-fs-access';

export interface DialogData {
  billing_customers: report_billing_customer[],
  cut_off_dt:string
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
  selector: 'app-pending-invoice-cost-detail',
  templateUrl: './pending-invoice-cost-detail.component.html',
  styleUrls: ['./pending-invoice-cost-detail.component.scss'],
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
export class PendingInvoiceCostDetailPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    INVOICE_PERIOD:'COMMON-FORM.INVOICE-PERIOD',
    CUSTOMER_INVOICE:'MENUITEMS.BILLING.LIST.CUSTOMER-INVOICE',
    LOLO_COST:'COMMON-FORM.LOLO-COST-REPORT',
    STEAM_COST:'COMMON-FORM.STEAM-COST-REPORT',
    RESIDUE_COST:'COMMON-FORM.RESIDUE-COST-REPORT',
    IN_DATE:'COMMON-FORM.IN-DATE',
    OUT_DATE:'COMMON-FORM.OUT-DATE',
    TOTAL:'COMMON-FORM.TOTAL',
    DAYS:'COMMON-FORM.DAYS',
    CLEAN_COST:'COMMON-FORM.CLEAN-COST-REPORT',
    REPAIR_COST:'COMMON-FORM.REPAIR-COST-REPORT',
    PREINSP_COST:'COMMON-FORM.PREINSP-COST-REPORT',
    STORAGE_COST:'COMMON-FORM.STORAGE-COST-REPORT',
    REPORT_TITLE:'COMMON-FORM.PENDING-INVOICE-DETAIL-COST',
    CUTOFF_DATE:'COMMON-FORM.CUTOFF-DATE',
    GATEIO_S:'COMMON-FORM.GATEIO-S'

  }

  cut_off_dt:string;
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

  scale = 2.5;
  imageQuality = 0.75;
  maxItemPerPage=25;

  generatedPDF: any;
  existingPdf?: any;
  existingPdfSafeUrl?: any;
  isImageLoading$: Observable<boolean> = this.fileManagerService.loading$;
  isFileActionLoading$: Observable<boolean> = this.fileManagerService.actionLoading$;

  private generatingPdfLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  generatingPdfLoading$: Observable<boolean> = this.generatingPdfLoadingSubject.asObservable();
  generatingPdfProgress = 0;
  repBillingCustomers:report_billing_customer[]=[];

  

  constructor(
    public dialogRef: MatDialogRef<PendingInvoiceCostDetailPdfComponent>,
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
    
    this.repBillingCustomers= this.removeEstimateWithZeroTotal(data.billing_customers);
    this.cut_off_dt=data.cut_off_dt;

    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  removeEstimateWithZeroTotal(cust:report_billing_customer[]):report_billing_customer[]
  {
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
    return `${this.translatedLangText.REPORT_TITLE} `
  }

  async exportToPDF_r1(fileName: string = 'document.pdf') {
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

    const reportTitle =this.translatedLangText.REPORT_TITLE;// Set your report title here

    // Add header to the first page
    this.addHeader(pdf, reportTitle, pageWidth, leftMargin, rightMargin);

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
            this.addHeader(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
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
  
      const pos=15;
      // pdf.text(reportTitle, titleX, pos); // Position it at the top
  
      // // Draw underline for the title
      // pdf.setLineWidth(0.5); // Set line width for underline
      // pdf.line(titleX, pos+2, titleX + titleWidth, pos+2); // Draw the line under the title
  
      // If card height exceeds A4 page height, split across multiple pages
      if (imgHeight > 270) { // 297mm (A4 height) - 20mm (top & bottom margins)
        let yPosition = 0;
        let maxItemPerPage=this.maxItemPerPage;
        let counter=1;
        while (yPosition !=-1) {
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
            if (index<((counter-1)*maxItemPerPage)|| index >= (counter*maxItemPerPage)) {
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
          const bal = rows.length-(counter*maxItemPerPage);
          if(bal>0)pdf.addPage();
          else break;
          counter++;
        }
      } else {
        if (i > 0) pdf.addPage(); // New page for each card
        pdf.addImage(imgData, 'JPEG', leftMargin, 20, contentWidth, imgHeight); // Adjust y position to leave space for the title
  
        pdf.text(reportTitle, titleX, pos); // Position it at the top
  
        // Draw underline for the title
        pdf.setLineWidth(0.5); // Set line width for underline
        pdf.line(titleX, pos+2, titleX + titleWidth, pos+2); // Draw the line under the title
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

 

   GeneratedDate():string
   {
     return  Utility.convertDateToStr(new Date());
   }

   displayCleanCost(item:report_billing_item):string
   {
     let retval:string='';

      retval = (item.clean_cost==="0.00" || item.clean_cost===undefined?'':`${item.clean_cost}`)
     return retval;
   }
   displayStorageCost(item:report_billing_item):string
   {
     let retval:string='';

      retval = (item.storage_cost==="0.00" || item.storage_cost===undefined?'':`${item.storage_cost}`)
     return retval;
   }
   displaySteamCost(item:report_billing_item):string
   {
     let retval:string='';

      retval = (item.steam_cost==="0.00"|| item.steam_cost===undefined?'':`${item.steam_cost}`)
     return retval;
   }
   displayRepairCost(item:report_billing_item):string
   {
     let retval:string='';

      retval = (item.repair_cost==="0.00" || item.repair_cost===undefined?'':`${item.repair_cost}`)
     return retval;
   }

   displayResidueCost(item:report_billing_item):string
   {
     let retval:string='';

      retval = (item.residue_cost==="0.00" || item.residue_cost===undefined?'':`${item.residue_cost} `)
     return retval;
   }

   displayLOLOCost(item:report_billing_item):string
   {
     let retval:string='';

      retval = (item.lolo_cost==="0.00" || item.lolo_cost===undefined?'':`${item.lolo_cost} `)
     return retval;
   }

   displayPreinsCost(item:report_billing_item):string
   {
     let retval:string='';

      retval = (item.preins_cost==="0.00" || item.preins_cost===undefined?'':`${item.preins_cost} `)
     return retval;
   }

   displayGateIOCost(item:report_billing_item):string
   {
     let retval:string='';

      retval = (item.gateio_cost==="0.00" || item.gateio_cost===undefined?'':`${item.gateio_cost} (${item.gateio_est_no})`)
     return retval;
   }
  
}
