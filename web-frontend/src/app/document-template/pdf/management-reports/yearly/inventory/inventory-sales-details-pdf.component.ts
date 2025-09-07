import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
import { report_status_yard, MonthlyProcessData, InventoryAnalyzer, ManagementReportYearlyInventory } from 'app/data-sources/reports';
import { SteamDS } from 'app/data-sources/steam';
import { SteamPartDS } from 'app/data-sources/steam-part';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { autoTable, Styles } from 'jspdf-autotable';
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

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PDFUtility } from 'app/utilities/pdf-utility';

export interface DialogData {
  repData: ManagementReportYearlyInventory,
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
  selector: 'app-yearly-inventory-sales-report-details-pdf',
  templateUrl: './inventory-sales-details-pdf.component.html',
  styleUrls: ['./inventory-sales-details-pdf.component.scss'],
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
export class InventoryYearlySalesReportDetailsPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit, AfterViewInit {
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
    GATE_SURCHARGE: 'COMMON-FORM.GATE-SURCHARGE',
    LOLO: 'COMMON-FORM.LOLO',
    PREINSPECTION: 'COMMON-FORM.PREINSPECTION',
    ON_DEPOT: 'COMMON-FORM.ON-DEPOT',
    OUT_GATE: 'COMMON-FORM.OUT-GATE',
    PERCENTAGE_SYMBOL: 'COMMON-FORM.PERCENTAGE-SYMBOL',
    TEMPERATURE: 'COMMON-FORM.TEMPERATURE',
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

  scale = 2;
  imageQuality = 0.7;

  generatedPDF: any;
  existingPdf?: any;
  existingPdfSafeUrl?: any;
  isImageLoading$: Observable<boolean> = this.fileManagerService.loading$;
  isFileActionLoading$: Observable<boolean> = this.fileManagerService.actionLoading$;

  private generatingPdfLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  generatingPdfLoading$: Observable<boolean> = this.generatingPdfLoadingSubject.asObservable();
  generatingPdfProgress = 0;
  repData?: ManagementReportYearlyInventory;
  date?: string;
  repType?: string;
  customer?: string;
  index: number = 0;
  lineChartOptions?: any;
  pieChartOptions?: any;
  invTypes?: string[];
  // date:string='';
  // invType:string='';


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
        // labels: {
        //   font: {
        //     size: 10, // Font size (default: 10)
        //     family: "'Helvetica Neue', 'Arial', sans-serif", // Optional
        //   },
        //   padding: 10, // Space between legend items (default: 10)
        //   boxWidth: 12, // Width of the color box (default: 12)
        //   boxHeight: 12, // Height of the color box (default: 12)
        // usePointStyle: true, // Uses pointStyle from dataset (e.g., circles)
        // },
      },
    },
  };



  constructor(
    public dialogRef: MatDialogRef<InventoryYearlySalesReportDetailsPdfComponent>,
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


  }

  async ngAfterViewInit() {

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
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @ViewChild('chartPie', { static: false }) chartPie!: ElementRef;
  @ViewChild('chartLine') chartLine!: ElementRef<HTMLCanvasElement>;

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

    //let reportTitleCompanyLogo = 32;
    //let tableHeaderHeight = 12;
    //let tableRowHeight = 8.5;
    let minHeightBodyCell = 5;
    let minHeightHeaderCol = 3;
    let fontSz = 7;
    const pagePositions: { page: number; x: number; y: number }[] = [];
    // const progressValue = 100 / cardElements.length;

    let showGateSurcharge: boolean = this.invTypes?.includes("IN_OUT")!;
    let showSteamSurcharge: boolean = this.invTypes?.includes("STEAMING")!;
    let showCleanSurcharge: boolean = this.invTypes?.includes("CLEANING")!;
    let showRepairSurcharge: boolean = this.invTypes?.includes("REPAIR")!;
    let showResidueSurcharge: boolean = this.invTypes?.includes("RESIDUE")!;
    const reportTitle = this.GetReportTitle();
    const vAlign = 'bottom';
    const headers = [[
      { content: this.translatedLangText.S_N, rowSpan: 2, styles: { halign: 'center', valign: vAlign } },
      { content: this.translatedLangText.MONTH, rowSpan: 2, styles: { halign: 'center', valign: vAlign } },
      ...(showGateSurcharge ?
        [{ content: this.translatedLangText.IN_GATE, colSpan: 2, styles: { halign: 'center', valign: vAlign } },
        { content: this.translatedLangText.OUT_GATE, colSpan: 2, styles: { halign: 'center', valign: vAlign } },
        { content: this.translatedLangText.ON_DEPOT, rowSpan: 2, colSpan: 2, styles: { halign: 'center', valign: vAlign } }] : []),
      ...(showCleanSurcharge ? [{ content: this.translatedLangText.CLEANING, colSpan: 2, styles: { halign: 'center' } }] : []),
      ...(showRepairSurcharge ? [{ content: this.translatedLangText.REPAIR, colSpan: 2, styles: { halign: 'center', valign: vAlign } }] : []),
      ...(showSteamSurcharge ? [{ content: this.translatedLangText.STEAM, colSpan: 2, styles: { halign: 'center', valign: vAlign } }] : []),
      ...(showResidueSurcharge ? [{ content: this.translatedLangText.RESIDUE, colSpan: 2, styles: { halign: 'center' } }] : []),
    ],
    [
      // Empty cells for the first 5 columns (they are spanned by rowSpan: 2)
      ...(showGateSurcharge ? [
        this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL, // Sub-headers for PREINSPECTION
        this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL] : []), // Sub-headers for LOLO
      //  ...(showGateSurcharge?[this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL]:[]), // Sub-headers for GATE_SURCHARGE
      ...(showCleanSurcharge ? [this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL] : []), // Sub-headers for CLEANING
      ...(showRepairSurcharge ? [this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL] : []), // Sub-headers for CLEANING
      ...(showSteamSurcharge ? [this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL] : []), // Sub-headers for STEAM
      ...(showResidueSurcharge ? [this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL] : []),
      // this.translatedLangText.TANK, this.translatedLangText.COST, // Sub-headers for REPAIR
    ]];

    // const headers = [[
    //   { content: this.translatedLangText.NO, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
    //   { content: this.translatedLangText.MONTH, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
    //   { content: this.translatedLangText.IN_GATE, colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
    //   { content: this.translatedLangText.OUT_GATE, colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
    //   { content: this.translatedLangText.ON_DEPOT, rowSpan: 2,colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
    //   { content: this.translatedLangText.STEAM, colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
    //   //{ content: this.translatedLangText.RESIDUE, colSpan: 2, styles: { halign: 'center' } },
    //   { content: this.translatedLangText.CLEANING, colSpan: 2, styles: { halign: 'center' } },
    //   { content: this.translatedLangText.REPAIR, colSpan: 2, styles: { halign: 'center', valign: 'middle' } },

    // ],
    // [
    //   // Empty cells for the first 5 columns (they are spanned by rowSpan: 2)
    //   this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL, // Sub-headers for PREINSPECTION
    //   this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL, // Sub-headers for LOLO
    //   this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL, // Sub-headers for GATE_SURCHARGE
    //   this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL, // Sub-headers for STEAM
    //   this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL, // Sub-headers for RESIDUE
    //   this.translatedLangText.QTY, this.translatedLangText.PERCENTAGE_SYMBOL, // Sub-headers for CLEANING
    //  // this.translatedLangText.TANK, this.translatedLangText.COST, // Sub-headers for REPAIR
    // ]];

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
      // 14: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      // 15: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
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

    let startY = lastTableFinalY + 15; // Start table 20mm below the customer name
    const data: any[][] = []; // Explicitly define data as a 2D array

    //const repGeneratedDate = `${this.translatedLangText.MONTH} : ${this.date}`;
    const repGeneratedDate = `${this.date}`;
    Utility.AddTextAtCenterPage(pdf, repGeneratedDate, pageWidth, leftMargin, rightMargin + 5, startY - 8, PDFUtility.CenterSubTitleFontSize());

    if (this.customer) {
      const customer = `${this.translatedLangText.CUSTOMER} : ${this.customer}`
      Utility.addText(pdf, customer, startY - 2, leftMargin + 4, PDFUtility.RightSubTitleFontSize());
    }
    var idx = 0;

    var grpData = InventoryAnalyzer.groupByMonthAndFindExtremes(this.repData!);


    var series: SeriesItem[] = [];
    var index: number = 1;
    var prcss: string[] = [
      ...(showGateSurcharge ? [this.translatedLangText.IN_GATE, this.translatedLangText.OUT_GATE] : []),
      ...(showCleanSurcharge ? [this.translatedLangText.CLEANING] : []),
      ...(showRepairSurcharge ? [this.translatedLangText.REPAIR] : []),
      ...(showSteamSurcharge ? [this.translatedLangText.STEAM] : []),
      ...(showResidueSurcharge ? [this.translatedLangText.RESIDUE] : [])
    ]
    var prcsValues: number[] = []
    for (const monthData of grpData.monthlyData) {
      data.push([
        (++idx).toString(), monthData.key,
        ...(showGateSurcharge ? [monthData.gateIn?.count || '', Utility.formatNumberDisplay(monthData.gateIn?.percentage),
        monthData.gateOut?.count || '', Utility.formatNumberDisplay(monthData.gateOut?.percentage), monthData.depot?.count || '', ""] : []),


        ...(showCleanSurcharge ? [monthData.cleaning?.count || '', Utility.formatNumberDisplay(monthData.cleaning?.percentage)] : []),
        ...(showRepairSurcharge ? [monthData.repair?.count || '', Utility.formatNumberDisplay(monthData.repair?.percentage)] : []),
        ...(showSteamSurcharge ? [monthData.steaming?.count || '', Utility.formatNumberDisplay(monthData.steaming?.percentage)] : []),
        ...(showResidueSurcharge ? [monthData.residue?.count || '', Utility.formatNumberDisplay(monthData.residue?.percentage)] : []),
      ]);
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
          case this.translatedLangText.IN_GATE:
            if (showGateSurcharge) s.data.push(monthData.gateIn?.count || 0);
            break;
          case this.translatedLangText.OUT_GATE:
            if (showGateSurcharge) s.data.push(monthData.gateOut?.count || 0);
            break;
          case this.translatedLangText.STEAM:
            if (showSteamSurcharge) s.data.push(monthData.steaming?.count || 0);
            break;
          case this.translatedLangText.CLEANING:
            if (showCleanSurcharge) s.data.push(monthData.cleaning?.count || 0);
            break;
          case this.translatedLangText.REPAIR:
            if (showRepairSurcharge) s.data.push(monthData.repair?.count || 0);
            break;
          case this.translatedLangText.RESIDUE:
            if (showResidueSurcharge) s.data.push(monthData.residue?.count || 0);
            break;
        }
        if (bInsert) {
          series.push(s);
        }
      });
    }
    data.push([
      this.translatedLangText.TOTAL, "",
      ...(showGateSurcharge ? [
        this.repData?.gate_in_inventory?.total_count || '', '',
        this.repData?.gate_out_inventory?.total_count || '', '', '', ''] : []),

      ...(showCleanSurcharge ? [this.repData?.cleaning_yearly_inventory?.total_count || '', ''] : []),
      ...(showRepairSurcharge ? [this.repData?.repair_yearly_inventory?.total_count || '', ''] : []),
      ...(showSteamSurcharge ? [this.repData?.steaming_yearly_inventory?.total_count || '', ''] : []),
      ...(showResidueSurcharge ? [this.repData?.residue_yearly_inventory?.total_count || '', ''] : [])
    ]);

    data.push([
      this.translatedLangText.AVERAGE, "",
      ...(showGateSurcharge ? [
        this.repData?.gate_in_inventory?.average_count || '', "",
        this.repData?.gate_out_inventory?.average_count || '', '', '', ''] : []),

      ...(showCleanSurcharge ? [this.repData?.cleaning_yearly_inventory?.average_count || '', ''] : []),
      ...(showRepairSurcharge ? [this.repData?.repair_yearly_inventory?.average_count || '', ''] : []),
      ...(showSteamSurcharge ? [this.repData?.steaming_yearly_inventory?.average_count || '', ''] : []),
      ...(showResidueSurcharge ? [this.repData?.residue_yearly_inventory?.average_count || '', ''] : [])

    ]);

    prcsValues = [
      ...(showGateSurcharge ? [
        this.repData?.gate_in_inventory?.total_count || 0,
        this.repData?.gate_out_inventory?.total_count || 0] : []),
      ...(showCleanSurcharge ? [this.repData?.cleaning_yearly_inventory?.total_count || 0] : []),
      ...(showRepairSurcharge ? [this.repData?.repair_yearly_inventory?.total_count || 0] : []),
      ...(showSteamSurcharge ? [this.repData?.steaming_yearly_inventory?.total_count || 0] : []),
      ...(showResidueSurcharge ? [this.repData?.residue_yearly_inventory?.total_count || 0] : []),

    ];

    pdf.setDrawColor(0, 0, 0); // red line color

    pdf.setLineWidth(0.1);
    pdf.setLineDashPattern([0.01, 0.01], 0.1);
    // Add table using autoTable plugin
    autoTable(pdf, {
      head: headers,
      body: data,
      //startY: startY, // Start table at the current startY value
      margin: { left: leftMargin, right: rightMargin, top: topMargin + 45 },
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
        let colSpan = 2;
        let averageRowIndex = data.table.body.length - 1; // Ensure the correct last row index
        let depotCell = [6, 7];
        if (!showGateSurcharge) depotCell = [];
        if (data.section == "body" && ((data.column.index % 2) == 0)) {
          var key = `${data.row.raw[1]}`;

          var matched = 0;
          var prop = "";
          switch (data.column.index) {
            case 2:
              if (showGateSurcharge) prop = "gateIn";
              else if (showSteamSurcharge) prop = "steaming";
              else if (showCleanSurcharge) prop = "cleaning";
              else if (showRepairSurcharge) prop = "repair";
              else if (showResidueSurcharge) prop = "residue";
              break;
            case 4:
              if (showGateSurcharge) prop = "repair";
              break;
            case 8:
              if (showSteamSurcharge) prop = "steaming";
              break;
            case 10:
              if (showCleanSurcharge) prop = "residue";
              break;

          }
          //  if(prop)
          //  {
          //    var textColor="";
          //   if(grpData.processExtremes[prop].highest?.key==key)
          //     {
          //       textColor="#009F00";
          //     }
          //     else if(grpData.processExtremes[prop].lowest?.key==key)
          //     {
          //       textColor="#EF0000";
          //     }
          //     if(textColor)
          //     {
          //       data.cell.styles.textColor=textColor;
          //     }
          // }
        
        if (data.row.index == totalRowIndex || data.row.index == averageRowIndex) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [231, 231, 231];
          data.cell.styles.valign = 'middle'; // Center text vertically
          if (data.column.index % 2 == 0) {
            data.cell.colSpan = colSpan;  // Merge 4 columns into one
            data.cell.fontSize = 8;
            if (data.column.index === 0) data.cell.styles.halign = 'right'; // Center text horizontally

          }

        }
        else if (depotCell.includes(data.column.index)) {
          var dpWidth = 10
          data.cell.colSpan = colSpan;
          data.column.width = `${dpWidth}px`;  // Add unit

          // Alternative approach if above doesn't work
          // setTimeout(() => {
          //     data.column.width = `${dpWidth}px`;
          //     // If your framework has a refresh/update method, call it here
          //     // e.g., gridApi.refreshHeader() for AG-Grid
          // }, 0);

          // Or try setting minWidth and maxWidth as well
          data.column.minWidth = dpWidth;
          data.column.maxWidth = dpWidth;
        }

        if (((data.row.index == totalRowIndex) || (data.row.index == averageRowIndex) || depotCell.includes(data.column.index))
          && (data.column.index % 2 == 1)//((data.column.index > 0 && data.column.index < colSpan)||(data.column.index%2==))
        ) {
          data.cell.text = ''; // Remove text from hidden columns
          data.cell.colSpan = 0; // Hide these columns
        }
       }
      },
      didDrawPage: (d: any) => {
        const pageCount = pdf.getNumberOfPages();

        lastTableFinalY = d.cursor.y;

        var pg = pagePositions.find(p => p.page == pageCount);
        if (!pg) {
          pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
          if (pageCount > 1) {
            Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 45);
            Utility.AddTextAtCenterPage(pdf, repGeneratedDate, pageWidth, leftMargin, rightMargin + 5, 48, PDFUtility.CenterSubTitleFontSize());
          }
        }

      },
    });

    var catgries = grpData.monthlyData.map((mData: { key?: string }) => mData.key || "") as string[];
    // var x
    this.lineChartOptions.xaxis = {
      categories: catgries,
    };


    this.lineChartOptions.series = series;



    var colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f",
      "#bcbd22", "#17becf", "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173"];

    this.lineChartData.datasets = [];
    this.lineChartData.labels = [];
    var ds = [];
    var cats = [];
    var indx = 0;



    if (showGateSurcharge) {
      var lbls = ["In Gate", "Out Gate"];

      lbls.forEach(lbl => {
        var s = series.filter((s: { name: string }) => [lbl].includes(s.name));
        ds.push({
          label: lbl,
          data: s[0].data,
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

      });
    }
    if (showSteamSurcharge) {
      var lbl = "Steam";
      var s = series.filter((s: { name: string }) => [lbl].includes(s.name));
      ds.push({
        label: lbl,
        data: s[0].data,
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


    if (showCleanSurcharge) {
      var lbl = "Cleaning";
      var s = series.filter((s: { name: string }) => [lbl].includes(s.name));
      ds.push({
        label: lbl,
        data: s[0].data,
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
    if (showRepairSurcharge) {
      var lbl = "Repair";
      var s = series.filter((s: { name: string }) => [lbl].includes(s.name));
      ds.push({
        label: lbl,
        data: s[0].data,
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
    if (showResidueSurcharge) {
      var lbl = "Residue";
      var s = series.filter((s: { name: string }) => [lbl].includes(s.name));
      ds.push({
        label: lbl,
        data: s[0].data,
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
    this.lineChartData.datasets = ds;
    this.lineChartData.labels = catgries;
    this.chart?.data != this.lineChartData;
    this.chart?.update();

    // if(!showGateSurcharge) 
    //   {this.lineChartOptions.series=this.lineChartOptions.series.filter((s:{ name: string })=>!["In Gate","Out Gate"].includes(s.name));}
    // if(!showSteamSurcharge) 
    //   {this.lineChartOptions.series=this.lineChartOptions.series.filter((s:{ name: string })=>!["Steaming"].includes(s.name));}
    // if(!showCleanSurcharge) 
    //   {this.lineChartOptions.series=this.lineChartOptions.series.filter((s:{ name: string })=>!["Cleaning"].includes(s.name));}
    // if(!showRepairSurcharge) 
    //   {this.lineChartOptions.series=this.lineChartOptions.series.filter((s:{ name: string })=>!["Repair"].includes(s.name));}

    this.pieChartOptions.labels = prcss;
    this.pieChartOptions.series2 = prcsValues;

    // var lineChartValues={
    //   xaxis:{
    //     categories: grpData.monthlyData.map((mData: {key?: string}) => mData.key || "") as string[],
    //     title: {
    //       text: 'Month',
    //     },
    //     labels: {
    //       style: {
    //         colors: '#9aa0ac',
    //       },
    //     },
    //   },
    //   series:series
    // };


    setTimeout(async () => {

      startY = lastTableFinalY + 10;
      let chartContentWidth = pageWidth - leftMargin - rightMargin;
      // const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');

      // var base64img = await Utility.convertToImage(this.pdfTable.nativeElement,"jpeg");

      if (this.chartLine?.nativeElement) {
        pdf.addPage();
        Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 45);
        pagePositions.push({ page: pdf.getNumberOfPages(), x: 0, y: 0 });
        startY = topMargin + 50;
        const canvas = this.chartLine.nativeElement;
        const base64Image = Utility.ConvertCanvasElementToImage64String(canvas);
        const imgInfo = await Utility.getImageSizeFromBase64(base64Image);
        const aspectRatio = imgInfo.width / imgInfo.height;
        let imgHeight1 = chartContentWidth / aspectRatio;
        // pdf.addImage(base64Image, 'JPEG', leftMargin, startY, chartContentWidth, imgHeight1);
        await Utility.DrawBase64ImageAtCenterPage(pdf, base64Image, pageWidth, leftMargin, rightMargin, startY, chartContentWidth);

      }

      if (this.chartPie?.nativeElement) {
        pdf.addPage();
        Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 45);
        pagePositions.push({ page: pdf.getNumberOfPages(), x: 0, y: 0 });
        startY = topMargin + 50;
        await Utility.DrawCardForImageAtCenterPage(pdf, this.chartPie.nativeElement, pageWidth, leftMargin, rightMargin, startY, chartContentWidth, 1);
      }


      const totalPages = pdf.getNumberOfPages();



      for (const { page, x, y } of pagePositions) {
        pdf.setDrawColor(0, 0, 0); // black line color
        pdf.setLineWidth(0.1);
        pdf.setLineDashPattern([0.01, 0.01], 0.1);
        pdf.setFontSize(8);
        pdf.setPage(page);

        const lineBuffer = 13;
        pdf.text(`Page ${page} of ${totalPages}`, pdf.internal.pageSize.width - 14, pdf.internal.pageSize.height - 8, { align: 'right' });
        pdf.line(leftMargin, pdf.internal.pageSize.height - lineBuffer, pageWidth - rightMargin, pdf.internal.pageSize.height - lineBuffer);

        if (page > 1) {
          await Utility.addHeaderWithCompanyLogo_Portriat(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
        }
      }// Add Second Page, Add For Loop

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

    }, 50);

    // this.dialogRef.close();
  }

  getYAxisLabel() {
    return `${this.translatedLangText.QTY}`;
    //return '';
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
    title = `${this.translatedLangText.YEARLY_INVENTORY_REPORT} - ${this.repType}`;
    return `${title}`
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

  InitChartValues() {
    this.pieChartOptions = {
      title: {
        text: this.translatedLangText.SUMMARY_OF_INVENTORY,
        align: 'center',
      },
      chart: {
        height: 450,
        type: 'pie',
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false, // <-- disables all animations
        },
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      series2: [44, 55, 13, 43, 22],
      legend: {
        fontSize: '14px',
        // position: "bottom",
        // horizontalAlign: "center",
        // itemMargin: { horizontal: 15, vertical: 5 }, // Adjusts spacing between items
        labels: {
          colors: "#333", // Set label text color
          useSeriesColors: false, // Use the color of the series for labels
          //    padding: 10, // Adjust space between marker and label
        },

      },
      // series: [
      //   {
      //     name: 'PRODUCT A',
      //     data: [44, 55, 41, 67, 22, 43],
      //   },
      //   {
      //     name: 'PRODUCT B',
      //     data: [13, 23, 20, 8, 13, 27],
      //   },
      //   {
      //     name: 'PRODUCT C',
      //     data: [11, 17, 15, 15, 21, 14],
      //   },
      //   {
      //     name: 'PRODUCT D',
      //     data: [21, 7, 25, 13, 22, 8],
      //   },
      // ],
      // responsive: [
      //   {
      //     breakpoint: 480,
      //     options: {
      //       chart: {
      //         width: 200,
      //       },
      //       legend: {
      //         position: 'bottom',
      //       },
      //     },
      //   },
      // ],
      // xaxis: {
      //   type: 'category',
      //   categories: [
      //     'Feb',
      //     'Mar',
      //     'Apr',
      //     'May',
      //     'Jun',
      //     'Jul',
      //   ],
      //   labels: {
      //     style: {
      //       colors: '#9aa0ac',
      //     },
      //   },
      // },
    };

    this.lineChartOptions = {

      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false, // <-- disables all animations
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#77B6EA', '#545454'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      series: [
        {
          name: 'High - 2013',
          data: [28, 29, 33, 36, 32, 32, 33],
        },
        {
          name: 'Low - 2013',
          data: [12, 11, 14, 18, 17, 13, 13],
        },
      ],
      title: {
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      markers: {
        size: 6,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
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
        itemMargin: { horizontal: 15, vertical: 5 }, // Adjusts spacing between items
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
