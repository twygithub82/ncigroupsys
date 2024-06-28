import { formatDate } from "@angular/common";
import * as moment from "moment";

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

  static convertDateToStr(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  static convertDate(date: any): number | Date | undefined {
    // Check if the input is null or undefined
    if (!date) {
      return undefined;
    }

    // Check if the input is a Moment.js object and convert to epoch time
    if (moment.isMoment(date)) {
      return date.valueOf(); // valueOf() returns the number of milliseconds since epoch
    }

    // Check if the input is a JavaScript Date object and convert to epoch time
    if (date instanceof Date) {
      return date.getTime(); // getTime() returns the number of milliseconds since epoch
    }

    // If the input is a string that can be parsed as a date
    if (typeof date === 'string' && !isNaN(Date.parse(date))) {
      return new Date(date).getTime();
    }

    // If the input is a number, handle it as epoch time
    if (typeof date === 'number' && !isNaN(date)) {
      // Check if the number is more likely to be in seconds or milliseconds
      if (date.toString().length === 10) {
        // If it's in seconds, convert to milliseconds
        return new Date(date * 1000);
      } else if (date.toString().length === 13) {
        // If it's in milliseconds, just return the Date object
        return new Date(date);
      } else {
        console.error('Invalid epoch time format:', date);
        return undefined;
      }
    }

    // If the input is not a recognized date format, return undefined
    console.error('Invalid date format:', date);
    return undefined;
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

  static getDeleteDtEpoch(): number {
    const today = new Date();
    // Set the time to 00:00:00 to get the start of the day in epoch time
    today.setHours(0, 0, 0, 0);
    const epoch = today.getTime();
    return epoch;
  }
}
