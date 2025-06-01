import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
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
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
// import { RepairEstPartItem } from 'app/data-sources/repair-est-part';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ContactPersonItem } from 'app/data-sources/contact-person';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { RPDamageRepairDS, RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { Utility } from 'app/utilities/utility';


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
    // this.title_control.setValue(this.contactPerson.title_cv);

    this.initializeValueChange();
    // this.patchForm();
  }
  ngOnInit() {
    // this.initializeFilterCustomerCompany();
    this.contactPersonForm = this.createForm();

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
      did: [this.contactPerson.did,
      //[Validators.required]
      ],
      phone: [this.contactPerson.phone, [
        Validators.required,
        Validators.pattern(this.phone_regex)] // Adjust regex for your format
      ]

    });
  }

  patchForm() {
    // const selectedCodeValue = this.data.populateData.groupNameCvList.find(
    //   (item: any) => item.code_val === this.repairPart.tariff_repair?.group_name_cv
    // );
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
      //  let actions = Array.isArray(this.repairPart.actions!) ? [...this.repairPart.actions!] : [];
      // if (this.action === 'new') {
      //   if (!actions.includes('new')) {
      //     actions = [...new Set([...actions, 'new'])];
      //   }
      // } else {
      //   if (!actions.includes('new')) {
      //     actions = [...new Set([...actions, 'edit'])];
      //   }
      // }
      var rep: any = {
        ...this.contactPerson,
        title_cv: this.contactPersonForm?.get("title_cv")!.value,
        name: this.contactPersonForm?.get("name")!.value,
        email: this.contactPersonForm?.get("email")!.value,
        department: this.contactPersonForm?.get("department")!.value,
        phone: this.contactPersonForm?.get("phone")!.value,
        job_title: this.contactPersonForm?.get("job_title")!.value,
        did: this.contactPersonForm?.get("did")!.value,
        //     actions
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

  REPDamage(damages: any[]): RPDamageRepairItem[] {
    return damages.map(dmg => this.repDrDS.createREPDamage(undefined, undefined, dmg));
  }

  REPRepair(repairs: any[]): RPDamageRepairItem[] {
    return repairs.map(rp => this.repDrDS.createREPRepair(undefined, undefined, rp));
  }

  REPDamageRepairToCV(damagesRepair: any[] | undefined): RPDamageRepairItem[] {
    return damagesRepair?.map(dmgRp => dmgRp.code_cv) || [];
  }

  displayPartNameFn(tr: string): string {
    return tr;
  }

  validateLength(): boolean {
    let isValid = true;
    // const length = this.repairPartForm.get('length')?.value;
    // const remarks = this.repairPartForm.get('remarks')?.value;

    // // Validate that at least one of the purpose checkboxes is checked
    // if (!length && !remarks) {
    //   isValid = false; // At least one purpose must be selected
    //   this.repairPartForm.get('remarks')?.setErrors({ required: true });
    // }

    return isValid;
  }

  canEdit(): boolean {
    return true;
  }

  // updateValidators(validOptions: any[]) {
  //   this.partNameControl.setValidators([
  //     Validators.required,
  //     AutocompleteSelectionValidator(validOptions)
  //   ]);
  // }

  getLocationDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData?.partLocationCvList);
  }

  getUnitTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.data.populateData.unitTypeCvList);
  }

  getTitleCvObject(codeValType: string): CodeValuesItem | undefined {
    return this.cvDS.getCodeObject(codeValType, this.data.populateData.satulationCvList);
  }
  
  onNumericOnly(event: Event): void {
    Utility.onNumericOnly(event, this.contactPersonForm!?.get("phone")!);
  }

  // isUpdate(): boolean{
  //   if(this.action === "")
  // }
}
