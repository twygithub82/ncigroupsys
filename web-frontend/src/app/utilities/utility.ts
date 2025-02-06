import { formatDate } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { Observable, from, map } from "rxjs";

export class Utility {
  static formatString(template: string, ...values: any[]): string {
    return template.replace(/{(\d+)}/g, (match, index) => {
      return typeof values[index] !== 'undefined' ? values[index] : match;
    });
  }

  static generateGUIDWithoutHyphens(): string {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static convertDateToStr(date: Date | undefined): string {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  static convertDate(date: any, endOfDay: boolean = false, includeTime: boolean = false): number | Date | undefined {
    try {
      if (!date) {
        return undefined; // Handle null or undefined input
      }

      // Handle numbers (epoch time)
      if (typeof date === 'number' && !isNaN(date)) {
        const isSeconds = date.toString().length === 10; // Check if input is in seconds
        const jsDate = new Date(isSeconds ? date * 1000 : date); // Convert to milliseconds if needed
        return jsDate; // Return as Date object
      }

      // Handle Moment.js objects
      if (moment.isMoment(date)) {
        const momentDate = endOfDay
          ? date.endOf('day') // Set to end of day
          : date.startOf('day'); // Set to start of day
        return Math.floor(momentDate.valueOf() / 1000); // Return epoch time in seconds
      }

      // Handle JavaScript Date objects
      if (date instanceof Date) {
        const jsDate = new Date(date); // Create a copy of the date
        if (!includeTime) {
          if (endOfDay) {
            jsDate.setHours(23, 59, 59, 999); // Set to end of day
          } else {
            jsDate.setHours(0, 0, 0, 0); // Set to start of day
          }
        }
        return Math.floor(jsDate.getTime() / 1000); // Return epoch time in seconds
      }

      // Handle strings that can be parsed as dates
      if (typeof date === 'string' && !isNaN(Date.parse(date))) {
        const parsedDate = new Date(date); // Parse the string into a Date object
        if (endOfDay) {
          parsedDate.setHours(23, 59, 59, 999); // Set to end of day
        } else {
          parsedDate.setHours(0, 0, 0, 0); // Set to start of day
        }
        return Math.floor(parsedDate.getTime() / 1000); // Return epoch time in seconds
      }

      // If input type is unrecognized, log error
      console.error('Unrecognized date format:', date);
      return undefined;
    } catch (error) {
      console.error('Error processing date:', date, error);
      return undefined;
    }
  }

  static convertEpochToDateStr(date: number | undefined, format: string = 'DD/MM/YYYY'): string | undefined {
    // If the input is a number, handle it as epoch time
    if (typeof date === 'number' && !isNaN(date) && date > 0) {
      let dateObj: Date;

      // Check if the number is more likely to be in seconds or milliseconds
      if (date.toString().length === 10) {
        // If it's in seconds, convert to milliseconds
        dateObj = new Date(date * 1000);
      } else if (date.toString().length === 13) {
        // If it's in milliseconds, just use the Date object
        dateObj = new Date(date);
      } else {
        console.error('Invalid epoch time format:', date);
        return undefined;
      }

      // Format the date using the provided format or default to MM/YYYY
      const formattedDate = moment(dateObj).format(format);
      return formattedDate;
    }
    return undefined;
  }

  static convertEpochToDateTimeStr(date: number | undefined, is12Hr: boolean = false): string | undefined {
    if (typeof date === 'number' && !isNaN(date)) {
      if (date.toString().length === 10) {
        if (is12Hr) {
          return this.formatDateTo12Hour(new Date(date * 1000));
        } else {
          return this.formatDateTo24Hour(new Date(date * 1000));
        }
      } else if (date.toString().length === 13) {
        if (is12Hr) {
          return this.formatDateTo12Hour(new Date(date));
        } else {
          return this.formatDateTo24Hour(new Date(date));
        }
      } else {
        console.error('Invalid epoch time format:', date);
        return undefined;
      }
    }
    return undefined;
  }

  static convertEpochToDate12TimeStr(date: number | undefined): string | undefined {
    if (typeof date === 'number' && !isNaN(date)) {
      if (date.toString().length === 10) {
        return this.formatDateTo12Hour(new Date(date * 1000));
      } else if (date.toString().length === 13) {
        return this.formatDateTo12Hour(new Date(date));
      } else {
        console.error('Invalid epoch time format:', date);
        return undefined;
      }
    }
    return undefined;
  }

  static convertEpochToDate24TimeStr(date: number | undefined): string | undefined {
    if (typeof date === 'number' && !isNaN(date)) {
      if (date.toString().length === 10) {
        return this.formatDateTo12Hour(new Date(date * 1000));
      } else if (date.toString().length === 13) {
        return this.formatDateTo12Hour(new Date(date));
      } else {
        console.error('Invalid epoch time format:', date);
        return undefined;
      }
    }
    return undefined;
  }

  static formatDateTo12Hour(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // convert 0 to 12 for midnight
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${day}/${month}/${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  static formatDateTo24Hour(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();

    const hours = date.getHours(); // 24-hour format
    const minutes = date.getMinutes();

    // Ensure two-digit formatting
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${day}/${month}/${year} ${formattedHours}:${formattedMinutes}`;
}

  static getEarlierDate(date1: Date, date2: Date): Date {
    return date1 < date2 ? date1 : date2;
  }

  static getLaterDate(date1: Date, date2: Date): Date {
    return date1 > date2 ? date1 : date2;
  }

  static verifyIsoContainerCheckDigit(containerNumber: string): boolean {
    // Regular expression to validate container number format:
    const containerNumberRegex = /^[A-Z]{4}[0-9]{7}$/;

    // Check for valid format and length
    if (!containerNumberRegex.test(containerNumber) || containerNumber.length !== 11) {
      return false; // Invalid format
    }

    // Convert letters to numbers as per ISO 6346
    const lettersToValues = (letter: string): number => {
      const code = letter.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        // ISO 6346: A=10, B=12, ..., Z=38, skipping multiples of 11
        let value = code - 55;
        if (value >= 11) value++;
        if (value >= 22) value++;
        if (value >= 33) value++;
        return value;
      }
      return -1;
    };

    // Convert the container number to numeric values
    const numericValues = [];
    for (let i = 0; i < 10; i++) {
      const char = containerNumber.charAt(i);
      if (i < 4) {
        numericValues.push(lettersToValues(char));
      } else {
        numericValues.push(parseInt(char, 10));
      }
    }

    // Calculate weighted sum using 2^position
    let weightedSum = 0;
    for (let i = 0; i < 10; i++) {
      weightedSum += numericValues[i] * Math.pow(2, i);
    }

    // Calculate the check digit
    //const remainder = weightedSum % 11;
    const checkDigit = (weightedSum - (Math.floor(weightedSum / 11) * 11));

    // Adjust check digit if it equals 10
    const finalCheckDigit = checkDigit === 10 ? 0 : checkDigit;

    // Compare calculated check digit with the last digit of the container number
    return parseInt(containerNumber.charAt(10), 10) === finalCheckDigit;
  }

  static verifyFormattedIsoContainerCheckDigit(containerNumber: string): boolean {
    // Regular expression to validate both formats:
    const containerNumberRegex = /^[A-Z]{4}[0-9]{7}$|^[A-Z]{4} [0-9]{6}-[0-9]$/;

    // Check for valid format
    if (!containerNumberRegex.test(containerNumber)) {
      return false; // Invalid format
    }

    // Remove any space and hyphen to standardize format to "ABCD1234567"
    const normalizedContainerNumber = containerNumber.replace(/[\s-]/g, '');

    // Verify that the normalized container number length is 11
    if (normalizedContainerNumber.length !== 11) {
      return false;
    }

    // Convert letters to numbers as per ISO 6346
    const lettersToValues = (letter: string): number => {
      const code = letter.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        // ISO 6346: A=10, B=12, ..., Z=38, skipping multiples of 11
        let value = code - 55;
        if (value >= 11) value++;
        if (value >= 22) value++;
        if (value >= 33) value++;
        return value;
      }
      return -1;
    };

    // Convert the container number to numeric values
    const numericValues = [];
    for (let i = 0; i < 10; i++) {
      const char = normalizedContainerNumber.charAt(i);
      if (i < 4) {
        numericValues.push(lettersToValues(char));
      } else {
        numericValues.push(parseInt(char, 10));
      }
    }

    // Calculate weighted sum using 2^position
    let weightedSum = 0;
    for (let i = 0; i < 10; i++) {
      weightedSum += numericValues[i] * Math.pow(2, i);
    }

    // Calculate the check digit
    const checkDigit = weightedSum % 11;

    // Adjust check digit if it equals 10
    const finalCheckDigit = checkDigit === 10 ? 0 : checkDigit;

    // Compare calculated check digit with the last digit of the container number
    return parseInt(normalizedContainerNumber.charAt(10), 10) === finalCheckDigit;
  }

  static getDeleteDtEpoch(): number {
    const today = new Date();
    // Set the time to 00:00:00 to get the start of the day in epoch time
    today.setHours(0, 0, 0, 0);
    const epoch = today.getTime();
    return epoch;
  }

  static convertBoolean(input: string | number | boolean | undefined): number | boolean | undefined {
    if (input === undefined) return input;

    // Handle boolean to number
    if (typeof input === 'boolean') {
      return +input; // true -> 1, false -> 0
    }

    // Handle number to boolean
    if (typeof input === 'number') {
      return input !== 0; // 0 -> false, other numbers -> true
    }

    // Handle string to number or boolean
    if (typeof input === 'string') {
      // Check if the string is a number
      if (!isNaN(Number(input))) {
        return Number(input); // Convert to number if it's a valid number string
      }
      // Check if the string is a boolean
      if (input.toLowerCase() === 'true') {
        return true;
      }
      if (input.toLowerCase() === 'false') {
        return false;
      }
    }
    return undefined;
  }

  static convertNumber(input: string | number | boolean | undefined, decimals: number = 0): number {
    if (input === undefined) return 0;

    // Handle boolean to number
    if (typeof input === 'boolean') {
      return +input; // true -> 1, false -> 0
    }

    // Handle number to number with specified decimals
    if (typeof input === 'number') {
      return parseFloat(input.toFixed(decimals)); // Round to the specified decimals
    }

    // Handle string to number
    if (typeof input === 'string') {
      // Check if the string is a valid number
      const num = Number(input);
      if (!isNaN(num)) {
        return parseFloat(num.toFixed(decimals)); // Convert to number and round
      }
    }

    // If input is not a valid number or boolean, return undefined
    return 0;
  }

  static translateAllLangText(translate: TranslateService, langText: any): Observable<any> {
    const keys: string[] = Object.keys(langText);
    const values: string[] = Object.values(langText);

    return from(translate.get(values)).pipe(
      map((translations) => {
        const translatedLangText: any = {};
        keys.forEach((key, index) => {
          translatedLangText[key] = translations[values[index]];
        });
        return translatedLangText;
      })
    );
  }

  static formatContainerNumber(containerNumber: string): string {
    if (containerNumber.length != 11) return containerNumber;
    // Extract the owner code, serial number, and check digit
    const ownerCode = containerNumber.slice(0, 4);
    const serialNumber = containerNumber.slice(4, 10);
    const checkDigit = containerNumber.slice(10);

    // Combine the parts into the final format
    return `${ownerCode} ${serialNumber}-${checkDigit}`;
  }

  static addYearsToEpoch(epochTime: number, yearCount: number): number {
    // Convert epoch time from seconds to milliseconds (JavaScript uses milliseconds)
    const epochMilliseconds = epochTime * 1000;

    const date = new Date(epochMilliseconds);

    // Separate the whole years and fractional years
    const wholeYears = Math.floor(yearCount); // Integer years (e.g., 2 from 2.5)
    const fractionalYears = yearCount - wholeYears; // Fractional part (e.g., 0.5 from 2.5)

    // Add whole years
    date.setFullYear(date.getFullYear() + wholeYears);

    // Convert fractional years to months and add them
    const monthsToAdd = Math.round(fractionalYears * 12); // Convert fractional years to months
    date.setMonth(date.getMonth() + monthsToAdd);

    // Convert back to seconds and return
    return Math.floor(date.getTime() / 1000);
  }

  static isUrl(url: string) {
    return (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:'));
  }

  static isBase64Url(url: string): boolean {
    return (url.startsWith('data:image/'));
  }

  static selectText(event: FocusEvent) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.select();
  }

  static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]); // Remove the Data URL prefix
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  static async urlToBlob(pdfUrl: string): Promise<Blob> {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch PDF content');
    }
    return await response.blob();
  }
}

export const TANK_STATUS_IN_YARD = [
  'STEAM',
  'RESIDUE',
  'CLEANING',
  'REPAIR',
  'STORAGE',
  'RO_GENERATED',
]