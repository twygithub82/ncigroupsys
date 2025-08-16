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

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Return if no value to avoid error on empty field
    }

    // Regex to check for at least one uppercase letter, one lowercase letter, one number, and one special character, and a minimum length of 8.
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    const minLength = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && minLength;

    if (!passwordValid) {
      return {
        strongPassword: {
          hasUpperCase: hasUpperCase,
          hasLowerCase: hasLowerCase,
          hasNumeric: hasNumeric,
          hasSpecial: hasSpecial,
          minLength: minLength
        }
      };
    }

    return null; // Return null if the password is valid
  };
}