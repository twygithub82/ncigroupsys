import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output,ElementRef,ViewChild } from '@angular/core';
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
import {SteamDS} from 'app/data-sources/steam';
import { SteamPartDS, SteamPartItem } from 'app/data-sources/steam-part';
import { TANK_STATUS_IN_YARD, TANK_STATUS_POST_IN_YARD,ESTIMATE_APPROVED_STATUS, Utility } from 'app/utilities/utility';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';

// import { fileSave } from 'browser-fs-access';

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
  packageLabourCost:number;
}

@Component({
  selector: 'app-steam-estimate-pdf',
  templateUrl: './steam-estimate-pdf.component.html',
  styleUrls: ['./steam-estimate-pdf.component.scss'],
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
export class SteamEstimatePdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    RESIDUE_ESTIMATE:'COMMON-FORM.RESIDUE-ESTIMATE',
    HOUR:'COMMON-FORM.HOUR',
    LABOUR_COST:'COMMON-FORM.LABOUR-COST',
    STEAM_ESTIMATE:'COMMON-FORM.STEAM-ESTIMATE',
    STEAM_CARGO:'COMMON-FORM.STEAM-CARGO',
    TOTAL:'COMMON-FORM.TOTAL',
    APPROVED:'COMMON-FORM.APPROVED',
    TOTAL_COST:'COMMON-FORM.TOTAL-COST',
    FLAT_RATE:'COMMON-FORM.FLAT-RATE',
    HOUR_RATE:'COMMON-FORM.HOUR-RATE',
    STEAMING_QUOTATION:'COMMON-FORM.STEAMING-QUOTATION',
    QUOTATION_DATE: 'COMMON-FORM.QUOTATION-DATE',
    //DEGREE_CELSIUS_SYMBOL:'COMMON-FORM.DEGREE-CELSIUS-SYMBOL',
    
    
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

  repairCost?: RepairCostTableItem;
  steamPartList?: any[] = [];
  yesnoCvList: CodeValuesItem[] = [];
  soTankStatusCvList: CodeValuesItem[] = [];
  totalCost?: number;
  approvedCost?: number;

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
  packageLabourCost:number=0;
  total_hours:number=0;
  total_approvedLabour:number=0;
  total_labour:number=0;
   isAutoApproveSteam:boolean=false;
   isEstimateApproved:boolean=false;
  flashPoint :string='';
  constructor(
    public dialogRef: MatDialogRef<SteamEstimatePdfComponent>,
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
    this.customer_company_guid = data.customer_company_guid;
    this.packageLabourCost=data.packageLabourCost;
    this.estimate_no = data.estimate_no;
    this.existingPdf = data.existingPdf;
    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  async ngOnInit() {
    this.pdfTitle = this.translatedLangText.STEAMING_QUOTATION;

    // Await the data fetching
    const [data, pdfData] = await Promise.all([
      this.getSteamData(),
      // this.data.retrieveFile ? this.getSteamPdf() : Promise.resolve(null)
      Promise.resolve(null)
    ]);
     if (data?.length > 0) {
      
      data[0].steaming_part = data[0].steaming_part.filter((data: any) => !data.delete_dt);
       this.steamItem = data[0];
       await this.getCodeValuesData();
       console.log(this.steamItem)
       this.updateData(this.steamItem?.steaming_part);

       this.cdr.detectChanges();
     }

    
      this.generatePDF();
   
  }

  async generatePDF(): Promise<void> {
   // this.exportToPDF_r1();
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

  
  updateData(newData: SteamPartItem[] | undefined): void {

    
    if (newData?.length) {
      this.steamPartList = newData.map((row, index) => ({
        ...row,
        index: index,
        qty:(ESTIMATE_APPROVED_STATUS.includes(this.steamItem.status_cv) )?row.approve_qty:row.quantity
      }));

      if(BusinessLogicUtil.isAutoApproveSteaming(this.steamItem)){
        
      }
      else
      {
        this.totalCost = this.steamPartList.reduce((sum, row) => sum + ( (row.cost || 0) * (row.quantity || 0)), 0);
        this.approvedCost = this.steamPartList.reduce((sum, row) => sum + ( (row.approve_part)?(row.approve_cost || 0) * (row.approve_qty || 0):0), 0);
        
        this.total_approvedLabour=this.steamPartList.reduce((sum, row) => sum + ( (row.approve_part)?(row.approve_labour || 0):0), 0);
        this.total_labour=this.steamPartList.reduce((sum, row) => sum + ( (row.labour)?(row.labour || 0):0), 0);
        //this.total_hours=this.steamPartList.reduce((sum, row) => sum + ( (row.approve_part)?(row.approve_labour || 0):0), 0);
      }
      console.log(this.steamPartList);
    } else {
      this.steamPartList = [];
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
    const fileName = `RESIDUE_DISPOSAL-${this.estimate_no}.pdf`; // Define the filename
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
        
        
        //pdf.setLineWidth(0.1);
        // pdf.setFontSize(8);
        // pdf.setTextColor(0, 0, 0); // Black text

       // const cutoffDate = `${this.translatedLangText.TAKE_IN_DATE}: ${this.displayDate(this.eirDetails?.in_gate?.create_dt)}`; // Replace with your actual cutoff date
        //pdf.text(cutoffDate, pageWidth - rightMargin, lastTableFinalY + 10, { align: "right" });
        //PDFUtility.AddTextAtRightCornerPage(pdf, cutoffDate, pageWidth, leftMargin, rightMargin, lastTableFinalY + 5, 8);
        //PDFUtility.addText(pdf, this.translatedLangText.EQUIPMENT_INTERCHANGE_RECEIPT, lastTableFinalY + 5, leftMargin, 8);
       // const data: any[][] = [];
        var item = this.steamItem;
        var data: any[][] = [
          [
            { content: `${this.translatedLangText.TANK_NO}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
            { content: `${item?.storing_order_tank?.tank_no}` },
            { content: `${this.translatedLangText.ESTIMATE_NO}` ,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
            { content: `${this.estimate_no}` }
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
            { content: `${this.translatedLangText.ESTIMATE_NO}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
            { content: `${item?.estimate_no}` }
          ],
          [
            { content: `${this.translatedLangText.CARGO_NAME}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
            { content: `${item?.storing_order_tank?.tariff_cleaning?.cargo||''}` },
            { content: `${this.translatedLangText.ESTIMATE_DATE}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
            { content: `${this.displayDate(item?.create_dt)}` }
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
        this.createSteamEstimateDetail(pdf,startY,leftMargin,rightMargin,pageWidth);
        // PDFUtility.addReportTitle(pdf,this.pdfTitle,pageWidth,leftMargin,rightMargin,startY,9);
        // startY+=3;
        // this.createOffhireEstimate(pdf,startY,leftMargin,rightMargin,pageWidth);
        //  startY+=52;
        // this.createRepairEstimateDetail(pdf,startY,leftMargin,rightMargin,pageWidth);
        // this.createSummaryTable(pdf,leftMargin,rightMargin,pageWidth,pageHeight);
         this.downloadFile(pdf.output('blob'), this.getReportTitle())
        // this.generatedPDF = pdf.output('blob');
        // this.uploadPdf(this.repairItem?.guid, this.generatedPDF);
        // this.generatingPdfLoadingSubject.next(false);
         this.dialogRef.close();
      }
  
      createSteamEstimateDetail(pdf:jsPDF,startY:number,leftMargin:number,rightMargin:number,pageWidth:number)
      {
        const fontSz=7.5;
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
            content: this.translatedLangText.HOUR,
            
            styles: { fontSize: fontSz, halign: 'center', valign: vAlign,fillColor: 220, lineWidth: 0.1,cellPadding: 2  }
          },
           { 
            content: this.translatedLangText.QTY,
            
            styles: { fontSize: fontSz, halign: 'center', valign: vAlign,fillColor: 220, lineWidth: 0.1,cellPadding: 2  }
          },
           { 
            content: this.translatedLangText.PRICE,
            
            styles: { fontSize: fontSz, halign: 'center', valign: vAlign,fillColor:220, lineWidth: 0.1,cellPadding: 2  }
          },
           { 
            content: this.translatedLangText.ESTIMATE_COST,
            
            styles: { fontSize: fontSz, halign: 'center', valign: vAlign,fillColor: 220, lineWidth: 0.1,cellPadding: 2  }
          },
           { 
            content: this.translatedLangText.APPROVED_COST,
            
            styles: { fontSize: fontSz, halign: 'center', valign: vAlign,fillColor: 220, lineWidth: 0.1,cellPadding: 2  }
          },
           { 
            content: '',
            
            styles: { fontSize: fontSz, halign: 'center', valign: vAlign,fillColor: 220, lineWidth: 0.1,cellPadding: 2  }
          }
        
        ]
      ];
  
       var repData:RowInput[]=[];
       var items = this.steamPartList;
       const grpFontSz=7;
        items?.forEach((item, index) => {
          item.approve_cost = item.approve_part?item.cost:0;
          var app = item.approve_part?"O":"X";
          repData.push([
            item.index + 1,item.description,`${item.labour}`,`${item.quantity}`, this.parse2Decimal(item.cost),
            this.parse2Decimal(item.quantity * item.cost),this.parse2Decimal( item.approve_cost),app
          ]);
        });
  
  
       
        autoTable(pdf, {
        head:headers,
        body:repData,
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
          1: { cellWidth: 70,halign: 'left', valign: 'middle'},
          2: { cellWidth: 15,halign: 'center', valign: 'middle'},
          3: { cellWidth: 15,halign: 'center', valign: 'middle'},
          4: { cellWidth: 24,halign: 'right', valign: 'middle'},
          5: { cellWidth: 24,halign: 'right', valign: 'middle'},
          6: { cellWidth: 24,halign: 'right', valign: 'middle'},
          7: { cellWidth: 10,halign: 'center', valign: 'middle'},
        },
        didDrawPage: (data: any) => {
          startY = data.cursor.y;
        }
        });
        
        var totalLabourCostLabel=`${this.translatedLangText.LABOUR_COST}:`;
        var totalLabourCostValue=this.packageLabourCost*this.total_hours;
        var totalHour=`${this.translatedLangText.LABOUR}($${this.packageLabourCost}):`
         var totalSGD=`${this.translatedLangText.TOTAL_SGD}:`;
        var totalCostValue=`${this.parse2Decimal(this.totalCost)}`;
        startY+=2;
         var estData:RowInput[]=[];
         estData.push([
           '',
           { content: `${totalHour}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
            { content: `${this.total_hours}`,styles: { halign: 'center', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
            '',//{ content: `${totalSGD}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
            '',//{ content: `${totalCostValue}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
           { content: `${totalLabourCostLabel}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
            { content: `${this.parse2Decimal(totalLabourCostValue)}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
           ''
         ])
          estData.push([
           '',
          '',
            '',
            '',//{ content: `${totalSGD}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
            '',//{ content: `${totalCostValue}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
           { content: `${totalSGD}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
            { content: `${this.parse2Decimal(totalLabourCostValue+(this.totalCost||0))}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz} },
           ''
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
          1: { cellWidth: 70,halign: 'left', valign: 'middle'},
          2: { cellWidth: 15,halign: 'center', valign: 'middle'},
          3: { cellWidth: 15,halign: 'center', valign: 'middle'},
          4: { cellWidth: 24,halign: 'right', valign: 'middle'},
          5: { cellWidth: 24,halign: 'right', valign: 'middle'},
          6: { cellWidth: 24,halign: 'right', valign: 'middle'},
          7: { cellWidth: 10,halign: 'center', valign: 'middle'},
        },
         didDrawCell: function (data) {
            const doc = data.doc;
            if(data.column.index === 6){
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
  
  
      
  
  
      getReportTitle()
      {
        return this.translatedLangText.STEAMING_QUOTATION;
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
          var item = this.steamItem;
          this.flashPoint = `${item.storing_order_tank?.tariff_cleaning?.flash_point} ${this.translatedLangText.DEGREE_CELSIUS_SYMBOL}`;
          var cc= item.storing_order_tank?.storing_order?.customer_company;
          await PDFUtility.addHeaderWithCompanyLogo_Portriat_r1(pdf, pageWidth, topMargin-5, bottomMargin, leftMargin, rightMargin, this.translate,cc);

          startY=43;
          PDFUtility.addReportTitle(pdf,this.pdfTitle,pageWidth,leftMargin,rightMargin,startY,12,false,1
            ,'#000000',false);
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
              { content: `${this.translatedLangText.ESTIMATE_NO}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${item?.estimate_no}` }
            ],
            [
              { content: `${this.translatedLangText.CARGO_NAME}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${item?.storing_order_tank?.tariff_cleaning?.cargo}` },
              { content: `${this.translatedLangText.QUOTATION_DATE}`,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}  },
              { content: `${this.displayDate(item?.create_dt)}` }
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
                  Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin);
                }
              }
            },
          });


          startY=lastTableFinalY+15;
          this.isAutoApproveSteam = BusinessLogicUtil.isAutoApproveSteaming(item);
          this.isEstimateApproved = BusinessLogicUtil.isEstimateApproved(item);
          if(this.isAutoApproveSteam){
            this.createSteamEstimateDetail_steam_r1(pdf,startY,leftMargin,rightMargin,pageWidth);
          }
          else
          {
            this.createSteamEstimateDetail_repair_r1(pdf,startY,leftMargin,rightMargin,pageWidth);
          }
          startY=pageHeight-25;
          // var estTerms ="[Estimate Terms and Conditions / Disclaimer]";
          // PDFUtility.addText(pdf,estTerms,startY,leftMargin,9,true);

            startY+=7;
            pdf.setLineWidth(0.1);

            pdf.setLineDashPattern([0.01, 0.01], 0);

          var yPos=startY;
          //   // 
          pdf.line(leftMargin, yPos, (pageWidth+2-rightMargin ), yPos);
          startY= yPos +4;
          await PDFUtility.ReportFooter_CompanyInfo_portrait_r1(pdf,pageWidth,startY,bottomMargin,leftMargin ,rightMargin,this.translate); // ReportFooter_CompanyInfo_portrait

            //var pdfFileName=`CLEANING_QUOTATION-${item?.storing_order_tank?.in_gate?.[0]?.eir_no}`
          this.downloadFile(pdf.output('blob'), this.getReportTitle())
            this.dialogRef.close(); 
        }

      
          createSteamEstimateDetail_repair_r1(pdf:jsPDF,startY:number,leftMargin:number,rightMargin:number,pageWidth:number)
          {
            var rightPadding_cost=4;
            const fontSz=8;
            const vAlign="bottom";
            
            const headers: RowInput[] = [
            [
              { 
                content: this.translatedLangText.NO_DOT, 
                
                styles: { fontSize: fontSz,halign: 'center', valign: vAlign,cellPadding: 2 }
              },
              { 
                content: this.translatedLangText.DESCRIPTION,
                
                styles: { fontSize: fontSz, halign: 'left', valign: vAlign,cellPadding: 2  }
              },
              { 
                  content: this.translatedLangText.HOUR,
                  styles: { fontSize: fontSz, halign: 'center', valign: vAlign,cellPadding: 2  }
              },
              // { 
              //   content: this.translatedLangText.QTY,
                
              //   styles: { fontSize: fontSz, halign: 'center', valign: vAlign,cellPadding: 2  }
              // },
              { 
                content: this.translatedLangText.PRICE,
                
                styles: { fontSize: fontSz, halign: 'right', valign: vAlign,cellPadding: 2  }
              },
              { 
                content: this.translatedLangText.TOTAL_COST,
                
                styles: { fontSize: fontSz, halign: 'right', valign: vAlign,cellPadding: 2  }
              },
              //  { 
              //   content: this.translatedLangText.APPROVED,
                
              //   styles: { fontSize: fontSz, halign: 'center', valign: vAlign,cellPadding: 2  }
              // }
            
            ]
          ];

            var repData:RowInput[]=[];
            var items = this.steamPartList;
            var index=1;
            const grpFontSz=7;
            var estTotalLbr =0;
            var estTotalCost=0;
            items?.forEach((item, index) => {
              
              item.approve_part=item.approve_part??true;
               if(!item.approve_part) return;

                var qty = (this.isEstimateApproved?item.approve_qty:item.quantity);
                var cost = (this.isEstimateApproved?item.approve_cost:item.cost);
                var labour = this.isEstimateApproved?item.approve_labour:item.labour;
                var totalCost = item.approve_part?(qty*cost):'-';
                
                if(item.approve_part)
                {
                  estTotalLbr+=Number(labour);
                  estTotalCost+=Number(totalCost);
                }
                //item.approve_cost = item.approve_part?item.cost:0;
                var app = ((item.approve_part===null)||item.approve_part)?"O":"X";
                repData.push([
                  item.index + 1,item.description,`${ this.parse2Decimal(labour)}`,
                  // `${qty}`, 
                  this.parse2Decimal(cost),
                   { 
                    content: this.parse2Decimal( totalCost),
                    styles: { fontSize: fontSz, halign: 'right', valign: "middle", cellPadding:{right:rightPadding_cost}  }
                  }
                  // ,app
                ]);
            });
      
      
             const comStyles: any = {
               0: { cellWidth: 11,halign: 'center', valign: 'middle' },
                1: { cellWidth:111,halign: 'left', valign: 'middle'},
                2: { cellWidth: 15,halign: 'center', valign: 'middle'},
                // 3: { cellWidth: 15,halign: 'center', valign: 'middle'},
                3: { cellWidth: 30,halign: 'right', valign: 'middle'},
                4: { halign: 'right', valign: 'middle'},
                // 5: { halign: 'center', valign: 'middle'},
          };
      

            var tableWidth = pageWidth-rightMargin-leftMargin;
            autoTable(pdf, {
            head:headers,
            body:repData,
            startY: startY, // Start table at the current startY value
            tableWidth: tableWidth,
            styles: {
              cellPadding: { left:2 , right: 2, top: 1, bottom: 1 }, // Reduce padding
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
                
                  if(data.row.index === 0 && data.column.index === 0 && data.section==="head"){
                doc.setLineWidth(0.3);
                doc.setDrawColor(0, 0, 0); // Set line color to black
                  doc.line(
                  data.cell.x,
                  data.cell.y - 2,
                  pageWidth-rightMargin,
                  data.cell.y - 2
                );
                }
              },
            didDrawPage: (data: any) => {
              startY = data.cursor.y;
            }
            });
            
              var  yPos = startY+5;
              pdf.setLineWidth(0.1);
        // Set dashed line pattern
              pdf.setLineDashPattern([0.01, 0.01], 0);
    
                // Draw top line
            //  pdf.line(leftMargin, yPos, (pageWidth+2-rightMargin ), yPos);
    
    
            var sysCurrencyCode=Utility.GetSystemCurrencyCode();
              var totalSGD=`${this.translatedLangText.TOTAL} (${sysCurrencyCode}):`;
             // var totalCostValue=`${this.parse2Decimal(this.totalCost)}`;
                var AppCostValue=(this.approvedCost===0?'':`${this.parse2Decimal(this.approvedCost)}`);
              //var amtWords = Utility.convertToWords(this.totalCost!);
              var amtWords = (ESTIMATE_APPROVED_STATUS.includes(this.steamItem.status_cv))?Utility.convertToWords(this.approvedCost!): Utility.convertToWords(this.totalCost!);
                var cc= this.steamItem.storing_order_tank?.storing_order?.customer_company;
              var custCurrencyCode = cc?.currency?.currency_code;
    
            //  var totalSGD=`${this.translatedLangText.TOTAL_SGD}:`;
            // var totalCostValue=`${this.parse2Decimal(this.totalCost)}`;
            startY+=3;
              var estData:RowInput[]=[];
              // estData.push([
              //     { content: `${amtWords}`,  colSpan: 6,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: 10, textColor: '#000000'} },
                  
              //   ])

               var LabourLbl = `${this.translatedLangText.LABOUR} (${sysCurrencyCode}):`;
               var estTotalLbrCost=estTotalLbr*this.packageLabourCost;
               //var totallabour= this.
               estData.push([
                  '',{ content: `${LabourLbl}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz+1}},
                  { content: `${this.parse2Decimal(estTotalLbr)}`,styles: { halign: 'center', valign: 'middle',fontStyle: 'bold',fontSize: fontSz}},
                  { content: `${this.parse2Decimal(this.packageLabourCost)}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz, cellPadding:{right:rightPadding_cost}}},
                  { content: `${this.parse2Decimal(estTotalLbrCost)}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz, cellPadding:{right:rightPadding_cost} }}
                 ]);

                  var  totalCostValue=estTotalLbrCost+estTotalCost;
    
    
              if(sysCurrencyCode!=custCurrencyCode){
                  var totalForeign=`${this.translatedLangText.TOTAL} (${custCurrencyCode}):`;
                // var cc= this.steamItem.storing_order_tank?.storing_order?.customer_company;
                  var rate =cc.currency?.rate;
                  var convertedCost =  `${this.parse2Decimal((totalCostValue||0)*rate)}`;
                  var convertedapprovedCost =  (this.approvedCost===0?'':`${this.parse2Decimal((this.approvedCost||0)*rate)}`);
                  
                  // estData[0]=[{ content: `${amtWords}`,  colSpan: 6,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: 10, textColor: '#000000'} }];
                 

                  estData.push([
                  '','','',
                  { content: `${totalForeign}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz+1 }},
                  { content: `${convertedCost}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz, cellPadding:{right:rightPadding_cost} } },
                  
                  ]);
                }
                else
                {
                    
                    estData.push([
                      '','','',
                      { content: `${totalSGD}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz+1}  },
                      { content: `${this.parse2Decimal(totalCostValue)}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz, cellPadding:{right:rightPadding_cost} } },
                      
                    ]);
                }
            autoTable(pdf, {
            body:estData,
            startY: startY, // Start table at the current startY value
            tableWidth: tableWidth,
            styles: {
              cellPadding: { left:2 , right: 2, top: 1, bottom: 0 }, // Reduce padding
              fontSize: 7.5,
              lineWidth: 0 // remove all borders initially
            },
            theme: 'grid',
            margin: { left: leftMargin },
            columnStyles: comStyles,
              didDrawCell: function (data) {
                const doc = data.doc;
                
                if(data.row.index === 0 && data.column.index === 0 && data.section==="body"){
                    doc.setLineWidth(0.3);
                    doc.setDrawColor(0, 0, 0); // Set line color to black
                      doc.line(
                      data.cell.x,
                      data.cell.y -1,
                      pageWidth-rightMargin,
                      data.cell.y -1
                    );
    
                    
                }
              },
            didDrawPage: (data: any) => {
            
              startY = data.cursor.y;
            
            }
            });
      
          }


           createSteamEstimateDetail_steam_r1(pdf:jsPDF,startY:number,leftMargin:number,rightMargin:number,pageWidth:number)
          {
            var rightPadding_cost=7;
            const fontSz=8;
            const vAlign="bottom";
            const tableWidth = pageWidth-rightMargin-leftMargin;
            const isFlat = this.steamItem.flat_rate ?? true;
            const headers: RowInput[] = [
            [
              { 
                content: this.translatedLangText.NO_DOT, 
                
                styles: { fontSize: fontSz,halign: 'center', valign: vAlign,cellPadding: 2 }
              },
              { 
                content: this.translatedLangText.DESCRIPTION,
                
                styles: { fontSize: fontSz, halign: 'left', valign: vAlign,cellPadding: 2  }
              },
              // { 
              //     content: this.translatedLangText.HOUR,
              //     styles: { fontSize: fontSz, halign: 'center', valign: vAlign,cellPadding: 2  }
              // },
              { 
                content: this.translatedLangText.REQUIRED_TEMP,
                
                styles: { fontSize: fontSz, halign: 'center', valign: vAlign,cellPadding: 2  }
              },
              { 
                content: (isFlat?this.translatedLangText.FLAT_RATE:this.translatedLangText.HOUR_RATE),
                
                styles: { fontSize: fontSz, halign: 'right', valign: vAlign,cellPadding: 2  }
              },
              { 
                content: this.translatedLangText.TOTAL_COST,
                
                styles: { fontSize: fontSz, halign: 'right', valign: vAlign,cellPadding: 2  }
              },
              //  { 
              //   content: this.translatedLangText.APPROVED,
                
              //   styles: { fontSize: fontSz, halign: 'center', valign: vAlign,cellPadding: 2  }
              // }
            
            ]
          ];

            var repData:RowInput[]=[];
            var items = this.steamPartList;
            var index=1;
            const grpFontSz=7;
            var estTotalLbr =0;
            var estTotalCost=0;
            items?.forEach((item, index) => {
                 item.approve_part=item.approve_part??true;
                if(!item.approve_part)return;
                var qty = "-";
                var cost = this.steamItem.rate;
                var labour = this.isEstimateApproved?this.steamItem.total_hour:this.steamItem.est_hour;
                var totalCost = isFlat?cost:(item.approve_part?(labour*cost):'-');
                
                if(item.approve_part)
                {
                  //estTotalLbr+=Number(labour);
                  estTotalCost+=Number(totalCost);
                }
                //item.approve_cost = item.approve_part?item.cost:0;
                var app = ((item.approve_part===null)||item.approve_part)?"O":"X";
                repData.push([
                  item.index + 1,item.description,this.flashPoint,
                  // `${ isFlat?"-":this.parse2Decimal(labour)}`,
                  // `${qty}`,
                   { 
                    content: this.parse2Decimal( cost),
                    styles: { fontSize: fontSz, halign: 'right', valign: 'middle',
                    cellPadding: { right: rightPadding_cost }}
                  },
                  { 
                    content: this.parse2Decimal( totalCost),
                    styles: { fontSize: fontSz, halign: 'right', valign: 'middle',
                    cellPadding: { right: rightPadding_cost }}
                  }
                  ,app
                ]);
            });
      
              const comStyles: any = {
               0: { cellWidth: 11,halign: 'center', valign: 'middle' },
                1: { cellWidth:101,halign: 'left', valign: 'middle'},
                2: { cellWidth: 28,halign: 'center', valign: 'middle'},
                // 3: { cellWidth: 15,halign: 'center', valign: 'middle'},
                3: { cellWidth: 27,halign: 'right', valign: 'middle'},
                4: { halign: 'right', valign: 'middle'},
                // 5: { halign: 'center', valign: 'middle'},
          };
          //   const comStyles: any = {
          //       0: { cellWidth: 11,halign: 'center', valign: 'middle' },
          //       1: { cellWidth: 113,halign: 'left', valign: 'middle'},
          //       //2: { cellWidth: 15,halign: 'center', valign: 'middle'},
          //       2: { cellWidth: 20,halign: 'center', valign: 'middle'},
          //       3: { cellWidth: 25,halign: 'right', valign: 'middle'},
          //       4: { halign: 'right', valign: 'middle'},
          //      // 4: { cellWidth: 30,halign: 'center', valign: 'middle'},
          // };
      
            
            autoTable(pdf, {
            head:headers,
            body:repData,
            startY: startY, // Start table at the current startY value
            tableWidth: tableWidth,
            styles: {
              cellPadding: { left:2 , right: 2, top: 1, bottom: 1 }, // Reduce padding
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
                
                if(data.row.index === 0 && data.column.index === 0 && data.section==="head"){
                    doc.setLineWidth(0.3);
                    doc.setDrawColor(0, 0, 0); // Set line color to black
                    doc.line(
                    data.cell.x,
                    data.cell.y - 2,
                    pageWidth-rightMargin,
                  // data.cell.x + data.cell.width,
                    data.cell.y - 2
                );
                }
              },
            didDrawPage: (data: any) => {
              startY = data.cursor.y;
            }
            });
            
              var  yPos = startY+5;
              pdf.setLineWidth(0.1);
        // Set dashed line pattern
              pdf.setLineDashPattern([0.01, 0.01], 0);
    
                // Draw top line
            //  pdf.line(leftMargin, yPos, (pageWidth+2-rightMargin ), yPos);
    
    
            var sysCurrencyCode=Utility.GetSystemCurrencyCode();
              var totalSGD=`${this.translatedLangText.TOTAL} (${sysCurrencyCode}):`;
             // var totalCostValue=`${this.parse2Decimal(this.totalCost)}`;
                var AppCostValue=(this.approvedCost===0?'':`${this.parse2Decimal(this.approvedCost)}`);
              //var amtWords = Utility.convertToWords(this.totalCost!);
              var amtWords = (ESTIMATE_APPROVED_STATUS.includes(this.steamItem.status_cv))?Utility.convertToWords(this.approvedCost!): Utility.convertToWords(this.totalCost!);
                var cc= this.steamItem.storing_order_tank?.storing_order?.customer_company;
              var custCurrencyCode = cc?.currency?.currency_code;
    
            //  var totalSGD=`${this.translatedLangText.TOTAL_SGD}:`;
            // var totalCostValue=`${this.parse2Decimal(this.totalCost)}`;
            startY+=3;
              var estData:RowInput[]=[];
           

               var LabourLbl = `${this.translatedLangText.LABOUR} (${sysCurrencyCode}):`;
               var estTotalLbrCost=estTotalLbr*this.packageLabourCost;
           

               var  totalCostValue=estTotalLbrCost+estTotalCost;
              estData.push([
                 '','','',
                { content: `${totalSGD}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz+1}  },
                { content: `${this.parse2Decimal(totalCostValue)}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',
                  fontSize: fontSz,cellPadding: { right: rightPadding_cost } } }
                
              ])
    
    
              if(sysCurrencyCode!=custCurrencyCode){
                  var totalForeign=`${this.translatedLangText.TOTAL} (${custCurrencyCode}):`;
                // var cc= this.steamItem.storing_order_tank?.storing_order?.customer_company;
                  var rate =cc.currency?.rate;
                  var convertedCost =  `${this.parse2Decimal((totalCostValue||0)*rate)}`;
                  var convertedapprovedCost =  (this.approvedCost===0?'':`${this.parse2Decimal((this.approvedCost||0)*rate)}`);
                  
                  // estData[0]=[{ content: `${amtWords}`,  colSpan: 6,styles: { halign: 'left', valign: 'middle',fontStyle: 'bold',fontSize: 10, textColor: '#000000'} }];
                 

                  estData.push([
                  '','','',
                  { content: `${totalForeign}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz+1}},
                  { content: `${convertedCost}`,styles: { halign: 'right', valign: 'middle',fontStyle: 'bold',fontSize: fontSz,
                    cellPadding: { right: rightPadding_cost }  } }
                  
                  ]);
                }
            autoTable(pdf, {
            body:estData,
            startY: startY, // Start table at the current startY value
            tableWidth: tableWidth,
            styles: {
              cellPadding: { left:2 , right: 2, top: 1, bottom: 0 }, // Reduce padding
              fontSize: 7.5,
              lineWidth: 0 // remove all borders initially
            },
            theme: 'grid',
            margin: { left: leftMargin },
            columnStyles: comStyles,
              didDrawCell: function (data) {
                const doc = data.doc;
                
                if(data.row.index === 0 && data.column.index === 0 && data.section==="body"){
                    doc.setLineWidth(0.3);
                    doc.setDrawColor(0, 0, 0); // Set line color to black
                    doc.line(
                      data.cell.x,
                      data.cell.y -1,
                      pageWidth-rightMargin,
                      data.cell.y -1
                    );
    
                    
                }
              },
            didDrawPage: (data: any) => {
            
              startY = data.cursor.y;
            
            }
            });
      
          }

     
}
