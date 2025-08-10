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
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { SteamDS } from 'app/data-sources/steam';
import { SteamPartItem } from 'app/data-sources/steam-part';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffRepairDS } from 'app/data-sources/tariff-repair';
import { NumericTextDirective } from 'app/directive/numeric-text.directive';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import { Subject, debounceTime, startWith, tap } from 'rxjs';


export interface DialogData {
  action?: string;
  item?: RepairPartItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
  customer_company_guid?: string;
  existedPart?: RepairPartItem[]
}

@Component({
  selector: 'app-steam-estimate-approval-form-dialog',
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

  steamPartForm: UntypedFormGroup;
  steamItem: any;
  steamPart: any;
  partNameList?: string[];
  partNameFilteredList?: string[];
  dimensionList?: string[];
  lengthList?: any[];
  valueChangesDisabled: boolean = false;
  subgroupNameCvList?: CodeValuesItem[];
  displayPartSteamList: any[] = [];
  existedPart?: any[];
  convertedExistedPart?: any[];
  newDescControl = new UntypedFormControl();
  updateSelectedItem: any = undefined;

  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  trDS: TariffRepairDS;
  prDS: PackageRepairDS;
  steamDS: SteamDS;
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
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.trDS = new TariffRepairDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.steamDS = new SteamDS(this.apollo);
    this.action = data.action!;
    this.customer_company_guid = data.customer_company_guid!;
    this.existedPart = data.existedPart;
    this.convertExistedPart();
    if (this.action === 'edit') {
      this.dialogTitle = `${data.translatedLangText.EDIT} ${data.translatedLangText.ESTIMATE_DETAILS}`;
    } else {
      this.dialogTitle = `${data.translatedLangText.NEW} ${data.translatedLangText.ESTIMATE_DETAILS}`;
    }
    this.steamPart = data.item ? data.item : new SteamPartItem();
    this.index = data.index;
    this.newDescControl = new UntypedFormControl('', [Validators.required]);
    this.steamPartForm = this.createForm();
    this.initializeValueChange();
  }

  ngAfterViewInit() {
    this.initializePartNameValueChange();
  }

  createForm(): UntypedFormGroup {
    this.steamPartForm = this.fb.group({
      guid: [this.steamPart?.guid],
      description: [{ value: this.steamPart?.description, disabled: !this.canEdit() }],
      quantity: [{ value: this.steamPart?.quantity, disabled: !this.canEdit() }],
      labour: [{ value: this.steamPart?.labour, disabled: !this.canEdit() }],
      cost: [{ value: this.steamPart?.cost, disabled: !this.canEdit() }]
    });

    if (this.index > -1) {
      this.newDescControl.setValue(this.convertedExistedPart?.[this.index]);
    }

    return this.steamPartForm;
  }

  resetForm() {

  }

  submit(addAnother: boolean) {
    if (this.steamPartForm?.valid) {
      var descObject: SteamPartItem;
      if (typeof this.newDescControl?.value === "object") {
        var repItm: RepairPartItem = this.newDescControl?.value!;

        descObject = new SteamPartItem();
        descObject.description = repItm.tariff_repair?.alias;
      } else {
        descObject = new SteamPartItem();
        descObject.description = this.newDescControl?.value;
      }
      descObject.quantity = Utility.convertNumber(this.steamPartForm?.get('quantity')?.value, 2);
      descObject.labour = Utility.convertNumber(this.steamPartForm?.get('labour')?.value, 2);
      descObject.cost = Utility.convertNumber(this.steamPartForm?.get('cost')?.value, 2);
      this.checkDuplicationEst(descObject, this.index);
      if (!this.newDescControl?.valid) return;

      if (this.index == -1) {
        this.steamPart.action = "NEW";
      }
      else {
        this.steamPart.action = this.steamPart.guid ? "EDIT" : "NEW";
      }

      this.steamPart.description = descObject.description;
      this.steamPart.quantity = descObject.quantity;
      this.steamPart.labour = descObject.labour;
      this.steamPart.cost = descObject.cost;
      this.returnAndCloseDialog(addAnother, this.steamPart);
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
      this.addedSuccessfully();
      this.steamPart = new SteamPartItem();
      this.steamPartForm = this.createForm();
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
          this.steamPartForm.get('quantity')?.setValue(this.steamPart?.quantity ? this.steamPart?.quantity : (desc_value?.quantity || 1));
          this.steamPartForm.get('labour')?.setValue(desc_value?.labour_hour?.toFixed(2) || '');
          this.steamPartForm.get('cost')?.setValue(desc_value?.material_cost?.toFixed(2) || '');
        } else if (desc_value) {
          this.getPackageSteamAlias(desc_value);
        } else {
          this.getPackageSteamAlias('');
        }
      })
    ).subscribe();
  }

  initializePartNameValueChange() {
  }

  getPackageSteamAlias(alias?: string) {
    let where: any = {};
    let custCompanyGuid: string = this.customer_company_guid;
    where.and = [];
    where.and.push({ customer_company_guid: { eq: custCompanyGuid } });
    if (alias) where.and.push({ tariff_repair: { alias: { contains: alias } } });
    this.prDS.SearchPackageRepair(where, {}).subscribe(data => {
      this.displayPartSteamList = data || [];
      this.populatePartList(alias);
    });
  }

  findInvalidControls() {
    const controls = this.steamPartForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  validateLength(): boolean {
    let isValid = true;
    const length = this.steamPartForm.get('length')?.value;
    const remarks = this.steamPartForm.get('remarks')?.value;

    // Validate that at least one of the purpose checkboxes is checked
    if (!length && !remarks) {
      isValid = false; // At least one purpose must be selected
      this.steamPartForm.get('remarks')?.setErrors({ required: true });
    }

    return isValid;
  }

  canEdit(): boolean {
    return true;
  }

  isEdit(): boolean {
    return this.action === 'edit';
  }

  addedSuccessfully() {
    ComponentUtil.showNotification('snackbar-success', this.data.translatedLangText.ADD_SUCCESS, 'top', 'center', this.snackBar);
  }

  displaySteamPart(cc: any): string {
    return cc && cc.tariff_repair ? cc.tariff_repair.alias : '';
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
    const existingDescriptions = this.displayPartSteamList.map(item => item.tariff_repair?.alias);
    this.convertedExistedPart = this.existedPart?.filter(item => !existingDescriptions.includes(item.tariff_repair?.alias) && !!item.description)
      .map(item => ({
        labour_hour: item.labour,
        material_cost: item.cost,
        tariff_repair_guid: "",
        tariff_repair: {
          alias: item.description
        }
      })) || [];
  }

  populatePartList(alias?: string) {
    if (this.convertedExistedPart?.length) {
      const existingAliases = this.displayPartSteamList.map(item => item.tariff_repair?.alias);
      let filteredItems = this.convertedExistedPart.filter(item => !existingAliases.includes(item.tariff_repair?.alias));

      if (alias) {
        filteredItems = filteredItems.filter(item =>
          item.tariff_repair?.alias?.toLowerCase().includes(alias.toLowerCase())
        );
      }

      this.displayPartSteamList = [...filteredItems, ...this.displayPartSteamList];
    }
  }
}
