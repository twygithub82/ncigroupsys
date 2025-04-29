import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function AutocompleteSelectionValidator(validOptions: any[] | undefined): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    // If the value is an empty string, do not perform validation
    if (value === '' || value == null || value == undefined) {
      return null;
    }

    // If validOptions is not provided, consider the selection invalid
    if (!validOptions) {
      return { 'invalidAutocompleteSelection': { value: value } };
    }

    // Validate the control's value based on the validOptions
    const isValid = validOptions.some(option => option.guid === value?.guid);
    return isValid ? null : { 'invalidAutocompleteSelection': { value: value } };
  };
}