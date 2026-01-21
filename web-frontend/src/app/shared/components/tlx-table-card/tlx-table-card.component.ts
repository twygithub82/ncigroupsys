import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnChanges, ContentChild, TemplateRef, HostListener, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'; // ✅ Import PageEvent

export interface TableColumn {
    key: string;
    header: string;
    width?: string;
    headerClass?: string;
    cellClass?: string;
}

export interface TableFooter {
    colspan?: number;
    content: string;
    class?: string;
}

export interface TableGroup {
    groupKey: string;
    groupLabel: string;
    items: any[];
    isExpanded?: boolean;
}

@Component({
    selector: 'tlx-table-card',
    standalone: true,
    imports: [
        CommonModule,
        MatPaginatorModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './tlx-table-card.component.html',
    styleUrl: './tlx-table-card.component.scss',
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('swipeAnimation', [
            transition(':increment', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
            ]),
            transition(':decrement', [
                style({ transform: 'translateX(-100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
            ]),
        ]),
        trigger('slideIn', [
            state('left', style({ transform: 'translateX(-100%)', opacity: 0 })),
            state('center', style({ transform: 'translateX(0)', opacity: 1 })),
            state('right', style({ transform: 'translateX(100%)', opacity: 0 })),
            transition('* => *', animate('300ms ease-out'))
        ])
    ]
})
export class TlxTableCardComponent implements OnChanges {
    @Input() items: any[] = [];
    @Input() columns: TableColumn[] = [];
    @Input() footers: TableFooter[] = [];
    @Input() groups: TableGroup[] = [];
    @Input() groupBy: string = '';
    @Input() colClass: string = 'col-12';
    @Input() rowLabel: string = 'Record';
    @Input() enableRowClick: boolean = true;
    @Input() enablePagination: boolean = false;
    @Input() pageSize: number = 25; // ✅ Changed default to match Material paginator
    @Input() enableSwipe: boolean = true;
    @Input() mobilePaginationMode: 'standard' | 'bullets' = 'standard';

    @Output() rowClick = new EventEmitter<{ item: any, index: number, group?: TableGroup }>();
    @Output() groupToggle = new EventEmitter<TableGroup>();
    @Output() pageChange = new EventEmitter<PageEvent>(); // ✅ Changed to PageEvent

    @ContentChild('rowTemplate') rowTemplate?: TemplateRef<any>;
    @ContentChild('mobileRowTemplate') mobileRowTemplate?: TemplateRef<any>;
    @ContentChild('footerTemplate') footerTemplate?: TemplateRef<any>;

    groupedData: TableGroup[] = [];
    hasData: boolean = false;
    currentPage: number = 0; // ✅ 0-based for Material paginator
    totalPages: number = 1;
    animationState: number = 0;

    private startX: number = 0;
    private isDragging: boolean = false;
    private swipeThreshold: number = 50;

    // ✅ Add getter for total count (needed by mat-paginator)
    get totalCount(): number {
        return this.groupedData.length > 0
            ? this.groupedData.reduce((sum, group) => sum + group.items.length, 0)
            : this.items.length;
    }

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnChanges() {
        this.hasData = this.items.length > 0 || this.groups.length > 0;

        if (this.groups.length > 0) {
            this.groupedData = this.groups;
        } else if (this.groupBy) {
            this.createGroups();
        } else {
            this.groupedData = [];
        }

        if (this.enablePagination) {
            this.calculateTotalPages();
        }
    }

    private createGroups(): void {
        const grouped = this.items.reduce((acc, item) => {
            const groupKey = this.getValue(item, this.groupBy);
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(item);
            return acc;
        }, {} as Record<string, any[]>);

        this.groupedData = Object.keys(grouped).map(key => ({
            groupKey: key,
            groupLabel: key,
            items: grouped[key],
            isExpanded: true
        }));
    }

    private calculateTotalPages(): void {
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    }

    getCurrentPageItems(): any[] {
        if (!this.enablePagination) return this.items;
        const start = this.currentPage * this.pageSize;
        const end = start + this.pageSize;
        return this.items.slice(start, end);
    }

    getCurrentPageGroups(): TableGroup[] {
        if (!this.enablePagination) return this.groupedData;
        const start = this.currentPage * this.pageSize;
        const end = start + this.pageSize;

        return this.groupedData.map(group => ({
            ...group,
            items: group.items.slice(start, end)
        })).filter(group => group.items.length > 0);
    }

    // ✅ NEW: Handle Material Paginator events
    onPageChange(event: PageEvent): void {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.calculateTotalPages();
        this.pageChange.emit(event); // ✅ Emit PageEvent to parent
        this.cdr.markForCheck();
    }

    // ✅ KEEP these for swipe functionality
    nextPage(): void {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.animationState++;
            // Emit PageEvent format for consistency
            this.pageChange.emit({
                pageIndex: this.currentPage,
                pageSize: this.pageSize,
                length: this.totalCount
            } as PageEvent);
            this.cdr.markForCheck();
        }
    }

    previousPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.animationState--;
            // Emit PageEvent format for consistency
            this.pageChange.emit({
                pageIndex: this.currentPage,
                pageSize: this.pageSize,
                length: this.totalCount
            } as PageEvent);
            this.cdr.markForCheck();
        }
    }

    onTouchStart(event: TouchEvent): void {
        if (!this.enableSwipe || !this.enablePagination) return;
        this.startX = event.touches[0].clientX;
        this.isDragging = true;
    }

    onTouchMove(event: TouchEvent): void {
        if (!this.enableSwipe || !this.isDragging || !this.enablePagination) return;

        const currentX = event.touches[0].clientX;
        const diff = Math.abs(currentX - this.startX);

        if (event.cancelable && diff > 10) {
            event.preventDefault();
        }
    }

    onTouchEnd(event: TouchEvent): void {
        if (!this.enableSwipe || !this.isDragging || !this.enablePagination) return;

        const endX = event.changedTouches[0].clientX;
        const deltaX = this.startX - endX;

        if (Math.abs(deltaX) > this.swipeThreshold) {
            if (deltaX > 0) {
                this.nextPage();
            } else {
                this.previousPage();
            }
        }

        this.isDragging = false;
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.enableSwipe || !this.enablePagination) return;
        this.startX = event.clientX;
        this.isDragging = true;
        event.preventDefault();
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.enableSwipe || !this.isDragging || !this.enablePagination) return;
        event.preventDefault();
    }

    onMouseEnd(event: MouseEvent): void {
        if (!this.enableSwipe || !this.isDragging || !this.enablePagination) return;

        const endX = event.clientX;
        const deltaX = this.startX - endX;

        if (Math.abs(deltaX) > this.swipeThreshold) {
            if (deltaX > 0) {
                this.nextPage();
            } else {
                this.previousPage();
            }
        }

        this.isDragging = false;
    }

    getValue(item: any, key: string): any {
        return key.split('.').reduce((obj, prop) => obj?.[prop], item) || '';
    }

    onRowClick(item: any, index: number, group?: TableGroup): void {
        if (this.enableRowClick) {
            this.rowClick.emit({ item, index, group });
        }
    }

    toggleGroup(group: TableGroup): void {
        group.isExpanded = !group.isExpanded;
        this.groupToggle.emit(group);
        this.cdr.markForCheck();
    }

    getPageArray(): number[] {
        const maxDots = 7; // Show max 7 dots
        const pages: number[] = [];

        if (this.totalPages <= maxDots) {
            // Show all if total pages is small
            return Array.from({ length: this.totalPages }, (_, i) => i);
        }

        // Always show first page
        pages.push(0);

        // Calculate range around current page
        let startPage = Math.max(1, this.currentPage - 1);
        let endPage = Math.min(this.totalPages - 2, this.currentPage + 1);

        // Add ellipsis indicator (use -1 as marker)
        if (startPage > 1) {
            pages.push(-1); // ellipsis before
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis indicator
        if (endPage < this.totalPages - 2) {
            pages.push(-2); // ellipsis after
        }

        // Always show last page
        pages.push(this.totalPages - 1);

        return pages;
    }

    goToPage(pageIndex: number): void {
        if (pageIndex >= 0 && pageIndex < this.totalPages) {
            this.currentPage = pageIndex;
            this.pageChange.emit({
                pageIndex: this.currentPage,
                pageSize: this.pageSize,
                length: this.totalCount
            } as PageEvent);
            this.cdr.markForCheck(); // ✅ Add this for consistency with your other page methods
        }
    }
}