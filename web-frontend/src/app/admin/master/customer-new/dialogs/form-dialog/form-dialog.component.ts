import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialog } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Apollo } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { startWith, debounceTime, tap } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { TariffRepairDS, TariffRepairItem } from 'app/data-sources/tariff-repair';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
// import { RepairEstPartItem } from 'app/data-sources/repair-est-part';
import { REPDamageRepairDS, REPDamageRepairItem } from 'app/data-sources/rep-damage-repair';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { Direction } from '@angular/cdk/bidi';
import { SearchFormDialogComponent } from '../search-form-dialog/search-form-dialog.component';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ContactPersonItem } from 'app/data-sources/contact-person';


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
    MatDialogClose,
    DatePipe,
    MatNativeDateModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CommonModule,
    NgxMaskDirective,
  ],
})
export class FormDialogComponent extends UnsubscribeOnDestroyAdapter {
  action: string;
  index: number;
  dialogTitle: string;
  customer_company_guid: string;

  contactPerson : ContactPersonItem;
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
  repDrDS: REPDamageRepairDS;
  prDS: PackageRepairDS;
  phone_regex:any =/^\+?[1-9]\d{0,2}(-\d{3}-\d{3}-\d{4}|\d{7,10})$/;
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
    this.repDrDS = new REPDamageRepairDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.action = data.action!;
    this.customer_company_guid = data.customer_company_guid!;
    if (this.action === 'edit') {
      this.dialogTitle = `${data.translatedLangText.EDIT} ${data.translatedLangText.CONTACT_PERSON}`;
    } else {
      this.dialogTitle = `${data.translatedLangText.NEW} ${data.translatedLangText.CONTACT_PERSON}`;
    }
    this.contactPerson= data.item ? data.item : new ContactPersonItem();
    
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
      guid: [this.contactPerson.guid||''],
      title_cv: [this.contactPerson.title_cv, [Validators.required]],
      customer_company: [this.contactPerson.customer_company],
      name:  [this.contactPerson.name, [Validators.required]],
      email: [this.contactPerson.email, [Validators.required, Validators.email]],
      department: [this.contactPerson.department],
      job_title: [this.contactPerson.job_title],
      customer_guid: [this.contactPerson.customer_guid],
      did : [ this.contactPerson.did,
        [Validators.required,
        Validators.pattern(this.phone_regex)] // Adjust regex for your format
      ],
      phone: [this.contactPerson.phone,[
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
      did :this.contactPerson.did,
      phone:this.contactPerson.phone,
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
    // this.contactPersonFrom?.get('group_name_cv')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
        
    //     if (value?.child_code) {
    //       const queries = [
    //         { alias: 'subgroupNameCv', codeValType: value.child_code },
    //       ];
    //       this.cvDS.getCodeValuesByType(queries);
    //       this.cvDS.connectAlias('subgroupNameCv').subscribe(data => {
    //         this.data.populateData.subgroupNameCvList = data;
    //       });

    //     }
    //     else
    //     {
    //       this.data.populateData.subgroupNameCvList=[];
    //     }
    //     if(value){
    //     this.trDS.searchDistinctPartName(value.code_val, '').subscribe(data => {
    //       this.partNameList = data;
    //     }); 
    //   }

    //   })
    // ).subscribe();

    // this.repairPartForm?.get('subgroup_name_cv')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     if (value) {
    //       const groupName = this.repairPartForm?.get('group_name_cv')?.value;
    //       this.trDS.searchDistinctPartName(groupName.code_val, value).subscribe(data => {
    //         this.partNameList = data;
    //         // this.partNameFilteredList = data
    //         // this.updateValidators(this.partNameList);
    //         // if (this.partNameControl.value) {
    //         //   this.handleValueChange(this.partNameControl.value)
    //         // }
    //       });
    //     }
    //   })
    // ).subscribe();

    // this.repairPartForm?.get('part_name')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     if (value) {
    //       //this.searchPart();
    //     }
    //   })
    // ).subscribe();

    // this.partNameControl.valueChanges.subscribe(value => {
    //   if (!this.valueChangesDisabled) {
    //     this.handleValueChange(value);
    //   }
    // });

    // this.repairPartForm?.get('dimension')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     if (value) {
    //       const partName = this.partNameControl.value;
    //       this.trDS.searchDistinctLength(partName, value).subscribe(data => {
    //         this.lengthList = data;
    //         if (!this.lengthList.length) {
    //           this.repairPartForm?.get('length')?.disable();
    //           this.getCustomerCost(partName, value, undefined);
    //         } else {
    //           this.repairPartForm?.get('length')?.enable();
    //         }
    //       });
    //     }
    //   })
    // ).subscribe();

    // this.repairPartForm?.get('length')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     if (value) {
    //       const partName = this.partNameControl.value;
    //       const dimension = this.repairPartForm?.get('dimension')?.value;
    //       this.getCustomerCost(partName, dimension, value);
    //     }
    //   })
    // ).subscribe();
  }

  // handleValueChange(value: any) {
  //   this.valueChangesDisabled = true;
  //   if (value) {
  //     this.partNameFilteredList = this.partNameList?.filter(item =>
  //       item.toLowerCase().includes(value.toLowerCase()) // case-insensitive filtering
  //     );
  //     const isValid = this.partNameList?.some(item => item === value);
  //     if (isValid) {
  //       // Only search if the value exists in the partNameList
  //       this.trDS.searchDistinctDimension(value).subscribe(data => {
  //         this.dimensionList = data;
  //         if (!this.dimensionList.length) {
  //           this.repairPartForm?.get('dimension')?.disable();
  //           this.getCustomerCost(value, undefined, undefined);
  //         } else {
  //           this.repairPartForm?.get('dimension')?.enable();
  //         }
  //       });
  //     }
  //   } else {
  //     // If no value is entered, reset the filtered list to the full list
  //     this.partNameFilteredList = this.partNameList;
  //   }
  //   this.valueChangesDisabled = false;
  // }

  findInvalidControls() {
    const controls = this.contactPersonForm?.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  REPDamage(damages: any[]): REPDamageRepairItem[] {
    return damages.map(dmg => this.repDrDS.createREPDamage(undefined, undefined, dmg));
  }

  REPRepair(repairs: any[]): REPDamageRepairItem[] {
    return repairs.map(rp => this.repDrDS.createREPRepair(undefined, undefined, rp));
  }

  REPDamageRepairToCV(damagesRepair: any[] | undefined): REPDamageRepairItem[] {
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

  getTitleCvObject(codeValType:string):CodeValuesItem |undefined{
    return this.cvDS.getCodeObject(codeValType,this.data.populateData.satulationCvList);
  }

  // getCustomerCost(partName: string | undefined, dimension: string | undefined, length: number | undefined) {
  //   const group_name_cv = this.repairPartForm.get('group_name_cv')?.value
  //   const subgroup_name_cv = this.repairPartForm.get('subgroup_name_cv')?.value
  //   const where = {
  //     and: [
  //       { customer_company_guid: { eq: this.customer_company_guid } },
  //       {
  //         or: [
  //           { tariff_repair_guid: { eq: null } },
  //           {
  //             tariff_repair: {
  //               group_name_cv: { eq: group_name_cv.code_val },
  //               subgroup_name_cv: { eq: subgroup_name_cv },
  //               part_name: { eq: partName },
  //               dimension: { eq: dimension },
  //               length: { eq: length }
  //             }
  //           }
  //         ]
  //       }
  //     ]
  //   }
  //   this.prDS.getCustomerPackageCost(where).subscribe(data => {
  //     if (data.length) {
  //       // this.selectedPackageRepair = data[0];
  //       // this.repairPartForm.get('material_cost')?.setValue(this.selectedPackageRepair?.material_cost!.toFixed(2));
  //     }
  //   });
  // }

  searchPart() {
    // let tempDirection: Direction;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {  
    //   tempDirection = 'ltr';
    // }
    // const dialogRef = this.dialog.open(SearchFormDialogComponent, {
    //   width: '1050px',
    //   data: {
    //     customer_company_guid: this.customer_company_guid,
    //     group_name_cv: this.repairPartForm?.get('group_name_cv')!.value?.code_val,
    //     subgroup_name_cv: this.repairPartForm?.get('subgroup_name_cv')!.value,
    //     part_name: this.repairPartForm?.get('part_name')!.value,
    //     translatedLangText: this.data.translatedLangText,
    //     populateData: this.data.populateData,
    //   },
    //   direction: tempDirection
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     console.log(result);
    //     this.repairPart = result.selected_repair_est_part;
    //     this.repairPartForm.get('material_cost')?.setValue(this.repairPart?.material_cost!.toFixed(2));
    //   }
    // });
  }
}
