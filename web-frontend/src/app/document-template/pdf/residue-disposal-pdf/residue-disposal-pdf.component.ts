import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';

import { customerInfo } from 'environments/environment';
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
import { RepairCostTableItem } from 'app/data-sources/repair';
import { ResidueDS } from 'app/data-sources/residue';
import { ResiduePartDS, ResiduePartItem } from 'app/data-sources/residue-part';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import autoTable, { RowInput, Styles } from 'jspdf-autotable';
import { PDFUtility } from 'app/utilities/pdf-utility';

import { TANK_STATUS_IN_YARD, TANK_STATUS_POST_IN_YARD, ESTIMATE_APPROVED_STATUS, Utility } from "app/utilities/utility";
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';

// import { fileSave } from 'browser-fs-access';

export interface DialogData {
  residue_guid: string;
  customer_company_guid: string;
  sotDS: StoringOrderTankDS;
  residueDS: ResidueDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  estimate_no?: string;
  retrieveFile: boolean;

}

@Component({
  selector: 'app-residue-disposal-pdf',
  templateUrl: './residue-disposal-pdf.component.html',
  styleUrls: ['./residue-disposal-pdf.component.scss'],
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
export class ResidueDisposalPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  translatedLangText: any = {};
  langText = {
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_NAME: 'COMMON-FORM.CUSTOMER-NAME',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    CANCEL: 'COMMON-FORM.CANCEL',
    CLOSE: 'COMMON-FORM.CLOSE',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    SEARCH: "COMMON-FORM.SEARCH",
    EIR_NO: "COMMON-FORM.EIR-NO",
    EIR_DATE: "COMMON-FORM.EIR-DATE",
    CUSTOMER: "COMMON-FORM.CUSTOMER",
    OWNER: "COMMON-FORM.OWNER",
    CURRENT_STATUS: "COMMON-FORM.CURRENT-STATUS",
    SURVEY_INFO: "COMMON-FORM.SURVEY-INFO",
    DATE_OF_INSPECTION: "COMMON-FORM.DATE-OF-INSPECTION",
    PERIODIC_TEST: "COMMON-FORM.PERIODIC-TEST",
    DATE: "COMMON-FORM.DATE",
    LAST_UPDATE_BY: 'COMMON-FORM.LAST-UPDATE-BY',
    LAST_UPDATE_ON: 'COMMON-FORM.LAST-UPDATE-ON',
    TANK_DETAILS: 'COMMON-FORM.TANK-DETAILS',
    BACK: 'COMMON-FORM.BACK',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    BOTTOM: 'COMMON-FORM.BOTTOM',
    TOP: 'COMMON-FORM.TOP',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    SAVE_ERROR: 'COMMON-FORM.SAVE-ERROR',
    DAMAGE_PHOTOS: 'COMMON-FORM.DAMAGE-PHOTOS',
    PREVIEW: 'COMMON-FORM.PREVIEW',
    DELETE: 'COMMON-FORM.DELETE',
    CONFIRM_DELETE: 'COMMON-FORM.CONFIRM-DELETE',
    DELETE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    PUBLISH: 'COMMON-FORM.PUBLISH',
    PHONE: 'COMMON-FORM.PHONE',
    FAX: 'COMMON-FORM.FAX',
    EMAIL: 'COMMON-FORM.EMAIL',
    WEB: 'COMMON-FORM.WEB',
    TAKE_IN_DATE: 'COMMON-FORM.TAKE-IN-DATE',
    LAST_RELEASE_DATE: 'COMMON-FORM.LAST-RELEASE-DATE',
    TAKE_IN_REFERENCE: 'COMMON-FORM.TAKE-IN-REFERENCE',
    OPERATOR: 'COMMON-FORM.OPERATOR',
    TAKE_IN_STATUS: 'COMMON-FORM.TAKE-IN-STATUS',
    YES: 'COMMON-FORM.YES',
    NO: 'COMMON-FORM.NO',
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
    ESTIMATE_NO: 'COMMON-FORM.ESTIMATE-NO',
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    NO_DOT: 'COMMON-FORM.NO-DOT',
    ITEM: 'COMMON-FORM.ITEM',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    DEPOT_ESTIMATE: 'COMMON-FORM.DEPOT-ESTIMATE',
    CUSTOMER_APPROVAL: 'COMMON-FORM.CUSTOMER-APPROVAL',
    QTY: 'COMMON-FORM.QTY',
    LABOUR: 'COMMON-FORM.LABOUR',
    MATERIAL: 'COMMON-FORM.MATERIAL',
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
    CARGO_NAME: 'COMMON-FORM.CARGO-NAME',
    QUOATION_NO: 'COMMON-FORM.QUOTATION-NO',
    FLASH_POINT: 'COMMON-FORM.FLASH-POINT',
    ETR_DATE: 'COMMON-FORM.ETR-DATE',
    REQUIRED_TEMP: 'COMMON-FORM.REQUIRED-TEMP',
    DEGREE_CELSIUS_SYMBOL: 'COMMON-FORM.DEGREE-CELSIUS-SYMBOL',
    RESIDUE_CARGO_DISPOSAL: 'COMMON-FORM.RESIDUE-CARGO-DISPOSAL',
    TIME: 'COMMON-FORM.TIME',
    TEMPERATURE: 'COMMON-FORM.TEMPERATURE',
    THERMOMETER: 'COMMON-FORM.THERMOMETER',
    TOP_SIDE: 'COMMON-FORM.TOP-SIDE',
    BOTTOM_SIDE: 'COMMON-FORM.BOTTOM-SIDE',
    INITIAL_TEMPERATURE: 'COMMON-FORM.INITIAL-TEMPERATURE',
    STEAM_BEGIN_ON: 'COMMON-FORM.STEAM-BEGIN-ON',
    STEAM_COMPLETED_ON: 'COMMON-FORM.STEAM-COMPLETED-ON',
    TOTAL_DURATION: 'COMMON-FORM.TOTAL-DURATION',
    PREPARED_BY: 'COMMON-FORM.PREPARED-BY',
    APPROVED_BY: 'COMMON-FORM.APPROVED-BY',
    PRICE: 'COMMON-FORM.PRICE',
    TOTAL_SGD: 'COMMON-FORM.TOTAL-SGD',
    RESIDUE_ESTIMATE: 'COMMON-FORM.RESIDUE-ESTIMATE',
    TOTAL: 'COMMON-FORM.TOTAL',
    RESIDUE_QUOTATION: 'COMMON-FORM.RESIDUE-QUOTATION',
    QUOTATION_DATE: 'COMMON-FORM.QUOTATION-DATE',
    APPROVED: 'COMMON-FORM.APPROVED',
    TOTAL_COST: 'COMMON-FORM.TOTAL-COST',
  }

  type?: string | null;
  residueDS: ResidueDS;
  residuePartDS: ResiduePartDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;

  cvDS: CodeValuesDS;
  residue_guid?: string | null;
  estimate_no?: string | null;

  customerInfo: any = customerInfo;
  disclaimerNote: string = "";
  pdfTitle: string = "";
  residueItem: any;

  last_test_desc?: string = ""

  repairCost?: RepairCostTableItem;
  residuePartList?: any[] = [];
  yesnoCvList: CodeValuesItem[] = [];
  soTankStatusCvList: CodeValuesItem[] = [];
  totalCost?: number;
  approvedCost?: number;

  scale = 1.1;
  imageQuality = 0.85;

  generatedPDF: any;
  isImageLoading$: Observable<boolean> = this.fileManagerService.loading$;
  isFileActionLoading$: Observable<boolean> = this.fileManagerService.actionLoading$;

  private generatingPdfLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  generatingPdfLoading$: Observable<boolean> = this.generatingPdfLoadingSubject.asObservable();
  generatingPdfProgress = 0;
  isEstimateApproved: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ResidueDisposalPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) {
    super();
    this.translateLangText();
    this.residueDS = new ResidueDS(this.apollo);
    this.residuePartDS = new ResiduePartDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.residue_guid = data.residue_guid;
    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  async ngOnInit() {
    this.pdfTitle = this.translatedLangText.RESIDUE_CARGO_DISPOSAL;

    // Await the data fetching
    const [data, pdfData] = await Promise.all([
      this.getResidueData(),
      // this.data.retrieveFile ? this.getSteamPdf() : Promise.resolve(null)
      Promise.resolve(null)
    ]);
    if (data?.length > 0) {
      this.residueItem = data[0];
      this.estimate_no = this.residueItem?.estimate_no;
      await this.getCodeValuesData();
      console.log(this.residueItem)
      this.updateData(this.residueItem?.residue_part);

      this.cdr.detectChanges();
    }

    this.generatePDF();
  }

  async generatePDF(): Promise<void> {
    this.exportToPDF_r2();
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

  getResidueData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.residueDS.getResidueByIDForPdf(this.residue_guid!).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err),
      });
    });
  }

  getSteamPdf(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.fileManagerService.getFileUrlByGroupGuid([this.residue_guid!]).subscribe({
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
      firstValueFrom(this.cvDS.connectAlias('yesnoCv')).then(data => {
        this.yesnoCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('soTankStatusCv')).then(data => {
        this.soTankStatusCvList = data || [];
      }),
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

  updateData(newData: ResiduePartItem[] | undefined): void {
    if (newData?.length) {
      this.residuePartList = newData.map((row, index) => ({
        ...row,
        index: index,
        qty: (ESTIMATE_APPROVED_STATUS.includes(this.residueItem.status_cv)) ? row.approve_qty : row.quantity
      }));
      this.totalCost = this.residuePartList.reduce((sum, row) => sum + (row.approve_part ? (((row.cost || 0) * (row.qty || 0))) : 0), 0);
      this.approvedCost = this.residuePartList.reduce((sum, row) => sum + (row.approve_part ? (((row.approve_cost || 0) * (row.qty || 0))) : 0), 0);
      console.log(this.residuePartList);
    } else {
      this.residuePartList = [];
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayDateTime(input: number | undefined, is12Hr: boolean): string | undefined {
    return Utility.convertEpochToDateTimeStr(input, is12Hr);
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

  downloadFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();

    // Revoke the URL to free memory
    URL.revokeObjectURL(url);
  }

  pdfHeader() {
    const headerElement = document.getElementById('pdf-form-header');
    if (!headerElement) {
      return '';
    }
    const a = headerElement.innerHTML
    return '';
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

    let startY = 37; // Start table 20mm below the customer name

    await PDFUtility.addHeaderWithCompanyLogo_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);

    pdf.setLineWidth(0.1);
    pdf.setLineDashPattern([0.01, 0.01], 0.1);

    // pdf.setFontSize(8);
    // pdf.setTextColor(0, 0, 0); // Black text

    // const cutoffDate = `${this.translatedLangText.TAKE_IN_DATE}: ${this.displayDate(this.eirDetails?.in_gate?.create_dt)}`; // Replace with your actual cutoff date
    //pdf.text(cutoffDate, pageWidth - rightMargin, lastTableFinalY + 10, { align: "right" });
    //PDFUtility.AddTextAtRightCornerPage(pdf, cutoffDate, pageWidth, leftMargin, rightMargin, lastTableFinalY + 5, 8);
    //PDFUtility.addText(pdf, this.translatedLangText.EQUIPMENT_INTERCHANGE_RECEIPT, lastTableFinalY + 5, leftMargin, 8);
    // const data: any[][] = [];
    var item = this.residueItem;
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
        { content: `${this.translatedLangText.JOB_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.job_no}` },
        { content: `${this.translatedLangText.ESTIMATE_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.estimate_no}` }
      ],
      [
        { content: `${this.translatedLangText.CARGO_NAME}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tariff_cleaning?.cargo}` },
        { content: `${this.translatedLangText.ESTIMATE_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDate(Utility.getTodayDateInEpoch())}` }
      ]
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


    startY = lastTableFinalY + 4;
    PDFUtility.addReportTitle(pdf, this.pdfTitle, pageWidth, leftMargin, rightMargin, startY, 8);
    startY += 4;
    this.createResidueEstimateDetail(pdf, startY, leftMargin, rightMargin, pageWidth);
    this.downloadFile(pdf.output('blob'), this.getReportTitle())
    this.dialogRef.close();
  }

  createResidueEstimateDetail(pdf: jsPDF, startY: number, leftMargin: number, rightMargin: number, pageWidth: number) {
    const fontSz = 8;
    const vAlign = "bottom";
    const headers: RowInput[] = [
      [
        {
          content: this.translatedLangText.NO_DOT,

          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.DESCRIPTION,

          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.QTY,

          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.PRICE,

          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.ESTIMATE_COST,

          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.APPROVED_COST,

          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, cellPadding: 2 }
        },
        {
          content: '',

          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, cellPadding: 2 }
        }


      ]
    ];

    var repData: RowInput[] = [];
    var items = this.residuePartList;
    const grpFontSz = 7;
    items?.forEach((item, index) => {
      repData.push([
        item.index + 1, item.description, `${item.quantity} ${item.qty_unit_type_cv}`, this.parse2Decimal(item.cost),
        this.parse2Decimal(item.quantity * item.cost), this.parse2Decimal(item.approve_cost)]);
    });

    autoTable(pdf, {
      head: headers,
      body: repData,
      startY: startY, // Start table at the current startY value
      styles: {
        cellPadding: { left: 2, right: 2, top: 1, bottom: 1 }, // Reduce padding
        fontSize: 7.5,
        lineWidth: 0.1 // remove all borders initially
      },
      theme: 'grid',
      margin: { left: leftMargin },
      headStyles: {
        fillColor: 255,
        textColor: 0,
        fontStyle: 'bold',
        lineWidth: 0 // keep outer border for header
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center', valign: 'middle' },
        1: { cellWidth: 70, halign: 'left', valign: 'middle' },
        2: { cellWidth: 28, halign: 'center', valign: 'middle' },
        3: { cellWidth: 28, halign: 'right', valign: 'middle' },
        4: { cellWidth: 28, halign: 'right', valign: 'middle' },
        5: { cellWidth: 28, halign: 'right', valign: 'middle' },
        6: { cellWidth: 28, halign: 'right', valign: 'middle' },
      },
      didDrawPage: (data: any) => {
        startY = data.cursor.y;
      }
    });

    var totalSGD = `${this.translatedLangText.TOTAL_SGD}:`;
    var totalCostValue = `${this.parse2Decimal(this.totalCost)}`;
    var AppCostValue = `${this.parse2Decimal(this.approvedCost)}`;
    startY += 2;
    var estData: RowInput[] = [];
    estData.push([
      '', '', '',
      { content: `${totalSGD}`, styles: { halign: 'right', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
      { content: `${totalCostValue}`, styles: { halign: 'right', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
      { content: `${AppCostValue}`, styles: { halign: 'right', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
    ])


    autoTable(pdf, {
      body: estData,
      startY: startY, // Start table at the current startY value
      styles: {
        cellPadding: { left: 2, right: 2, top: 1, bottom: 1 }, // Reduce padding
        fontSize: 7.5,
        lineWidth: 0 // remove all borders initially
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
        0: { cellWidth: 10, halign: 'center', valign: 'middle' },
        1: { cellWidth: 70, halign: 'left', valign: 'middle' },
        2: { cellWidth: 28, halign: 'center', valign: 'middle' },
        3: { cellWidth: 28, halign: 'right', valign: 'middle' },
        4: { cellWidth: 28, halign: 'right', valign: 'middle' },
        5: { cellWidth: 28, halign: 'right', valign: 'middle' },
      },
      didDrawCell: function (data) {
        const doc = data.doc;
        if (data.column.index === 4) {
          doc.line(
            data.cell.x,
            data.cell.y + data.cell.height,
            data.cell.x + data.cell.width,
            data.cell.y + data.cell.height
          );
        }
      },
      didDrawPage: (data: any) => {

        startY = data.cursor.y;

      }
    });
  }

  getReportTitle() {
    return this.translatedLangText.RESIDUE_CARGO_DISPOSAL;
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

    let startY = 0; // Start table 20mm below the customer name
    var item = this.residueItem;
    var cc = item.storing_order_tank?.storing_order?.customer_company;

     startY = await PDFUtility.addHeaderWithCompanyLogoWithTitleSubTitle_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin,
       this.translate, this.pdfTitle, '');
    startY+=(PDFUtility.GapBetweenSubTitleAndTable_Portrait()*2) - PDFUtility.GapBetweenLeftTitleAndTable();
    // await PDFUtility.addHeaderWithCompanyLogo_Portriat_r1(pdf, pageWidth, topMargin - 5, bottomMargin, leftMargin, rightMargin, this.translate, cc);

    // startY = 43;
    // PDFUtility.addReportTitle(pdf, this.pdfTitle, pageWidth, leftMargin, rightMargin, startY - 2, 12, false, 1
    //   , '#000000', false);
    // startY += 8;
    var data: any[][] = [
      [
        { content: `${this.translatedLangText.TANK_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tank_no}` },
        { content: `${this.translatedLangText.EIR_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.in_gate?.[0]?.eir_no}` }
      ],
      [
        { content: `${this.translatedLangText.CUSTOMER}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.storing_order?.customer_company?.name}` },
        { content: `${this.translatedLangText.EIR_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDate(item?.storing_order_tank?.in_gate?.[0]?.eir_dt)}` }
      ],
      [
        { content: `${this.translatedLangText.JOB_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.job_no}` },
        { content: `${this.translatedLangText.ESTIMATE_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.estimate_no}` }
      ],
      [
        { content: `${this.translatedLangText.CARGO_NAME}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tariff_cleaning?.cargo}` },
        { content: `${this.translatedLangText.QUOTATION_DATE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDate(Utility.getTodayDateInEpoch())}` }
      ]
    ];

    autoTable(pdf, {
      body: data,
      // startY: startY, // Start table at the current startY value
      theme: 'grid',
      margin: { left: leftMargin, top:startY },
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
        3: { cellWidth: 59 }
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
            Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin+45);
          }
        }
      },
    });

    this.isEstimateApproved = BusinessLogicUtil.isEstimateApproved(item);
    startY = lastTableFinalY + 15;
    this.createResidueEstimateDetail_r1(pdf, startY, leftMargin, rightMargin, pageWidth);
    startY = pageHeight - 25;
    startY += 7;
    pdf.setLineWidth(0.1);

   pdf.setLineDashPattern([0.01, 0.01], 0.1);

    var yPos = startY;
    pdf.line(leftMargin, yPos, (pageWidth + 2 - rightMargin), yPos);
    startY = yPos + 4;
    // await PDFUtility.ReportFooter_CompanyInfo_portrait_r1(pdf, pageWidth, startY, bottomMargin, leftMargin, rightMargin, this.translate); // ReportFooter_CompanyInfo_portrait
    this.downloadFile(pdf.output('blob'), this.getPdfFileName())
    this.dialogRef.close();
  }

  createResidueEstimateDetail_r1(pdf: jsPDF, startY: number, leftMargin: number, rightMargin: number, pageWidth: number) {
    const fontSz = 8;
    const vAlign = "bottom";
    const tableWidth = pageWidth - leftMargin - rightMargin;
    const headers: RowInput[] = [
      [
        {
          content: this.translatedLangText.NO_DOT,

          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.DESCRIPTION,

          styles: { fontSize: fontSz, halign: 'left', valign: vAlign, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.QTY,

          styles: { fontSize: fontSz, halign: 'center', valign: vAlign, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.PRICE,

          styles: { fontSize: fontSz, halign: 'right', valign: vAlign, cellPadding: 2 }
        },
        {
          content: this.translatedLangText.TOTAL_COST,

          styles: { fontSize: fontSz, halign: 'right', valign: vAlign, cellPadding: 2 }
        },
        // { 
        //   content: this.translatedLangText.APPROVED,

        //   styles: { fontSize: fontSz, halign: 'center', valign: vAlign,cellPadding: 2  }
        // }
      ]
    ];

    var repData: RowInput[] = [];
    var items = this.residuePartList;
    var index = 1;
    const grpFontSz = 7;
    var estTotalCost = 0;
    var rightPadding_cost = 5;
    items?.forEach((item, index) => {
      // if(item.approve_part)
      // {
      item.approve_part = item.approve_part ?? true;
      if (!item.approve_part) return;
      var qty = item.quantity;
      var cost = item.cost;
      var app = (item.approve_part) ? "O" : "X";
      if (this.isEstimateApproved) {
        qty = item.approve_qty;
        cost = item.approve_cost;
      }
      var totalCost = qty * cost;
      if (item.approve_part) estTotalCost += totalCost;
      repData.push([
        (++index), item.description, `${qty} ${item.qty_unit_type_cv}`,
        { content: `${this.parse2Decimal(cost)}`, styles: { halign: 'right', valign: 'middle', cellPadding: { right: rightPadding_cost - 1 } } },
        { content: `${this.parse2Decimal(totalCost)}`, styles: { halign: 'right', valign: 'middle', cellPadding: { right: rightPadding_cost } } }
        //, app
      ]);
      // }
    });

    const comStyles: any = {
      0: { cellWidth: 11, halign: 'center', valign: 'middle' },
      1: { cellWidth: 105, halign: 'left', valign: 'middle' },
      2: { cellWidth: 20, halign: 'center', valign: 'middle' },
      3: { cellWidth: 25, halign: 'center', valign: 'middle' },
      4: { halign: 'right', valign: 'middle' },
      // 5: { halign: 'center', valign: 'middle'},
    };

    autoTable(pdf, {
      head: headers,
      body: repData,
      startY: startY, // Start table at the current startY value
      tableWidth: tableWidth,
      styles: {
        cellPadding: { left: 2, right: 2, top: 1, bottom: 1 }, // Reduce padding
        fontSize: fontSz,
        lineWidth: 0 // remove all borders initially
      },
      theme: 'grid',
      margin: { left: leftMargin },
      headStyles: {
        fillColor: 255,
        textColor: 0,
        fontStyle: 'bold',
        lineWidth: 0.0 // keep outer border for header
      },
      columnStyles: comStyles,
      didDrawCell: function (data) {
        const doc = data.doc;

        if (data.row.index === 0 && data.column.index === 0 && data.section === "head") {
          doc.setLineWidth(0.3);
          doc.setDrawColor(0, 0, 0); // Set line color to black
          doc.line(
            data.cell.x,
            data.cell.y - 2,
            pageWidth - rightMargin,
            data.cell.y - 2
          );
        }
      },
      didDrawPage: (data: any) => {
        startY = data.cursor.y;
      }
    });

    var yPos = startY + 5;
    pdf.setLineWidth(0.1);
    // Set dashed line pattern
   pdf.setLineDashPattern([0.01, 0.01], 0.1);
    //      var  yPos = startY+5;
    //       pdf.setLineWidth(0.3);
    // // Set dashed line pattern
    //       pdf.setLineDashPattern([0.01, 0.01], 0);

    //         // Draw top line
    //       pdf.line(leftMargin, yPos, (pageWidth+2-rightMargin ), yPos);

    var sysCurrencyCode = Utility.GetSystemCurrencyCode();
    var totalSGD = `${this.translatedLangText.TOTAL} (${sysCurrencyCode}):`;
    var totalCostValue = `${this.parse2Decimal(estTotalCost)}`;
    var AppCostValue = (this.approvedCost === 0 ? '' : `${this.parse2Decimal(this.approvedCost)}`);
    var amtWords = (this.residueItem.status_cv == "APPROVED") ? Utility.convertToWords(this.approvedCost!) : Utility.convertToWords(this.totalCost!);
    var cc = this.residueItem.storing_order_tank?.storing_order?.customer_company;
    var custCurrencyCode = cc?.currency?.currency_code;

    //  var totalSGD=`${this.translatedLangText.TOTAL_SGD}:`;
    // var totalCostValue=`${this.parse2Decimal(this.totalCost)}`;
    startY += 3;
    var t = 2;
    var estData: RowInput[] = [];
    estData.push([
      '', '', '',
      { content: `${totalSGD}`, styles: { halign: 'right', valign: 'middle', fontStyle: 'bold', fontSize: fontSz + 1 } },
      {
        content: `${totalCostValue}`, styles: {
          halign: 'right', valign: 'middle', fontStyle: 'bold',
          fontSize: fontSz, cellPadding: { right: rightPadding_cost, top: t }
        }
      },

    ]);
    //  estData.push([
    //       { content: `${amtWords}`,  colSpan: 6,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: 10, textColor: '#000000'} },

    //    ])
    if (sysCurrencyCode != custCurrencyCode) {
      var totalForeign = `${this.translatedLangText.TOTAL} (${custCurrencyCode}):`;
      //var cc= this.residueItem.storing_order_tank?.storing_order?.customer_company;
      var rate = cc.currency?.rate;
      var convertedCost = `${this.parse2Decimal((estTotalCost || 0) * rate)}`;
      // var convertedapprovedCost =  (this.approvedCost===0?'':`${this.parse2Decimal((this.approvedCost||0)*rate)}`);
      //  amtWords =  Utility.convertToWords(this.approvedCost!);
      //  estData[0]=[{ content: `${amtWords}`,  colSpan: 6,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: 10, textColor: '#000000'} }];
      estData.push([
        '', '', '',
        { content: `${totalForeign}`, styles: { halign: 'right', valign: 'middle', fontStyle: 'bold', fontSize: fontSz + 1 } },
        { content: `${convertedCost}`, styles: { halign: 'right', valign: 'middle', fontStyle: 'bold', fontSize: fontSz, cellPadding: { right: rightPadding_cost, top: t } } },

      ])
    }
    //  else
    //  {

    //     estData.push([
    //     '','','',
    //       { content: `${totalSGD}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz+1}  },
    //       { content: `${totalCostValue}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',
    //         fontSize: fontSz,cellPadding: { right: rightPadding_cost } } },

    //   ])

    //  }
    autoTable(pdf, {
      body: estData,
      startY: startY, // Start table at the current startY value
      tableWidth: tableWidth,
      styles: {
        cellPadding: { left: 2, right: 2, top: t, bottom: 0 }, // Reduce padding
        fontSize: 7.5,
        lineWidth: 0 // remove all borders initially
      },
      theme: 'grid',
      margin: { left: leftMargin },
      columnStyles: comStyles,
      didDrawCell: function (data) {
        const doc = data.doc;
        if (data.row.index === 0 && data.column.index === 0 && data.section === "body") {
          doc.setLineWidth(0.3);
          doc.setDrawColor(0, 0, 0); // Set line color to black
          doc.line(
            data.cell.x,
            data.cell.y - 1,
            pageWidth - rightMargin,
            data.cell.y - 1
          );
        }
      },
      didDrawPage: (data: any) => {
        startY = data.cursor.y;
      }
    });
  }

  getPdfFileName(): string {
    var fileName = `${this.residueItem.storing_order_tank.tank_no} (${this.estimate_no!}).pdf`;

    return fileName;
  }
}
