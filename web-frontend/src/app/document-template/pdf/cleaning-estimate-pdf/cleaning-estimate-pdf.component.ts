import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS } from 'app/data-sources/code-values';
import { Utility } from 'app/utilities/utility';
import { customerInfo, environment } from 'environments/environment';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BehaviorSubject, Observable } from 'rxjs';
// import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { FileManagerService } from '@core/service/filemanager.service';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateCleaningDS } from 'app/data-sources/in-gate-cleaning';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { SteamDS } from 'app/data-sources/steam';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import autoTable, { RowInput, Styles } from 'jspdf-autotable';
import { PDFUtility } from 'app/utilities/pdf-utility';

// import { fileSave } from 'browser-fs-access';

export interface DialogData {
  cleaning_guid: string;
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
  selector: 'app-cleaning-estimate-pdf',
  templateUrl: './cleaning-estimate-pdf.component.html',
  styleUrls: ['./cleaning-estimate-pdf.component.scss'],
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
export class CleaningEstimatePdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
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
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    SAVE_ERROR: 'COMMON-FORM.SAVE-ERROR',
    DAMAGE_PHOTOS: 'COMMON-FORM.DAMAGE-PHOTOS',
    PREVIEW: 'COMMON-FORM.PREVIEW',
    DELETE: 'COMMON-FORM.DELETE',
    CONFIRM_DELETE: 'COMMON-FORM.CONFIRM-DELETE',
    DELETE_SUCCESS: 'COMMON-FORM.DELETE-SUCCESS',
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
    LAST_CARGO_CLEANING_QUOTATION: 'COMMON-FORM.LAST-CARGO-CLEANING-QUOTATION',
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
    CLEANING: 'COMMON-FORM.CLEANING',
    QUOTATION_DATE: 'COMMON-FORM.QUOTATION-DATE',
    CLEANING_COST: 'COMMON-FORM.CLEANING-COST',
    TOTAL_SGD: 'COMMON-FORM.TOTAL-SGD',
    TOTAL:'COMMON-FORM.TOTAL'
  }

 
  type?: string | null;
  cleaningDS: InGateCleaningDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  cleaning_guid?: string | null;
  customer_company_guid?: string | null;
  estimate_no?: string | null;

  totalCost?: number;
  approvedCost?: number;

  customerInfo: any = customerInfo;
  disclaimerNote: string = "";
  pdfTitle: string = "";
  cleaningItem: any;

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
    public dialogRef: MatDialogRef<CleaningEstimatePdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) {
    super();
    this.translateLangText();
    this.cleaningDS = new InGateCleaningDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.cleaning_guid = data.cleaning_guid;
    this.customer_company_guid = data.customer_company_guid;
    this.estimate_no = data.estimate_no;
    this.existingPdf = data.existingPdf;
    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  async ngOnInit() {
    this.pdfTitle = this.translatedLangText.LAST_CARGO_CLEANING_QUOTATION;

    // Await the data fetching
    const [data, pdfData] = await Promise.all([
      this.getCleaningData(),
      Promise.resolve(null)//this.data.retrieveFile ? this.getCleaningEstimatePdf() : Promise.resolve(null)
    ]);

    if (data?.length > 0) {
      this.cleaningItem = data[0];
      console.log(this.cleaningItem);
      await this.getCodeValuesData();
      // this.updateData(this.cleaningItem?.steaming_part?.[0]?.job_order?.steaming_temp);

      this.cdr.detectChanges();

      this.exportToPDF_r2();
      // this.existingPdf = pdfData ?? this.existingPdf;
      // if (!this.existingPdf?.length) {
      //   this.generatePDF();
      // }
    }
    // else {
    //   const eirBlob = await Utility.urlToBlob(this.existingPdf?.[0]?.url);
    //   const pdfUrl = URL.createObjectURL(eirBlob);
    //   this.existingPdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl + '#toolbar=0');
    // }
  }

  async generatePDF(): Promise<void> {
    const bodyElement = document.getElementById('pdf-form-body');

    if (!bodyElement) {
      console.error('Body element not found');
      return;
    }

    try {
      console.log('Start generate', new Date());
      this.generatingPdfLoadingSubject.next(true);
      this.generatingPdfProgress = 0;

      const canvas = await html2canvas(bodyElement, { scale: this.scale });

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
        }

        // Add Footer
        await this.addFooter(pdf, pageWidth, pageHeight, leftRightMargin, bottomMargin, currentPage, totalPages);

        yOffset += chunkHeight;
        currentPage++;
      }

      this.generatingPdfProgress = 100;

      // Save PDF
      pdf.save(`CLEANING_QUOTATION-${this.cleaningItem?.storing_order_tank?.in_gate?.[0]?.eir_no}.pdf`);
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

  getCleaningData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.cleaningDS.getCleaningForEstimatePdf(this.cleaning_guid!).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err),
      });
    });
  }

  getCleaningEstimatePdf(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.fileManagerService.getFileUrlByGroupGuid([this.cleaning_guid!]).subscribe({
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

  async onDownloadClick() {
    if (this.generatedPDF) {
      const fileName = `ESTIMATE-${this.estimate_no}.pdf`; // Define the filename
      // saveAs(this.generatedPDF, fileName);
      // fileSave(this.generatedPDF, {
      //   fileName: fileName,
      //   extensions: ['.pdf'],
      // });
      this.downloadFile(this.generatedPDF, fileName);
    } else if (this.existingPdf?.[0]?.url) {
      const blob = await Utility.urlToBlob(this.existingPdf?.[0]?.url);
      const fileName = `ESTIMATE-${this.estimate_no}.pdf`; // Define the filename
      // saveAs(eirBlob, fileName);
      // fileSave(blob, {
      //   fileName: fileName,
      //   extensions: ['.pdf'],
      // });
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
      
          const reportTitle ='';
      
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
      
          await PDFUtility.addHeaderWithCompanyLogo_Portriat(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
  
          pdf.setLineWidth(0.1);
          pdf.setLineDashPattern([0.001, 0.001], 0);
          
          // pdf.setFontSize(8);
          // pdf.setTextColor(0, 0, 0); // Black text
  
         // const cutoffDate = `${this.translatedLangText.TAKE_IN_DATE}: ${this.displayDate(this.eirDetails?.in_gate?.create_dt)}`; // Replace with your actual cutoff date
          //pdf.text(cutoffDate, pageWidth - rightMargin, lastTableFinalY + 10, { align: "right" });
          //PDFUtility.AddTextAtRightCornerPage(pdf, cutoffDate, pageWidth, leftMargin, rightMargin, lastTableFinalY + 5, 8);
          //PDFUtility.addText(pdf, this.translatedLangText.EQUIPMENT_INTERCHANGE_RECEIPT, lastTableFinalY + 5, leftMargin, 8);
         // const data: any[][] = [];
          var item = this.cleaningItem;
          var data: any[][] = [
            [
              { content: `${this.translatedLangText.TANK_NO}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
              { content: `${item?.storing_order_tank?.tank_no}` },
              { content: `${this.translatedLangText.EIR_NO}` ,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
              { content: `${item?.storing_order_tank?.in_gate?.[0]?.eir_no}` }
            ],
            [
              { content: `${this.translatedLangText.CUSTOMER}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${item?.storing_order_tank?.storing_order?.customer_company?.name}` },
              { content: `${this.translatedLangText.EIR_DATE}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${this.displayDate(item?.storing_order_tank?.in_gate?.[0]?.eir_dt)}` }
            ],
            [
              { content: `${this.translatedLangText.JOB_NO}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${item?.job_no}` },
              { content: `${this.translatedLangText.QUOTATION_DATE}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${this.displayDate(item?.create_dt)}` }
            ],
            [
              { content: `${this.translatedLangText.CARGO_NAME}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${item?.storing_order_tank?.tariff_cleaning?.cargo}` },
              { content: `` },
              { content: `` }
            ]
          ];
      
          autoTable(pdf, {
            body: data,
            startY: startY, // Start table at the current startY value
            theme: 'grid',
            margin: { left: leftMargin },
            styles: {
              cellPadding: { left:1 , right: 1, top: 1, bottom: 1 },
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
          PDFUtility.addReportTitle(pdf,this.pdfTitle,pageWidth,leftMargin,rightMargin,startY,8);
          startY+=4;
          this.createCleaningEstimateDetail(pdf,startY,leftMargin,rightMargin,pageWidth);
         
          var pdfFileName=`CLEANING_QUOTATION-${item?.storing_order_tank?.in_gate?.[0]?.eir_no}`
           this.downloadFile(pdf.output('blob'), pdfFileName)
          // this.generatedPDF = pdf.output('blob');
          // this.uploadPdf(this.repairItem?.guid, this.generatedPDF);
          // this.generatingPdfLoadingSubject.next(false);
           this.dialogRef.close();
        }
    
     
    
    
    
    
        createCleaningEstimateDetail(pdf:jsPDF,startY:number,leftMargin:number,rightMargin:number,pageWidth:number)
        {
          const fontSz=8;
          const vAlign="bottom";
          const headers: RowInput[] = [
          [
            { 
              content: this.translatedLangText.NO_DOT, 
               
              styles: { fontSize: fontSz,halign: 'center', valign: vAlign,fillColor: 220, lineWidth: 0.1,cellPadding: 2 }
            },
            { 
              content: this.translatedLangText.DESCRIPTION,
              
              styles: { fontSize: fontSz, halign: 'center', valign: vAlign,fillColor:220, lineWidth: 0.1,cellPadding: 2  }
            },
             { 
              content: this.translatedLangText.CLEANING_COST,
              
              styles: { fontSize: fontSz, halign: 'center', valign: vAlign,fillColor: 220, lineWidth: 0.1,cellPadding: 2  }
            },
          ]
        ];
    
         var repData:RowInput[]=[];
         var items = [this.cleaningItem];
         const grpFontSz=7;
         this.totalCost=0;
         var index=0;
          items?.forEach((item, index) => {
            repData.push([
              ++index,item?.storing_order_tank?.tariff_cleaning?.cargo,`${this.parse2Decimal(item?.cleaning_cost)}`]);

              this.totalCost+=item?.cleaning_cost;
          });
    
    
         
          autoTable(pdf, {
          head:headers,
          body:repData,
          startY: startY, // Start table at the current startY value
          styles: {
            cellPadding: { left:2 , right: 2, top: 1, bottom: 1 }, // Reduce padding
            fontSize: 7.5,
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
            0: { cellWidth: 10,halign: 'center', valign: 'middle' },
            1: { cellWidth: 152,halign: 'left', valign: 'middle'},
            2: { cellWidth: 30,halign: 'center', valign: 'middle'},
          },
          didDrawPage: (data: any) => {
            startY = data.cursor.y;
          }
          });
          
           var totalSGD=`${this.translatedLangText.TOTAL_SGD}:`;
          var totalCostValue=`${this.parse2Decimal(this.totalCost)}`;
          startY+=2;
           var estData:RowInput[]=[];
           estData.push([
             '',
              { content: `${totalSGD}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${totalCostValue}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
             
           ])
  
  
          autoTable(pdf, {
          body:estData,
          startY: startY, // Start table at the current startY value
          styles: {
            cellPadding: { left:2 , right: 2, top: 1, bottom: 1 }, // Reduce padding
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
            0: { cellWidth: 10,halign: 'center', valign: 'middle' },
            1: { cellWidth: 152,halign: 'left', valign: 'middle'},
            2: { cellWidth: 30,halign: 'center', valign: 'middle'},
          
          },
           didDrawCell: function (data) {
              const doc = data.doc;
              if(data.column.index === 4){
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
  
          // var AppCostLabel=`${this.translatedLangText.APPROVED_COST}:`;
          // var AppCostValue=`${this.parse2Decimal(this.approvedCost)}`;
          // startY+=7;
          // PDFUtility.addText(pdf, AppCostLabel, startY , leftMargin, fontSz,true);
          // PDFUtility.addText(pdf, AppCostValue, startY , leftMargin+28, fontSz);
    
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
      
          const reportTitle ='';
      
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
          var item = this.cleaningItem;
          await PDFUtility.addHeaderWithCompanyLogo_Portriat_r1(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate,item.customer_company);

          startY=54;
          PDFUtility.addReportTitle(pdf,this.pdfTitle,pageWidth,leftMargin,rightMargin,startY,12,false,1);
          startY+=8;
          var data: any[][] = [
            [
              { content: `${this.translatedLangText.TANK_NO}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
              { content: `${item?.storing_order_tank?.tank_no}` },
              { content: `${this.translatedLangText.EIR_NO}` ,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
              { content: `${item?.storing_order_tank?.in_gate?.[0]?.eir_no}` }
            ],
            [
              { content: `${this.translatedLangText.CUSTOMER}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${item?.storing_order_tank?.storing_order?.customer_company?.name}` },
              { content: `${this.translatedLangText.EIR_DATE}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${this.displayDate(item?.storing_order_tank?.in_gate?.[0]?.eir_dt)}` }
            ],
            [
              { content: `${this.translatedLangText.JOB_NO}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${item?.job_no}` },
              { content: `${this.translatedLangText.QUOTATION_DATE}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${this.displayDate(item?.create_dt)}` }
            ]
            // [
            //   { content: `${this.translatedLangText.CARGO_NAME}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
            //   { content: `${item?.storing_order_tank?.tariff_cleaning?.cargo}`,colSpan: 3 }
            // ]
          ];
      
          autoTable(pdf, {
            body: data,
            startY: startY, // Start table at the current startY value
            theme: 'grid',
            margin: { left: leftMargin },
            styles: {
              cellPadding: { left:1 , right: 1, top: 1, bottom: 1 },
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

          startY=lastTableFinalY+15;
          this.createCleaningEstimateDetail_r1(pdf,startY,leftMargin,rightMargin,pageWidth,minHeightHeaderCol);
          startY=pageHeight-25;
          var estTerms ="[Estimate Terms and Conditions / Disclaimer]";
         // PDFUtility.addText(pdf,estTerms,startY,leftMargin,9,true);

          startY+=7;
           pdf.setLineWidth(0.1);
    
          pdf.setLineDashPattern([0.01, 0.01], 0);

          var yPos=startY;
            // 
          pdf.line(leftMargin, yPos, (pageWidth+2-rightMargin ), yPos);
          startY= yPos +4;
          await PDFUtility.ReportFooter_CompanyInfo_portrait_r1(pdf,pageWidth,startY,bottomMargin,leftMargin ,rightMargin,this.translate); // ReportFooter_CompanyInfo_portrait

           var pdfFileName=`CLEANING_QUOTATION-${item?.storing_order_tank?.in_gate?.[0]?.eir_no}`
           this.downloadFile(pdf.output('blob'), pdfFileName)
           this.dialogRef.close(); 
        }


        createCleaningEstimateDetail_r1(pdf:jsPDF,startY:number,leftMargin:number,rightMargin:number,pageWidth:number,minHeightBodyCol:number)
        {

          var rightPadding_cost=9;
          pdf.setLineWidth(0.1);
    // Set dashed line pattern
          pdf.setLineDashPattern([0.01, 0.01], 0.1);

          var yPos=startY;
            // Draw top line
          pdf.line(leftMargin, yPos, (pageWidth+2-rightMargin ), yPos);

          startY+=1;
          const fontSz=8;
          const vAlign="bottom";
          const headers: RowInput[] = [
          [
            { 
              content: this.translatedLangText.NO_DOT, 
               
              styles: { fontSize: fontSz,halign: 'center', valign: vAlign,fillColor: 255, lineWidth: 0.0,cellPadding: 2 }
            },
            { 
              content: this.translatedLangText.DESCRIPTION,
              
              styles: { fontSize: fontSz, halign: 'left', valign: vAlign,fillColor:255, lineWidth: 0.0,cellPadding: 2  }
            },
             { 
              content: this.translatedLangText.CLEANING_COST,
              
              styles: { fontSize: fontSz, halign: 'center', valign: vAlign,fillColor: 255, lineWidth: 0.0,cellPadding: 2  }
            },
          
          ]
        ];
    
         var repData:RowInput[]=[];
         var items = [this.cleaningItem];
         const grpFontSz=7;
         this.totalCost=0;
         var index=0;
          items?.forEach((item, index) => {
            repData.push([
              ++index,item?.storing_order_tank?.tariff_cleaning?.cargo,
              { content:`${this.parse2Decimal(item?.cleaning_cost)}`,              
                 styles: { fontSize: fontSz, halign: 'right', valign: vAlign,cellPadding: { right: rightPadding_cost }  }
              }
            ]);

              this.totalCost+=item?.cleaning_cost;
          });
    
    
         
          autoTable(pdf, {
          head:headers,
          body:repData,
          startY: startY, // Start table at the current startY value
          styles: {
            cellPadding: { left:2 , right: 2, top: 1, bottom: 1 }, // Reduce padding
            lineWidth: 0, // remove all borders initially
             fontSize: fontSz
          },
          theme: 'grid',
          margin: { left: leftMargin },
          headStyles: {
            fillColor: 220,
            textColor: 0,
            fontStyle: 'bold',
            lineWidth: 0.0 // keep outer border for header
          },
          columnStyles: {
            0: { cellWidth: 10,halign: 'center', valign: 'middle' },
            1: { cellWidth: 152,halign: 'left', valign: 'middle'},
            2: { cellWidth: 30,halign: 'right', valign: 'middle'},
          },
          didDrawPage: (data: any) => {
            startY = data.cursor.y;
          }
          });
          
          yPos = startY+5;
          pdf.setLineWidth(0.1);
    // Set dashed line pattern
          pdf.setLineDashPattern([0.01, 0.01], 0.1);

            // Draw top line
          pdf.line(leftMargin, yPos, (pageWidth+2-rightMargin ), yPos);

          var sysCurrencyCode=Utility.GetSystemCurrencyCode();
          var totalSGD=`${this.translatedLangText.TOTAL} (${sysCurrencyCode}):`;
          var totalCostValue=`${this.parse2Decimal(this.totalCost)}`;
          var amtWords = Utility.convertToWords(this.totalCost);
          var custCurrencyCode = this.cleaningItem?.customer_company?.currency?.currency_code;
          

          startY=yPos+2;
           var estData:RowInput[]=[];
          //  estData.push([
          //     { content: `${amtWords}`,  colSpan: 3,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: 10, textColor: '#000000'} },
             
          //  ])
           estData.push([
             '',
              { content: `${totalSGD}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz+1,cellPadding: { top: 1 }}},
              { content: `${totalCostValue}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz, cellPadding: { top:1,right: rightPadding_cost } } },
             
           ])

           if(sysCurrencyCode!=custCurrencyCode){
             var totalForeign=`${this.translatedLangText.TOTAL} (${custCurrencyCode}):`;
             var rate =this.cleaningItem?.customer_company?.currency?.rate;
             var convertedCost =  `${this.parse2Decimal(this.totalCost*rate)}`;
             estData.push([
             '',
              { content: `${totalForeign}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz+1,cellPadding: { top: 1 }}},
              { content: `${convertedCost}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz, cellPadding: { top: 1,right: rightPadding_cost } } },
             
           ])
           }
  
  //cellPadding: { top: 5 }
          autoTable(pdf, {
          body:estData,
          startY: startY, // Start table at the current startY value
          styles: {
            cellPadding: { left:2 , right: 5, top: 1, bottom: 0 }, // Reduce padding
            lineWidth: 0, // remove all borders initially
          },
          theme: 'grid',
          margin: { left: leftMargin },
          columnStyles: {
            0: { cellWidth: 10,halign: 'center', valign: 'middle' },
            1: { cellWidth: 155,halign: 'left', valign: 'middle'},
            2: { cellWidth: 27,halign: 'center', valign: 'middle'},
          
          },
           didDrawCell: function (data) {
              const doc = data.doc;
              
              //  if(data.row.index === 0){
              // doc.setLineWidth(0.3);
              // doc.setDrawColor(0, 0, 0); // Set line color to black
              //   doc.line(
              //   data.cell.x,
              //   data.cell.y + data.cell.height-1,
              //   data.cell.x + data.cell.width,
              //   data.cell.y + data.cell.height-1
              // );
              // }
           },
          didDrawPage: (data: any) => {
          
            startY = data.cursor.y;
          
          }
          });
  
       

         
       
    
        }
}
