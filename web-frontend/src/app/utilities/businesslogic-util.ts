import { CodeValuesItem } from "app/data-sources/code-values";
import { RepairPartItem } from "app/data-sources/repair-part";
import { RPDamageRepairItem } from "app/data-sources/rp-damage-repair";
import { modulePackage } from "environments/environment";
import { ESTIMATE_APPROVED_STATUS, Utility } from "./utility";
import { SurveyDetailItem } from "app/data-sources/survey-detail";
import { UntypedFormGroup } from "@angular/forms";
import { ResidueItem } from "app/data-sources/residue";
import { BillingStorageDetail } from "app/data-sources/billing";

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
        if (!row) return false;
        return row?.create_by == 'system';
    }

    static isEstimateApproved(row: any) {
        if (!row) return false;
        return ESTIMATE_APPROVED_STATUS.includes(row.status_cv);
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

    static getNextTestYear(test_type: string | undefined): number {
        const match = test_type?.match(/^[0-9]*\.?[0-9]+/);
        return 2.5;// parseFloat(match?.[0] ?? "0");
    }

    static getSaveDescription(guid: string | undefined) {
        return guid ? `COMMON-FORM.SAVE` : 'COMMON-FORM.UPDATE';
    }

    static getLastLocation(sot: any, ig: any, tank_info: any, transfer?: any[]) {
        if (sot?.tank_status_cv === 'RELEASED') {
            if (transfer?.length) {
                return this.getLatestTransfer(transfer)?.location_to_cv;
            } else {
                return ig?.yard_cv;
            }
        } else {
            return tank_info?.yard_cv;
        }
    }

    static getLatestTransfer(transfers: any[]) {
        return transfers
            .filter(t => t.transfer_in_dt != null) // exclude null/undefined
            .slice()
            .sort((a, b) => {
                if (a.transfer_in_dt !== b.transfer_in_dt) {
                    return b.transfer_in_dt - a.transfer_in_dt;
                }
                return (b.create_dt ?? 0) - (a.create_dt ?? 0);
            })[0];
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

    static defaultCodeValue(defaultDescription: string, defaultVal: string) {
        return new CodeValuesItem({
            guid: '',
            description: defaultDescription,
            code_val_type: '',
            code_val: defaultVal,
            child_code: '',
            sequence: -1,
            create_by: ';',
            update_by: ';'
        });
    }

    static findCodeValue(codeVal: string | undefined, codeValItem: CodeValuesItem[]): CodeValuesItem | undefined {
        return codeValItem.find(cv => cv.code_val === codeVal);
    }

    static emptyCompareWith(o1: any, o2: any): boolean {
        return (o1?.code_val ?? '') === (o2?.code_val ?? '');
    }

    static shouldUpdateLastTestDt(currentSurveyDetailItem: SurveyDetailItem, latestSurveyDetailItem?: SurveyDetailItem[]): { needUpdate: boolean; latestItem: SurveyDetailItem | null } {
        if (!currentSurveyDetailItem || currentSurveyDetailItem.status_cv !== 'ACCEPTED') {
            return { needUpdate: false, latestItem: null };
        }

        // If list is empty, update is definitely needed
        if (!latestSurveyDetailItem?.length) {
            return { needUpdate: true, latestItem: currentSurveyDetailItem };
        }

        // Filter out invalid survey_dt
        const validItems = latestSurveyDetailItem.filter(
            item => typeof item.survey_dt === 'number' && isFinite(item.survey_dt)
        );

        // Check if current is already in the list
        const isCurrentLatestInList = validItems.length > 0
            ? currentSurveyDetailItem.guid === validItems.reduce((latest, item) =>
                !latest || item.survey_dt! > latest.survey_dt! ? item : latest,
                null as SurveyDetailItem | null
            )?.guid
            : false;

        // Filter out current item from comparison
        const filteredItems = validItems.filter(item => item.guid !== currentSurveyDetailItem.guid);

        // Combine current with remaining list to find latest
        const allItems = [...filteredItems, currentSurveyDetailItem];
        const latestItem = allItems.reduce((latest, item) =>
            !latest || item.survey_dt! > latest.survey_dt! ? item : latest,
            null as SurveyDetailItem | null
        );

        const needUpdate = isCurrentLatestInList
            ? true
            : latestItem?.guid === currentSurveyDetailItem.guid;

        return {
            needUpdate,
            latestItem
        };
    }

    static validateAllControlsRaw(form: UntypedFormGroup): boolean {
        let isValid = true;

        Object.keys(form.controls).forEach(key => {
            const control = form.controls[key];

            const errors = control.validator?.(control);
            if (errors) {
                control.setErrors(errors); // Manually apply error
                isValid = false;
            }
        });

        return isValid;
    }

    static anyActiveResidues(residue?: ResidueItem[]) {
        if (!residue?.length) return false;
        return residue.some(res => res.status_cv === 'PENDING' && !res.delete_dt);
    }

    static sumOfStorageDetails(storageDetails?: BillingStorageDetail[]) {
        return storageDetails?.reduce((sum, detail) => sum + (detail.total_cost ?? 0), 0) ?? 0;
    }
}