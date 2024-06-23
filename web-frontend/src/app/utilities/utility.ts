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
    
    static convertToEpoch(date: any): number | undefined {
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
    
        // If the input is not a recognized date format, return null
        console.error('Invalid date format:', date);
        return undefined;
      }
}
