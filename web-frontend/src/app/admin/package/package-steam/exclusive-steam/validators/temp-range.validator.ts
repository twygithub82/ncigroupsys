import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const tempRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
   const formGroup = control as FormGroup;
  const minTemp = formGroup.get('min_temp')?.value;
  const maxTemp = formGroup.get('max_temp')?.value;

  if (minTemp == null || maxTemp == null) return null;

  const exceededFlashPoint = greaterThanFlashPoint(control,maxTemp);

  
  if (minTemp >= maxTemp) {
    // Set error on both controls for individual display
    formGroup.get('min_temp')?.setErrors({ tempRangeInvalid: true });
    formGroup.get('max_temp')?.setErrors({ tempRangeInvalid: true });
   
    return {tempRangeInvalid: true}; // Also return form-level error{ tempRangeInvalid: true }; // Also return form-level error
  } else {
    // Clear the errors if validation passes
    if (exceededFlashPoint) {
      // Set error on both controls for individual display
      // formGroup.get('min_temp')?.setErrors({ excessFlashPoint: true });
      formGroup.get('max_temp')?.setErrors({ excessFlashPoint: true });
      return { excessFlashPoint: true }; // Also return form-level error
    }
    else{
      formGroup.get('min_temp')?.setErrors(null);
      formGroup.get('max_temp')?.setErrors(null);
      return null;
    }
  
  }
};


function greaterThanFlashPoint(control: AbstractControl, maxTemp: number): boolean {
  const lastCargo = control.get('last_cargo')?.value;

  if (!lastCargo) return false;

  if (Array.isArray(lastCargo)) {
    return lastCargo.some(cargo =>
      cargo?.flash_point != null && maxTemp > cargo.flash_point
    );
  } else {
    return lastCargo?.flash_point != null && maxTemp > lastCargo.flash_point;
  }
}

