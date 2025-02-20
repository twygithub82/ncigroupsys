import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

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
