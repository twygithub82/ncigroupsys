import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
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
import { SteamItem } from 'app/data-sources/steam';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';


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
