import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { Apollo } from 'apollo-angular';
import { InGate } from 'app/data-sources/in-gate';
import { InGateCleaningDS, InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';


export interface DialogData {
  action?: string;
  translatedLangText?: any;
  selectedItem?: InGateCleaningItem;
  populateData?: any;
}

@Component({
  selector: 'app-update-clean-seal-no-form-dialog',
  templateUrl: './update-clean-seal-no-form-dialog.component.html',
  styleUrls: ['./update-clean-seal-no-form-dialog.component.scss'],
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
    GlobalMaxCharDirective
  ],
})
export class UpdateCleanSealNoFormDialogComponent {
  cleanItem: InGateCleaningItem;
  last_cargoList?: TariffCleaningItem[];
  dialogTitle: string;
  overwriteForm: UntypedFormGroup;
  valueChangesDisabled: boolean = false;
  cleaningDs:InGateCleaningDS ;
  constructor(
    public dialogRef: MatDialogRef<UpdateCleanSealNoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo

  ) {
    // Set the defaults
    this.dialogTitle = data.translatedLangText?.UPDATE_CLEANING;
    this.cleaningDs=new InGateCleaningDS(this.apollo);
    this.cleanItem = data.selectedItem!;
    this.overwriteForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      clean_seal_no: this.cleanItem?.seal_no,
      clean_remarks: this.cleanItem?.remarks
    });
    return formGroup;
  }

  submit() {
    if (this.overwriteForm?.valid) {
    
      var clean:any= this.cleanItem;
      delete clean.job_order;
      clean.seal_no=this.overwriteForm.get('clean_seal_no')?.value;
      clean.remarks=this.overwriteForm.get('clean_remarks')?.value;
      var cleanSurvey:any=null;
      this.cleaningDs.updateInGateCleaning(clean,cleanSurvey).subscribe((res: any) => { 
        this.dialogRef.close(res);

      });

    } else {
      console.log('invalid');
      this.findInvalidControls();
    }
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  findInvalidControls() {
    const controls = this.overwriteForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  canEdit(): boolean {
    return true;
  }
}
