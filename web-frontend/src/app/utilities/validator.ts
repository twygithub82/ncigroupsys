import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function AutocompleteSelectionValidator(validOptions: any[] | undefined): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return { required: true }; // If the control is empty, it's invalid
    }
    const selected = validOptions?.find(option => option.cargo === control.value);
    return selected ? null : { invalidSelection: true };
  };
}