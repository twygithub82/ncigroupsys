import { CodeValuesItem } from "app/data-sources/code-values";

export class BusinessLogicUtil {
    static isOthers(value: string): boolean {
        return value === 'OTHERS';
    }

    static getCodeDescription(codeValType: string | undefined, codeValItem: CodeValuesItem[]): string | undefined {
        let cv = codeValItem?.filter(cv => cv.code_val === codeValType);
        if (cv?.length) {
            return cv[0].description;
        }
        return '';
    }

    static displayName(cc: any): string {
        return cc?.code ? (cc?.name ? `${cc.code} (${cc.name})` : `${cc.code}`) : '';
    }

    static isAutoApproveSteaming(row: any) {
        return row?.estimate_no?.startsWith('SE');
    }
}