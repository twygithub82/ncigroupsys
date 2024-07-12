import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function AutocompleteSelectionValidator(validOptions: any[] | undefined): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!validOptions) {
      return { 'invalidAutocompleteSelection': { value: control.value } };
    }
    const isValid = validOptions.some(option => option.guid === control.value?.guid);
    return isValid ? null : { 'invalidAutocompleteSelection': { value: control.value } };
  };
}