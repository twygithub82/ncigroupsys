export class Utility {
    static formatString(template: string, ...values: any[]): string {
        return template.replace(/{(\d+)}/g, (match, index) => {
            return typeof values[index] !== 'undefined' ? values[index] : match;
        });
    }
}
