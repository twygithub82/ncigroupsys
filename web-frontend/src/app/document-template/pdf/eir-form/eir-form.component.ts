import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { InGate, InGateDS, InGateGO, InGateItem } from 'app/data-sources/in-gate';
import { customerInfo } from 'environments/environment.development';
import { Utility } from 'app/utilities/utility';
import { TranslateService } from '@ngx-translate/core';
import { OutGateItem } from 'app/data-sources/out-gate';
import { InGateSurveyDS, InGateSurveyGO, InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { PackageBufferItem } from 'app/data-sources/package-buffer';
import { NgClass } from '@angular/common';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
// import { saveAs } from 'file-saver';
import { FileManagerService } from '@core/service/filemanager.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComponentUtil } from 'app/utilities/component-util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
// import { fileSave } from 'browser-fs-access';
import { StoringOrderGO } from 'app/data-sources/storing-order';
import { AuthService } from '@core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface DialogData {
  type: string;
  in_gate_survey_guid: string;
  igsDS: InGateSurveyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  eirPdf?: any;
  eir_no?: string;
}

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
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
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
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
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
    DELETE_SUCCESS: 'COMMON-FORM.DELETE-SUCCESS',
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
  }
  @Output() publishedEir = new EventEmitter<any>();
  // @Input() type?: string | null;
  // @Input() igsDS: InGateSurveyDS;
  // @Input() cvDS: CodeValuesDS;
  // @Input() in_gate_survey_guid?: string | null;
  // @Input() populateCodeValues?: any;
  type?: string | null;
  igsDS: InGateSurveyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  in_gate_survey_guid?: string | null;
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

  scale = 1.1;
  imageQuality = 0.85;

  generatedPDF: any;
  eirPdf?: any;
  eirPdfSafeUrl?: any;
  isImageLoading$: Observable<boolean> = this.fileManagerService.loading$;
  isFileActionLoading$: Observable<boolean> = this.fileManagerService.actionLoading$;

  private generatingPdfLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  generatingPdfLoading$: Observable<boolean> = this.generatingPdfLoadingSubject.asObservable();
  generatingPdfProgress = 0;

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
    this.igDS = data.igDS || new InGateDS(this.apollo);
    this.cvDS = data.cvDS || new CodeValuesDS(this.apollo);
    this.in_gate_survey_guid = data.in_gate_survey_guid;
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

  async ngOnInit() {
    this.eirTitle = this.type === "in" ? this.translatedLangText.IN_GATE : this.translatedLangText.OUT_GATE;

    // Await the data fetching
    const data = await this.getInGateSurveyData();
    if (data?.length > 0) {
      this.eirDetails = data[0];
      console.log(this.eirDetails);
      await this.getCodeValuesData();
      this.last_test_desc = this.getLastTest(this.eirDetails);
      this.publish_by = this.eirDetails?.in_gate?.publish_by || this.authService.currentUserName;
      this.highlightedCellsLeft = this.populateHighlightedCells(this.highlightedCellsLeft, JSON.parse(this.eirDetails?.left_coord || '[]'));
      this.highlightedCellsRear = this.populateHighlightedCells(this.highlightedCellsRear, JSON.parse(this.eirDetails?.rear_coord || '[]'));
      this.highlightedCellsRight = this.populateHighlightedCells(this.highlightedCellsRight, JSON.parse(this.eirDetails?.right_coord || '[]'));
      this.populateTopSideCells(JSON.parse(this.eirDetails?.top_coord || '{}'));
      this.highlightedCellsFront = this.populateHighlightedCells(this.highlightedCellsFront, JSON.parse(this.eirDetails?.front_coord || '[]'));
      this.highlightedCellsBottom = this.populateHighlightedCells(this.highlightedCellsBottom, JSON.parse(this.eirDetails?.bottom_coord || '[]'));

      this.cdr.detectChanges();

      if (!this.eirPdf?.length) {
        this.generatePDF();
      }
      //  else {
      //   const eirBlob = await Utility.urlToBlob(this.eirPdf?.[0]?.url);
      //   const pdfUrl = URL.createObjectURL(eirBlob);
      //   this.eirPdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl + '#toolbar=0');
      // }
    }
  }

  showPDF(): void {
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

  async generatePDF(): Promise<void> {
    const element = document.getElementById('eir-form-body');
    if (!element) {
      console.error('Template element not found');
      return;
    }

    if (this.type === "in") {
      try {
        this.generatingPdfLoadingSubject.next(true);
        this.generatingPdfProgress = 0;
        const canvas = await html2canvas(element, {
          scale: this.scale, // Increase resolution
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.width; // A4 page width
        const pageHeight = pdf.internal.pageSize.height; // A4 page height
        const leftRightMargin = 5; // Fixed left and right margins
        const topMargin = 5; // Reduced top margin
        const bottomMargin = 5; // Reduced bottom margin
        const usableHeight = pageHeight - topMargin - bottomMargin; // Increased usable height

        // Calculate natural dimensions for the body content
        const imgWidth = canvas.width * 0.264583; // Convert px to mm
        const imgHeight = canvas.height * 0.264583;
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
          const headerHeight = await this.addHeader(pdf, pageWidth, leftRightMargin, topMargin);
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
        }
        this.generatingPdfProgress = 100;
        // pdf.save(`EIR-${this.eirDetails?.in_gate?.eir_no}.pdf`);
        this.generatedPDF = pdf.output('blob');
        this.uploadEir(this.eirDetails?.guid, this.generatedPDF);
        this.generatingPdfLoadingSubject.next(false);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
    return;
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
                  <td>${translatedLangText.TAKE_IN_REFERENCE}: <b>${eirDetails?.in_gate?.tank?.takein_job_no}</b></td>
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
      this.subs.sink = this.igsDS.getInGateSurveyByIDForEirPdf(this.in_gate_survey_guid!)
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
        this.cleanStatusCvList = data || [];
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

  async onDownloadClick() {
    const fileName = `EIR-${this.eirDetails?.in_gate?.eir_no}.pdf`; // Define the filename
    if (this.generatedPDF) {
      this.downloadFile(this.generatedPDF, fileName);
    } else if (this.eirPdf?.[0]?.url) {
      const eirBlob = await Utility.urlToBlob(this.eirPdf?.[0]?.url);
      this.downloadFile(eirBlob, fileName);
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

  onRepublishClick() {
    this.deleteFile();
  }

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

          if (this.eirDetails?.in_gate?.eir_status_cv === 'PENDING') {
            // const sotItem = new StoringOrderTankGO(this.eirDetails?.in_gate?.tank);
            const inGateSurveyItem = new InGateSurveyGO({ tank_comp_guid: this.eirDetails?.tank_comp_guid });
            const inGateItem: any = new InGate(this.eirDetails?.in_gate);
            // inGateItem.tank = sotItem
            inGateItem.in_gate_survey = inGateSurveyItem
            console.log(inGateItem)
            this.igDS.publishInGateSurvey(inGateItem!).subscribe(result => {
              console.log(result)
              if (result.data?.publishIngateSurvey) {
                this.eirDetails.in_gate.eir_status_cv = 'PUBLISHED'; // to avoid republish with PENDING status (first time publish then click republish)
                this.publishedEir.emit({ type: 'published' });
                let successMsg = this.translatedLangText.PUBLISH_SUCCESS;
                ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
              }
            });
          }
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
}
