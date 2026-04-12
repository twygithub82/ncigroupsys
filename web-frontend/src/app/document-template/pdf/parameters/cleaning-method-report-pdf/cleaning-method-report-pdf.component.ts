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
import { PackageBufferItem } from 'app/data-sources/package-buffer';
import { CleaningMethodItem } from 'app/data-sources/cleaning-method';

// import { fileSave } from 'browser-fs-access';

export interface DialogData {
  repData: CleaningMethodItem[],
  date: string
}

@Component({
  selector: 'app-cleaning-method-report-pdf',
  templateUrl: './cleaning-method-report-pdf.component.html',
  styleUrls: ['./cleaning-method-report-pdf.component.scss'],
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
export class CleaningMethodPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  translatedLangText: any = {};
  langText = {
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
    DELETE: 'COMMON-FORM.DELETE',
    TO_BE_CANCELED: 'COMMON-FORM.TO-BE-CANCELED',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    SEARCH: "COMMON-FORM.SEARCH",
    CATEGORY_NAME: "COMMON-FORM.CATEGORY-NAME",
    CATEGORY_DESCRIPTION: "COMMON-FORM.CATEGORY-DESCRIPTION",
    CATEGORY_COST: "COMMON-FORM.CARGO-COST",
    NEW: 'COMMON-FORM.NEW',
    REFRESH: 'COMMON-FORM.REFRESH',
    EXPORT: 'COMMON-FORM.EXPORT',
    MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    LAST_UPDATED: 'COMMON-FORM.LAST-UPDATED',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    CLEANING_METHOD: 'COMMON-FORM.PROCESS-NAME',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    METHOD_NAME: "COMMON-FORM.METHOD-NAME",
    PROCESS_NAME: "COMMON-FORM.PROCESS-NAME",
    PROCESS_DESCRIPTION: "COMMON-FORM.DESCRIPTION",
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    PROCESS_DESCRIPTION_SELECTED: 'COMMON-FORM.SELECTED',
    PROCESS_NAME_SELECTED: 'COMMON-FORM.SELECTED',
    S_N: 'COMMON-FORM.S_N',
    CLEANING_PROCESS:'COMMON-FORM.CLEANING-PROCESS',
    CATEGORY:'COMMON-FORM.CATEGORY',
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
  repData:CleaningMethodItem[]=[];
  constructor(
    public dialogRef: MatDialogRef<CleaningMethodPdfComponent>,
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
    this.repData = data.repData;
    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  async ngOnInit() {
    this.pdfTitle = this.translatedLangText.RESIDUE_DISPOSAL_ESTIMATE;

    // Await the data fetching
    // // const [data, pdfData] = await Promise.all([
    // //   this.getResidueData(),
    // //   // this.data.retrieveFile ? this.getSteamPdf() : Promise.resolve(null)
    // //   Promise.resolve(null)
    // // ]);
    // if (data?.length > 0) {
    //   this.residueItem = data[0];
    //   this.estimate_no = this.residueItem?.estimate_no;
    //   await this.getCodeValuesData();
    //   console.log(this.residueItem)
    //   // this.updateData(this.residueItem?.residue_part);

    //   this.cdr.detectChanges();
    // }

    this.generatePDF();
  }

  async generatePDF(): Promise<void> {
    this.exportToPDF_r1();
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
     let bufferTableWidth=8;
     let tableWidth=pageWidth-leftMargin-rightMargin-bufferTableWidth;
     let minHeightHeaderCol = 3;
     let minHeightBodyCell = 5;
     let fontSz_hdr = PDFUtility.TableHeaderFontSize_Portrait();
     let fontSz_body= PDFUtility.ContentFontSize_Portrait()
 
     var items = this.repData!;
     var index = 1;
     const data: any[][] = items
         .map((item) => {
          
           const row = [
             index++, // increment index for each item
             item.name || "-",
             item.description || "-",
            item.cleaning_category?.description || "-",
            this.displayLastUpdated(item) || "-"
           ];
 
           return row;
         })
     .filter((row): row is any[] => row !== null);
 
     const pagePositions: { page: number; x: number; y: number }[] = [];
     // const progressValue = 100 / cardElements.length;
     var sysCurrencyCode = Utility.GetSystemCurrencyCode();
     const reportTitle = this.GetReportTitle();
     const headers = [[
       this.translatedLangText.S_N,
      this.translatedLangText.PROCESS_NAME,
      this.translatedLangText.DESCRIPTION,
      this.translatedLangText.CATEGORY,
      this.translatedLangText.LAST_UPDATED
       
     ]];
 
     const comStyles: any = {
       0: { cellWidth: 12,valign: 'middle', halign: 'center' },    // "S_N."
       1: { cellWidth: 50 ,valign: 'middle', halign: 'center'},   // "PROCESS_NAME"
       2: {  valign: 'middle', halign: 'center' },  // "DESCRIPTION"
       3: { cellWidth: 40, valign: 'middle', halign: 'center' },  // "CATEGORY"
       4: { cellWidth: 30, valign: 'middle', halign: 'center' },   // "LAST_UPDATED "
     };
 
     // Define headStyles with valid fontStyle
     const headStyles: Partial<Styles> = {
      fillColor: [211, 211, 211], // Background color
      textColor: 0, // Text color (white)
      fontStyle: "bold", // Valid fontStyle value
      fontSize:fontSz_hdr,
      halign: 'center', // Centering header text
      valign: 'middle',
      lineColor: 201,
      lineWidth: 0.1
    };
 
     let currentY = topMargin;
     let scale = this.scale;
     pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });
 
 
     // await Utility.addHeaderWithCompanyLogo_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
     // await Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 35);
 
     // Variable to store the final Y position of the last table
     let lastTableFinalY = 40;
 
     let startY = lastTableFinalY ; // Start table 20mm below the customer name
 
     pdf.setFontSize(8);
     pdf.setTextColor(0, 0, 0); // Black text
     // const cutoffDate = PDFUtility.FormatColon(this.translatedLangText.CLEANING_PERIOD, this.date); // Replace with your actual cutoff date
     const cutoffDate ='';
      const subtitlePos=0;
     startY = await PDFUtility.addHeaderWithCompanyLogoWithTitleSubTitle_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, 
     this.translate, reportTitle, cutoffDate,subtitlePos);
     startY += PDFUtility.GapBetweenSubTitleAndTable_Portrait();
    
 
       autoTable(pdf, {
         head: headers,
         body: data,
         //startY: startY, // Start table at the current startY value
         theme: 'grid',
         margin: { top:startY, horizontal: leftMargin},
         tableWidth: contentWidth,
         styles: {
           fontSize: fontSz_body,
           minCellHeight: minHeightHeaderCol
 
         },
         
         columnStyles: comStyles,
         headStyles: headStyles, // Custom header styles
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
               
                PDFUtility.addReportTitle_Portrait(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
             }
           }
         },
       });
 
       await PDFUtility.addFooterWithPageNumberAndCompanyLogo_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, 
       rightMargin, this.translate,pagePositions);
     // const totalPages = pdf.getNumberOfPages();
 
     
    
 
     this.generatingPdfProgress = 100;
     //pdf.save(fileName);
     this.generatingPdfProgress = 0;
     this.generatingPdfLoadingSubject.next(false);
     Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
     this.dialogRef.close();
   }

  GetReportTitle(): string {
    var title: string = '';
     title = `${this.translatedLangText.CLEANING_PROCESS}`;
    return `${title}`
  }
  displayLastUpdated(r: any) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    return this.displayDate(updatedt);

  }


 

  getReportTitle() {
    return this.translatedLangText.RESIDUE_CARGO_DISPOSAL;
  }

 

 
  getPdfFileName(): string {
    var fileName = `${this.residueItem.storing_order_tank.tank_no} (${this.estimate_no!}).pdf`;

    return fileName;
  }
}
