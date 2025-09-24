import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, AfterViewInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
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
export interface DialogData {
  type: string;
  gate_survey_guid: string;
  igsDS: InGateSurveyDS;
  ogsDS: OutGateSurveyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  eirPdf?: any;
  eir_no?: string;
}

declare const html2canvas: any;
@Component({
  selector: 'app-eir-form',
  templateUrl: './eir-form.component.html',
  styleUrls: ['./eir-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    NgClass,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
})
export class EirFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
  igsDS: InGateSurveyDS;
  ogsDS: OutGateSurveyDS;
  // igDS: InGateDS;
  cvDS: CodeValuesDS;
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


  constructor(
    public dialogRef: MatDialogRef<EirFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apollo: Apollo,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private authService: AuthService) {
    super();
    this.translateLangText();
    this.type = data.type;
    this.igsDS = data.igsDS || new InGateSurveyDS(this.apollo);
    this.ogsDS = data.ogsDS || new OutGateSurveyDS(this.apollo);
    // this.igDS = data.igDS || new InGateDS(this.apollo);
    this.cvDS = data.cvDS || new CodeValuesDS(this.apollo);
    this.gate_survey_guid = data.gate_survey_guid;
    this.eir_no = data.eir_no;
    this.eirPdf = data.eirPdf;
    this.cells = Array(this.rowSize * this.colSize).fill(0);
    this.cellsSquare = Array(this.rowSizeSquare * this.colSizeSquare).fill(0);

    this.cellsInnerTopBottom = Array(this.innerColSize).fill(0);
    this.cellsInnerMiddle = Array(this.innerMiddleColSize).fill(0);
    this.eirDisclaimerNote = customerInfo.eirDisclaimerNote
      .replace(/{companyName}/g, this.customerInfo.companyName)
      .replace(/{companyUen}/g, this.customerInfo.companyUen)
      .replace(/{companyAbb}/g, this.customerInfo.companyAbb);
  }

  StartGeneratingPDF(): void {
    setTimeout(() => {
      this.generatePDF();
    }, 50); // Let Angular render everything
  }

  async ngOnInit() {
    this.eirTitle = this.type === "in" ? this.translatedLangText.IN_GATE : this.translatedLangText.OUT_GATE;

    // Await the data fetching
    const data = this.isInGate() ? await this.getInGateSurveyData() : await this.getOutGateSurveyData();
    if (data?.length > 0) {
      this.eirDetails = data[0];
      console.log(this.eirDetails);
      await this.getCodeValuesData();
      this.last_test_desc = this.getLastTest(this.eirDetails);
      this.publish_by = this.getGate()?.publish_by || this.authService.currentUserName;
      this.highlightedCellsLeft = this.populateHighlightedCells(this.highlightedCellsLeft, JSON.parse(this.eirDetails?.left_coord || '[]'));
      this.highlightedCellsRear = this.populateHighlightedCells(this.highlightedCellsRear, JSON.parse(this.eirDetails?.rear_coord || '[]'));
      this.highlightedCellsRight = this.populateHighlightedCells(this.highlightedCellsRight, JSON.parse(this.eirDetails?.right_coord || '[]'));
      this.populateTopSideCells(JSON.parse(this.eirDetails?.top_coord || '{}'));
      this.highlightedCellsFront = this.populateHighlightedCells(this.highlightedCellsFront, JSON.parse(this.eirDetails?.front_coord || '[]'));
      this.highlightedCellsBottom = this.populateHighlightedCells(this.highlightedCellsBottom, JSON.parse(this.eirDetails?.bottom_coord || '[]'));

      this.cdr.detectChanges();
      this.StartGeneratingPDF();
      //  this.updateCellValues();


      // if (!this.eirPdf?.length) {
      //   await this.generatePDF();
      // }
      //  else {
      //   const eirBlob = await Utility.urlToBlob(this.eirPdf?.[0]?.url);
      //   const pdfUrl = URL.createObjectURL(eirBlob);
      //   this.eirPdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl + '#toolbar=0');
      // }
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
    // const element = document.getElementById("capture");

    // html2canvas(element,{ allowTaint: true,
    //               useCORS: true})
    // .then((canvas: HTMLCanvasElement) => {
    //   console.log("Canvas created!");
    //   document.body.appendChild(canvas); // Optional: display it
    // })
    // .catch((err: any) => {
    //   console.error("Canvas conversion failed:", err);
    // });
    //    const canvas = await html2canvas(element, {
    //   foreignObjectRendering: true
    // });

    // const clippedImgData = canvas.toDataURL('image/png');

    // html2canvas(this.captureElement.nativeElement).then((canvas) => {
    //   const clippedImgData = canvas.toDataURL('image/png');
    // });

    // const element = document.getElementById('eir-form-template');
    // if (!element) {
    //   console.error('Template element not found');
    //   return;
    // }

    // html2canvas(element).then((canvas) => {
    //   const pdf = new jsPDF('p', 'mm', 'a4');
    //   const pageWidth = 190; // A4 page width minus margins
    //   const pageHeight = pdf.internal.pageSize.height; // A4 page height
    //   const margin = 10; // Top and bottom margins
    //   const usableHeight = pageHeight - margin * 2; // Content area height
    //   const imgHeight = (canvas.height * pageWidth) / canvas.width;

    //   let yOffset = 0; // Track vertical offset for each page

    //   while (yOffset < imgHeight) {
    //     if (yOffset > 0) pdf.addPage(); // Add a new page if not the first

    //     // Add Header
    //     this.addHeader(pdf, pageWidth, margin);

    //     // Calculate the portion of the canvas to clip
    //     const clipStartY = yOffset * canvas.height / imgHeight; // Map PDF offset to canvas pixels
    //     const clipHeight = Math.min(usableHeight * canvas.height / imgHeight, canvas.height - clipStartY);

    //     // Create a temporary canvas to extract the clipped portion
    //     const tempCanvas = document.createElement('canvas');
    //     tempCanvas.width = canvas.width;
    //     tempCanvas.height = clipHeight;
    //     const tempContext = tempCanvas.getContext('2d');
    //     if (tempContext) {
    //       tempContext.drawImage(canvas, 0, -clipStartY, canvas.width, canvas.height);
    //     }

    //     const clippedImgData = tempCanvas.toDataURL('image/png');

    //     // Add the clipped image to the PDF without stretching
    //     const renderedHeight = clipHeight * pageWidth / canvas.width;
    //     pdf.addImage(clippedImgData, 'PNG', 10, margin, pageWidth, renderedHeight);

    //     // Add Footer
    //     this.addFooter(pdf, pageWidth, pageHeight, margin);

    //     yOffset += usableHeight; // Move to the next page chunk
    //   }

    //   const pdfBlob = pdf.output('blob');
    //   const pdfURL = URL.createObjectURL(pdfBlob);

    //   // Open PDF in a MatDialog
    //   this.dialog.open(PdfDialogComponent, {
    //     width: '80%',
    //     height: '90%',
    //     data: { pdfUrl: pdfURL },
    //   });
    // });
  }

  @ViewChild('pdfTable') pdfTable!: ElementRef; // Reference to the HTML content
  @ViewChild('captureWalkwayElement', { static: false }) captureWalkwayElementRef!: ElementRef;
  @ViewChild('captureMalidElement', { static: false }) captureMalidElementRef!: ElementRef;
  @ViewChild('frameinfosection', { static: false }) captureInfoElementRef!: ElementRef;
  @ViewChild('test1', { static: false }) captureTesterElementRef!: ElementRef;
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
    let minHeightHeaderCol = 7;
    let minHeightBodyCell = 10;
    let fontSz = 6;

    const pagePositions: { page: number; x: number; y: number }[] = [];
    // const progressValue = 100 / cardElements.length;

    const reportTitle = this.GetReportTitle();

    // const headers = [[
    //   this.translatedLangText.NO,
    //   this.translatedLangText.TANK_NO, this.translatedLangText.CUSTOMER,
    //   this.translatedLangText.CLEAN_IN, this.translatedLangText.CLEAN_DATE,
    //   this.translatedLangText.DURATION_DAYS, this.translatedLangText.UN_NO,
    //   this.translatedLangText.PROCEDURE
    // ]];

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

    await Utility.addHeaderWithCompanyLogo_Portrait(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, this.translate);
    await Utility.addReportTitleToggleUnderline(pdf, reportTitle, pageWidth, leftMargin, rightMargin, topMargin + 32, false);

    // Variable to store the final Y position of the last table
    let lastTableFinalY = 40;

    let startY = lastTableFinalY + 8; // Start table 20mm below the customer name

    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0); // Black text
    const cutoffDate = `${this.translatedLangText.TAKE_IN_DATE}: ${this.displayDate(this.getGate()?.create_dt)}`; // Replace with your actual cutoff date
    //pdf.text(cutoffDate, pageWidth - rightMargin, lastTableFinalY + 10, { align: "right" });
    PDFUtility.AddTextAtRightCornerPage(pdf, cutoffDate, pageWidth, leftMargin, rightMargin, lastTableFinalY + 5, 8);
    PDFUtility.addText(pdf, this.translatedLangText.EQUIPMENT_INTERCHANGE_RECEIPT, lastTableFinalY + 5, leftMargin, 8);

    var data = [
      [
        { content: `${this.getNoLabel()}: ${this.getGate()?.tank?.storing_order?.so_no}` },
        { content: `${this.getDateLabel()}: ${this.displayDate(this.getGate()?.tank?.storing_order?.create_dt)}` },
        { content: `${this.translatedLangText.LAST_CARGO}: ${(this.getGate()?.tank?.tariff_cleaning?.cargo)}`, colSpan: 2 }
      ],
      [`${this.translatedLangText.TANK_NO}: ${this.getGate()?.tank?.tank_no}`, `${this.translatedLangText.EIR_NO}: ${this.getGate()?.eir_no}`,
      `${this.getJobReferenceLabel()}: ${this.getGate()?.tank?.job_no}`, `${this.translatedLangText.DATE_OF_INSPECTION}: ${this.displayDateTime(this.eirDetails?.create_dt)}`],
      [`${this.translatedLangText.OPERATOR}: ${this.getGate()?.tank?.storing_order?.customer_company?.name}`, `${this.translatedLangText.OWNER}: ${this.getGate()?.tank?.customer_company?.name}`,
      `${this.translatedLangText.LAST_RELEASE_DATE}: ${this.displayDate(this.getGate()?.tank?.last_release_dt) || '-'}`, `${this.translatedLangText.LAST_TEST}: ${this.last_test_desc}`],
      [`${this.translatedLangText.UNIT_TYPE}: ${this.getGate()?.tank?.tank?.unit_type}`, `${this.translatedLangText.CLADDING}: ${this.getCladdingDescription(this.eirDetails?.cladding_cv)}`,
      //  { content: `${this.translatedLangText.MANUFACTURER_DOM}: ${this.getManufactureDescription(this.eirDetails?.manufacturer_cv)}`, colSpan: 2}],
      `${this.translatedLangText.MANUFACTURER_DOM}: ${this.getManufactureDescription(this.eirDetails?.manufacturer_cv)}  ${this.displayDate(this.eirDetails?.dom_dt)}`, `${this.translatedLangText.TAKE_IN_STATUS}: ${this.getCleanStatusDescription(this.getGate()?.tank?.clean_status_cv)}`],
      [`${this.translatedLangText.CAPACITY}: ${this.displayNumber(this.eirDetails?.capacity, 0)} L`, `${this.translatedLangText.TARE_WEIGHT}: ${this.displayNumber(this.eirDetails?.tare_weight, 0)} KG`,
      `${this.translatedLangText.MAX_GROSS_WEIGHT}: ${this.getMaxGrossWeightDescription(this.eirDetails?.max_weight_cv)}`, `${this.translatedLangText.TANK_HEIGHT}: ${this.getTankHeightDescription(this.eirDetails?.height_cv)}`],
    ];

    autoTable(pdf, {
      body: data,
      startY: startY, // Start table at the current startY value
      theme: 'grid',
      margin: { left: leftMargin },
      styles: {
        fontSize: 6.5,
        textColor: [0, 0, 0],
        minCellHeight: minHeightHeaderCol,
        // overflow:'ellipsize',
        lineWidth: 0.35, // cell border thickness
        lineColor: [0, 0, 0], // black
        cellPadding: 2, // ← Add some padding
      },
      tableWidth: contentWidth,
      columnStyles: comStyles,
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



    //      const cardElements = this.pdfTable.nativeElement.querySelectorAll('.card');
    startY = lastTableFinalY + 2;
    // Get the element correctly (remove the dot from className)
    // const elements = document.getElementsByClassName('frame-info-section'); // Note: removed the dot

    // if (!elements || elements.length === 0) {
    //   console.error('Element not found');
    //   return;
    // }

    // Get the first element with the class
    //const element = elements[0];
    // const element =document.getElementById('test1') as HTMLElement;
    // const styles = window.getComputedStyle(element);
    // console.log(`Computed styles count: ${styles.length}`);
    //const contentWidth = pageWidth - leftMargin - rightMargin;
    const chartContentWidth = contentWidth;

    // const canvas = await html2canvas(element as HTMLElement, { scale: scale });
    // let imgData = canvas.toDataURL('image/jpeg', this.imageQuality);
    // const imgHeight = ((canvas.height * chartContentWidth) / canvas.width);
    // const walkwayEl = this.captureWalkwayElementRef.nativeElement as HTMLElement;
    //  const clonedEl= element.cloneNode(true) as HTMLElement;
    // this.copyComputedStyles(originalEl,clonedEl);
    const element = this.captureInfoElementRef.nativeElement as HTMLElement

    //   const clonedEl= element.cloneNode(true) as HTMLElement;
    //  const computedStyle = window.getComputedStyle(element);
    //   Array.from(computedStyle).forEach(prop => {
    //     clonedEl.style.setProperty(prop, computedStyle.getPropertyValue(prop), 
    //       computedStyle.getPropertyPriority(prop));
    //   });

    //   clonedEl.style.position = 'fixed';
    //   clonedEl.style.top = '-9999px';
    //   clonedEl.style.left = '-9999px';
    //   clonedEl.style.zIndex = '-9999';
    //   //clonedEl.style.opacity = '0'; // make sure it's invisible

    //   // Append to DOM
    //   document.body.appendChild(clonedEl);

    //   // Wait for layout, fonts, images (especially if any are async)
    //   await new Promise(resolve => requestAnimationFrame(resolve));
    //   await new Promise(resolve => setTimeout(resolve, 100)); // give it a moment more

    // // Append to body temporarily (but off-screen)
    //  clonedEl.style.position = 'absolute';
    // // clonedEl.style.left = '-9999px';
    //  document.body.appendChild(clonedEl)

    // //const imgData = await Utility.convertToImage_html2canvas(element as HTMLElement,"jpeg");
    // //const imgData = await Utility.convertToImage(originalEl as HTMLElement,"jpeg");

    //   const imgData = await Utility.convertWithDomToImage(clonedEl as HTMLElement,"jpeg");
    //   const imgInfo = await Utility.getImageSizeFromBase64(imgData);
    //   const aspectRatio = imgInfo.width / imgInfo.height;


    //   const element1 =document.getElementById('test2') as HTMLElement;
    //    const styles1 = window.getComputedStyle(element);
    //   console.log(`Computed styles count: ${styles1.length}`);

    // const MalidEl = this.captureMalidElementRef.nativeElement as HTMLElement;
    //   // const clonedEl= element.cloneNode(true) as HTMLElement;
    // this.copyComputedStyles(originalEl,clonedEl);

    //const imgData = await Utility.convertToImage_html2canvas(element as HTMLElement,"jpeg");
    //const imgData = await Utility.convertToImage(originalEl as HTMLElement,"jpeg");

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
    let imgHeight = contentWidth / aspectRatio;

    pdf.addImage(imgData, 'JPEG', leftMargin, startY, chartContentWidth, imgHeight);

    var startRectY = startY + imgHeight + 2;
    var rectBoxHeight = 13;
    var bufferLabel = 16;
    var textContent = `${this.translatedLangText.REMARKS}:`;
    await PDFUtility.drawRectangleBox(pdf, leftMargin, startRectY, chartContentWidth, rectBoxHeight);
    PDFUtility.addText(pdf, textContent, startRectY + 5, leftMargin + 2, 8, true);
    textContent = this.eirDetails?.comments || '';
    PDFUtility.addText(pdf, textContent, startRectY + 5, leftMargin + bufferLabel, 8);
    startRectY += rectBoxHeight + 2;
    textContent = `${this.translatedLangText.PURPOSE}:`;
    PDFUtility.addText(pdf, textContent, startRectY + 5, leftMargin + 2, 8, true);
    textContent = this.displayTankPurpose(this.getGate()?.tank);
    PDFUtility.addText(pdf, textContent, startRectY + 5, leftMargin + bufferLabel, 8);
    await PDFUtility.drawRectangleBox(pdf, leftMargin, startRectY, chartContentWidth, rectBoxHeight);
    startRectY += rectBoxHeight + 2;
    rectBoxHeight = pageHeight - rectBoxHeight - startRectY + 2;

    await PDFUtility.drawRectangleBox(pdf, leftMargin, startRectY, chartContentWidth, rectBoxHeight);
    await PDFUtility.drawRectangleBox(pdf, leftMargin, startRectY, chartContentWidth / 2, rectBoxHeight);

    var textWrapWidth = chartContentWidth / 2;
    var rightRectBoxStartX = leftMargin + (chartContentWidth / 2) + 2;
    var leftRectBoxStartX = leftMargin + 2;
    var bufferLabelY = 9;
    textContent = `${customerInfo.companyName}`;
    PDFUtility.addText(pdf, textContent, startRectY + 5, leftRectBoxStartX, 8, true);


    textContent = `${this.getGate()?.tank?.storing_order?.customer_company?.name}`;
    PDFUtility.addText(pdf, textContent, startRectY + 5, rightRectBoxStartX, 8, true);


    textContent = `${this.translatedLangText.EIR_COMPANY_DECLARATION}`;
    PDFUtility.addText(pdf, textContent, startRectY + bufferLabelY, leftRectBoxStartX, 8, false, 'helvetica', true, textWrapWidth);


    textContent = `${this.translatedLangText.EIR_HAULIER_DECLARATION}`;
    PDFUtility.addText(pdf, textContent, startRectY + bufferLabelY, rightRectBoxStartX, 8, false, 'helvetica', true, textWrapWidth);

    var tempY = bufferLabelY;
    bufferLabelY = pageHeight - bottomMargin - (6 * 2);

    var gapLabel = (textWrapWidth / 2);

    textContent = `${this.translatedLangText.SURVEY_BY}:`;
    PDFUtility.addText(pdf, textContent, bufferLabelY, leftRectBoxStartX, 8);

    textContent = `${this.translatedLangText.REVIEW_BY}:`;
    PDFUtility.addText(pdf, textContent, bufferLabelY, leftRectBoxStartX + (textWrapWidth / 2), 8);


    gapLabel = (textWrapWidth / 3);

    textContent = `${this.translatedLangText.HAULIER}:`;
    PDFUtility.addText(pdf, textContent, bufferLabelY, rightRectBoxStartX, 8);

    textContent = `${this.translatedLangText.VEHICLE_NO}:`;
    PDFUtility.addText(pdf, textContent, bufferLabelY, rightRectBoxStartX + (gapLabel), 8);

    textContent = `${this.translatedLangText.DRIVER_NAME}:`;
    PDFUtility.addText(pdf, textContent, bufferLabelY, rightRectBoxStartX + (gapLabel * 2), 8);

    gapLabel = (textWrapWidth / 2);
    bufferLabelY += 4;

    textContent = `${this.eirDetails?.create_by}`;
    PDFUtility.addText(pdf, textContent, bufferLabelY, leftRectBoxStartX, 8, true);

    textContent = `${this.publish_by}`;
    PDFUtility.addText(pdf, textContent, bufferLabelY, leftRectBoxStartX + gapLabel, 8, true);

    gapLabel = (textWrapWidth / 3);
    textContent = `${this.getGate()?.tank?.storing_order?.haulier}`;
    PDFUtility.addText(pdf, textContent, bufferLabelY, rightRectBoxStartX, 8, true);

    textContent = `${this.getGate()?.vehicle_no}`;
    PDFUtility.addText(pdf, textContent, bufferLabelY, rightRectBoxStartX + (gapLabel), 8, true);

    textContent = `${this.getGate()?.driver_name}`;
    PDFUtility.addText(pdf, textContent, bufferLabelY, rightRectBoxStartX + (gapLabel * 2), 8, true);

    //lastTableFinalY = startRectY + bufferLabelY;
    textContent = `${this.translatedLangText.COMPUTER_GENERATED_NOTE}`;
    // PDFUtility.AddTextAtRightCornerPage(pdf, textContent, pageWidth, leftMargin, rightMargin, lastTableFinalY + 6, 8);
    PDFUtility.AddTextAtRightCornerPage(pdf, textContent, pageWidth, leftMargin, rightMargin, pageHeight - (bottomMargin), 8);
    //const totalPages = pdf.getNumberOfPages();

    // pagePositions.forEach(({ page, x, y }) => {
    //   pdf.setDrawColor(0, 0, 0); // black line color
    //   pdf.setLineWidth(0.1);
    //   pdf.setLineDashPattern([0.001, 0.001], 0);
    //   pdf.setFontSize(8);
    //   pdf.setPage(page);
    //   var lineBuffer = 13;
    //   pdf.text(`Page ${page} of ${totalPages}`, pdf.internal.pageSize.width - 20, pdf.internal.pageSize.height - 10, { align: 'right' });
    //   pdf.line(leftMargin, pdf.internal.pageSize.height - lineBuffer, (pageWidth - rightMargin), pdf.internal.pageSize.height - lineBuffer);
    // });

    this.generatingPdfProgress = 100;
    //pdf.save(fileName);
    this.generatingPdfProgress = 0;
    this.generatingPdfLoadingSubject.next(false);
    // Utility.previewPDF(pdf, `${this.GetReportTitle()}.pdf`);
    this.downloadFile(pdf.output('blob'), this.getReportTitle())
    this.dialogRef.close();
  }

  GetReportTitle(): string {
    return `${this.eirTitle}`
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
    /*  
      const element = document.getElementById('eir-form-body');
      if (!element) {
        console.error('Template element not found');
        return;
      }
  
      if (this.type === "in") {
        try {
          this.generatingPdfLoadingSubject.next(true);
          this.generatingPdfProgress = 0;
          // const canvas = await html2canvas(element, {
          //   scale: this.scale, // Increase resolution
          // });
  
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pageWidth = pdf.internal.pageSize.width; // A4 page width
          const pageHeight = pdf.internal.pageSize.height; // A4 page height
          const leftRightMargin = 5; // Fixed left and right margins
          const topMargin = 5; // Reduced top margin
          const bottomMargin = 5; // Reduced bottom margin
          const usableHeight = pageHeight - topMargin - bottomMargin; // Increased usable height
  
          // Calculate natural dimensions for the body content
          const rect = element.getBoundingClientRect();
          const imgWidth = rect.width * 0.264583;  // px to mm
          const imgHeight = rect.height * 0.264583;
          const aspectRatio = imgWidth / imgHeight;
  
          // Calculate scaled width and height to fit the page without stretching
          const scaledWidth = pageWidth - leftRightMargin * 2; // Adjusted width with fixed margins
          const scaledHeight = scaledWidth / aspectRatio;
  
          let yOffset = 0;
          let currentPage = 1;
          const totalPages = Math.ceil(imgHeight / usableHeight);
  
          while (yOffset < imgHeight) {
            if (yOffset > 0) pdf.addPage();
  
            // Add Header and get its height
            const headerHeight = 28;
            await Utility.addHeaderWithCompanyLogo_Portriat(pdf, pageWidth, topMargin, bottomMargin, leftRightMargin, leftRightMargin, this.translate);
            this.generatingPdfProgress += 33;
  
            // Adjust usable height by subtracting header height
            const adjustedUsableHeight = usableHeight - headerHeight;
  
            // Add Body Content
            const chunkHeight = Math.min(imgHeight - yOffset, adjustedUsableHeight);
            const canvasChunk = document.createElement('canvas');
            const context = canvasChunk.getContext('2d');
  
            // Create a new canvas for the current chunk
            canvasChunk.width = canvas.width;
            canvasChunk.height = (chunkHeight * canvas.height) / imgHeight;
  
            if (context) {
              context.drawImage(canvas, 0, -yOffset * (canvas.height / imgHeight));
            }
  
            const chunkImgData = canvasChunk.toDataURL('image/jpeg', this.imageQuality);
            pdf.addImage(chunkImgData, 'JPEG', leftRightMargin, topMargin + headerHeight + 2, scaledWidth, scaledHeight);
            this.generatingPdfProgress += 33;
  
            // Add Footer
            await this.addFooter(pdf, pageWidth, pageHeight, leftRightMargin, bottomMargin, currentPage, totalPages);
  
            yOffset += chunkHeight;
            currentPage++;
         // }
          this.generatingPdfProgress = 100;
          pdf.save(`EIR-${this.eirDetails?.in_gate?.eir_no}.pdf`);
          this.generatedPDF = pdf.output('blob');
          this.onDownloadClick();
          this.generatingPdfLoadingSubject.next(false);
          Utility.previewPDF(pdf, `${this.getReportTitle()}`);
          this.dialogRef.close();
        } catch (error) {
          console.error('Error generating PDF:', error);
        }
      }
      return;*/
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

  createHiddenTemplate(
    customerInfo: any,
    eirDetails: any,
    translatedLangText: any,
    eirDisclaimerNote: string,
    eirTitle: string
  ): HTMLElement {
    const template = document.createElement('div');
    template.style.position = 'absolute';
    template.style.top = '-9999px';
    template.style.left = '-9999px';
    template.style.width = '210mm'; // A4 width in mm
    template.style.fontSize = '12px';

    template.innerHTML = `
      <div id="eir-pdf-template">
        <div id="eir-form-header">
          <hr class="mt-2 mb-1" />
          <div class="header-content">
            <div class="logo-container">
              <img src="assets/images/logo.png" alt="Logo" class="header-logo" />
            </div>
            <div class="company-container">
              <h5>${customerInfo.companyName}</h5>
              <p>${customerInfo.companyAddress}</p>
              <p>
                ${translatedLangText.PHONE}: ${customerInfo.companyPhone} |
                ${translatedLangText.FAX}: ${customerInfo.companyFax} |
                ${translatedLangText.EMAIL}: ${customerInfo.companyEmail}
              </p>
              <p>${translatedLangText.CRN}: ${customerInfo.companyUen}</p>
            </div>
          </div>
          <hr class="mt-1 mb-2" />
        </div>
  
        <div id="eir-form-body">
          <div class="eir-title">
            <b>${eirTitle}</b>
          </div>
          <div class="eir-content-start">
            <div class="eir-content">
              <h6>${translatedLangText.EQUIPMENT_INTERCHANGE_RECEIPT}</h6>
              <p>${translatedLangText.TAKE_IN_DATE}: <b>${eirDetails?.in_gate?.create_dt}</b></p>
            </div>
          </div>
          <div class="tank-info-content">
            <table class="tank-info">
              <tbody>
                <tr>
                  <td>${translatedLangText.SO_NO}: <b>${eirDetails?.in_gate?.tank?.storing_order?.so_no}</b></td>
                  <td>${translatedLangText.SO_DATE}: <b>${eirDetails?.in_gate?.tank?.storing_order?.create_dt}</b></td>
                  <td colspan="2">${translatedLangText.LAST_RELEASE_DATE}: <b>${eirDetails?.in_gate?.tank?.storing_order?.create_dt}</b></td>
                </tr>
                <tr>
                  <td>${translatedLangText.TANK_NO}: <b>${eirDetails?.in_gate?.tank?.tank_no}</b></td>
                  <td>${translatedLangText.EIR_NO}: <b>${eirDetails?.in_gate?.eir_no}</b></td>
                  <td>${translatedLangText.TAKE_IN_REFERENCE}: <b>${eirDetails?.in_gate?.tank?.job_no}</b></td>
                  <td>${translatedLangText.DATE_OF_INSPECTION}: <b>${eirDetails?.create_dt}</b></td>
                </tr>
                <tr>
                  <td>${translatedLangText.OPERATOR}: <b>${eirDetails?.create_by}</b></td>
                  <td>${translatedLangText.OWNER}: <b>${eirDetails?.in_gate?.tank?.customer_company?.name}</b></td>
                  <td>${translatedLangText.LAST_CARGO}: <b>${eirDetails?.in_gate?.tank?.tariff_cleaning?.cargo}</b></td>
                  <td>${translatedLangText.LAST_TEST}: <b>${eirDetails?.last_test_desc}</b></td>
                </tr>
                <tr>
                  <td>${translatedLangText.UNIT_TYPE}: <b>${eirDetails?.in_gate?.tank?.unit_type}</b></td>
                  <td>${translatedLangText.CLADDING}: <b>${eirDetails?.cladding_cv}</b></td>
                  <td>${translatedLangText.MANUFACTURER_DOM}: <b>${eirDetails?.manufacturer_cv} (${eirDetails?.dom_dt})</b></td>
                  <td>${translatedLangText.TAKE_IN_STATUS}: <b>${eirDetails?.in_gate?.tank?.clean_status_cv}</b></td>
                </tr>
                <tr>
                  <td>${translatedLangText.CAPACITY}: <b>${eirDetails?.capacity} L</b></td>
                  <td>${translatedLangText.TARE_WEIGHT}: <b>${eirDetails?.tare_weight} KG</b></td>
                  <td>${translatedLangText.MAX_GROSS_WEIGHT}: <b>${eirDetails?.max_weight_cv}</b></td>
                  <td>${translatedLangText.TANK_HEIGHT}: <b>${eirDetails?.height_cv}</b></td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div class="frame-info-content">
            <div class="frame-type">
              <div class="frame-title">${translatedLangText.LEFT_SIDE}</div>
              <div class="image-container frame-rect">
                <img mat-card-image src="assets/images/idms/tank_frame_type/backup/left_side.png" class="img-fluid">
                <div class="grid-overlay">
                  ${this.cells
        .map((cell, index) => `
                    <div class="${this.highlightedCellsLeft[index] ? 'highlighted' : ''}" data-index="${index}">
                    </div>
                  `)
        .join('')}
                </div>
              </div>
            </div>
            <div class="frame-type">
              <div class="frame-title">${translatedLangText.REAR_SIDE}</div>
              <div class="image-container frame-square">
                <img mat-card-image src="assets/images/idms/tank_frame_type/backup/rear_side.png" class="img-fluid">
                <div class="grid-overlay-square">
                  ${this.cellsSquare
        .map((cell, index) => `
                      <div class="${this.highlightedCellsRear[index] ? 'highlighted' : ''}" data-index="${index}">
                      </div>
                    `)
        .join('')}
                </div>
              </div>
            </div>
            <div class="frame-type">
              <div class="frame-title">${translatedLangText.RIGHT_SIDE}</div>
              <div class="image-container frame-rect">
                <img mat-card-image src="assets/images/idms/tank_frame_type/backup/right_side.png" class="img-fluid">
                <div class="grid-overlay">
                  ${this.cells
        .map((cell, index) => `
                      <div class="${this.highlightedCellsRight[index] ? 'highlighted' : ''}" data-index="${index}">
                      </div>
                    `)
        .join('')}
                </div>
              </div>
            </div>
            <div class="frame-type">
              <div class="frame-title">${translatedLangText.TOP_SIDE}</div>
              <div class="image-container frame-rect">
                <img mat-card-image src="assets/images/idms/tank_frame_type/backup/top_side.png" class="img-fluid">
                <div class="grid-overlay">
                  ${this.cells
        .map((cell, index) => `
                      <div class="${this.highlightedCellsTop[index] ? 'highlighted' : ''}" data-index="${index}">
                      </div>
                    `)
        .join('')}
                </div>
                <div class="custom-container to-mark opacity-75">
                  <div class="outer-layer">
                    <div class="outer-top">
                    </div>

                    <!-- Middle part with inner grid and side borders -->
                    <div class="outer-middle">
                      <div class="outer-left">
                      </div>
                      <div class="inner-grid">
                        <!-- Top Row with 4 Columns -->
                        <div class="grid-top-row">
                          ${this.cellsInnerTopBottom
        .map((cell, index) => `
                              <div class="${this.highlightedCellsWalkwayTop[index] ? 'highlighted' : ''}" data-index="${index}">
                              </div>
                            `)
        .join('')}
                        </div>

                        <!-- Middle Row (to be defined later) -->
                        <div class="grid-middle-row">
                          ${this.cellsInnerMiddle
        .map((cell, index) => `
                              <div class="${this.highlightedCellsWalkwayMiddle[index] ? 'highlighted' : ''}" data-index="${index}">
                              </div>
                            `)
        .join('')}
                        </div>

                        <!-- Bottom Row with 4 Columns -->
                        <div class="grid-bottom-row">
                          ${this.cellsInnerTopBottom
        .map((cell, index) => `
                              <div class="${this.highlightedCellsWalkwayBottom[index] ? 'highlighted' : ''}" data-index="${index}">
                              </div>
                            `)
        .join('')}
                        </div>
                      </div>
                      <div class="outer-right">
                      </div>
                    </div>
                    <!-- Bottom part of the outer layer -->
                    <div class="outer-bottom">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="frame-type">
              <div class="frame-title">${translatedLangText.FRONT_SIDE}</div>
              <div class="image-container frame-square">
                <img mat-card-image src="assets/images/idms/tank_frame_type/backup/front_side.png" class="img-fluid">
                <div class="grid-overlay-square">
                  ${this.cellsSquare
        .map((cell, index) => `
                      <div class="${this.highlightedCellsFront[index] ? 'highlighted' : ''}" data-index="${index}">
                      </div>
                    `)
        .join('')}
                </div>
              </div>
            </div>
            <div class="frame-type">
              <div class="frame-title">${translatedLangText.BOTTOM_SIDE}</div>
              <div class="image-container frame-rect">
                <img mat-card-image src="assets/images/idms/tank_frame_type/backup/bottom_side.png" class="img-fluid">
                <div class="grid-overlay">
                  ${this.cells
        .map((cell, index) => `
                      <div class="${this.highlightedCellsBottom[index] ? 'highlighted' : ''}" data-index="${index}">
                      </div>
                    `)
        .join('')}
                </div>
              </div>
            </div>
          </div>
  
          <div class="manlid-info-content mt-1">
            <table class="manlid-info w-50">
              <tbody>
                <tr class="th">
                  <td class="td-col-6">
                    <b>${translatedLangText.BOTTOM_DIS_COMP}</b>
                  </td>
                  <td class="td-col-1">
                    <b>${translatedLangText.YES}</b>
                  </td>
                  <td class="td-col-1">
                    <b>${translatedLangText.NO}</b>
                  </td>
                  <td class="td-col-4">
                    <b>${translatedLangText.SPECIFICATION}</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    ${translatedLangText.BOTTOM_DIS_COMP__ABB}
                  </td>
                  <td>
                    ${eirDetails?.btm_dis_comp_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.btm_dis_comp_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${this.disCompCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.btm_dis_comp_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                  </td>
                </tr>
                <tr>
                  <td>${translatedLangText.FOOT_VALVE}</td>
                  <td>
                    ${eirDetails?.foot_valve_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.foot_valve_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${this.footValveCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.foot_valve_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                  </td>
                </tr>
                <tr>
                  <td>${translatedLangText.BRAND}</td>
                  <td>
                    ${eirDetails?.btm_valve_brand_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.btm_valve_brand_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${this.valveBrandCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.btm_valve_brand_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                  </td>
                </tr>
                <tr>
                  <td>
                    ${translatedLangText.BOTTOM_DIS_VALVE__ABB}
                    (
                    ${this.disValveCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.btm_dis_valve_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                    )
                  </td>
                  <td>
                    ${eirDetails?.btm_dis_valve_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.btm_dis_valve_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${this.disValveSpecCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.btm_dis_valve_spec_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                  </td>
                </tr>
                <tr>
                  <td>
                    ${translatedLangText.THERMOMETER}
                    (
                    <span class="text-decoration-underline">
                      ${eirDetails?.thermometer}
                    </span> &deg;C
                    )
                  </td>
                  <td>
                    ${eirDetails?.thermometer ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.thermometer ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${this.thermometerCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.thermometer ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                  </td>
                </tr>
                <tr>
                  <td>${translatedLangText.LADDER}</td>
                  <td>
                    ${eirDetails?.ladder ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.ladder ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>${translatedLangText.DATA_SCS_TRANSPORT_PLATE}</td>
                  <td>
                    ${eirDetails?.data_csc_transportplate ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.data_csc_transportplate ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td></td>
                </tr>
                <tr class="th">
                  <td class="td-col-6">
                    <b>${translatedLangText.TOP_DIS_COMP}</b>
                  </td>
                  <td class="td-col-1">
                    <b>${translatedLangText.YES}</b>
                  </td>
                  <td class="td-col-1">
                    <b>${translatedLangText.NO}</b>
                  </td>
                  <td class="td-col-4">
                    <b>${translatedLangText.SPECIFICATION}</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    {{translatedLangText.TOP_DIS_COMP__ABB}}
                  </td>
                  <td>
                    ${eirDetails?.top_dis_comp_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.top_dis_comp_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${this.disCompCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.top_dis_comp_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                  </td>
                </tr>
                <tr>
                  <td>
                    ${translatedLangText.TOP_DIS_VALVE__ABB}
                    (
                    ${this.disValveCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.top_dis_valve_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                    )
                  </td>
                  <td>
                    ${eirDetails?.top_dis_valve_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.top_dis_valve_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${this.disValveSpecCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.top_dis_valve_spec_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                  </td>
                </tr>
                <tr>
                  <td>${translatedLangText.BRAND}</td>
                  <td>
                    ${eirDetails?.top_valve_brand_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.top_valve_brand_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${this.valveBrandCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.top_valve_brand_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                  </td>
                </tr>
                <tr>
                  <td>
                    ${translatedLangText.AIRLINE_VALVE}
                    (<span class="text-decoration-underline">${eirDetails?.airline_valve_pcs || '_'}</span> pcs)
                    (<span class="text-decoration-underline">${eirDetails?.airline_valve_dim || '_'}</span> inch)
                  </td>
                  <td>
                    ${eirDetails?.airline_valve_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.airline_valve_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${this.airlineCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.airline_valve_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                  </td>
                </tr>
                <tr>
                  <td>
                    ${translatedLangText.AIRLINE_VALVE_CONNECTIONS}
                    (
                    ${this.airlineConnCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.airline_valve_conn_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                    )
                  </td>
                  <td>
                    ${eirDetails?.airline_valve_conn_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.airline_valve_conn_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${this.manlidCoverCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.airline_valve_conn_spec_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="manlid-info w-50">
              <tbody>
                <tr class="th">
                  <td class="td-col-6">
                    <b>${translatedLangText.MANLID_COMPARTMENT}</b>
                  </td>
                  <td class="td-col-1">
                    <b>${translatedLangText.YES}</b>
                  </td>
                  <td class="td-col-1">
                    <b>${translatedLangText.NO}</b>
                  </td>
                  <td class="td-col-4">
                    <b>${translatedLangText.SPECIFICATION}</b>
                  </td>
                </tr>
                <tr>
                  <td>${translatedLangText.MANLID_COMP__ABB}</td>
                  <td>
                    ${eirDetails?.manlid_comp_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.manlid_comp_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${this.disCompCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.manlid_comp_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                  </td>
                </tr>
                <tr>
                  <td>
                    ${translatedLangText.MANLID_COVER}
                    (
                    ${this.manlidCoverCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.manlid_cover_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                    )
                  </td>
                  <td>
                    ${eirDetails?.manlid_cover_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.manlid_cover_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    <span class="text-decoration-underline">${eirDetails?.manlid_cover_pcs || '_'}</span> pcs /
                    <span class="text-decoration-underline">${eirDetails?.manlid_cover_pts || '_'}</span> pts
                  </td>
                </tr>
                <tr>
                  <td>
                    ${translatedLangText.MANLID_SEAL}
                    (
                    ${this.manlidSealCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.manlid_seal_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                    )
                  </td>
                  <td>
                    ${eirDetails?.manlid_seal_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.manlid_seal_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                  </td>
                </tr>
                <tr>
                  <td>
                    ${translatedLangText.PV}
                    (
                    ${this.pvTypeCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.pv_type_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                    )
                    (
                    ${this.pvSpecCvList
        .map((codeValue) => `
                        <span class="${codeValue.code_val !== eirDetails?.pv_spec_cv ? 'text-decoration-line-through' : ''}">
                          ${codeValue.description}
                        </span>
                      `)
        .join('/')}
                    )
                  </td>
                  <td>
                    ${eirDetails?.pv_type_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.pv_type_cv ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    <span class="text-decoration-underline">${eirDetails?.pv_type_pcs || '_'}</span> pcs /
                    <span class="text-decoration-underline">${eirDetails?.pv_spec_pcs || '_'}</span> pcs
                  </td>
                </tr>
                <tr>
                  <td>${translatedLangText.SAFETY_HANDRAIL}</td>
                  <td>
                    ${eirDetails?.safety_handrail ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.safety_handrail ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>${translatedLangText.BUFFER_PLATE}</td>
                  <td>
                    ${eirDetails?.buffer_plate ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.buffer_plate ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    <span class="text-decoration-underline">${eirDetails?.buffer_plate || '_'}</span> pcs
                  </td>
                </tr>
                <tr>
                  <td>${translatedLangText.RESIDUE}</td>
                  <td>
                    ${eirDetails?.residue ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.residue ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    <span class="text-decoration-underline">${eirDetails?.residue || '_'}</span> KG
                  </td>
                </tr>
                <tr>
                  <td>${translatedLangText.DIPSTICK}</td>
                  <td>
                    ${eirDetails?.dipstick ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td>
                    ${!eirDetails?.dipstick ? '<mat-icon>checked</mat-icon>' : ''}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div class="comment-info-content mt-1">
            <span><b>${translatedLangText.OTHER_COMMENTS}</b>: ${eirDetails?.comments}</span>
          </div>
  
          <div class="purpose-info-content mt-1">
            <span><b>${translatedLangText.PURPOSE}</b>: ${this.displayTankPurpose(eirDetails?.in_gate?.tank)}</span>
            <span>${eirDetails?.in_gate?.tank?.remarks}</span>
          </div>
  
          <div class="receiver-haulier-info-content mt-1">
            <table>
              <tbody>
                <tr>
                  <td class="w-50">
                    <div class="receiver-info-content">
                      <div class="receiver-title">
                        <b>${customerInfo.companyName}</b>
                      </div>
                      <div class="receiver-description">
                        <span>${translatedLangText.EIR_COMPANY_DECLARATION}</span>
                      </div>
                      <span class="font-bold">-</span>
                      <div class="receiver-parties-info">
                        <div class="parties-info">
                          <span>${translatedLangText.SURVEY_BY}:</span>
                          <span><b>${eirDetails?.create_by}</b></span>
                        </div>
                        <div class="parties-info">
                          <span>${translatedLangText.REVIEW_BY}:</span>
                          <span><b>${eirDetails?.create_by}</b></span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="haulier-info-content">
                      <div class="haulier-info-upper">
                        <div class="receiver-title">
                          <b>${customerInfo.companyName}</b>
                        </div>
                        <div class="receiver-description">
                          <span>${translatedLangText.EIR_HAULIER_DECLARATION}</span>
                        </div>
                      </div>
                      <span class="font-bold">-</span>
                      <div class="haulier-info-bottom">
                        <div class="receiver-parties-info">
                          <div class="parties-info">
                            <span>${translatedLangText.HAULIER}:</span>
                            <span><b>${eirDetails?.in_gate?.tank?.storing_order?.haulier}</b></span>
                          </div>
                          <div class="parties-info">
                            <span>${translatedLangText.VEHICLE_NO}:</span>
                            <span><b>${eirDetails?.in_gate?.vehicle_no}</b></span>
                          </div>
                          <div class="parties-info">
                            <span>${translatedLangText.DRIVER_NAME}:</span>
                            <span><b>${eirDetails?.in_gate?.driver_name}</b></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <div id="eir-form-footer" class="pdf-container pdf-footer">
          <hr class="mt-0 mb-1" />
          <div class="disclaimer">
            <span class="font-bold text-decoration-underline">${translatedLangText.DISCLAIMER}: </span>
            <span>${eirDisclaimerNote}</span>
          </div>
          <div class="footer-info-content">
            <span>
              ${customerInfo.eirDisclaimerVer}
            </span>
            <span>
              ${translatedLangText.COMPUTER_GENERATED_NOTE}
            </span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(template);
    return template;
  }

  cleanupTemplate(template: HTMLElement) {
    if (template && template.parentNode) {
      template.parentNode.removeChild(template);
    }
  }

  getInGateSurveyData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.igsDS.getInGateSurveyByIDForEirPdf(this.gate_survey_guid!)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  getOutGateSurveyData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.ogsDS.getOutGateSurveyByIDForEirPdf(this.gate_survey_guid!)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async getCodeValuesData(): Promise<void> {
    const queries = [
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'cleanStatusCv', codeValType: 'CLEAN_STATUS' },
      { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
      { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
      { alias: 'manufacturerCv', codeValType: 'MANUFACTURER' },
      { alias: 'claddingCv', codeValType: 'CLADDING' },
      { alias: 'maxGrossWeightCv', codeValType: 'MAX_WEIGHT' },
      { alias: 'tankHeightCv', codeValType: 'TANK_HEIGHT' },
      { alias: 'walkwayCv', codeValType: 'WALKWAY' },
      { alias: 'airlineCv', codeValType: 'AIRLINE_VALVE' },
      { alias: 'airlineConnCv', codeValType: 'AIRLINE_VALVE_CONN' },
      { alias: 'disCompCv', codeValType: 'DIS_COMP' },
      { alias: 'disValveCv', codeValType: 'DIS_VALVE' },
      { alias: 'disValveSpecCv', codeValType: 'DIS_VALVE_SPEC' },
      { alias: 'disTypeCv', codeValType: 'DISCHARGE_TYPE' },
      { alias: 'footValveCv', codeValType: 'FOOT_VALVE' },
      { alias: 'manlidCoverCv', codeValType: 'MANLID_COVER' },
      { alias: 'manlidSealCv', codeValType: 'MANLID_SEAL' },
      { alias: 'pvSpecCv', codeValType: 'PV_SPEC' },
      { alias: 'pvTypeCv', codeValType: 'PV_TYPE' },
      { alias: 'thermometerCv', codeValType: 'THERMOMETER' },
      { alias: 'valveBrandCv', codeValType: 'VALVE_BRAND' },
      { alias: 'tankSideCv', codeValType: 'TANK_SIDE' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
    ];

    // Initiate the query
    this.cvDS.getCodeValuesByType(queries);

    // Wrap all alias connections in promises
    const promises = [
      firstValueFrom(this.cvDS.connectAlias('purposeOptionCv')).then(data => {
        this.purposeOptionCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('cleanStatusCv')).then(data => {
        this.cleanStatusCvList = addDefaultSelectOption(data, "Unknown");
      }),
      firstValueFrom(this.cvDS.connectAlias('testTypeCv')).then(data => {
        this.testTypeCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('testClassCv')).then(data => {
        this.testClassCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('manufacturerCv')).then(data => {
        this.manufacturerCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('claddingCv')).then(data => {
        this.claddingCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('maxGrossWeightCv')).then(data => {
        this.maxGrossWeightCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('tankHeightCv')).then(data => {
        this.tankHeightCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('walkwayCv')).then(data => {
        this.walkwayCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('airlineCv')).then(data => {
        this.airlineCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('airlineConnCv')).then(data => {
        this.airlineConnCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('disCompCv')).then(data => {
        this.disCompCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('disValveCv')).then(data => {
        this.disValveCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('disValveSpecCv')).then(data => {
        this.disValveSpecCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('disTypeCv')).then(data => {
        this.disTypeCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('footValveCv')).then(data => {
        this.footValveCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('manlidCoverCv')).then(data => {
        this.manlidCoverCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('manlidSealCv')).then(data => {
        this.manlidSealCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('pvSpecCv')).then(data => {
        this.pvSpecCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('pvTypeCv')).then(data => {
        this.pvTypeCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('thermometerCv')).then(data => {
        this.thermometerCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('valveBrandCv')).then(data => {
        this.valveBrandCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('tankSideCv')).then(data => {
        this.tankSideCvList = data || [];
      }),
      firstValueFrom(this.cvDS.connectAlias('tankStatusCv')).then(data => {
        this.tankStatusCvList = data || [];
      })
    ];

    // Wait for all promises to resolve
    await Promise.all(promises);
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

  getLastTest(igs: any): string | undefined {
    return this.getLastTestIGS(igs);
  }

  getLastTestIGS(gs: any): string | undefined {
    if (!this.testTypeCvList?.length || !this.testClassCvList?.length || !gs) return "";

    if (gs && gs.last_test_cv && gs.test_class_cv && gs.test_dt) {
      const test_type = gs.last_test_cv;
      const test_class = gs.test_class_cv;
      return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(gs.test_dt as number, 'MM/YYYY') + " - " + test_class;
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

  getCladdingDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.claddingCvList);
  }

  getManufactureDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.manufacturerCvList);
  }

  getMaxGrossWeightDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.maxGrossWeightCvList);
  }

  getTankHeightDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankHeightCvList);
  }

  getCleanStatusDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.cleanStatusCvList);
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
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

  getReportTitle(): string {
    var title: string = '';
    title = `EIR-${this.getGate()?.eir_no}-${this.getGate()?.tank?.tank_no}.pdf`
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

  async uploadEir(group_guid: string, pdfBlob: Blob) {
    const eirPdfUploadRequest: any = {
      file: pdfBlob,
      metadata: {
        TableName: 'in_gate_survey',
        FileType: 'pdf',
        GroupGuid: group_guid,
        Description: 'IN_GATE_EIR'
      }
    }

    this.fileManagerService.uploadFiles([eirPdfUploadRequest]).subscribe({
      next: (response) => {
        console.log('Files uploaded successfully:', response);
        if (response?.affected) {
          this.eirPdf = [
            {
              description: 'IN_GATE_EIR',
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
    });
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
}