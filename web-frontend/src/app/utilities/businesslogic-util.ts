import { CodeValuesItem } from "app/data-sources/code-values";
import { RepairPartItem } from "app/data-sources/repair-part";
import { RPDamageRepairItem } from "app/data-sources/rp-damage-repair";
import { modulePackage } from "environments/environment";
import { Utility } from "./utility";

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

    static getNatureInGateAlert(nature: string | undefined, in_gate_alert: string | undefined) {
        if (nature && in_gate_alert)
            return `${nature} - ${in_gate_alert}`;
        return '';
    }

    static getTestTypeMapping(test_type: string | undefined): string {
        if (test_type === '5') return '2.5';
        if (test_type === '2.5') return '5';
        return '';
    }

    static getSaveDescription(guid: string | undefined) {
        return guid ? `COMMON-FORM.SAVE` : 'COMMON-FORM.UPDATE';
    }

    static displayApproveQty(rep: RepairPartItem) {
        return (rep.approve_part ?? !this.is4X(rep.rp_damage_repair)) ? (rep.approve_qty !== null && rep.approve_qty !== undefined ? rep.approve_qty : rep.quantity) : 0;
    }

    static displayApproveHour(rep: RepairPartItem) {
        return (rep.approve_part ?? !this.is4X(rep.rp_damage_repair)) ? (rep.approve_hour !== null && rep.approve_hour !== undefined ? rep.approve_hour : rep.hour) : 0;
    }

    static displayApproveCost(rep: RepairPartItem) {
        return Utility.convertNumber((rep.approve_part ?? !this.is4X(rep.rp_damage_repair)) ? (rep.approve_cost !== null && rep.approve_cost !== undefined ? rep.approve_cost : rep.material_cost) : 0, 2);
    }

    static is4X(rpDmgRepair: RPDamageRepairItem[] | undefined): boolean | undefined {
        return rpDmgRepair && rpDmgRepair.some((item: RPDamageRepairItem) => !item.delete_dt && item.code_type === 1 && item.code_cv?.toLowerCase() === '4x'.toLowerCase());
    }

    static defaultCodeValue(defaultDescription: string) {
        return new CodeValuesItem({
            guid: '',
            description: defaultDescription,
            code_val_type: '',
            code_val: '',
            child_code: '',
            sequence: -1,
            create_by: ';',
            update_by: ';'
        });
    }

    static findCodeValue(codeVal: string | undefined, codeValItem: CodeValuesItem[]): CodeValuesItem | undefined {
        return codeValItem.find(cv => cv.code_val === codeVal);
    }
}