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
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { SchedulingItem } from 'app/data-sources/scheduling';
import { BookingItem } from 'app/data-sources/booking';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { CodeValuesDS } from 'app/data-sources/code-values';
import { InGateDS } from 'app/data-sources/in-gate';
import { MatTableModule } from '@angular/material/table';

export interface DialogData {
  action?: string;
  customer_company_guid?: string;
  sotIdList?: string[];
  translatedLangText?: any;
  populateData?: any;
  selectedList?: StoringOrderTankItem[];
}

@Component({
  selector: 'app-release-order-details-form-dialog',
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
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDividerModule,
    MatTableModule
  ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  filterTableForm: UntypedFormGroup;
  sotIdList: string[] = [];
  customer_company_guid?: string = '';
  lastSearchCriteria: any;
  lastOrderBy: any = { storing_order: { so_no: 'DESC' } };

  sotList: StoringOrderTankItem[] = [];
  selectedItemsPerPage: { [key: number]: Set<string> } = {};
  sotSelection = new SelectionModel<StoringOrderTankItem>(true, []);

  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  igDS: InGateDS;

  displayedColumns = [
    'select',
    'customer',
    'eir_no',
    'eir_date',
    'capacity',
    'tare_weight',
    'status',
    'yard',
    'actions'
  ];

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    // Set the defaults
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.igDS = new InGateDS(this.apollo)
    this.action = data.action!;
    this.sotIdList = data.sotIdList || [];
    this.dialogTitle = 'Add Tank';
    this.performSearch();
    this.filterTableForm = this.createStorigOrderTankForm();
  }

  createStorigOrderTankForm(): UntypedFormGroup {
    return this.fb.group({
      filterTable: ['']
    });
  }

  submit() {
    if (this.sotSelection.hasValue()) {
      const selectedList = this.sotSelection.selected.map(sot => {
        const sotItem = new StoringOrderTankItem(sot);

        // Ensure 'new' is added to actions without duplicates
        sotItem.actions = sotItem.actions || []; // Initialize actions if it's undefined
        if (!sotItem.actions.includes('new')) {
          sotItem.actions.push('new');
        }

        return sotItem;
      });
      const returnDialog: DialogData = {
        action: 'new',
        selectedList: selectedList
      }
      console.log('valid');
      this.dialogRef.close(returnDialog);
    } else {
      console.log('invalid');
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

  findInvalidControls() {
    const controls = this.filterTableForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  toggleRow(row: StoringOrderTankItem) {
    if (this.checkDisable(row.guid)) return;
    const selectedItems = this.selectedItemsPerPage[0] || new Set<string>();

    // Check if the row is already selected
    if (this.sotSelection.isSelected(row)) {
      // Deselect the row
      this.sotSelection.deselect(row);
      selectedItems.delete(row.guid!);
    } else {
      // If the row is not selected, check if it should be selected based on the company
      this.sotSelection.select(row);
      selectedItems.add(row.guid!);
    }

    this.selectedItemsPerPage[0] = selectedItems;
  }

  checkScheduling(schedulings: SchedulingItem[] | undefined): boolean {
    if (!schedulings || !schedulings.length) return false;
    if (schedulings.some(schedule => schedule.status_cv !== "CANCELED"))
      return true;
    return false;
  }

  checkBooking(bookings: BookingItem[] | undefined): boolean {
    if (!bookings || !bookings.length) return false;
    if (bookings.some(booking => booking.book_type_cv === "RELEASE_ORDER" && booking.status_cv !== "CANCELED"))
      return true;
    return false;
  }

  checkDisable(guid: string | undefined): boolean {
    return this.sotIdList.some(sot_guid => sot_guid === guid);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData.tankStatusCvList);
  }

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData.yardCvList);
  }

  performSearch(first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    // Get the current date and set the time to the start of the day (00:00:00)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayEpoch = Math.floor(startOfToday.getTime() / 1000); // Convert to seconds

    // Calculate the end of the day 3 days from now
    const endOfNext3Days = new Date();
    endOfNext3Days.setDate(startOfToday.getDate() + 3);
    endOfNext3Days.setHours(23, 59, 59, 999);
    const endOfNext3DaysEpoch = Math.floor(endOfNext3Days.getTime() / 1000);
    const where: any = {
      and: [
        //{ guid: { nin: this.sotIdList } },
        { status_cv: { eq: "ACCEPTED" } },
        { tank_status_cv: { neq: "RO_GENERATED" } },
        { in_gate: { some: { delete_dt: { eq: null } } } },
        { storing_order: { customer_company_guid: { eq: this.data.customer_company_guid } } },
        { scheduling_sot: { some: { scheduling: { book_type_cv: { eq: "RELEASE_ORDER" }, scheduling_dt: { lte: endOfNext3DaysEpoch } } } } }
      ],
    };

    this.lastSearchCriteria = this.sotDS.addDeleteDtCriteria(where);
    this.sotDS.searchStoringOrderTanksForBooking(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.sotList = data;
      });
  }
}
