import { Direction } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { getDefaultInspectionTypes, InspectionsDS, InspectionsItem, InspectionType } from 'app/data-sources/inspections';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { RepairItem } from 'app/data-sources/repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairDS } from 'app/data-sources/rp-damage-repair';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffRepairDS } from 'app/data-sources/tariff-repair';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ModulePackageService } from 'app/services/module-package.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import { Subject } from 'rxjs';

export interface DialogData {
  action?: string;
  sot?: StoringOrderTankItem;
  repair?: RepairItem;
  inspect?: InspectionsItem;
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
    PreventNonNumericDirective,
    MappingChartComponent,
    MatCardModule,
  ],
})
export class MappingChartFormDialogComponent extends UnsubscribeOnDestroyAdapter {
  public dataSubject: Subject<any> = new Subject();
  action: string;
  index: number;
  dialogTitle: string;
  customer_company_guid: string;

  inspectionForm: UntypedFormGroup;
  partNameControl: UntypedFormControl;
  partNameList?: string[];
  partNameFilteredList?: string[];
  dimensionList?: string[];
  lengthList?: any[];
  valueChangesDisabled: boolean = false;
  subgroupNameCvList?: CodeValuesItem[];
  existedPart?: RepairPartItem[];
  selected4XRepair = "";
  sot?: StoringOrderTankItem;
  inspect?: InspectionsItem;
  inspectionTypes: InspectionType[] = [];
  selectedInspectionType?: InspectionType;

  cvDS: CodeValuesDS;
  trDS: TariffRepairDS;
  repDrDS: RPDamageRepairDS;
  prDS: PackageRepairDS;
  inspectDS: InspectionsDS;
  clnRepairPart: RepairPartItem = new RepairPartItem();

  markedCells: Map<number, CellMark> = new Map();
  circularMarkedSections: Map<string, Map<string, CellMark>> = new Map([
    ['front', new Map<string, CellMark>()],
    ['rear', new Map<string, CellMark>()]
  ]);
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
    this.trDS = new TariffRepairDS(this.apollo);
    this.repDrDS = new RPDamageRepairDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.inspectDS = new InspectionsDS(this.apollo);
    this.action = data.action!;
    this.customer_company_guid = data.customer_company_guid!;
    if (this.action === 'edit') {
      this.dialogTitle = `${data.translatedLangText.INTERNAL_INSPECTION_MAPPING}`;
    } else {
      this.dialogTitle = `${data.translatedLangText.INTERNAL_INSPECTION_MAPPING}`;
    }
    this.sot = data.sot;
    this.inspect = data.inspect || new InspectionsItem({ inspect_dt: Utility.convertDate(new Date()) as number });
    this.index = data.index;
    this.partNameControl = new UntypedFormControl('', [Validators.required]);
    this.inspectionForm = this.createForm();
    this.inspectionTypes = getDefaultInspectionTypes();
    this.initializeValueChange();
    this.patchForm();
  }

  ngAfterViewInit() {
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      guid: [this.inspect?.guid],
    });
  }

  patchForm() {
  }


  resetForm() {

  }

  submit(addAnother: boolean) {
    console.log(this.markedCells)
    console.log(this.circularMarkedSections)
    // if (this.repairPartForm?.valid) {
    //   if (this.action === 'new') {
    //     this.repairPart.action = 'new';
    //   } else {
    //     if (this.repairPart.action !== 'new') {
    //       this.repairPart.action = 'edit';
    //     }
    //   }

    //   var rep: any = {
    //     ...this.repairPart,
    //     location_cv: this.repairPartForm.get('location_cv')?.value,
    //     comment: this.repairPartForm.get('comment')?.value?.trim(),
    //     tariff_repair_guid: this.repairPart?.tariff_repair_guid,
    //     tariff_repair: this.repairPart?.tariff_repair,
    //     rp_damage_repair: [...this.REPDamage(this.repairPartForm.get('damage')?.value), ...this.REPRepair(this.repairPartForm.get('repair')?.value)],
    //     quantity: this.repairPartForm.get('quantity')?.value,
    //     hour: this.repairPartForm.get('hour')?.value,
    //     material_cost: Utility.convertNumber(this.repairPartForm.get('material_cost')?.value, 2),
    //     remarks: this.repairPartForm.get('remarks')?.value,
    //     create_dt: this.repairPart.create_dt ? this.repairPart.create_dt : Utility.convertDate(new Date())
    //   }
    //   const concludeLength = this.getPartLength(rep);

    //   let prefix = (`${rep.location_cv ? this.getLocationDescription(rep.location_cv) : ''}` + ' ' + (rep.comment ? rep.comment : '')).trim();
    //   prefix = prefix ? `${prefix} - ` : '';

    //   rep.description = `${prefix}${rep.tariff_repair?.alias} ${concludeLength} ${rep.remarks ?? ''}`.trim();
    //   console.log(rep)

    //   // they agreed to allow add same part
    //   // if (this.validateExistedPart(rep)) {
    //   //   this.confirmationDialog(addAnother, rep);
    //   // } else {
    //   //   this.returnAndCloseDialog(addAnother, rep);
    //   // }
    //   this.returnAndCloseDialog(addAnother, rep);
    // } else {
    //   this.findInvalidControls();
    // }
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
        this.returnAndCloseDialog(addAnother, rep);
      }
    });
  }

  returnAndCloseDialog(addAnother: boolean, rep: any) {
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

  onRepairSelectionChange(event: any) {
    if (event.value.includes('4X')) {
      this.selected4XRepair = "4X";
    } else {
      if (event.value.length) {
        this.selected4XRepair = "oth";
      } else {
        this.selected4XRepair = "";
      }
    }
  }

  isDisabledOption(compareValue?: string) {
    if (!this.selected4XRepair) return false;

    if (this.selected4XRepair === "oth") {
      if (compareValue !== "4X") {
        return false;
      } else {
        return true;
      }
    } else if (this.selected4XRepair === "4X") {
      if (compareValue !== "4X") {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  displayPartNameFn(tr: string): string {
    return tr;
  }

  isEdit(): boolean {
    return this.action === 'edit';
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
    ComponentUtil.showNotification('snackbar-success', this.data.translatedLangText.ADD_SUCCESS, 'top', 'center', this.snackBar);
  }

  extractDescription(rep: RepairPartItem) {
    const concludeLength = rep.tariff_repair?.length
      ? `${rep.tariff_repair.length}${this.getUnitTypeDescription(rep.tariff_repair.length_unit_cv)} `
      : '';
    return `${this.getLocationDescription(rep.location_cv)} ${rep.tariff_repair?.part_name} ${concludeLength} ${rep.remarks ?? ''}`.trim();
  }

  validateExistedPart(toValidatePart: any): boolean {
    return this.existedPart?.some((part: any) => {
      const existingPartDesc = this.extractDescription(part);
      const newPartDesc = this.extractDescription(toValidatePart);

      const isSameDescription = existingPartDesc === newPartDesc;
      if (!isSameDescription) return false;

      if (this.action === 'edit') {
        const sameGuid = part.guid && toValidatePart.guid && part.guid === toValidatePart.guid;
        const sameIndex = toValidatePart.index === part.index;

        // If it's the same item (same guid or same index), skip
        if (sameGuid || (!part.guid && sameIndex)) return false;
      }

      return true;
    }) || false;
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
    return this.isAllowEdit() && this.inspectDS.canAmend(this.inspect);
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
    return this.inspect?.inspect_dt ? Utility.convertEpochToDateStr(this.inspect?.inspect_dt) : '';
  }

  selectInspectionType(type: InspectionType): void {
    this.selectedInspectionType = type;
    console.log('Selected type:', type);
  }

  onCellMarked(event: { index: number, mark: CellMark }): void {
    this.markedCells.set(event.index, event.mark);
    console.log('Cell marked:', event);
  }

  onCircularSectionMarked(event: { surface: string, section: string, mark: CellMark }): void {
    const surfaceMap = this.circularMarkedSections.get(event.surface);
    if (surfaceMap) {
      surfaceMap.set(event.section, event.mark);
    }
    console.log('Circular section marked:', event);
  }

  getSymbolStyle(type: InspectionType): any {
    if (type.shape === 'triangle') {
      return {
        'border-bottom-color': type.color
      };
    }

    if (type.shape === 'cross' || type.shape === 'diagonal') {
      // For cross and diagonal, we'll use CSS variables
      return {
        '--shape-color': type.color
      };
    }

    // For circle and square, use background-color
    return {
      'background-color': type.color
    };
  }
}
