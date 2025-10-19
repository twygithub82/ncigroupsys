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
import { customerInfo, systemCurrencyCode } from 'environments/environment';
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
// import { fileSave } from 'browser-fs-access';

export interface DialogData {
  repair_guid: string;
  customer_company_guid: string;
  sotDS: StoringOrderTankDS;
  repairDS: RepairDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  repairEstimatePdf?: any;
  estimate_no?: string;
  retrieveFile: boolean;
}

@Component({
  selector: 'app-repair-estimate-pdf',
  templateUrl: './repair-estimate-pdf.component.html',
  styleUrls: ['./repair-estimate-pdf.component.scss'],
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
export class RepairEstimatePdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    
    
  }
  @Output() repairEstimateEvent = new EventEmitter<any>();

  type?: string | null;
  repairDS: RepairDS;
  repairPartDS: RepairPartDS;
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

  constructor(
    public dialogRef: MatDialogRef<RepairEstimatePdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) {
    super();
    this.translateLangText();
    this.repairDS = new RepairDS(this.apollo);
    this.repairPartDS = new RepairPartDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.repair_guid = data.repair_guid;
    this.customer_company_guid = data.customer_company_guid;
    this.repairEstimatePdf = data.repairEstimatePdf;
    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  async ngOnInit() {
    // Await the data fetching
    const [data, pdfData] = await Promise.all([
      this.getRepairData(),
      this.data.retrieveFile ? this.getRepairPdf() : Promise.resolve(null)
    ]);
    if (data?.length > 0) {
      this.repairItem = data[0];
      this.estimate_no = this.repairItem?.estimate_no;
      this.pdfTitle = this.repairItem?.storing_order_tank?.purpose_repair_cv === "REPAIR" ? this.translatedLangText.IN_SERVICE_ESTIMATE : this.translatedLangText.OFFHIRE_ESTIMATE;
      await this.getCodeValuesData();
      this.updateData(this.repairItem?.repair_part);
      this.last_test_desc = this.getLastTest(this.repairItem?.storing_order_tank?.in_gate?.[0]?.in_gate_survey);

      this.cdr.detectChanges();

      this.repairEstimatePdf = pdfData ?? this.repairEstimatePdf;
      console.log(this.repairEstimatePdf)
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

  getRepairData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.repairDS.getRepairByIDForPdf(this.repair_guid!, this.customer_company_guid!).subscribe({
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
    if (newData?.length) {
      newData = newData.map((row) => ({
        ...row,
        approve_qty: this.displayApproveQty(row),
        approve_hour: this.displayApproveHour(row),
        approve_cost: this.displayApproveCost(row),
        tariff_repair: {
          ...row.tariff_repair,
          sequence: this.getGroupSeq(row.tariff_repair?.group_name_cv)
        }
      }));


      console.log('Before sort', newData);
      newData = this.repairPartDS.sortAndGroupByGroupName(newData);
      console.log('After sort', newData);
      // newData = [...this.sortREP(newData)];

      this.repList = newData.map((row, index) => ({
        ...row,
        index: index
      }));
      console.log(this.repList);
      this.repairItem.repair_part = this.repList;
      this.calculateCost();
    } else {
      this.repList = [];
      this.calculateCost();
    }
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
   // this.repairCost = this.repairDS.calculateCost(this.repairItem, this.repairItem?.repair_part);
    this.repairCost = this.repairDS.calculateCostWithRoundUp(this.repairItem, this.repairItem?.repair_part);
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

    const reportTitle = '';

    // const headers = [[
    //   this.translatedLangText.NO,
    //   this.translatedLangText.TANK_NO, this.translatedLangText.CUSTOMER,
    //   this.translatedLangText.CLEAN_IN, this.translatedLangText.CLEAN_DATE,
    //   this.translatedLangText.DURATION_DAYS, this.translatedLangText.UN_NO,
    //   this.translatedLangText.PROCEDURE
    // ]];

    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '50%' },
      1: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '10%' },
      2: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '10%' },
      3: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: '30%' },
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

    // await Utility.addHeaderWithCompanyLogo_Portriat(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    // await Utility.addReportTitleToggleUnderline(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 37, false);

    // Variable to store the final Y position of the last table
    let lastTableFinalY = 0;

    let startY = lastTableFinalY + 8; // Start table 20mm below the customer name

    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0); // Black text
    // const cutoffDate = `${this.translatedLangText.TAKE_IN_DATE}: ${this.displayDate(this.eirDetails?.in_gate?.create_dt)}`; // Replace with your actual cutoff date
    //pdf.text(cutoffDate, pageWidth - rightMargin, lastTableFinalY + 10, { align: "right" });
    //PDFUtility.AddTextAtRightCornerPage(pdf, cutoffDate, pageWidth, leftMargin, rightMargin, lastTableFinalY + 5, 8);
    //PDFUtility.addText(pdf, this.translatedLangText.EQUIPMENT_INTERCHANGE_RECEIPT, lastTableFinalY + 5, leftMargin, 8);
    // const data: any[][] = [];

    var data: any[][] = [
      [
        { content: `${this.translatedLangText.TANK_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.repairItem?.storing_order_tank?.tank_no}` },
        { content: `${this.translatedLangText.ESTIMATE_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.estimate_no}` }
      ],
      [
        { content: `${this.translatedLangText.CUSTOMER}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.repairItem?.storing_order_tank?.storing_order?.customer_company?.name}` },
        { content: `${this.translatedLangText.EIR_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDate(this.repairItem?.storing_order_tank?.in_gate?.[0]?.eir_dt)}` }
      ],
      [
        { content: `${this.translatedLangText.LAST_CARGO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.repairItem?.storing_order_tank?.tariff_cleaning?.cargo}` },
        { content: `${this.translatedLangText.ESTIMATE_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDate(this.repairItem?.create_dt)}` }
      ],
      [
        { content: `${this.translatedLangText.MANUFACTURER}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.repairItem?.storing_order_tank?.in_gate?.[0]?.in_gate_survey?.manufacturer_cv}` },
        { content: `${this.translatedLangText.UNIT_TYPE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.repairItem?.storing_order_tank?.tank?.unit_type}` }
      ],
      [
        { content: `${this.translatedLangText.LAST_TEST}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.last_test_desc}` },
        { content: '' },
        { content: '' }
      ],
    ];

    autoTable(pdf, {
      body: data,
      startY: startY, // Start table at the current startY value
      theme: 'grid',
      margin: { left: leftMargin },
      styles: {
        cellPadding: { left: 1, right: 1, top: 1, bottom: 1 },
        fontSize: fontSz,
        minCellHeight: minHeightHeaderCol,
        lineWidth: 0.15, // cell border thickness
        lineColor: [0, 0, 0], // black
      },
      tableWidth: contentWidth,
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 61 },
        2: { cellWidth: 35 },
        3: { cellWidth: 61 }
      },
      // headStyles: headStyles, // Custom header styles
      bodyStyles: {
        fillColor: [255, 255, 255],
        halign: 'left', // Left-align content for body by default
        valign: 'middle', // Vertically align content

      },
      didDrawPage: (data: any) => {
        const pageCount = pdf.getNumberOfPages();

        lastTableFinalY = data.cursor.y;
        var pg = pagePositions.find(p => p.page == pageCount);
        if (!pg) {
          pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
          if (pageCount > 1) {
            Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin);
          }
        }
      },
    });

    startY = lastTableFinalY + 5;
    PDFUtility.addReportTitle(pdf, this.pdfTitle, pageWidth, leftMargin, rightMargin, startY, 8);
    startY += 4;
    this.createOffhireEstimate(pdf, startY, leftMargin, rightMargin, pageWidth);
    startY += 52;
    this.createRepairEstimateDetail(pdf, startY, leftMargin, rightMargin, pageWidth);
    this.createSummaryTable(pdf, leftMargin, rightMargin, pageWidth, pageHeight);
    this.downloadFile(pdf.output('blob'), this.getReportTitle())
    // this.generatedPDF = pdf.output('blob');
    // this.uploadPdf(this.repairItem?.guid, this.generatedPDF);
    // this.generatingPdfLoadingSubject.next(false);
    this.dialogRef.close();
  }

  createOffhireEstimate(pdf: jsPDF, startY: number, leftMargin: number, rightMargin: number, pageWidth: number) {

    var damageCodes: any = [];

    this.chunkedDamageCodeCvList.forEach((chunk: any) => {
      chunk.forEach((code: any) => {
        var content = `${code.code_val}: ${code.description}`;
        damageCodes.push(content);
      })
    })
    // Repair Codes

    var repairCodes: any = [];
    this.chunkedRepairCodeCvList.forEach((chunk: any) => {
      chunk.forEach((code: any) => {
        var content = `${code.code_val}: ${code.description}`;
        repairCodes.push(content);
      })
    })

    // Helper to convert list into 2-column rows
    var fontSz = 5.5;
    const toColumns = (list: string[]): string[][] => {
      const rows: any[][] = [];
      for (let i = 0; i < list.length; i += 3) {
        rows.push([
          { content: `${list[i] || ''}`, styles: { fontSize: fontSz } },
          { content: `${list[i + 1] || ''}`, styles: { fontSize: fontSz } },
          { content: `${list[i + 2] || ''}`, styles: { fontSize: fontSz } }
        ]);
      }
      return rows;
    };

    const vAlign = "bottom";
    const headers: RowInput[] = [
      [
        {
          content: this.translatedLangText.DAMAGE_CODE,
          colSpan: 3,
          styles: { fontSize: 9, halign: 'left', valign: vAlign, fillColor: [255, 255, 255], lineWidth: { bottom: 0, top: 0.1, left: 0.1, right: 0.1 }, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.REPAIR_CODE,
          colSpan: 3,
          styles: { fontSize: 9, halign: 'left', valign: vAlign, fillColor: [255, 255, 255], lineWidth: { bottom: 0, top: 0.1, left: 0.1, right: 0.1 }, cellPadding: 2 }
        }

      ]
    ];

    const cellHeight = 2;
    autoTable(pdf, {
      head: headers,
      body: toColumns(damageCodes).map((dRow, i) => {
        const rRow = toColumns(repairCodes)[i] || ['', '', ''];
        return [...dRow, ...rRow];
      }),
      startY: startY, // Start table at the current startY value
      styles: {
        cellPadding: { left: 2, right: 2, top: 1, bottom: 1 }, // Reduce padding
        fontSize: 7,
        lineWidth: 0 // remove all borders initially
      },
      theme: 'grid',
      margin: { left: leftMargin },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontStyle: 'bold',
        lineWidth: 0.1 // keep outer border for header
      },
      columnStyles: {
        0: { cellWidth: 32 },
        1: { cellWidth: 32 },
        2: { cellWidth: 32 },
        3: { cellWidth: 32 },
        4: { cellWidth: 32 },
        5: { cellWidth: 32 },
      },
      didDrawCell: function (data) {
        const doc = data.doc;
        const isLastRow = data.row.index === data.table.body.length - 1;

        if (data.column.index === 0 || data.column.index === 3) {
          // doc.setLineWidth(0.1);
          doc.line(data.cell.x, data.cell.y, data.cell.x, data.cell.y + data.cell.height); // left line

        }
        else if (data.column.index === 5) {
          // doc.setLineWidth(0.1);
          doc.line(data.cell.x + data.cell.width, data.cell.y, data.cell.x + data.cell.width, data.cell.y + data.cell.height); // right line
        }

        if (isLastRow) {
          doc.line(
            data.cell.x,
            data.cell.y + data.cell.height,
            data.cell.x + data.cell.width,
            data.cell.y + data.cell.height
          );
        }
      },
    });
  }

  createRepairEstimateDetail(pdf: jsPDF, startY: number, leftMargin: number, rightMargin: number, pageWidth: number) {
    const fontSz = 6;
    const vAlign = "bottom";
    const headers: RowInput[] = [
      [
        {
          content: this.translatedLangText.NO_DOT,
          rowSpan: 2,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.ITEM,
          rowSpan: 2,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.DAMAGE_CODE,
          rowSpan: 2,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.REPAIR_CODE,
          rowSpan: 2,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.DEPOT_ESTIMATE,
          colSpan: 3,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.CUSTOMER_APPROVAL,
          colSpan: 4,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        }

      ],
      [
        {
          content: this.translatedLangText.QTY,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.LABOUR,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.MATERIAL,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.QTY,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.LABOUR,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.MATERIAL,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.LESSEE_OWNER__ABB,
          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: 220, lineWidth: 0.1, cellPadding: 2 }
        }
      ]
    ];

    var repData: RowInput[] = [];
    const grpFontSz = 7;
    this.repList?.forEach((rep, index) => {

      if (rep.isGroupHeader) {
        repData.push([{ content: `${rep.group_name_cv}`, colSpan: 11, styles: { fillColor: 220, halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: grpFontSz } }]);
      }

      var isOwner = (rep.owner) ? "O" : "L";
      repData.push([
        rep.index + 1, this.displayDamageRepairCode(rep.rp_damage_repair, 0), this.displayDamageRepairCode(rep.rp_damage_repair, 1),
        rep.description, rep.quantity, rep.hour, this.parse2Decimal(rep.material_cost),
        rep.approve_qty, rep.approve_hour, this.parse2Decimal(rep.approve_cost), isOwner
      ])
    });

    autoTable(pdf, {
      head: headers,
      body: repData,
      startY: startY, // Start table at the current startY value
      styles: {
        cellPadding: { left: 2, right: 2, top: 1, bottom: 1 }, // Reduce padding
        fontSize: 7,
        lineWidth: 0.1 // remove all borders initially
      },
      theme: 'grid',
      margin: { left: leftMargin },
      headStyles: {
        fillColor: 220,
        textColor: 0,
        fontStyle: 'bold',
        lineWidth: 0.1 // keep outer border for header
      },
      columnStyles: {
        0: { cellWidth: 11, halign: 'center', valign: 'middle' },
        1: { cellWidth: 16, halign: 'center', valign: 'middle' },
        2: { cellWidth: 16, halign: 'center', valign: 'middle' },
        3: { cellWidth: 37, halign: 'left', valign: 'middle' },
        4: { cellWidth: 16, halign: 'center', valign: 'middle' },
        5: { cellWidth: 16, halign: 'center', valign: 'middle' },
        6: { cellWidth: 16, halign: 'center', valign: 'middle' },
        7: { cellWidth: 16, halign: 'center', valign: 'middle' },
        8: { cellWidth: 16, halign: 'center', valign: 'middle' },
        9: { cellWidth: 16, halign: 'center', valign: 'middle' },
        10: { cellWidth: 16, halign: 'center', valign: 'middle' },
      },
      didDrawPage: (data: any) => {
        startY = data.cursor.y;
      }
    });

    var remarks = `${this.translatedLangText.REMARKS}:`;
    var remarksValue = `${this.repairItem?.remarks}`;
    startY += 4;
    PDFUtility.addText(pdf, remarks, startY, leftMargin, fontSz, false, undefined, undefined, 0, true);
    startY += 6;
    PDFUtility.addText(pdf, remarksValue, startY, leftMargin, fontSz);
  }

  createSummaryTable(pdf: jsPDF, leftMargin: number, rightMargin: number, pageWidth: number, pageHeight: number) {
    var fontSz = 7;
    var vAlign = 'middle';
    var startY = pageHeight - 44;
    const data: RowInput[] = [
      [
        { content: `${this.translatedLangText.APPROVED_COST}`, colSpan: 1, rowSpan: 3, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: `${this.translatedLangText.ITEM}`, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: `${this.translatedLangText.RATE}`, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: `${this.translatedLangText.ESTIMATE_COST}`, colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: `${this.translatedLangText.APPROVED_COST}`, colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }
      ],
      [
        { content: `${this.translatedLangText.LABOUR}`, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: `$ ${this.parse2Decimal(this.repairItem?.labour_cost)}`, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: `${this.repairCost?.total_hour_table}`, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: `$ ${this.parse2Decimal(this.repairCost?.total_labour_cost)}`, styles: { halign: 'right', fontStyle: 'bold' } }
      ],
      [
        { content: `${this.translatedLangText.MATERIAL}`, styles: { halign: 'left', fontStyle: 'bold' } },
        '', '',
        { content: `$ ${this.parse2Decimal(this.repairCost?.total_mat_cost)}`, styles: { halign: 'right', fontStyle: 'bold' } }
      ],
      [
        { content: `${this.translatedLangText.FOR} ${this.repairItem?.storing_order_tank?.storing_order?.customer_company?.name}`, colSpan: 1, rowSpan: 3, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: `${this.translatedLangText.LABOUR_DISCOUNT}`, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: `${this.parse2Decimal(this.repairCost?.labour_cost_discount)} %`, styles: { halign: 'right', fontStyle: 'bold' } },
        '',
        { content: `- $ ${this.parse2Decimal(this.repairCost?.discount_labour_cost)}`, styles: { halign: 'right', fontStyle: 'bold' } }
      ],
      [
        { content: `${this.translatedLangText.MATERIAL_DISCOUNT} %`, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: `${this.parse2Decimal(this.repairCost?.material_cost_discount)} %`, styles: { halign: 'right', fontStyle: 'bold' } },
        '',
        { content: `- $ ${this.parse2Decimal(this.repairCost?.discount_mat_cost)}`, styles: { halign: 'right', fontStyle: 'bold' } }
      ],
      [
        { content: `${this.translatedLangText.NET_COST} $`, styles: { halign: 'left', fontStyle: 'bold' } },
        '', '',
        { content: `$ ${this.parse2Decimal(this.repairCost?.net_cost)}`, styles: { halign: 'right', fontStyle: 'bold' } }
      ]
    ];

    autoTable(pdf, {
      body: data,
      startY: startY,
      theme: 'grid',
      margin: { left: leftMargin },
      styles: {
        font: 'helvetica',
        fontSize: fontSz,
        lineWidth: 0.1,
        valign: 'middle',
        cellPadding: 1
      },
      columnStyles: {
        0: { cellWidth: 34 },
        1: { cellWidth: 30 },
        2: { cellWidth: 16 },
        3: { cellWidth: 28 },
        4: { cellWidth: 28 },
        5: { cellWidth: 28 },
        6: { cellWidth: 28 },
      }
    });

  }


  getReportTitle() {
    return this.translatedLangText.REPAIR_ESTIMATE;
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

    const reportTitle = '';

    

    let currentY = topMargin;
    let scale = this.scale;
    pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });


    // Variable to store the final Y position of the last table
    let lastTableFinalY = 0;

    let startY = lastTableFinalY + 8; // Start table 20mm below the customer name
    var item = this.repairItem;
    var cc = item.storing_order_tank?.storing_order?.customer_company;
    
     startY = await PDFUtility.addHeaderWithCompanyLogoWithTitleSubTitle_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin,
       this.translate, this.pdfTitle, '');
    startY+=(PDFUtility.GapBetweenSubTitleAndTable_Portrait()*2) - PDFUtility.GapBetweenLeftTitleAndTable();
    //  this.AddCustomerInfoTable(pdf, pageWidth, leftMargin, rightMargin,startY);
   
    var offhireCodeHeight=49;
    
    var totalCostTableHeight=45;
    var bufferY=67;
    startY = lastTableFinalY + bufferY+offhireCodeHeight;
    var bufferHeight=5;
    var repairDetailLastRowY=this.createRepairEstimateDetail_r1(pdf, startY, leftMargin, rightMargin, pageWidth,bottomMargin,pagePositions,bufferHeight);
    
    var TotalCostStartY=topMargin+bottomMargin+repairDetailLastRowY+offhireCodeHeight+totalCostTableHeight;

    var buffer=0;
    if((TotalCostStartY+buffer)>=pageHeight)
    {
      
       const pageCount = pdf.getNumberOfPages();

       pagePositions.push({ page: pageCount, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });
    }

  await this.addFooterCompanyLogo_Portrait(pdf,pageWidth,pageHeight, topMargin, bottomMargin, leftMargin, rightMargin, this.translate,pagePositions,offhireCodeHeight);


    this.downloadFile(pdf.output('blob'), this.getReportTitle())
    this.dialogRef.close();
  }



  async AddCustomerInfoTable(pdf: jsPDF, pageWidth: number, leftMargin: number, rightMargin: number,posY:number)
  {

    var grayColor=255;
     const contentWidth = pageWidth - leftMargin - rightMargin;
     let minHeightHeaderCol = 3;
    let minHeightBodyCell = 7;
    let fontSz = 8.5;
    //  let lastTableFinalY = posY;

    let startY = posY ; // Start table 20mm below the customer name
    var item = this.repairItem;
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
      lineColor: [255, 255, 255],
       lineWidth: 0.1
    };

    
    var data: any[][] = [
      [
        { content: `${this.translatedLangText.TANK_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tank_no}` },
        { content: `${this.translatedLangText.ESTIMATE_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.estimate_no}` }
      ],
      [
        { content: `${this.translatedLangText.CUSTOMER}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.storing_order?.customer_company?.name}` },
        { content: `${this.translatedLangText.EIR_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDate(item?.storing_order_tank?.in_gate?.[0]?.eir_dt)}` }
      ],
      [
        { content: `${this.translatedLangText.LAST_CARGO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tariff_cleaning?.cargo}` },
        { content: `${this.translatedLangText.ESTIMATE_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDate(item?.create_dt)}` }
      ],
      [
        { content: `${this.translatedLangText.MANUFACTURER}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.in_gate?.[0]?.in_gate_survey?.manufacturer_cv}` },
        { content: `${this.translatedLangText.UNIT_TYPE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tank?.unit_type}` }
      ],
      [
        { content: `${this.translatedLangText.LAST_TEST}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.last_test_desc}` },
        { content: `${this.translatedLangText.QUOTATION_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDate(Utility.getTodayDateInEpoch())}` }
      ],
    ];

     var offhireCodeHeight=49;
     var lastTableFinalY =posY;
      
    

    autoTable(pdf, {
      body: data,
       startY: startY, // Start table at the current startY value
      theme: 'grid',
      margin: { left: leftMargin},
      styles: {
        cellPadding: { left: 1, right: 1, top: 1, bottom: 1 },
        fontSize: fontSz,
        minCellHeight: minHeightHeaderCol,
        lineWidth:0.1,
        lineColor: [0, 0, 0], // black
      },
       headStyles: headStyles,
      tableWidth: contentWidth,
      columnStyles: {
        0: { cellWidth: 35,lineWidth: 0.1 },
        1: { cellWidth: 61,lineWidth: 0.1 },
        2: { cellWidth: 35,lineWidth: 0.1 },
        3: { cellWidth: 61,lineWidth: 0.1 }
      },
      // headStyles: headStyles, // Custom header styles
      bodyStyles: {
        fillColor: [255, 255, 255],
        halign: 'left', // Left-align content for body by default
        valign: 'middle', // Vertically align content
        lineWidth:0.1,
      },
      didDrawPage: (data: any) => {
      
        const pageCount = pdf.getNumberOfPages();
        lastTableFinalY = data.cursor.y;

      },
    });

  
     return lastTableFinalY;

  }

  async addFooterCompanyLogo_Portrait(pdf: jsPDF, pageWidth: number, pageHeight:number, topMargin: number, bottomMargin: number,
      leftMargin: number, rightMargin: number, translateService: TranslateService, pagePositions: { page: number, x: number, y: number }[], offhirecoreheight:number=50) {
      var fontSize = 8
      var totalPages = pdf.getNumberOfPages();
       var offhireCodeHeight=offhirecoreheight;
       var totalCostTableHeight=54;
       var  dmgCodeRprCodePosBuffer=72;
       var  dmgCodeRprCodePosY = dmgCodeRprCodePosBuffer ;
      //  pdf.setDrawColor(0, 0, 0); // black line color
      //   pdf.setLineWidth(0.1);
      //   pdf.setLineDashPattern([0.01, 0.01], 0.1);
      //   pdf.setFontSize(fontSize);

      for (const { page, x, y } of pagePositions) {
       
        pdf.setPage(page);
  
        const lineBuffer = 6;
        const repDisclaimerPosBuffer=8;
        const fontSize=6.5;
        // pdf.text(`Page ${page} of ${totalPages}`, pdf.internal.pageSize.width - 14, pdf.internal.pageSize.height - 8, { align: 'right' });
       
        var repDisclaimerPosY =  pdf.internal.pageSize.height - repDisclaimerPosBuffer;
        var maxW = pageWidth+1 -rightMargin-leftMargin;
        var note =  PDFUtility.FormatColon(this.translatedLangText.NOTE, '');
        var bufferFontSize =1.25;
        PDFUtility.addText(pdf, `${note}`, repDisclaimerPosY, leftMargin, fontSize*bufferFontSize, true,undefined,undefined,maxW);
        PDFUtility.addText(pdf, this.translatedLangText.REPAIR_DISCLAIMER, repDisclaimerPosY, leftMargin + 8, fontSize*bufferFontSize, false,undefined,undefined,maxW);
      
        var lineY=pageHeight-bottomMargin-lineBuffer;
        pdf.line(leftMargin, lineY, pageWidth+2 - rightMargin, lineY);

         // Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 45);
             var posY= PDFUtility.addReportTitle_Portrait(pdf, this.pdfTitle, pageWidth, leftMargin, rightMargin);
            
             posY+=(PDFUtility.GapBetweenSubTitleAndTable_Portrait()*2) - PDFUtility.GapBetweenLeftTitleAndTable();
             posY= await this.AddCustomerInfoTable(pdf, pageWidth,leftMargin,rightMargin,posY);
             var dmgCodeRprCodePosY=posY+2;
             this.createOffhireEstimate_r1(pdf, dmgCodeRprCodePosY, leftMargin, rightMargin, pageWidth);
        if (page==1)
        {
             pdf.setDrawColor(0, 0, 0); // black line color
             pdf.setLineWidth(0.1);
             lineY=dmgCodeRprCodePosY+offhireCodeHeight-(lineBuffer*2);
             pdf.line(leftMargin, lineY, pageWidth+2 - rightMargin, lineY);
        }
        else if (page > 1) {
          // await Utility.addHeaderWithCompanyLogo_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, translateService);
           await PDFUtility.addHeaderWithCompanyLogoWithTitleSubTitle_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin,
           this.translate, this.pdfTitle, '');

        }
         if(page==totalPages)
          {
           
          if(this.repairItem.owner_enable)
          {
           var buffer=3;
           var totalTableStartY=pageHeight-(totalCostTableHeight+buffer+bottomMargin);
            this.createRepairEstimateTotalTable_r6(pdf, totalTableStartY, leftMargin, rightMargin, pageWidth);
          }
          else
          {
            var buffer=-1;
            var totalTableStartY=pageHeight-(totalCostTableHeight+buffer+bottomMargin);
            this.createRepairEstimateTotalTable_r5(pdf, totalTableStartY, leftMargin, rightMargin, pageWidth);
          }
           this.addSurveyorInfoTable(pdf, pageWidth, pageHeight, leftMargin, rightMargin,topMargin,bottomMargin);
        }
      }// Add Second Page, Add For Loop
    }

  createOffhireEstimate_r1(pdf: jsPDF, startY: number, leftMargin: number, rightMargin: number, pageWidth: number) {

    var damageCodes: any = [];

    pdf.setLineWidth(0);
    this.chunkedDamageCodeCvList.forEach((chunk: any) => {
      chunk.forEach((code: any) => {
        var content = `${code.code_val}: ${code.description}`;
        damageCodes.push(content);
      })
    })
    // Repair Codes

    var repairCodes: any = [];
    this.chunkedRepairCodeCvList.forEach((chunk: any) => {
      chunk.forEach((code: any) => {
        var content = `${code.code_val}: ${code.description}`;
        repairCodes.push(content);
      })
    })

    // Helper to convert list into 2-column rows
    var fontSz = 5.5;
    const toColumns = (list: string[]): string[][] => {
      const rows: any[][] = [];
      for (let i = 0; i < list.length; i += 3) {
        rows.push([
          { content: `${list[i] || ''}`, styles: { fontSize: fontSz } },
          { content: `${list[i + 1] || ''}`, styles: { fontSize: fontSz } },
          { content: `${list[i + 2] || ''}`, styles: { fontSize: fontSz } }
        ]);
      }
      return rows;
    };

    const vAlign = "bottom";
    const headers: RowInput[] = [
      [
        {
          content: this.translatedLangText.DAMAGE_CODE,
          colSpan: 3,
          styles: { fontSize: 9, halign: 'left', valign: vAlign, fillColor: [255, 255, 255], lineWidth: { bottom: 0, top: 0.1, left: 0.1, right: 0.1 }, cellPadding: 1}
        },
        {
          content: this.translatedLangText.REPAIR_CODE,
          colSpan: 3,
          styles: { fontSize: 9, halign: 'left', valign: vAlign, fillColor: [255, 255, 255], lineWidth: { bottom: 0, top: 0.1, left: 0.1, right: 0.1 }, cellPadding: 1 }
        }

      ]
    ];

       const headers1: RowInput[] = [
      [
        {
          content: this.translatedLangText.DAMAGE_CODE,
          colSpan: 3,
          styles: { fontSize: 9, halign: 'left', valign: vAlign, fillColor: [255, 255, 255], lineWidth: 0, cellPadding: 1}
        },
        {
          content: this.translatedLangText.REPAIR_CODE,
          colSpan: 3,
          styles: { fontSize: 9, halign: 'left', valign: vAlign, fillColor: [255, 255, 255], lineWidth: 0, cellPadding: 1 }
        }

      ]
    ];

    
    const gapTopBottom=0.3;
    const cellHeight = 2;
    autoTable(pdf, {
      head: headers,
      body: toColumns(damageCodes).map((dRow, i) => {
        const rRow = toColumns(repairCodes)[i] || ['', '', ''];
        return [...dRow, ...rRow];
      }),
       startY: startY, // Start table at the current startY value
      styles: {
        cellPadding: { left: 2, right: 2, top: gapTopBottom, bottom: gapTopBottom }, // Reduce padding
        fontSize: 6,
        lineWidth: 0 // remove all borders initially
        
      },
      theme: 'plain',
       margin: { left: leftMargin},
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: 0,
        fontStyle: 'normal',
         lineWidth: 0 // keep outer border for header
      },
      columnStyles: {
        0: { cellWidth: 32,lineWidth: 0 },
        1: { cellWidth: 32 ,lineWidth: 0},
        2: { cellWidth: 32 ,lineWidth: 0},
        3: { cellWidth: 32 ,lineWidth: 0},
        4: { cellWidth: 32 ,lineWidth: 0},
        5: { cellWidth: 32 ,lineWidth: 0},
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        
        lineWidth:0,
      },
      didDrawCell: function (data) {
        const lineWidth = 0;
        const doc = data.doc;
        const isLastRow = data.row.index === data.table.body.length - 1;

        if (data.column.index === 0 || data.column.index === 3) {
          doc.setLineWidth(lineWidth);
          doc.line(data.cell.x, data.cell.y, data.cell.x, data.cell.y + data.cell.height); // left line

        }
        else if (data.column.index === 5) {
          doc.setLineWidth(lineWidth);
          doc.line(data.cell.x + data.cell.width, data.cell.y, data.cell.x + data.cell.width, data.cell.y + data.cell.height); // right line
        }

        if (isLastRow) {
           doc.setLineWidth(lineWidth);
          doc.line(
            data.cell.x,
            data.cell.y + data.cell.height,
            data.cell.x + data.cell.width,
            data.cell.y + data.cell.height
          );
        }
      },
    });
  }



  createRepairEstimateDetail_r1(pdf: jsPDF, startY: number, leftMargin: number, rightMargin: number, pageWidth: number,
    bottomMargin: number, pagePositions: { page: number, x: number, y: number }[],bufferHeight:number):number {
    const fontSz = 6;
    const vAlign = "bottom";
    const backgroundColor_header = 250
    const lineWidth = 0.0;
    const lineColor = 250;
    const bufferY = 5;
    const headers: RowInput[] = [
      [
        {
          content: this.translatedLangText.NO_DOT,
          rowSpan: 2,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        },
        {
          content: this.translatedLangText.ITEM,
          rowSpan: 2,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        },
        {
          content: this.translatedLangText.DAMAGE_CODE,
          rowSpan: 2,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        },
        {
          content: this.translatedLangText.REPAIR_CODE,
          rowSpan: 2,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        },
        {
          content: this.translatedLangText.DEPOT_ESTIMATE,
          colSpan: 3,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        },
        {
          content: this.translatedLangText.CUSTOMER_APPROVAL,
          colSpan: 4,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        }

      ],
      [
        {
          content: this.translatedLangText.QTY,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        },
        {
          content: this.translatedLangText.LABOUR,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        },
        {
          content: this.translatedLangText.MATERIAL,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        },
        {
          content: this.translatedLangText.QTY,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        },
        {
          content: this.translatedLangText.LABOUR,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        },
        {
          content: this.translatedLangText.MATERIAL,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        },
        {
          content: this.translatedLangText.LESSEE_OWNER__ABB,
          styles: {
            fontSize: fontSz, halign: 'center', valign: vAlign, fillColor: backgroundColor_header,
            lineColor: lineColor, lineWidth: lineWidth, cellPadding: 2
          }
        }
      ]
    ];

    var LastLabelPosY=0;
    var repData: RowInput[] = [];
    const grpFontSz = 7;
    this.repList?.forEach((rep, index) => {

      if (rep.isGroupHeader) {
        repData.push([{
          content: `${rep.group_name_cv}`, colSpan: 11,
          styles: { fillColor: backgroundColor_header, halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: grpFontSz }
        }]);
      }

      var isOwner = (rep.owner) ? "O" : "L";
      repData.push([
        rep.index + 1, this.displayDamageRepairCode(rep.rp_damage_repair, 0), this.displayDamageRepairCode(rep.rp_damage_repair, 1),
        rep.description, rep.quantity, rep.hour, this.parse2Decimal(rep.material_cost),
        rep.approve_qty, rep.approve_hour, this.parse2Decimal(rep.approve_cost), isOwner
      ])
    });

    autoTable(pdf, {
      head: headers,
      body: repData,
      startY: startY, // Start table at the current startY value
      styles: {
        cellPadding: { left: 2, right: 2, top: 1, bottom: 1 }, // Reduce padding
        fontSize: 7,
        lineWidth: lineWidth // remove all borders initially
      },
      theme: 'grid',
      margin: { left: leftMargin, top: startY,bottom:bottomMargin+bufferHeight, right: rightMargin  },
      headStyles: {
        fillColor: lineColor,
        textColor: 0,
        fontStyle: 'bold',
        lineWidth: 0.05 // keep outer border for header
      },
      columnStyles: {
        0: { cellWidth: 11, halign: 'center', valign: 'middle' },
        1: { cellWidth: 16, halign: 'center', valign: 'middle' },
        2: { cellWidth: 16, halign: 'center', valign: 'middle' },
        3: { cellWidth: 37, halign: 'left', valign: 'middle' },
        4: { cellWidth: 16, halign: 'center', valign: 'middle' },
        5: { cellWidth: 16, halign: 'center', valign: 'middle' },
        6: { cellWidth: 16, halign: 'center', valign: 'middle' },
        7: { cellWidth: 16, halign: 'center', valign: 'middle' },
        8: { cellWidth: 16, halign: 'center', valign: 'middle' },
        9: { cellWidth: 16, halign: 'center', valign: 'middle' },
        10: { cellWidth: 16, halign: 'center', valign: 'middle' },
      },
      didDrawCell: function (data) {
        const doc = data.doc;

        const isLastRow = (data.row.index === data.table.body.length - 1);
        // if (data.row.index === 0 && data.column.index === 0 && data.section === "head") {
        //   doc.setLineWidth(0.3);
        //   doc.setDrawColor(0, 0, 0); // Set line color to black
        //   doc.line(
        //     data.cell.x,
        //     data.cell.y - bufferY,
        //     pageWidth + 1 - rightMargin,
        //     data.cell.y - bufferY
        //   );
        // }
        // else 
        if (isLastRow && data.section === "body" && data.column.index === 0) {
          
              doc.setLineWidth(0.1);
              doc.setDrawColor(0, 0, 0);
              doc.line(
                data.cell.x,
                data.cell.y + data.cell.height + bufferY,
                pageWidth + 1 - rightMargin,
                data.cell.y + data.cell.height + bufferY
              );
           
        }
      },
      didDrawPage: (data: any) => {
        
        // startY = data.cursor.y;
         const pageCount = pdf.getNumberOfPages();

          
           
          
         LastLabelPosY = data.cursor.y;
        var pg = pagePositions.find(p => p.page == pageCount);
        if (!pg) {
          pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
          // if (pageCount == 1)
            
        }
      }
    });

    //  pdf.setLineWidth(0.1);
    var remarks = `${this.translatedLangText.REMARKS}:`;
    var remarksValue = `${this.repairItem?.remarks}`;
    LastLabelPosY += 6 + bufferY;
    PDFUtility.addText(pdf, remarks, LastLabelPosY, leftMargin, fontSz, false, undefined, undefined, 0, true);
    LastLabelPosY += 5;
    PDFUtility.addText(pdf, remarksValue, LastLabelPosY, leftMargin, fontSz);
   
    return LastLabelPosY;
  }

   createRepairEstimateTotalTable_r1(pdf: jsPDF, startY: number, leftMargin: number, rightMargin: number, pageWidth: number) 
    {

      const grayColor=250;
      const minHeightBodyCell = 5;
        const vAlign = "bottom";
        const headers:RowInput[] = [[
     { content: this.translatedLangText.DESCRIPTION,  styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.RATE,  styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.LABOUR,  styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.TOTAL,  styles: { halign: 'center', valign: vAlign } }
    ]];

    

    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: 'middle', cellWidth: 38, minCellHeight: minHeightBodyCell },
      1: { halign: 'center', valign: 'middle', cellWidth: 23, minCellHeight: minHeightBodyCell },
      2: { halign: 'center', valign: 'middle', cellWidth: 23, minCellHeight: minHeightBodyCell },
      3: { halign: 'center', valign: 'middle', cellWidth: 23, minCellHeight: minHeightBodyCell },
      
    };
    
     var totalCellWidth = Object.values(comStyles)
  .reduce((sum, col: any) => sum + (col.cellWidth || 0), 0);

    const rows: any[][] = [];
    const fontStyle='normal';
    const fontSz = 7;
    rows.push([
      { content: this.translatedLangText.LABOUR, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: this.getLabourCost(), styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getTotalLabourHour(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalLabourCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
    rows.push([
      { content: this.translatedLangText.MATERIAL_COST$, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalMaterialCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
    rows.push([
      { content: this.translatedLangText.TOTAL_COST, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
     rows.push([
      { content: `${this.translatedLangText.LABOUR_DISCOUNT} (${this.translatedLangText.PERCENTAGE_SYMBOL})`, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: this.getLabourDiscount(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle:fontStyle } },
      { content: this.getLabourDiscountCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
     rows.push([
      { content: `${this.translatedLangText.MATERIAL_DISCOUNT} (${this.translatedLangText.PERCENTAGE_SYMBOL})`, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: this.getMaterialDiscount(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getMaterialDiscountCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
     rows.push([
      { content: `${this.translatedLangText.NET_COST}(${systemCurrencyCode})`, styles: { halign: 'right', fontStyle: fontStyle,fontSize:(fontSz+1) } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getNetCost(), styles: { halign: 'center', fontStyle: fontStyle,fontSize:(fontSz+1) } }
    ]);

     if(this.repairItem.storing_order_tank?.customer_company?.currency?.currency_code != systemCurrencyCode){
      var netCost = Number(this.getNetCost().replace(",",""));
      var rate = this.repairItem.storing_order_tank?.customer_company?.currency?.rate || 1;
      var foreignNetCost = netCost * rate;
      rows.push([
        { content: `${this.translatedLangText.NET_COST}(${this.repairItem.storing_order_tank?.customer_company?.currency?.currency_code})`, styles: { halign: 'right', fontStyle: fontStyle,fontSize:(fontSz+1) } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(foreignNetCost)), styles: { halign: 'center', fontStyle: fontStyle,fontSize:(fontSz+1) } }
      ]);
      startY-=3;
    }

    var buffer=pageWidth-rightMargin-Number(totalCellWidth||0)+2;
    autoTable(pdf, {
        head: headers,
        body: rows,
        startY: startY,
        styles: {
          cellPadding: { left: 2, right: 2, top: 1, bottom: 1 },
          fontSize: fontSz,
        },
        theme: 'plain',
        margin: { left: leftMargin},
        headStyles: {
           fillColor: [grayColor, grayColor, grayColor],
          textColor: 0,
          fontStyle: 'bold',
        },
        columnStyles: comStyles,
        didDrawCell: function (data) {
          const { cell, doc } = data;
          if (!cell) return;

          const startX = cell.x;
          const endX = cell.x + cell.width;
          const yTop = cell.y;
          const yBottom = cell.y + cell.height;

        //  doc.setDrawColor(0);   // black
        //  doc.setLineWidth(0.1); // thickness

         

          // Draw bottom border for the last row
           if (data.section === 'body') {
            const lastRowIndex = data.table.body.length - 1;
            // Only draw bottom border for the last row
            if (data.row.index === lastRowIndex) {
              // doc.line(startX, yBottom, endX, yBottom);
            }
          }

          // Always draw top border for header
          if (data.section === 'head') {
            doc.line(startX, yBottom, endX, yBottom);
          //  doc.line(startX, yTop, endX, yTop);
          }
        },
      });
     var tableEndY = (pdf as any).lastAutoTable.finalY || startY;
      tableEndY-=1;
      const surveyorInfo =  PDFUtility.FormatColon(this.translatedLangText.PREPARED_BY, this.getSurveyorName());
      PDFUtility.addText(pdf,surveyorInfo,tableEndY,leftMargin,9,false);
    }

  createRepairEstimateTotalTable_r2(pdf: jsPDF, startY: number, leftMargin: number, rightMargin: number, pageWidth: number) 
    {

      const minHeightBodyCell = 6;
      const vAlign = "bottom";
      const grayColor=245;
     
      const headers: RowInput[] = [[
      { content: this.translatedLangText.DESCRIPTION,  styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.RATE,  styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.OWNER, colSpan: 2, styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.LESSEE, colSpan: 2, styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.LABOUR,  styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.TOTAL,  styles: { halign: 'center', valign: vAlign } }
    ]];

    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: 'middle', cellWidth: 35, minCellHeight: minHeightBodyCell },
      1: { halign: 'center', valign: 'middle', cellWidth: 17, minCellHeight: minHeightBodyCell },
      2: { halign: 'center', valign: 'middle', cellWidth: 17, minCellHeight: minHeightBodyCell },
      3: { halign: 'center', valign: 'middle', cellWidth: 17, minCellHeight: minHeightBodyCell },
      4: { halign: 'center', valign: 'middle', cellWidth: 17, minCellHeight: minHeightBodyCell },
      5: { halign: 'center', valign: 'middle', cellWidth: 17, minCellHeight: minHeightBodyCell },
      6: { halign: 'center', valign: 'middle', cellWidth: 17, minCellHeight: minHeightBodyCell },
      7: { halign: 'center', valign: 'middle', cellWidth: 17, minCellHeight: minHeightBodyCell },
      
    };

    var totalCellWidth = Object.values(comStyles)
  .reduce((sum, col: any) => sum + (col.cellWidth || 0), 0);
   
    const rows: any[][] = [];
     const fontStyle='normal';
    rows.push([
      { content: this.translatedLangText.LABOUR, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: this.getLabourCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getOwnerLabourHour(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getOwnerLabourCost(), styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getLesseeLabourHour(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeLabourCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalLabourHour(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalLabourCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
    rows.push([
      { content: this.translatedLangText.MATERIAL_COST$, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getOwnerTotalMaterialCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeTotalMaterialCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalMaterialCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
    rows.push([
      { content: this.translatedLangText.TOTAL_COST, styles: { halign: 'right', fontStyle: fontStyle } },
     { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getOwnerTotalCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeTotalCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
     rows.push([
      { content: `${this.translatedLangText.LABOUR_DISCOUNT} (${this.translatedLangText.PERCENTAGE_SYMBOL})`, styles: { halign: 'right', fontStyle: fontStyle } },
     { content: this.getLabourDiscount(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getOwnerLabourDiscountCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeLabourDiscountCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLabourDiscountCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
     rows.push([
      { content: `${this.translatedLangText.MATERIAL_DISCOUNT} (${this.translatedLangText.PERCENTAGE_SYMBOL})`, styles: { halign: 'right', fontStyle: fontStyle } },
     { content: this.getMaterialDiscount(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getOwnerMaterialDiscountCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeMaterialDiscountCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getMaterialDiscountCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
     rows.push([
      { content: `${this.translatedLangText.NET_COST}(${systemCurrencyCode})`, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getOwnerNetCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeNetCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getNetCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);

    if(this.repairItem.storing_order_tank?.customer_company?.currency?.currency_code != systemCurrencyCode){
      var netCost = Number(this.getNetCost().replace(",",""));
      var ownerNetCost = Number(this.getOwnerNetCost().replace(",",""));
      var lesseeNetCost = Number(this.getLesseeNetCost().replace(",",""));
      var rate = this.repairItem.storing_order_tank?.customer_company?.currency?.rate || 1;
      var foreignNetCost = netCost * rate;
      var foreignOwnerNetCost = ownerNetCost * rate;
      var foreignLesseeNetCost = lesseeNetCost * rate;
      rows.push([
        { content: `${this.translatedLangText.NET_COST}(${this.repairItem.storing_order_tank?.customer_company?.currency?.currency_code})`, styles: { halign: 'right', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
         { content: Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(foreignOwnerNetCost)), styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content:Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(foreignLesseeNetCost)), styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(foreignNetCost)), styles: { halign: 'center', fontStyle: fontStyle } }
      ]);
      startY-=3;
    }

    var buffer=pageWidth-rightMargin-Number(totalCellWidth||0)+2;
    autoTable(pdf, {
        head: headers,
        body: rows,
        startY: startY,
        styles: {
          cellPadding: { left: 2, right: 2, top: 1, bottom: 1 },
          fontSize: 7,
        },
        theme: 'plain',
        margin: { left: buffer},
        headStyles: {
           fillColor: [grayColor, grayColor, grayColor],
          textColor: 0,
          fontStyle: 'bold',
        },
        columnStyles: comStyles,
        didDrawCell: function (data) {
          const { cell, doc } = data;
          if (!cell) return;

          const startX = cell.x;
          const endX = cell.x + cell.width;
          const yTop = cell.y;
          const yBottom = cell.y + cell.height;

          // doc.setDrawColor(0);   // black
          // doc.setLineWidth(0.2); // thin line

          // ===== HEADER SECTION =====
          if (data.section === 'head') {
            // Draw top and bottom borders for the header
            // doc.line(startX, yTop, endX, yTop);       // Top line
            doc.line(startX, yBottom, endX, yBottom); // Bottom line
          }

          // ===== BODY SECTION =====
          if (data.section === 'body') {
            const lastRowIndex = data.table.body.length - 1;
            // Only draw bottom border for the last row
            if (data.row.index === lastRowIndex) {
              // doc.line(startX, yBottom, endX, yBottom);
            }
          }
        },
      });
      var tableEndY = (pdf as any).lastAutoTable.finalY || startY;
      tableEndY-=1;
      const surveyorInfo =  PDFUtility.FormatColon(this.translatedLangText.PREPARED_BY, this.getSurveyorName());
     PDFUtility.addText(pdf,surveyorInfo,tableEndY,leftMargin,9,false);
    }

    createRepairEstimateTotalTable_r3(pdf: jsPDF, startY: number, leftMargin: number, rightMargin: number, pageWidth: number) 
    {

      const grayColor=255;
      const minHeightBodyCell = 5;
        const vAlign = "bottom";
         const headers: RowInput[] = [
      [
      
        {
          content: this.translatedLangText.APPROVED_COST,
           rowSpan:3,
          // colSpan:5,
          styles: { halign: 'left', valign: 'top' }
        },
        {
          content: this.translatedLangText.ITEM,
          // colSpan:2,
          styles: { halign: 'center', valign: vAlign }
        },
        {
          content: this.translatedLangText.RATE, // Changed from duplicate MAINTENANCE_DETAILS
          styles: { halign: 'center', valign: vAlign }
        },
        {
          content: '', // Changed from duplicate MAINTENANCE_DETAILS
          // colSpan:5,
          styles: { halign: 'center', valign: vAlign }
        },
        {
          content: this.translatedLangText.ESTIMATE_COST, // Changed from duplicate MAINTENANCE_DETAILS
          colSpan:2,
          styles: { halign: 'center', valign: vAlign }
        },
        {
          content: this.translatedLangText.APPROVED_COST, // Changed from duplicate MAINTENANCE_DETAILS
          colSpan:2,
          styles: { halign: 'center', valign: vAlign }
        },
      ],
      
    ];


    var cellWPerUnit = (pageWidth-leftMargin-rightMargin)/19;
    

    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: 'middle',  cellWidth: (cellWPerUnit*5), minCellHeight: minHeightBodyCell },
      1: { halign: 'center', valign: 'middle', cellWidth: (cellWPerUnit*2)+2, minCellHeight: minHeightBodyCell },
      2: { halign: 'center', valign: 'middle', cellWidth:(cellWPerUnit*2), minCellHeight: minHeightBodyCell },
      3: { halign: 'center', valign: 'middle', cellWidth: (cellWPerUnit*4), minCellHeight: minHeightBodyCell },
      4: { halign: 'center', valign: 'middle',  cellWidth: (cellWPerUnit), minCellHeight: minHeightBodyCell },
      5: { halign: 'center', valign: 'middle',  cellWidth: (cellWPerUnit*2),  minCellHeight: minHeightBodyCell },
      6: { halign: 'center', valign: 'middle',  cellWidth: (cellWPerUnit), minCellHeight: minHeightBodyCell },
      7: { halign: 'center', valign: 'middle',   cellWidth: (cellWPerUnit*2),minCellHeight: minHeightBodyCell },
    };
    
     var totalCellWidth = Object.values(comStyles)
  .reduce((sum, col: any) => sum + (col.cellWidth || 0), 0);

    const rows: any[][] = [];
    const fontStyle='normal';
    const fontSz = 6.8;
    rows.push([
      { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.translatedLangText.LABOUR, styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLabourRate(), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalLabourHour(false), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalLabourCost(false), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalLabourHour(true), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalLabourCost(true), styles: {  halign: 'center', fontStyle: fontStyle } },
      
    ]);

    rows.push([
      { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.translatedLangText.MATERIAL, styles: { halign: 'center', fontStyle: fontStyle } },
      { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalMaterialCost(false), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalMaterialCost(true), styles: {  halign: 'center', fontStyle: fontStyle } },
      
    ]);

    rows.push([
        { content: this.repairItem.storing_order_tank.customer_company.name, rowSpan:4, styles: { halign: 'left', valign:'bottom', fontStyle: 'bold' } },
        { content: "",colSpan:7, styles: { halign: 'center', fontStyle: fontStyle } },
      ]);

      rows.push([
      // { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: `${this.translatedLangText.NET_COST}(${systemCurrencyCode})`, styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getDiscountAmount(), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getNetCost(false), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getNetCost(true), styles: {  halign: 'center', fontStyle: fontStyle } },
      
    ]);

 if(this.repairItem.storing_order_tank?.customer_company?.currency?.currency_code != systemCurrencyCode){
      var estTotalCost = Number(this.getNetCost(false).replace(",","")||0);
      var apvTotalCost = Number(this.getNetCost(true).replace(",","")||0);
      var rate = this.repairItem.storing_order_tank?.customer_company?.currency?.rate || 1;
      var foreignNetCostEst = (estTotalCost==0) ?"":  Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(estTotalCost * rate));
      var foreignNetCosApv = (apvTotalCost==0) ?"": Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(apvTotalCost * rate));
    
      rows.push([
        { content: `${this.translatedLangText.NET_COST}(${this.repairItem.storing_order_tank?.customer_company?.currency?.currency_code})`, styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content:foreignNetCostEst, styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: foreignNetCosApv, styles: { halign: 'center', fontStyle: fontStyle } }
      ]);
       rows.push([
        { content: ``, rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
        { content:'',  rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } }
      ]);
      // startY-=3;
    }
    else
    {
       rows.push([
        { content: ``, styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content:'', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } }
      ]);
       rows.push([
        { content: ``, rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
        { content:'',  rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } }
      ]);
    }

     const surveyorInfo =  PDFUtility.FormatColon(this.translatedLangText.PREPARED_BY, this.getSurveyorName());
     
     rows.push([
        { content: `${surveyorInfo}`, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content:'', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } }
      ]);

    var buffer=pageWidth-rightMargin-Number(totalCellWidth||0)+2;
    autoTable(pdf, {
        head: headers,
        body: rows,
        startY: startY,
        styles: {
          cellPadding: { left: 2, right: 2, top: 1, bottom: 1 },
          fontSize: fontSz,
        },
        theme: 'grid',
        margin: { left: leftMargin,bottom:10},
        headStyles: {
           fillColor: [grayColor, grayColor, grayColor],
          textColor: 0,
          lineWidth: 0.1,
          fontStyle: 'bold',
        },
        columnStyles: comStyles,
        bodyStyles: {
        fillColor: [255, 255, 255],
        lineWidth: 0.1,
        },

       
      });
     var tableEndY = (pdf as any).lastAutoTable.finalY || startY;
      tableEndY-=1;
   
    }

     createRepairEstimateTotalTable_r4(pdf: jsPDF, startY: number, leftMargin: number, rightMargin: number, pageWidth: number) 
    {

      const minHeightBodyCell = 5;
      const vAlign = "bottom";
      const grayColor=255;
      const fontSz=6.8;
       const headers: RowInput[] = [
      [
      
        {
          content: this.translatedLangText.APPROVED_COST,
           rowSpan:4,
          // colSpan:5,
          styles: { halign: 'left', valign: 'top' }
        },
        {
          content: '',
          // colSpan:2,
          styles: { halign: 'center', valign: vAlign }
        },
        {
          content: '',
          styles: { halign: 'center', valign: vAlign }
        },
        {
          content: this.translatedLangText.OWNER,
          colSpan:4,
          styles: { halign: 'center', valign: vAlign }
        },
        {
          content: this.translatedLangText.LESSEE, // Changed from duplicate MAINTENANCE_DETAILS
          colSpan:4,
          styles: { halign: 'center', valign: vAlign }
        },
      ],
      
    ];

    var cellWPerUnit = (pageWidth-leftMargin-rightMargin)/19;
      const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: 'middle',  cellWidth: (cellWPerUnit*3), minCellHeight: minHeightBodyCell },
      1: { halign: 'center', valign: 'middle', cellWidth: (cellWPerUnit*2)+2, minCellHeight: minHeightBodyCell },
      2: { halign: 'center', valign: 'middle', cellWidth:(cellWPerUnit), minCellHeight: minHeightBodyCell },
      3: { halign: 'center', valign: 'middle',  cellWidth: (cellWPerUnit*1.25), minCellHeight: minHeightBodyCell },
      4: { halign: 'center', valign: 'middle',  cellWidth: (cellWPerUnit*2),  minCellHeight: minHeightBodyCell },
      5: { halign: 'center', valign: 'middle',  cellWidth: (cellWPerUnit*1.25), minCellHeight: minHeightBodyCell },
      6: { halign: 'center', valign: 'middle',   cellWidth: (cellWPerUnit*2),minCellHeight: minHeightBodyCell },
      7: { halign: 'center', valign: 'middle',  cellWidth: (cellWPerUnit*1.25), minCellHeight: minHeightBodyCell },
      8: { halign: 'center', valign: 'middle',  cellWidth: (cellWPerUnit*2),  minCellHeight: minHeightBodyCell },
      9: { halign: 'center', valign: 'middle',  cellWidth: (cellWPerUnit*1.25), minCellHeight: minHeightBodyCell },
      10: { halign: 'center', valign: 'middle',   cellWidth: (cellWPerUnit*2),minCellHeight: minHeightBodyCell },
    };

   
    var totalCellWidth = Object.values(comStyles)
  .reduce((sum, col: any) => sum + (col.cellWidth || 0), 0);
   
    const rows: any[][] = [];
     const fontStyle='normal';
     const fontStyleBold='bold';
    rows.push([
       { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.translatedLangText.ITEM, styles: { halign: 'right', fontStyle: fontStyleBold } },
      { content: this.translatedLangText.RATE, styles: { halign: 'center', fontStyle: fontStyleBold } },
      { content: this.translatedLangText.ESTIMATE_COST,colSpan:2, styles: { halign: 'center', fontStyle: fontStyleBold } },
      { content: this.translatedLangText.APPROVED_COST,colSpan:2, styles: { halign: 'center', fontStyle: fontStyleBold } } ,
      { content: this.translatedLangText.ESTIMATE_COST,colSpan:2, styles: { halign: 'center', fontStyle: fontStyleBold } },
      { content: this.translatedLangText.APPROVED_COST,colSpan:2, styles: { halign: 'center', fontStyle: fontStyleBold } } ,
    ]);
    rows.push([
       { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.translatedLangText.LABOUR, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: this.getLabourCost(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getOwnerLabourHour(false), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getOwnerLabourCost(false), styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getOwnerLabourHour(true), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getOwnerLabourCost(true), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeLabourHour(false), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeLabourCost(false), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeLabourHour(true), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeLabourCost(true), styles: { halign: 'center', fontStyle: fontStyle } },
    ]);
    rows.push([
       { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.translatedLangText.MATERIAL, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getOwnerTotalMaterialCost(false), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getOwnerTotalMaterialCost(true), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeTotalMaterialCost(false), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeTotalMaterialCost(true), styles: { halign: 'center', fontStyle: fontStyle } },
    ]);


     rows.push([
        { content: this.repairItem.storing_order_tank.customer_company.name, rowSpan:4, styles: { halign: 'left', valign:'bottom', fontStyle: 'bold' } },
        { content: "",colSpan:10, styles: { halign: 'center', fontStyle: fontStyle } },
      ]);

      rows.push([
      // { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: `${this.translatedLangText.NET_COST}(${systemCurrencyCode})`, styles: { halign: 'center', fontStyle: fontStyle } },
      { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getOwnerDiscountAmount(false), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getOwnerNetCost(false), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getOwnerDiscountAmount(true), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getOwnerNetCost(true), styles: {  halign: 'center', fontStyle: fontStyle } },
       { content: this.getLesseeDiscountAmount(false), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeNetCost(false), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeDiscountAmount(true), styles: {  halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeNetCost(true), styles: {  halign: 'center', fontStyle: fontStyle } },
      
    ]);

  if(this.repairItem.storing_order_tank?.customer_company?.currency?.currency_code != systemCurrencyCode){
        var estOwnerTotalCost = Number(this.getOwnerNetCost(false).replace(",","")||0);
        var apvOwnerTotalCost = Number(this.getOwnerNetCost(true).replace(",","")||0);
        var rate = this.repairItem.storing_order_tank?.customer_company?.currency?.rate || 1;
        var foreignOwnerNetCostEst = (estOwnerTotalCost==0) ?"":  Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(estOwnerTotalCost * rate));
        var foreignOwnerNetCosApv = (apvOwnerTotalCost==0) ?"": Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(apvOwnerTotalCost * rate));

        var estLesseeTotalCost = Number(this.getLesseeNetCost(false).replace(",","")||0);
        var apvLesseeTotalCost = Number(this.getLesseeNetCost(true).replace(",","")||0);
         var foreignLesseeNetCostEst = (estLesseeTotalCost==0) ?"":  Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(estLesseeTotalCost * rate));
        var foreignLesseeNetCosApv = (apvLesseeTotalCost==0) ?"": Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(apvLesseeTotalCost * rate));
      
        rows.push([
          { content: `${this.translatedLangText.NET_COST}(${this.repairItem.storing_order_tank?.customer_company?.currency?.currency_code})`, styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
          { content: foreignOwnerNetCostEst, styles: {  halign: 'center', fontStyle: fontStyle } },
          { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
          { content: foreignOwnerNetCosApv, styles: {  halign: 'center', fontStyle: fontStyle } },
          { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
          { content:foreignLesseeNetCostEst, styles: {  halign: 'center', fontStyle: fontStyle } },
          { content: "", styles: {  halign: 'center', fontStyle: fontStyle } },
          { content: foreignLesseeNetCosApv, styles: {  halign: 'center', fontStyle: fontStyle } },
        ]);
        rows.push([
          { content: ``, rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content:'',  rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } }
        ]);
        // startY-=3;
      }
      else
      {
        rows.push([
          { content: ``, styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
          { content:'', styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
          { content:'', styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', styles: { halign: 'center', fontStyle: fontStyle } }
        ]);
        rows.push([
         { content: ``, rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content:'',  rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } },
          { content: '', rowSpan:2,styles: { halign: 'center', fontStyle: fontStyle } }
        ]);
      }

     const surveyorInfo =  PDFUtility.FormatColon(this.translatedLangText.PREPARED_BY, this.getSurveyorName());
     
     rows.push([
        { content: `${surveyorInfo}`, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content:'', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } }
      ]);

   
    var buffer=pageWidth-rightMargin-Number(totalCellWidth||0)+2;
    autoTable(pdf, {
        head: headers,
        body: rows,
        startY: startY,
        styles: {
          cellPadding: { left: 2, right: 2, top: 1, bottom: 1 },
         fontSize: fontSz,
        },
        theme: 'grid',
        margin: { left: leftMargin, bottom:10 },
        headStyles: {
           fillColor: [grayColor, grayColor, grayColor],
          textColor: 0,
          lineWidth: 0.1,
          fontStyle: 'bold',
        },
        columnStyles: comStyles,
        bodyStyles: {
        fillColor: [255, 255, 255],
        lineWidth: 0.1,
        },
      
      });
      var tableEndY = (pdf as any).lastAutoTable.finalY || startY;
      tableEndY-=1;
    //   const surveyorInfo =  PDFUtility.FormatColon(this.translatedLangText.PREPARED_BY, this.getSurveyorName());
    //  PDFUtility.addText(pdf,surveyorInfo,tableEndY,leftMargin,9,false);
    }

    createRepairEstimateTotalTable_r5(pdf: jsPDF, startY: number, leftMargin: number, rightMargin: number, pageWidth: number) 
    {

      const grayColor=245;
      const minHeightBodyCell = 5;
        const vAlign = "bottom";
        const AmountSGD =  `${this.translatedLangText.AMOUNT}(${systemCurrencyCode})`;
        const headers:RowInput[] = [[
     { content: this.translatedLangText.DESCRIPTION,  styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.QTY,  styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.RATE,  styles: { halign: 'center', valign: vAlign } },
      { content: AmountSGD,  styles: { halign: 'center', valign: vAlign } }
    ]];

    

    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: 'middle', cellWidth: 38, minCellHeight: minHeightBodyCell },
      1: { halign: 'center', valign: 'middle', cellWidth: 23, minCellHeight: minHeightBodyCell },
      2: { halign: 'center', valign: 'middle', cellWidth: 23, minCellHeight: minHeightBodyCell },
      3: { halign: 'center', valign: 'middle', cellWidth: 23, minCellHeight: minHeightBodyCell },
      
    };
    
     var totalCellWidth = Object.values(comStyles)
  .reduce((sum, col: any) => sum + (col.cellWidth || 0), 0);

    const rows: any[][] = [];
    const fontStyle='normal';
    const fontSz = 7;
    rows.push([
      { content: this.translatedLangText.LABOUR, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: `${this.getTotalLabourHour_Table()||"-"} ${this.translatedLangText.HRS}`, styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getLabourCost_Table()||"-" , styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalLabourCost_Table()||"-", styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
    rows.push([
      { content: this.translatedLangText.MATERIAL, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: '----', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '----', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalMaterialCost_Table()||"-", styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
    rows.push([
      { content: this.translatedLangText.TOTAL_COST, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getTotalCost_Table(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
     rows.push([
      { content: `${this.translatedLangText.LABOUR_DISCOUNT} (${this.translatedLangText.PERCENTAGE_SYMBOL})`, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: this.getLabourDiscount(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle:fontStyle } },
      { content: this.getLabourDiscountCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
     rows.push([
      { content: `${this.translatedLangText.MATERIAL_DISCOUNT} (${this.translatedLangText.PERCENTAGE_SYMBOL})`, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: this.getMaterialDiscount(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getMaterialDiscountCost(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
     rows.push([
      { content: `${this.translatedLangText.NET_COST} (${systemCurrencyCode})`, styles: { halign: 'right', fontStyle: fontStyle,fontSize:(fontSz+1) } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getNetCost_Table(), styles: { halign: 'center', fontStyle: fontStyle,fontSize:(fontSz+1) } }
    ]);

     if(this.repairItem.storing_order_tank?.customer_company?.currency?.currency_code != systemCurrencyCode){
      var netCost = Number(this.getNetCost_Table().replace(",",""));
      var rate = this.repairItem.storing_order_tank?.customer_company?.currency?.rate || 1;
      var foreignNetCost = netCost * rate;
      rows.push([
        { content: `${this.translatedLangText.EQUIVALENT}(${this.repairItem.storing_order_tank?.customer_company?.currency?.currency_code})`, styles: { halign: 'right', fontStyle: fontStyle,fontSize:(fontSz+1) } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(foreignNetCost)), styles: { halign: 'center', fontStyle: fontStyle,fontSize:(fontSz+1) } }
      ]);
      startY-=4;
    }

    var buffer=pageWidth-rightMargin-Number(totalCellWidth||0)+2;
    var tabletLeftPos = (pageWidth/2) - (Number(totalCellWidth||0)/2);
    var bufferSum=10;
    var SumLabelLeftPos = tabletLeftPos - bufferSum;
    Utility.addText(pdf, this.translatedLangText.SUMMARY_COST, startY-(fontSz/2.5), SumLabelLeftPos, fontSz+2,true);
    autoTable(pdf, {
        head: headers,
        body: rows,
        startY: startY,
        styles: {
          cellPadding: { left: 2, right: 2, top: 1, bottom: 1 },
          fontSize: fontSz,
          lineWidth: 0.1
        },
        theme: 'plain',
        margin: { left: tabletLeftPos},
        headStyles: {
           fillColor: [grayColor, grayColor, grayColor],
          textColor: 0,
          fontStyle: 'bold',
        },
        columnStyles: comStyles,
        didDrawCell: function (data) {
          const { cell, doc } = data;
          if (!cell) return;

          const startX = cell.x;
          const endX = cell.x + cell.width;
          const yTop = cell.y;
          const yBottom = cell.y + cell.height;

        //  doc.setDrawColor(0);   // black
        //  doc.setLineWidth(0.2); // thickness

         

          // Draw bottom border for the last row
           if (data.section === 'body') {
            const lastRowIndex = data.table.body.length - 1;
            // Only draw bottom border for the last row
            if (data.row.index === lastRowIndex) {
              // doc.line(startX, yBottom, endX, yBottom);
            }
          }

          // Always draw top border for header
          if (data.section === 'head') {
            doc.line(startX, yBottom, endX, yBottom);
          //  doc.line(startX, yTop, endX, yTop);
          }
        },
      });
   
    }

    createRepairEstimateTotalTable_r6(pdf: jsPDF, startY: number, leftMargin: number, rightMargin: number, pageWidth: number) 
    {

     const minHeightBodyCell = 6;
      const vAlign = "bottom";
      const grayColor=245;
       const fontSz = 7;
     
      const headers: RowInput[] = [[
      { content: this.translatedLangText.DESCRIPTION,  styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.RATE,  styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.QTY,  styles: { halign: 'center', valign: vAlign } },
      { content: `${this.translatedLangText.OWNER} (${systemCurrencyCode})`, styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.QTY,  styles: { halign: 'center', valign: vAlign } },
      { content: `${this.translatedLangText.LESSEE} (${systemCurrencyCode})`, styles: { halign: 'center', valign: vAlign } },
    ]];

    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: 'middle', cellWidth: 35, minCellHeight: minHeightBodyCell },
      1: { halign: 'center', valign: 'middle', cellWidth: 17, minCellHeight: minHeightBodyCell },
      2: { halign: 'center', valign: 'middle', cellWidth: 17, minCellHeight: minHeightBodyCell },
      3: { halign: 'center', valign: 'middle', cellWidth: 22, minCellHeight: minHeightBodyCell },
      4: { halign: 'center', valign: 'middle', cellWidth: 17, minCellHeight: minHeightBodyCell },
      5: { halign: 'center', valign: 'middle', cellWidth: 22, minCellHeight: minHeightBodyCell },
      // 6: { halign: 'center', valign: 'middle', cellWidth: 17, minCellHeight: minHeightBodyCell },
      // 7: { halign: 'center', valign: 'middle', cellWidth: 17, minCellHeight: minHeightBodyCell },
      
    };

    var totalCellWidth = Object.values(comStyles)
  .reduce((sum, col: any) => sum + (col.cellWidth || 0), 0);
   
    const rows: any[][] = [];
     const fontStyle='normal';
    rows.push([
      { content: this.translatedLangText.LABOUR, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: this.getLabourRate(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: `${this.getOwnerLabourHour_Table()} ${this.translatedLangText.HRS}`, styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getOwnerLabourCost_Table(), styles: { halign: 'center', fontStyle: fontStyle } },
       { content: `${this.getLesseeLabourHour_Table()} ${this.translatedLangText.HRS}`, styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeLabourCost_Table(), styles: { halign: 'center', fontStyle: fontStyle } },
    ]);
    rows.push([
      { content: this.translatedLangText.MATERIAL_COST$, styles: { halign: 'right', fontStyle: fontStyle } },
      { content: '---', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '---', styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getOwnerTotalMaterialCost_Table(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '--', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeTotalMaterialCost_Table(), styles: { halign: 'center', fontStyle: fontStyle } },
    ]);
    rows.push([
      { content: this.translatedLangText.TOTAL_COST, styles: { halign: 'right', fontStyle: fontStyle } },
     { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getOwnerTotalCost_Table(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeTotalCost_Table(), styles: { halign: 'center', fontStyle: fontStyle } }
    ]);
     rows.push([
      { content: `${this.translatedLangText.LABOUR_DISCOUNT} (${this.translatedLangText.PERCENTAGE_SYMBOL})`, styles: { halign: 'right', fontStyle: fontStyle } },
     { content: this.getLabourDiscount(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getOwnerLabourDiscountCost_Table(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeLabourDiscountCost_Table(), styles: { halign: 'center', fontStyle: fontStyle } }
      
    ]);
     rows.push([
      { content: `${this.translatedLangText.MATERIAL_DISCOUNT} (${this.translatedLangText.PERCENTAGE_SYMBOL})`, styles: { halign: 'right', fontStyle: fontStyle } },
     { content: this.getMaterialDiscount(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getOwnerMaterialDiscountCost_Table(), styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeMaterialDiscountCost_Table(), styles: { halign: 'center', fontStyle: fontStyle } },
      
    ]);
     rows.push([
      { content: `${this.translatedLangText.NET_COST}(${systemCurrencyCode})`, styles: { halign: 'right', fontStyle: fontStyle ,fontSize:(fontSz+1)} },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
       { content: this.getOwnerNetCost_Table(), styles: { halign: 'center', fontStyle: fontStyle, fontSize:(fontSz+1) } },
      { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
      { content: this.getLesseeNetCost_Table(), styles: { halign: 'center', fontStyle: fontStyle,fontSize:(fontSz+1) } },
    ]);

    if(this.repairItem.storing_order_tank?.customer_company?.currency?.currency_code != systemCurrencyCode){
      var netCost = Number(this.getNetCost_Table().replace(",",""));
      var ownerNetCost = Number(this.getOwnerNetCost_Table().replace(",",""));
      var lesseeNetCost = Number(this.getLesseeNetCost_Table().replace(",",""));
      var rate = this.repairItem.storing_order_tank?.customer_company?.currency?.rate || 1;
      var foreignNetCost = netCost * rate;
      var foreignOwnerNetCost = ownerNetCost * rate;
      var foreignLesseeNetCost = lesseeNetCost * rate;
      rows.push([
        { content: `${this.translatedLangText.NET_COST}(${this.repairItem.storing_order_tank?.customer_company?.currency?.currency_code})`, styles: { halign: 'right', fontStyle: fontStyle,fontSize:(fontSz+1) } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
         { content: Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(foreignOwnerNetCost)), styles: { halign: 'center', fontStyle: fontStyle,fontSize:(fontSz+1) } },
        { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        { content:Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(foreignLesseeNetCost)), styles: { halign: 'center', fontStyle: fontStyle,fontSize:(fontSz+1) } },
        // { content: '', styles: { halign: 'center', fontStyle: fontStyle } },
        // { content: Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(foreignNetCost)), styles: { halign: 'center', fontStyle: fontStyle } }
      ]);
      startY-=6;
    }

    var buffer=pageWidth-rightMargin-Number(totalCellWidth||0)+2;
    var tabletLeftPos = (pageWidth/2) - (Number(totalCellWidth||0)/2) ;
    var bufferSum=10;
    var SumLabelLeftPos = tabletLeftPos - bufferSum;
    Utility.addText(pdf, this.translatedLangText.SUMMARY_COST, startY-(fontSz/2.5), SumLabelLeftPos, fontSz+2,true);
    autoTable(pdf, {
        head: headers,
        body: rows,
        startY: startY,
        styles: {
          cellPadding: { left: 2, right: 2, top: 1, bottom: 1 },
          fontSize: 7,
          lineWidth:0.1
        },
        theme: 'plain',
        margin: { left: tabletLeftPos},
        headStyles: {
           fillColor: [grayColor, grayColor, grayColor],
          textColor: 0,
          fontStyle: 'bold',
        },
        columnStyles: comStyles,
        didDrawCell: function (data) {
          const { cell, doc } = data;
          if (!cell) return;

          const startX = cell.x;
          const endX = cell.x + cell.width;
          const yTop = cell.y;
          const yBottom = cell.y + cell.height;

          // doc.setDrawColor(0);   // black
          // doc.setLineWidth(0.2); // thin line

          // ===== HEADER SECTION =====
          if (data.section === 'head') {
            // Draw top and bottom borders for the header
            // doc.line(startX, yTop, endX, yTop);       // Top line
            doc.line(startX, yBottom, endX, yBottom); // Bottom line
          }

          // ===== BODY SECTION =====
          if (data.section === 'body') {
            const lastRowIndex = data.table.body.length - 1;
            // Only draw bottom border for the last row
            if (data.row.index === lastRowIndex) {
              // doc.line(startX, yBottom, endX, yBottom);
            }
          }
        },
      });
    }

    addSurveyorInfoTable(pdf: jsPDF, pageWidth: number, pageHeight: number, leftMargin: number, rightMargin: number,topMargin:number,bottomMargin:number){
       const grayColor=255;
      const minHeightBodyCell = 8;
      const contentWidth=pageWidth-leftMargin;
        const vAlign = "bottom";

         const surveyorInfo =  PDFUtility.FormatColon(this.translatedLangText.PREPARED_BY, this.getSurveyorName());
          var cellWPerUnit = (pageWidth-leftMargin-rightMargin)/2;
           const appBy =  PDFUtility.FormatColon(this.translatedLangText.APPROVED_BY, "______________________________");
         const headers: RowInput[] = [
      [
      
        {
          content: surveyorInfo,
          styles: { halign: 'center', valign: vAlign,cellWidth:cellWPerUnit+1 , minCellHeight: minHeightBodyCell },
        },
        {
          content: appBy,
          // colSpan:2,
          styles: { halign: 'center', valign: vAlign,cellWidth:cellWPerUnit+1,minCellHeight: minHeightBodyCell }
        }
       
      ],
      
    ];

    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: vAlign,  minCellWidth: (cellWPerUnit)+2,  },
      1: { halign: 'center', valign: vAlign, minCellWidth: (cellWPerUnit)+2, },
     
    };
    var bufferY =15;
    var startY = pageHeight-bottomMargin - bufferY;
    var fontSz=8;
    autoTable(pdf, {
        head: headers,
        startY: startY,
        styles: {
          cellPadding: { left: 2, right: 2, top: 1, bottom: 1 },
          fontSize: fontSz,
        },
        theme: 'grid',
        margin: { left: leftMargin,bottom:10},
        headStyles: {
           fillColor: [grayColor, grayColor, grayColor],
          textColor: 0,
          lineWidth: 0.1,
          fontStyle: 'normal',
        },
        
        columnStyles: comStyles,
        bodyStyles: {
        fillColor: [255, 255, 255],
        lineWidth: 0.1,
        },

       
      });
    }

    getLabourCost(ApprovedValue:boolean=false): string{
       var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
        return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairItem?.labour_cost));
       }
       else 
       {
          return '';
       }
      
    }

     getTotalLabourHour(ApprovedValue:boolean=false): string{
       var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
         return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_hour_table));
       }
       else 
       {
          return '';
       }
      
    }
     
    
      getTotalLabourCost(ApprovedValue:boolean=false): string{
       var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
        return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_labour_cost));
       }
       else 
       {
          return '';
       }
      
    }
    //  getTotalLabourCost(): string{
    //   return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_labour_cost));
    // }

     getLabourDiscount(): string{
      return this.repairItem?.labour_cost_discount;
    }

    getMaterialDiscount(): string{
      return this.repairItem?.material_cost_discount;
    }

    // getNetCost(): string{
    //   var netCost = Number(this.getTotalCost().replace(",",""))+Number(this.getMaterialDiscountCost().replace(",",""))+Number(this.getLabourDiscountCost().replace(",",""));
    //   return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(netCost));
    // }

    getMaterialDiscountCost(): string{
      return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.discount_mat_cost))}` ;
    }

     getLabourDiscountCost(): string{
      return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.discount_labour_cost))}` ;
    }

    getTotalMaterialCost(ApprovedValue:boolean=false): string{
       var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
        return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_mat_cost));
       }
       else 
       {
          return '';
       }
   }

    // getTotalMaterialCost(): string{
    //   return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_mat_cost));
    // }

     getNetCost(ApprovedValue:boolean=false): string{
       var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
          return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.net_cost));
       }
       else 
       {
          return '';
       }
      
    }

    getTotalLabourHour_Table(): string{
      
         return String(BusinessLogicUtil.roundUpCost(this.repairCost?.total_hour_table));
    }
     
    
    getTotalLabourCost_Table(): string{
       
        return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_labour_cost));
     
      
    }


    getLabourCost_Table(): string{
       
        return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairItem?.labour_cost));
    }

    getTotalMaterialCost_Table(): string{
       
        return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_mat_cost));
     
   }

     getNetCost_Table(): string{
      
          return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.net_cost));
      
      
    }

    getTotalCost_Table(): string{
          return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_cost_table));
    }

    getDiscountAmount(): string{
      var totalDiscount = Number(this.repairCost?.discount_labour_cost)+Number(this.repairCost?.discount_mat_cost);

       return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(totalDiscount))}`;
    }
     getTotalCost(ApprovedValue:boolean=false): string{
       var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
          return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_cost_table));
       }
       else 
       {
          return '';
       }
      
    }

    // getTotalCost(): string{
    //   return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_cost_table));
    // }

     getOwnerDiscountAmount(ApprovedValue:boolean=false): string{
      var totalDiscount = Number(this.repairCost?.discount_labour_owner_cost)+Number(this.repairCost?.discount_mat_owner_cost);

       var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
         return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(totalDiscount))}`;
       }
       else
       {
          return '';
       }

      //  return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(totalDiscount))}`;
    }

    getOwnerLabourCost(ApprovedValue:boolean=false): string{
       var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
          return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_owner_labour_cost));
       }
       else 
       {
          return '';
       }
    
      // return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_owner_labour_cost));
    }

    getOwnerLabourHour(ApprovedValue:boolean=false): string{

      var labourHour = Number(this.getTotalLabourHour().replace(",",""))-Number(this.repairCost?.total_lessee_hour);
       var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
          return Utility.formatNumberDisplay(labourHour);
       }
       else 
       {
          return '';
       }
      // return Utility.formatNumberDisplay(labourHour);
    }

    
    getOwnerMaterialDiscountCost(ApprovedValue:boolean=false): string
    {
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
          return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.discount_mat_owner_cost))}`;
       }
       else 
       {
          return '';
       }
      
    }

    getOwnerLabourDiscountCost(ApprovedValue:boolean=false): string
    {
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
         return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.discount_labour_owner_cost))}`;
       }
       else 
       {
          return '';
       }
      
    }
     getOwnerTotalCost(ApprovedValue:boolean=false): string
    {
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
         return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_owner_cost));
       }
       else 
       {
          return '';
       }
      
    }
    getOwnerTotalMaterialCost(ApprovedValue:boolean=false): string
    {
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
        //  var discMaterialCost = Number(this.repairCost?.total_owner_mat_cost) - Number(this.repairCost?.discount_mat_owner_cost);
        //  return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(discMaterialCost));
         return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_owner_mat_cost));
       }
       else 
       {
          return '';
       }
      
    }

    getOwnerNetCost(ApprovedValue:boolean=false): string
    {
      var netCost =this.repairCost?.net_owner_cost;
      // var netCost = Number(this.getOwnerTotalCost().replace(",",""))+Number(this.getOwnerMaterialDiscountCost().replace(",",""))+Number(this.getOwnerLabourDiscountCost().replace(",",""));
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
        return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(netCost));
       }
       else 
       {
          return '';
       }
      
      
    }
   

    getLesseeLabourCost(ApprovedValue:boolean=false): string
    {
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
          return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_lessee_labour_cost));
       }
       else 
       {
          return '';
       }
      // return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_lessee_labour_cost));
    }
     
    getLesseeDiscountAmount(ApprovedValue:boolean=false): string{
      var totalDiscount = Number(this.repairCost?.discount_labour_lessee_cost)+Number(this.repairCost?.discount_mat_lessee_cost);
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
         return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(totalDiscount))}`;
       }
       else
       {
          return '';
       }
    }
    getLesseeLabourHour(ApprovedValue:boolean=false): string
    {
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
          return Utility.formatNumberDisplay(this.repairCost?.total_lessee_hour);
       }
       else 
       {
          return '';
       }
      // return Utility.formatNumberDisplay(this.repairCost?.total_lessee_hour);
    }

    getLesseeTotalCost(ApprovedValue:boolean=false): string
    {
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
          return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.net_lessee_cost));
       }
       else 
       {
          return '';
       }
      // return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_lessee_cost));
    }
    getLesseeTotalMaterialCost(ApprovedValue:boolean=false): string
    {
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
          return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_lessee_mat_cost));
       }
       else 
       {
          return '';
       }
      // return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_lessee_mat_cost));
    }

    getLesseeMaterialDiscountCost(ApprovedValue:boolean=false): string
    {
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
          return `- ${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.discount_mat_lessee_cost))}`;
       }
       else 
       {
          return '';
       }
      
    }
    getLesseeLabourDiscountCost(ApprovedValue:boolean=false): string
    {
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
          return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.discount_labour_lessee_cost))}`;
       }
       else 
       {
          return '';
       }
      
    }


     getLesseeNetCost(ApprovedValue:boolean=false): string
    {
      var netCost =this.repairCost?.net_lessee_cost;
      // /var netCost = Number(this.getLesseeTotalCost().replace(",",""))+Number(this.getLesseeMaterialDiscountCost().replace(",",""))+Number(this.getLesseeLabourDiscountCost().replace(",",""));
      var isApproved= BusinessLogicUtil.isEstimateApproved(this.repairItem);
       if((isApproved && ApprovedValue)||(!isApproved && !ApprovedValue))
       {
        return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(netCost));
       }
       else 
       {
          return '';
       }
       
      // return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(netCost));
    }

   
    
    displayApproveQty(rep: RepairPartItem) {
        if (rep.approve_part === false && this.repairPartDS.is4X(rep.rp_damage_repair)) {
          return 0;
        }
        return rep.approve_part === true ? rep.approve_qty : rep.quantity;
      }
    
      displayApproveHour(rep: RepairPartItem) {
        if (rep.approve_part === false && this.repairPartDS.is4X(rep.rp_damage_repair)) {
          return 0;
        }
        return rep.approve_part === true ? rep.approve_hour : rep.hour;
      }
    
      displayApproveCost(rep: RepairPartItem) {
        if (rep.approve_part === false && this.repairPartDS.is4X(rep.rp_damage_repair)) {
          return Utility.convertNumber(0, 2);
        }
        
        const cost = rep.approve_part === true ? rep.approve_cost : rep.material_cost;
        return Utility.convertNumber(cost, 2);
      }

      getSurveyorName()
      {
        return this.repairItem?.aspnetsuser?.userName||'';
      }

      getLabourRate()
      {
        return  Utility.formatNumberDisplay(this.repairItem?.labour_cost||0);
      }

      getOwnerDiscountAmount_Table(): string{
       var totalDiscount = Number(this.repairCost?.discount_labour_owner_cost)+Number(this.repairCost?.discount_mat_owner_cost);
       return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(totalDiscount))}`;
      
      }

    getOwnerLabourCost_Table(): string{
      
          return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_owner_labour_cost));
      
    }

    getOwnerLabourHour_Table(): string{

      var labourHour = Number(this.getTotalLabourHour_Table().replace(",",""))-Number(this.repairCost?.total_lessee_hour);
       if(labourHour>0) return String(labourHour);
       else return '0';
    }

    
    getOwnerMaterialDiscountCost_Table(): string
    {
     
          return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.discount_mat_owner_cost))}`;
     
    }

    getOwnerLabourDiscountCost_Table(): string
    {
      
         return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.discount_labour_owner_cost))}`;
      
      
    }
     getOwnerTotalCost_Table(): string
    {
      
         return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_owner_cost));
      
      
    }
    getOwnerTotalMaterialCost_Table(): string
    {
         return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_owner_mat_cost));
    }

    getOwnerNetCost_Table(): string
    {
      var netCost =this.repairCost?.net_owner_cost;
        return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(netCost));
    }
   

    getLesseeLabourCost_Table(): string
    {
      
          return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_lessee_labour_cost));
      
    }
     
    getLesseeDiscountAmount_Table(): string{
      var totalDiscount = Number(this.repairCost?.discount_labour_lessee_cost)+Number(this.repairCost?.discount_mat_lessee_cost);
         return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(totalDiscount))}`;
    }
    getLesseeLabourHour_Table(): string
    {
      
          return String(this.repairCost?.total_lessee_hour).replace(".00","");
      
    }

    getLesseeTotalCost_Table(): string
    {
      
          return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_lessee_cost));
      
    }
    getLesseeTotalMaterialCost_Table(): string
    {
          return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.total_lessee_mat_cost));
    }

    getLesseeMaterialDiscountCost_Table(): string
    {
          return `- ${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.discount_mat_lessee_cost))}`;
    }
    getLesseeLabourDiscountCost_Table(): string
    {
          return `-${Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(this.repairCost?.discount_labour_lessee_cost))}`;
    }


     getLesseeNetCost_Table(): string
    {
      var netCost =this.repairCost?.net_lessee_cost;
      
        return Utility.formatNumberDisplay(BusinessLogicUtil.roundUpCost(netCost));
      
    }

}