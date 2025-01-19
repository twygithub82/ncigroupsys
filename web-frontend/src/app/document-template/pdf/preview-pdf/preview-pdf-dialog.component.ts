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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface DialogData {
  pdfBlob: any;
}

@Component({
  selector: 'app-preview-pdf-dialog',
  templateUrl: './preview-pdf-dialog.component.html',
  styleUrls: ['./preview-pdf-dialog.component.scss'],
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
    MatCardModule
  ],
})
export class PreviewPdfDialogComponent {
  pdfSafeUrl: SafeResourceUrl;
  constructor(
    public dialogRef: MatDialogRef<PreviewPdfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private sanitizer: DomSanitizer
  ) {
    // Set the defaults
    const pdfUrl = URL.createObjectURL(this.data.pdfBlob);
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'EIR-FORM.pdf'; // Desired filename
    this.pdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
