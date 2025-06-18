import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
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
import { CleaningFormulaDS, CleaningFormulaItem } from 'app/data-sources/cleaning-formulas';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';


export interface DialogData {
  action?: string;
  selectedValue?: number;
  langText?: any;
  selectedItem: CleaningFormulaItem;
}

@Component({
  selector: 'app-cleaning-formulas-form-dialog',
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
    PreventNonNumericDirective
  ],
})
export class FormDialogComponent {
  action: string;
  index?: number;
  dialogTitle?: string;

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();
  fmlDS: CleaningFormulaDS;

  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    ADD: 'COMMON-FORM.ADD',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME: 'COMMON-FORM.COMPANY-NAME',
    REMARKS: 'COMMON-FORM.REMARKS',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE',
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
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    CATEGORY_NAME: "COMMON-FORM.CATEGORY-NAME",
    CATEGORY_DESCRIPTION: "COMMON-FORM.CATEGORY-DESCRIPTION",
    CATEGORY_COST: "COMMON-FORM.CARGO-COST",
    CLEANING_CATEGORY: "COMMON-FORM.CLEANING-CATEGORY",
    CLEANING_METHOD: 'COMMON-FORM.CLEANING-PROCESS',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    METHOD_NAME: "COMMON-FORM.METHOD-NAME",
    MIN_DURATION: "COMMON-FORM.MIN-DURATION",
    MAX_DURATION: "COMMON-FORM.MAX-DURATION",
    CLEANING_FORMULA: "MENUITEMS.CLEANING-MANAGEMENT.LIST.CLEAN-FORMULA",
    FORMULA: "COMMON-FORM.FORMULA",
    DURATION: "COMMON-FORM.DURATION-MIN"
  };

  selectedItem: CleaningFormulaItem;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    // Set the defaults
    this.selectedItem = data.selectedItem;
    this.pcForm = this.createCleaningFormula();
    this.fmlDS = new CleaningFormulaDS(this.apollo);
    this.action = data.action!;
    this.translateLangText();
  }

  createCleaningFormula(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: this.selectedItem,
      duration: this.selectedItem?.duration || [''],
      description: this.selectedItem?.description || [''],
    });
  }

  GetButtonCaption() {
    if (this.selectedItem.description !== undefined) {
      return this.translatedLangText.UPDATE;
    }
    else {
      return this.translatedLangText.SAVE_AND_SUBMIT;
    }
  }

  GetTitle() {
    if (this.selectedItem.description !== undefined) {
      return this.translatedLangText.UPDATE + " " + this.translatedLangText.FORMULA;
    }
    else {
      return this.translatedLangText.NEW + " " + this.translatedLangText.FORMULA;
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  canEdit() {
    return true;
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      console.log('valid');
      this.dialogRef.close(count);
    }
  }

  save() {
    if (!this.pcForm?.valid) return;
    let cf: CleaningFormulaItem = new CleaningFormulaItem(this.selectedItem);
    Utility.removeTypenameFields(cf)
    cf.duration = this.pcForm.value['duration'];
    cf.description = this.pcForm.value['description'];

    const where: any = {};
    if (this.pcForm!.value['description']) {
      where.description = { eq: this.pcForm!.value['description'] };
    }

    if (this.pcForm!.value['duration']) {
      where.duration = { eq: this.pcForm!.value['duration'] };
    }

    if (cf.guid) {
      where.guid = { neq: cf.guid };
    }

    this.fmlDS.getCheckExist(where).subscribe(p => {
      console.log(`getCheckExist: ${p}`)
      if (p == 0) {
        if (this.selectedItem.guid) {
          this.fmlDS.updateCleaningFormula(cf).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.updateCleaningFormula);
          });
        } else {
          this.fmlDS.addCleaningFormula(cf).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.addCleaningFormula);
          });
        }
      } else {
        var allowUpdate = false;
        // if (allowUpdate) {
        //   if (this.selectedItem.guid) {
        //     this.fmlDS.updateCleaningFormula(cf).subscribe(result => {
        //       console.log(result)
        //       this.handleSaveSuccess(result?.data?.updateCleaningFormula);
        //     });
        //   }
        // } else {
        //   this.pcForm?.get('description')?.setErrors({ existed: true });
        // }
      }
    });
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
}
