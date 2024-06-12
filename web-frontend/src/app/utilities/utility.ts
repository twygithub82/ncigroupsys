export class Utility {
    static formatString(template: string, ...values: any[]): string {
        return template.replace(/{(\d+)}/g, (match, index) => {
            return typeof values[index] !== 'undefined' ? values[index] : match;
        });
    }

    static addDefaultSelectOption(list: Array<any>, desc: string = 'Select an option', val: string = '0') {
        // Create the default option object
        const defaultOption = { description: desc, value: val };

        // Add the default option at the top of the list
        list.unshift(defaultOption);
    }

    static generateGUIDWithoutHyphens(): string {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}
