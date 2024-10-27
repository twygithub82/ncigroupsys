import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
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
import { CodeValuesDS } from 'app/data-sources/code-values';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';


export interface DialogData {
  action?: string;
  translatedLangText?: any;
  populateData?: any;
  customer_company_guid?: string;
  group_name_cv?: string;
  subgroup_name_cv?: string;
  part_name?: string;
  selected_repair_part?: RepairPartItem;
}

@Component({
  selector: 'app-search-form-dialog',
  templateUrl: './search-form-dialog.component.html',
  styleUrls: ['./search-form-dialog.component.scss'],
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
    MatTableModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
})
export class SearchFormDialogComponent {
  displayedColumns = [
    'part_name',
    'dimension',
    'length',
    'material_cost'
  ];

  action: string;
  dialogTitle: string;
  customer_company_guid: string;
  part_name: string;
  group_name_cv: string;
  subgroup_name_cv: string;
  selected_repair_part: RepairPartItem;

  filterTableForm: UntypedFormGroup;
  packageRepairList: PackageRepairItem[] = [];
  packageRepairFilteredList: PackageRepairItem[] = [];

  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  trDS: TariffRepairDS;
  prDS: PackageRepairDS;
  constructor(
    public dialogRef: MatDialogRef<SearchFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    // Set the defaults
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.trDS = new TariffRepairDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.action = data.action!;
    this.customer_company_guid = data.customer_company_guid!;
    this.group_name_cv = data.group_name_cv!;
    this.subgroup_name_cv = data.subgroup_name_cv!;
    this.part_name = data.part_name!;
    this.selected_repair_part = data.selected_repair_part!;
    this.dialogTitle = `${data.translatedLangText.PART_NAME}`;
    this.filterTableForm = this.createForm();
    this.loadData();
    this.initializeValueChange();
    // this.patchForm();
    // if (this.repairPart.tariff_cleaning) {
    //   this.lastCargoControl.setValue(this.storingOrderTank.tariff_cleaning);
    // }
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      filterTable: [''],
      selected_tariff_repair: ['']
    });
  }

  loadData() {
    this.getCustomerCost();
  }

  patchForm() {
  }

  submit(row: PackageRepairItem) {
    var rep: RepairPartItem = {
      ...this.selected_repair_part,
      tariff_repair_guid: row?.tariff_repair_guid,
      tariff_repair: row?.tariff_repair,
      material_cost: row?.material_cost
    }
    const returnDialog: DialogData = {
      selected_repair_part: rep
    }
    this.dialogRef.close(returnDialog);
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
    this.filterTableForm.get('filterTable')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          this.packageRepairFilteredList = this.packageRepairList
          .filter(x => x.tariff_repair?.alias?.toLowerCase().includes(value.toLowerCase()) || `${x.tariff_repair?.length}`.toLowerCase().includes(value.toLowerCase()));
        } else {
          this.packageRepairFilteredList = [...this.packageRepairList];
        }
      })
    ).subscribe();
  }

  findInvalidControls() {
    const controls = this.filterTableForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  canEdit(): boolean {
    return true;
  }

  getLocationDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData?.partLocationCvList);
  }

  getCustomerCost() {
    const where = {
      and: [
        { customer_company_guid: { eq: this.customer_company_guid } },
        {
          or: [
            { tariff_repair_guid: { eq: null } },
            {
              tariff_repair: {
                group_name_cv: { eq: this.group_name_cv },
                subgroup_name_cv: { eq: this.subgroup_name_cv || undefined },
                part_name: { eq: this.part_name }
              }
            }
          ]
        }
      ]
    }
    this.prDS.getCustomerPackageCost(where).subscribe(data => {
      if (data.length) {
        this.packageRepairList = data;
        this.packageRepairFilteredList = this.packageRepairList;
      }
    });
  }

  getUnitTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.data.populateData.unitTypeCvList);
  }
}
