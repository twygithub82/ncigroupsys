import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { TariffBufferDS, TariffBufferItem } from 'app/data-sources/tariff-buffer';
import { TariffDepotItem } from 'app/data-sources/tariff-depot';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ModulePackageService } from 'app/services/module-package.service';
import { NumericTextDirective } from 'app/directive/numeric-text.directive';

export interface DialogData {
  action?: string;
  selectedValue?: number;
  langText?: any;
  selectedItem: TariffBufferItem;
}
interface Condition {
  guid: { eq: string };
  tariff_depot_guid: { eq: null };
}

@Component({
  selector: 'app-tariff-buffer-form-edit-dialog',
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
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    PreventNonNumericDirective,
    NumericTextDirective
  ],
})
export class FormDialogComponent_Edit extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'fName',
    'lName',
    'email',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;
  trfBufferDS: TariffBufferDS;

  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();
  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME: 'COMMON-FORM.COMPANY-NAME',
    SO_NO: 'COMMON-FORM.SO-NO',
    SO_NOTES: 'COMMON-FORM.SO-NOTES',
    CLEANING: 'COMMON-FORM.CLEANING',
    FLASH_POINT: 'COMMON-FORM.FLASH-POINT',
    REMARKS: 'COMMON-FORM.REMARKS',
    OPEN_ON_GATE: 'COMMON-FORM.OPEN-ON-GATE',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SEARCH: 'COMMON-FORM.SEARCH',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
    INVALID: 'COMMON-FORM.INVALID',
    EXISTED: 'COMMON-FORM.EXISTED',
    DUPLICATE: 'COMMON-FORM.DUPLICATE',
    SELECT_ATLEAST_ONE: 'COMMON-FORM.SELECT-ATLEAST-ONE',
    ADD_ATLEAST_ONE: 'COMMON-FORM.ADD-ATLEAST-ONE',
    ROLLBACK_STATUS: 'COMMON-FORM.ROLLBACK-STATUS',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    CARGO_NAME: 'COMMON-FORM.CARGO-NAME',
    CARGO_ALIAS: 'COMMON-FORM.CARGO-ALIAS',
    CARGO_DESCRIPTION: 'COMMON-FORM.CARGO-DESCRIPTION',
    CARGO_CLASS: 'COMMON-FORM.CARGO-CLASS',
    CARGO_CLASS_SELECT: 'COMMON-FORM.CARGO-CLASS-SELECT',
    CARGO_UN_NO: 'COMMON-FORM.CARGO-UN-NO',
    CARGO_METHOD: 'COMMON-FORM.CARGO-METHOD',
    CARGO_CATEGORY: 'COMMON-FORM.CARGO-CATEGORY',
    CARGO_FLASH_POINT: 'COMMON-FORM.CARGO-FLASH-POINT',
    CARGO_BAN_TYPE: 'COMMON-FORM.CARGO-BAN-TYPE',
    CARGO_NATURE: 'COMMON-FORM.CARGO-NATURE',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    CARGO_NOTE: 'COMMON-FORM.CARGO-NOTE',
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    VIEW: 'COMMON-FORM.VIEW',
    DEPOT_PROFILE: 'COMMON-FORM.DEPOT-PROFILE',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    PREINSPECTION_COST: "COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST: "COMMON-FORM.LOLO-COST",
    STORAGE_COST: "COMMON-FORM.STORAGE-COST",
    FREE_STORAGE: "COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED',
    GATE_IN_COST: 'COMMON-FORM.GATE-IN-COST',
    GATE_OUT_COST: 'COMMON-FORM.GATE-OUT-COST',
    COST: 'COMMON-FORM.COST',
    LAST_UPDATED: "COMMON-FORM.LAST-UPDATED",
    BUFFER_TYPE: "COMMON-FORM.BUFFER-TYPE",
    BUFFER_CLEANING: 'MENUITEMS.TARIFF.LIST.TARIFF-BUFFER',
  };
  unit_type_control = new UntypedFormControl();

  selectedItem: TariffBufferItem;
  isMobile: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent_Edit>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private modulePackageService: ModulePackageService
  ) {
    // Set the defaults
    super();
    this.selectedItem = data.selectedItem;
    this.trfBufferDS = new TariffBufferDS(this.apollo);
    this.pcForm = this.createTariffBuffer();

    this.action = data.action!;
    this.translateLangText();
    this.isMobile = Utility.isMobile();
  }

  ngOnInit() {
    if (!this.canEdit()) {
      this.pcForm?.get('buffer_type')?.disable()
      this.pcForm?.get('cost')?.disable()
      this.pcForm?.get('remarks')?.disable()
    }
  }

  createTariffBuffer(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: this.selectedItem,
      buffer_type: this.selectedItem.buffer_type,
      cost: this.selectedItem.cost,
      remarks: this.selectedItem.remarks
    });
  }


  removeTypename(obj: any): any {
    return JSON.parse(JSON.stringify(obj), (key, value) =>
      key === '__typename' ? undefined : value
    );
  }

  GetTitle() {
    return this.translatedLangText.EDIT + " " + this.translatedLangText.BUFFER_TYPE;
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  canEdit() {
    return this.isAllowEdit() && !!this.selectedItem?.guid;
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {

      console.log('valid');
      this.dialogRef.close(count);
    }
  }

  update() {
    if (!this.pcForm?.valid) return;

    let where: any = {};
    if (this.pcForm!.value['buffer_type']) {
      where.buffer_type = { eq: this.pcForm!.value['buffer_type'] };
    }

    this.subs.sink = this.trfBufferDS.SearchTariffBuffer(where).subscribe(data => {
      let update = true;
      if (data.length > 0) {
        var queriedRec = data[0];
        if (queriedRec.guid != this.selectedItem.guid) {
          update = false;
          this.pcForm?.get('buffer_type')?.setErrors({ existed: true });
        }
      }
      if (update) {
        var td = new TariffBufferItem(this.selectedItem);
        td.buffer_type = this.pcForm!.value['buffer_type'];
        td.cost = Number(this.pcForm!.value['cost']);
        td.remarks = this.pcForm!.value['remarks'];
        this.trfBufferDS.updateTariffBuffer(td).subscribe(result => {
          this.handleSaveSuccess(result?.data?.updateTariffBuffer);
        });
      }
    });
  }

  displayLastUpdated(r: TariffDepotItem) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    const date = new Date(updatedt! * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    // Replace the '/' with '-' to get the required format


    return `${day}/${month}/${year}`;

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

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['TARIFF_BUFFER_CLEANING_EDIT']);
  }
    getColumnClasses(baseClasses: string, Padding: boolean = true): string {
      const centerClass = Padding ? 'px-3' : '';
      return `${baseClasses} ${centerClass}`.trim();
    }
}
