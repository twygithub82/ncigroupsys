import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, UntypedFormArray } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTank, StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
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
import { MatTableModule } from '@angular/material/table';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { MatDividerModule } from '@angular/material/divider';
import { BookingDS, BookingItem } from 'app/data-sources/booking';
import { MatCardModule } from '@angular/material/card';
import { SchedulingDS, SchedulingGO, SchedulingItem } from 'app/data-sources/scheduling';
import { ReleaseOrderDS, ReleaseOrderItem } from 'app/data-sources/release-order';
import { InGateDS } from 'app/data-sources/in-gate';
import { SchedulingSotItem } from 'app/data-sources/scheduling-sot';
import { CodeValuesItem } from 'app/data-sources/code-values';
import { SteamItem } from 'app/data-sources/steam';


export interface DialogData {
  action?: string;
  translatedLangText?: any;
  steamItem?: SteamItem;
  releaseNote?: string;
  previousRemarks?: string;
}

@Component({
  selector: 'app-steam-temp-form-dialog',
  templateUrl: './steam-temp-form-dialog.component.html',
  styleUrls: ['./steam-temp-form-dialog.component.scss'],
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
  ],
})
export class SteamTempFormDialogComponent {
  displayedColumns = [
    'seq',
    'time',
    'ther',
    'top_side',
    'bottom_side',
    'remarks',
  ];
  action: string;
  dialogTitle: string;
  steamItem?: SteamItem;
  steamTempList: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<SteamTempFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,

  ) {
    // Set the defaults
    this.action = data.action!;
    this.dialogTitle = data.translatedLangText?.STEAM_MONITOR;
    this.steamItem = data.steamItem;
    this.steamTempList = this.steamItem?.steaming_part?.[0]?.job_order?.steaming_temp || [];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  canEdit(): boolean {
    return true;
  }
}
