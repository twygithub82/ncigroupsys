import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';

export interface DialogData {
  action?: string;
  translatedLangText?: any;
  sot: StoringOrderTankItem;
  ccDS: CustomerCompanyDS;
}

@Component({
  selector: 'app-reowner-tank-form-dialog-form-dialog',
  templateUrl: './reowner-tank-form-dialog.component.html',
  styleUrls: ['./reowner-tank-form-dialog.component.scss'],
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
    MatTableModule,
    MatDividerModule,
    MatCardModule,
    GlobalMaxCharDirective
  ],
})
export class ReownerTankFormDialogComponent {
  action: string;
  dialogTitle: string;
  sot: StoringOrderTankItem;
  ccDS: CustomerCompanyDS;
  tankForm: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  customer_companyList: CustomerCompanyItem[] = [];

  constructor(
    public dialogRef: MatDialogRef<ReownerTankFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
  ) {
    // Set the defaults
    this.action = data.action!;
    if (this.action === 'recustomer') {
      this.dialogTitle = `${data.translatedLangText?.UPDATE} ${data.translatedLangText?.CUSTOMER}`;
    } else {
      this.dialogTitle = `${data.translatedLangText?.REOWNERSHIP}`;
    }
    this.sot = data.sot;
    this.ccDS = data.ccDS;
    this.tankForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    this.initializeValueChange();
    const formGroup = this.fb.group({
      owner: this.customerCodeControl,
    });
    if (this.action === 'recustomer') {
    this.customerCodeControl.setValue(this.sot?.storing_order?.customer_company);
    } else {
    this.customerCodeControl.setValue(this.sot?.customer_company);
    }
    return formGroup;
  }

  initializeValueChange() {
    this.customerCodeControl!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.code;
        } else {
          searchCriteria = value || '';
        }
        this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
          this.updateValidators(this.customer_companyList)
        });
      })
    ).subscribe();
  }

  submit() {
    if (this.tankForm?.valid) {
      const returnDialog: any = {
        confirmed: true,
        owner_guid: this.tankForm?.get('owner')?.value?.guid
      }
      this.dialogRef.close(returnDialog);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  canEdit(): boolean {
    return true;
  }

  updateValidators(validOptions: any[]) {
    this.customerCodeControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }
}
