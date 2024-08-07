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

export interface DialogData {
  action?: string;
  customer_company_guid?: string;
  item: StoringOrderTankItem[];
  translatedLangText?: any;
  populateData?: any;
  sotExistedList?: StoringOrderTankItem[];
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
  ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  storingOrderTankForm: UntypedFormGroup;
  sotList: StoringOrderTankItem[] = [];
  sotExistedList?: StoringOrderTankItem[] = [];
  lastSearchCriteria: any;
  lastOrderBy: any = { storing_order: { so_no: 'DESC' } };

  selectedItemsPerPage: { [key: number]: Set<string> } = {};
  sotSelection = new SelectionModel<StoringOrderTankItem>(true, []);

  tcDS: TariffCleaningDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  igDS: InGateDS;

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
    this.dialogTitle = 'Add Tank';
    this.performSearch(10, 0);
    this.storingOrderTankForm = this.createStorigOrderTankForm();
    this.sotExistedList = data.sotExistedList;
  }

  createStorigOrderTankForm(): UntypedFormGroup {
    return this.fb.group({

    });
  }

  submit() {
    if (this.storingOrderTankForm?.valid) {
      if (!this.validatePurpose()) {
        this.storingOrderTankForm.get('purpose')?.setErrors({ required: true });
      } else {
        this.storingOrderTankForm.get('purpose')?.setErrors(null);
        var sot: StoringOrderTankItem = {
          purpose_storage: false,
          purpose_steam: false,
          purpose_cleaning: false
        }
        const returnDialog: DialogData = {
          item: [sot],
        }
        console.log('valid');
        this.dialogRef.close(returnDialog);
      }
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
    const controls = this.storingOrderTankForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  validatePurpose(): boolean {
    let isValid = true;
    const purposeStorage = this.storingOrderTankForm.get('purpose_storage')?.value;
    const purposeSteam = this.storingOrderTankForm.get('purpose_steam')?.value;
    const purposeCleaning = this.storingOrderTankForm.get('purpose_cleaning')?.value;
    const purposeRepairCV = this.storingOrderTankForm.get('purpose_repair_cv')?.value;
    const requiredTemp = this.storingOrderTankForm.get('required_temp')?.value;

    // Validate that at least one of the purpose checkboxes is checked
    if (!purposeStorage && !purposeSteam && !purposeCleaning && !purposeRepairCV) {
      isValid = false; // At least one purpose must be selected
      this.storingOrderTankForm.get('purpose')?.setErrors({ required: true });
    }

    // Validate that required_temp is filled in if purpose_steam is checked
    if (purposeSteam && !requiredTemp) {
      isValid = false; // required_temp must be filled if purpose_steam is checked
      this.storingOrderTankForm.get('required_temp')?.setErrors({ required: true });
    }

    return isValid;
  }

  toggleRow(row: StoringOrderTankItem) {
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

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData.tankStatusCvList);
  }

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData.yardCvList);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    const where: any = {
      and: [
        { status_cv: { eq: "ACCEPTED" } },
        { tank_status_cv: { neq: "RO_GENERATED" } },
        { in_gate: { some: { delete_dt: { eq: null } } } },
        { storing_order: { customer_company_guid: { eq: this.data.customer_company_guid } } },
        {
          or: [
            { scheduling: { any: false } },
            {
              scheduling: {
                none: {
                  status_cv: { in: ["PENDING", "COMPLETED", "PROCESSING"] }
                }
              }
            }
          ]
        }
      ],
    };

    this.lastSearchCriteria = this.sotDS.addDeleteDtCriteria(where);
    this.sotDS.searchStoringOrderTanksForBooking(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        if (this.sotExistedList?.length) {
          this.sotList = data.filter(item =>
            !this.sotExistedList!.some(existingItem => existingItem.guid === item.guid)
          )
        } else {
          this.sotList = data;
        }
      });
  }
}
