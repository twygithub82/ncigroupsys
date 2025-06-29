import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const tempRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const minTemp = formGroup.get('min_temp')?.value;
  const maxTemp = formGroup.get('max_temp')?.value;

  if (minTemp == null || maxTemp == null) return null;

  if (minTemp >= maxTemp) {
    // Set error on both controls for individual display
    formGroup.get('min_temp')?.setErrors({ tempRangeInvalid: true });
    formGroup.get('max_temp')?.setErrors({ tempRangeInvalid: true });
    return { tempRangeInvalid: true }; // Also return form-level error
  } else {
    // Clear the errors if validation passes
    formGroup.get('min_temp')?.setErrors(null);
    formGroup.get('max_temp')?.setErrors(null);
    return null;
  }
};

