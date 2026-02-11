import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { Utility } from 'app/utilities/utility';
import { CLEANLINESS_COMMENT_CONFIG, cleanlinessReportTextBlock, customerInfo, systemCurrencyCode } from 'environments/environment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
// import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { FileManagerService } from '@core/service/filemanager.service';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { RepairCostTableItem, RepairDS } from 'app/data-sources/repair';
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { PDFUtility } from 'app/utilities/pdf-utility';
import autoTable, { RowInput, Styles } from 'jspdf-autotable';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { InGateCleaningDS } from 'app/data-sources/in-gate-cleaning';
import { AuthService } from '@core';
// import { fileSave } from 'browser-fs-access';

export interface DialogData {
  cleaning_guid: string;
  // customer_company_guid: string;
  // sotDS: StoringOrderTankDS;
  // repairDS: RepairDS;
  // ccDS: CustomerCompanyDS;
  // cvDS: CodeValuesDS;
  // repairEstimatePdf?: any;
  // estimate_no?: string;
  // retrieveFile: boolean;
}

@Component({
  selector: 'app-cleaning-report-pdf',
  templateUrl: './cleaning-report-pdf.component.html',
  styleUrls: ['./cleaning-report-pdf.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule
  ],
})
export class CleanReportPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    RATE: 'COMMON-FORM.RATE',
    ESTIMATE_COST: 'COMMON-FORM.ESTIMATE-COST',
    FOR: 'COMMON-FORM.FOR',
    NET_COST: 'COMMON-FORM.NET-COST',
    LABOUR_DISCOUNT: 'COMMON-FORM.LABOUR-DISCOUNT',
    MATERIAL_DISCOUNT: 'COMMON-FORM.MATERIAL-DISCOUNT',
    PAGE: 'COMMON-FORM.PAGE',
    OF: 'COMMON-FORM.OF',
    REPAIR_ESTIMATE: 'COMMON-FORM.REPAIR-ESTIMATE',
    QUOTATION_DATE: 'COMMON-FORM.QUOTATION-DATE',
    ESTIMATE_TOTAL:'COMMON-FORM.ESTIMATE-TOTAL',
    APPROVED_TOTAL:'COMMON-FORM.APPROVED-TOTAL',
    MATERIAL_COST$:'COMMON-FORM.MATERIAL-COST$',
    TOTAL_COST:'COMMON-FORM.TOTAL-COST',
    PERCENTAGE_SYMBOL:'COMMON-FORM.PERCENTAGE-SYMBOL',
    TOTAL:'COMMON-FORM.TOTAL',
    LESSEE:'COMMON-FORM.LESSEE',
    PREPARED_BY:'COMMON-FORM.PREPARED-BY',
    REPAIR_DISCLAIMER:'COMMON-FORM.REPAIR-DISCLAIMER',
    APPROVED_BY:'COMMON-FORM.APPROVED-BY',
    EQUIVALENT:'COMMON-FORM.EQUIVALENT',
    AMOUNT:'COMMON-FORM.AMOUNT',
    HRS:'COMMON-FORM.HRS',
    SUMMARY_COST:'COMMON-FORM.SUMMARY-COST',
    NOTE:'COMMON-FORM.NOTE',
    CLEANING_REPORT:'COMMON-FORM.CLEANING-REPORT',
    CERTIFICATE_CLEANILINESS:'COMMON-FORM.CERTIFICATE-CLEANILINESS',
    CERTIFICATE_NO:'COMMON-FORM.CERTIFICATE-NO',
    REFERENCE_NO:'COMMON-FORM.REFERENCE-NO',
    CARGO:'COMMON-FORM.CARGO',
    CARGO_NATURE:'COMMON-FORM.CARGO-NATURE',
    CARGO_CLASS:'COMMON-FORM.CARGO-CLASS',
    UN_NO:'COMMON-FORM.CARGO-UN-NO',
    CLEANING_DETAILS:'COMMON-FORM.CLEANING-DETAILS',
    CLEANING_PROCEDURE: "COMMON-FORM.CLEANING-PROCEDURE",
    CLEANING_DATE: "COMMON-FORM.CLEANING-DATE",
    CLEANED_BY: "COMMON-FORM.CLEANED-BY",
    COMPLETION_DATE:"COMMON-FORM.COMPLETION-DATE",
    DESCRIPTION_STEPS:'COMMON-FORM.DESCRIPTION-STEPS',
    MINUTES:'COMMON-FORM.MINUTES',
    COMMENTS:'COMMON-FORM.COMMENTS',
    GENERATED_DATE:'COMMON-FORM.GENERATED-DATE',
    GENERATED_BY:'COMMON-FORM.GENERATED-BY',
    CARGO_NAME:'COMMON-FORM.CARGO-NAME',
    

    
  }
  @Output() repairEstimateEvent = new EventEmitter<any>();

  type?: string | null;
  cleanDS: InGateCleaningDS;
  // repairPartDS: RepairPartDS;
  // sotDS: StoringOrderTankDS;
  // ccDS: CustomerCompanyDS;
  // cvDS: CodeValuesDS;
  repair_guid?: string | null;
  customer_company_guid?: string | null;
  estimate_no?: string | null;

  customerInfo: any = customerInfo;
  disclaimerNote: string = "";
  pdfTitle: string = "";
  cleanItem: any;

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

  scale = 1.1;
  imageQuality = 0.85;

  generatedPDF: any;
  repairEstimatePdf?: any;
  repairEstimatePdfSafeUrl?: any;
  isImageLoading$: Observable<boolean> = this.fileManagerService.loading$;
  isFileActionLoading$: Observable<boolean> = this.fileManagerService.actionLoading$;

  private generatingPdfLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  generatingPdfLoading$: Observable<boolean> = this.generatingPdfLoadingSubject.asObservable();
  generatingPdfProgress = 0;
  cleanGuid: string = '';
  constructor(
    public dialogRef: MatDialogRef<CleanReportPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private authService: AuthService

  ) {
    super();
    this.translateLangText();
    this.cleanDS = new InGateCleaningDS(this.apollo);
    this.cleanGuid= data.cleaning_guid;
    
    // this.repairPartDS = new RepairPartDS(this.apollo);
    // this.sotDS = new StoringOrderTankDS(this.apollo);
    // this.ccDS = new CustomerCompanyDS(this.apollo);
    // this.cvDS = new CodeValuesDS(this.apollo);
    // this.repair_guid = data.repair_guid;
    // this.customer_company_guid = data.customer_company_guid;
    // this.repairEstimatePdf = data.repairEstimatePdf;
    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  async ngOnInit() {
    // Await the data fetching
    // const [data, pdfData] = await Promise.all([
    //   this.getRepairData(),
    //   this.data.retrieveFile ? this.getRepairPdf() : Promise.resolve(null)
    // ]);
    if (this.cleanGuid) {
      await this.getCleaningReportData();
     
      this.generatePDF();
    }
  }

  

  async generatePDF(): Promise<void> {
    await this.exportToPDF_r2();
   
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

  async getCleaningReportData(): Promise<void> {
  const where = { guid: { eq: this.cleanGuid } };

  try {
    const data = await firstValueFrom(
      this.cleanDS.searchCleaningReport(where)
    );

    this.cleanItem = data;
  } catch (error) {
    console.error('Failed to get cleaning report data', error);
    throw error; // optional, only if caller needs to know
  }
}

  // getRepairData(): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     this.subs.sink = this.repairDS.getRepairByIDForPdf(this.repair_guid!, this.customer_company_guid!).subscribe({
  //       next: (data) => resolve(data),
  //       error: (err) => reject(err),
  //     });
  //   });
  // }

  getRepairPdf(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.fileManagerService.getFileUrlByGroupGuid([this.repair_guid!]).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err),
      });
    });
  }

  // async getCodeValuesData(): Promise<void> {
  //   const queries = [
  //     { alias: 'groupNameCv', codeValType: 'GROUP_NAME' },
  //     { alias: 'yesnoCv', codeValType: 'YES_NO' },
  //     { alias: 'soTankStatusCv', codeValType: 'SO_TANK_STATUS' },
  //     { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
  //     { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
  //     { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
  //     { alias: 'partLocationCv', codeValType: 'PART_LOCATION' },
  //     { alias: 'damageCodeCv', codeValType: 'DAMAGE_CODE' },
  //     { alias: 'repairCodeCv', codeValType: 'REPAIR_CODE' },
  //     { alias: 'unitTypeCv', codeValType: 'UNIT_TYPE' },
  //   ];

  //   await this.cvDS.getCodeValuesByTypeAsync(queries);

  //   // Wrap all alias connections in promises
  //   const promises = [
  //     firstValueFrom(this.cvDS.connectAlias('groupNameCv')).then(async data => {
  //       this.groupNameCvList = data || [];
  //       const subqueries: any[] = [];
  //       data.map(d => {
  //         if (d.child_code) {
  //           let q = { alias: d.child_code, codeValType: d.child_code };
  //           const hasMatch = subqueries.some(subquery => subquery.codeValType === d.child_code);
  //           if (!hasMatch) {
  //             subqueries.push(q);
  //           }
  //         }
  //       });

  //       // Process subqueries if any
  //       if (subqueries.length > 0) {
  //         await this.cvDS?.getCodeValuesByTypeAsync(subqueries);

  //         for (const s of subqueries) {
  //           const subData = await firstValueFrom(this.cvDS.connectAlias(s.alias));
  //           if (subData) {
  //             this.subgroupNameCvList = [...new Set([...this.subgroupNameCvList, ...subData])];
  //           }
  //         }
  //       }

  //     }),
  //     firstValueFrom(this.cvDS.connectAlias('yesnoCv')).then(data => {
  //       this.yesnoCvList = data || [];
  //     }),
  //     firstValueFrom(this.cvDS.connectAlias('soTankStatusCv')).then(data => {
  //       this.soTankStatusCvList = data || [];
  //     }),
  //     firstValueFrom(this.cvDS.connectAlias('purposeOptionCvList')).then(data => {
  //       this.purposeOptionCvList = data || [];
  //     }),
  //     firstValueFrom(this.cvDS.connectAlias('testTypeCv')).then(data => {
  //       this.testTypeCvList = data || [];
  //     }),
  //     firstValueFrom(this.cvDS.connectAlias('testClassCv')).then(data => {
  //       this.testClassCvList = data || [];
  //     }),
  //     firstValueFrom(this.cvDS.connectAlias('partLocationCv')).then(data => {
  //       this.partLocationCvList = data || [];
  //     }),
  //     firstValueFrom(this.cvDS.connectAlias('damageCodeCv')).then(data => {
  //       this.damageCodeCvList = data || [];
  //       this.chunkedDamageCodeCvList = this.chunkArray(this.damageCodeCvList, 10);
  //     }),
  //     firstValueFrom(this.cvDS.connectAlias('repairCodeCv')).then(data => {
  //       this.repairCodeCvList = data || [];
  //       this.chunkedRepairCodeCvList = this.chunkArray(this.repairCodeCvList, 10);
  //     }),
  //     firstValueFrom(this.cvDS.connectAlias('unitTypeCv')).then(data => {
  //       this.unitTypeCvList = data || [];
  //     })
  //   ];

  //   // Wait for all promises to resolve
  //   await Promise.all(promises);
  // }

  chunkArray(array: any[], chunkSize: number): any[][] {
    const chunks: any[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // updateData(newData: RepairPartItem[] | undefined): void {
  //   if (newData?.length) {
  //     newData = newData.map((row) => ({
  //       ...row,
  //       approve_qty: this.displayApproveQty(row),
  //       approve_hour: this.displayApproveHour(row),
  //       approve_cost: this.displayApproveCost(row),
  //       tariff_repair: {
  //         ...row.tariff_repair,
  //         sequence: this.getGroupSeq(row.tariff_repair?.group_name_cv)
  //       }
  //     }));


  //     console.log('Before sort', newData);
  //     newData = this.repairPartDS.sortAndGroupByGroupName(newData);
  //     console.log('After sort', newData);
  //     // newData = [...this.sortREP(newData)];

  //     this.repList = newData.map((row, index) => ({
  //       ...row,
  //       index: index
  //     }));
  //     console.log(this.repList);
  //     // this.repairItem.repair_part = this.repList;
  //     this.calculateCost();
  //   } else {
  //     this.repList = [];
  //     this.calculateCost();
  //   }
  // }

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
   // this.repairCost = this.repairDS.calculateCost(this.repairItem, this.repairItem?.repair_part);
    // this.repairCost = this.repairDS.calculateCostWithRoundUp(this.repairItem, this.repairItem?.repair_part);
    console.log(this.repairCost)
  }

  async onDownloadClick() {
    const fileName = `REPAIR_ESTIMATE-${this.estimate_no}.pdf`; // Define the filename
    if (this.generatedPDF) {
      this.downloadFile(this.generatedPDF, fileName);
    } else if (this.repairEstimatePdf?.[0]?.url) {
      const blob = await Utility.urlToBlob(this.repairEstimatePdf?.[0]?.url);
      this.downloadFile(blob, fileName);
    }
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

  onRepublshClick() {
    this.deleteFile();
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
          this.repairEstimatePdf = [
            {
              description: pdfDescription,
              url: response?.url?.[0]
            }
          ];
          this.repairEstimateEvent.emit({ type: 'uploaded', repairEstimatePdf: this.repairEstimatePdf });
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
    if (this.repairEstimatePdf?.[0]?.url) {
      this.fileManagerService.deleteFile([this.repairEstimatePdf?.[0]?.url]).subscribe({
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

  
  getReportTitle() {
    return (this.translatedLangText.CERTIFICATE_CLEANILINESS).toUpperCase() ;
  }

  async exportToPDF_r2(fileName: string = 'document.pdf') {
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
    //const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    let pageNumber = 1;

    let reportTitleCompanyLogo = 32;
    let tableHeaderHeight = 12;
    let tableRowHeight = 8.5;
    let minHeightHeaderCol = 3;
    let minHeightBodyCell = 7;
    let fontSz = 8.5;

    const pagePositions: { page: number; x: number; y: number }[] = [];
    // const progressValue = 100 / cardElements.length;

    const reportTitle = this.translatedLangText.CERTIFICATE_CLEANILINESS;

    

    let currentY = topMargin;
    let scale = this.scale;
    pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });


    // Variable to store the final Y position of the last table
    let lastTableFinalY = 40;

    let startY = lastTableFinalY ; // Start table 20mm below the customer name
    var item = this.cleanItem[0];
    var cc = item.storing_order_tank?.storing_order?.customer_company;
    
     await PDFUtility.addHeaderWithCompanyLogoWithTitleSubTitle_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin,
       this.translate, '', '');
       
       this.addStyledTextArrayRTL(pdf, 
        [
          { text: `${this.translatedLangText.CERTIFICATE_NO}: `, fontSize: 12, textColor: [0, 0, 0] },
          { text: `${item.storing_order_tank?.in_gate?.[0]?.eir_no||''}`, fontSize: 12, textColor: [0, 0, 0], underline: true }
        ], 
        startY-3, rightMargin+2);
        startY+=9;
        PDFUtility.AddTextAtCenterPage(pdf,reportTitle.toUpperCase(),  pageWidth,leftMargin,rightMargin,startY,22,'',true);

        var w= 70;
        var h=10;
       var startX=pageWidth-rightMargin-w;
      
      //  PDFUtility.drawBoxWithText(pdf,{x:startX,y:startY-8,width:w,height:h,radius:0,text:`${this.translatedLangText.CERTIFICATE_NO}: ${item.storing_order_tank?.in_gate?.[0]?.eir_no||''}`});
    startY+=(PDFUtility.GapBetweenSubTitleAndTable_Portrait()*2) - PDFUtility.GapBetweenLeftTitleAndTable();
    
    startY= await this.AddCustomerInfoTable_r1(pdf, pageWidth, leftMargin, rightMargin,startY);
    //  w= (pageWidth+2)-rightMargin-leftMargin;

     startY+=5;
    startY= this.AddCleanlinessComments(pdf, CLEANLINESS_COMMENT_CONFIG,  
      { sealNo: `${item.seal_no||"-"}`
        ,remark: `${item.remarks||"-"}`
        ,generatedBy: `${this.authService.currentUserName||"-"}`
        ,generatedDate: `${this.formatDateToString(new Date())||""}`
      }, startY);
    // h=8;
    // PDFUtility.drawBoxWithText(pdf,{x:leftMargin,y:startY+1,width:w,height:h,text:`${this.translatedLangText.CLEANING_DETAILS}`,fontSize:10,paddingY:-5,paddingX:3,radius:0});

    // startY+=h+2;
    // startY=await this.AddCleaningDetailsTable(pdf, pageWidth, leftMargin, rightMargin,startY);
    // PDFUtility.addText(pdf, this.translatedLangText.DESCRIPTION_STEPS, startY+6, leftMargin+1, 10, true);
    // startY+=PDFUtility.GapBetweenLeftTitleAndTable()+6;
    // startY=await this.AddCleaningStepsTable(pdf, pageWidth, leftMargin, rightMargin, startY);

    //  w= (pageWidth+2)-rightMargin-leftMargin;
    // h=40;
    // PDFUtility.drawBoxWithText(pdf,{x:leftMargin,y:startY+1,width:w,height:h,text:`${this.translatedLangText.COMMENTS}`,fontStyle:'bold',fontSize:10,paddingY:-5,paddingX:3,radius:0});
    // startY=pageHeight-bottomMargin-70;
    // var buffer=14;
    // PDFUtility.addText(pdf, this.translatedLangText.REMARKS, startY+buffer, leftMargin+1, 10, true);
    // PDFUtility.addText(pdf,  item.remarks||'', startY+buffer+4, leftMargin+1, 10, false);
    // startY=pageHeight-bottomMargin-40;
    // this.AddHeaderInfoTable(pdf, pageWidth, leftMargin, rightMargin, startY);
    this.downloadFile(pdf.output('blob'), this.getReportTitle())
    this.dialogRef.close();
  }



  AddHeaderInfoTable(
  pdf: jsPDF,
  pageWidth: number,
  leftMargin: number,
  rightMargin: number,
  startY: number
): number {

   const lColor = 180;
    var grayColor=255;
  const contentWidth = pageWidth - leftMargin - rightMargin;
  const lineColor = 180;
  const fontSize = 9;
 var item = this.cleanItem[0];
  var data: any[][]  = [
    [
      {
        content: `${customerInfo.companyName}`,
        styles: { fontStyle: 'bold' }
      },
      {
        content: `${item.storing_order_tank?.customer_company?.name||''}`,
        styles: { fontStyle: 'bold' }
      }
    ],
    [
       `${this.translatedLangText.GENERATED_BY}: ${this.authService.currentUserName}`,
       `${this.translatedLangText.HAULIER}: ${item.storing_order_tank?.storing_order?.haulier||''}`
    ],
    [
      `${this.translatedLangText.GENERATED_DATE}: ${ Utility.convertDateToStr(new Date())}`,
      `${this.translatedLangText.VEHICLE_NO}: ${item.storing_order_tank?.in_gate?.[0]?.vehicle_no||''}`
    ],
    [
      '',
       `${this.translatedLangText.DRIVER_NAME}: ${item.storing_order_tank?.in_gate?.[0]?.driver_name||''}`
    ]
  ];

  var lastTableFinalY =startY;
  let minHeightHeaderCol = 3;
    let minHeightBodyCell = 10;
    let fontSz =9;
  autoTable(pdf, {
    startY: startY,
    body: data,
    theme: 'plain',
    tableWidth: contentWidth,
    margin: { left: leftMargin },

     styles: {
            cellPadding: { left: 2, right: 2, top: 2, bottom: 2 },
            fontSize: fontSz,
            minCellHeight: minHeightHeaderCol,
            lineWidth: 0,
          },

    columnStyles: {
      0: { cellWidth: contentWidth / 2 },
      1: { cellWidth: contentWidth / 2 }
    },

    didDrawCell: function(data) {
            pdf.setDrawColor(lColor, lColor, lColor);
            pdf.setLineWidth(0.05);
             if ((data.column.index%2) === 0) {
               pdf.line(
                data.cell.x,
                data.cell.y,
                data.cell.x,
                data.cell.y + data.cell.height);
             }
            // Draw top line (for every cell in first column to avoid duplicates)
            
              pdf.line(
                data.cell.x,
                data.cell.y,
                data.cell.x + data.cell.width,
                data.cell.y
              );
            
            
            // Draw bottom line (for every cell in last column to avoid duplicates)
            
              pdf.line(
                data.cell.x,
                data.cell.y + data.cell.height,
                data.cell.x + data.cell.width,
                data.cell.y + data.cell.height
              );
            
          },
          
          didDrawPage: (data: any) => {
            const pageCount = pdf.getNumberOfPages();
            lastTableFinalY = data.cursor.y;
            
            // Manually draw outer border
            pdf.setDrawColor(lColor, lColor, lColor);
            pdf.setLineWidth(0.1);
            pdf.rect(leftMargin, startY, contentWidth, lastTableFinalY - startY);
          },
  });

  return (pdf as any).lastAutoTable.finalY;
}

async AddCleaningStepsTable(
  pdf: jsPDF,
  pageWidth: number,
  leftMargin: number,
  rightMargin: number,
  posY: number
): Promise<number> {

  const lColor = 180;
  const grayColor = 255;
  const contentWidth = (pageWidth + 2) - leftMargin - rightMargin;

  const minHeightHeaderCol = 3;
  const minHeightBodyCell = 7;
  const fontSz = 8;

  const startY = posY;
  let lastTableFinalY = posY;

  const item = this.cleanItem[0];
  const cm = item.storing_order_tank?.tariff_cleaning?.cleaning_method;

  /* ---------- Column styles (3 columns) ---------- */
  const comStyles: any = {
    0: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell },
    1: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell },
    2: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell },
  };

  /* ---------- Header styles ---------- */
  const headStyles: Partial<Styles> = {
    fillColor: [grayColor, grayColor, grayColor],
    textColor: 0,
    fontStyle: 'bold',
    halign: 'center',
    valign: 'middle',
    lineColor: [lColor, lColor, lColor],
    lineWidth: 0
  };

  /* ---------- Build table data (3 cols x 4 rows, column-wise) ---------- */
  const rows = 3;
  const cols = 3;

  const data: string[][] = Array.from({ length: rows }, () =>
    Array(cols).fill('')
  );

  cm.cleaning_method_formula
    .filter((x: any) => x.delete_dt==0||x.delete_dt==null)
    .sort((a: any, b: any) => a.sequence - b.sequence)
    .slice(0, rows * cols)
    .forEach((element: any, index: number) => {

      const rowIndex = index % rows;
      const colIndex = Math.floor(index / rows);

      const cnt =
        `- ${element.cleaning_formula?.description}  ` +
        `${element.cleaning_formula?.duration} ${this.translatedLangText.MINUTES}`;

      if (colIndex < cols) {
        data[rowIndex][colIndex] = cnt;
      }
    });

  /* ---------- AutoTable ---------- */
  autoTable(pdf, {
    body: data,
    startY: startY,
    theme: 'grid',
    margin: { left: leftMargin },
    tableWidth: contentWidth,

    styles: {
      cellPadding: { left: 1, right: 1, top: 1, bottom: 1 },
      fontSize: fontSz,
      minCellHeight: minHeightHeaderCol,
      lineWidth: 0,
      lineColor: [255, 255, 255],
    },

    headStyles: headStyles,
    columnStyles: comStyles,

    bodyStyles: {
      fillColor: [255, 255, 255],
      halign: 'left',
      valign: 'middle',
      lineWidth: 0
    },

    

    didDrawPage: (data: any) => {
      lastTableFinalY = data.cursor.y;

      // // outer border
      // pdf.setDrawColor(lColor, lColor, lColor);
      // pdf.setLineWidth(0.1);
      // pdf.rect(leftMargin, startY, contentWidth, lastTableFinalY - startY);
    }
  });

  return lastTableFinalY;
}

 async AddCleaningDetailsTable(pdf: jsPDF, pageWidth: number, leftMargin: number, rightMargin: number,posY:number):Promise<number>
  {

    const lColor = 180;
    var grayColor=255;
     const contentWidth = (pageWidth+2) - leftMargin - rightMargin;
     let minHeightHeaderCol = 3;
    let minHeightBodyCell = 7;
    let fontSz = 9;
    //  let lastTableFinalY = posY;

    let startY = posY ; // Start table 20mm below the customer name
    var item = this.cleanItem[0];
    var cc = item.storing_order_tank?.storing_order?.customer_company;
    
    
     const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '50%' },
      1: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '10%' },
      2: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '10%' },
      3: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '30%' },
    };

    
    // Define headStyles with valid fontStyle
    const headStyles: Partial<Styles> = {
      fillColor: [grayColor, grayColor, grayColor], // Background color
      textColor: 0, // Text color (white)
      fontStyle: "bold", // Valid fontStyle value
      halign: 'center', // Centering header text
      valign: 'middle',
      lineColor: [lColor, lColor, lColor],
       lineWidth: 0
    };

    
    var data: any[][] = [
      [
        { content: `${this.translatedLangText.CLEANING_PROCEDURE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tariff_cleaning?.cleaning_method?.description}` },
        { content: `${this.translatedLangText.CLEANING_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDateTime(item?.job_order?.start_dt)||"-"}` }
      ],
      [
        { content: `${this.translatedLangText.CLEANED_BY}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.update_by}` },
        { content: `${this.translatedLangText.COMPLETION_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDateTime(item?.update_dt)}` }
      ]
    ];

     var offhireCodeHeight=49;
     var lastTableFinalY =posY;

     autoTable(pdf, {
  body: data,
  startY: startY,
  theme: 'grid',
  margin: { left: leftMargin },
  styles: {
    cellPadding: { left: 2, right: 2, top: 2, bottom: 2 },
    fontSize: fontSz,
    minCellHeight: minHeightHeaderCol,
    lineWidth: 0, // Set all lines to 0 width
    lineColor: [255, 255, 255], // Make lines invisible
  },
  headStyles: headStyles,
  tableWidth: contentWidth,
  columnStyles: {
    0: { cellWidth: 35, lineWidth: 0 },
    1: { cellWidth: 61, lineWidth: 0 },
    2: { cellWidth: 35, lineWidth: 0 },
    3: { cellWidth: 61, lineWidth: 0 }
  },
  bodyStyles: {
    fillColor: [255, 255, 255],
    halign: 'left',
    valign: 'middle',
    lineWidth: 0 // Ensure body cells have no lines
  },
    didDrawCell: function(data) {
            pdf.setDrawColor(lColor, lColor, lColor);
            pdf.setLineWidth(0.1);
            
             if ((data.column.index%2) === 0) {
               pdf.line(
                data.cell.x,
                data.cell.y,
                data.cell.x,
                data.cell.y + data.cell.height);
             }
            // Draw top line (for every cell in first column to avoid duplicates)
            
              pdf.line(
                data.cell.x,
                data.cell.y,
                data.cell.x + data.cell.width,
                data.cell.y
              );
            
            
            // Draw bottom line (for every cell in last column to avoid duplicates)
            
              pdf.line(
                data.cell.x,
                data.cell.y + data.cell.height,
                data.cell.x + data.cell.width,
                data.cell.y + data.cell.height
              );
            
          },
  // Add didDrawPage to manually draw outer border
  didDrawPage: (data: any) => {
    const pageCount = pdf.getNumberOfPages();
    lastTableFinalY = data.cursor.y;
    
    // Manually draw outer border
    pdf.setDrawColor(lColor, lColor, lColor);
    pdf.setLineWidth(0.1);
    pdf.rect(leftMargin, startY, contentWidth, lastTableFinalY - startY);
  },
});

   
  
     return lastTableFinalY;

  }


  async AddCustomerInfoTable_r1(pdf: jsPDF, pageWidth: number, leftMargin: number, rightMargin: number,posY:number):Promise<number>
  {

    const lColor = 180;
    var grayColor=255;
     const contentWidth = (pageWidth+2) - leftMargin - rightMargin;
     let minHeightHeaderCol = 3;
    let minHeightBodyCell = 7;
    let fontSz = 9;
    //  let lastTableFinalY = posY;

    let startY = posY ; // Start table 20mm below the customer name
    var item = this.cleanItem[0];
    var cc = item.storing_order_tank?.storing_order?.customer_company;
    
    
     const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '50%' },
      1: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '10%' },
      2: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '10%' },
      3: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '30%' },
    };

    
    // Define headStyles with valid fontStyle
    const headStyles: Partial<Styles> = {
      fillColor: [grayColor, grayColor, grayColor], // Background color
      textColor: 0, // Text color (white)
      fontStyle: "bold", // Valid fontStyle value
      halign: 'center', // Centering header text
      valign: 'middle',
      lineColor: [lColor, lColor, lColor],
       lineWidth: 0.1
    };

    
    var data: any[][] = [
      [
        { content: `${this.translatedLangText.CUSTOMER}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.customer_company?.name}` },
       { content: `${this.translatedLangText.EIR_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDate(item?.storing_order_tank?.in_gate?.[0]?.eir_dt)}` }
      ],
      [
        { content: `${this.translatedLangText.TANK_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tank_no}` },
         { content: `${this.translatedLangText.COMPLETION_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDateTime(item?.complete_dt) || "-"}` }
      ],
      [
        { content: `${this.translatedLangText.CARGO_NAME}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tariff_cleaning?.cargo}`, colSpan: 3 },
      ]
     
    ];

     var offhireCodeHeight=49;
     var lastTableFinalY =posY;

      autoTable(pdf, {
          body: data,
          startY: startY,
          theme: 'plain',
          margin: { left: leftMargin },
          styles: {
            cellPadding: { left: 2, right: 2, top: 2, bottom: 2 },
            fontSize: fontSz,
            minCellHeight: minHeightHeaderCol,
            lineWidth: 0,
          },
          headStyles: headStyles,
          tableWidth: contentWidth,
          columnStyles: {
            0: { cellWidth: 35, lineWidth: 0 },
            1: { cellWidth: 61, lineWidth: 0 },
            2: { cellWidth: 35, lineWidth: 0 },
            3: { cellWidth: 61, lineWidth: 0 }
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            halign: 'left',
            valign: 'middle',
            lineWidth: 0
          },
          // Draw both top and bottom lines for each cell
          didDrawCell: function(data) {
            pdf.setDrawColor(lColor, lColor, lColor);
            pdf.setLineWidth(0.05);
             if ((data.column.index%2) === 0) {
               pdf.line(
                data.cell.x,
                data.cell.y,
                data.cell.x,
                data.cell.y + data.cell.height);
             }
            // Draw top line (for every cell in first column to avoid duplicates)
            
              pdf.line(
                data.cell.x,
                data.cell.y,
                data.cell.x + data.cell.width,
                data.cell.y
              );
            
            
            // Draw bottom line (for every cell in last column to avoid duplicates)
            
              pdf.line(
                data.cell.x,
                data.cell.y + data.cell.height,
                data.cell.x + data.cell.width,
                data.cell.y + data.cell.height
              );
            
          },
          
          didDrawPage: (data: any) => {
            const pageCount = pdf.getNumberOfPages();
            lastTableFinalY = data.cursor.y;
            
            // Manually draw outer border
            pdf.setDrawColor(lColor, lColor, lColor);
            pdf.setLineWidth(0.1);
            pdf.rect(leftMargin, startY, contentWidth, lastTableFinalY - startY);
          },
        });
  
     return lastTableFinalY;

  }

  async AddCustomerInfoTable(pdf: jsPDF, pageWidth: number, leftMargin: number, rightMargin: number,posY:number):Promise<number>
  {

    const lColor = 180;
    var grayColor=255;
     const contentWidth = (pageWidth+2) - leftMargin - rightMargin;
     let minHeightHeaderCol = 3;
    let minHeightBodyCell = 7;
    let fontSz = 9;
    //  let lastTableFinalY = posY;

    let startY = posY ; // Start table 20mm below the customer name
    var item = this.cleanItem[0];
    var cc = item.storing_order_tank?.storing_order?.customer_company;
    
    
     const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '50%' },
      1: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '10%' },
      2: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '10%' },
      3: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '30%' },
    };

    
    // Define headStyles with valid fontStyle
    const headStyles: Partial<Styles> = {
      fillColor: [grayColor, grayColor, grayColor], // Background color
      textColor: 0, // Text color (white)
      fontStyle: "bold", // Valid fontStyle value
      halign: 'center', // Centering header text
      valign: 'middle',
      lineColor: [lColor, lColor, lColor],
       lineWidth: 0.1
    };

    
    var data: any[][] = [
      [
        { content: `${this.translatedLangText.CUSTOMER}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.customer_company?.name}` },
        { content: `${this.translatedLangText.REFERENCE_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `-` }
      ],
      [
        { content: `${this.translatedLangText.TANK_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tank_no}` },
        { content: `${this.translatedLangText.EIR_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDate(item?.storing_order_tank?.in_gate?.[0]?.eir_dt)}` }
      ],
      [
        { content: `${this.translatedLangText.UN_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tariff_cleaning?.un_no}` },
        { content: `${this.translatedLangText.CARGO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tariff_cleaning?.cargo}` }
      ],
      [
        { content: `${this.translatedLangText.UNIT_TYPE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tank?.unit_type}` },
        { content: `${this.translatedLangText.CARGO_NATURE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tariff_cleaning?.nature_cv}` }
      ],
      [
        { content: ``, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `` },
        { content: `${this.translatedLangText.CARGO_CLASS}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tariff_cleaning?.class_cv}` }
      ],
    ];

     var offhireCodeHeight=49;
     var lastTableFinalY =posY;

      autoTable(pdf, {
          body: data,
          startY: startY,
          theme: 'plain',
          margin: { left: leftMargin },
          styles: {
            cellPadding: { left: 2, right: 2, top: 2, bottom: 2 },
            fontSize: fontSz,
            minCellHeight: minHeightHeaderCol,
            lineWidth: 0,
          },
          headStyles: headStyles,
          tableWidth: contentWidth,
          columnStyles: {
            0: { cellWidth: 35, lineWidth: 0 },
            1: { cellWidth: 61, lineWidth: 0 },
            2: { cellWidth: 35, lineWidth: 0 },
            3: { cellWidth: 61, lineWidth: 0 }
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            halign: 'left',
            valign: 'middle',
            lineWidth: 0
          },
          // Draw both top and bottom lines for each cell
          didDrawCell: function(data) {
            pdf.setDrawColor(lColor, lColor, lColor);
            pdf.setLineWidth(0.05);
             if ((data.column.index%2) === 0) {
               pdf.line(
                data.cell.x,
                data.cell.y,
                data.cell.x,
                data.cell.y + data.cell.height);
             }
            // Draw top line (for every cell in first column to avoid duplicates)
            
              pdf.line(
                data.cell.x,
                data.cell.y,
                data.cell.x + data.cell.width,
                data.cell.y
              );
            
            
            // Draw bottom line (for every cell in last column to avoid duplicates)
            
              pdf.line(
                data.cell.x,
                data.cell.y + data.cell.height,
                data.cell.x + data.cell.width,
                data.cell.y + data.cell.height
              );
            
          },
          
          didDrawPage: (data: any) => {
            const pageCount = pdf.getNumberOfPages();
            lastTableFinalY = data.cursor.y;
            
            // Manually draw outer border
            pdf.setDrawColor(lColor, lColor, lColor);
            pdf.setLineWidth(0.1);
            pdf.rect(leftMargin, startY, contentWidth, lastTableFinalY - startY);
          },
        });
  
     return lastTableFinalY;

  }

 AddCleanlinessComments(
  doc: jsPDF,
  blocks: cleanlinessReportTextBlock[],
  data: any = {},
  startY: number = 20
) {
  let currentY = startY;

  const marginX = 10;
  let currentX = marginX;

  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - marginX * 2;
  const lineHeight = 5.5;

  const getTextWidth = (text: string, fontSize: number) =>
    doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;

  blocks.forEach(block => {

    /* ---------- HORIZONTAL LINE ---------- */
    if (block.type === 'line') {
      currentY += block.marginTop || 0;

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(block.style?.lineWidth || 0.3);
      doc.line(marginX, currentY, pageWidth - marginX, currentY);

      currentY += lineHeight;
      currentX = marginX;
      return;
    }

    if (!block.text) return;

    /* ---------- TEXT RESOLUTION ---------- */
    const text =
      typeof block.text === 'function'
        ? block.text(data)
        : block.text;

    const font = block.style?.font || 'normal';
    const size = block.style?.size || 11;
    const align = block.style?.align || 'left';
     const underline = block.style?.underline || false;
    const fontFamily=  'helvetica';
    doc.setFont(fontFamily, font);
    doc.setFontSize(size);

   /* ---------- NEW PARAGRAPH ---------- */
    currentY += block.marginTop || 0;
    if (!block.inline) {
      // currentY += block.marginTop || 0;
      currentX = marginX;

      const lines = doc.splitTextToSize(text, usableWidth);
      if (align === 'center' || align === 'right') {
          // Calculate X for each line individually
          lines.forEach((line:any, index:number) => {
            const textWidth = doc.getStringUnitWidth(line) * size / doc.internal.scaleFactor;
            let lineX = marginX;
            if (align === 'center') lineX = marginX + (usableWidth - textWidth) / 2;
            if (align === 'right') lineX = marginX + (usableWidth - textWidth);

            // Draw the line
            doc.text(line, lineX, currentY + index * lineHeight);
          });
        } else {
          // Left align (default)
          doc.text(lines, currentX, currentY);
        }
      // this.drawTextAligned(doc,text, currentY, align, size,marginX,usableWidth,lineHeight);
      //  if(align === 'center')
      //   { 
      //      currentX= (usableWidth - doc.getStringUnitWidth(lines) * size / doc.internal.scaleFactor) / 2
      //   }
       
      //  doc.text(lines, currentX, currentY, { align });

      const textWidth =
      doc.getStringUnitWidth(text) * size / doc.internal.scaleFactor;

    if (underline) {
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth( 0.3);
      const y = currentY + 1; // slightly below text
      doc.line(currentX, y, currentX + textWidth, y);
    }

      currentY += lines.length * (lineHeight);
      return;
    }

    /* ---------- INLINE TEXT (NO WRAP) ---------- */
    // currentY += block.marginTop || 0;
    if(block.marginTop){
        currentX = marginX;
    }
    // this.drawTextAligned(doc,text, currentY, align, size,marginX,usableWidth,lineHeight);
     doc.text(text, currentX, currentY);

    const textWidth =
      doc.getStringUnitWidth(text) * size / doc.internal.scaleFactor;

    if (underline) {
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth( 0.3);
      const y = currentY + 2; // slightly below text
      doc.line(currentX, y, currentX + textWidth, y);
    }

    currentX += textWidth + 2;
  });

  return currentY;
}




   AddCleanlinessComments1(  doc: jsPDF,  blocks: cleanlinessReportTextBlock[],  data: any = {},  startY: number = 20) {
  let currentY = startY;

  const marginX = 10;
  let currentX = marginX;

  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - marginX * 2;
  const lineHeight = 5.5;
  const getTextWidth = (text: string, fontSize: number) =>
    doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;


  blocks.forEach(block => {

    /* ---------- HORIZONTAL LINE ---------- */
    if (block.type === 'line') {
      currentY += block.marginTop || 0;
       doc.setDrawColor(0, 0, 0); 
      doc.setLineWidth(block.style?.lineWidth || 0.3);
      doc.line(marginX, currentY, pageWidth - marginX, currentY);

       currentY += lineHeight;
      currentX = marginX;
      return;
    }

    if (!block.text) {
      return;
    }

    /* ---------- TEXT RESOLUTION ---------- */
    const text =
      typeof block.text === 'function'
        ? block.text(data)
        : block.text;

    const font = block.style?.font || 'normal';
    const size = block.style?.size || 11;
    const align = block.style?.align || 'left';

    doc.setFont('helvetica', font);
    doc.setFontSize(size);

    /* ---------- NEW PARAGRAPH ---------- */
    if (!block.inline) {
      currentY += block.marginTop || 0;
      currentX = marginX;

      const lines = doc.splitTextToSize(text, usableWidth);
      doc.text(lines, marginX, currentY, { align });

       currentY += lines.length * (lineHeight);
      return;
    }

   const words = text.split(' ');

    words.forEach((word, index) => {
      const token = index === 0 ? word : ' ' + word;
      const tokenWidth = getTextWidth(token, size);

      // auto wrap
      if (currentX + tokenWidth > marginX + usableWidth) {
        currentY += lineHeight;
        currentX = marginX;
      }

      doc.text(token, currentX, currentY);
      currentX += tokenWidth;
    });
  });

  return currentY;
}


formatDateToString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year} ${pad(hours)}:${minutes}:${seconds} ${ampm}`;
}

 drawTextAligned(doc: jsPDF, text: string | string[], y: number, align: 'left' | 'center' | 'right', 
  fontSize: number,marginX:number,usableWidth:number,lineHeight:number) {
   const lines = Array.isArray(text) ? text : [text];

  lines.forEach((line, index) => {
    const textWidth = doc.getStringUnitWidth(line) * fontSize / doc.internal.scaleFactor;
    let x = marginX;

    if (align === 'center') x = marginX + (usableWidth - textWidth) / 2;
    if (align === 'right') x = marginX + (usableWidth - textWidth);

    doc.text(line, x, y + index * lineHeight);
  });
}

addStyledTextArrayRTL(
  doc: jsPDF,
  items: {
    text: string;
    fontSize?: number;
    fontName?: string;
    fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
    textColor?: [number, number, number];
    underline?: boolean;
  }[],
  y: number,
  marginRight: number = 20
): number {

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentX = pageWidth - marginRight;

  // Loop in reverse (RTL)
  for (let i = items.length - 1; i >= 0; i--) {

    const item = items[i];

    const fontSize = item.fontSize ?? 12;
    const fontName = item.fontName ?? 'helvetica';
    const fontStyle = item.fontStyle ?? 'normal';
    const textColor = item.textColor ?? [0, 0, 0];
    const underline = item.underline ?? false;

    doc.setFont(fontName, fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(...textColor);

    const textWidth = doc.getTextWidth(item.text);

    // Move left
    currentX -= textWidth;

    // Draw text
    doc.text(item.text, currentX, y);

    // Underline if needed
    if (underline) {
      const underlineY = y + 2;
      doc.setLineWidth(0.5);
      doc.line(currentX, underlineY, currentX + textWidth, underlineY);
    }
  }

  return y + 8;
}



}