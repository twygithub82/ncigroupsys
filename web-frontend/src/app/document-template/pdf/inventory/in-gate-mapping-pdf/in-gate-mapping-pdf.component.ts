import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, AfterViewInit, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateSurveyDS } from 'app/data-sources/in-gate-survey';
import { Utility } from 'app/utilities/utility';
import { customerInfo } from 'environments/environment';
//import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BehaviorSubject, firstValueFrom, lastValueFrom, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { FileManagerService } from '@core/service/filemanager.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '@core';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import autoTable, { Styles } from 'jspdf-autotable';
import { PDFUtility } from 'app/utilities/pdf-utility';
import { OutGateSurveyDS } from 'app/data-sources/out-gate-survey';
import * as domtoimage from 'dom-to-image-more';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { getDefaultInspectionTypes, InspectionsDS, InspectionsItem, InspectionType, SurfaceTypesItem } from 'app/data-sources/inspections';
import { CellMark, MappingChartComponent } from '@shared/components/mapping-chart/mapping-chart.component';
import { MatCardModule } from '@angular/material/card';
import { TlxCardListComponent } from '@shared/components/tlx-card-list/tlx-card-list.component';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
export interface DialogData {
  reportTitle: string;
  sot: StoringOrderTankItem;
  markedCells: Map<number, CellMark>;
  circularMarkedSections: { front: Map<string, CellMark>, rear: Map<string, CellMark> };
  translatedLangText: any;
  activeSurfaceTypes: SurfaceTypesItem[];
  inspection: InspectionsItem;
}

declare const html2canvas: any;
@Component({
  selector: 'app-in-gate-mapping-pdf',
  templateUrl: './in-gate-mapping-pdf.component.html',
  styleUrls: ['./in-gate-mapping-pdf.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    NgClass,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MappingChartComponent,
    MatCardModule,
    MatCardModule,
    TlxCardListComponent,
    TlxFormFieldComponent,
    MatFormFieldModule
  ],
})
export class InGateMappingPdfComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  translatedLangText: any = {};
  langText = {
    SURVEY_FORM: 'COMMON-FORM.SURVEY-FORM',
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    RO_NO: 'COMMON-FORM.RO-NO',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_NAME: 'COMMON-FORM.CUSTOMER-NAME',
    SO_DATE: 'COMMON-FORM.SO-DATE',
    RO_DATE: 'COMMON-FORM.RO-DATE',
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
    DATA_SCS: 'COMMON-FORM.DATA-SCS',
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
    REMARKS: 'COMMON-FORM.REMARKS',
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
    REPUBLISH: 'COMMON-FORM.REPUBLISH',
    PREVIEW_PDF: 'COMMON-FORM.PREVIEW-PDF',
    PUBLISH_SUCCESS: 'COMMON-FORM.PUBLISH-SUCCESS',
    FOR: 'COMMON-FORM.FOR',
    DELIVERY_COURIER: 'COMMON-FORM.DELIVERY-COURIER',
    DAMAGED: 'COMMON-FORM.DAMAGED',
    TYPE: 'COMMON-FORM.TYPE',
    OUT_GATE: 'COMMON-FORM.OUT-GATE',
    RELEASE_REFERENCE: 'COMMON-FORM.RELEASE-REFERENCE',
  }
  @Output() publishedEir = new EventEmitter<any>();
  type?: string | null;
  // igsDS: InGateSurveyDS;
  // ogsDS: OutGateSurveyDS;
  sotDS?: StoringOrderTankDS;
  // igDS: InGateDS;
  // cvDS: CodeValuesDS;
  gate_survey_guid?: string | null;
  eir_no?: string | null;

  customerInfo: any = customerInfo;
  eirDisclaimerNote: string = "";
  eirTitle: string = "";
  eirDetails: any;
  publish_by?: string;

  last_test_desc?: string = "";

  rowSize = 11;
  colSize = 19;
  rowSizeSquare = 11;
  colSizeSquare = 11;
  cells: number[] = [];
  cellsSquare: number[] = [];
  highlightedCellsLeft: boolean[] = [];
  highlightedCellsRear: boolean[] = [];
  highlightedCellsRight: boolean[] = [];
  highlightedCellsTop: boolean[] = [];
  highlightedCellsFront: boolean[] = [];
  highlightedCellsBottom: boolean[] = [];

  innerColSize = 4;
  innerMiddleColSize = 12;
  cellsOuterTopBottom: number[] = [];
  cellsOuterLeftRight: number[] = [];
  cellsInnerTopBottom: number[] = [];
  cellsInnerMiddle: number[] = [];
  highlightedCellsWalkwayTop: boolean[] = [];
  highlightedCellsWalkwayMiddle: boolean[] = [];
  highlightedCellsWalkwayBottom: boolean[] = [];

  purposeOptionCvList: CodeValuesItem[] = [];
  cleanStatusCvList: CodeValuesItem[] = [];
  testTypeCvList: CodeValuesItem[] = [];
  testClassCvList: CodeValuesItem[] = [];
  manufacturerCvList: CodeValuesItem[] = [];
  claddingCvList: CodeValuesItem[] = [];
  maxGrossWeightCvList: CodeValuesItem[] = [];
  tankHeightCvList: CodeValuesItem[] = [];
  walkwayCvList: CodeValuesItem[] = [];
  airlineCvList: CodeValuesItem[] = [];
  airlineConnCvList: CodeValuesItem[] = [];
  disCompCvList: CodeValuesItem[] = [];
  disValveCvList: CodeValuesItem[] = [];
  disValveSpecCvList: CodeValuesItem[] = [];
  disTypeCvList: CodeValuesItem[] = [];
  footValveCvList: CodeValuesItem[] = [];
  manlidCoverCvList: CodeValuesItem[] = [];
  manlidSealCvList: CodeValuesItem[] = [];
  pvSpecCvList: CodeValuesItem[] = [];
  pvTypeCvList: CodeValuesItem[] = [];
  thermometerCvList: CodeValuesItem[] = [];
  tankCompTypeCvList: CodeValuesItem[] = [];
  valveBrandCvList: CodeValuesItem[] = [];
  tankSideCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];

  scale = 2.15;
  imageQuality = 1;

  generatedPDF: any;
  eirPdf?: any;
  eirPdfSafeUrl?: any;
  isImageLoading$: Observable<boolean> = this.fileManagerService.loading$;
  isFileActionLoading$: Observable<boolean> = this.fileManagerService.actionLoading$;

  private generatingPdfLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  generatingPdfLoading$: Observable<boolean> = this.generatingPdfLoadingSubject.asObservable();
  generatingPdfProgress = 0;

  renderedCells: { highlighted: boolean }[] = [];
  renderedTopBottom: { highlighted: boolean }[] = [];
  renderedMiddle: { highlighted: boolean }[] = [];
  renderedBottom: { highlighted: boolean }[] = [];

  toDownload = true;
  toUpload = false;
  reportTitle?: string;
  sot?: StoringOrderTankItem;
  inspectDS?: InspectionsDS;
  inspectionForm?: UntypedFormGroup;
  inspection?: InspectionsItem;
  activeSurfaceTypes: SurfaceTypesItem[] = [];
  uniqueSurfaceTypes: SurfaceTypesItem[] = [];
  existingSurfaceTypes: SurfaceTypesItem[] = [];
  inspectionTypes: InspectionType[] = getDefaultInspectionTypes();
  markedCells: Map<number, CellMark> = new Map();
  circularMarkedSections: { front: Map<string, CellMark>, rear: Map<string, CellMark> } = {
    front: new Map(),
    rear: new Map()
  };

  constructor(
    public dialogRef: MatDialogRef<InGateMappingPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private fb: UntypedFormBuilder) {
    super();
    this.translateLangText();
    // this.type = data.type;
    // this.igsDS = data.igsDS || new InGateSurveyDS(this.apollo);
    // this.ogsDS = data.ogsDS || new OutGateSurveyDS(this.apollo);
    // this.sotDS = data.sotDS || new StoringOrderTankDS(this.apollo);
    // this.cvDS = data.cvDS || new CodeValuesDS(this.apollo);
    // this.gate_survey_guid = data.gate_survey_guid;
    // this.eir_no = data.eir_no;
    // this.eirPdf = data.eirPdf;
    // this.toDownload = data.toDownload || true;
    // this.toUpload = data.toUpload || false;
    this.translatedLangText = data.translatedLangText;
    this.inspection = data.inspection || [];
    this.inspectionForm = this.createForm();
    this.activeSurfaceTypes = data.activeSurfaceTypes || [];
    this.inspectionTypes = getDefaultInspectionTypes();
    this.existingSurfaceTypes = this.inspection?.surface_types || [];
    this.reportTitle = data.reportTitle || '';
    this.sot = data.sot || null;
    this.markedCells = data.markedCells || new Map();
    this.circularMarkedSections = data.circularMarkedSections || { front: new Map(), rear: new Map() };
    this.inspectDS = new InspectionsDS(this.apollo);
    this.cells = Array(this.rowSize * this.colSize).fill(0);
    this.cellsSquare = Array(this.rowSizeSquare * this.colSizeSquare).fill(0);
    this.cellsInnerTopBottom = Array(this.innerColSize).fill(0);
    this.cellsInnerMiddle = Array(this.innerMiddleColSize).fill(0);
    // this.eirDisclaimerNote = customerInfo.eirDisclaimerNote
    //   .replace(/{companyName}/g, this.customerInfo.companyName)
    //   .replace(/{companyUen}/g, this.customerInfo.companyUen)
    //   .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
    this.updateSurfaceTypesLists(); // Initialize the lists
    this.patchForm();
  }

  // StartGeneratingPDF(): void {
  //   setTimeout(() => {
  //     this.generatePDF();
  //   }, 50); // Let Angular render everything
  // }

   async ngAfterViewInit() {

    var delay = 500;
    setTimeout(() => { 
      this.generatePDF(); }, 
    delay);

  }


  async ngOnInit() {
    this.eirTitle = this.type === "in" ? this.translatedLangText.IN_GATE : this.translatedLangText.OUT_GATE;

    // Await the data fetching
    // const data = this.isInGate() ? await this.getInGateSurveyData() : await this.getOutGateSurveyData();
    // if (data?.length > 0) 
    {
      // this.eirDetails = data[0];
      console.log(this.eirDetails);



      // this.cdr.detectChanges();
      // this.StartGeneratingPDF();
      //  this.updateCellValues();


    }
  }

  updateCellValues() {
    this.renderedCells = this.cells.map((_, i) => ({
      highlighted: this.highlightedCellsTop[i]
    }));

    this.renderedTopBottom = this.cellsInnerTopBottom.map((_, i) => ({
      highlighted: this.highlightedCellsWalkwayTop[i]
    }));

    this.renderedMiddle = this.cellsInnerMiddle.map((_, i) => ({
      highlighted: this.highlightedCellsWalkwayMiddle[i]
    }));

    this.renderedBottom = this.cellsInnerTopBottom.map((_, i) => ({
      highlighted: this.highlightedCellsWalkwayBottom[i]
    }));
  }
  isInGate() {
    return this.type === "in";
  }

  getGate() {
    return this.isInGate() ? this.eirDetails?.in_gate : this.eirDetails?.out_gate;
  }

  //@ViewChild('frameinfosection') captureElement!: ElementRef;
  async showPDF() {

    //  const elements = document.getElementById('capture'); 
    const element = document.getElementById('capture') as HTMLElement;
    if (!element) {
      console.error('Template element not found');
      return;
    }

    const rect = element.getBoundingClientRect();

    const options = {
      width: rect.width,
      height: rect.height,
      backgroundColor: 'white',
      quality: 0.65,
      skipFonts: true,
      filter: (node: any) => {
        // Optionally skip heavy parts
        return !node.classList?.contains('exclude-from-image');
      },
      style: {
        // Only override if necessary
        fontFamily: 'sans-serif',
        // boxShadow: 'none',
        // animation: 'none',
        // transition: 'none'
      }
    };

    var body = await domtoimage.toJpeg(element, options);
    console.log(body);

  }

  @ViewChild('pdfTable') pdfTable!: ElementRef; // Reference to the HTML content
  @ViewChild('captureWalkwayElement', { static: false }) captureWalkwayElementRef!: ElementRef;
  @ViewChild('captureMalidElement', { static: false }) captureMalidElementRef!: ElementRef;
  @ViewChild('frameinfosection', { static: false }) captureInfoElementRef!: ElementRef;
  @ViewChild('test1', { static: false }) captureTesterElementRef!: ElementRef;
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
    let pageNumber = 1;

    let reportTitleCompanyLogo = 32;
    let tableHeaderHeight = 12;
    let tableRowHeight = 8.5;
    let minHeightHeaderCol = 7;
    let minHeightBodyCell = 10;
    let fontSz = 6;

    const pagePositions: { page: number; x: number; y: number }[] = [];
    // const progressValue = 100 / cardElements.length;

    const reportTitle = this.GetReportTitle();

    const comStyles: any = {
      // Set columns 0 to 16 to be center aligned
      0: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, maxContentHeight: minHeightBodyCell, cellWidth: 50 },
      1: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, maxContentHeight: minHeightBodyCell, cellWidth: 50 },
      2: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, maxContentHeight: minHeightBodyCell, cellWidth: 45 },
      3: { halign: 'left', valign: 'middle', minCellHeight: minHeightBodyCell, maxContentHeight: minHeightBodyCell, cellWidth: 45 },
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

    await Utility.addHeaderWithCompanyLogo_Landscape(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    await Utility.addReportTitleToggleUnderline(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 32, false);

    // Variable to store the final Y position of the last table
    let lastTableFinalY = 40;

    let startY = lastTableFinalY + 8; // Start table 20mm below the customer name

    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0); // Black text
    const cutoffDate = `${this.translatedLangText.TAKE_IN_DATE}: ${this.displayDate(this.getGate()?.create_dt)}`; // Replace with your actual cutoff date
    //pdf.text(cutoffDate, pageWidth - rightMargin, lastTableFinalY + 10, { align: "right" });

    var inspect_dt = `${this.translatedLangText.INSPECTION_DATE}: ${this.getInspectionDateDisplay()}`;
    PDFUtility.AddTextAtRightCornerPage(pdf, inspect_dt, pageWidth, leftMargin, rightMargin, lastTableFinalY + 5, 8);
    var tnkNo = `${this.translatedLangText.TANK_NO} : ${this.sot?.tank_no}`;
    var tnkPosX=leftMargin;
    tnkPosX+=32;
    PDFUtility.addText(pdf, tnkNo, lastTableFinalY + 5, tnkPosX, 8);

    var cargo = `${this.translatedLangText.LAST_CARGO} : ${this.sot?.tariff_cleaning?.cargo}`;
    PDFUtility.AddTextAtCenterPage(pdf, cargo, pageWidth, leftMargin, rightMargin, lastTableFinalY + 5, 8);


    var data: any = [];

    startY = lastTableFinalY + 2;

    const chartContentWidth = contentWidth / 2;

    const element = this.captureWalkwayElementRef.nativeElement as HTMLElement


    const perf = window.performance;
    const startTotal = perf.now();

    const startConversion = perf.now();

    //const imgData = await Utility.convertToImage_domToImage(element as HTMLElement,"jpeg");
    const imgData = await Utility.convertToImage_html2canvas(element as HTMLElement, "jpeg");
    const imgInfo = await Utility.getImageSizeFromBase64(imgData);
    const aspectRatio = imgInfo.width / imgInfo.height;

    const conversionTime = perf.now() - startConversion;
    console.log(`HTML To Base64 Conversion took ${conversionTime}ms`);

    // Calculate scaled height based on available width
    var bufferRatio = 0.735;
    let imgHeight = (chartContentWidth / aspectRatio) * bufferRatio;
    const chartContentWidth1 = chartContentWidth * bufferRatio;
    startY += 8;
    let imgLeftPos =leftMargin;
    imgLeftPos -=3;
    pdf.addImage(imgData, 'JPEG', imgLeftPos , startY, chartContentWidth1, imgHeight);


    const element1 = this.captureMalidElementRef.nativeElement as HTMLElement

    const imgData1 = await Utility.convertToImage_html2canvas(element1 as HTMLElement, "jpeg");
    const imgInfo1 = await Utility.getImageSizeFromBase64(imgData1);
    const aspectRatio1 = imgInfo1.width / imgInfo1.height;

    const conversionTime1 = perf.now() - startConversion;
    console.log(`HTML To Base64 Conversion took ${conversionTime1}ms`);

    var buffer = 25;
    const chartContentWidth2 = chartContentWidth + buffer;
    // Calculate scaled height based on available width
    let imgHeight1 = (chartContentWidth2) / aspectRatio1

    startY += 8;

    pdf.addImage(imgData1, 'JPEG', (leftMargin + chartContentWidth) - buffer, startY, chartContentWidth2, imgHeight1);


    this.generatingPdfProgress = 100;
    //pdf.save(fileName);
    this.generatingPdfProgress = 0;
    this.generatingPdfLoadingSubject.next(false);
    // Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
    const pdfBlob = pdf.output('blob');
   
    // return;
    if (this.toDownload) {
      this.downloadFile(pdfBlob, this.getReportTitle());
    }
    this.dialogRef.close();
  }

  GetReportTitle(): string {
    return `${this.reportTitle}`
  }

  getFormattedFootValve(): string {
    const label = this.translatedLangText?.FOOT_VALVE ?? '';

    if (!this.eirDetails?.foot_valve_cv) {
      return label;
    }

    const valveList = this.valveBrandCvList
      ?.map((codeValue) => {
        const isOther = this.isOthers(codeValue.code_val);
        if (isOther) {
          const otherDesc = this.eirDetails?.foot_valve_oth ?? '';
          return `<span>${otherDesc}</span>`;
        } else {
          const isMatch = codeValue.code_val === this.eirDetails.foot_valve_cv;
          const desc = codeValue.description;
          return isMatch ? desc : `<span style="text-decoration: line-through;">${desc}</span>`;
        }
      })
      .join(' / ') ?? '';

    return `${label} (${valveList})`;
  }


  getFormattedDisCompDescription(): string {
    if (!this.eirDetails?.btm_dis_comp_cv || !this.disCompCvList?.length) {
      return '';
    }

    return this.disCompCvList
      .map(codeValue => {
        const isStrikethrough = codeValue.code_val !== this.eirDetails.btm_dis_comp_cv;
        const desc = codeValue.description;
        return isStrikethrough ? `<span style="text-decoration: line-through;">${desc}</span>` : desc;
      })
      .join(' / ');
  }

  getFormattedBottomDisValveSection(): string {
    const label = this.translatedLangText?.BOTTOM_DIS_VALVE__ABB ?? '';

    if (!this.eirDetails?.btm_dis_valve_cv) {
      return label;
    }

    const valvePart = this.disValveCvList
      ?.map((codeValue) => {
        const match = codeValue.code_val === this.eirDetails.btm_dis_valve_cv;
        const desc = codeValue.description;
        return match ? desc : `<span style="text-decoration: line-through;">${desc}</span>`;
      })
      .join(' / ') ?? '';

    const specPart = this.disValveSpecCvList
      ?.map((codeValue) => {
        const match = codeValue.code_val === this.eirDetails.btm_dis_valve_spec_cv;
        const desc = codeValue.description;
        return match ? desc : `<span style="text-decoration: line-through;">${desc}</span>`;
      })
      .join(' / ') ?? '';

    return `${label} (${valvePart}) (${specPart})`;
  }


  async generatePDF(): Promise<void> {
    // this.showPDF();
    await this.exportToPDF_r1();

  }

  async addHeader(pdf: jsPDF, pageWidth: number, leftRightMargin: number, topMargin: number): Promise<number> {
    const headerElement = document.getElementById('eir-form-header');
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

  async addFooter(pdf: jsPDF, pageWidth: number, pageHeight: number, leftRightMargin: number, bottomMargin: number, currentPage: number, totalPages: number): Promise<void> {
    const footerElement = document.getElementById('eir-form-footer');
    if (footerElement) {
      const currentPageSpan = footerElement.querySelector('#current-page');
      const totalPagesSpan = footerElement.querySelector('#total-pages');
      if (currentPageSpan) currentPageSpan.textContent = currentPage.toString();
      if (totalPagesSpan) totalPagesSpan.textContent = totalPages.toString();

      const canvas = await html2canvas(footerElement, {
        scale: this.scale,
      });
      const imgData = canvas.toDataURL('image/jpeg', this.imageQuality);

      const availableWidth = pageWidth - leftRightMargin * 2;
      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', leftRightMargin, pageHeight - imgHeight - bottomMargin, imgWidth, imgHeight);
    }
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










  populateHighlightedCells(toUpdateCells: boolean[], coordinates: { x: number; y: number }[]): boolean[] {
    if (!Array.isArray(coordinates)) {
      return [];
    }
    toUpdateCells = Array(this.rowSize * this.colSize).fill(false);

    coordinates.forEach(coord => {
      const index = coord.y * this.colSize + coord.x;
      toUpdateCells[index] = true;
    });
    return toUpdateCells;
  }

  populateHighlightedCellsWithoutReset(toUpdateCells: boolean[], coordinates: { x: number; y: number }[]): boolean[] {
    if (!Array.isArray(coordinates)) {
      return [];
    }
    coordinates.forEach(coord => {
      const index = coord.y * this.colSize + coord.x;
      toUpdateCells[index] = true;
    });
    return toUpdateCells;
  }

  populateTopSideCells(topCoord: any) {
    const dmg = topCoord.dmg
    const walkwayTop = topCoord.walkwayTop
    const walkwayMiddle = topCoord.walkwayMiddle
    const walkwayBottom = topCoord.walkwayBottom

    this.highlightedCellsTop = this.populateHighlightedCells(this.highlightedCellsTop, dmg);

    this.highlightedCellsWalkwayTop = this.populateHighlightedCellsWithoutReset(this.highlightedCellsWalkwayTop, walkwayTop);
    this.highlightedCellsWalkwayMiddle = this.populateHighlightedCellsWithoutReset(this.highlightedCellsWalkwayMiddle, walkwayMiddle);
    this.highlightedCellsWalkwayBottom = this.populateHighlightedCellsWithoutReset(this.highlightedCellsWalkwayBottom, walkwayBottom);
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

  getReportTitle(): string {
    var title: string = '';
    title = `${this.reportTitle}.pdf`
    return `${title}`
  }

  async onDownloadClick() {
    const fileName = this.getReportTitle(); // Define the filename
    if (this.generatedPDF) {
      console.log(`Download from generatedPDF`)
      this.downloadFile(this.generatedPDF, fileName);
    } else if (this.eirPdf?.[0]?.url) {
      console.log(`Download from existing`)
      const eirBlob = await Utility.urlToBlob(this.eirPdf?.[0]?.url);
      this.downloadFile(eirBlob, fileName);
    } else {
      console.log(`Generate new PDF`)
      await this.generatePDF();
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

  // onRepublishClick() {
  //   this.deleteFile();
  // }

  uploadEir(group_guid: string, pdfBlob: Blob) {
    const eirPdfUploadRequest: any = {
      file: pdfBlob,
      metadata: {
        TableName: this.isInGate() ? 'in_gate_survey' : 'out_gate_survey',
        FileType: 'pdf',
        GroupGuid: group_guid,
        Description: this.isInGate() ? 'IN_GATE_EIR' : 'OUT_GATE_EIR'
      }
    }

    return this.fileManagerService.uploadFiles([eirPdfUploadRequest]).pipe(
      tap({
        next: (response) => {
          console.log('Files uploaded successfully:', response);
          if (response?.affected) {
            this.eirPdf = [
              {
                description: this.isInGate() ? 'IN_GATE_EIR' : 'OUT_GATE_EIR',
                url: response?.url?.[0]
              }
            ];
            this.publishedEir.emit({ type: 'uploaded', eirPdf: this.eirPdf });
          }
        },
        error: (error) => {
          console.error('Error uploading files:', error);
        },
        complete: () => {
          console.log('Upload process completed.');
        }
      })
    );
  }

  deleteFile() {
    if (this.eirPdf?.[0]?.url) {
      this.fileManagerService.deleteFile([this.eirPdf?.[0]?.url]).subscribe({
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

  isOthers(formControlValue: any) {
    return BusinessLogicUtil.isOthers(formControlValue);
  }

  isSelectedOthers(selectedValue: string | undefined, codeVal: string | undefined) {
    return selectedValue && this.isOthers(selectedValue) && this.isOthers(codeVal)
  }

  getNoLabel() {
    return this.isInGate() ? this.translatedLangText.SO_NO : this.translatedLangText.RO_NO;
  }

  getDateLabel() {
    return this.isInGate() ? this.translatedLangText.SO_DATE : this.translatedLangText.RO_DATE;
  }

  getJobReferenceLabel() {
    return this.isInGate() ? this.translatedLangText.TAKE_IN_REFERENCE : this.translatedLangText.RELEASE_REFERENCE;
  }

  getJobNo() {
    return this.isInGate() ? this.getGate()?.tank?.job_no : this.getGate()?.tank?.release_job_no;
  }

  copyComputedStyles(
    source: HTMLElement,
    target: HTMLElement,
    options: {
      recursive?: boolean;
      includeProperties?: string[];
      excludeProperties?: string[];
    } = {}
  ): void {
    const {
      recursive = true,
      includeProperties,
      excludeProperties = [
        'width', 'height', 'top', 'left', 'right', 'bottom',
        'margin', 'padding', 'position', 'display',
        'content'
      ]
    } = options;

    const computedStyle = window.getComputedStyle(source);
    const allProperties = Array.from(computedStyle);

    const propertiesToCopy = includeProperties
      ? includeProperties
      : allProperties.filter(prop => {
        const value = computedStyle.getPropertyValue(prop);
        return value &&
          !excludeProperties.includes(prop) &&
          !prop.startsWith('webkit') &&
          !prop.startsWith('moz');
      });

    propertiesToCopy.forEach(prop => {
      try {
        const value = computedStyle.getPropertyValue(prop);
        if (value) {
          target.style.setProperty(prop, value);
        }
      } catch (e) {
        console.warn(`Could not copy property "${prop}":`, e);
      }
    });

    // Handle :before and :after pseudo-elements if needed
    ['before', 'after'].forEach(pseudo => {
      try {
        const pseudoStyle = window.getComputedStyle(source, `:${pseudo}`);
        const content = pseudoStyle.getPropertyValue('content');
        if (content && content !== 'none') {
          target.style.setProperty(`--pseudo-${pseudo}-content`, content);
          // Optionally, you could render this into the DOM
        }
      } catch (e) {
        console.warn(`Could not access pseudo-element ${pseudo}:`, e);
      }
    });

    if (recursive) {
      const sourceChildren = Array.from(source.children);
      const targetChildren = Array.from(target.children);

      for (let i = 0; i < sourceChildren.length; i++) {
        const srcChild = sourceChildren[i] as HTMLElement;
        const tgtChild = targetChildren[i] as HTMLElement;
        if (srcChild && tgtChild) {
          this.copyComputedStyles(srcChild, tgtChild, options);
        }
      }
    }
  }

  displayNumber(value: number, decimal: number = 2) {
    return Utility.formatNumberDisplay(value, undefined, undefined, decimal);
  }

  getSymbolStyle(type: InspectionType): any {
    // For all shapes, set the wrapper background color
    const baseStyle: any = {};

    if (type.shape === 'triangle') {
      // Triangle uses border, background should be transparent
      return {
        'background-color': 'transparent',
        'border-bottom-color': '#FFFFFF'
      };
    }

    if (type.shape === 'cross' || type.shape === 'diagonal') {
      // Cross and diagonal need transparent background
      return {
        'background-color': 'transparent',
        '--shape-color': '#FFFFFF'
      };
    }

    // For circle and square - make background transparent and use ::before for the white shape
    return {
      'background-color': 'transparent'
    };
  }

  getSurfaceTypeFormGroup(index: number): UntypedFormGroup {
    const formGroup = this.surfaceTypesFormArray.at(index) as UntypedFormGroup;
    return formGroup;
  }
  get surfaceTypesFormArray(): UntypedFormArray {
    return this.inspectionForm?.get('surface_types') as UntypedFormArray;
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      guid: [this.inspection?.guid],
      surface_types: this.fb.array([])
    });
  }
  getSurfaceTypeSymbolStyle(type: SurfaceTypesItem): any {
    const inspectionType = this.inspectionTypes.find(t => t.type === type.type_cv);

    if (!inspectionType) {
      return { 'background-color': 'transparent' };
    }

    if (inspectionType.shape === 'triangle' || inspectionType.shape === 'cross' || inspectionType.shape === 'diagonal') {
      return {
        'background-color': inspectionType.backgroundColor || 'transparent',
        '--shape-color': inspectionType.color || '#FFFFFF'
      };
    }

    // For circle and square
    return {
      'background-color': inspectionType.backgroundColor || 'transparent',
      '--shape-color': inspectionType.color || '#FFFFFF'
    };
  }

  getInspectionTypeShape(type_cv: string | undefined): string {
    const inspectionType = this.inspectionTypes.find(t => t.type === type_cv);
    return inspectionType?.shape || 'circle';
  }

  getInspectionTypeDesc(type_cv: string | undefined): string {
    const inspectionType = this.inspectionTypes.find(t => t.type === type_cv);
    return inspectionType?.displayName || '';
  }

  patchForm() {
    // Clear existing form array
    this.surfaceTypesFormArray.clear();

    // Populate the form array with data from uniqueSurfaceTypes
    this.uniqueSurfaceTypes.forEach(item => {
      this.surfaceTypesFormArray.push(this.createSurfaceTypeFormGroup(item));
    });
  }

  private updateSurfaceTypesLists(): void {
    this.uniqueSurfaceTypes = this.calculateUniqueSurfaceTypes();
    this.activeSurfaceTypes = this.uniqueSurfaceTypes.filter(type => type.action !== 'cancel');
  }

  private calculateUniqueSurfaceTypes(): SurfaceTypesItem[] {
    const surfaceTypeMap = new Map<string, SurfaceTypesItem>();

    // First, populate map with existing surface types and their current actions
    this.existingSurfaceTypes.forEach((surfaceType) => {
      if (surfaceType.type_cv) {
        surfaceTypeMap.set(surfaceType.type_cv, {
          ...surfaceType,
          action: surfaceType.action
        });
      }
    });

    // Track which type_cv values are currently in use
    const currentlyUsedTypes = new Set<string>();

    // Collect marks from markedCells Map
    this.markedCells.forEach((mark) => {
      if (mark?.typeId) {
        currentlyUsedTypes.add(mark.typeId);

        if (!surfaceTypeMap.has(mark.typeId)) {
          const surfaceType = new SurfaceTypesItem({
            type_cv: mark.typeId,
            inspection_guid: this.inspection?.guid,
            action: 'new'
          });
          surfaceTypeMap.set(mark.typeId, surfaceType);
        }
      }
    });

    // Collect marks from front circular sections
    this.circularMarkedSections.front.forEach((mark) => {
      if (mark?.typeId) {
        currentlyUsedTypes.add(mark.typeId);

        if (!surfaceTypeMap.has(mark.typeId)) {
          const surfaceType = new SurfaceTypesItem({
            type_cv: mark.typeId,
            inspection_guid: this.inspection?.guid,
            action: 'new'
          });
          surfaceTypeMap.set(mark.typeId, surfaceType);
        }
      }
    });

    // Collect marks from rear circular sections
    this.circularMarkedSections.rear.forEach((mark) => {
      if (mark?.typeId) {
        currentlyUsedTypes.add(mark.typeId);

        if (!surfaceTypeMap.has(mark.typeId)) {
          const surfaceType = new SurfaceTypesItem({
            type_cv: mark.typeId,
            inspection_guid: this.inspection?.guid,
            action: 'new'
          });
          surfaceTypeMap.set(mark.typeId, surfaceType);
        }
      }
    });

    // Update actions for all surface types based on usage
    surfaceTypeMap.forEach((surfaceType, type_cv) => {
      const isCurrentlyUsed = currentlyUsedTypes.has(type_cv);
      const existedBefore = this.existingSurfaceTypes.some(st => st.type_cv === type_cv);

      if (existedBefore) {
        if (isCurrentlyUsed) {
          if (surfaceType.action !== 'new') {
            surfaceType.action = 'edit';
          }
        } else {
          surfaceType.action = 'cancel';
        }
      } else {
        if (isCurrentlyUsed) {
          surfaceType.action = 'new';
        } else {
          surfaceType.action = 'cancel';
        }
      }
    });

    const result = Array.from(surfaceTypeMap.values());

    // Sync form array with the new structure
    this.syncSurfaceTypesFormArray(result);

    return result;
  }


  createSurfaceTypeFormGroup(item: any): UntypedFormGroup {
    return this.fb.group({
      type_cv: [item.type_cv],
      value: [item.value || ''], // percentage value
      remarks: [item.remarks || '']
    });
  }

  private syncSurfaceTypesFormArray(surfaceTypes: SurfaceTypesItem[]): void {
    const formArray = this.surfaceTypesFormArray;

    // Filter out 'cancel' items - form should only show active types
    const activeTypes = surfaceTypes.filter(type => type.action !== 'cancel');

    // Only sync if the length or type_cv values have changed
    const needsSync = formArray.length !== activeTypes.length ||
      activeTypes.some((type, index) => {
        const formGroup = formArray.at(index) as UntypedFormGroup;
        return !formGroup || formGroup.get('type_cv')?.value !== type.type_cv;
      });

    if (!needsSync) {
      return; // Structure hasn't changed, don't touch the form
    }

    // CRITICAL: Save current form values before clearing
    const existingValues = new Map<string, { value: any, remarks: any }>();
    for (let i = 0; i < formArray.length; i++) {
      const formGroup = formArray.at(i) as UntypedFormGroup;
      const type_cv = formGroup.get('type_cv')?.value;
      if (type_cv) {
        existingValues.set(type_cv, {
          value: formGroup.get('value')?.value,
          remarks: formGroup.get('remarks')?.value
        });
      }
    }

    // Clear existing form array
    while (formArray.length) {
      formArray.removeAt(0);
    }

    // Add form groups for each ACTIVE surface type only
    activeTypes.forEach(type => {
      // Check if we have existing form values for this type
      const savedValues = existingValues.get(type.type_cv || '');

      formArray.push(this.fb.group({
        type_cv: [type.type_cv],
        value: [savedValues?.value ?? type.value ?? ''],
        remarks: [savedValues?.remarks ?? type.remarks ?? ''],
        action: [type.action]
      }));
    });
  }

  getInspectionDateDisplay() {
    return this.inspection?.inspect_dt ? Utility.convertEpochToDateStr(this.inspection?.inspect_dt) : '';
  }

}