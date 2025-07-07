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
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS } from 'app/data-sources/tariff-cleaning';
import { TariffRepairDS } from 'app/data-sources/tariff-repair';
import { provideNgxMask } from 'ngx-mask';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ContactPersonItem } from 'app/data-sources/contact-person';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { RPDamageRepairDS, RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { Utility } from 'app/utilities/utility';
import { ModulePackageService } from 'app/services/module-package.service';


export interface DialogData {
  action?: string;
  item?: ContactPersonItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
  customer_company_guid?: string;
}

@Component({
  selector: 'app-repair-estimate-form-dialog',
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
  ],
})
export class FormDialogComponent extends UnsubscribeOnDestroyAdapter {
  action: string;
  index: number;
  dialogTitle: string;
  customer_company_guid: string;

  contactPerson: ContactPersonItem;
  contactPersonForm?: UntypedFormGroup;
  repairPart: any;

  partNameList?: string[];
  partNameFilteredList?: string[];
  dimensionList?: string[];
  lengthList?: any[];
  valueChangesDisabled: boolean = false;

  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  trDS: TariffRepairDS;
  repDrDS: RPDamageRepairDS;
  prDS: PackageRepairDS;
  phone_regex: any = /^\+?[1-9]\d{0,2}(-\d{3}-\d{3}-\d{4}|\d{7,10})$/;
  title_control = new UntypedFormControl();
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private modulePackageService: ModulePackageService
  ) {
    super();
    // Set the defaults
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.trDS = new TariffRepairDS(this.apollo);
    this.repDrDS = new RPDamageRepairDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.action = data.action!;
    this.customer_company_guid = data.customer_company_guid!;
    if (this.action === 'edit') {
      this.dialogTitle = `${data.translatedLangText.EDIT} ${data.translatedLangText.CONTACT_PERSON}`;
    } else {
      this.dialogTitle = `${data.translatedLangText.NEW} ${data.translatedLangText.CONTACT_PERSON}`;
    }
    this.contactPerson = data.item ? data.item : new ContactPersonItem();
    this.index = data.index;
    this.initializeValueChange();
  }

  ngOnInit() {
    this.contactPersonForm = this.createForm();

    if (!this.canEdit()) {
      this.contactPersonForm.get('title_cv')?.disable()
      this.contactPersonForm.get('customer_company')?.disable()
      this.contactPersonForm.get('name')?.disable()
      this.contactPersonForm.get('email')?.disable()
      this.contactPersonForm.get('department')?.disable()
      this.contactPersonForm.get('job_title')?.disable()
      this.contactPersonForm.get('customer_guid')?.disable()
      this.contactPersonForm.get('did')?.disable()
      this.contactPersonForm.get('phone')?.disable()
    }
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      guid: [this.contactPerson.guid || ''],
      title_cv: [this.contactPerson.title_cv, [Validators.required]],
      customer_company: [this.contactPerson.customer_company],
      name: [this.contactPerson.name, [Validators.required]],
      email: [this.contactPerson.email, [Validators.required, Validators.email]],
      department: [this.contactPerson.department],
      job_title: [this.contactPerson.job_title],
      customer_guid: [this.contactPerson.customer_guid],
      did: [this.contactPerson.did],
      phone: [this.contactPerson.phone, [
        Validators.required,
        Validators.pattern(this.phone_regex)] // Adjust regex for your format
      ]
    });
  }

  patchForm() {
    this.contactPersonForm?.patchValue({
      guid: this.contactPerson.guid,
      title_cv: this.contactPerson.title_cv,
      customer_company: this.contactPerson.customer_company,
      name: this.contactPerson.name,
      email: this.contactPerson.email,
      department: this.contactPerson.department,
      did: this.contactPerson.did,
      phone: this.contactPerson.phone,
      job_title: this.contactPerson.job_title,
      customer_guid: this.contactPerson.customer_guid
    });
  }

  submit() {
    if (this.contactPersonForm?.valid) {
      var rep: any = {
        ...this.contactPerson,
        title_cv: this.contactPersonForm?.get("title_cv")!.value,
        name: this.contactPersonForm?.get("name")!.value,
        email: this.contactPersonForm?.get("email")!.value,
        department: this.contactPersonForm?.get("department")!.value,
        phone: this.contactPersonForm?.get("phone")!.value,
        job_title: this.contactPersonForm?.get("job_title")!.value,
        did: this.contactPersonForm?.get("did")!.value,
      }

      console.log(rep)
      const returnDialog: DialogData = {
        item: rep,
        index: this.index
      }
      this.dialogRef.close(returnDialog);
    } else {
      this.findInvalidControls();
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
    const controls = this.contactPersonForm?.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  onNumericOnly(event: Event): void {
    Utility.onNumericOnly(event, this.contactPersonForm!?.get("phone")!);
  }

  canEdit(): boolean {
    return ((!!this.contactPerson.guid && this.isAllowEdit()) || (!this.contactPerson.guid && this.isAllowAdd()));
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['MASTER_CUSTOMER_EDIT']);
  }

  isAllowAdd() {
    return this.modulePackageService.hasFunctions(['MASTER_CUSTOMER_ADD']);
  }
}
