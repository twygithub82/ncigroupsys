import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { BookingDS, BookingItem } from 'app/data-sources/booking';
import { CodeValuesDS } from 'app/data-sources/code-values';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { SchedulingDS, SchedulingItem } from 'app/data-sources/scheduling';
import { SchedulingSotDS, SchedulingSotItem } from 'app/data-sources/scheduling-sot';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS } from 'app/data-sources/tariff-cleaning';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { Utility } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs';

export interface DialogData {
  action?: string;
  customer_company_guid?: string;
  sotIdList?: string[];
  translatedLangText?: any;
  populateData?: any;
  selectedList?: SchedulingSotItem[];
}

@Component({
  selector: 'app-release-order-details-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
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
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDividerModule,
    MatTableModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
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
  schedulingList: SchedulingItem[] = [];
  schedulingFilteredList: SchedulingItem[] = [];
  selectedItemsPerPage: { [key: number]: Set<string> } = {};
  schedulingSotSelection = new SelectionModel<SchedulingSotItem>(true, []);

  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  igDS: InGateDS;
  bookingDS: BookingDS;
  schedulingDS: SchedulingDS;
  schedulingSotDS: SchedulingSotDS;

  displayedColumns = [
    'tank_no',
    'eir_no',
    'eir_dt',
    'scheduling_dt',
    'status_cv',
    'yard_cv',
  ];

  showTankStatus = [
    "CLEANING",
    "REPAIR",
    "STEAM",
    "STORAGE",
    "RESIDUE"
  ]

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
    this.bookingDS = new BookingDS(this.apollo)
    this.schedulingSotDS = new SchedulingSotDS(this.apollo)
    this.schedulingDS = new SchedulingDS(this.apollo)
    this.action = data.action!;
    this.sotIdList = data.sotIdList || [];
    this.dialogTitle = 'Add Tank';
    this.performSearch();
    this.filterTableForm = this.createStorigOrderTankForm();
    this.initializeValueChange();
  }

  createStorigOrderTankForm(): UntypedFormGroup {
    return this.fb.group({
      filterTable: ['']
    });
  }

  initializeValueChange() {
    this.filterTableForm.get('filterTable')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          this.schedulingFilteredList = this.schedulingList
            .map(x => ({
              ...x,
              scheduling_sot: x.scheduling_sot?.filter(ss => ss.storing_order_tank?.tank_no?.toLowerCase().includes(value.toLowerCase()))
            }))
            .filter(x => x.scheduling_sot && x.scheduling_sot.length > 0);
          // .filter(ss => ss?.storing_order_tank?.tank_no?.toLowerCase().includes(value.toLowerCase()))
        } else {
          this.schedulingFilteredList = [...this.schedulingList]; // Restore full list if value is empty
        }
      })
    ).subscribe();
  }

  submit() {
    if (this.schedulingSotSelection.hasValue()) {
      const selectedList = this.schedulingSotSelection.selected.map(schedulingSot => {
        const schedulingSotItem = new SchedulingSotItem(schedulingSot);

        schedulingSotItem.actions = schedulingSotItem.actions || [];
        if (!schedulingSotItem.actions.includes('new')) {
          schedulingSotItem.actions.push('new');
        }

        return schedulingSotItem;
      });
      const returnDialog: DialogData = {
        action: 'new',
        selectedList: selectedList
      }
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

  toggleRow(row: SchedulingSotItem) {
    if (this.checkDisable(row)) return;
    const selectedItems = this.selectedItemsPerPage[0] || new Set<string>();

    // Check if the row is already selected
    if (this.schedulingSotSelection.isSelected(row)) {
      // Deselect the row
      this.schedulingSotSelection.deselect(row);
      selectedItems.delete(row.guid!);
    } else {
      // If the row is not selected, check if it should be selected based on the company
      this.schedulingSotSelection.select(row);
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

  checkDisable(sot: any | undefined): boolean {
    return this.over3Days(sot) || this.notStorage(sot) || this.addedSot(sot);
  }

  over3Days(sot: any | undefined): boolean {
    return sot?.storing_order_tank?.isOver3Days;
  }

  notStorage(sot: any | undefined): boolean {
    return sot?.storing_order_tank?.notStorage;
  }

  addedSot(sot: any | undefined): boolean {
    return this.sotIdList.some(sot_guid => sot_guid === sot?.sot_guid);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData.tankStatusCvList);
  }

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData.yardCvList);
  }

  displayDate(input: number | undefined): string {
    return Utility.convertDateToStr(Utility.convertDate(input) as Date);
  }

  performSearch(first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    // const where: any = {
    //   and: [
    //     { status_cv: { eq: "ACCEPTED" } },
    //     { tank_status_cv: { in: ["CLEANING", "REPAIR", "STEAM", "STORAGE", "RO_GENERATED", "RESIDUE"] } },
    //     { storing_order: { customer_company_guid: { eq: this.data.customer_company_guid } } },
    //     { scheduling_sot: { some: { scheduling: { book_type_cv: { eq: "RELEASE_ORDER" } } } } }
    //   ],
    // };

    // this.lastSearchCriteria = this.sotDS.addDeleteDtCriteria(where);
    // this.sotDS.searchStoringOrderTanksForBooking(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
    //   .subscribe(data => {
    //     this.sotList = this.sort(data);
    //     console.log(this.sotList)
    //   });

    let where: any = {
      and: [
        { book_type_cv: { eq: "RELEASE_ORDER" } },
        {
          scheduling_sot: {
            some: {
              delete_dt: { eq: null },
              storing_order_tank: {
                status_cv: { eq: "ACCEPTED" },
                tank_status_cv: {
                  in: this.showTankStatus
                },
                storing_order: {
                  customer_company_guid: {
                    eq: this.data.customer_company_guid
                  }
                }
              }
            }
          }
        }
      ]
    }
    where = this.schedulingDS.addDeleteDtCriteria(where);
    this.schedulingDS.searchSchedulingForRO(where)
      .subscribe(data => {
        if (this.schedulingDS.totalCount > 0) {
          this.schedulingList = data;//.flatMap(s => s.scheduling_sot);
          this.schedulingList.forEach(scheduling => {
            scheduling.scheduling_sot = this.sort(
              scheduling.scheduling_sot!.filter(sotLink => {
                const sot = sotLink.storing_order_tank;
                return sot && this.shouldShowTank(sot);
              })
            );
          });
          this.schedulingFilteredList = this.schedulingList;
        }
      });
  }

  sort(schedulingSot: any[]): any[] {
    // Update each item in the list using the updateAvailability method
    schedulingSot = schedulingSot.map(ss => this.updateAvailability(ss));

    // Sort the list by the required criteria
    schedulingSot.sort((a, b) => {
      // First criterion: notStorage is false and isOver3Days is false
      if (a.storing_order_tank.notStorage !== b.storing_order_tank.notStorage) {
        return a.storing_order_tank.notStorage ? 1 : -1; // Sort `notStorage: false` first
      }
      if (a.storing_order_tank.isOver3Days !== b.storing_order_tank.isOver3Days) {
        return a.storing_order_tank.isOver3Days ? 1 : -1; // Sort `isOver3Days: false` first
      }

      // Third criterion: scheduling_dt (assuming it's a timestamp)
      const schedulingDtA = a.scheduling_dt || 0;
      const schedulingDtB = b.scheduling_dt || 0;
      return schedulingDtA - schedulingDtB;
    });

    return schedulingSot;
  }

  updateAvailability(ss: any): any {
    // 1. scheduling_dt within 3 days
    // 2. tank status 'STORAGE'

    const sot = ss.storing_order_tank;

    let isOver3Days = false;

    const startOfToday = new Date();
    const endOfNext3Days = new Date();
    endOfNext3Days.setDate(startOfToday.getDate() + 3);
    endOfNext3Days.setHours(23, 59, 59, 999);
    const endOfNext3DaysEpoch = Math.floor(endOfNext3Days.getTime() / 1000);

    const scheduling_dt = ss.scheduling_dt;
    if (scheduling_dt !== undefined && scheduling_dt > endOfNext3DaysEpoch) {
      isOver3Days = true;
    }
    const notStorage = sot.tank_status_cv !== 'STORAGE';

    sot.isOver3Days = isOver3Days;
    sot.notStorage = notStorage;
    return ss;
  }

  shouldShowTank(sot?: StoringOrderTankItem) {
    return this.showTankStatus.includes(sot?.tank_status_cv || '')
  }

  getLastLocation(sot?: StoringOrderTankItem) {
    return BusinessLogicUtil.getLastLocation(sot, this.igDS.getInGateItem(sot?.in_gate), sot?.tank_info, sot?.transfer)
  }
}
