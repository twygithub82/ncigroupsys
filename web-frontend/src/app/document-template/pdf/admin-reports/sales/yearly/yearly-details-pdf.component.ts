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
import { ManagementReportYearlyRevenueItem, MonthlyProcessData,InventoryAnalyzer, ManagementReportYearlyInventory  } from 'app/data-sources/reports-management';

// import { fileSave } from 'browser-fs-access';

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
import { E } from '@angular/cdk/keycodes';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { report_status_yard} from 'app/data-sources/reports';
import {PDFUtility} from 'app/utilities/pdf-utility';

interface SeriesItem {
  name: string;
  data: number[];
}


export interface DialogData {
  repData: ManagementReportYearlyRevenueItem,
  date:string,
  repType:string,
  customer:string,
  inventory_type:string[],
  report_name:string
}

@Component({
  selector: 'app-yearly-report-details-pdf',
  templateUrl: './yearly-details-pdf.component.html',
  styleUrls: ['./yearly-details-pdf.component.scss'],
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
    BaseChartDirective
  ],
})
export class YearlySalesReportDetailsPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    STEAM_YEARLY_DETAILS_REPORT:'COMMON-FORM.STEAM-YEARLY-DETAILS-REPORT',
    RESIDUE_YEARLY_DETAILS_REPORT:'COMMON-FORM.RESIDUE-YEARLY-DETAILS-REPORT',
    REPAIR_YEARLY_DETAILS_REPORT:'COMMON-FORM.REPAIR-YEARLY-DETAILS-REPORT',
    CLEAN_YEARLY_DETAILS_REPORT:'COMMON-FORM.CLEAN-YEARLY-DETAILS-REPORT',
    YEARLY_SALES_REPORT:'COMMON-FORM.YEARLY-SALES-REPORT',
    DAY:'COMMON-FORM.DAY',
    MONTH:'COMMON-FORM.MONTH',
    AVERAGE:'COMMON-FORM.AVERAGE',
    PREINSPECTION:'COMMON-FORM.PREINSPECTION',
    LOLO:'COMMON-FORM.LOLO',
    TANK:'COMMON-FORM.TANK',
    COST:'COMMON-FORM.COST',
    S_N:'COMMON-FORM.S_N',
    MASTER:'COMMON-FORM.MASTER',
    GATE_SURCHARGE: 'COMMON-FORM.GATE-SURCHARGE'
    
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
  repData?: ManagementReportYearlyRevenueItem;
  date?:string;
  repType?:string;
  index: number = 0;
  customer?:string;
  invTypes?:string[]=[];
  repName?:string;
  // date:string='';
  // invType:string='';
 //public barChartOptions!: Partial<ChartOptions>;

 lineChartData: ChartConfiguration['data'] = {
      datasets: [
        {
          label: 'Foods',
          data: [0, 30, 10, 120, 50, 63, 10],
          backgroundColor: 'transparent',
          borderColor: '#9f78ff',
          borderWidth: 2,
          fill: false,
          tension: 0.5,
          pointStyle: 'circle',
          pointRadius: 3,
          pointBorderColor: 'transparent',
          pointBackgroundColor: '#222222',
        },
        {
          label: 'Electronics',
          data: [0, 50, 40, 80, 40, 79, 120],
          backgroundColor: 'transparent',
          borderColor: '#f96332',
          borderWidth: 2,
          fill: false,
          tension: 0.5,
          pointStyle: 'circle',
          pointRadius: 3,
          pointBorderColor: 'transparent',
          pointBackgroundColor: '#f96332',
        },
      ],
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    };
  
    lineChartOpts: ChartConfiguration['options'] = {
      responsive: true,
      animation: false, // 👈 disables all animations
      elements: {
        line: {
          tension: 0.5,
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: '', // <- your label here
            color: '#9aa0ac',
            font: {
              size: 14,
            },
          },
          position: 'left',
          ticks: {
            color: '#9aa0ac', // Font Color
          },
        },
        x: {
          ticks: {
            color: '#9aa0ac', // Font Color
          },
        },
      },
  
      plugins: {
        legend: {
          display: true,
          // 👇 Customize legend appearance
          labels: {
            font: {
              size: 9, // Font size (default: 10)
              family: "'Helvetica Neue', 'Arial', sans-serif", // Optional
            },
            padding: 9, // Space between legend items (default: 10)
            boxWidth: 11, // Width of the color box (default: 12)
            boxHeight: 11, // Height of the color box (default: 12)
            // usePointStyle: true, // Uses pointStyle from dataset (e.g., circles)
          },
        },
      },
    };


  constructor(
    public dialogRef: MatDialogRef<YearlySalesReportDetailsPdfComponent>,
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
    // this.repair_guid = data.repair_guid;
    // this.customer_company_guid = data.customer_company_guid;
    // this.estimate_no = data.estimate_no;
    // this.existingPdf = data.existingPdf;


    this.InitialDefaultData();
    this.disclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  async ngOnInit() {
    await this.getCodeValuesData();
    //this.pdfTitle = this.type === "REPAIR" ? this.translatedLangText.IN_SERVICE_ESTIMATE : this.translatedLangText.OFFHIRE_ESTIMATE;
    this.repData = this.data.repData;
    this.date= this.data.date;
    this.repType=this.data.repType;
    this.customer=this.data.customer;
    this.invTypes=this.data.inventory_type;
    this.repName=this.data.report_name;
   // this.SetChartValues();
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
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
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

    const pdf = new jsPDF('l', 'mm', 'a4');
    //const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    let pageNumber = 1;

    

    let reportTitleCompanyLogo = 32;
    let tableHeaderHeight = 12;
    let tableRowHeight = 8.5;
    let minHeightBodyCell = 5;
    let minHeightHeaderCol = 3;
    let fontSz = 7;
    const pagePositions: { page: number; x: number; y: number }[] = [];
    // const progressValue = 100 / cardElements.length;

    let showPreinspectSurcharge:boolean=this.invTypes?.includes("PREINSPECTION")!;
    let showLoloSurcharge:boolean=this.invTypes?.includes("LOLO")!;
    let showStorageSurcharge:boolean=this.invTypes?.includes("STORAGE")!;
    let showGateSurcharge:boolean=this.invTypes?.includes("IN_OUT")!;
    let showResidueSurcharge:boolean=this.invTypes?.includes("RESIDUE")!;
    let showSteamSurcharge:boolean=this.invTypes?.includes("STEAMING")!;
    let showCleanSurcharge:boolean=this.invTypes?.includes("CLEANING")!;
    let showRepairSurcharge:boolean =this.invTypes?.includes("REPAIR")!;
    const reportTitle = this.GetReportTitle();
    const vAlign ="bottom"
    const headers = [[
      { content: this.translatedLangText.S_N, rowSpan: 2, styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.MONTH, rowSpan: 2, styles: { halign: 'center', valign: vAlign } },
      ...(showGateSurcharge? [{ content: this.translatedLangText.GATEIO, colSpan: 2, styles: { halign: 'center', valign: vAlign } }]:[]),
      ...(showPreinspectSurcharge?[{ content: this.translatedLangText.PREINSPECTION, colSpan: 2, styles: { halign: 'center', valign: vAlign } }]:[]),
      ...(showLoloSurcharge? [{ content: this.translatedLangText.LOLO, colSpan: 2, styles: { halign: 'center', valign: vAlign } }]:[]),
      ...(showStorageSurcharge? [{ content: this.translatedLangText.STORAGE, colSpan: 2, styles: { halign: 'center', valign: vAlign } }]:[]),
      ...(showSteamSurcharge? [ { content: this.translatedLangText.STEAM, colSpan: 2, styles: { halign: 'center' } }]:[]),
      ...(showResidueSurcharge? [ { content: this.translatedLangText.RESIDUE, colSpan: 2, styles: { halign: 'center' } }]:[]),
      ...(showCleanSurcharge? [ { content: this.translatedLangText.CLEANING, colSpan: 2, styles: { halign: 'center' } }]:[]),
      ...(showRepairSurcharge? [{ content: this.translatedLangText.REPAIR, colSpan: 2, styles: { halign: 'center', valign: vAlign }}]:[]),
      { content: this.translatedLangText.TOTAL, rowSpan: 2, styles: { halign: 'center', valign: vAlign } },

    ],
    [
      // Empty cells for the first 5 columns (they are spanned by rowSpan: 2)
      ...(showPreinspectSurcharge?[this.translatedLangText.TANK, this.translatedLangText.COST]:[]), // Sub-headers for preinspection
      ...(showLoloSurcharge?[this.translatedLangText.TANK, this.translatedLangText.COST]:[]), // Sub-headers for LOLO
      ...(showStorageSurcharge?[this.translatedLangText.TANK, this.translatedLangText.COST]:[]), // Sub-headers for storage
      ...(showGateSurcharge?[this.translatedLangText.TANK, this.translatedLangText.COST]:[]), // Sub-headers for GATE_SURCHARGE
      ...(showSteamSurcharge?[this.translatedLangText.TANK, this.translatedLangText.COST]:[]), // Sub-headers for STEAM
      ...(showResidueSurcharge?[this.translatedLangText.TANK, this.translatedLangText.COST]:[]), // Sub-headers for residue
      ...(showCleanSurcharge?[this.translatedLangText.TANK, this.translatedLangText.COST]:[]), // Sub-headers for RESIDUE
      ...(showRepairSurcharge?[this.translatedLangText.TANK, this.translatedLangText.COST]:[]), // Sub-headers for CLEANING
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
      7: { halign: 'center', valign: 'middle',  minCellHeight: minHeightBodyCell },
      8: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      9: { halign: 'center', valign: 'middle',  minCellHeight: minHeightBodyCell },
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
      halign: 'center', // Centering header text
      valign: 'middle',
      lineColor: 201,
      lineWidth: 0.1
    };

    let currentY = topMargin;
    let scale = 2.5;
    let imgQuality = 0.7;
    pagePositions.push({ page: pageNumber, x: pageWidth - rightMargin, y: pageHeight - bottomMargin / 1.5 });


    await Utility.addHeaderWithCompanyLogo_Landscape(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    await Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 35);

    // Variable to store the final Y position of the last table
    let lastTableFinalY = 40;

    let startY = lastTableFinalY + 13; // Start table 20mm below the customer name
    const data: any[][] = []; // Explicitly define data as a 2D array
   
    const repGeneratedDate = `${this.date}`; // Replace with your actual cutoff date
    Utility.AddTextAtCenterPage(pdf, repGeneratedDate, pageWidth, leftMargin, rightMargin + 5, startY - 5, 11);

    if(this.customer)
    {
      const customer=`${this.translatedLangText.CUSTOMER} : ${this.customer}`
      Utility.addText(pdf, customer,startY - 2 , leftMargin+4, 9);
    }
    var idx = 0;

    var grpData= InventoryAnalyzer.groupByMonthAndFindExtremesRevenue(this.repData!);
   

    var series:SeriesItem[]=[];
    var index:number=1;
    var prcss:string[]=[
      ...(showGateSurcharge? [this.translatedLangText.GATE_SURCHARGE]:[]),
      ...(showPreinspectSurcharge?[this.translatedLangText.PREINSPECTION]:[]),
      ...(showLoloSurcharge? [  this.translatedLangText.LOLO]:[]),
      ...(showStorageSurcharge? [this.translatedLangText.STORAGE]:[]),
      ...(showSteamSurcharge? [ this.translatedLangText.STEAM]:[]),
      ...(showResidueSurcharge? [ this.translatedLangText.RESIDUE]:[]),
      ...(showCleanSurcharge? [ this.translatedLangText.CLEANING]:[]),
      ...(showRepairSurcharge? [this.translatedLangText.REPAIR]:[]),
    ]
    var prcsValues:number[]=[]
    var total_all_cost:number=0;
    var average_counter=0;
    for (const monthData of grpData.monthlyData) {
      var total:number =(monthData.in_out?.cost||0)+(monthData.lolo?.cost||0)+(monthData.storage?.cost||0)+(monthData.in_out?.cost||0)
      +(monthData.steaming?.cost||0)+(monthData.residue?.cost||0)+(monthData.cleaning?.cost||0)+(monthData.repair?.cost||0)
      total_all_cost+=total;
      average_counter++;
      data.push([
        (++idx).toString(),monthData.key,
        ...(showGateSurcharge?[ monthData.in_out?.count||'',Utility.formatNumberDisplay(monthData.in_out?.cost)]:[]),
        ...(showPreinspectSurcharge?[ monthData.preinspection?.count||'',Utility.formatNumberDisplay(monthData.preinspection?.cost)]:[]),
        ...(showLoloSurcharge?[ monthData.lolo?.count||'',Utility.formatNumberDisplay(monthData.lolo?.cost)]:[]),
        ...(showStorageSurcharge?[ monthData.storage?.count||'',Utility.formatNumberDisplay(monthData.storage?.cost)]:[]),
        ...(showSteamSurcharge?[ monthData.steaming?.count||'',Utility.formatNumberDisplay(monthData.steaming?.cost)]:[]),
        ...(showResidueSurcharge?[ monthData.residue?.count||'',Utility.formatNumberDisplay(monthData.residue?.cost)]:[]),
        ...(showCleanSurcharge?[monthData.cleaning?.count||'',Utility.formatNumberDisplay(monthData.cleaning?.cost)]:[]),
        ...(showRepairSurcharge?[monthData.repair?.count||'',Utility.formatNumberDisplay(monthData.repair?.cost)]:[]),
        Utility.formatNumberDisplay(total)
      ]);

      prcss.forEach(p=>{
        var s = series.find(s=>s.name==p);
        var bInsert=false;
        if(!s)
        {
          s={
            name: p,
            data: [] // initialize with an empty array or default values
          };
          bInsert=true;
        }
        switch (p)
        {
          case this.translatedLangText.GATE_SURCHARGE:
            if(showGateSurcharge)  s.data.push(monthData.in_out?.cost||0);
          break;
          case this.translatedLangText.PREINSPECTION:
           if(showPreinspectSurcharge) s.data.push(monthData.preinspection?.cost||0);
          break;
          case this.translatedLangText.LOLO:
            if(showLoloSurcharge) s.data.push(monthData.lolo?.cost||0);
          break;
          case this.translatedLangText.STORAGE:
            if(showStorageSurcharge) s.data.push(monthData.storage?.cost||0);
          break;
          case this.translatedLangText.STEAM:
            if(showSteamSurcharge) s.data.push(monthData.steaming?.cost||0);
          break;
          case this.translatedLangText.CLEANING:
            if(showCleanSurcharge) s.data.push(monthData.cleaning?.cost||0);
          break;
          case this.translatedLangText.REPAIR:
            if(showRepairSurcharge)  s.data.push(monthData.repair?.cost||0);
          break;
          case this.translatedLangText.RESIDUE:
            if(showResidueSurcharge) s.data.push(monthData.residue?.cost||0);
          break;
        
        }
        if(bInsert)
        {
          series.push(s);
        }
      });
    }
    data.push([
      this.translatedLangText.TOTAL,"",
      ...(showGateSurcharge?[Utility.formatNumberDisplay(this.repData?.gate_yearly_revenue?.total_cost),'']:[]),
      ...(showPreinspectSurcharge?[Utility.formatNumberDisplay(this.repData?.preinspection_yearly_revenue?.total_cost),'']:[]),
      ...(showLoloSurcharge?[Utility.formatNumberDisplay(this.repData?.lolo_yearly_revenue?.total_cost),'']:[]),
      ...(showStorageSurcharge?[Utility.formatNumberDisplay(this.repData?.storage_yearly_revenue?.total_cost),'']:[]),
      ...(showSteamSurcharge?[Utility.formatNumberDisplay(this.repData?.steam_yearly_revenue?.total_cost),'']:[]),
      ...(showResidueSurcharge?[Utility.formatNumberDisplay(this.repData?.residue_yearly_revenue?.total_cost),'']:[]),
      ...(showCleanSurcharge?[Utility.formatNumberDisplay(this.repData?.cleaning_yearly_revenue?.total_cost),'']:[]),
      ...(showRepairSurcharge?[Utility.formatNumberDisplay(this.repData?.repair_yearly_revenue?.total_cost),'']:[]),
      Utility.formatNumberDisplay(total_all_cost)
    ]);

    data.push([
      this.translatedLangText.AVERAGE,"",
      ...(showGateSurcharge?[Utility.formatNumberDisplay(this.repData?.gate_yearly_revenue?.average_cost||''),'']:[]),
      ...(showPreinspectSurcharge?[Utility.formatNumberDisplay(this.repData?.preinspection_yearly_revenue?.average_cost||''),'']:[]),
      ...(showLoloSurcharge?[Utility.formatNumberDisplay(this.repData?.lolo_yearly_revenue?.average_cost||''),'']:[]),
      ...(showStorageSurcharge?[Utility.formatNumberDisplay(this.repData?.storage_yearly_revenue?.average_cost||''),'']:[]),
      ...(showSteamSurcharge?[Utility.formatNumberDisplay(this.repData?.steam_yearly_revenue?.average_cost||''),'']:[]),
      ...(showResidueSurcharge?[Utility.formatNumberDisplay(this.repData?.residue_yearly_revenue?.average_cost||''),'']:[]),
      ...(showCleanSurcharge?[Utility.formatNumberDisplay(this.repData?.cleaning_yearly_revenue?.average_cost||''),'']:[]),
      ...(showRepairSurcharge?[Utility.formatNumberDisplay(this.repData?.repair_yearly_revenue?.average_cost||''),'']:[]),  
      Utility.formatNumberDisplay((total_all_cost/average_counter))
    ]);
    
    prcsValues=[
      ...(showGateSurcharge?[(this.repData?.gate_yearly_revenue?.total_cost||0)]:[]),
      ...(showPreinspectSurcharge?[(this.repData?.preinspection_yearly_revenue?.total_cost||0)]:[]),
      ...(showLoloSurcharge?[(this.repData?.lolo_yearly_revenue?.total_cost||0)]:[]),
      ...(showStorageSurcharge?[(this.repData?.storage_yearly_revenue?.total_cost||0)]:[]),
      ...(showSteamSurcharge?[(this.repData?.steam_yearly_revenue?.total_cost||0)]:[]),
      ...(showResidueSurcharge?[(this.repData?.residue_yearly_revenue?.total_cost||0)]:[]),
      ...(showCleanSurcharge?[(this.repData?.cleaning_yearly_revenue?.total_cost||0)]:[]),
      ...(showRepairSurcharge?[(this.repData?.repair_yearly_revenue?.total_cost||0)]:[]) ];

    pdf.setDrawColor(0, 0, 0); // red line color

    pdf.setLineWidth(0.1);
    pdf.setLineDashPattern([0.001, 0.001], 0);
    // Add table using autoTable plugin
    autoTable(pdf, {
      head: headers,
      body: data,
      startY: startY, // Start table at the current startY value
      theme: 'grid',
      tableWidth: 'auto',
      styles: {
        fontSize: fontSz,
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
        let colSpan=2;
        let averageRowIndex= data.table.body.length - 1; // Ensure the correct last row index
        let lastColumnIndex = data.table.columns.length-1;
        // let depotCell=[6,7];
        // if(!showGateSurcharge) depotCell=[];
        if(data.section=="body" && ((data.column.index%2)==0) &&(lastColumnIndex!=data.column.index))
        {
           var key = `${data.row.raw[1]}`;
          
           var matched=0;
           var prop="";
           switch (data.column.index)
           {
             case 2:
              if(showGateSurcharge) prop="in_out";
              else if(showPreinspectSurcharge) prop="preinspection";
              else if(showSteamSurcharge) prop="steaming";
              else if(showCleanSurcharge) prop="cleaning";
              else if(showRepairSurcharge) prop="repair";
              else if(showResidueSurcharge) prop="residue";
              else if(showLoloSurcharge) prop="lolo";
              else if(showStorageSurcharge) prop="storage";
               break;
             case 4:
              if(showLoloSurcharge) prop="preinspection";
              break;
             case 6:
              if(showStorageSurcharge) prop="lolo"; //storage";
              break;
            case 8:
              if(showGateSurcharge)prop="storage";
               break;
            case 10:
              if(showSteamSurcharge)prop="steaming";
              break;
            case 12:
                if(showResidueSurcharge)prop="residue";
                break;
            case 14:
                if(showCleanSurcharge)prop="cleaning";
                break;
            case 16:
              if(showRepairSurcharge)prop="repair";
              break;
           }
           if(prop)
           {
             var textColor="";
            if(grpData.processExtremes[prop].highest?.key==key)
              {
               // textColor="#009F00";
              }
              else if(grpData.processExtremes[prop].lowest?.key==key)
              {
               // textColor="#EF0000";
              }
              if(textColor)
              {
                data.cell.styles.textColor=textColor;
              }
          }
        }
        if((data.row.index==totalRowIndex ||data.row.index==averageRowIndex)){
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor=[231, 231, 231];
          data.cell.styles.valign = 'middle'; // Center text vertically
          data.cell.fontSize=8;
          if (data.column.index %2==0 &&(lastColumnIndex!=data.column.index)) {
            data.cell.colSpan = colSpan;  // Merge 4 columns into one
            if(data.column.index === 0) data.cell.styles.halign = 'right'; // Center text horizontally
            
          }
        
        }
        // else if (depotCell.includes(data.column.index))
        // {
        //   var dpWidth=10
        //   data.cell.colSpan = colSpan;
        //   data.column.width = `${dpWidth}px`;  // Add unit
        //   data.column.minWidth = dpWidth;
        //   data.column.maxWidth = dpWidth;
        // }

        if (((data.row.index==totalRowIndex)||(data.row.index==averageRowIndex)) 
          && (data.column.index%2==1)//((data.column.index > 0 && data.column.index < colSpan)||(data.column.index%2==))
        ) {
          data.cell.text = ''; // Remove text from hidden columns
          data.cell.colSpan = 0; // Hide these columns
        }
      },
      didDrawPage: (d: any) => {
        const pageCount = pdf.getNumberOfPages();

        lastTableFinalY = d.cursor.y;

        var pg = pagePositions.find(p => p.page == pageCount);
        if (!pg) {
          pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
          if (pageCount > 1) {
            Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin);
          }
        }

      },
    });

    var catgries=grpData.monthlyData.map((mData: {key?: string}) => mData.key || "") as string[]
    // var x
    // this.lineChartOptions.xaxis={
    //   categories: catgries,
    // };

    //this.lineChartOptions.colors=this.colors?.slice(0,catgries.length);

    // this.lineChartOptions.series=series;

    
    
      

     
    

    var colors =  [ "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", 
      "#bcbd22", "#17becf", "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173"];

    this.lineChartData.datasets=[];
    this.lineChartData.labels=[];
    var ds=[];
    var cats=[];
    var indx=0;
    if(showPreinspectSurcharge){
      var lbl="Pre-Inspection";
      var s = series.filter((s:{ name: string })=>[lbl].includes(s.name));
      ds.push({
        label:lbl,
        data:s[0].data,
        backgroundColor: 'transparent',
        borderColor: colors[indx],
        borderWidth: 2,
        fill: false,
        tension: 0.5,
        pointStyle: 'circle',
        pointRadius: 3,
        pointBorderColor: 'transparent',
        pointBackgroundColor: colors[indx++],
      });
    
    }
    if(showLoloSurcharge){
      var lbl="LOLO";
      var s = series.filter((s:{ name: string })=>[lbl].includes(s.name));
      ds.push({
        label:lbl,
        data:s[0].data,
        backgroundColor: 'transparent',
        borderColor: colors[indx],
        borderWidth: 2,
        fill: false,
        tension: 0.5,
        pointStyle: 'circle',
        pointRadius: 3,
        pointBorderColor: 'transparent',
        pointBackgroundColor: colors[indx++],
      });
      
    }

    if(showStorageSurcharge){
      var lbl="Storage";
      var s = series.filter((s:{ name: string })=>[lbl].includes(s.name));
      ds.push({
        label:lbl,
        data:s[0].data,
        backgroundColor: 'transparent',
        borderColor: colors[indx],
        borderWidth: 2,
        fill: false,
        tension: 0.5,
        pointStyle: 'circle',
        pointRadius: 3,
        pointBorderColor: 'transparent',
        pointBackgroundColor: colors[indx++],
      });
      
      }
    if(showGateSurcharge){
      var lbl=`${this.translatedLangText.GATE_SURCHARGE}`;
      var s = series.filter((s:{ name: string })=>[lbl].includes(s.name));
      ds.push({
        label:lbl,
        data:s[0].data,
        backgroundColor: 'transparent',
        borderColor: colors[indx],
        borderWidth: 2,
        fill: false,
        tension: 0.5,
        pointStyle: 'circle',
        pointRadius: 3,
        pointBorderColor: 'transparent',
        pointBackgroundColor: colors[indx++],
      });
      
      }
    if(showSteamSurcharge){
      var lbl="Steam";
      var s = series.filter((s:{ name: string })=>[lbl].includes(s.name));
      ds.push({
        label:lbl,
        data:s[0].data,
        backgroundColor: 'transparent',
        borderColor: colors[indx],
        borderWidth: 2,
        fill: false,
        tension: 0.5,
        pointStyle: 'circle',
        pointRadius: 3,
        pointBorderColor: 'transparent',
        pointBackgroundColor: colors[indx++],
      });
      
      }
    if(showResidueSurcharge){
      var lbl="Residue";
      var s = series.filter((s:{ name: string })=>[lbl].includes(s.name));
      ds.push({
        label:lbl,
        data:s[0].data,
        backgroundColor: 'transparent',
        borderColor: colors[indx],
        borderWidth: 2,
        fill: false,
        tension: 0.5,
        pointStyle: 'circle',
        pointRadius: 3,
        pointBorderColor: 'transparent',
        pointBackgroundColor: colors[indx++],
      });
      
      }
      if(showCleanSurcharge){
        var lbl="Cleaning";
        var s = series.filter((s:{ name: string })=>[lbl].includes(s.name));
        ds.push({
          label:lbl,
          data:s[0].data,
          backgroundColor: 'transparent',
          borderColor: colors[indx],
          borderWidth: 2,
          fill: false,
          tension: 0.5,
          pointStyle: 'circle',
          pointRadius: 3,
          pointBorderColor: 'transparent',
          pointBackgroundColor: colors[indx++],
        });
        
        }
        if(showRepairSurcharge){
          var lbl="Repair";
          var s = series.filter((s:{ name: string })=>[lbl].includes(s.name));
          ds.push({
            label:lbl,
            data:s[0].data,
            backgroundColor: 'transparent',
            borderColor: colors[indx],
            borderWidth: 2,
            fill: false,
            tension: 0.5,
            pointStyle: 'circle',
            pointRadius: 3,
            pointBorderColor: 'transparent',
            pointBackgroundColor: colors[indx++],
          });
          
          }
      this.lineChartData.datasets=ds;
      this.lineChartData.labels=catgries;
      this.chart?.data!=this.lineChartData;
      this.chart?.update();

    // if(!showPreinspectSurcharge){this.lineChartOptions.series=this.lineChartOptions.series.filter((s:{ name: string })=>!["Preinspection"].includes(s.name));}
    // if(!showLoloSurcharge){this.lineChartOptions.series=this.lineChartOptions.series.filter((s:{ name: string })=>!["LOLO"].includes(s.name));}
    // if(!showStorageSurcharge){this.lineChartOptions.series=this.lineChartOptions.series.filter((s:{ name: string })=>!["Storage"].includes(s.name));}
    // if(!showGateSurcharge){this.lineChartOptions.series=this.lineChartOptions.series.filter((s:{ name: string })=>!["Gate"].includes(s.name));}
    // if(!showSteamSurcharge){this.lineChartOptions.series=this.lineChartOptions.series.filter((s:{ name: string })=>!["Steam"].includes(s.name));}
    // if(!showResidueSurcharge){this.lineChartOptions.series=this.lineChartOptions.series.filter((s:{ name: string })=>!["Residue"].includes(s.name));}
    // if(!showCleanSurcharge){this.lineChartOptions.series=this.lineChartOptions.series.filter((s:{ name: string })=>!["Cleaning"].includes(s.name));}
    // if(!showRepairSurcharge){this.lineChartOptions.series=this.lineChartOptions.series.filter((s:{ name: string })=>!["Repair"].includes(s.name));}

    
    // this.pieChartOptions.labels=prcss;
    // this.pieChartOptions.series2=prcsValues;
    //this.pieChartOptions.colors=this.colors;


 setTimeout(async()=>{

  startY=lastTableFinalY+10;
  let chartContentWidth = pageWidth - leftMargin - rightMargin;
  const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
  for (var i = 0; i < cardElements.length; i++) {
    if (i >= 0) {
      pdf.addPage();
      Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 8);
      pagePositions.push({ page: pdf.getNumberOfPages(), x: 0, y: 0 });
      startY=topMargin+20;
    }
    const card1 = cardElements[i];
    const canvas1 = await html2canvas(card1, { scale: scale });
    Utility.DrawImageAtCenterPage(pdf,canvas1,pageWidth,leftMargin,rightMargin,startY,chartContentWidth, imgQuality);
   
  }

    const totalPages = pdf.getNumberOfPages();

    let lineOffset = 0;
    pagePositions.forEach(({ page, x, y }) => {
      pdf.setDrawColor(0, 0, 0); // black line color
      pdf.setLineWidth(0.1);
      pdf.setLineDashPattern([0.001, 0.001], 0);
      pdf.setFontSize(8);
      pdf.setPage(page);
      var lineBuffer = 13;
      pdf.text(`Page ${page} of ${totalPages}`, pdf.internal.pageSize.width - 14, pdf.internal.pageSize.height - 8, { align: 'right' });
      pdf.line(leftMargin + lineOffset, pdf.internal.pageSize.height - lineBuffer, (pageWidth - rightMargin - lineOffset), pdf.internal.pageSize.height - lineBuffer);
    });

  //  this.generatingPdfProgress = 100;
    //pdf.save(fileName);
  //  this.generatingPdfProgress = 0;
    this.generatingPdfLoadingSubject.next(false);
    Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
    this.dialogRef.close();

  },100);

   // this.dialogRef.close();
  }

  async exportToPDF_r1_old(fileName: string = 'document.pdf') {
    var repData:any= this.repData;
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
    let minHeightBodyCell = 5;
    let minHeightHeaderCol = 3;
    let fontSz = 6;
    const pagePositions: { page: number; x: number; y: number }[] = [];
    // const progressValue = 100 / cardElements.length;

    var vAlign='bottom';
    const reportTitle = this.GetReportTitle();
    const headers =   [[
      { content: this.translatedLangText.S_N, rowSpan: 2, styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.MONTH, rowSpan: 2, styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.PREINSPECTION, colSpan: 2, styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.LOLO, colSpan: 2, styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.STEAM, colSpan: 2, styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.RESIDUE, colSpan: 2, styles: { halign: 'center' } },
      { content: this.translatedLangText.CLEANING, colSpan: 2, styles: { halign: 'center' } },
      { content: this.translatedLangText.REPAIR, colSpan: 2, styles: { halign: 'center', valign: vAlign } }
    ],
    [
      // Empty cells for the first 5 columns (they are spanned by rowSpan: 2)
      this.translatedLangText.TANK, this.translatedLangText.COST, // Sub-headers for LAST_PERIODIC_TEST
      this.translatedLangText.TANK, this.translatedLangText.COST, // Sub-headers for NEXT_PERIODIC_TEST
      this.translatedLangText.TANK, this.translatedLangText.COST, // Sub-headers for NEXT_PERIODIC_TEST
      this.translatedLangText.TANK, this.translatedLangText.COST, // Sub-headers for NEXT_PERIODIC_TEST
      this.translatedLangText.TANK, this.translatedLangText.COST, // Sub-headers for NEXT_PERIODIC_TEST
      this.translatedLangText.TANK, this.translatedLangText.COST, // Sub-headers for NEXT_PERIODIC_TEST
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


    await Utility.addHeaderWithCompanyLogo_Portriat(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    await Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 35);

    // Variable to store the final Y position of the last table
    let lastTableFinalY = 40;

    let startY = lastTableFinalY + 10; // Start table 20mm below the customer name
    const data: any[][] = []; // Explicitly define data as a 2D array
   
    const repGeneratedDate = `${this.date}`; // Replace with your actual cutoff date
    Utility.AddTextAtCenterPage(pdf, repGeneratedDate, pageWidth, leftMargin, rightMargin + 5, startY - 8, 12);

    if(this.customer)
    {
      const customer=`${this.translatedLangText.CUSTOMER} : ${this.customer}`
      Utility.addText(pdf, customer,startY - 2 , leftMargin+4, 9);
    }

    var idx = 0;
    let itmValid=this.getValidItem();
    if(itmValid)
    {
    for (let n = 0; n < (itmValid?.result_per_month?.length||0); n++) {

     
      //let startY = lastTableFinalY + 15; // Start Y position for the current table
      let itm = itmValid?.result_per_month?.[n];

    
        data.push([
          (n+1).toString(),itm?.month || "",  
          Utility.formatNumberDisplay(repData?.preinspection_yearly_sales?.result_per_month?.[n]?.count ), Utility.formatNumberDisplay(repData?.preinspection_yearly_sales?.result_per_month?.[n]?.cost || 0),
          Utility.formatNumberDisplay(repData?.lolo_yearly_sales?.result_per_month?.[n]?.count ),          Utility.formatNumberDisplay(repData?.lolo_yearly_sales?.result_per_month?.[n]?.cost || 0),
          Utility.formatNumberDisplay(repData?.steaming_yearly_sales?.result_per_month?.[n]?.count ),      Utility.formatNumberDisplay(repData?.steaming_yearly_sales?.result_per_month?.[n]?.cost || 0),
          Utility.formatNumberDisplay(repData?.residue_yearly_sales?.result_per_month?.[n]?.count),       Utility.formatNumberDisplay(repData?.residue_yearly_sales?.result_per_month?.[n]?.cost || 0),
          Utility.formatNumberDisplay(repData?.cleaning_yearly_sales?.result_per_month?.[n]?.count),      Utility.formatNumberDisplay(repData?.cleaning_yearly_sales?.result_per_month?.[n]?.cost || 0),
          Utility.formatNumberDisplay(repData?.repair_yearly_sales?.result_per_month?.[n]?.count ),        Utility.formatNumberDisplay(repData?.repair_yearly_sales?.result_per_month?.[n]?.cost ||0)
        ]);
       }
   }

    data.push([this.translatedLangText.TOTAL,"",
      Utility.formatNumberDisplay(repData?.preinspection_yearly_sales?.total_count), Utility.formatNumberDisplay(repData?.preinspection_yearly_sales?.total_cost),
      Utility.formatNumberDisplay(repData?.lolo_yearly_sales?.total_count),          Utility.formatNumberDisplay(repData?.lolo_yearly_sales?.total_cost),
      Utility.formatNumberDisplay(repData?.steaming_yearly_sales?.total_count),      Utility.formatNumberDisplay(repData?.steaming_yearly_sales?.total_cost),
      Utility.formatNumberDisplay(repData?.residue_yearly_sales?.total_count),       Utility.formatNumberDisplay(repData?.residue_yearly_sales?.total_cost),
      Utility.formatNumberDisplay(repData?.cleaning_yearly_sales?.total_count),      Utility.formatNumberDisplay(repData?.cleaning_yearly_sales?.total_cost),
      Utility.formatNumberDisplay(repData?.repair_yearly_sales?.total_count),        Utility.formatNumberDisplay(repData?.repair_yearly_sales?.total_cost),
    ])

    data.push([this.translatedLangText.AVERAGE,"",
      Utility.formatNumberDisplay(repData?.preinspection_yearly_sales?.average_count), Utility.formatNumberDisplay(repData?.preinspection_yearly_sales?.average_cost),
      Utility.formatNumberDisplay(repData?.lolo_yearly_sales?.average_count),          Utility.formatNumberDisplay(repData?.lolo_yearly_sales?.average_cost),
      Utility.formatNumberDisplay(repData?.steaming_yearly_sales?.average_count),      Utility.formatNumberDisplay(repData?.steaming_yearly_sales?.average_cost),
      Utility.formatNumberDisplay(repData?.residue_yearly_sales?.average_count),       Utility.formatNumberDisplay(repData?.residue_yearly_sales?.average_cost),
      Utility.formatNumberDisplay(repData?.cleaning_yearly_sales?.average_count),      Utility.formatNumberDisplay(repData?.cleaning_yearly_sales?.average_cost),
      Utility.formatNumberDisplay(repData?.repair_yearly_sales?.average_count),        Utility.formatNumberDisplay(repData?.repair_yearly_sales?.average_cost),
    ])

    pdf.setDrawColor(0, 0, 0); // red line color

    pdf.setLineWidth(0.1);
    pdf.setLineDashPattern([0.001, 0.001], 0);
    // Add table using autoTable plugin
    autoTable(pdf, {
      head: headers,
      body: data,
      startY: startY, // Start table at the current startY value
      theme: 'grid',
      styles: {
        fontSize: fontSz,
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
        let averageRowIndex= data.table.body.length - 1; // Ensure the correct last row index
        if(data.row.index==totalRowIndex || data.row.index==averageRowIndex){
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor=[231, 231, 231];
          data.cell.styles.valign = 'middle'; // Center text vertically
          if (data.column.index === 0) {
            data.cell.colSpan = 2;  // Merge 4 columns into one
            data.cell.styles.halign = 'right'; // Center text horizontally
          }
        }
        if ((data.row.index==totalRowIndex || data.row.index==averageRowIndex) && data.column.index > 0 && data.column.index < 2) {
          data.cell.text = ''; // Remove text from hidden columns
          data.cell.colSpan = 0; // Hide these columns
        }
      },
      didDrawPage: (d: any) => {
        const pageCount = pdf.getNumberOfPages();

        lastTableFinalY = d.cursor.y;

        var pg = pagePositions.find(p => p.page == pageCount);
        if (!pg) {
          pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
          if (pageCount > 1) {
            Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin);
          }
        }

      },
    });


    const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');

    let chartContentWidth = pageWidth - leftMargin - rightMargin-10;
    startY=lastTableFinalY+10;
    for (var i = 0; i < cardElements.length; i++) {
      if (i > 0) {
        pdf.addPage();
        Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 5);
        pagePositions.push({ page: pdf.getNumberOfPages(), x: 0, y: 0 });
      }
      const card1 = cardElements[i];
      const canvas1 = await html2canvas(card1, { scale: scale });
      const imgData1 = await PDFUtility.captureFullCardImage(card1);
     // const imgData1 = canvas1.toDataURL('image/jpeg', this.imageQuality);

      // Calculate aspect ratio
      const aspectRatio = canvas1.width / canvas1.height;

      // Calculate scaled height based on available width
      let imgHeight1 = chartContentWidth / aspectRatio;

      // Check if the scaled height exceeds the available page height
      const maxPageHeight = pdf.internal.pageSize.height - startY; // Remaining space on the page
      if (imgHeight1 > maxPageHeight) {
        // Adjust height to fit within the page
        imgHeight1 = maxPageHeight;
        // Recalculate width to maintain aspect ratio
        chartContentWidth = imgHeight1 * aspectRatio;
      }

      // Add the image to the PDF
      pdf.addImage(imgData1, 'JPEG', leftMargin, startY, chartContentWidth, imgHeight1);
    }


    const totalPages = pdf.getNumberOfPages();


    pagePositions.forEach(({ page, x, y }) => {
      pdf.setDrawColor(0, 0, 0); // black line color
      pdf.setLineWidth(0.1);
      pdf.setLineDashPattern([0.001, 0.001], 0);
      pdf.setFontSize(8);
      pdf.setPage(page);
      var lineBuffer = 13;
      pdf.text(`Page ${page} of ${totalPages}`, pdf.internal.pageSize.width - 12, pdf.internal.pageSize.height - 8, { align: 'right' });
      pdf.line(leftMargin + 2, pdf.internal.pageSize.height - lineBuffer, (pageWidth - rightMargin) -2, pdf.internal.pageSize.height - lineBuffer);
    });

    this.generatingPdfProgress = 100;
    //pdf.save(fileName);
    this.generatingPdfProgress = 0;
    this.generatingPdfLoadingSubject.next(false);
    Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
    this.dialogRef.close();
  }

 
  getValidItem():any
  {
    var repData:any = this.repData;

    if(repData?.cleaning_yearly_sales) return repData.cleaning_yearly_sales;
    if(repData?.lolo_yearly_sales) return repData.lolo_yearly_sales;
    if(repData?.preinspection_yearly_sales) return repData.preinspection_yearly_sales;
    if(repData?.repair_yearly_sales) return repData.repair_yearly_sales;
    if(repData?.residue_yearly_sales) return repData.residue_yearly_sales;
    if(repData?.steaming_yearly_sales) return repData.steaming_yearly_sales;

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
    var title:string='';
    title = `${this.translatedLangText.YEARLY_SALES_REPORT}`;
    if(this.repName)
     {
      title += `: ${this.repName}`;
     }else
     {
       title += `: ${this.translatedLangText.MASTER}`;
     }
    
    return title;

    // switch(this.repType)
    // {
    //     case "CLEANING":
    //      title = `${this.translatedLangText.YEARLY_SALES_REPORT} - ${formatted}`
    //     break;
    //     case "STEAMING":
    //       title = `${this.translatedLangText.YEARLY_SALES_REPORT}`
    //     break;
    //     case "REPAIR":
    //       title = `${this.translatedLangText.YEARLY_SALES_REPORT}`
    //     break;
    //     case "RESIDUE":
    //       title = `${this.translatedLangText.YEARLY_SALES_REPORT}`
    //       break;
    //     case "LOLO":
    //       title = `${this.translatedLangText.YEARLY_SALES_REPORT}`
    //     break;
    //     case "GATE":
    //       title = `${this.translatedLangText.YEARLY_SALES_REPORT}`
    //     break;
    //     case "PREINSPECTION":
    //       title = `${this.translatedLangText.YEARLY_SALES_REPORT}`
    //     break;
    //     default:
    //       title = `${this.translatedLangText.YEARLY_SALES_REPORT}`
    //     break;
    // }
    // return `${title}`
  }

  displayLocation(yard: report_status_yard): string {
    return this.cvDS.getCodeDescription(yard.code, this.yardCvList) || '';;
  }
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

  SetChartValues(){

    // var categories: any = [];

    //   var series: any = [];
    //   var cleaning_cost:number[]=this.repData?.cleaning_yearly_sales?.result_per_month? this.repData?.cleaning_yearly_sales?.result_per_month?.map(s=>s.cost??0):[];
    //   var preinspect_cost:number[]=this.repData?.preinspection_yearly_sales?.result_per_month? this.repData?.preinspection_yearly_sales?.result_per_month?.map(s=>s.cost??0):[];
    //   var lolo_cost:number[]=this.repData?.lolo_yearly_sales?.result_per_month? this.repData?.lolo_yearly_sales?.result_per_month?.map(s=>s.cost??0):[];
    //   var steaming_cost:number[]=this.repData?.steaming_yearly_sales?.result_per_month? this.repData?.steaming_yearly_sales?.result_per_month?.map(s=>s.cost??0):[];
    //   var residue_cost:number[]=this.repData?.residue_yearly_sales?.result_per_month? this.repData?.residue_yearly_sales?.result_per_month?.map(s=>s.cost??0):[];
    //   var repair_cost:number[]=this.repData?.repair_yearly_sales?.result_per_month? this.repData?.repair_yearly_sales?.result_per_month?.map(s=>s.cost??0):[];

    //   const prepareData = (name: string, data: number[]) => {
    //     if (data.length === 1) {
    //       data.push(0);
    //     }
    //     series.push({ name, data });
    //   };

    //   prepareData(this.translatedLangText.PREINSPECTION, preinspect_cost);
    //   prepareData(this.translatedLangText.LOLO, lolo_cost);
    //   prepareData(this.translatedLangText.STEAM, steaming_cost);
    //   prepareData(this.translatedLangText.RESIDUE, residue_cost);
    //   prepareData(this.translatedLangText.CLEANING, cleaning_cost);
    //   prepareData(this.translatedLangText.REPAIR, repair_cost);
    //   // series.push({name:this.translatedLangText.PREINSPECTION,data:preinspect_cost});
    //   // series.push({name:this.translatedLangText.LOLO,data:lolo_cost});
    //   // series.push({name:this.translatedLangText.STEAM,data:steaming_cost});
    //   // series.push({name:this.translatedLangText.RESIDUE,data:residue_cost});
    //   // series.push({name:this.translatedLangText.CLEANING,data:cleaning_cost});
    //   // series.push({name:this.translatedLangText.REPAIR,data:repair_cost});

    //   var itmValid = this.getValidItem();
    //   if(itmValid)
    //   {
    //   for (var n=0 ; n<(itmValid?.result_per_month?.length||0);n++)
    //   {
    //     categories.push(itmValid?.result_per_month?.[n].month);
    //   }
    //  }
      
    //   this.barChartOptions.series=series;

    // this.barChartOptions.xaxis = {
    //     type: 'category',
    //     categories: categories,
    //     labels: {
          
    //       style: {
    //         colors: '#9aa0ac',
    //       },
    //     },
    //   };  
    // this.barChartOptions.yaxis = {
    //   // max: maxYAxisValue,
    //    min: 0,
    //    title: {
    //      text: `${this.translatedLangText.COST}`,
    //    },
    //    labels: {
    //      align: 'right', // Align labels to the right
    //      minWidth: 50,   // Set a minimum width for the labels
    //      maxWidth: 100,  // Set a maximum width for the labels
    //      offsetX: 10,    // Add horizontal offset to the labels
    //      formatter: (value: number) => {
    //        return value.toFixed(2); // Format the label to reduce its length
    //      }
    //    }
    //  }

    // this.barChartOptions.chart!.events = {
    //   animationEnd: () => {
    //     this.onDownloadClick();
    //   }
    // }

  }

  getYAxisLabel()
 {
    return `${this.translatedLangText.QTY}`;
   //return ' ';
 }

  InitialDefaultData() {
  //   this.barChartOptions = {
  //     legend:{
  //       fontSize:'14px',
  //       position: "bottom",
  //       horizontalAlign: "center",
  //       itemMargin: { horizontal: 15, vertical: 5 }, // Adjusts spacing between items
  //       labels: {
  //         colors: "#333", // Set label text color
  //         useSeriesColors: false, // Use the color of the series for labels
  //     //    padding: 10, // Adjust space between marker and label
  //       },
      
  //     },
  //     series: [
  //       {
  //         name: 'Net Profit',
  //         data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
  //       },
  //       {
  //         name: 'Revenue',
  //         data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
  //       },
  //       {
  //         name: 'Free Cash Flow',
  //         data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
  //       },
  //     ],
  //     chart: {
  //       type: 'bar',
  //       height: 350,
  //       foreColor: '#9aa0ac',
  //       toolbar: {
  //         show: false,
         
  //       },
  //     },
  //     plotOptions: {
  //       bar: {
  //         horizontal: false,
  //         columnWidth: '30%',
  //         borderRadius: 5,
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     stroke: {
  //       show: true,
  //       width: 2,
  //       colors: ['transparent'],
  //     },
  //     xaxis: {
  //       categories: [
  //         'Feb',
  //         'Mar',
  //         'Apr',
  //         'May',
  //         'Jun',
  //         'Jul',
  //         'Aug',
  //         'Sep',
  //         'Oct',
  //       ],
  //       labels: {
  //         style: {
  //           colors: '#9aa0ac',
  //         },
  //       },
  //     },
  //     yaxis: {
  //       title: {
  //         text: '$ (thousands)',
  //       },
  //     },
  //     grid: {
  //       show: true,
  //       borderColor: '#9aa0ac',
  //       strokeDashArray: 1,
  //     },
  //     fill: {
  //       opacity: 1,
  //     },
  //     tooltip: {
  //       theme: 'dark',
  //       marker: {
  //         show: true,
  //       },
  //       x: {
  //         show: true,
  //       },
  //     },
  //   };
   }

}
