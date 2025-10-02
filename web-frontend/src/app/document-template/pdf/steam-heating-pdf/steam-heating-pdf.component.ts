import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { FileManagerService } from '@core/service/filemanager.service';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS } from 'app/data-sources/code-values';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { SteamDS } from 'app/data-sources/steam';
import { SteamPartDS } from 'app/data-sources/steam-part';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { PDFUtility } from 'app/utilities/pdf-utility';
import { Utility } from 'app/utilities/utility';
import { customerInfo } from 'environments/environment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable, { Styles } from 'jspdf-autotable';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DialogData {
  steam_guid: string;
  customer_company_guid: string;
  sotDS: StoringOrderTankDS;
  steamDS: SteamDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  existingPdf?: any;
  estimate_no?: string;
  retrieveFile: boolean;
}

@Component({
  selector: 'app-steam-heating-pdf',
  templateUrl: './steam-heating-pdf.component.html',
  styleUrls: ['./steam-heating-pdf.component.scss'],
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
export class SteamHeatingPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    STEAM_PROGRESS_MONITORING_CHART: 'COMMON-FORM.STEAM-PROGRESS-MONITORING-CHART',
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
    SIGNATURE: 'COMMON-FORM.SIGNATURE',
  }

  type?: string | null;
  steamDS: SteamDS;
  steamPartDS: SteamPartDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  steam_guid?: string | null;
  customer_company_guid?: string | null;
  estimate_no?: string | null;

  customerInfo: any = customerInfo;
  disclaimerNote: string = "";
  pdfTitle: string = "";
  steamItem: any;

  last_test_desc?: string = ""

  steamTempList?: any[] = [];
  totalDuration?: string;

  scale = 1.1;
  imageQuality = 0.85;

  generatedPDF: any;
  existingPdf?: any;
  existingPdfSafeUrl?: any;
  isImageLoading$: Observable<boolean> = this.fileManagerService.loading$;
  isFileActionLoading$: Observable<boolean> = this.fileManagerService.actionLoading$;

  private generatingPdfLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  generatingPdfLoading$: Observable<boolean> = this.generatingPdfLoadingSubject.asObservable();
  generatingPdfProgress = 0;

  constructor(
    public dialogRef: MatDialogRef<SteamHeatingPdfComponent>,
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
    this.steam_guid = data.steam_guid;
    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  async ngOnInit() {
    this.pdfTitle = this.translatedLangText.STEAM_PROGRESS_MONITORING_CHART;

    // Await the data fetching
    const [data, pdfData] = await Promise.all([
      this.getSteamData(),
      this.data.retrieveFile ? this.getSteamPdf() : Promise.resolve(null)
    ]);

    if (data?.length > 0) {
      this.steamItem = data[0];
      await this.getCodeValuesData();
      console.log(this.steamItem)
      this.updateData(this.steamItem?.steaming_part?.[0]?.job_order?.steaming_temp);

      this.cdr.detectChanges();
      // this.generatePDF();
      this.exportToPDF();
    }
    // else {
    //   const eirBlob = await Utility.urlToBlob(this.existingPdf?.[0]?.url);
    //   const pdfUrl = URL.createObjectURL(eirBlob);
    //   this.existingPdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl + '#toolbar=0');
    // }
  }

  async generatePDF(): Promise<void> {
    const bodyElement = document.getElementById('pdf-form-body');
    const signElement = document.getElementById('signature-content');

    if (!bodyElement || !signElement) {
      console.error('Body or Signature element not found');
      return;
    }

    try {
      console.log('Start generate', new Date());
      this.generatingPdfLoadingSubject.next(true);
      this.generatingPdfProgress = 0;

      const canvas = await html2canvas(bodyElement, { scale: this.scale });
      const signCanvas = await html2canvas(signElement, { scale: this.scale });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.width; // A4 page width
      const pageHeight = pdf.internal.pageSize.height; // A4 page height
      const leftRightMargin = 5; // Fixed margins
      const topMargin = 5;
      const bottomMargin = 5;

      // Add Header & Footer
      const headerHeight = await this.addHeader(pdf, pageWidth, leftRightMargin, topMargin);
      const footerHeight = await this.addFooter(pdf, pageWidth, pageHeight, leftRightMargin, bottomMargin, 1, 1);
      const usableHeight = pageHeight - topMargin - bottomMargin - footerHeight;

      console.log('Header Height:', headerHeight);
      console.log('Footer Height:', footerHeight);
      console.log('Usable Height:', usableHeight);

      // Convert dimensions from px to mm
      const imgWidth = canvas.width * 0.264583;
      const imgHeight = canvas.height * 0.264583;
      const aspectRatio = imgWidth / imgHeight;

      // Signature Size
      const signWidth = signCanvas.width * 0.264583;
      const signHeight = signCanvas.height * 0.264583;
      const signAspectRatio = signWidth / signHeight;
      const signScaledWidth = pageWidth - leftRightMargin * 2;
      const signScaledHeight = signScaledWidth / signAspectRatio;

      // Adjust for footer
      const signYOffset = pageHeight - bottomMargin - footerHeight - signScaledHeight;

      // Calculate pagination
      const scaledWidth = pageWidth - leftRightMargin * 2;
      const scaledHeight = scaledWidth / aspectRatio;
      let yOffset = 0;
      let currentPage = 1;
      const totalPages = Math.ceil(imgHeight / usableHeight);

      while (yOffset < imgHeight) {
        if (yOffset > 0) pdf.addPage();

        // Add Header
        const headerHeight = await this.addHeader(pdf, pageWidth, leftRightMargin, topMargin);
        this.generatingPdfProgress += 33;

        // Adjust usable height
        const adjustedUsableHeight = usableHeight - headerHeight;

        // Add Body Content
        const chunkHeight = Math.min(imgHeight - yOffset, adjustedUsableHeight);
        const canvasChunk = document.createElement('canvas');
        const context = canvasChunk.getContext('2d');

        // Create new canvas for the current chunk
        canvasChunk.width = canvas.width;
        canvasChunk.height = (chunkHeight * canvas.height) / imgHeight;

        if (context) {
          context.drawImage(canvas, 0, -yOffset * (canvas.height / imgHeight));
        }

        const chunkImgData = canvasChunk.toDataURL('image/jpeg', this.imageQuality);
        pdf.addImage(chunkImgData, 'JPEG', leftRightMargin, topMargin + headerHeight + 2, scaledWidth, scaledHeight);
        this.generatingPdfProgress += 33;

        // If it's the last page, add the signature above the footer
        if (currentPage === totalPages) {
          const signImgData = signCanvas.toDataURL('image/jpeg');
          pdf.addImage(signImgData, 'JPEG', leftRightMargin, signYOffset, signScaledWidth, signScaledHeight);
        }

        // Add Footer
        await this.addFooter(pdf, pageWidth, pageHeight, leftRightMargin, bottomMargin, currentPage, totalPages);

        yOffset += chunkHeight;
        currentPage++;
      }

      this.generatingPdfProgress = 100;

      // Save PDF
      pdf.save(`STEAM_HEATING-${this.estimate_no}.pdf`);
      this.generatedPDF = pdf.output('blob');
      // this.uploadPdf(this.steamItem?.job_order?.guid, this.generatedPDF);
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

  async exportToPDF(fileName: string = 'document.pdf') {
    const pageWidth = 210;
    const pageHeight = 297;
    const leftMargin = 10;
    const rightMargin = 10;
    const topMargin = 5;
    const bottomMargin = 10;
    const contentWidth = pageWidth - leftMargin - rightMargin;

    this.generatingPdfLoadingSubject.next(true);
    this.generatingPdfProgress = 0;

    const pdf = new jsPDF('p', 'mm', 'a4');

    const minHeightHeaderCol = 3;
    const minHeightBodyCell = 7;
    const fontSz = 8.5;
    const fontFamily = 'helvetica';

    const pagePositions: { page: number; x: number; y: number }[] = [];
    const reportTitle = this.pdfTitle;

    const headStyles: Partial<Styles> = {
      fillColor: [211, 211, 211],
      textColor: 0,
      fontStyle: "bold",
      halign: 'center',
      valign: 'middle',
      lineColor: 201,
      lineWidth: 0.1
    };

    var item = this.steamItem;

    let startY = 0;
    const headerHeight = await PDFUtility.addHeaderWithCompanyLogoWithTitleSubTitle_Portrait(
      pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin,
      this.translate, reportTitle, ''
    );

    startY += headerHeight;
    startY += 7;

    var tankData: any[][] = [
      [
        { content: `${this.translatedLangText.TANK_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tank_no}` },
        { content: `${this.translatedLangText.ESTIMATE_NO}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.steamItem?.estimate_no}` }
      ],
      [
        { content: `${this.translatedLangText.CARGO_NAME}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tariff_cleaning?.cargo}` },
        { content: `${this.translatedLangText.FLASH_POINT}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.tariff_cleaning?.flash_point} ${this.translatedLangText.DEGREE_CELSIUS_SYMBOL}` }
      ],
      [
        { content: `${this.translatedLangText.INITIAL_TEMPERATURE}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.steamTempList?.[0]?.meter_temp} ${this.translatedLangText.DEGREE_CELSIUS_SYMBOL}` },
        { content: `${this.translatedLangText.REQUIRED_TEMP}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${item?.storing_order_tank?.required_temp} ${this.translatedLangText.DEGREE_CELSIUS_SYMBOL}` }
      ],
      [
        { content: `${this.translatedLangText.STEAM_BEGIN_ON}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDateTime(this.steamTempList?.[0]?.report_dt, false)}` },
        { content: `${this.translatedLangText.STEAM_COMPLETED_ON}`, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.displayDateTime(item?.complete_dt, false)}` }
      ]
    ];

    autoTable(pdf, {
      body: tankData,
      theme: 'grid',
      margin: { left: leftMargin, top: startY },
      styles: {
        cellPadding: { left: 1, right: 1, top: 1, bottom: 1 },
        fontSize: fontSz,
        minCellHeight: minHeightHeaderCol,
        lineWidth: 0.15,
        lineColor: [0, 0, 0],
      },
      tableWidth: contentWidth,
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 61 },
        2: { cellWidth: 35 },
        3: { cellWidth: 59 }
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        halign: 'left',
        valign: 'middle',
      },
      didDrawPage: (data: any) => {
        pagePositions.push({
          page: pdf.getNumberOfPages(),
          x: pdf.internal.pageSize.width - 20,
          y: pdf.internal.pageSize.height - 10
        });
        startY = data.cursor.y;
      },
    });

    var temperatureHeaders: any[][] = [
      [
        { content: `${this.translatedLangText.NO}`, rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.translatedLangText.TIME}`, rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.translatedLangText.TEMPERATURE} ${this.translatedLangText.DEGREE_CELSIUS_SYMBOL}`, colSpan: 3, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.translatedLangText.REMARKS}`, rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
      ],
      [
        { content: `${this.translatedLangText.THERMOMETER}`, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.translatedLangText.TOP_SIDE}`, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } },
        { content: `${this.translatedLangText.BOTTOM_SIDE}`, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: fontSz } }
      ]
    ];

    var temperatureRows: any[][] = [];
    for (let i = 0; i < this.steamTempList!.length; i++) {
      temperatureRows.push([
        `${i + 1}`,
        `${this.displayDateTime(this.steamTempList?.[i]?.report_dt, false)}`,
        `${this.steamTempList?.[i]?.top_temp}`,
        `${this.steamTempList?.[i]?.meter_temp}`,
        `${this.steamTempList?.[i]?.bottom_temp}`,
        `${this.steamTempList?.[i]?.remarks || ''}`,
      ]);
    }

    let isFirstTemperatureTable = true;
    const tempTableTopMargin = headerHeight;

    autoTable(pdf, {
      head: temperatureHeaders,
      body: temperatureRows,
      theme: 'grid',
      startY: startY + 5,
      margin: {
        left: leftMargin,
        right: rightMargin,
        top: tempTableTopMargin - 5,
        bottom: bottomMargin
      },
      styles: {
        fontSize: fontSz,
        minCellHeight: minHeightHeaderCol,
      },
      tableWidth: contentWidth,
      headStyles: headStyles,
      columnStyles: {
        0: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: contentWidth * 0.04 },
        1: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: contentWidth * 0.18 },
        2: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: contentWidth * 0.15 },
        3: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: contentWidth * 0.15 },
        4: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: contentWidth * 0.15 },
        5: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell, cellWidth: contentWidth * 0.33 },
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        halign: 'left',
        valign: 'middle',
      },
      didDrawPage: (data: any) => {
        isFirstTemperatureTable = false;

        pagePositions.push({
          page: pdf.getNumberOfPages(),
          x: pdf.internal.pageSize.width - 20,
          y: pdf.internal.pageSize.height - 10
        });
      }
    });

    const lastPage = pdf.getNumberOfPages();
    pdf.setPage(lastPage);

    // Get the final Y position after the last table
    const finalY = (pdf as any).lastAutoTable.finalY || startY;

    // Calculate available space for signature
    const footerLineY = pageHeight - 13; // Footer line position
    const requiredSignatureSpace = 30; // Signature box height + padding
    const availableSpace = footerLineY - finalY - 5; // 5mm padding

    let signatureY: number;

    // Check if there's enough space on current page
    if (availableSpace >= requiredSignatureSpace) {
      // Enough space - add signature on current page
      signatureY = finalY + 10;
    } else {
      // Not enough space - add new page
      pdf.addPage();
      signatureY = headerHeight;

      // Update pagePositions for the new page
      pagePositions.push({
        page: pdf.getNumberOfPages(),
        x: pdf.internal.pageSize.width - 20,
        y: pdf.internal.pageSize.height - 10
      });
    }

    const totalDuration = this.steamDS.getTotalSteamDuration(this.steamTempList!);
    signatureY = PDFUtility.addText(pdf, `${this.translatedLangText.TOTAL_DURATION} ${totalDuration} h`, signatureY, leftMargin + 10, fontSz, true, fontFamily, false, undefined, false, '#000000');

    const signatureBoxHeight = 25;
    const signatureBoxWidth = 60;
    const leftSignatureX = leftMargin;
    const rightSignatureX = pageWidth - rightMargin - signatureBoxWidth;

    pdf.setLineWidth(0.15);

    // Left signature box
    pdf.rect(leftSignatureX, signatureY, signatureBoxWidth, signatureBoxHeight);
    PDFUtility.addText(pdf, `${this.translatedLangText.PREPARED_BY}:`, signatureY + 5, leftSignatureX + 2, fontSz, false, fontFamily, true, undefined, false, '#000000');
    pdf.line(leftSignatureX + 2, signatureY + signatureBoxHeight - 10, leftSignatureX + signatureBoxWidth - 2, signatureY + signatureBoxHeight - 10);
    PDFUtility.addText(pdf, `${this.translatedLangText.SIGNATURE}:`, signatureY + signatureBoxHeight - 6, leftSignatureX + 2, fontSz, false, fontFamily, true, undefined, false, '#000000');

    // Right signature box
    pdf.rect(rightSignatureX, signatureY, signatureBoxWidth, signatureBoxHeight);
    PDFUtility.addText(pdf, `${this.translatedLangText.APPROVED_BY}:`, signatureY + 5, rightSignatureX + 2, fontSz, false, fontFamily, true, undefined, false, '#000000');
    pdf.line(rightSignatureX + 2, signatureY + signatureBoxHeight - 10, rightSignatureX + signatureBoxWidth - 2, signatureY + signatureBoxHeight - 10);
    PDFUtility.addText(pdf, `${this.translatedLangText.SIGNATURE}:`, signatureY + signatureBoxHeight - 6, rightSignatureX + 2, fontSz, false, fontFamily, true, undefined, false, '#000000');

    await PDFUtility.addFooterWithPageNumberAndCompanyLogo_Portrait(
      pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin,
      this.translate, pagePositions
    );

    this.downloadFile(pdf.output('blob'), this.getReportTitle());
    this.dialogRef.close();
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

  getSteamData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.steamDS.getSteamByIDForPdf(this.steam_guid!).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err),
      });
    });
  }

  getSteamPdf(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.fileManagerService.getFileUrlByGroupGuid([this.steam_guid!]).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err),
      });
    });
  }

  async getCodeValuesData(): Promise<void> {
    // const queries = [
    //   { alias: 'yesnoCv', codeValType: 'YES_NO' },
    //   { alias: 'soTankStatusCv', codeValType: 'SO_TANK_STATUS' },
    //   { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
    //   { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
    //   { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
    //   { alias: 'partLocationCv', codeValType: 'PART_LOCATION' },
    //   { alias: 'damageCodeCv', codeValType: 'DAMAGE_CODE' },
    //   { alias: 'repairCodeCv', codeValType: 'REPAIR_CODE' },
    //   { alias: 'unitTypeCv', codeValType: 'UNIT_TYPE' },
    // ];

    // await this.cvDS.getCodeValuesByTypeAsync(queries);

    // // Wrap all alias connections in promises
    // const promises = [
    //   firstValueFrom(this.cvDS.connectAlias('yesnoCv')).then(data => {
    //     this.yesnoCvList = data || [];
    //   }),
    //   firstValueFrom(this.cvDS.connectAlias('soTankStatusCv')).then(data => {
    //     this.soTankStatusCvList = data || [];
    //   }),
    // ];

    // // Wait for all promises to resolve
    // await Promise.all(promises);
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
        ...row
      }));

      // console.log('Before sort', newData);
      // newData = this.repairPartDS.sortAndGroupByGroupName(newData);
      // console.log('After sort', newData);

      this.steamTempList = newData.map((row, index) => ({
        ...row,
        index: index
      }));
      console.log(this.steamTempList);
    } else {
      this.steamTempList = [];
    }
    this.getTotalSteamDuration();
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

  // parse2Decimal(input: number | string | undefined) {
  //   return Utility.formatNumberDisplay(input);
  // }

  getTotalSteamDuration() {
    this.totalDuration = this.steamDS.getTotalSteamDuration(this.steamTempList);
  }

  calculateCost() {
    // this.repairCost = this.steamDS.calculateCost(this.repairItem, this.repairItem?.repair_part);
    // console.log(this.repairCost)
  }

  async onDownloadClick() {
    const fileName = `STEAM_HEATING-${this.estimate_no}.pdf`; // Define the filename
    if (this.generatedPDF) {
      this.downloadFile(this.generatedPDF, fileName);
    } else if (this.existingPdf?.[0]?.url) {
      const blob = await Utility.urlToBlob(this.existingPdf?.[0]?.url);
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

  pdfHeader() {
    const headerElement = document.getElementById('pdf-form-header');
    if (!headerElement) {
      return '';
    }
    const a = headerElement.innerHTML
    return '';
  }

  getReportTitle() {
    return `${this.steamItem?.estimate_no} ${this.translatedLangText.STEAM_PROGRESS_MONITORING_CHART}`;
  }
}
