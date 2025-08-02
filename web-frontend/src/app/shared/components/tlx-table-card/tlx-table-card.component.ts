
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, ContentChild, TemplateRef } from '@angular/core';

export interface TableColumn {
    key: string;
    header: string;
}

@Component({
    selector: 'tlx-table-card',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './tlx-table-card.component.html',
    styleUrl: './tlx-table-card.component.scss'
})
export class TlxTableCardComponent implements OnChanges {
    @Input() items: any[] = [];
    @Input() columns: TableColumn[] = [];
    @Input() colClass: string = 'col-12';
    @Input() rowLabel: string = 'Record';
    @ContentChild('rowTemplate') rowTemplate?: TemplateRef<any>;
    @ContentChild('mobileRowTemplate') mobileRowTemplate?: TemplateRef<any>;

    processedItems: any[][] = [];

    ngOnChanges() {
        if (!this.rowTemplate && !this.mobileRowTemplate) {
            this.processedItems = this.items.map(item =>
                this.columns.map(col => this.getValue(item, col.key))
            );
        }
    }

    private getValue(item: any, key: string): any {
        return key.split('.').reduce((obj, prop) => obj?.[prop], item) || '';
    }
}