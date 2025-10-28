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
import { SteamDS } from 'app/data-sources/steam';
import { SteamPartDS } from 'app/data-sources/steam-part';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { autoTable, Styles } from 'jspdf-autotable';
import { ManagementReportYearlyRevenueItem, MonthlyProcessData, InventoryAnalyzer, ManagementReportMonthlyInventory, ManagementReportMonthlyRevenueItem } from 'app/data-sources/reports-management';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexFill,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexGrid,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { PDFUtility } from 'app/utilities/pdf-utility';


export interface DialogData {
  repData: ManagementReportMonthlyRevenueItem,
  date: string,
  repType: string,
  customer: string,
  inventory_type: string[]
}

interface SeriesItem {
  name: string;
  data: number[];
}

@Component({
  selector: 'app-monthly-revenue-sales-report-details-pdf',
  templateUrl: './revenue-sales-details-pdf.component.html',
  styleUrls: ['./revenue-sales-details-pdf.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule,
    NgApexchartsModule
  ],
})
export class RevenueMonthlySalesReportDetailsPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  translatedLangText: any = {};
  langText = {
    STATUS: 'COMMON-FORM.STATUS',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_NAME: 'COMMON-FORM.CUSTOMER-NAME',
    SO_DATE: 'COMMON-FORM.SO-DATE',
    NO_OF_TANKS: 'COMMON-FORM.NO-OF-TANKS',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    SEARCH: "COMMON-FORM.SEARCH",
    EIR_NO: "COMMON-FORM.EIR-NO",
    EIR_DATE: "COMMON-FORM.EIR-DATE",
    ORDER_DETAILS: "COMMON-FORM.ORDER-DETAILS",
    CUSTOMER: "COMMON-FORM.CUSTOMER",
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
    INVOICE_PERIOD: 'COMMON-FORM.INVOICE-PERIOD',
    CUSTOMER_INVOICE: 'MENUITEMS.BILLING.LIST.CUSTOMER-INVOICE',
    LOLO_COST: 'COMMON-FORM.LOLO-COST-REPORT',
    STEAM_COST: 'COMMON-FORM.STEAM-COST-REPORT',
    RESIDUE_COST: 'COMMON-FORM.RESIDUE-COST-REPORT',
    IN_DATE: 'COMMON-FORM.IN-DATE',
    OUT_DATE: 'COMMON-FORM.OUT-DATE',
    TOTAL: 'COMMON-FORM.TOTAL',
    DAYS: 'COMMON-FORM.DAYS',
    GATEIO: 'COMMON-FORM.GATEIO',
    INVENTORY_TYPE: 'COMMON-FORM.INVENTORY-TYPE',
    TANK_ACTIVITY: 'COMMON-FORM.TANK-ACTIVITY',
    SUMMARY_REPORT: 'COMMON-FORM.SUMMARY-REPORT',
    INVENTORY_PERIOD: 'COMMON-FORM.INVENTORY-PERIOD',
    YARD_STATUS: 'COMMON-FORM.YARD-STATUS',
    DETAIL_SUMMARY: 'COMMON-FORM.DETAIL-SUMMARY',
    STEAM: 'COMMON-FORM.STEAM',
    REPAIR: 'COMMON-FORM.REPAIR',
    CLEANING: 'COMMON-FORM.CLEANING',
    STORAGE: 'COMMON-FORM.STORAGE',
    PENDING: 'COMMON-FORM.PENDING',
    WITH_RO: 'COMMON-FORM.WITH-RO',
    LOCATION: 'COMMON-FORM.LOCATION',
    STEAM_MONTHLY_DETAILS_REPORT: 'COMMON-FORM.STEAM-MONTHLY-DETAILS-REPORT',
    RESIDUE_MONTHLY_DETAILS_REPORT: 'COMMON-FORM.RESIDUE-MONTHLY-DETAILS-REPORT',
    REPAIR_MONTHLY_DETAILS_REPORT: 'COMMON-FORM.REPAIR-MONTHLY-DETAILS-REPORT',
    CLEAN_MONTHLY_DETAILS_REPORT: 'COMMON-FORM.CLEAN-MONTHLY-DETAILS-REPORT',
    CUSTOMER_MONTHLY_SALES_REPORT: 'COMMON-FORM.CUSTOMER-MONTHLY-SALES-REPORT',
    YEARLY_INVENTORY_REPORT: 'COMMON-FORM.YEARLY-INVENTORY-REPORT',
    SUMMARY_OF_INVENTORY: "COMMON-FORM.SUMMARY-OF-INVENTORY",
    DAY: 'COMMON-FORM.DAY',
    MONTH: 'COMMON-FORM.MONTH',
    AVERAGE: 'COMMON-FORM.AVERAGE',
    OFFHIRE: 'COMMON-FORM.OFFHIRE',
    IN_SERVICE: 'COMMON-FORM.IN-SERVICE',
    TANK_IN_QTY: "COMMON-FORM.TANK-IN-QTY",
    TANK: "COMMON-FORM.TANK",
    COST: "COMMON-FORM.COST",
    YEARLY_SALES_REPORT: 'COMMON-FORM.YEARLY-SALES-REPORT',
    YEARLY_REVENUE_REPORT: 'COMMON-FORM.YEARLY-REVENUE-REPORT',
    GATE_SURCHARGE: 'COMMON-FORM.GATE-SURCHARGE',
    LOLO: 'COMMON-FORM.LOLO',
    PREINSPECTION: 'COMMON-FORM.PREINSPECTION',
    ON_DEPOT: 'COMMON-FORM.ON-DEPOT',
    OUT_GATE: 'COMMON-FORM.OUT-GATE',
    PERCENTAGE_SYMBOL: 'COMMON-FORM.PERCENTAGE-SYMBOL',
    GATE: 'COMMON-FORM.GATE',
    LIFT_ON: 'COMMON-FORM.LIFT-ON',
    LIFT_OFF: 'COMMON-FORM.LIFT-OFF',
    GATE_IN: 'COMMON-FORM.GATE-IN',
    GATE_OUT: 'COMMON-FORM.GATE-OUT',
    APPROVED_COUNT: 'COMMON-FORM.APPROVED-COUNT',
    COMPLETED_COUNT: 'COMMON-FORM.COMPLETED-COUNT',
    APPROVED_HOUR: 'COMMON-FORM.APPROVED-HOUR',
    COMPLETED_HOUR: 'COMMON-FORM.COMPLETED-HOUR',
    DIFFERENCE: 'COMMON-FORM.DIFFERENCE',
    MONTHLY_REVENUE_REPORT: 'COMMON-FORM.MONTHLY-REVENUE-REPORT',
    S_N: 'COMMON-FORM.S_N',
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
  repData?: ManagementReportMonthlyRevenueItem;
  date?: string;
  repType?: string;
  customer?: string;
  index: number = 0;
  lineChartOptions?: any;
  pieChartOptions?: any;
  invTypes?: string[];
  colors?: [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173"
  ]
  // date:string='';
  // invType:string='';



  constructor(
    public dialogRef: MatDialogRef<RevenueMonthlySalesReportDetailsPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) {
    super();
    this.InitChartValues();
    this.translateLangText();
    this.steamDS = new SteamDS(this.apollo);
    this.steamPartDS = new SteamPartDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.repData = data.repData;
    this.date = data.date;
    this.repType = data.repType;
    this.customer = data.customer;
    this.invTypes = data.inventory_type;
    // this.repair_guid = data.repair_guid;
    // this.customer_company_guid = data.customer_company_guid;
    // this.estimate_no = data.estimate_no;
    // this.existingPdf = data.existingPdf;



    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  async ngOnInit() {
    await this.getCodeValuesData();
    //this.pdfTitle = this.type === "REPAIR" ? this.translatedLangText.IN_SERVICE_ESTIMATE : this.translatedLangText.OFFHIRE_ESTIMATE;
    // this.repData = this.data.repData;
    // this.date= this.data.date;
    // this.repType=this.data.repType;
    // this.customer=this.data.customer;
    // this.invTypes=this.data.inventory_type;
    //this.InitChartValues();
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
      { alias: 'yardCv', codeValType: 'YARD' },
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
      firstValueFrom(this.cvDS.connectAlias('yardCv')).then(async data => {
        this.yardCvList = data || [];
        // const subqueries: any[] = [];
        // data.map(d => {
        //   if (d.child_code) {
        //     let q = { alias: d.child_code, codeValType: d.child_code };
        //     const hasMatch = subqueries.some(subquery => subquery.codeValType === d.child_code);
        //     if (!hasMatch) {
        //       subqueries.push(q);
        //     }
        //   }
        // });

        // // Process subqueries if any
        // if (subqueries.length > 0) {
        //   await this.cvDS?.getCodeValuesByTypeAsync(subqueries);

        //   for (const s of subqueries) {
        //     const subData = await firstValueFrom(this.cvDS.connectAlias(s.alias));
        //     if (subData) {
        //       this.subgroupNameCvList = [...new Set([...this.subgroupNameCvList, ...subData])];
        //     }
        //   }
        // }

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

  // getGroupSeq(codeVal: string | undefined): number | undefined {
  //   const gncv = this.groupNameCvList?.filter(x => x.code_val === codeVal);
  //   if (gncv.length) {
  //     return gncv[0].sequence;
  //   }
  //   return -1;
  // }

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
    const leftMargin = 5;
    const rightMargin = 5;
    const topMargin = 5;
    const bottomMargin = 5;
    const contentWidth = pageWidth - leftMargin - rightMargin;
    const maxContentHeight = pageHeight - topMargin - bottomMargin;

    this.generatingPdfLoadingSubject.next(true);
    this.generatingPdfProgress = 0;

    const pdf = new jsPDF('l', 'mm', 'a4');
    //const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    let pageNumber = 1;



    let reportTitleCompanyLogo = 32;
    let tableHeaderHeight = 12;
    let tableRowHeight = 8.5;
    let minHeightBodyCell = 5;
    let minHeightHeaderCol = 3;
   let fontSz_hdr = PDFUtility.TableHeaderFontSize_Landscape();
    let fontSz_body= PDFUtility.ContentFontSize_Landscape()
    const pagePositions: { page: number; x: number; y: number }[] = [];
    // const progressValue = 100 / cardElements.length;

    let showPreinspectSurcharge: boolean = this.invTypes?.includes("PREINSPECTION")!;
    let showLoloSurcharge: boolean = this.invTypes?.includes("LOLO")!;
    let showStorageSurcharge: boolean = this.invTypes?.includes("STORAGE")!;
    let showGateSurcharge: boolean = this.invTypes?.includes("IN_OUT")!;
    let showResidueSurcharge: boolean = this.invTypes?.includes("RESIDUE")!;
    let showSteamSurcharge: boolean = this.invTypes?.includes("STEAMING")!;
    let showCleanSurcharge: boolean = this.invTypes?.includes("CLEANING")!;
    let showRepairSurcharge: boolean = this.invTypes?.includes("REPAIR")!;
    const reportTitle = this.GetReportTitle();
    const vAlign = "bottom"
    const headers = [[
      { content: this.translatedLangText.S_N, rowSpan: 2, styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.DATE, rowSpan: 2, styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.DAY, rowSpan: 2, styles: { halign: 'center', valign: vAlign } },
      ...(showPreinspectSurcharge ? [{ content: this.translatedLangText.PREINSPECTION, colSpan: 2, styles: { halign: 'center', valign: vAlign } }] : []),
      ...(showLoloSurcharge ? [{ content: this.translatedLangText.LOLO, colSpan: 2, styles: { halign: 'center', valign: vAlign } }] : []),
      ...(showStorageSurcharge ? [{ content: this.translatedLangText.STORAGE, colSpan: 2, styles: { halign: 'center', valign: vAlign } }] : []),
      ...(showGateSurcharge ? [
        { content: this.translatedLangText.GATE, colSpan: 2, styles: { halign: 'center', valign: vAlign } },
        //   { content: this.translatedLangText.LOLO, colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      ] : []),
      ...(showSteamSurcharge ? [{ content: this.translatedLangText.STEAM, colSpan: 2, styles: { halign: 'center' } }] : []),
      ...(showResidueSurcharge ? [{ content: this.translatedLangText.RESIDUE, colSpan: 2, styles: { halign: 'center' } }] : []),
      ...(showCleanSurcharge ? [{ content: this.translatedLangText.CLEANING, colSpan: 2, styles: { halign: 'center' } }] : []),
      ...(showRepairSurcharge ? [{ content: this.translatedLangText.REPAIR, colSpan: 2, styles: { halign: 'center', valign: vAlign } }] : []),
      // { content: this.translatedLangText.TOTAL, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },

    ],
    [
      // Empty cells for the first 5 columns (they are spanned by rowSpan: 2)
      ...(showPreinspectSurcharge ? [this.translatedLangText.NO_OF_TANKS, this.translatedLangText.COST] : []), // Sub-headers for preinspection
      ...(showLoloSurcharge ? [this.translatedLangText.NO_OF_TANKS, this.translatedLangText.COST] : []), // Sub-headers for LOLO
      ...(showStorageSurcharge ? [this.translatedLangText.NO_OF_TANKS, this.translatedLangText.COST] : []), // Sub-headers for storage
      ...(showGateSurcharge ? [
        this.translatedLangText.NO_OF_TANKS, this.translatedLangText.COST,
        //  this.translatedLangText.LIFT_ON, this.translatedLangText.LIFT_OFF
      ] : []), // Sub-headers for GATE_SURCHARGE
      ...(showSteamSurcharge ? [this.translatedLangText.NO_OF_TANKS, this.translatedLangText.COST] : []), // Sub-headers for STEAM
      ...(showResidueSurcharge ? [this.translatedLangText.NO_OF_TANKS, this.translatedLangText.COST] : []), // Sub-headers for residue
      ...(showCleanSurcharge ? [this.translatedLangText.NO_OF_TANKS, this.translatedLangText.COST] : []), // Sub-headers for RESIDUE
      ...(showRepairSurcharge ? [this.translatedLangText.NO_OF_TANKS, this.translatedLangText.COST] : []), // Sub-headers for CLEANING
      // this.translatedLangText.TANK, this.translatedLangText.COST, // Sub-headers for REPAIR
    ]];



    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      1: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      2: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      3: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      4: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      5: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      6: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      7: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      8: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      9: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      10: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      11: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      12: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      13: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      14: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      15: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      16: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      17: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      18: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
    };

    // Define headStyles with valid fontStyle
    const headStyles: Partial<Styles> = {
      fillColor: [211, 211, 211], // Background color
      textColor: 0, // Text color (white)
      fontStyle: "bold", // Valid fontStyle value
      fontSize: fontSz_hdr,
      halign: 'center', // Centering header text
      valign: 'middle',
      lineColor: 201,
      lineWidth: 0.1
    };

    let currentY = topMargin;
    let scale = this.scale;
    pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });


    // await Utility.addHeaderWithCompanyLogo_Landscape(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    // await Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 40);

    // // Variable to store the final Y position of the last table
    let lastTableFinalY = 40;

    let startY = lastTableFinalY + 8; // Start table 20mm below the customer name
    const data: any[][] = []; // Explicitly define data as a 2D array

    const repGeneratedDate = `${this.date}`; // Replace with your actual cutoff date
    // Utility.AddTextAtCenterPage(pdf, repGeneratedDate, pageWidth, leftMargin, rightMargin + 5, startY - 1, PDFUtility.CenterSubTitleFontSize());
     const subtitlePos = 1;
    startY=await PDFUtility.addHeaderWithCompanyLogoWithTitleSubTitle_Landscape(pdf, pageWidth, topMargin, bottomMargin, leftMargin, 
    rightMargin,this.translate,reportTitle,repGeneratedDate,subtitlePos);
    startY+= PDFUtility.GapBetweenSubTitleAndTable_Landscape();


    if (this.customer) {
      // const customer = PDFUtility.FormatColon(this.translatedLangText.CUSTOMER, this.customer);
      // Utility.addText(pdf, customer, startY + 2, leftMargin, PDFUtility.RightSubTitleFontSize());
       const customer=`${this.customer}`;
      Utility.AddTextAtLeftCornerPage(pdf, customer, leftMargin, pageWidth, rightMargin, startY, PDFUtility.SubTitleFontSize_Landscape());
      startY += PDFUtility.GapBetweenLeftTitleAndTable();
    }
    // startY += 3;
    var idx = 0;

    var grpData = InventoryAnalyzer.groupRevenueMonthlyByDate(this.repData!);


    var series: SeriesItem[] = [];
    var index: number = 1;
    var prcss: string[] = [
      ...(showPreinspectSurcharge ? [this.translatedLangText.PREINSPECTION] : []),
      ...(showLoloSurcharge ? [this.translatedLangText.LOLO] : []),
      ...(showStorageSurcharge ? [this.translatedLangText.STORAGE] : []),
      ...(showGateSurcharge ? [
        this.translatedLangText.GATE_IN,
        this.translatedLangText.GATE_OUT,
        this.translatedLangText.LIFT_ON,
        this.translatedLangText.LIFT_OFF,
      ] : []),
      ...(showSteamSurcharge ? [this.translatedLangText.STEAM] : []),
      ...(showResidueSurcharge ? [this.translatedLangText.RESIDUE] : []),
      ...(showCleanSurcharge ? [this.translatedLangText.CLEANING] : []),
      ...(showRepairSurcharge ? [this.translatedLangText.REPAIR] : []),
    ]
    var prcsValues: number[] = []
    var total_all_cost: number = 0;
    var average_counter = 0;

    // var clnCount=0,clnCost=0;
    // var stmCount=0,stmCost=0;
    // var repCount=0,repCost=0;
    // var gateCount=0,gateCost=0;
    // var loloCount=0,loloCost=0;
    // var storageCount=0,storageCost=0;
    // var residueCount=0,residueCost=0;
    // var preinspectCount=0,preinspectCost=0;

    for (const date in grpData) {
      // var total:number =(monthData.gate?.cost||0)+(monthData.lolo?.cost||0)+(monthData.storage?.cost||0)+(monthData.gate?.cost||0)
      // +(monthData.steaming?.cost||0)+(monthData.residue?.cost||0)+(monthData.cleaning?.cost||0)+(monthData.repair?.cost||0)
      // total_all_cost+=total;
      // average_counter++;
      const entry = grpData[date];
      data.push([
        (++idx).toString(), date, entry.day,
        ...(showPreinspectSurcharge ? [(entry.preinspection?.count || ''), Utility.formatNumberDisplay(entry.preinspection?.cost || '')] : []),
        ...(showLoloSurcharge ? [(entry.lolo?.count || ''), Utility.formatNumberDisplay(entry.lolo?.cost || '')] : []),
        ...(showStorageSurcharge ? [(entry.storage?.count || ''), Utility.formatNumberDisplay(entry.storage?.cost || '')] : []),

        ...(showGateSurcharge ? [
          (entry.gate?.count || ''), Utility.formatNumberDisplay(entry.gate?.cost || ''),
          // Utility.formatNumberDisplay(entry.gateInOut?.lolo?.lift_on_count),Utility.formatNumberDisplay(entry.gateInOut?.lolo?.lift_off_count)
        ] : []),
        ...(showSteamSurcharge ? [(entry.steaming?.count || ''), Utility.formatNumberDisplay(entry.steaming?.cost || '')] : []),
        ...(showResidueSurcharge ? [(entry.residue?.count || ''), Utility.formatNumberDisplay(entry.residue?.cost || '')] : []),
        ...(showCleanSurcharge ? [(entry.cleaning?.count || ''), Utility.formatNumberDisplay(entry.cleaning?.cost || '')] : []),
        ...(showRepairSurcharge ? [(entry.repair?.count || ''), Utility.formatNumberDisplay(entry.repair?.cost || '')] : []),
        // Utility.formatNumberDisplay(total)
      ]);

      // clnCount+=(entry.cleaning?.count||0);
      // clnCost+=(entry.cleaning?.cost||0)
      // stmCount+=(entry.steaming?.count||0);
      // stmCost+=(entry.steaming?.cost||0)
      // repCost+=(entry.repair?.cost||0);
      // repCount+=(entry.repair?.count||0);
      // gateCost+=(entry.gate?.cost||0);
      // gateCount+=(entry.gate?.count||0)
      // loloCost+=(entry.lolo?.cost||0);
      // loloCount+=(entry.lolo?.count||0)


      prcss.forEach(p => {
        var s = series.find(s => s.name == p);
        var bInsert = false;
        if (!s) {
          s = {
            name: p,
            data: [] // initialize with an empty array or default values
          };
          bInsert = true;
        }
        switch (p) {
          case this.translatedLangText.PREINSPECTION:
            if (showPreinspectSurcharge) s.data.push(entry.preinspection?.cost || 0);
            break;
          case this.translatedLangText.LOLO:
            if (showLoloSurcharge) s.data.push(entry.lolo?.cost || 0);
            break;
          case this.translatedLangText.STORAGE:
            if (showStorageSurcharge) s.data.push(entry.storage?.cost || 0);
            break;
          case this.translatedLangText.STEAM:
            if (showSteamSurcharge) s.data.push(entry.steaming?.cost || 0);
            break;
          case this.translatedLangText.CLEANING:
            if (showCleanSurcharge) s.data.push(entry.cleaning?.cost || 0);
            break;
          case this.translatedLangText.REPAIR:
            if (showRepairSurcharge) s.data.push(entry.repair?.cost || 0);
            break;
          case this.translatedLangText.RESIDUE:
            if (showResidueSurcharge) s.data.push(entry.residue?.cost || 0);
            break;
          case this.translatedLangText.GATE_IN:
            if (showGateSurcharge) {
              s.data.push(entry.gate?.count || 0);
              // s.data.push(entry.gateInOut?.gate.gate_out_count||0);
              // s.data.push(entry.gateInOut?.gate.lift_on_count||0);
              // s.data.push(entry.gateInOut?.gate.lift_off_count||0);
            }
            break;
          case this.translatedLangText.GATE_OUT:
            if (showGateSurcharge) {
              //s.data.push(entry.gateInOut?.gate.gate_in_count||0);
              s.data.push(entry.gate?.count || 0);
              // s.data.push(entry.gateInOut?.gate.lift_on_count||0);
              // s.data.push(entry.gateInOut?.gate.lift_off_count||0);
            }
            break;
          case this.translatedLangText.LIFT_ON:
            if (showGateSurcharge) {
              //s.data.push(entry.gateInOut?.gate.gate_in_count||0);
              // s.data.push(entry.gateInOut?.gate.gate_out_count||0);
              s.data.push(entry.lolo?.count || 0);
              // s.data.push(entry.gateInOut?.gate.lift_off_count||0);
            }
            break;
          case this.translatedLangText.LIFT_OFF:
            if (showGateSurcharge) {
              //s.data.push(entry.gateInOut?.gate.gate_in_count||0);
              // s.data.push(entry.gateInOut?.gate.gate_out_count||0);
              //s.data.push(entry.gateInOut?.gate.lift_on_count||0);
              s.data.push(entry.lolo?.count || 0);
            }
            break;
        }
        if (bInsert) {
          series.push(s);
        }
      });
    }
    data.push([
      this.translatedLangText.TOTAL, "", "",
      ...(showPreinspectSurcharge ? [
        (this.repData?.preinspection_monthly_revenue?.total_count || '0'),
        Utility.formatNumberDisplay(this.repData?.preinspection_monthly_revenue?.total_cost || '')
      ] : []),
      ...(showLoloSurcharge ? [(this.repData?.lolo_monthly_revenue?.total_count || '0'),
      Utility.formatNumberDisplay(this.repData?.lolo_monthly_revenue?.total_cost || '')
      ] : []),
      ...(showStorageSurcharge ? [(this.repData?.storage_monthly_revenue?.total_count || '0'),
      Utility.formatNumberDisplay(this.repData?.storage_monthly_revenue?.total_cost || '')
      ] : []),
      ...(showGateSurcharge ? [
        (this.repData?.gate_monthly_revenue?.total_count || '0'), Utility.formatNumberDisplay(this.repData?.gate_monthly_revenue?.total_cost || ''),
        // Utility.formatNumberDisplay(liftOnCount),Utility.formatNumberDisplay(liftOffCount),
      ] : []),
      ...(showSteamSurcharge ? [(this.repData?.steam_monthly_revenue?.total_count || '0'),
      Utility.formatNumberDisplay(this.repData?.steam_monthly_revenue?.total_cost || '')] : []),
      ...(showResidueSurcharge ? [(this.repData?.residue_monthly_revenue?.total_count || '0'),
      Utility.formatNumberDisplay(this.repData?.residue_monthly_revenue?.total_cost || '')
      ] : []),
      ...(showCleanSurcharge ? [(this.repData?.cleaning_monthly_revenue?.total_count || '0'),
      Utility.formatNumberDisplay(this.repData?.cleaning_monthly_revenue?.total_cost || '')] : []),
      ...(showRepairSurcharge ? [(this.repData?.repair_monthly_revenue?.total_count || '0'),
      Utility.formatNumberDisplay(this.repData?.repair_monthly_revenue?.total_cost || '')] : []),
      //Utility.formatNumberDisplay(total_all_cost)
    ]);

    data.push([
      this.translatedLangText.AVERAGE, "", "",
      ...(showPreinspectSurcharge ? [
        (this.repData?.preinspection_monthly_revenue?.average_count || '0'),
        Utility.formatNumberDisplay(this.repData?.preinspection_monthly_revenue?.average_cost || '')
      ] : []),
      ...(showLoloSurcharge ? [(this.repData?.lolo_monthly_revenue?.average_count || '0'),
      Utility.formatNumberDisplay(this.repData?.lolo_monthly_revenue?.average_cost || '')
      ] : []),
      ...(showStorageSurcharge ? [(this.repData?.steam_monthly_revenue?.average_count || '0'),
      Utility.formatNumberDisplay(this.repData?.steam_monthly_revenue?.average_cost || '')
      ] : []),
      ...(showGateSurcharge ? [
        (this.repData?.gate_monthly_revenue?.average_count || '0'), Utility.formatNumberDisplay(this.repData?.gate_monthly_revenue?.average_cost || ''),
        // Utility.formatNumberDisplay(liftOnCount),Utility.formatNumberDisplay(liftOffCount),
      ] : []),
      ...(showSteamSurcharge ? [(this.repData?.steam_monthly_revenue?.average_count || '0'),
      Utility.formatNumberDisplay(this.repData?.steam_monthly_revenue?.average_cost || '')] : []),
      ...(showResidueSurcharge ? [(this.repData?.residue_monthly_revenue?.average_count || '0'),
      Utility.formatNumberDisplay(this.repData?.residue_monthly_revenue?.average_cost || '')
      ] : []),
      ...(showCleanSurcharge ? [(this.repData?.cleaning_monthly_revenue?.average_count || '0'),
      Utility.formatNumberDisplay(this.repData?.cleaning_monthly_revenue?.average_cost || '')] : []),
      ...(showRepairSurcharge ? [(this.repData?.repair_monthly_revenue?.average_count || '0'),
      Utility.formatNumberDisplay(this.repData?.repair_monthly_revenue?.average_cost || '')] : []),
    ]);


    pdf.setDrawColor(0, 0, 0); // red line color

    pdf.setLineWidth(0.1);
    pdf.setLineDashPattern([0.01, 0.01], 0.1);
    // Add table using autoTable plugin
    autoTable(pdf, {
      head: headers,
      body: data,
      // startY: startY, // Start table at the current startY value
      margin: { left: leftMargin, right: rightMargin, top: startY},
      theme: 'grid',
      styles: {
        fontSize: fontSz_body,
        minCellHeight: minHeightHeaderCol

      },
      columnStyles: comStyles,
      headStyles: headStyles, // Custom header styles
      bodyStyles: {
        fillColor: [255, 255, 255],
        //halign: 'left', // Left-align content for body by default
        //valign: 'middle', // Vertically align content
      },
      didParseCell: (data: any) => {
        let totalRowIndex = data.table.body.length - 2; // Ensure the correct last row index
        let colSpan = 3;
        let averageRowIndex = data.table.body.length - 1; // Ensure the correct last row index
        // let lastColumnIndex = data.table.columns.length-1;
        // let depotCell=[6,7];
        // if(!showGateSurcharge) depotCell=[];
        if (data.section == "body" && ((data.column.index % 2) == 0)) {
          var key = `${data.row.raw[1]}`;

          var matched = 0;
          var prop = "";
          switch (data.column.index) {
            case 2:
              // if(showPreinspectSurcharge) prop="preinspection";
              if (showGateSurcharge) prop = "in_out";
              else if (showSteamSurcharge) prop = "steaming";
              else if (showCleanSurcharge) prop = "cleaning";
              else if (showRepairSurcharge) prop = "repair";
              break;
            case 6:
              if (showSteamSurcharge) prop = "steaming";
              break;
            case 8:
              if (showCleanSurcharge) prop = "cleaning";
              break;
            case 10:
              if (showRepairSurcharge) var prop = "repair";
              break;

          }
          if (prop) {
            var textColor = "";

          }
        }

        if ((data.row.index == averageRowIndex || data.row.index == totalRowIndex)) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [231, 231, 231];
          data.cell.styles.valign = 'middle'; // Center text vertically
          data.cell.fontSize = 8;
          colSpan = 1;
          //if (data.column.index>0 && data.row.index==averageRowIndex)  colSpan=2;
          if (data.column.index == 0) colSpan = 3
          if (((data.column.index % 2 == 1 && data.column.index != 1) || data.column.index == 0)) {
            data.cell.colSpan = colSpan;  // Merge 4 columns into one
            // if(data.row.index==averageRowIndex&&data.column.index!=1&&data.column.index %2==1)
            // {
            //   var cellValue = Number(data.cell.text);
            //   var negValue:boolean = cellValue<0;

            //   data.cell.text = Utility.formatNumberDisplay(Math.abs(cellValue)||"");
            //   if(negValue) 
            //     {
            //       data.cell.text =`(${data.cell.text})`;
            //       data.cell.styles.textColor =  [250, 60, 60];

            //     }

            // }
            if (data.column.index === 0) data.cell.styles.halign = 'right'; // Center text horizontally

          }

        }
        else if (data.section == "body" && data.row.raw[2] == "Sunday") {
          data.cell.styles.fillColor = [221, 221, 221];
        }


        // if (((data.row.index==averageRowIndex)) && (data.column.index%2==0)&&(data.column.index>0)
        // ) {
        //   data.cell.text = ''; // Remove text from hidden columns
        //   data.cell.colSpan = 0; // Hide these columns
        // }
      },
      didDrawPage: (d: any) => {
        const pageCount = pdf.getNumberOfPages();

        lastTableFinalY = d.cursor.y;

        var pg = pagePositions.find(p => p.page == pageCount);
        if (!pg) {
          pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
          if (pageCount > 1) {
            PDFUtility.addReportTitle_Landscape(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
            PDFUtility.addReportSubTitle_Landscape(pdf, repGeneratedDate, pageWidth, leftMargin, rightMargin,subtitlePos);
            // Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 45);
            // Utility.AddTextAtCenterPage(pdf, repGeneratedDate, pageWidth, leftMargin, rightMargin + 5, 48 - 1, PDFUtility.CenterSubTitleFontSize());
          }
        }

      },
    });

    var labelStyle = {
      style: {
        fontSize: '8px',     // Adjust font size here (e.g., '12px', '14px')
        colors: '#9aa0ac',
      }
    };



    var catgries = Object.keys(grpData) as string[];
    var shortCat =catgries.map(date => {
    // Split by '/' and take the first part (dd)
    return date.split('/')[0];
  });
    // var x
    this.lineChartOptions.xaxis = {
      categories: shortCat,
      labels: labelStyle
    };

    //this.lineChartOptions.colors=this.colors?.slice(0,catgries.length);

    this.lineChartOptions.series = series;
    this.lineChartOptions.colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f",
      "#bcbd22", "#17becf", "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173"];

    if (!showPreinspectSurcharge) { this.lineChartOptions.series = this.lineChartOptions.series.filter((s: { name: string }) => !["Preinspection"].includes(s.name)); }
    if (!showLoloSurcharge) { this.lineChartOptions.series = this.lineChartOptions.series.filter((s: { name: string }) => !["LOLO"].includes(s.name)); }
    if (!showStorageSurcharge) { this.lineChartOptions.series = this.lineChartOptions.series.filter((s: { name: string }) => !["Storage"].includes(s.name)); }
    if (!showGateSurcharge) {
      this.lineChartOptions.series = this.lineChartOptions.series.filter((s: { name: string }) => !["Gate In"].includes(s.name));
      this.lineChartOptions.series = this.lineChartOptions.series.filter((s: { name: string }) => !["Gate Out"].includes(s.name));
      this.lineChartOptions.series = this.lineChartOptions.series.filter((s: { name: string }) => !["Lift On"].includes(s.name));
      this.lineChartOptions.series = this.lineChartOptions.series.filter((s: { name: string }) => !["Lift Off"].includes(s.name));
    }
    if (!showSteamSurcharge) { this.lineChartOptions.series = this.lineChartOptions.series.filter((s: { name: string }) => !["Steam"].includes(s.name)); }

    if (!showCleanSurcharge) { this.lineChartOptions.series = this.lineChartOptions.series.filter((s: { name: string }) => !["Cleaning"].includes(s.name)); }
    if (!showRepairSurcharge) { this.lineChartOptions.series = this.lineChartOptions.series.filter((s: { name: string }) => !["Repair"].includes(s.name)); }


    // this.pieChartOptions.labels=prcss;
    // this.pieChartOptions.series2=prcsValues;
    //this.pieChartOptions.colors=this.colors;


    setTimeout(async () => {

      startY = lastTableFinalY + 10;
      let chartContentWidth = pageWidth - leftMargin - rightMargin;
      const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
      for (var i = 0; i < cardElements.length; i++) {
        {
          pdf.addPage();
          // Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 45);
          PDFUtility.addReportTitle_Landscape(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
          startY= PDFUtility.addReportSubTitle_Landscape(pdf, repGeneratedDate, pageWidth, leftMargin, rightMargin,subtitlePos);
          startY+= PDFUtility.GapBetweenSubTitleAndTable_Landscape();
          pagePositions.push({ page: pdf.getNumberOfPages(), x: 0, y: 0 });
          // startY = topMargin + 50;
        }
        const card1 = cardElements[i];
        await Utility.DrawCardForImageAtCenterPage(pdf, card1, pageWidth, leftMargin, rightMargin, startY, chartContentWidth, this.imageQuality);
        // const canvas1 = await html2canvas(card1, { scale: scale });
        // Utility.DrawImageAtCenterPage(pdf,canvas1,pageWidth,leftMargin,rightMargin,startY,chartContentWidth, this.imageQuality);

      }

       await PDFUtility.addFooterWithPageNumberAndCompanyLogo_Landscape(pdf, pageWidth, topMargin, bottomMargin, leftMargin, 
      rightMargin, this.translate,pagePositions);

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
      //   pdf.setLineDashPattern([0.01, 0.01], 0.1);
      //   pdf.setFontSize(8);
      //   pdf.setPage(page);
      //   var lineBuffer = 13;
      //   pdf.text(`Page ${page} of ${totalPages}`, pdf.internal.pageSize.width - 20, pdf.internal.pageSize.height - 10, { align: 'right' });
      //   pdf.line(leftMargin, pdf.internal.pageSize.height - lineBuffer, (pageWidth - rightMargin), pdf.internal.pageSize.height - lineBuffer);
      // });

      //  this.generatingPdfProgress = 100;
      //pdf.save(fileName);
      //  this.generatingPdfProgress = 0;
      this.generatingPdfLoadingSubject.next(false);
      Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
      this.dialogRef.close();

    }, 500);

    // this.dialogRef.close();
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
    title = `${this.translatedLangText.MONTHLY_REVENUE_REPORT}`;
    return `${title}`
  }

  // displayLocation(yard: report_status_yard): string {
  //   return this.cvDS.getCodeDescription(yard.code, this.yardCvList) || '';;
  // }
  // displayInYardTotal(yard: report_status_yard): number {
  //   var total = 0;

  //   total = (yard.noTank_storage || 0) + (yard.noTank_clean || 0) + (yard.noTank_steam || 0) + (yard.noTank_repair || 0);
  //   return total;

  // }

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

  InitChartValues() {
    // this.pieChartOptions = {
    //   colors: this.colors,
    //   title: {
    //     text: this.translatedLangText.SUMMARY_OF_INVENTORY,
    //     align: 'center',
    //   },
    //   chart: {
    //     height: 450,
    //     type: 'pie',
    //     foreColor: '#9aa0ac',
    //     toolbar: {
    //       show: false,
    //     },
    //     animations: {
    //       enabled: false, // <-- disables all animations
    //     },
    //   },
    //   labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    //   series2: [44, 55, 13, 43, 22],
    //   legend:{
    //     fontSize:'14px',
    //     // position: "bottom",
    //     // horizontalAlign: "center",
    //     // itemMargin: { horizontal: 15, vertical: 5 }, // Adjusts spacing between items
    //     labels: {
    //       colors: "#333", // Set label text color
    //       useSeriesColors: false, // Use the color of the series for labels
    //   //    padding: 10, // Adjust space between marker and label
    //     },

    //   },

    // };

    this.lineChartOptions = {
      colors: this.colors,
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
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      series: [
        // {
        //   name: 'High - 2013',
        //   data: [28, 29, 33, 36, 32, 32, 33],
        // },
        // {
        //   name: 'Low - 2013',
        //   data: [12, 11, 14, 18, 17, 13, 13],
        // },
      ],
      title: {
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      markers: {
        size: 3, // ✅ shows a visible dot
        strokeWidth: 0,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        labels: {
          style: {
            fontSize: '16px',     // Adjust font size here (e.g., '12px', '14px')
            fontWeight: 600,      // Boldness (400 = normal, 700 = bold)
            colors: '#FF0000',    // Single color for all labels (or array for per-label colors)
            fontFamily: 'Arial'   // Optional: Change font type
          }
        }
      },
      yaxis: {
        title: {
          text: 'Temperature',
        },
        labels: {
          style: {
            colors: ['#9aa0ac'],
          },
        },
        min: 5,
        max: 40,
      },
      legend: {
        fontSize: '14px',
        position: "bottom",
        horizontalAlign: "center",
        itemMargin: { horizontal: 10, vertical: 5 }, // Adjusts spacing between items
        labels: {
          colors: "#333", // Set label text color
          useSeriesColors: false, // Use the color of the series for labels
          //    padding: 10, // Adjust space between marker and label
        },

      },
      // legend: {
      //   position: 'top',
      //   horizontalAlign: 'right',
      //   floating: true,
      //   offsetY: -25,
      //   offsetX: -5,
      // },
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

}
