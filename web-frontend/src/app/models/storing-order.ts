import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { AdvanceTable } from 'app/advance-table/advance-table.model';
import { Utility } from 'app/utilities/utility';
import { Observable } from 'rxjs';
export class StoringOrderModel extends DataSource<AdvanceTable> {
    override connect(collectionViewer: CollectionViewer): Observable<readonly AdvanceTable[]> {
        throw new Error('Method not implemented.');
    }
    override disconnect(collectionViewer: CollectionViewer): void {
        throw new Error('Method not implemented.');
    }
    guid: string;
    customer_company_guid: string;
    so_notes: string;
    so_no: string;
    contact_person_guid: string;
    haulier: string;
    create_dt: number;
    create_by: string;
    update_dt: number;
    update_by: string;
    delete_dt: number;
    constructor(storingOrder: StoringOrderModel) {
    super();
        {
            this.guid = storingOrder.guid || Utility.generateGUIDWithoutHyphens();
            this.customer_company_guid = storingOrder.customer_company_guid || '';
            this.so_notes = storingOrder.so_notes || '';
            this.so_no = storingOrder.so_no || '';
            this.contact_person_guid = storingOrder.contact_person_guid || '';
            this.haulier = storingOrder.haulier || '';
            this.delete_dt = storingOrder.delete_dt || 0;
            this.create_dt = storingOrder.create_dt || 0;
            this.create_by = storingOrder.create_by || '';
            this.update_dt = storingOrder.update_dt || 0;
            this.update_by = storingOrder.update_by || '';
        }
    }
}
