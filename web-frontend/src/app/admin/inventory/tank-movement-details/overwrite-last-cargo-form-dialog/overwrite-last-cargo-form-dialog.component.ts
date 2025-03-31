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
import { InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';


export interface DialogData {
  action?: string;
  translatedLangText?: any;
  sot?: StoringOrderTankItem;
  cleaning?: InGateCleaningItem;
  tcDS: TariffCleaningDS;
}

@Component({
  selector: 'app-overwrite-last-cargo-form-dialog',
  templateUrl: './overwrite-last-cargo-form-dialog.component.html',
  styleUrls: ['./overwrite-last-cargo-form-dialog.component.scss'],
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
export class OverwriteLastCargoFormDialogComponent {
  sot: StoringOrderTankItem;
  cleaningItem: InGateCleaningItem;
  last_cargoList?: TariffCleaningItem[];
  tcDS: TariffCleaningDS;
  dialogTitle: string;
  overwriteForm: UntypedFormGroup;
  lastCargoControl: UntypedFormControl;
  valueChangesDisabled: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<OverwriteLastCargoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,

  ) {
    // Set the defaults
    this.dialogTitle = data.translatedLangText?.OVERWRITE_LAST_CARGO;
    this.sot = data.sot!;
    this.cleaningItem = data.cleaning!;
    this.tcDS = data.tcDS;
    this.lastCargoControl = new UntypedFormControl('', [Validators.required]);
    this.overwriteForm = this.createForm();
    this.initializeValueChange();

    if (this.sot.tariff_cleaning) {
      this.lastCargoControl.setValue(this.sot.tariff_cleaning);
    }
  }

  createForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      last_cargo: this.lastCargoControl,
      last_cargo_guid: [{ value: this.sot?.last_cargo_guid, disabled: !this.canEdit() }, [Validators.required]],
      last_cargo_remarks: this.sot?.last_cargo_remarks
    });
    return formGroup;
  }

  initializeValueChange() {
    this.overwriteForm?.get('last_cargo')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.cargo;
          this.overwriteForm!.get('last_cargo_guid')!.setValue(value.guid);
        }

        this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
          this.last_cargoList = data
          this.updateValidators(this.last_cargoList);
        });
      })
    ).subscribe();
  }

  submit() {
    if (this.overwriteForm?.valid) {
      const returnDialog: any = {
        last_cargo_guid: this.overwriteForm.get('last_cargo_guid')?.value,
        last_cargo_remarks: this.overwriteForm.get('last_cargo_remarks')?.value,
        cleaning: this.cleaningItem
      }
      this.dialogRef.close(returnDialog);
    } else {
      console.log('invalid');
      this.findInvalidControls();
    }
  }

  updateValidators(validOptions: any[]) {
    this.lastCargoControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
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
