import { CodeValuesItem } from "app/data-sources/code-values";
import { modulePackage } from "environments/environment";

export class BusinessLogicUtil {
    static isOthers(value: string | string[]): boolean {
        if (Array.isArray(value)) {
            return value.includes('OTHERS');
        } else {
            return value === 'OTHERS';
        }
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

    static isStarterPackage() {
        return modulePackage === "starter"
    }

    static isGrowthPackage() {
        return modulePackage === "growth"
    }

    static isCustomizedPackage() {
        return modulePackage === "customized"
    }

    static getModulePackage() {
        return modulePackage;
    }
}