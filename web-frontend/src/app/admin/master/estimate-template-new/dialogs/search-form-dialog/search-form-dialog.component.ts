import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS } from 'app/data-sources/code-values';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffRepairDS, TariffRepairItem } from 'app/data-sources/tariff-repair';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';


export interface DialogData {
  action?: string;
  translatedLangText?: any;
  populateData?: any;
  customer_company_guid?: string;
  group_name_cv?: string;
  subgroup_name_cv?: string;
  part_name?: string;
  selected_repair_est_part?: RepairPartItem;
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
    MatNativeDateModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CommonModule,
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
  //customer_company_guid: string;
  part_name: string;
  group_name_cv: string;
  subgroup_name_cv: string;
  selected_repair_est_part: RepairPartItem;

  filterTableForm: UntypedFormGroup;
  tariffRepairList: TariffRepairItem[] = [];
  tariffRepairFilteredList: TariffRepairItem[] = [];
  //packageRepairList: PackageRepairItem[] = [];
  // packageRepairFilteredList: PackageRepairItem[] = [];

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
    //this.customer_company_guid = data.customer_company_guid!;
    this.group_name_cv = data.group_name_cv!;
    this.subgroup_name_cv = data.subgroup_name_cv!;
    this.part_name = data.part_name!;
    this.selected_repair_est_part = data.selected_repair_est_part!;
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
    this.getTariffRepairCost();
  }

  patchForm() {
  }

  submit(row: PackageRepairItem) {
    var rep: RepairPartItem = {
      ...this.selected_repair_est_part,
      tariff_repair_guid: row?.guid,
      tariff_repair: row!,
      material_cost: row?.material_cost
    }
    const returnDialog: DialogData = {
      selected_repair_est_part: rep
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
        console.log(value)
        if (value) {
          this.tariffRepairFilteredList = this.tariffRepairList
            .filter(x => x.alias?.toLowerCase().includes(value.toLowerCase()) || `${x.length}`.toLowerCase().includes(value.toLowerCase()));
        } else {
          this.tariffRepairFilteredList = [...this.tariffRepairList];
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

  getTariffRepairCost() {
    const where = {

      group_name_cv: { eq: this.group_name_cv },
      subgroup_name_cv: { eq: this.subgroup_name_cv || undefined },
      part_name: { eq: this.part_name }

    }




    this.trDS.SearchTariffRepair(where).subscribe(data => {
      if (data.length) {
        this.tariffRepairList = data;
      }
    });
  }

  // getCustomerCost() {
  //   const where = {
  //     and: [
  //       { customer_company_guid: { eq: this.customer_company_guid } },
  //       {
  //         or: [
  //           { tariff_repair_guid: { eq: null } },
  //           {
  //             tariff_repair: {
  //               group_name_cv: { eq: this.group_name_cv },
  //               subgroup_name_cv: { eq: this.subgroup_name_cv || undefined },
  //               part_name: { eq: this.part_name }
  //             }
  //           }
  //         ]
  //       }
  //     ]
  //   }
  //   this.prDS.getCustomerPackageCost(where).subscribe(data => {
  //     if (data.length) {
  //       this.packageRepairList = data;
  //     }
  //   });
  // }

  getUnitTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.data.populateData.unitTypeCvList);
  }
}
