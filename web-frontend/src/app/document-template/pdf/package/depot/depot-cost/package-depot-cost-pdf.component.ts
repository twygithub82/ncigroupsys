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
import { DomSanitizer } from '@angular/platform-browser';
import { FileManagerService } from '@core/service/filemanager.service';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { RepairCostTableItem } from 'app/data-sources/repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { report_status_yard, report_status, AdminReportMonthlyReport } from 'app/data-sources/reports';
import { SteamDS } from 'app/data-sources/steam';
import { SteamPartDS } from 'app/data-sources/steam-part';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { autoTable, RowInput, Styles } from 'jspdf-autotable';
import { BarChartModule, Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { PDFUtility } from 'app/utilities/pdf-utility';
import { TariffRepairGroup } from 'app/data-sources/tariff-repair';
import {
  ApexAxisChartSeries, ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers, ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CleaningPriceList } from 'app/data-sources/cleaning-method';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import { PackageBufferItem } from 'app/data-sources/package-buffer';
import { PackageDepotItem } from 'app/data-sources/package-depot';

// import { fileSave } from 'browser-fs-access';

export interface DialogData {
  repData: PackageDepotItem[],
  date: string
}

export type ChartOptions = {
  animations?: any;
  series?: ApexAxisChartSeries;
  series2?: ApexNonAxisChartSeries;
  chart?: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  xaxis?: ApexXAxis;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  stroke?: ApexStroke;
  legend?: ApexLegend;
  title?: ApexTitleSubtitle;
  colors?: string[];
  grid?: ApexGrid;
  markers?: ApexMarkers;
  labels: string[];
  responsive: ApexResponsive[];

};

@Component({
  selector: 'app-package-depot-cost-report-pdf',
  templateUrl: './package-depot-cost-pdf.component.html',
  styleUrls: ['./package-depot-cost-pdf.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule,
    NgApexchartsModule,
    BarChartModule,
  ],
})
export class PackageDepotCostPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME: 'COMMON-FORM.COMPANY-NAME',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    SO_NO: 'COMMON-FORM.SO-NO',
    SO_NOTES: 'COMMON-FORM.SO-NOTES',
    HAULIER: 'COMMON-FORM.HAULIER',
    ORDER_DETAILS: 'COMMON-FORM.ORDER-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    STORAGE: 'COMMON-FORM.STORAGE',
    STEAM: 'COMMON-FORM.STEAM',
    CLEANING: 'COMMON-FORM.CLEANING',
    REPAIR: 'COMMON-FORM.REPAIR',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    CLEAN_STATUS: 'COMMON-FORM.CLEAN-STATUS',
    CERTIFICATE: 'COMMON-FORM.CERTIFICATE',
    REQUIRED_TEMP: 'COMMON-FORM.REQUIRED-TEMP',
    FLASH_POINT: 'COMMON-FORM.FLASH-POINT',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    REMARKS: 'COMMON-FORM.REMARKS',
    ETR_DATE: 'COMMON-FORM.ETR-DATE',
    ST: 'COMMON-FORM.ST',
    O2_LEVEL: 'COMMON-FORM.O2-LEVEL',
    OPEN_ON_GATE: 'COMMON-FORM.OPEN-ON-GATE',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
    INVALID: 'COMMON-FORM.INVALID',
    EXISTED: 'COMMON-FORM.EXISTED',
    DUPLICATE: 'COMMON-FORM.DUPLICATE',
    SELECT_ATLEAST_ONE: 'COMMON-FORM.SELECT-ATLEAST-ONE',
    ADD_ATLEAST_ONE: 'COMMON-FORM.ADD-ATLEAST-ONE',
    ROLLBACK_STATUS: 'COMMON-FORM.ROLLBACK-STATUS',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    CARGO_NAME: 'COMMON-FORM.CARGO-NAME',
    CARGO_ALIAS: 'COMMON-FORM.CARGO-ALIAS',
    CARGO_DESCRIPTION: 'COMMON-FORM.CARGO-DESCRIPTION',
    CARGO_CLASS: 'COMMON-FORM.CARGO-CLASS',
    CARGO_CLASS_SELECT: 'COMMON-FORM.CARGO-CLASS-SELECT',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    EMAIL: 'COMMON-FORM.EMAIL',
    CONTACT_NO: 'COMMON-FORM.CONTACT-NO',
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    VIEW: 'COMMON-FORM.VIEW',
    DEPOT_PROFILE: 'COMMON-FORM.DEPOT-PROFILE',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    PREINSPECTION_COST: "COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST: "COMMON-FORM.LOLO-COST",
    STORAGE_COST: "COMMON-FORM.STORAGE-COST",
    FREE_STORAGE: "COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED',
    STANDARD_COST: "COMMON-FORM.STANDARD-COST",
    CUSTOMER_COST: "COMMON-FORM.CUSTOMER-COST",
    STORAGE_CALCULATE_BY: "COMMON-FORM.STORAGE-CALCULATE-BY",
    ALIAS_NAME: 'COMMON-FORM.ALIAS-NAME',
    CONTACT_PERSON: "COMMON-FORM.CONTACT-PERSON",
    MOBILE_NO: "COMMON-FORM.MOBILE-NO",
    COUNTRY: "COMMON-FORM.COUNTRY",
    FAX_NO: "COMMON-FORM.FAX-NO",
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    LAST_UPDATE: "COMMON-FORM.LAST-UPDATED",
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    FREE_DAYS: 'COMMON-FORM.FREE-DAYS',
    GATE_SURCHARGE_COST: 'COMMON-FORM.GATE-SURCHARGE-COST',
    IN_OUT_SURCHARGE_COST: 'COMMON-FORM.IN-OUT-SURCHARGE-COST',
    EXPORT: 'COMMON-FORM.EXPORT',
    SEARCH: 'COMMON-FORM.SEARCH',
    CUSTOMERS_SELECTED: 'COMMON-FORM.SELECTED',
    PROFILES_SELECTED: 'COMMON-FORM.SELECTED',
    MULTIPLE: 'COMMON-FORM.MULTIPLE',
    S_N: 'COMMON-FORM.S_N',
    PACKAGE_DEPOT_COST: 'COMMON-FORM.PACKAGE-DEPOT-COST',
    IN_SURCHARGE_COST: 'COMMON-FORM.IN-SURCHARGE-COST',
    OUT_SURCHARGE_COST: 'COMMON-FORM.OUT-SURCHARGE-COST',
  }

  public lineChart2Options!: Partial<ChartOptions>;

  type?: string | null;
  // steamDS: SteamDS;
  // steamPartDS: SteamPartDS;
  // sotDS: StoringOrderTankDS;
  // ccDS: CustomerCompanyDS;
  // cvDS: CodeValuesDS;
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
  yardCvList: CodeValuesItem[] = [];
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
  imageQuality = 0.7;

  generatedPDF: any;
  existingPdf?: any;
  existingPdfSafeUrl?: any;
  isImageLoading$: Observable<boolean> = this.fileManagerService.loading$;
  isFileActionLoading$: Observable<boolean> = this.fileManagerService.actionLoading$;

  private generatingPdfLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  generatingPdfLoading$: Observable<boolean> = this.generatingPdfLoadingSubject.asObservable();
  generatingPdfProgress = 0;
  repData?: PackageDepotItem[];
  date?: string;
  repType?: string;
  customer?: string;
  index: number = 0;
  // date:string='';
  // invType:string='';



  constructor(
    public dialogRef: MatDialogRef<PackageDepotCostPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) {
    super();
    this.translateLangText();
    this.InitialDefaultData();
    this.date = this.data.date;



    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  async ngOnInit() {
    // await this.getCodeValuesData();
    //this.pdfTitle = this.type === "REPAIR" ? this.translatedLangText.IN_SERVICE_ESTIMATE : this.translatedLangText.OFFHIRE_ESTIMATE;
    this.repData = this.data.repData;

    // this.repType = this.data.repType;
    // this.customer = this.data.customer;
    this.onDownloadClick();

  }

  ngAfterViewInit() {


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

  // getRepairData(): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     this.subs.sink = this.steamDS.getSteamByIDForPdf(this.repair_guid!).subscribe({
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



  chunkArray(array: any[], chunkSize: number): any[][] {
    const chunks: any[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  updateData(newData: RepairPartItem[] | undefined): void {

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

  // parse2Decimal(input: number | string | undefined) {
  //   return Utility.formatNumberDisplay(input);
  // }

  calculateCost() {
    // this.repairCost = this.steamDS.calculateCost(this.repairItem, this.repairItem?.repair_part);
    // console.log(this.repairCost)
  }

  async onDownloadClick() {
    this.exportToPDF_r1();

  }









  @ViewChild('pdfTable') pdfTable!: ElementRef; // Reference to the HTML content

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

    const pdf = new jsPDF('l', 'mm', 'a4'); // Changed orientation to portrait
    //const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    let pageNumber = 1;

    let reportTitleCompanyLogo = 32;
    let tableHeaderHeight = 12;
    let tableRowHeight = 8.5;
    let bufferTableWidth = 8;
    let tableWidth = pageWidth - leftMargin - rightMargin - bufferTableWidth;
    let minHeightHeaderCol = 3;
    let minHeightBodyCell = 5;
    let fontSz_hdr = PDFUtility.TableHeaderFontSize_Portrait();
    let fontSz_body = PDFUtility.ContentFontSize_Portrait()

    var items = this.repData!;
    var index = 1;
    const data: any[][] = items.map((item, index) => {
      const row = [
        index + 1,
        item.customer_company?.name || "-",
        item.tariff_depot?.profile_name || "-",
        this.parse2Decimal(item.gate_in_cost || 0) || "-",
        this.parse2Decimal(item.gate_out_cost || 0) || "-",
        this.parse2Decimal(item.preinspection_cost || 0) || "-",
        this.parse2Decimal(item.lolo_cost || 0) || "-",
        this.parse2Decimal(item.storage_cost || 0) || "-",
        (item.free_storage || 0) || "-",
        this.displayLastUpdated(item) || "-",
      ];
      return row;
    });

    const pagePositions: { page: number; x: number; y: number }[] = [];
    // const progressValue = 100 / cardElements.length;
    var sysCurrencyCode = Utility.GetSystemCurrencyCode();
    const reportTitle = this.GetReportTitle();
    const headers = [[
      this.translatedLangText.S_N,
      this.translatedLangText.CUSTOMER,
      this.translatedLangText.PROFILE_NAME,
      this.translatedLangText.IN_SURCHARGE_COST,
      this.translatedLangText.OUT_SURCHARGE_COST,
      this.translatedLangText.PREINSPECTION_COST,
      this.translatedLangText.LOLO_COST,
      this.translatedLangText.STORAGE_COST,
      this.translatedLangText.FREE_DAYS,
      this.translatedLangText.LAST_UPDATED_DT

    ]];

    const comStyles: any = {
      0: { cellWidth: 12, valign: 'middle', halign: 'center' },    // "No."
      1: { cellWidth: 52, valign: 'middle', halign: 'left' },   // "NAME"
      2: { cellWidth: 28, valign: 'middle', halign: 'center' },  // "CARGO_CLASS"
      3: { cellWidth: 28, valign: 'middle', halign: 'center' },  // "CARGO_UN_NO"
      4: { cellWidth: 28, valign: 'middle', halign: 'center' },   // "CARGO_METHOD "
      5: { cellWidth: 28, valign: 'middle', halign: 'center' },   // "CARGO_CATEGORY"
      6: { cellWidth: 28, valign: 'middle', halign: 'center' },   // "NAME"
      7: { valign: 'middle', halign: 'center' },  // "CARGO_CLASS"
      8: { cellWidth: 23, valign: 'middle', halign: 'center' },  // "CARGO_UN_NO"
      9: { cellWidth: 21, valign: 'middle', halign: 'center' },   // "CARGO_METHOD "

    };

    // Define headStyles with valid fontStyle
    const headStyles: Partial<Styles> = {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',   // ✅ centers header text
      valign: 'middle'
    };

    let currentY = topMargin;
    let scale = this.scale;
    pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });


    // await Utility.addHeaderWithCompanyLogo_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    // await Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 35);

    // Variable to store the final Y position of the last table
    let lastTableFinalY = 40;

    let startY = lastTableFinalY; // Start table 20mm below the customer name

    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0); // Black text
    // const cutoffDate = PDFUtility.FormatColon(this.translatedLangText.CLEANING_PERIOD, this.date); // Replace with your actual cutoff date
    const cutoffDate = '';
    const subtitlePos = 0;
    startY = await PDFUtility.addHeaderWithCompanyLogoWithTitleSubTitle_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin,
      this.translate, reportTitle, cutoffDate, subtitlePos);
    startY += PDFUtility.GapBetweenSubTitleAndTable_Portrait();
    // startY += PDFUtility.GapBetweenSubTitleAndTable_Portrait();

    // Utility.AddTextAtRightCornerPage(pdf, cutoffDate, pageWidth, leftMargin, rightMargin + 4, lastTableFinalY+9, 8);

    //   var buffer = 25;
    //   var CurrentPage = 1;
    //   for (let n = 0; n < this.report_inventory_cln_dtl.length; n++) {
    //     let startY=0;

    //     if (n > 0) lastTableFinalY += 5; // 2nd table
    //     else {
    //       lastTableFinalY =startPostY ; //1st Page 1st table
    //     }


    //     let cust = this.report_inventory_cln_dtl[n];
    //     const data: any[][] = []; // Explicitly define data as a 2D array

    //     var repPage = pdf.getNumberOfPages();
    //     //if(repPage==1)lastTableFinalY=45;

    //     if ((pageHeight - bottomMargin - topMargin) < (lastTableFinalY + buffer + topMargin)) {
    //       pdf.addPage();
    //       lastTableFinalY = startPostY; /// buffer for 2nd page onward first table's Method
    //     }
    //     else {
    //       CurrentPage = repPage;
    //     }
    //    // lastTableFinalY += 7;
    //   //  startY = lastTableFinalY + 8;
    //     // pdf.setFontSize(8);
    //     // pdf.setTextColor(0, 0, 0); // Black text
    //     //pdf.text(`${cust.cargo}  ${this.translatedLangText.UN_NO}:  ${}  ${'Cleaning Process'}: Process 1`, leftMargin, lastTableFinalY); // Add customer name 10mm below the last table

    //     var unNo;
    //     var process;
    //     for (let i = 0; i < (cust.storing_order_tank?.length || 0); i++) {
    //       var itm = cust.storing_order_tank?.[i];
    //       data.push([
    //         (i + 1).toString(), itm?.tank_no || "", this.DisplayCustomerName(itm!) || "", this.DisplayCleanIn(itm!) || "", this.DisplayCleanDate(itm!) || "",
    //         this.DipslayCleanDuration(itm!) || "" //itm?.tariff_cleaning?.un_no || "", this.DisplayCleanMethod(itm!) || ""
    //       ]);
    //       unNo = itm?.tariff_cleaning?.un_no || "";
    //       process = this.DisplayCleanMethod(itm!);
    //     }
    //  //   pdf.text(`${cust.cargo}  |  ${unNo}  |  ${process}`, leftMargin, lastTableFinalY+5);
    //     // pdf.text(`${cust.cargo}  |  ${unNo}  |  ${process}`, leftMargin+(bufferTableWidth/2), lastTableFinalY)
    //     // pdf.setDrawColor(0, 0, 0); // red line color

    //     var subtitle=`${cust.cargo||"-"}  |  ${unNo||"-"}  |  ${process||"-"}`;

    //     await Utility.AddTextAtLeftCornerPage(pdf,subtitle, pageWidth, leftMargin, rightMargin, lastTableFinalY, PDFUtility.RightSubTitleFontSize());
    //     lastTableFinalY += PDFUtility.GapBetweenLeftTitleAndTable();
    //     startY= startPostY+ PDFUtility.GapBetweenLeftTitleAndTable();
    //     // /pdf.setLineWidth(0.1);
    //   //  pdf.setLineDashPattern([0.01, 0.01], 0.1);
    //     // Add table using autoTable plugin
    //     autoTable(pdf, {
    //       head: headers,
    //       body: data,
    //       //startY: startY, // Start table at the current startY value
    //       theme: 'grid',
    //       margin: { top:startY, horizontal: leftMargin},
    //       tableWidth: contentWidth,
    //       styles: {
    //         fontSize: fontSz_body,
    //         minCellHeight: minHeightHeaderCol

    //       },

    //       columnStyles: comStyles,
    //       headStyles: headStyles, // Custom header styles
    //       bodyStyles: {
    //         fillColor: [255, 255, 255],
    //         halign: 'left', // Left-align content for body by default
    //         valign: 'middle', // Vertically align content
    //       },
    //       didDrawPage: (data: any) => {
    //         const pageCount = pdf.getNumberOfPages();

    //         lastTableFinalY = data.cursor.y;

    //         var pg = pagePositions.find(p => p.page == pageCount);
    //         if (!pg) {
    //           pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
    //           if (pageCount > 1) {
    //             // new Page (2nd Page onward) to add Report Title and date , Report title Y: top margin + 45(Company Logo:35 + space :10) , Date Y: top margin + 42 (Company Logo:35 + space :7)  
    //             // Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 45);
    //             // Utility.AddTextAtRightCornerPage(pdf, cutoffDate, pageWidth, leftMargin, rightMargin + 4, topMargin+42, 8);
    //              PDFUtility.addReportTitle_Portrait(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
    //             PDFUtility.addReportSubTitle_Portrait(pdf, cutoffDate, pageWidth, leftMargin, rightMargin,subtitlePos);
    //           }
    //         }
    //       },
    //     });
    //   }

    autoTable(pdf, {
      head: headers,
      body: data,
      //startY: startY, // Start table at the current startY value
      theme: 'grid',
      margin: { top: startY, horizontal: leftMargin },
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
            // new Page (2nd Page onward) to add Report Title and date , Report title Y: top margin + 45(Company Logo:35 + space :10) , Date Y: top margin + 42 (Company Logo:35 + space :7)  
            // Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 45);
            // Utility.AddTextAtRightCornerPage(pdf, cutoffDate, pageWidth, leftMargin, rightMargin + 4, topMargin+42, 8);
            PDFUtility.addReportTitle_Portrait(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
            // PDFUtility.addReportSubTitle_Portrait(pdf, cutoffDate, pageWidth, leftMargin, rightMargin,subtitlePos);
          }
        }
      },
    });

    await PDFUtility.addFooterWithPageNumberAndCompanyLogo_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin,
      rightMargin, this.translate, pagePositions);
    // const totalPages = pdf.getNumberOfPages();




    this.generatingPdfProgress = 100;
    //pdf.save(fileName);
    this.generatingPdfProgress = 0;
    this.generatingPdfLoadingSubject.next(false);
    Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
    this.dialogRef.close();
  }

  async exportToPDF_r2(fileName: string = 'document.pdf') {
    this.export(this.repData!);
   

  }


  async export(items: TariffCleaningItem[]) {
    const doc = new jsPDF();

    const pageWidth = 210; // A4 width in mm (portrait)
    const pageHeight = 297; // A4 height in mm (portrait)
    const leftMargin = 10;
    const rightMargin = 10;
    const topMargin = 5;
    const bottomMargin = 5;

    const contentWidth = pageWidth - leftMargin - rightMargin;
    const maxContentHeight = pageHeight - topMargin - bottomMargin;

    let fontSize = 12;
    doc.setFontSize(fontSize);
    doc.text("Cleaning Tariff", 105, 15, { align: "center" });

    let lastTableFinalY = 25;
    const pagePositions: { page: number; x: number; y: number }[] = [];
    const table_body_fontsize = 8;
    const startX = leftMargin;
    let index = 1;

    const data: any[][] = items.map((item) => {
      const row = [
        index++, // increment index for each item
        item.cargo || "-",
        item.class_cv || "-",
        item.un_no || "-",
        item.cleaning_method?.name || "-",
        item.cleaning_category?.name || "-",
        item.flash_point || "-",
        item.ban_type_cv || "-",
        item.cleaning_category?.cost || "-",
      ];
      return row;
    });
    var sysCurrencyCode = Utility.GetSystemCurrencyCode();
    autoTable(doc, {
      startY: lastTableFinalY,
      head: [[
        this.translatedLangText.S_N,
        this.translatedLangText.DESCRIPTION,
        this.translatedLangText.UNIT,
        this.translatedLangText.MANHOUR,
        `${this.translatedLangText.MATERIAL_COST}(${sysCurrencyCode})`
      ]],
      body: data,
      theme: "grid",
      margin: { left: leftMargin, right: rightMargin },
      styles: { fontSize: table_body_fontsize, cellPadding: 2 },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center',   // ✅ centers header text
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 12, valign: 'middle', halign: 'center' },    // "No."
        1: { cellWidth: 93, valign: 'middle', halign: 'center' },   // "Description"
        2: { cellWidth: 20, valign: 'middle', halign: 'center' },  // "Unit"
        3: { cellWidth: 25, valign: 'middle', halign: 'center' },  // "Manhour"
        4: { cellWidth: 40, valign: 'middle', halign: 'center' }   // "Material Cost"
      },
      didDrawPage: (d: any) => {
        lastTableFinalY = d.cursor.y + 8;
        const pageCount = doc.getNumberOfPages();
        if (!pagePositions.find(p => p.page === pageCount)) {
          pagePositions.push({
            page: pageCount,
            x: doc.internal.pageSize.width - 20,
            y: doc.internal.pageSize.height - 10
          });
        }
      }
    });



    const totalPages = doc.getNumberOfPages();

    // Add page numbers
    for (const { page } of pagePositions) {
      doc.setFontSize(8);
      doc.setPage(page);
      doc.text(`Page ${page} of ${totalPages}`, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 8, { align: 'right' });
    }

    doc.save("CleaningTariff.pdf");
    this.dialogRef.close();
  }



  async AddCleaningOverviewChart(pdf: jsPDF, reportTitle: string, pageWidth: number,
    leftMargin: number, rightMargin: number, pagePositions: { page: number; x: number; y: number }[]) {

    pdf.addPage();
    const tablewidth = 55;
    var pageNumber = pdf.getNumberOfPages();
    const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    const card = cardElements[0];
    const contentWidth = pageWidth - leftMargin - rightMargin - tablewidth - 5;

    const imgData = await PDFUtility.captureFullCardImage(card);
    // Convert card to image (JPEG format)
    const canvas = await html2canvas(card);
    // const imgData = canvas.toDataURL('image/jpeg', 0.8); // Convert to JPEG with 80% quality

    const imgHeight = (canvas.height * contentWidth) / canvas.width; // Adjust height proportionally

    // Add the report title at the top of every page, centered
    const titleWidth = pdf.getStringUnitWidth(reportTitle) * pdf.getFontSize() / pdf.internal.scaleFactor;
    const titleX = (210 - titleWidth) / 2; // Centering the title (210mm is page width)

    var pos = 10;
    PDFUtility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, pos);
    // pdf.text(reportTitle, titleX, pos); // Position it at the top

    // // Draw underline for the title
    // pdf.setLineWidth(0.5); // Set line width for underline
    // pdf.line(titleX, pos + 2, titleX + titleWidth, pos + 2); // Draw the line under the title

    pos += 8;
    pdf.addImage(imgData, 'JPEG', leftMargin, pos, contentWidth, imgHeight); // Adjust y position to leave space for the title


    let minHeightBodyCell = 9;
    let fontSz = 6.5;
    const headers = [[
      this.translatedLangText.DESCRIPTION,
      this.translatedLangText.NO_OF_TANKS
    ]];

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

    const comStyles: any = {
      0: { halign: 'center', cellWidth: 25, minCellHeight: minHeightBodyCell },
      1: { halign: 'center', cellWidth: 25, minCellHeight: minHeightBodyCell },
    };

    let lastTableFinalY = 10;
    let startY = lastTableFinalY;
    let minHeightHeaderCol = 8;
    const data: any[][] = [];
    // data.push([this.translatedLangText.TOTAL_TANK, this.repData?.total]);
    // data.push([this.translatedLangText.AVERAGE, this.repData?.average]);



    let startX = (pageWidth - rightMargin - tablewidth);
    //Add table using autoTable plugin

    // pdf.setFontSize(8);
    // pdf.setTextColor(0, 0, 0); // Black text
    // const invDate = `${this.translatedLangText.INVENTORY_DATE}:${this.date}`; // Replace with your actual cutoff date
    // Utility.AddTextAtCenterPage(pdf, invDate, pageWidth, leftMargin, rightMargin, lastTableFinalY, 9);

    autoTable(pdf, {
      head: headers,
      body: data,
      startY: startY + 8, // Start table at the current startY value
      margin: { left: startX },
      theme: 'grid',
      styles: {
        fontSize: fontSz,
        minCellHeight: minHeightHeaderCol

      },
      columnStyles: comStyles,
      headStyles: headStyles, // Custom header styles
      bodyStyles: {
        fillColor: [255, 255, 255],
        halign: 'center', // Left-align content for body by default
        valign: 'middle', // Vertically align content
      }

    });

  }

  async exportToPDF(fileName: string = 'document.pdf') {
    this.generatingPdfLoadingSubject.next(true);
    this.generatingPdfProgress = 0;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const leftMargin = 10; // Left margin
    const rightMargin = 10; // Right margin
    const contentWidth = 210 - leftMargin - rightMargin; // 190mm usable width
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
      const titleX = (210 - titleWidth) / 2; // Centering the title (210mm is page width)

      const pos = 15;
      // pdf.text(reportTitle, titleX, pos); // Position it at the top

      // // Draw underline for the title
      // pdf.setLineWidth(0.5); // Set line width for underline
      // pdf.line(titleX, pos+2, titleX + titleWidth, pos+2); // Draw the line under the title

      // If card height exceeds A4 page height, split across multiple pages
      if (imgHeight > 277) { // 297mm (A4 height) - 20mm (top & bottom margins)
        let yPosition = 0;
        while (yPosition < canvas.height) {
          const sectionCanvas = document.createElement('canvas');
          sectionCanvas.width = canvas.width;
          sectionCanvas.height = Math.min(1122, canvas.height - yPosition); // A4 height in pixels

          const sectionCtx = sectionCanvas.getContext('2d');
          sectionCtx?.drawImage(canvas, 0, -yPosition);

          const sectionImgData = sectionCanvas.toDataURL('image/jpeg', this.imageQuality); // Convert section to JPEG

          pdf.addImage(sectionImgData, 'JPEG', leftMargin, 20, contentWidth, (sectionCanvas.height * contentWidth) / canvas.width); // Adjust y position to leave space for the title

          // Store page position for page numbering
          pagePositions.push({ page: pageNumber, x: 200, y: 287 });

          yPosition += sectionCanvas.height;
          if (yPosition < canvas.height) {
            pdf.addPage();
            pageNumber++;
            pdf.text(reportTitle, titleX, 10); // Add title on new page
            pdf.setLineWidth(0.5); // Set line width for underline
            pdf.line(titleX, pos + 2, titleX + titleWidth, pos + 2); // Draw the line under the title
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

  GetReportTitle(): string {
    var title: string = '';
    title = `${this.translatedLangText.PACKAGE_DEPOT_COST}`;
    return `${title}`
  }

  // displayLocation(yard: report_status_yard): string {
  //   return this.cvDS.getCodeDescription(yard.code, this.yardCvList) || '';;
  // }
  displayInYardTotal(yard: report_status_yard): number {
    var total = 0;

    total = (yard.noTank_storage || 0) + (yard.noTank_clean || 0) + (yard.noTank_steam || 0) + (yard.noTank_repair || 0);
    return total;

  }

  ResetIndex() {
    this.index = 0;
  }

  GetIndex() {
    this.index += 1;
    return this.index;
  }

  displayTotalSteam() {
    var retval = 0;
    // this.reportStatus.forEach(r => {

    //   r.yards?.forEach(y => {
    //     retval += y.noTank_steam || 0;
    //   })

    // });

    return retval;

  }

  processTankStatus(repStatus: AdminReportMonthlyReport) {


    var maxYAxisValue = 12;
    var days = repStatus.result_per_day?.map((i, index) => (index + 1));
    const counts: number[] = repStatus.result_per_day
      ?.map(i => i.count) // Extract the count property
      .filter(count => count !== undefined && count !== null) as number[]; // Filter out undefined/null values
    maxYAxisValue = counts.length > 0 ? Math.max(...counts) : maxYAxisValue;

    maxYAxisValue = Math.round(maxYAxisValue * 1.5);
    const computedTickAmount = maxYAxisValue; // since range starts at 0
    const tickAmount = computedTickAmount <= 3 ? computedTickAmount : undefined;
    this.lineChart2Options.yaxis = {
      max: maxYAxisValue,
      min: 0,
      title: {
        text: `${this.translatedLangText.NO_OF_TANKS}`,
      },
      labels: {
        align: 'right', // Align labels to the right
        minWidth: 50,   // Set a minimum width for the labels
        maxWidth: 100,  // Set a maximum width for the labels
        offsetX: 10,    // Add horizontal offset to the labels

        formatter: (value: number) => {
          return Math.round(value).toString(); // ensures no decimal values on Y-axis
        }
      },
      //   ...(tickAmount ? { tickAmount } : {}), // Only include tickAmount if it's valid
      //  tickAmount: 3, // Controls number of ticks (adjust as needed)
      // forceNiceScale: true, // Optional: ensures clean scaling
      //decimalsInFloat: 0
    }
    if (tickAmount) {
      this.lineChart2Options.yaxis.tickAmount = tickAmount;
    }
    this.lineChart2Options.series = [
      {
        name: 'days',
        data: counts,
      },
    ]
    this.lineChart2Options.xaxis = {
      type: 'category',
      categories: days,
      title: {
        text: `${this.date}`,
      },
    }

    // this.lineChart2Options.chart!.events = {
    //     animationEnd: () => {
    //       this.onChartRendered();
    //     }
    //  }

  }

  InitialDefaultData() {
    this.lineChart2Options = {
      series: [
        {
          name: 'Bill Amount',
          data: [113, 120, 130, 120, 125, 119, 126],
        },
      ],
      chart: {
        height: 380,
        type: 'line',
        animations: {
          enabled: false, // disables animations
        },
        dropShadow: {
          enabled: false,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,

        },
      },
      colors: ['#6777EF'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      markers: {
        size: 3, // ✅ shows a visible dot
        strokeWidth: 0,
        colors: ['#6777EF'],
      },
      xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        title: {
          text: 'Weekday',
        },
      },
      yaxis: {
        title: {
          text: 'Bill Amount($)',
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },

    };
  }

  onChartRendered() {
    // if (this.chartAnimatedCounter == 3) 
    {
      //this.onDownloadClick();
      // var timeout = 3000;
      // setTimeout(() => {
      //   this.onDownloadClick();
      // }, timeout);
    }
  }

  displayLastUpdated(r: any) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    return this.displayDate(updatedt);

  }

  parse2Decimal(figure: number | string) {
    return Utility.formatNumberDisplay(figure)
  }

}
