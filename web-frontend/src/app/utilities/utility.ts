import { TranslateService } from "@ngx-translate/core";
import { StoringOrderTankItem } from "app/data-sources/storing-order-tank";
import { customerInfo } from 'environments/environment';
import { jsPDF } from 'jspdf';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
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
    const cleaned = containerNumber.replace(/\s|-/g, '').toUpperCase();
  
    if (cleaned.length !== 11) {
      return containerNumber.toUpperCase();
    }
  
    const ownerCode = cleaned.slice(0, 4);
    const serialNumber = cleaned.slice(4, 10);
    const checkDigit = cleaned.slice(10);
  
    return `${ownerCode} ${serialNumber}-${checkDigit}`;
  }

  static formatTankNumberForSearch(tankNumber: string): string {
    if (!tankNumber) return '';

    const serialNumber = tankNumber.slice(0, -1); // everything except last char
    const checkDigit = tankNumber.slice(-1); // last char

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

  static onAlphaOnly(event: Event, form: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z]/g, '');
    form?.setValue(input.value, { emitEvent: false });
  }

  static onAlphaNumericOnly(event: Event, form: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, ''); // Allow letters and digits only
    form?.setValue(input.value, { emitEvent: false });
  }

  static getCountryCodes(orderBy: 'country' | 'code' = 'country') {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return getCountries()
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

  static addText(pdf: jsPDF, content: string, topPos: number, leftPost: number, fontSize: number) {
    pdf.setFontSize(fontSize); // Title font size 
    pdf.text(content, leftPost, topPos); // Position it at the top
  }

  static addReportTitle(pdf: jsPDF, title: string, pageWidth: number, leftMargin: number, rightMargin: number, topPosition: number) {
    pdf.setFontSize(14); // Title font size 
    const titleWidth = pdf.getStringUnitWidth(title) * pdf.getFontSize() / pdf.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2; // Centering the title

    pdf.text(title, titleX, topPosition); // Position it at the top

    pdf.setLineDashPattern([0, 0], 0);
    // Draw underline for the title
    pdf.setLineWidth(0.1); // Set line width for underline
    pdf.line(titleX, topPosition + 2, titleX + titleWidth + 1, topPosition + 2); // Draw the line under the title
  }

  static AddTextAtRightCornerPage(pdf: jsPDF, text: string, pageWidth: number, leftMargin: number, rightMargin: number, topPosition: number, fontSize: number) {
    pdf.setFontSize(fontSize); // Title font size 
    const titleWidth = pdf.getStringUnitWidth(text) * pdf.getFontSize() / pdf.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) - rightMargin; // Centering the title

    pdf.text(text, titleX, topPosition); // Position it at the top

    // pdf.setLineDashPattern([0, 0], 0);
    // Draw underline for the title
    // pdf.setLineWidth(0.1); // Set line width for underline
    // pdf.line(titleX, topPosition+2, titleX + titleWidth, topPosition+2); // Draw the line under the title
  }

  static AddTextAtCenterPage(pdf: jsPDF, text: string, pageWidth: number, leftMargin: number, rightMargin: number, topPosition: number, fontSize: number) {
    pdf.setFontSize(fontSize); // Title font size 
    const titleWidth = pdf.getStringUnitWidth(text) * pdf.getFontSize() / pdf.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2; // Centering the title

    pdf.text(text, titleX, topPosition); // Position it at the top

    // pdf.setLineDashPattern([0, 0], 0);
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


    // pdf.setLineDashPattern([0, 0], 0);
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

    // Try opening in a new window
    const newWindow = window.open(blobUrl, '_blank');

    if (!newWindow) {
      pdf.save(fileName);
    } else {
      // Cleanup the URL after some time
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 10000); // Increased delay to ensure the PDF loads
    }
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

    const translatedLangText: any = {};
    const langText = {
      PHONE: 'COMMON-FORM.PHONE',
      FAX: 'COMMON-FORM.FAX',
      WEB: 'COMMON-FORM.WEB',
      CRN: 'COMMON-FORM.CRN',
    };

    // Translate each key in langText
    for (const key of Object.keys(langText) as (keyof typeof langText)[]) {
      try {
        translatedLangText[key] = await translateService.get(langText[key]).toPromise();
      } catch (error) {
        console.error(`Error translating key "${key}":`, error);
        translatedLangText[key] = langText[key]; // Fallback to the original key
      }
    }

    pdf.setLineWidth(0.1);
    // Set dashed line pattern
    pdf.setLineDashPattern([1, 1], 0.5);

    // Draw top line
    pdf.line(leftMargin, topMargin, (pageWidth - rightMargin), topMargin);

    // Define header height
    const heightHeader: number = 28;

    // Draw bottom line
    pdf.line(leftMargin, topMargin + heightHeader, (pageWidth - rightMargin), topMargin + heightHeader);

    // Add company name
    pdf.setFontSize(18);
    const companyNameWidth = pdf.getStringUnitWidth(customerInfo.companyName) * pdf.getFontSize();
    let posX = pageWidth / 1.75;
    let posY = topMargin + 8;
    pdf.text(customerInfo.companyName, posX, posY);

    // Add company address
    pdf.setFontSize(10);
    posX -= 5;
    posY += 7;
    pdf.text(customerInfo.companyAddress, posX, posY);

    // Add phone, fax, and website
    let nextLine = `${translatedLangText.PHONE}:${customerInfo.companyPhone} ${translatedLangText.FAX}:${customerInfo.companyFax} ${translatedLangText.WEB}:${customerInfo.companyWebsite}`;
    posX -= 20;
    posY += 5;
    pdf.text(nextLine, posX, posY);

    // Add company UEN
    nextLine = `${translatedLangText.CRN}:${customerInfo.companyUen}`;
    posX += 35;
    posY += 5;
    pdf.text(nextLine, posX, posY);

    // Load and add company logo
    const imgUrl = "assets/images/logo.png";
    const img = new Image();

    // Wait for the image to load
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imgUrl;
    });

    // Add the image to the PDF
    const posX1_img = leftMargin + 5;
    const posY1_img = topMargin + 10;
    const imgHeight = heightHeader - 21;
    const imgWidth = 60;
    pdf.addImage(img, 'JPEG', posX1_img, posY1_img, imgWidth, imgHeight); // (imageElement, format, x, y, width, height)
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

    const translatedLangText: any = {};
    const langText = {
      PHONE: 'COMMON-FORM.PHONE',
      FAX: 'COMMON-FORM.FAX',
      WEB: 'COMMON-FORM.WEB',
      CRN: 'COMMON-FORM.CRN',
    };

    // Translate each key in langText
    for (const key of Object.keys(langText) as (keyof typeof langText)[]) {
      try {
        translatedLangText[key] = await translateService.get(langText[key]).toPromise();
      } catch (error) {
        console.error(`Error translating key "${key}":`, error);
        translatedLangText[key] = langText[key]; // Fallback to the original key
      }
    }
    pdf.setLineWidth(0.1);
    // Set dashed line pattern
    pdf.setLineDashPattern([1, 1], 0.5);

    // Draw top line
    pdf.line(leftMargin, topMargin, (pageWidth - rightMargin), topMargin);

    // Define header height
    const heightHeader: number = 28;

    // Draw bottom line
    pdf.line(leftMargin, topMargin + heightHeader, (pageWidth - rightMargin), topMargin + heightHeader);

    // Add company name
    pdf.setFontSize(18);
    const companyNameWidth = pdf.getStringUnitWidth(customerInfo.companyName) * pdf.getFontSize();
    let posX = pageWidth / 2.4;
    let posY = topMargin + 8;
    pdf.text(customerInfo.companyName, posX, posY);

    // Add company address
    pdf.setFontSize(10);
    posX -= 5;
    posY += 7;
    pdf.text(customerInfo.companyAddress, posX, posY);

    // Add phone, fax, and website
    let nextLine = `${translatedLangText.PHONE}:${customerInfo.companyPhone} ${translatedLangText.FAX}:${customerInfo.companyFax} ${translatedLangText.WEB}:${customerInfo.companyWebsite}`;
    posX -= 20;
    posY += 5;
    pdf.text(nextLine, posX, posY);

    // Add company UEN
    nextLine = `${translatedLangText.CRN}:${customerInfo.companyUen}`;
    posX += 35;
    posY += 5;
    pdf.text(nextLine, posX, posY);

    // Load and add company logo
    const imgUrl = "assets/images/logo.png";
    const img = new Image();

    // Wait for the image to load
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imgUrl;
    });

    // Add the image to the PDF
    const posX1_img = leftMargin + 5;
    const posY1_img = topMargin + 10;
    const imgHeight = heightHeader - 21;
    const imgWidth = 60;
    pdf.addImage(img, 'JPEG', posX1_img, posY1_img, imgWidth, imgHeight); // (imageElement, format, x, y, width, height)
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

export const TANK_STATUS_POST_IN_YARD = [
  'RELEASED',
]

export const BOOLEAN_YES_NO = [
  { value: true, label: 'Y' },
  { value: false, label: 'N' }
];

export const DEFAULT_COUNTRY_CODE = { country: 'Singapore', code: '+65', iso: 'sg', flagUrl: 'https://flagcdn.com/24x18/sg.png' };