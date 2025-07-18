import { TranslateService } from "@ngx-translate/core";
import { StoringOrderTankItem } from "app/data-sources/storing-order-tank";
import { jsPDF } from 'jspdf';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import * as moment from "moment";
import { Observable, from, map } from "rxjs";
import { PDFUtility } from "./pdf-utility";
import { systemCurrencyCode } from '../../environments/environment';
import * as domtoimage from 'dom-to-image-more';
import html2canvas from "html2canvas";

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

  static convertDateToStr_MonthYear(date: Date | undefined): string {
    if (!date) return "";
    // const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
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

      // ✅ If input is a number (epoch time), return a correct Date object
      if (typeof date === 'number' && !isNaN(date)) {
        const isSeconds = date < 10000000000; // Check if input is in seconds
        const epochMs = isSeconds ? date * 1000 : date; // Convert SECONDS to MILLISECONDS
        return new Date(epochMs); // Force UTC interpretation
      }

      // ✅ Handle Moment.js Objects (Return Epoch Time in Seconds)
      if (moment.isMoment(date)) {
        const momentDate = endOfDay
          ? date.endOf('day') // Set to end of day in UTC
          : date.startOf('day'); // Set to start of day in UTC
        return Math.floor(momentDate.valueOf() / 1000); // Return epoch time in seconds
      }

      // ✅ Handle JavaScript Date objects (Return Epoch Time in Seconds)
      if (date instanceof Date) {
        const jsDate = new Date(date); // Create a copy of the date
        if (!includeTime) {
          //jsDate.setUTCHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
          jsDate.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
        }
        return Math.floor(jsDate.getTime() / 1000); // Return epoch time in seconds
      }

      // ✅ Handle Strings (Parse into Epoch Seconds)
      if (typeof date === 'string' && !isNaN(Date.parse(date))) {
        const parsedDate = new Date(date); // Parse the string into a Date object
        if (endOfDay) {
          parsedDate.setUTCHours(23, 59, 59, 999); // Set to end of day in UTC
        } else {
          parsedDate.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC
        }
        return Math.floor(parsedDate.getTime() / 1000); // Return epoch time in seconds
      }

      // ❌ If the input format is unrecognized, log an error
      console.error('Unrecognized date format:', date);
      return undefined;
    } catch (error) {
      console.error('Error processing date:', date, error);
      return undefined;
    }
  }

  static convertDateMoment(date: any, endOfDay: boolean = false, includeTime: boolean = false): number | moment.Moment | undefined {
    try {
      if (!date) {
        return undefined; // Handle null or undefined input
      }

      // ✅ If input is a number (epoch time), return a correct Date object
      if (typeof date === 'number' && !isNaN(date)) {
        const isSeconds = date < 10000000000; // Check if input is in seconds
        const epochMs = isSeconds ? date * 1000 : date; // Convert SECONDS to MILLISECONDS
        // return new Date(epochMs); // Force UTC interpretation
        return moment(epochMs); // Return as Moment object
      }

      // ✅ Handle Moment.js Objects (Return Epoch Time in Seconds)
      if (moment.isMoment(date)) {
        const momentDate = endOfDay
          ? date.utc().endOf('day') // Set to end of day in UTC
          : date.utc().startOf('day'); // Set to start of day in UTC
        return Math.floor(momentDate.valueOf() / 1000); // Return epoch time in seconds
      }

      // ✅ Handle JavaScript Date objects (Return Epoch Time in Seconds)
      if (date instanceof Date) {
        const jsDate = new Date(date); // Create a copy of the date
        if (!includeTime) {
          //jsDate.setUTCHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
          jsDate.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
        }
        return Math.floor(jsDate.getTime() / 1000); // Return epoch time in seconds
      }

      // ✅ Handle Strings (Parse into Epoch Seconds)
      if (typeof date === 'string' && !isNaN(Date.parse(date))) {
        const parsedDate = new Date(date); // Parse the string into a Date object
        if (endOfDay) {
          parsedDate.setUTCHours(23, 59, 59, 999); // Set to end of day in UTC
        } else {
          parsedDate.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC
        }
        return Math.floor(parsedDate.getTime() / 1000); // Return epoch time in seconds
      }

      // ❌ If the input format is unrecognized, log an error
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
      if (date < 10000000000) {
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
      if (date < 10000000000) {
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
      if (date < 10000000000) {
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
      if (date < 10000000000) {
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

    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ; ${formattedHours}:${formattedMinutes} ${ampm}`;
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

    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ; ${formattedHours}:${formattedMinutes}`;
  }

  static getDisplayTimeTaken(stop_time: number | undefined, start_time: number | undefined): string {
    if (!stop_time || !start_time) return '';
    const timeTakenSec = stop_time - start_time;

    const hours = Math.floor(timeTakenSec / 3600);
    const minutes = Math.ceil((timeTakenSec % 3600) / 60);

    return `${hours} hr ${minutes} min`;
  }

  static getToday(): string {
    return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
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
      const num = Number(input.replace(/,/g, ''));
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
    if (!containerNumber) return containerNumber;

    // Remove spaces and dashes first
    const cleaned = containerNumber.trim().replace(/\s|-/g, '').toUpperCase();

    if (cleaned.length !== 11) {
      return containerNumber.trim().toUpperCase();
    }

    const ownerCode = cleaned.slice(0, 4);
    const serialNumber = cleaned.slice(4, 10);
    const checkDigit = cleaned.slice(10);

    return `${ownerCode} ${serialNumber}-${checkDigit}`;
  }

  static formatTankNumberForSearch(tankNumber: string): string {
    if (!tankNumber) return '';
    const cleaned = tankNumber?.trim();

    const serialNumber = cleaned.slice(0, -1); // everything except last char
    const checkDigit = cleaned.slice(-1); // last char

    return `${serialNumber}-${checkDigit}`;
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

  static downloadFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();

    // Revoke the URL to free memory
    URL.revokeObjectURL(url);
  }

  static formatNumberDisplay(input: number | string | undefined, locale: string = 'en-US'): string {
    if (input === undefined || input === null || input === '') {
      return '';
    }

    const numericValue = typeof input === 'string' ? parseFloat(input.replace(/,/g, '')) : input;

    if (isNaN(numericValue)) {
      return '';
    }

    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  }

  static booleanToYesNo(input: boolean | undefined): string {
    const match = BOOLEAN_YES_NO.find(option => option.value === input);
    return match ? match.label : '';
  }

  static yesNoToBoolean(input: string | undefined): boolean {
    const match = BOOLEAN_YES_NO.find(option => option.label.toUpperCase() === input?.toUpperCase());
    return match ? match.value : false;
  }

  static getBackgroundColorFromNature(natureCv: string | undefined) {
    var color = 'orange';
    switch (natureCv) {
      case "HAZARDOUS":
        color = 'green';
        break;
      case "FLAMMABLE":
        color = 'orange';
        break;
      case "EXPLOSIVES":
        color = 'red';
        break;
      case "GASES":
        color = 'cyan';
        break;
      case "TOXIC":
        color = 'purple';
        break;
      case "RADIOACTIVE":
        color = 'purple-dark';
        break;
      case "CORROSIVE":
        color = 'black';
        break;
      case "OXIDIZING":
        color = 'yellow';
        break;
    }
    return color;
  }

  static getProcessStatusBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'QC_COMPLETED':
      case 'COMPLETED':
      case 'APPROVED':
        return 'badge badge-solid-green';
      case 'PENDING':
        return 'badge badge-solid-cyan';
      case 'CANCEL':
      case 'NO_ACTION':
        return 'badge badge-solid-red';
      case 'JOB_IN_PROGRESS':
      case 'PARTIAL_ASSIGNED':
      case 'ASSIGNED':
        return 'badge badge-solid-purple';
      default:
        return '';
    }
  }

  static getCleaningConditionBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'CLEAN':
        return 'font-bold badge badge-solid-green';
      case 'DIRTY':
        return 'font-bold badge badge-solid-red';
      default:
        return '';
    }
  }

  static onNumericOnly(event: Event, form: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    form?.setValue(input.value, { emitEvent: false });
  }

  static onUNNumericOnly(event: Event, form: any): void {
    const input = event.target as HTMLInputElement;
    // Allow digits (0-9), U, and N only
    input.value = input.value.replace(/[^0-9UN]/g, '');
    form?.setValue(input.value, { emitEvent: false });
  }

  static onAlphaOnly(event: Event, form: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
    form?.setValue(input.value, { emitEvent: false });
  }

  static onAlphaNumericOnly(event: Event, form: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, ''); // Allow letters and digits only
    form?.setValue(input.value, { emitEvent: false });
  }

  static onAlphaNumericWithSpace(event: Event, form: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9\s]/g, ''); // Allow letters and digits only
    form?.setValue(input.value, { emitEvent: false });
  }

  static getCountryCodes(orderBy: 'country' | 'code' = 'country', emptyCountry: boolean = false): any[] {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });

    let result = getCountries()
      .map(countryISO => ({
        country: displayNames.of(countryISO),
        code: `+${getCountryCallingCode(countryISO)}`,
        iso: countryISO.toLowerCase(),
        flagUrl: Utility.getFlagUrl(countryISO.toLowerCase())
      }))
      .sort((a, b) => {
        return orderBy === 'code'
          ? parseInt(a.code) - parseInt(b.code)
          : (a.country || '').localeCompare(b.country || '');
      });

    if (emptyCountry) {
      result = [
        {
          country: 'All',
          code: '',
          iso: '',
          flagUrl: ''
        },
        ...result
      ];
    }

    return result;
  }

  static removeTypenameFields(obj: any): void {
    if (Array.isArray(obj)) {
      obj.forEach(item => this.removeTypenameFields(item));
    } else if (obj !== null && typeof obj === 'object') {
      for (const key in obj) {
        if (key === '__typename') {
          delete obj[key];
        } else {
          this.removeTypenameFields(obj[key]);
        }
      }
    }
  }

  static getFlagUrl(iso: string): string {
    const knownUnavailable = ['ac', 'xk', 'eu', 'ta']; // unsupported emoji or flagcdn
    if (knownUnavailable.includes(iso.toLowerCase())) {
      return `assets/images/flags/icons/${iso.toLowerCase()}.png`;
    }
    return `https://flagcdn.com/24x18/${iso.toLowerCase()}.png`;
  }

  static getCountryCodeObject(code: string | undefined, countryCodeList: any[]): any {
    const found = countryCodeList.find((item) => item.code === code);
    return found;
  }

  static isSameDate(date1: Date | number | undefined, date2: Date | number | undefined): boolean {
    if (!date1 || !date2) return false;

    const d1 = typeof date1 === 'number' ? this.convertDate(date1) as Date : date1;
    const d2 = typeof date2 === 'number' ? this.convertDate(date2) as Date : date2;

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  static getSaveBtnDescription(guid: string | undefined | null) {
    return guid ? 'UPDATE' : 'SAVE';
  }

  static addText(pdf: jsPDF, content: string, topPos: number, leftPost: number, fontSize: number) {
    pdf.setFontSize(fontSize); // Title font size 
    pdf.text(content, leftPost, topPos); // Position it at the top
  }

  static async addReportTitle(pdf: jsPDF, title: string, pageWidth: number, leftMargin: number, rightMargin: number,
    topPosition: number, fontSize: number = 14, underline: boolean = true, additionalBufferX: number = 0) {
    // pdf.setFontSize(14); // Title font size 
    // const titleWidth = pdf.getStringUnitWidth(title) * pdf.getFontSize() / pdf.internal.scaleFactor;
    // const titleX = (pageWidth - titleWidth) / 2; // Centering the title
    // if (topPosition <= 10) {
    //   topPosition = 11;
    // }
    // pdf.text(title, titleX, topPosition); // Position it at the top

    // pdf.setLineDashPattern([0.001, 0.001], 0);
    // // Draw underline for the title
    // pdf.setLineWidth(0.1); // Set line width for underline
    // pdf.line(titleX, topPosition + 2, titleX + titleWidth + 1, topPosition + 2); // Draw the line under the title

    PDFUtility.addReportTitle(pdf, title, pageWidth, leftMargin, rightMargin, topPosition, fontSize, underline, additionalBufferX);
  }

  static addReportTitleToggleUnderline(pdf: jsPDF, title: string, pageWidth: number, leftMargin: number, rightMargin: number, topPosition: number, underline: boolean, fontSize: number = 14) {
    // pdf.setFontSize(14); // Title font size 
    // const titleWidth = pdf.getStringUnitWidth(title) * pdf.getFontSize() / pdf.internal.scaleFactor;
    // const titleX = (pageWidth - titleWidth) / 2; // Centering the title
    // if (topPosition <= 10) {
    //   topPosition = 11;
    // }
    // pdf.text(title, titleX, topPosition); // Position it at the top

    // pdf.setLineDashPattern([0.001, 0.001], 0);
    // // Draw underline for the title
    // pdf.setLineWidth(0.1); // Set line width for underline
    // if (underline) {
    //   pdf.line(titleX, topPosition + 2, titleX + titleWidth + 1, topPosition + 2); // Draw the line under the title
    // }
    PDFUtility.addReportTitle(pdf, title, pageWidth, leftMargin, rightMargin, topPosition, fontSize, underline);
  }

  static AddTextAtRightCornerPage(pdf: jsPDF, text: string, pageWidth: number, leftMargin: number, rightMargin: number, topPosition: number, fontSize: number) {
    pdf.saveGraphicsState();
    pdf.setFontSize(fontSize); // Title font size 
    const titleWidth = pdf.getStringUnitWidth(text) * pdf.getFontSize() / pdf.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) - rightMargin; // Centering the title

    pdf.text(text, titleX, topPosition); // Position it at the top

    // pdf.setLineDashPattern([0.001, 0.001], 0);
    // Draw underline for the title
    // pdf.setLineWidth(0.1); // Set line width for underline
    // pdf.line(titleX, topPosition+2, titleX + titleWidth, topPosition+2); // Draw the line under the title
  }

  static AddTextAtCenterPage(pdf: jsPDF, text: string, pageWidth: number, leftMargin: number, rightMargin: number, topPosition: number, fontSize: number) {
    pdf.setFontSize(fontSize); // Title font size 
    const titleWidth = pdf.getStringUnitWidth(text) * pdf.getFontSize() / pdf.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2; // Centering the title

    pdf.text(text, titleX, topPosition); // Position it at the top

    // pdf.setLineDashPattern([0.001, 0.001], 0);
    // Draw underline for the title
    // pdf.setLineWidth(0.1); // Set line width for underline
    // pdf.line(titleX, topPosition+2, titleX + titleWidth, topPosition+2); // Draw the line under the title
  }


  static async DrawCardForImageAtCenterPage(pdf: jsPDF, card: any, pageWidth: number, leftMargin: number, 
    rightMargin: number, topPosition: number, maxChartWidth: number, imgQuality: number) {
    let chartContentWidth = maxChartWidth;

    let startY: number = topPosition;

    // card.style.boxShadow = 'none';
    // card.style.transition = 'none';
    const imgData1 = await Utility.convertToImage(card,"jpeg");
    const imgInfo = await Utility.getImageSizeFromBase64(imgData1);
    const aspectRatio = imgInfo.width / imgInfo.height;

    // const imgData1 = canvas.toDataURL('image/jpeg', imgQuality);
    // const aspectRatio = canvas.width / canvas.height;

    // Calculate scaled height based on available width
    let imgHeight1 = chartContentWidth / aspectRatio;

    // Check if the scaled height exceeds the available page height
    const maxPageHeight = pdf.internal.pageSize.height - startY; // Remaining space on the page
    if (imgHeight1 > maxPageHeight) {
      // Adjust height to fit within the page
      imgHeight1 = maxPageHeight;
      // Recalculate width to maintain aspect ratio
      chartContentWidth = imgHeight1 * aspectRatio;
    }

    let startX = leftMargin + ((pageWidth - leftMargin - rightMargin) / 2) - (chartContentWidth / 2);

    // Add the image to the PDF
    pdf.addImage(imgData1, 'JPEG', startX, topPosition, chartContentWidth, imgHeight1);


    // pdf.setLineDashPattern([0.001, 0.001], 0);
    // Draw underline for the title
    // pdf.setLineWidth(0.1); // Set line width for underline
    // pdf.line(titleX, topPosition+2, titleX + titleWidth, topPosition+2); // Draw the line under the title
  }

  static DrawImageAtCenterPage(pdf: jsPDF, canvas: HTMLCanvasElement, pageWidth: number, leftMargin: number, rightMargin: number, topPosition: number, maxChartWidth: number, imgQuality: number) {
    let chartContentWidth = maxChartWidth;

    let startY: number = topPosition;

    const imgData1 = canvas.toDataURL('image/jpeg', imgQuality);
    const aspectRatio = canvas.width / canvas.height;

    // Calculate scaled height based on available width
    let imgHeight1 = chartContentWidth / aspectRatio;

    // Check if the scaled height exceeds the available page height
    const maxPageHeight = pdf.internal.pageSize.height - startY; // Remaining space on the page
    if (imgHeight1 > maxPageHeight) {
      // Adjust height to fit within the page
      imgHeight1 = maxPageHeight;
      // Recalculate width to maintain aspect ratio
      chartContentWidth = imgHeight1 * aspectRatio;
    }

    let startX = leftMargin + ((pageWidth - leftMargin - rightMargin) / 2) - (chartContentWidth / 2);

    // Add the image to the PDF
    pdf.addImage(imgData1, 'JPEG', startX, topPosition, chartContentWidth, imgHeight1);


    // pdf.setLineDashPattern([0.001, 0.001], 0);
    // Draw underline for the title
    // pdf.setLineWidth(0.1); // Set line width for underline
    // pdf.line(titleX, topPosition+2, titleX + titleWidth, topPosition+2); // Draw the line under the title
  }

  static previewPDF_window(pdf: jsPDF, win: Window) {
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Try opening in a new window
    //const newWindow = window.open(blobUrl, '_blank','noopener,noreferrer');

    if (win) {
      win.location.href = blobUrl;
    }
  }

  static previewPDF(pdf: jsPDF, fileName: string = 'document.pdf') {
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const html = `
              <html>
                <head><title>${fileName.replace(/\.pdf$/i, '')}</title></head>
                <body style="margin:0">
                  <iframe src="${blobUrl}" width="100%" height="100%" style="border:none;"></iframe>
                </body>
              </html>
            `;
    // const a = document.createElement('a');
    // a.href = blobUrl;
    // a.download = `${fileName.replace(/\.pdf$/i, '')}`; // 👈 This sets the filename
    // a.target = '_blank';
    // a.click();
    // Try opening in a new window
   // const newWindow = window.open(blobUrl, '_blank');
   // if (!newWindow) {
      pdf.save(fileName);
    // } else {
    //   newWindow.document.write(html);
    //   newWindow.document.close();
    //   // Cleanup the URL after some time
    //   setTimeout(() => {
    //     URL.revokeObjectURL(blobUrl);
    //   }, 10000); // Increased delay to ensure the PDF loads
    // }
  }

  static async addHeaderWithCompanyLogo_Portriat(
    pdf: jsPDF,
    pageWidth: number,
    topMargin: number,
    bottomMargin: number,
    leftMargin: number,
    rightMargin: number,
    translateService: TranslateService // Inject TranslateService
  ): Promise<void> {

    //await PDFUtility.addHeaderWithCompanyLogo_Portriat_r1(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, translateService);
    await PDFUtility.addHeaderWithCompanyLogo_Portriat(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, translateService);

  }

  static async addHeaderWithCompanyLogo_Landscape(
    pdf: jsPDF,
    pageWidth: number,
    topMargin: number,
    bottomMargin: number,
    leftMargin: number,
    rightMargin: number,
    translateService: TranslateService // Inject TranslateService
  ): Promise<void> {

    await PDFUtility.addHeaderWithCompanyLogo_Landscape(pdf, pageWidth, topMargin, bottomMargin, leftMargin, rightMargin, translateService);

  }

  static async loadPDFImage(
    imgUrl: string,
    maxWidth?: number,
    maxHeight?: number
  ): Promise<{ img: HTMLImageElement; width: number; height: number }> {
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        let { naturalWidth: width, naturalHeight: height } = img;

        if (maxWidth || maxHeight) {
          const aspectRatio = width / height;

          if (maxWidth && maxHeight) {
            // Fit within both bounds
            if (width > maxWidth || height > maxHeight) {
              if (width / maxWidth > height / maxHeight) {
                width = maxWidth;
                height = width / aspectRatio;
              } else {
                height = maxHeight;
                width = height * aspectRatio;
              }
            }
          } else if (maxWidth) {
            if (width > maxWidth) {
              width = maxWidth;
              height = width / aspectRatio;
            }
          } else if (maxHeight) {
            if (height > maxHeight) {
              height = maxHeight;
              width = height * aspectRatio;
            }
          }
        }

        resolve({
          img,
          width,
          height,
        });
      };

      img.onerror = () => reject(new Error(`Failed to load image from ${imgUrl}`));
      img.src = imgUrl;
    });
  }

  static removeDeletedInGateAndOutGate(sot: StoringOrderTankItem) {
    sot.in_gate = sot?.in_gate?.filter(i => i.delete_dt == null || i.delete_dt == 0) || [];
    sot.out_gate = sot?.out_gate?.filter(i => i.delete_dt == null || i.delete_dt == 0) || [];
    sot.cleaning = sot?.cleaning?.filter(i => i.delete_dt == null || i.delete_dt == 0) || [];
    sot.repair = sot?.repair?.filter(i => i.delete_dt == null || i.delete_dt == 0) || [];
  }

  static DisplayLastTest(sot: StoringOrderTankItem): string {
    var lastTest: string = '';
    this.removeDeletedInGateAndOutGate(sot);

    if (sot.in_gate?.[0]?.in_gate_survey) {
      var last_test_dt: Date = new Date();
      if (sot.in_gate?.[0]?.in_gate_survey?.test_dt) {
        last_test_dt = Utility.convertDate(sot.in_gate?.[0]?.in_gate_survey?.test_dt) as Date || new Date();
      }

      lastTest = sot.in_gate?.[0]?.in_gate_survey?.test_class_cv || "";
      lastTest += ` ${Utility.convertDateToStr_MonthYear(last_test_dt)}`;//` ${Utility.convertDateToStr(last_test_dt)}`;
      if (sot.in_gate?.[0]?.in_gate_survey?.last_test_cv) {
        lastTest += ` ${(sot.in_gate?.[0]?.in_gate_survey?.last_test_cv == "2.5" ? "(A)" : "(H)")}`;
      }
      //nextTest = this.cvDS.getCodeDescription(sot.in_gate?.[0]?.in_gate_survey?.next_test_cv, this.testTypeCvList) || '';
    }

    if (sot.out_gate?.[0]?.out_gate_survey) {
      var last_test_dt: Date = new Date();
      if (sot.out_gate?.[0]?.out_gate_survey?.test_dt) {
        last_test_dt = Utility.convertDate(sot.out_gate?.[0]?.out_gate_survey?.test_dt) as Date || new Date();
      }

      lastTest = sot.out_gate?.[0]?.out_gate_survey?.test_class_cv || "";
      lastTest += ` ${Utility.convertDateToStr_MonthYear(last_test_dt)}`; //` ${Utility.convertDateToStr(last_test_dt)}`;
      if (sot.out_gate?.[0]?.out_gate_survey?.last_test_cv) {
        lastTest += ` ${(sot.out_gate?.[0]?.out_gate_survey?.last_test_cv == "2.5" ? "(A)" : "(H)")}`;
      }
    }
    // if (this.queryType == 1) {
    //   //lastTest = this.cvDS.getCodeDescription(sot.in_gate?.[0]?.in_gate_survey?.last_test_cv, this.testTypeCvList) || '';
    // }
    // else {
    //   lastTest = this.cvDS.getCodeDescription(sot.out_gate?.[0]?.out_gate_survey?.last_test_cv, this.testTypeCvList) || '';
    // }
    return lastTest;
  }

  static DisplayNextTest(sot: StoringOrderTankItem): string {
    var nextTest: string = '';
    var yearsToAdd = 2.5;
    var next_test_dt: Date = new Date();
    this.removeDeletedInGateAndOutGate(sot);
    if (sot.in_gate?.[0]?.in_gate_survey) {
      if (sot.in_gate?.[0]?.in_gate_survey?.test_dt) {
        next_test_dt = Utility.convertDate(sot.in_gate?.[0]?.in_gate_survey?.test_dt) as Date || new Date();
      }

      next_test_dt.setMonth(next_test_dt.getMonth() + (yearsToAdd * 12));
      // nextTest = sot.in_gate?.[0]?.in_gate_survey?.test_class_cv||"";
      nextTest += ` ${Utility.convertDateToStr_MonthYear(next_test_dt)}`;//` ${Utility.convertDateToStr(next_test_dt)}`;
      if (sot.in_gate?.[0]?.in_gate_survey?.last_test_cv) {
        nextTest += ` ${(sot.in_gate?.[0]?.in_gate_survey?.next_test_cv == "2.5" ? "(A)" : "(H)")}`;
      }
      //nextTest = this.cvDS.getCodeDescription(sot.in_gate?.[0]?.in_gate_survey?.next_test_cv, this.testTypeCvList) || '';
    }

    if (sot.out_gate?.[0]?.out_gate_survey) {
      nextTest = "";
      if (sot.out_gate?.[0]?.out_gate_survey?.test_dt) {
        next_test_dt = Utility.convertDate(sot.out_gate?.[0]?.out_gate_survey?.test_dt) as Date || new Date();
      }
      next_test_dt.setMonth(next_test_dt.getMonth() + (yearsToAdd * 12));
      //nextTest = sot.in_gate?.[0]?.in_gate_survey?.test_class_cv||"";
      nextTest += ` ${Utility.convertDateToStr_MonthYear(next_test_dt)}`;
      if (sot.out_gate?.[0]?.out_gate_survey?.last_test_cv) {
        nextTest += ` ${(sot.in_gate?.[0]?.in_gate_survey?.next_test_cv == "2.5" ? "(A)" : "(H)")}`;
      }
    }
    return nextTest;
  }

  static isSelectedDateGreaterThanToday(selectedMonth: number, selectedYear: number): boolean {
    // Get today's date
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11, so add 1
    const currentYear = today.getFullYear();

    // Compare the selected year and month with today's year and month
    if (selectedYear > currentYear) {
      return true; // Selected year is greater
    } else if (selectedYear === currentYear && selectedMonth > currentMonth) {
      return true; // Selected year is the same, but month is greater
    }

    return false; // Selected date is not greater than today
  }

  static isParsableToNumber(value: string): boolean {
    const num = Number(value);
    return !isNaN(num) && !isNaN(parseFloat(value));
  }

  /**
  * Get the date range (Monday-Sunday) for a given ISO week of the year.
  * @param year - Full year (e.g., 2025).
  * @param weekOfYear - ISO week number (1-53).
  * @returns Date range string (e.g., "30-Dec - 05-Jan") or null if invalid.
  */
  static getISOWeekRange(
    year: number,
    weekOfYear: number
  ): string | null {
    // Validate week number (ISO weeks range from 1 to 52 or 53)
    if (weekOfYear < 1 || weekOfYear > 53) return null;

    // Get January 1st of the year
    const janFirst = new Date(year, 0, 1);
    const janFirstDay = janFirst.getDay() || 7; // Convert Sunday (0) to 7

    // Calculate the first Thursday of the year (ISO week 1 starts here)
    const firstThursday =
      janFirstDay <= 4
        ? new Date(year, 0, 1 + (4 - janFirstDay)) // Same week
        : new Date(year, 0, 1 + (11 - janFirstDay)); // Next week

    // Calculate the start of the requested ISO week (Monday)
    const weekStart = new Date(firstThursday);
    weekStart.setDate(firstThursday.getDate() - 3 + (weekOfYear - 1) * 7);

    // Calculate the end of the week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Format dates (e.g., "01-Jan")
    const startStr = this.formatDate(weekStart);
    const endStr = this.formatDate(weekEnd);

    return `${startStr} - ${endStr}`;
  }

  /**
   * Helper: Format date as "DD-MMM" (e.g., "01-Jan").
   */
  static formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day}-${month}`;
  }

  static extractYearFromMonthYear(monthYearStr: string): number | null {
    // Split the string at " - " and get the second part (year)
    const parts = monthYearStr.split(' - ');

    if (parts.length !== 2) return null; // Invalid format

    const yearStr = parts[1].trim();
    const year = parseInt(yearStr, 10);

    // Validate (e.g., 2025 is a valid year, "ABC" is not)
    return !isNaN(year) && year > 0 ? year : null;
  }

  static isTankInYard(tank_status_cv?: string) {
    return TANK_STATUS_IN_YARD.includes(tank_status_cv || '');
  }

  static isTankReleased(tank_status_cv?: string) {
    return TANK_STATUS_POST_IN_YARD.includes(tank_status_cv || '');
  }

  static patchStringToArrayValue(arrayVal: string | undefined) {
    return arrayVal ? [arrayVal] : []
  }

  static convertToWords(amount: number | string, currency: string = '', centsCurrency: string = 'CENTS'): string {
    // Handle string input and parse it
    if (typeof amount === 'string') {
      amount = parseFloat(amount.replace(/,/g, ''));
    }

    // Round to 2 decimal places
    amount = Math.round(Number(amount) * 100) / 100;

    const dollars = Math.floor(amount);
    const cents = Math.round((amount - dollars) * 100);

    let result = '';

    if (dollars > 0) {
      result = this.convertDollars(dollars) + ' ' + currency;
    }

    if (cents > 0) {
      if (result !== '') {
        result += ' AND ';
      }
      result += this.convertCents(cents) + ' ' + centsCurrency;
    }

    if (result === '') {
      return 'ZERO ' + currency + ' ONLY';
    }

    return result + ' ONLY';
  }

  static convertDollars(num: number): string {
    let scales = ['', 'THOUSAND', 'MILLION', 'BILLION', 'TRILLION'];
    if (num === 0) return 'ZERO';

    let words = '';
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        const chunkWords = this.convertChunk(chunk);
        words = chunkWords + ' ' + scales[scaleIndex] + ' ' + words;
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return words.trim();
  }

  static convertCents(num: number): string {
    let units = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
    let tens = ['', 'TEN', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
    let teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    if (num < 10) {
      return units[num];
    } else if (num < 20) {
      return teens[num - 10];
    } else {
      const ten = Math.floor(num / 10);
      const unit = num % 10;
      return tens[ten] + (unit > 0 ? ' ' + units[unit] : '');
    }
  }

  static convertChunk(num: number): string {
    let units = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
    let tens = ['', 'TEN', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
    let teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    let words = '';

    if (num >= 100) {
      words += units[Math.floor(num / 100)] + ' HUNDRED';
      num %= 100;
      if (num > 0) words += ' AND ';
    }

    if (num >= 20) {
      words += tens[Math.floor(num / 10)];
      num %= 10;
      if (num > 0) words += ' ';
    } else if (num >= 10) {
      words += teens[num - 10];
      num = 0;
    }

    if (num > 0) {
      words += units[num];
    }

    return words;
  }

  static GetSystemCurrencyCode(): string {
    return systemCurrencyCode;
  }

  static IsAllowAutoSearch(): boolean {
    return true;
  }

  static getTodayDateInEpoch(): number {
    return Math.floor(Date.now() / 1000);
  }

  static naturalSort(a: string, b: string): number {
    // Split into parts: letters and numbers
    const aParts = a.split(/(\d+)/);
    const bParts = b.split(/(\d+)/);

    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
      const aPart = aParts[i];
      const bPart = bParts[i];

      // If both parts are numbers, compare numerically
      if (!isNaN(Number(aPart))) {
        const numA = parseInt(aPart, 10);
        const numB = parseInt(bPart, 10);
        if (numA !== numB) return numA - numB;
      }
      // Otherwise, compare as strings (case-insensitive)
      else if (aPart.toLowerCase() !== bPart.toLowerCase()) {
        return aPart.localeCompare(bPart);
      }
    }

    return a.length - b.length;
  }

  static async convertToImage_html2canvas(element: HTMLElement, type: 'png' | 'jpeg' = 'png'): Promise<string> {
    var imgScale=2;
    var imgQty=0.95;
    if (!element) throw new Error('Invalid element');

  // Ensure all fonts and images are loaded first
      await document.fonts.ready;
      await Promise.all(Array.from(document.images).map(img =>
        img.complete ? Promise.resolve() : new Promise(resolve => img.onload = img.onerror = resolve)
      ));

      await Promise.all([
        document.fonts.load('1em Material Icons'),
        // Add other fonts you're using
      ]);
       var canvas = await html2canvas(element, { scale: imgScale });
       var imgType ="image/jpeg";
       if(type === 'png') imgType="image/png";
        return canvas.toDataURL(imgType, imgQty);
  }

 
static async convertToImage_domToImage(element: HTMLElement, type: 'png' | 'jpeg' = 'png'): Promise<string> {
  if (!element) throw new Error('Invalid element');

  // 1. Ensure all resources are loaded
  await this.waitForResources();

  // 2. Create a clone with proper dimensions
  const clone = await this.createCloneForConversion(element);
  
 
  return await this.convertWithDomToImage_r1(clone, type);
}

static async convertToImage(element: HTMLElement, type: 'png' | 'jpeg' = 'png'): Promise<string> {
  if (!element) throw new Error('Invalid element');

  // 1. Ensure all resources are loaded
  await this.waitForResources();

  // 2. Create a clone with proper dimensions
  const clone = await this.createCloneForConversion(element);
  
  // 3. Use html2canvas if available (more reliable)
  // if (typeof html2canvas === 'function') {
  //   try {
  //     return await this.convertWithHtml2Canvas(clone, type);
  //   } catch (error) {
  //     console.warn('html2canvas failed, falling back to dom-to-image', error);
  //   }
  // }

  // 4. Fallback to dom-to-image with proper sizing
  return await this.convertWithDomToImage(clone, type);
}

private static async waitForResources(): Promise<void> {
  await document.fonts.ready;
  await Promise.all(Array.from(document.images).map(img => 
    img.complete ? Promise.resolve() : new Promise(resolve => img.onload = img.onerror = resolve)
  ));
}

private static async createCloneForConversion(element: HTMLElement): Promise<HTMLElement> {
  // Create clone with proper dimensions
  const clone = element.cloneNode(true) as HTMLElement;
  const container = document.createElement('div');
  
  // Position clone off-screen but maintain layout
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.style.visibility = 'hidden';
  container.style.width = `${element.scrollWidth}px`;
  container.style.height = `${element.scrollHeight}px`;
  container.appendChild(clone);
  document.body.appendChild(container);

  // Copy all styles
  await this.copyStyles(element, clone);
  
  // Force layout calculation
  await this.forceReflow(clone);
  
  return clone;
}

private static async copyStyles(source: HTMLElement, target: HTMLElement): Promise<void> {
  const computedStyle = window.getComputedStyle(source);
  const styleProps = Array.from(computedStyle)
    .filter(prop => {
      const value = computedStyle.getPropertyValue(prop);
      return value && !prop.startsWith('-webkit');
    });

  // Copy styles to target
  styleProps.forEach(prop => {
    target.style.setProperty(
      prop, 
      computedStyle.getPropertyValue(prop),
      computedStyle.getPropertyPriority(prop)
    );
  });

  // Handle children recursively
  const sourceChildren = Array.from(source.children) as HTMLElement[];
  const targetChildren = Array.from(target.children) as HTMLElement[];
  
  await Promise.all(sourceChildren.map((child, i) => {
    if (targetChildren[i]) {
      return this.copyStyles(child, targetChildren[i]);
    }
    return Promise.resolve();
  }));
}

private static forceReflow(element: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    void element.offsetHeight; // Trigger reflow
    setTimeout(resolve, 50); // Small delay
  });
}

private static async convertWithHtml2Canvas(element: HTMLElement, type: 'png' | 'jpeg'): Promise<string> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2, // Higher quality
    logging: false,
    useCORS: true,
    allowTaint: true,
    scrollX: 0,
    scrollY: 0
  });
  
  return type === 'jpeg' 
    ? canvas.toDataURL('image/jpeg', 0.95)
    : canvas.toDataURL('image/png');
}

public static async convertWithDomToImage_r1(
  element: HTMLElement,
  type: 'png' | 'jpeg'
): Promise<string> {
  // Use custom scale if provided, otherwise default to 2x device pixel ratio
  const scale = 1.5 ; // || 2 * (window.devicePixelRatio || 1);
  
  // Calculate scaled dimensions
  const originalWidth = element.scrollWidth;
  const originalHeight = element.scrollHeight;
  const scaledWidth = originalWidth * scale;
  const scaledHeight = originalHeight * scale;

  const options = {
    width: scaledWidth,
    height: scaledHeight,
    quality: type === 'jpeg' ? 0.95 : 1.0, // Higher quality for PNG
    bgcolor: '#ffffff',
    style: {
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      width: `${originalWidth}px`,
      height: `${originalHeight}px`,
      margin: '0',
      padding: '0',
      overflow: 'visible',
      fontFamily: 'sans-serif, Material Icons'
    },
    filter: (node: Node) => {
      // Skip hidden elements for better performance
      if (node instanceof HTMLElement) {
        return window.getComputedStyle(node).display !== 'none';
      }
      return true;
    },
  };

  // Create wrapper with proper dimensions
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'absolute',
    left: '0',
    top: '0',
    width: `${originalWidth}px`,
    height: `${originalHeight}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    overflow: 'visible'
  });

  // Clone and append the element
  wrapper.appendChild(element.cloneNode(true) as HTMLElement);

  try {
    return type === 'jpeg'
      ? await domtoimage.toJpeg(wrapper, options)
      : await domtoimage.toPng(wrapper, options);
  } finally {
    // Clean up if needed
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  }
}

public static async convertWithDomToImage(element: HTMLElement, type: 'png' | 'jpeg'): Promise<string> {
  const options = {
    width: element.scrollWidth,
    height: element.scrollHeight,
    quality: 0.95,
    bgcolor: '#ffffff',
    style: {
      
      margin: '0',
      padding: '0',
      overflow: 'visible',
      fontFamily: 'sans-serif, Material Icons' // Fallback fonts
    },
    filter: (node: Node) => {
      // Skip problematic nodes if needed
      return true;
    }
  };

  return type === 'jpeg'
    ? await domtoimage.toJpeg(element, options)
    : await domtoimage.toPng(element, options);
}


 static  async  convertToImage_old(element: HTMLElement, type: 'png' | 'jpeg' = 'jpeg'): Promise<string> {
    if (!element) throw new Error('Invalid element');

    const rect = element.getBoundingClientRect();
    element.style.boxShadow = 'none';
    element.style.animation = 'none';
    element.style.transition = 'none';
    return type === 'jpeg'
      ? await domtoimage.toJpeg(element,
       
        {  quality: 0.95,
          skipFonts: true ,
           width: rect.width,
        height:rect.height,
        filter: (node:any) => {
          // Optionally filter out problematic elements if needed
          return true;
        },
        // Optional workaround: manually clone inline styles only
        style: {
          fontFamily: 'Material Symbols Outlined'
        } })
      : await domtoimage.toPng(element);
  }

  static async  getImageSizeFromBase64(base64: string): Promise<{ width: number; height: number }> {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    return new Promise((resolve, reject) => {
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        reject(new Error('Failed to load base64 image.'));
      };

      img.src = base64;
    });
  }

}

export const TANK_STATUS_PRE_IN_YARD = [
  'SO_GENERATED',
  'IN_GATE',
]

export const TANK_STATUS_IN_YARD = [
  'IN_SURVEY',
  'STEAM',
  'RESIDUE',
  'CLEANING',
  'REPAIR',
  'STORAGE',
  'RO_GENERATED',
  'OUT_GATE',
  'OUT_SURVEY',
]

export const ESTIMATE_APPROVED_STATUS = ["QC_COMPLETE", "APPROVED", "COMPLETE","COMPLETED", "ASSIGNED", "JOB_IN_PROGRESS"];

export const TANK_STATUS_POST_IN_YARD = [
  'RELEASED',
]

export const BOOLEAN_YES_NO = [
  { value: true, label: 'Y' },
  { value: false, label: 'N' }
];

export const DEFAULT_COUNTRY_CODE = { country: 'Singapore', code: '+65', iso: 'sg', flagUrl: 'https://flagcdn.com/24x18/sg.png' };

export const pageSizeInfo = { pageSize: [25, 50, 75, 100], defaultSize: 25 };

export const maxLengthDisplaySingleSelectedItem = 45;

export const selected_job_task_color = "bg-lighter-orange";

export const unassigned_icon = "chip_extraction";

