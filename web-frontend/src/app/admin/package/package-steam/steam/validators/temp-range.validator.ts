import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const tempRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const minTemp = formGroup.get('min_temp')?.value;
  const maxTemp = formGroup.get('max_temp')?.value;

  return minTemp !== "" && maxTemp !== "" && maxTemp <= minTemp
    ? { tempRangeInvalid: true }
    : null;
};

