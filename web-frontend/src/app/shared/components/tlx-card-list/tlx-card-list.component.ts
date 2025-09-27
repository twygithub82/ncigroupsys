import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/animations';
import { MatRippleModule } from '@angular/material/core';

@Component({
    selector: 'tlx-card-list',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatRippleModule,
    ],
    animations: [
        trigger('expandCollapse', [
            transition(':enter', [
                style({ height: '0', opacity: 0, overflow: 'hidden' }),
                animate('250ms ease-out', style({ height: '*', opacity: 1 }))
            ]),
            transition(':leave', [
                style({ height: '*', opacity: 1, overflow: 'hidden' }),
                animate('250ms ease-in', style({ height: '0', opacity: 0 }))
            ])
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './tlx-card-list.component.html',
    styleUrls: ['./tlx-card-list.component.scss'],
})
export class TlxCardListComponent {
    @Input() items: any[] = [];
    @Input() colClass: string = 'col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12';
    @ContentChild('cardTemplate') cardTemplate!: TemplateRef<any>;
    @ContentChild('expandedTemplate') expandedTemplate?: TemplateRef<any>;

    expandedItems: Set<number> = new Set();

    toggleExpanded(itemId: number) {
        if (this.expandedItems.has(itemId)) {
            this.expandedItems.delete(itemId);
        } else {
            this.expandedItems.add(itemId);
        }
    }

    isExpanded(itemId: number): boolean {
        return this.expandedItems.has(itemId);
    }

    resetExpanded() {
        this.expandedItems.clear();
    }
}