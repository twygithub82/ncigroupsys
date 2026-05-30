import { Direction } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule, MatOptionSelectionChange } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { CellMark, MappingChartComponent } from '@shared/components/mapping-chart/mapping-chart.component';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS } from 'app/data-sources/code-values';
import { getDefaultInspectionTypes, InspectionsDS, InspectionsItem, InspectionType, SurfaceTypesItem } from 'app/data-sources/inspections';
import { RepairItem } from 'app/data-sources/repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { NumericTextDirective } from 'app/directive/numeric-text.directive';
import { InGateMappingPdfComponent } from 'app/document-template/pdf/inventory/in-gate-mapping-pdf/in-gate-mapping-pdf.component';
import { ModulePackageService } from 'app/services/module-package.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import { Subject } from 'rxjs';


export interface DialogData {
  type_cv?: string;
  action?: string;
  sot?: StoringOrderTankItem;
  repair?: RepairItem;
  inspection?: InspectionsItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
  customer_company_guid?: string;
  existedPart?: RepairPartItem[]
}

@Component({
  selector: 'app-repair-estimate-mapping-chart-form-dialog',
  templateUrl: './mapping-chart-form-dialog.component.html',
  styleUrls: ['./mapping-chart-form-dialog.component.scss'],
  providers: [provideNgxMask()],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CommonModule,
    MatProgressSpinnerModule,
    MappingChartComponent,
    MatCardModule,
    NumericTextDirective
  ],
})
export class MappingChartFormDialogComponent extends UnsubscribeOnDestroyAdapter {
  public dataSubject: Subject<any> = new Subject();
  type_cv: string;
  action: string;
  index: number;
  dialogTitle: string = '';
  customer_company_guid: string;

  inspectionForm: UntypedFormGroup;
  sot?: StoringOrderTankItem;
  inspection?: InspectionsItem;
  existingSurfaceTypes: SurfaceTypesItem[] = [];
  private cachedSurfaceTypes: SurfaceTypesItem[] = [];
  uniqueSurfaceTypes: SurfaceTypesItem[] = [];
  activeSurfaceTypes: SurfaceTypesItem[] = [];

  inspectionTypes: InspectionType[] = [];
  selectedInspectionType?: InspectionType;
  validationErrorMessage: string = '';

  cvDS: CodeValuesDS;
  inspectDS: InspectionsDS;
  isGeneratingReport: boolean = false;
  markedCells: Map<number, CellMark> = new Map();
  circularMarkedSections: { front: Map<string, CellMark>, rear: Map<string, CellMark> } = {
    front: new Map(),
    rear: new Map()
  };
  reportTitle: string = '';
  constructor(
    public dialogRef: MatDialogRef<MappingChartFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    public modulePackageService: ModulePackageService
  ) {
    super();
    // Set the defaults
    this.cvDS = new CodeValuesDS(this.apollo);
    this.inspectDS = new InspectionsDS(this.apollo);
    this.type_cv = data.type_cv!;
    this.action = data.action!;
    this.customer_company_guid = data.customer_company_guid!;

    if (this.type_cv === '1') {
      this.dialogTitle = `${data.translatedLangText.INTERNAL_INSPECTION_MAPPING_IN}`;
      this.reportTitle = `${data.translatedLangText.PRE_REPAIR_MAPPING_CHART}`;
    } else if (this.type_cv === '2') {
      this.dialogTitle = `${data.translatedLangText.INTERNAL_INSPECTION_MAPPING_OUT}`;
      this.reportTitle = `${data.translatedLangText.POST_REPAIR_MAPPING_CHART}`;
    }
    this.sot = data.sot;
    this.inspection = data.inspection || new InspectionsItem({ inspect_dt: Utility.convertDate(new Date()) as number });
    this.existingSurfaceTypes = this.inspection?.surface_types || [];
    this.index = data.index;
    this.inspectionForm = this.createForm();
    this.inspectionTypes = getDefaultInspectionTypes();
    console.log(this.inspection)
    this.loadMarkedSections();
    this.initializeValueChange();
    this.updateSurfaceTypesLists(); // Initialize the lists
    this.patchForm();
  }

  ngAfterViewInit() {
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      guid: [this.inspection?.guid],
      surface_types: this.fb.array([])
    });
  }

  patchForm() {
    // Clear existing form array
    this.surfaceTypesFormArray.clear();

    // Populate the form array with data from uniqueSurfaceTypes
    this.uniqueSurfaceTypes.forEach(item => {
      this.surfaceTypesFormArray.push(this.createSurfaceTypeFormGroup(item));
    });
  }

  get surfaceTypesFormArray(): UntypedFormArray {
    return this.inspectionForm.get('surface_types') as UntypedFormArray;
  }

  createSurfaceTypeFormGroup(item: any): UntypedFormGroup {
    return this.fb.group({
      type_cv: [item.type_cv],
      value: [item.value || ''], // percentage value
      remarks: [item.remarks || '']
    });
  }

  resetForm() {

  }

  submit() {
    this.markFormGroupTouched(this.inspectionForm);

    if (!this.validateSubmission()) {
      return;
    }

    this.updateSurfaceTypesFromForm();
    const surfaceTypes = this.getValidSurfaceTypes();

    // Construct the inspection object
    const inspection = new InspectionsItem({
      guid: this.inspection?.guid,
      sot_guid: this.sot?.guid,
      inspect_dt: this.inspection?.inspect_dt,
      marked_tank_section: this.serializeMarkedCells(),
      marked_front_section: this.serializeCircularSection('front'),
      marked_rear_section: this.serializeCircularSection('rear'),
      type_cv: this.inspection?.type_cv || this.type_cv,
      surface_types: [],
    });

    console.log('Submitting inspection:', inspection);
    console.log('Surface types from form:', surfaceTypes); // Debug log

    if (!this.inspection?.guid) {
      this.inspectDS.addInspections(inspection, surfaceTypes).subscribe(result => {
        if (result?.data?.addInspections) {
          console.log('result:', result);
          this.addedSuccessfully();
          this.returnAndCloseDialog(false);
        }
      });
    } else {
      this.inspectDS.updateInspections(inspection, surfaceTypes).subscribe(result => {
        if (result?.data?.updateInspections) {
          console.log('result:', result);
          this.addedSuccessfully();
          this.returnAndCloseDialog(false);
        }
      });
    }
  }

  download() {
    this.isGeneratingReport = true;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(InGateMappingPdfComponent, {
      width: '90vw',
      data: {
        reportTitle: this.reportTitle,
        sot: this.sot,
        markedCells: this.markedCells,
        circularMarkedSections: this.circularMarkedSections,
        activeSurfaceTypes: this.activeSurfaceTypes,
        translatedLangText: this.data.translatedLangText,
        inspection: this.inspection
      },
      direction: tempDirection
    });
    dialogRef.updatePosition({
      top: '-9999px',  // Move far above the screen
      left: '-9999px'  // Move far to the left of the screen
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.isGeneratingReport = false;
    });
  }

  confirmationDialog(addAnother: boolean, rep: any) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        headerText: this.data.translatedLangText.DUPLICATE_PART_DETECTED,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.returnAndCloseDialog(addAnother);
      }
    });
  }

  returnAndCloseDialog(addAnother: boolean) {
    const returnDialog: DialogData = {
      index: this.index
    }
    if (addAnother) {
      this.dialogRef.close(returnDialog);
    } else {
      this.dialogRef.close(returnDialog);
    }
  }

  markFormGroupTouched(formGroup: UntypedFormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof UntypedFormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control!.markAsTouched();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initializeValueChange() {
  }

  findInvalidControls() {
    const controls = this.inspectionForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  displayPartNameFn(tr: string): string {
    return tr;
  }

  isEdit(): boolean {
    return this.inspection?.guid ? true : false;
  }

  getLocationDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData?.partLocationCvList);
  }

  getUnitTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.data.populateData.unitTypeCvList);
  }

  searchPart() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
  }

  addedSuccessfully() {
    ComponentUtil.showNotification('snackbar-success', this.data.translatedLangText.SAVE_SUCCESS, 'top', 'center', this.snackBar);
  }

  extractDescription(rep: RepairPartItem) {
    const concludeLength = rep.tariff_repair?.length
      ? `${rep.tariff_repair.length}${this.getUnitTypeDescription(rep.tariff_repair.length_unit_cv)} `
      : '';
    return `${this.getLocationDescription(rep.location_cv)} ${rep.tariff_repair?.part_name} ${concludeLength} ${rep.remarks ?? ''}`.trim();
  }

  onSelectObjectSelectionChange(event: MatSelectChange, formControlName: string): void {
    var ctr = this.inspectionForm.get(formControlName)
    const currentValue = ctr?.value;
    if (currentValue === event.value) {
      // Deselect
      ctr?.setValue(null);
    }
    else {
      ctr?.setValue(event.value);
    }
  }

  onOptionClicked(event: MatOptionSelectionChange, value: string, formControlName: string) {
    if (!event.isUserInput || !event.source.selected) {
      return; // Prevent double or non-user-triggered calls
    }

    var ctr = this.inspectionForm.get(formControlName)
    if (ctr) {
      if (event.source.selected && ctr.value === value) {
        ctr.setValue(null);
      }
    }
  }

  canEdit() {
    return this.isAllowEdit() && this.inspectDS.canAmend(this.inspection);
  }

  canDownload() {
    return !!this.inspection?.guid;
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['REPAIR_REPAIR_ESTIMATE_EDIT']);
  }

  parse2Decimal(input: number | string | undefined) {
    return Utility.formatNumberDisplay(input);
  }

  getPartLength(rep: any) {
    const concludeLength = rep?.tariff_repair?.length
      ? `${rep.tariff_repair.length}${this.getUnitTypeDescription(rep?.tariff_repair.length_unit_cv)} `
      : '';
    return concludeLength;
  }

  getInspectionDateDisplay() {
    return this.inspection?.inspect_dt ? Utility.convertEpochToDateStr(this.inspection?.inspect_dt) : '';
  }

  selectInspectionType(type: InspectionType): void {
    this.selectedInspectionType = type;
  }

  onCellMarked(event: { index: number, mark: CellMark }): void {
    if (event.mark && event.mark.typeId) {
      this.markedCells.set(event.index, event.mark);
      this.updateSurfaceTypeAction(event.mark.typeId, 'mark');
    } else {
      this.markedCells.delete(event.index);
      const typeId = this.markedCells.get(event.index)?.typeId;
      if (typeId) {
        this.updateSurfaceTypeAction(typeId, 'unmark');
      }
    }

    this.validationErrorMessage = '';

    // Update lists when marks change
    this.updateSurfaceTypesLists();
  }

  onCircularSectionMarked(event: { surface: string, section: string, mark: CellMark }): void {
    const surfaceMap = event.surface === 'front'
      ? this.circularMarkedSections.front
      : this.circularMarkedSections.rear;

    if (event.mark && event.mark.typeId) {
      surfaceMap.set(event.section, event.mark);
      this.updateSurfaceTypeAction(event.mark.typeId, 'mark');
    } else {
      const existingMark = surfaceMap.get(event.section);
      surfaceMap.delete(event.section);
      if (existingMark?.typeId) {
        this.updateSurfaceTypeAction(existingMark.typeId, 'unmark');
      }
    }

    this.validationErrorMessage = '';

    // Update lists when marks change
    this.updateSurfaceTypesLists();
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

    const result = Array.from(surfaceTypeMap.values()).sort((a, b) => {
      const aName = this.inspectionTypes.find(t => t.type === a.type_cv)?.displayName || '';
      const bName = this.inspectionTypes.find(t => t.type === b.type_cv)?.displayName || '';
      return aName.localeCompare(bName);
    });

    // Sync form array with the new structure
    this.syncSurfaceTypesFormArray(result);

    return result;
  }

  private updateSurfaceTypeAction(typeId: string, operation: 'mark' | 'unmark'): void {
    const existingType = this.existingSurfaceTypes.find(st => st.type_cv === typeId);

    if (operation === 'mark') {
      // When marking, ensure the type exists with proper action
      if (existingType) {
        // If it was marked for cancellation, restore it to edit
        if (existingType.action === 'cancel') {
          existingType.action = 'edit';
        }
      }
      // If it doesn't exist in existingSurfaceTypes, it will be created as 'new' in getUniqueSurfaceTypes
    } else {
      // When unmarking, check if this type is still used anywhere
      const isStillUsed = this.isTypeIdStillInUse(typeId);

      if (!isStillUsed) {
        if (existingType) {
          // If it's an existing type, mark it as 'cancel' instead of deleting
          if (existingType.action === 'edit' || !existingType.action) {
            existingType.action = 'cancel';
          } else if (existingType.action === 'new') {
            // If it's a new type, remove it from existingSurfaceTypes
            const index = this.existingSurfaceTypes.findIndex(st => st.type_cv === typeId);
            if (index !== -1) {
              this.existingSurfaceTypes.splice(index, 1);
            }
          }
        }
      }
    }
  }

  private isTypeIdStillInUse(typeId: string): boolean {
    // Check in markedCells
    for (const mark of this.markedCells.values()) {
      if (mark.typeId === typeId) {
        return true;
      }
    }

    // Check in front circular sections
    for (const mark of this.circularMarkedSections.front.values()) {
      if (mark.typeId === typeId) {
        return true;
      }
    }

    // Check in rear circular sections
    for (const mark of this.circularMarkedSections.rear.values()) {
      if (mark.typeId === typeId) {
        return true;
      }
    }

    return false;
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

  getInspectionTypeShape(type_cv: string | undefined): string {
    const inspectionType = this.inspectionTypes.find(t => t.type === type_cv);
    return inspectionType?.shape || 'circle';
  }

  getInspectionTypeDesc(type_cv: string | undefined): string {
    const inspectionType = this.inspectionTypes.find(t => t.type === type_cv);
    return inspectionType?.displayName || '';
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

  selectText(event: FocusEvent) {
    Utility.selectText(event)
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
        value: [savedValues?.value ?? type.value ?? '', Validators.required],
        remarks: [savedValues?.remarks ?? type.remarks ?? ''],
        action: [type.action]
      }));
    });
  }

  getSurfaceTypeFormGroup(index: number): UntypedFormGroup {
    const formGroup = this.surfaceTypesFormArray.at(index) as UntypedFormGroup;
    return formGroup;
  }

  private validateSubmission(): boolean {
    this.validationErrorMessage = '';
    // Check if any marks exist
    if (this.markedCells.size === 0 &&
      this.circularMarkedSections.front.size === 0 &&
      this.circularMarkedSections.rear.size === 0) {
      this.validationErrorMessage = this.data.translatedLangText.PLEASE_MARK_INSPECTION_AREAS;
      return false;
    }

    // Check if surface types form is valid
    if (this.surfaceTypesFormArray.invalid) {
      this.validationErrorMessage = "";//this.data.translatedLangText.PLEASE_FILL_REQUIRED_FIELDS;
      return false;
    }

    return true;
  }

  private updateSurfaceTypesFromForm(): void {
    // Use activeSurfaceTypes since form array only contains active ones
    this.activeSurfaceTypes.forEach((type, index) => {
      const formGroup = this.getSurfaceTypeFormGroup(index);
      if (formGroup) {
        type.value = formGroup.get('value')?.value;
        type.remarks = formGroup.get('remarks')?.value;
      }
    });
  }

  private serializeMarkedCells(): string {
    const markedArray = Array.from(this.markedCells.entries()).map(([index, mark]) => ({
      index,
      type_cv: mark.inspectionType
    }));

    return JSON.stringify(markedArray);
  }

  private serializeCircularSection(surface: 'front' | 'rear'): string {
    const sectionMap = this.circularMarkedSections[surface];
    const sectionArray = Array.from(sectionMap.entries()).map(([section, mark]) => ({
      section,
      type_cv: mark.inspectionType
    }));

    return JSON.stringify(sectionArray);
  }

  // private getValidSurfaceTypes(): SurfaceTypesItem[] {
  //   return this.uniqueSurfaceTypes
  //     .map(type => {
  //       const surfaceType = new SurfaceTypesItem({
  //         guid: type.action === 'new' ? undefined : type.guid,
  //         inspection_guid: this.inspection?.guid,
  //         type_cv: type.type_cv,
  //         value: type.value,
  //         remarks: type.remarks,
  //         action: type.action,
  //       });

  //       return surfaceType;
  //     });
  // }

  getValidSurfaceTypes(): SurfaceTypesItem[] {
    // Get all surface types (including 'cancel')
    const allTypes = this.uniqueSurfaceTypes;

    return allTypes.map(type => {
      // Find matching form data for active types only
      const activeIndex = this.activeSurfaceTypes.findIndex(t => t.type_cv === type.type_cv);

      let value = type.value;
      let remarks = type.remarks;

      // If this type is active and has a form control, get the latest form values
      if (activeIndex !== -1 && activeIndex < this.surfaceTypesFormArray.length) {
        const formGroup = this.surfaceTypesFormArray.at(activeIndex);
        value = formGroup.get('value')?.value;
        remarks = formGroup.get('remarks')?.value;
      }

      return new SurfaceTypesItem({
        guid: type.guid || '',
        inspection_guid: this.inspection?.guid,
        type_cv: type.type_cv,
        value: value ? Number(value) : undefined,
        remarks: remarks || undefined,
        action: type.action
      });
    });
  }

  private loadMarkedSections(): void {
    if (this.inspection?.marked_tank_section) {
      const markedData = JSON.parse(this.inspection.marked_tank_section);
      markedData.forEach((item: { index: number, type_cv: string }) => {
        const inspectionType = this.inspectionTypes.find(t => t.type === item.type_cv);
        if (inspectionType) {
          const mark: CellMark = {
            typeId: item.type_cv,
            inspectionType: item.type_cv,
            color: inspectionType.color,
            backgroundColor: inspectionType.backgroundColor,
            shape: inspectionType.shape,
            style: {
              type: 'shape',
              shape: inspectionType.shape,
              color: inspectionType.color,
              backgroundColor: inspectionType.backgroundColor
            },
            timestamp: Date.now(),
            surface: 'tank',
            position: item.index.toString()
          };
          this.markedCells.set(item.index, mark);
        }
      });
    }

    if (this.inspection?.marked_front_section) {
      const frontData = JSON.parse(this.inspection.marked_front_section);
      frontData.forEach((item: { section: string, type_cv: string }) => {
        const inspectionType = this.inspectionTypes.find(t => t.type === item.type_cv);
        if (inspectionType) {
          const mark: CellMark = {
            typeId: item.type_cv,
            inspectionType: item.type_cv,
            color: inspectionType.color,
            backgroundColor: inspectionType.backgroundColor,
            shape: inspectionType.shape,
            style: {
              type: 'shape',
              shape: inspectionType.shape,
              color: inspectionType.color,
              backgroundColor: inspectionType.backgroundColor
            },
            timestamp: Date.now(),
            surface: 'front',
            position: item.section
          };
          this.circularMarkedSections.front.set(item.section, mark);
        }
      });
    }

    if (this.inspection?.marked_rear_section) {
      const rearData = JSON.parse(this.inspection.marked_rear_section);
      rearData.forEach((item: { section: string, type_cv: string }) => {
        const inspectionType = this.inspectionTypes.find(t => t.type === item.type_cv);
        if (inspectionType) {
          const mark: CellMark = {
            typeId: item.type_cv,
            inspectionType: item.type_cv,
            color: inspectionType.color,
            backgroundColor: inspectionType.backgroundColor,
            shape: inspectionType.shape,
            style: {
              type: 'shape',
              shape: inspectionType.shape,
              color: inspectionType.color,
              backgroundColor: inspectionType.backgroundColor
            },
            timestamp: Date.now(),
            surface: 'rear',
            position: item.section
          };
          this.circularMarkedSections.rear.set(item.section, mark);
        }
      });
    }

    // Trigger update of surface types list
    // this.updateUniqueSurfaceTypes();
  }

  clearAll(): void {
    this.markedCells = new Map();
    this.circularMarkedSections = { front: new Map(), rear: new Map() };

    // Unsaved ('new') types are removed; persisted types are marked as 'cancel'
    this.existingSurfaceTypes = this.existingSurfaceTypes.filter(st => st.action !== 'new');
    this.existingSurfaceTypes.forEach(st => {
      st.action = 'cancel';
    });

    this.validationErrorMessage = '';
    this.updateSurfaceTypesLists();
  }

  deleteItem(event: Event, item: SurfaceTypesItem, index: number) {
    event.stopPropagation();

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {},
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const existingType = this.existingSurfaceTypes.find(st => st.type_cv === item.type_cv);

        if (existingType) {
          // Already persisted — mark as cancelled instead of removing
          existingType.action = 'cancel';
        } else {
          // New/unsaved — remove from existingSurfaceTypes entirely
          const existingIndex = this.existingSurfaceTypes.findIndex(st => st.type_cv === item.type_cv);
          if (existingIndex !== -1) {
            this.existingSurfaceTypes.splice(existingIndex, 1);
          }
        }

        // Clear all marks associated with this type_cv
        this.markedCells.forEach((mark, cellIndex) => {
          if (mark.typeId === item.type_cv) {
            this.markedCells.delete(cellIndex);
          }
        });
        this.circularMarkedSections.front.forEach((mark, section) => {
          if (mark.typeId === item.type_cv) {
            this.circularMarkedSections.front.delete(section);
          }
        });
        this.circularMarkedSections.rear.forEach((mark, section) => {
          if (mark.typeId === item.type_cv) {
            this.circularMarkedSections.rear.delete(section);
          }
        });

        // Create new Map references so child components detect the change
        this.markedCells = new Map(this.markedCells);
        this.circularMarkedSections = {
          front: new Map(this.circularMarkedSections.front),
          rear: new Map(this.circularMarkedSections.rear)
        };

        // Recalculate lists and sync form
        this.updateSurfaceTypesLists();
      }
    });
  }
}
