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
import { report_status_yard, report_status, DailyTeamApproval, DailyTeamRevenue, ZeroApprovalCostItem } from 'app/data-sources/reports';
import { SteamDS } from 'app/data-sources/steam';
import { SteamPartDS } from 'app/data-sources/steam-part';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { autoTable, Styles } from 'jspdf-autotable';
import { PDFUtility } from 'app/utilities/pdf-utility';
// import { fileSave } from 'browser-fs-access';

export interface DialogData {
  repData: ZeroApprovalCostItem[],
  date: string,
  repType: string,
  customer: string,
  code: string
}
@Component({
  selector: 'app-zero-approval-cost-pdf',
  templateUrl: './zero-approval-cost-pdf.component.html',
  styleUrls: ['./zero-approval-cost-pdf.component.scss'],
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
export class ZeroApprovalCostPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    DAILY_TEAM_APPROVAL_REPORT: 'COMMON-FORM.DAILY-TEAM-APPROVAL-REPORT',
    DAY: 'COMMON-FORM.DAY',
    MONTH: 'COMMON-FORM.MONTH',
    AVERAGE: 'COMMON-FORM.AVERAGE',
    CODE: 'COMMON-FORM.CODE',
    REPAIR_TYPE: 'COMMON-FORM.REPAIR-TYPE',
    QC_BY: 'COMMON-FORM.QC-BY',
    REPAIR_COST: 'COMMON-FORM.REPAIR-COST',
    REPORTED_BY: 'COMMON-FORM.REPORTED-BY',
    TEAM: 'COMMON-FORM.TEAM',
    QC_DATE: 'COMMON-FORM.QC-DATE',
    SIGN: 'COMMON-FORM.SIGN',
    VERIFIED_BY: 'COMMON-FORM.VERIFIED-BY',
    APPROVED_DATE: 'COMMON-FORM.APPROVED-DATE',
    CUSTOMER_TOTAL: 'COMMON-FORM.CUSTOMER-TOTAL',
    GRAND_TOTAL: "COMMON-FORM.GRAND-TOTAL",
    ZERO_APPROVAL_COST: 'COMMON-FORM.ZERO-APPROVAL-COST',
    ESTIMATED: "COMMON-FORM.ESTIMATED",
    COMPLETED_DATE: "COMMON-FORM.COMPLETED-DATE",
    S_N: 'COMMON-FORM.S_N',

  }

  type?: string | null;
  // steamDS: SteamDS;
  // steamPartDS: SteamPartDS;
  // sotDS: StoringOrderTankDS;
  // ccDS: CustomerCompanyDS;
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
  repairOptionCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

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
  repData?: ZeroApprovalCostItem[];
  date?: string;
  repType?: string;
  code?: string;
  customer?: string;
  index: number = 0;
  // date:string='';
  // invType:string='';



  constructor(
    public dialogRef: MatDialogRef<ZeroApprovalCostPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) {
    super();
    this.translateLangText();
    // this.steamDS = new SteamDS(this.apollo);
    //this.steamPartDS = new SteamPartDS(this.apollo);
    ///this.sotDS = new StoringOrderTankDS(this.apollo);
    //this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.repData = this.data.repData;
    this.date = this.data.date;
    this.repType = this.data.repType;
    this.customer = this.data.customer;
    this.code = this.data.code;
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
      // this.subs.sink = this.steamDS.getSteamByIDForPdf(this.repair_guid!).subscribe({
      //   next: (data) => resolve(data),
      //   error: (err) => reject(err),
      // });
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
      { alias: 'repairOptionCv', codeValType: 'REPAIR_OPTION' },
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
      // { alias: 'unitTypeCv', codeValType: 'UNIT_TYPE' },
    ];

    await this.cvDS.getCodeValuesByTypeAsync(queries);

    // Wrap all alias connections in promises
    const promises = [
      firstValueFrom(this.cvDS.connectAlias('processStatusCv')).then(async data => {
        this.processStatusCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('repairOptionCv')).then(data => {
        this.repairOptionCvList = data || [];
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

  getRepairOption(codeVal: string): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.repairOptionCvList);
  }

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

  async onDownloadClick() {
   await this.exportToPDF_r1();
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
    let minHeightBodyCell = 5;
    let minHeightHeaderCol = 3;
   let fontSz_hdr = PDFUtility.TableHeaderFontSize_Portrait();
    let fontSz_body= PDFUtility.ContentFontSize_Portrait()
    const pagePositions: { page: number; x: number; y: number }[] = [];
    // const progressValue = 100 / cardElements.length;

    const reportTitle = this.GetReportTitle();
    const headers = [[
      this.translatedLangText.S_N, this.translatedLangText.TANK_NO, this.translatedLangText.CODE,
      this.translatedLangText.EIR_NO, this.translatedLangText.EIR_DATE,
      this.translatedLangText.COMPLETED_DATE, this.translatedLangText.APPROVED_DATE,
      this.translatedLangText.ESTIMATE_NO, this.translatedLangText.ESTIMATED
    ]];

    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: 'middle', cellWidth: 8, minCellHeight: minHeightBodyCell },
      1: { halign: 'center', valign: 'middle', cellWidth: PDFUtility.TankNo_ColWidth_Portrait(), minCellHeight: minHeightBodyCell },
      2: { halign: 'center', valign: 'middle', cellWidth: 12, minCellHeight: minHeightBodyCell },
      3: { halign: 'center', valign: 'middle', cellWidth: 25, minCellHeight: minHeightBodyCell },
      4: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      5: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      6: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      7: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      8: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
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



    // await Utility.addHeaderWithCompanyLogo_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    // await Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 40);

    // Variable to store the final Y position of the last table
    let lastTableFinalY = 46;

    let date = PDFUtility.FormatColon(this.translatedLangText.INVENTORY_PERIOD, this.date);
    //await Utility.AddTextAtCenterPage(pdf,date,pageWidth,leftMargin,rightMargin,lastTableFinalY,8);
    // await Utility.AddTextAtRightCornerPage(pdf, date, pageWidth, leftMargin, rightMargin, 50, PDFUtility.RightSubTitleFontSize());
    const subTitlePos = 0;
    let startY = await PDFUtility.addHeaderWithCompanyLogoWithTitleSubTitle_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, 
    rightMargin,this.translate,reportTitle,date,subTitlePos);

    startY+=PDFUtility.GapBetweenSubTitleAndTable_Portrait();

    lastTableFinalY += 5;

    // let startY = lastTableFinalY; // Start table 20mm below the customer name
    const data: any[][] = []; // Explicitly define data as a 2D array


    var idx = 0;
    let totalRepairCost = 0; // Initialize total repair cost
    let GrandTotal = 0;

    this.repData!.forEach(itm => {
     
      data.push([
          (++idx).toString(),                          // S_N
          itm?.tank_no || "",                          // TANK_NO
          itm?.customer_code || "",                    // CODE
          itm?.eir_no || "",                           // EIR_NO
          Utility.convertEpochToDateStr(itm?.eir_dt) || "", 
          Utility.convertEpochToDateStr(itm?.complete_dt) || "",
          Utility.convertEpochToDateStr(itm?.approve_dt) || "",
          itm?.estimate_no || "",                      // ESTIMATE_NO
          Utility.formatNumberDisplay(itm?.est_cost)   // ESTIMATED
        ]);
    // data.push([
        //   (++idx).toString(), itm?.tank_no || "", itm?.eir_no || "",itm?.customer_code, Utility.convertEpochToDateStr(itm?.eir_dt) || "",
        //   Utility.convertEpochToDateStr(itm?.complete_dt) || "", Utility.convertEpochToDateStr(itm?.approve_dt) || "",
        //   itm?.estimate_no, Utility.formatNumberDisplay(itm?.est_cost)
        // ]);


      });

    // var zeroCostRep = ZeroApprovalCostItem.groupByCustomer(this.repData!);
    // var totalCust = Object.entries(zeroCostRep).length;
    // var counter = 0;
    // Object.entries(zeroCostRep).forEach(([customerCode, items]) => {
    //   let CustomerTotal = 0;
    //   counter++;
    //   let customer = `${customerCode}-${items[0].customer_name}`;
    //   data.push([
    //     customer, "", "", "", "", "", ""
    //   ]);
    //   // Access individual items
    //   items.forEach(itm => {
    //     GrandTotal += itm?.est_cost || 0;
    //     CustomerTotal += itm?.est_cost || 0;
    //     data.push([
    //       (++idx).toString(), itm?.tank_no || "", itm?.eir_no || "", Utility.convertEpochToDateStr(itm?.eir_dt) || "",
    //       Utility.convertEpochToDateStr(itm?.complete_dt) || "", Utility.convertEpochToDateStr(itm?.approve_dt) || "",
    //       itm?.estimate_no, Utility.formatNumberDisplay(itm?.est_cost)
    //     ]);
    //   });
    //   data.push([this.translatedLangText.CUSTOMER_TOTAL, "", "", "", "", "", "", Utility.formatNumberDisplay(CustomerTotal)]);
    //   // Add table using autoTable plugin
    // });

    // data.push([this.translatedLangText.GRAND_TOTAL, "", "", "", "", "", "", Utility.formatNumberDisplay(GrandTotal)]);

    pdf.setDrawColor(0, 0, 0); // red line color

    pdf.setLineWidth(0.1);
    pdf.setLineDashPattern([0.01, 0.01], 0.1);

    let AllowedRowColSpan = -1;

    autoTable(pdf, {
      head: headers,
      body: data,
      // startY: startY, // Start table at the current startY value
      theme: 'grid',
      margin: { top:startY, left: leftMargin },
      tableWidth: contentWidth,
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
      
      },
      didDrawPage: (d: any) => {
        const pageCount = pdf.getNumberOfPages();

        lastTableFinalY = d.cursor.y;

        var pg = pagePositions.find(p => p.page == pageCount);
        if (!pg) {
          pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
          if (pageCount > 1) {
            // Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 45);
            // Utility.AddTextAtRightCornerPage(pdf, date, pageWidth, leftMargin, rightMargin, 50, PDFUtility.RightSubTitleFontSize());
             PDFUtility.addReportTitle_Portrait(pdf, reportTitle, pageWidth, leftMargin, rightMargin);
             PDFUtility.addReportSubTitle_Portrait(pdf, date, pageWidth, leftMargin, rightMargin,subTitlePos);
          }
        }

      },
    });

   
    PDFUtility.addFooterWithPageNumberAndCompanyLogo_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, 
    rightMargin, this.translate,pagePositions);


    // var gap = 7;

    // if (lastTableFinalY + topMargin + bottomMargin + (gap * 4.5) > pageHeight) {
    //   pdf.addPage();
    //   const pageCount = pdf.getNumberOfPages();
    //   pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
    // }

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
    //     await Utility.addHeaderWithCompanyLogo_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    //   }
    // }// Add Second Page, Add For Loop

    

    this.generatingPdfProgress = 100;
    //pdf.save(fileName);
    this.generatingPdfProgress = 0;
    this.generatingPdfLoadingSubject.next(false);
    Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
    this.dialogRef.close();
  }

   async exportToPDF_r1_backup(fileName: string = 'document.pdf') {
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

    const reportTitle = this.GetReportTitle();
    const headers = [[
      this.translatedLangText.S_N, this.translatedLangText.TANK_NO,
      this.translatedLangText.EIR_NO, this.translatedLangText.EIR_DATE,
      this.translatedLangText.COMPLETED_DATE, this.translatedLangText.APPROVED_DATE,
      this.translatedLangText.ESTIMATE_NO, this.translatedLangText.ESTIMATED
    ]];

    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'center', valign: 'middle', cellWidth: 8, minCellHeight: minHeightBodyCell },
      1: { halign: 'center', valign: 'middle', cellWidth: 25, minCellHeight: minHeightBodyCell },
      2: { halign: 'center', valign: 'middle', cellWidth: 25, minCellHeight: minHeightBodyCell },
      3: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      4: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      5: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      6: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
      7: { halign: 'center', valign: 'middle', minCellHeight: minHeightBodyCell },
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


    await Utility.addHeaderWithCompanyLogo_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    await Utility.addReportTitle(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 40);

    // Variable to store the final Y position of the last table
    let lastTableFinalY = 46;

    let date = PDFUtility.FormatColon(this.translatedLangText.INVENTORY_PERIOD, this.date);
    //await Utility.AddTextAtCenterPage(pdf,date,pageWidth,leftMargin,rightMargin,lastTableFinalY,8);
    await Utility.AddTextAtRightCornerPage(pdf, date, pageWidth, leftMargin, rightMargin, 50, PDFUtility.RightSubTitleFontSize());
    lastTableFinalY += 5;

    let startY = lastTableFinalY; // Start table 20mm below the customer name
    const data: any[][] = []; // Explicitly define data as a 2D array


    var idx = 0;
    let totalRepairCost = 0; // Initialize total repair cost
    let GrandTotal = 0;
    var zeroCostRep = ZeroApprovalCostItem.groupByCustomer(this.repData!);
    var totalCust = Object.entries(zeroCostRep).length;
    var counter = 0;
    Object.entries(zeroCostRep).forEach(([customerCode, items]) => {
      let CustomerTotal = 0;
      counter++;
      let customer = `${customerCode}-${items[0].customer_name}`;
      data.push([
        customer, "", "", "", "", "", ""
      ]);
      // Access individual items
      items.forEach(itm => {
        GrandTotal += itm?.est_cost || 0;
        CustomerTotal += itm?.est_cost || 0;
        data.push([
          (++idx).toString(), itm?.tank_no || "", itm?.eir_no || "", Utility.convertEpochToDateStr(itm?.eir_dt) || "",
          Utility.convertEpochToDateStr(itm?.complete_dt) || "", Utility.convertEpochToDateStr(itm?.approve_dt) || "",
          itm?.estimate_no, Utility.formatNumberDisplay(itm?.est_cost)
        ]);
      });
      data.push([this.translatedLangText.CUSTOMER_TOTAL, "", "", "", "", "", "", Utility.formatNumberDisplay(CustomerTotal)]);
      // Add table using autoTable plugin
    });

    data.push([this.translatedLangText.GRAND_TOTAL, "", "", "", "", "", "", Utility.formatNumberDisplay(GrandTotal)]);

    pdf.setDrawColor(0, 0, 0); // red line color

    pdf.setLineWidth(0.1);
    pdf.setLineDashPattern([0.01, 0.01], 0.1);

    let AllowedRowColSpan = -1;

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
        let colSpan: number = 7;
        let totalRowIndex = data.table.body.length - 1; // Ensure the correct last row index
        let bColSpan = false;

        if (data.cell.raw == this.translatedLangText.CUSTOMER_TOTAL && data.section == 'body' && AllowedRowColSpan !== data.row.index) {
          colSpan = 7;
          data.cell.styles.halign = 'right';
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 8;
          data.cell.colSpan = colSpan;
          AllowedRowColSpan = data.row.index;
          data.cell.styles.fillColor = [231, 231, 231];
        }

        if (data.cell.raw == this.translatedLangText.GRAND_TOTAL && data.section == 'body' && AllowedRowColSpan !== data.row.index) {
          colSpan = 7;
          data.cell.styles.halign = 'right';
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 8;
          data.cell.colSpan = colSpan;
          data.cell.styles.fontSize = 8;
          AllowedRowColSpan = data.row.index;
          data.cell.styles.fillColor = [231, 231, 231];
        }
        if (data.column.index == 0 && !Utility.isParsableToNumber(data.cell.raw) && data.section == 'body' && AllowedRowColSpan !== data.row.index) {
          colSpan = 8;
          data.cell.styles.halign = 'left';
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 8;
          data.cell.colSpan = colSpan;
          AllowedRowColSpan = data.row.index;
        }

        if ((AllowedRowColSpan == data.row.index) && data.section == 'body' && data.column.index > 0 && data.column.index < colSpan) {
          data.cell.text = ''; // Remove text from hidden columns
          data.cell.colSpan = 0; // Hide these columns
          //bColSpan=false;
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
            Utility.AddTextAtRightCornerPage(pdf, date, pageWidth, leftMargin, rightMargin, 50, PDFUtility.RightSubTitleFontSize());
          }
        }

      },
    });

   


    var gap = 7;

    if (lastTableFinalY + topMargin + bottomMargin + (gap * 4.5) > pageHeight) {
      pdf.addPage();
      const pageCount = pdf.getNumberOfPages();
      pagePositions.push({ page: pageCount, x: pdf.internal.pageSize.width - 20, y: pdf.internal.pageSize.height - 10 });
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
        await Utility.addHeaderWithCompanyLogo_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
      }
    }// Add Second Page, Add For Loop

    

    this.generatingPdfProgress = 100;
    //pdf.save(fileName);
    this.generatingPdfProgress = 0;
    this.generatingPdfLoadingSubject.next(false);
    Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
    this.dialogRef.close();
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
    title = `${this.translatedLangText.ZERO_APPROVAL_COST} : ${this.repType}`
    return `${title}`
  }

  displayProcessStatus(status: string): string {
    return this.cvDS.getCodeDescription(status, this.processStatusCvList) || '';;
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

}
