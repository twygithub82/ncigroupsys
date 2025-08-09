import { Direction } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairDS, RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS } from 'app/data-sources/tariff-cleaning';
import { TariffRepairDS } from 'app/data-sources/tariff-repair';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, Subject, tap } from 'rxjs';
import { SearchFormDialogComponent } from '../search-form-dialog/search-form-dialog.component';
import { PackageResidueDS, PackageResidueItem } from 'app/data-sources/package-residue';
import { NumericTextDirective } from 'app/directive/numeric-text.directive';
import { ResiduePartItem } from 'app/data-sources/residue-part';
import { ResidueItem } from 'app/data-sources/residue';


export interface DialogData {
  action?: string;
  residueItem?: ResidueItem;
  item?: ResiduePartItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
  customer_company_guid?: string;
  existedPart?: RepairPartItem[]
}

@Component({
  selector: 'app-residue-approval-estimate-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
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
    NumericTextDirective
  ],
})
export class FormDialogComponent extends UnsubscribeOnDestroyAdapter {
  public dataSubject: Subject<any> = new Subject();
  action: string;
  index: number;
  dialogTitle: string;
  customer_company_guid: string;

  residuePartForm: UntypedFormGroup;
  residueItem: any;
  residuePart: any;
  partNameList?: string[];
  partNameFilteredList?: string[];
  dimensionList?: string[];
  lengthList?: any[];
  valueChangesDisabled: boolean = false;
  displayPartResidueList: any[] = [];
  existedPart?: any[];
  convertedExistedPart?: any[];

  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  trDS: TariffRepairDS;
  repDrDS: RPDamageRepairDS;
  prDS: PackageResidueDS;

  newDescControl = new UntypedFormControl();
  updateSelectedItem: any = undefined;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private snackBar: MatSnackBar
  ) {
    super();
    // Set the defaults
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.trDS = new TariffRepairDS(this.apollo);
    this.repDrDS = new RPDamageRepairDS(this.apollo);
    this.prDS = new PackageResidueDS(this.apollo);
    this.action = data.action!;
    this.residueItem = data.residueItem;
    this.customer_company_guid = data.customer_company_guid!;
    if (this.action === 'edit') {
      this.dialogTitle = `${data.translatedLangText.EDIT} ${data.translatedLangText.ESTIMATE_DETAILS}`;
    } else {
      this.dialogTitle = `${data.translatedLangText.NEW} ${data.translatedLangText.ESTIMATE_DETAILS}`;
    }
    this.residuePart = data.item ? data.item : new ResiduePartItem();
    this.index = data.index;
    this.existedPart = data.existedPart;
    this.convertExistedPart();
    this.newDescControl = new UntypedFormControl('', [Validators.required]);
    this.residuePartForm = this.createForm();
    this.initializeValueChange();
    // this.patchForm();
  }

  ngAfterViewInit() {
  }

  createForm(): UntypedFormGroup {
    this.residuePartForm = this.fb.group({
      guid: [this.residuePart?.guid],
      description: [{ value: this.residuePart?.description, disabled: !this.canEdit() }],
      quantity: [{ value: this.residuePart?.quantity, disabled: !this.canEdit() }],
      unit_type: [{ value: this.residuePart?.qty_unit_type_cv, disabled: !this.canEdit() }],
      cost: [{ value: this.residuePart?.cost, disabled: !this.canEdit() }]
    });

    if (this.index > -1) {
      this.newDescControl.setValue(this.convertedExistedPart?.[this.index]);
    }

    return this.residuePartForm;
  }

  resetForm() {

  }

  submit(addAnother: boolean) {
    if (this.residuePartForm?.valid) {
      var descObject: PackageResidueItem;

      if (typeof this.newDescControl?.value === "object") {
        descObject = new PackageResidueItem(this.newDescControl?.value!);
        descObject.description = descObject.tariff_residue?.description;
      } else {
        descObject = new PackageResidueItem();
        descObject.description = this.newDescControl?.value!;
      }
      descObject.cost = Utility.convertNumber(this.residuePartForm?.get('cost')?.value, 2);

      this.checkDuplicationEst(descObject, this.index);
      if (!this.newDescControl?.valid) return;

      if (this.index == -1) {
        this.residuePart.action = "NEW";
      }
      else {
        this.residuePart.action = this.residuePart.guid ? "EDIT" : "NEW";
      }

      this.residuePart.cost = descObject.cost;
      this.residuePart.description = descObject.description;
      this.residuePart.quantity = Utility.convertNumber(this.residuePartForm?.get('quantity')?.value, 0);
      this.residuePart.qty_unit_type_cv = this.residuePartForm?.get('unit_type')?.value;
      this.residuePart.residue_guid = this.residueItem?.guid;
      this.residuePart.tariff_residue_guid = descObject.tariff_residue?.guid;

      console.log(this.residuePart)
      this.returnAndCloseDialog(addAnother, this.residuePart);
    } else {
      this.findInvalidControls();
    }
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
      item: rep,
      index: this.index
    }
    if (addAnother) {
      this.dataSubject.next(returnDialog);
      this.residuePart = new ResiduePartItem();
      this.residuePartForm = this.createForm();
      this.initializeValueChange();
      this.initializePartNameValueChange();
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
    this.newDescControl?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var desc_value: any = this.newDescControl?.value;
        if (typeof desc_value === 'object' && this.updateSelectedItem === undefined && desc_value) {
          this.residuePartForm.get('cost')?.setValue(desc_value?.cost?.toFixed(2) || '');
        } else if (desc_value) {
          this.getPackageResidue(desc_value);
        } else {
          this.getPackageResidue('');
        }
      })
    ).subscribe();
  }

  initializePartNameValueChange() {
    // this.repairPartForm?.get('part_name')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     if (value) {
    //       this.searchPart();
    //     }
    //   })
    // ).subscribe();
  }

  findInvalidControls() {
    const controls = this.residuePartForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  displayResiduePart(cc: any): string {
    return cc && cc.tariff_residue ? cc.tariff_residue.description : '';
  }

  canEdit(): boolean {
    return true;
  }

  isEdit(): boolean {
    return this.action === 'edit';
  }

  checkDuplicationEst(item: any, index: number = -1) {
    var existItems = this.existedPart?.filter(data => data.description === item?.description)
    if (existItems?.length) {
      if (index == -1 || index != existItems[0].index) {
        this.newDescControl?.setErrors({ duplicated: true });
      }
    }
  }

  convertExistedPart() {
    const existingDescriptions = this.displayPartResidueList.map(item => item.description);
    this.convertedExistedPart = this.existedPart?.filter(item => !existingDescriptions.includes(item?.description) && !!item.description)
      .map(item => ({
        action: null,
        guid: item.guid || null,
        description: item.description,
        tariff_residue_guid: item.tariff_residue_guid || "",
        quantity: item.quantity || 0,
        cost: item.cost || 0,
        approve_qty: null,
        approve_cost: null,
        approve_part: true,
        delete_dt: null,
        tariff_residue: {
          description: item.description,
          guid: item.tariff_residue_guid || "",
        },
        index: item.index
      })) || [];
  }

  populatePartList(alias?: string) {
    if (this.convertedExistedPart?.length) {
      const existingDescriptions = this.displayPartResidueList.map(item => item.description);
      let filteredItems = this.convertedExistedPart.filter(item => !existingDescriptions.includes(item.tariff_residue?.description));

      if (alias) {
        filteredItems = filteredItems.filter(item =>
          item.tariff_repair?.alias?.toLowerCase().includes(alias.toLowerCase())
        );
      }

      this.displayPartResidueList = [...filteredItems, ...this.displayPartResidueList];
    }
  }

  getPackageResidue(alias?: string) {
    let where: any = {};
    let custCompanyGuid: string = this.customer_company_guid;
    where.customer_company_guid = { eq: custCompanyGuid };
    where.and = [];
    if (alias) where.and.push({ tariff_residue: { description: { contains: alias } } });
    this.prDS.SearchPackageResidue(where, {}).subscribe(data => {
      this.displayPartResidueList = data;
      this.populatePartList(alias);
    });
  }
}
