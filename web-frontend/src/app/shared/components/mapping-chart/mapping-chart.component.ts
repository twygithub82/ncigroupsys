// mapping-chart.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateService } from '@ngx-translate/core';
import { Utility } from 'app/utilities/utility';
import { InspectionType } from 'app/data-sources/inspections';

export type MarkStyle =
    | { type: 'color'; value: string }
    | { type: 'image'; value: string }
    | { type: 'shape'; shape: 'circle' | 'triangle' | 'square' | 'cross' | 'diagonal'; color: string };

export interface MarkType {
    id: string;
    name: string;
    style: MarkStyle;
}

export interface CellMark {
    typeId?: string;
    inspectionType?: string;
    color?: string;
    shape?: 'circle' | 'square' | 'triangle' | 'cross' | 'diagonal';
    style?: MarkStyle;
    timestamp?: number;
    surface?: string;
    position?: string;
}

@Component({
    selector: 'app-mapping-chart',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatInputModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './mapping-chart.component.html',
    styleUrl: './mapping-chart.component.scss',
})
export class MappingChartComponent implements OnInit, OnChanges {
    @Input() gridRows: number = 11;
    @Input() gridCols: number = 11;
    @Input() disabledCells: number[] = [];
    @Input() showGrid: boolean = true;
    @Input() readonly: boolean = false;
    @Input() selectedInspectionType?: InspectionType; // NEW: Selected type from legend
    @Input() circularMarkedSections: Map<string, Map<string, CellMark>> = new Map([
        ['front', new Map<string, CellMark>()],
        ['rear', new Map<string, CellMark>()]
    ]);
    @Input() markedCells: Map<number, CellMark> = new Map();
    @Input() disabledCircularSections: { front: string[], rear: string[] } = { front: [], rear: [] };

    @Output() cellMarked = new EventEmitter<{ index: number, mark: CellMark }>();
    @Output() circularSectionMarked = new EventEmitter<{ surface: string, section: string, mark: CellMark }>();

    imageUrl: string = '../../../../assets/images/idms/mapping-chart/tank.png';
    cells: number[] = [];
    private isDrawing = false;
    private drawMode: 'mark' | 'unmark' = 'mark';

    constructor(
        private cdr: ChangeDetectorRef,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.initializeCells();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['gridRows'] || changes['gridCols']) {
            this.initializeCells();
        }
    }

    private initializeCells() {
        const totalCells = this.gridRows * this.gridCols;
        this.cells = Array(totalCells).fill(0).map((_, i) => i);
    }

    isDisabledCell(index: number): boolean {
        return this.disabledCells.includes(index);
    }

    isCellMarked(index: number): boolean {
        return this.markedCells.has(index);
    }

    getCellMark(index: number): CellMark | undefined {
        return this.markedCells.get(index);
    }

    getCellBackgroundStyle(index: number): any {
        const mark = this.markedCells.get(index);
        if (!mark || !mark.style) return {};

        switch (mark.style.type) {
            case 'color':
                return { 'background-color': mark.style.value };
            case 'image':
                return {
                    'background-image': `url(${mark.style.value})`,
                    'background-size': 'contain',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center'
                };
            case 'shape':
                return {};
            default:
                return {};
        }
    }

    getShapeClass(index: number): string {
        const mark = this.markedCells.get(index);
        if (!mark || !mark.style || mark.style.type !== 'shape') return '';
        return mark.style.shape;
    }

    getShapeColor(index: number): string {
        const mark = this.markedCells.get(index);
        if (!mark || !mark.style || mark.style.type !== 'shape') return '';
        return mark.style.color;
    }

    startDrawing(event: MouseEvent | TouchEvent) {
        if (this.readonly || !this.selectedInspectionType) return;

        event.preventDefault();

        const target = this.getCellFromEvent(event);
        if (target) {
            const index = parseInt(target.getAttribute('data-index') || '-1');
            if (index !== -1 && !this.isDisabledCell(index)) {
                const existingMark = this.markedCells.get(index);
                // Unmark if same type, otherwise mark with new type
                if (existingMark && existingMark.inspectionType === this.selectedInspectionType.type) {
                    this.drawMode = 'unmark';
                } else {
                    this.drawMode = 'mark';
                }
            }
        }

        this.isDrawing = true;
        this.markCell(event);
    }

    draw(event: MouseEvent | TouchEvent) {
        if (!this.isDrawing || this.readonly) return;
        event.preventDefault();
        this.markCell(event);
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    private markCell(event: MouseEvent | TouchEvent) {
        if (!this.selectedInspectionType) return;

        const target = this.getCellFromEvent(event);
        if (!target) return;

        const index = parseInt(target.getAttribute('data-index') || '-1');
        if (index === -1 || this.isDisabledCell(index)) return;

        if (this.drawMode === 'mark') {
            const mark: CellMark = {
                typeId: this.selectedInspectionType.type,
                inspectionType: this.selectedInspectionType.type,
                color: this.selectedInspectionType.color,
                shape: this.selectedInspectionType.shape,
                style: {
                    type: 'shape',
                    shape: this.selectedInspectionType.shape,
                    color: this.selectedInspectionType.color
                },
                timestamp: Date.now(),
                surface: 'tank',
                position: index.toString()
            };

            this.markedCells.set(index, mark);
            this.cellMarked.emit({ index, mark });
            console.log('Marked cell', index, 'with type:', this.selectedInspectionType.type);
        } else if (this.drawMode === 'unmark') {
            const existingMark = this.markedCells.get(index);
            if (existingMark && existingMark.inspectionType === this.selectedInspectionType.type) {
                this.markedCells.delete(index);
                console.log('Unmarked cell', index);
            }
        }

        this.cdr.markForCheck();
    }

    private getCellFromEvent(event: MouseEvent | TouchEvent): HTMLElement | null {
        let clientX: number, clientY: number;

        if (event instanceof MouseEvent) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else {
            const touch = event.touches[0] || event.changedTouches[0];
            if (!touch) return null;
            clientX = touch.clientX;
            clientY = touch.clientY;
        }

        const element = document.elementFromPoint(clientX, clientY) as HTMLElement;
        if (element && element.hasAttribute('data-index')) {
            return element;
        }
        return null;
    }

    // Circular section methods
    getArcPath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
        const start = this.polarToCartesian(cx, cy, radius, endAngle);
        const end = this.polarToCartesian(cx, cy, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        return [
            'M', cx, cy,
            'L', start.x, start.y,
            'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            'Z'
        ].join(' ');
    }

    getRingArcPath(cx: number, cy: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number): string {
        const outerStart = this.polarToCartesian(cx, cy, outerRadius, endAngle);
        const outerEnd = this.polarToCartesian(cx, cy, outerRadius, startAngle);
        const innerStart = this.polarToCartesian(cx, cy, innerRadius, endAngle);
        const innerEnd = this.polarToCartesian(cx, cy, innerRadius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        return [
            'M', outerStart.x, outerStart.y,
            'A', outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
            'L', innerEnd.x, innerEnd.y,
            'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
            'Z'
        ].join(' ');
    }

    private polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: cx + (radius * Math.cos(angleInRadians)),
            y: cy + (radius * Math.sin(angleInRadians))
        };
    }

    isCircularSectionMarked(view: 'front' | 'rear', section: string): boolean {
        return this.circularMarkedSections.get(view)?.has(section) || false;
    }

    isCircularSectionDisabled(view: 'front' | 'rear', section: string): boolean {
        return this.disabledCircularSections[view].includes(section);
    }

    getCircularSectionColor(view: 'front' | 'rear', section: string): string {
        const mark = this.circularMarkedSections.get(view)?.get(section);
        if (!mark) return 'rgba(200, 200, 200, 0.15)';

        if (mark.style) {
            if (mark.style.type === 'color') {
                return mark.style.value;
            } else if (mark.style.type === 'shape') {
                return mark.style.color;
            }
        }

        return mark.color || 'rgba(200, 200, 200, 0.15)';
    }

    onCircularSectionClick(view: 'front' | 'rear', section: string, event: MouseEvent | TouchEvent) {
        if (this.readonly || !this.selectedInspectionType) return;
        if (this.isCircularSectionDisabled(view, section)) return;

        event.preventDefault();
        event.stopPropagation();

        const viewMap = this.circularMarkedSections.get(view)!;
        const existingMark = viewMap.get(section);

        // Toggle: if same type, unmark; otherwise, mark with current type
        if (existingMark && existingMark.inspectionType === this.selectedInspectionType.type) {
            viewMap.delete(section);
            console.log(`Unmarked ${view} section ${section}`);
        } else {
            const mark: CellMark = {
                typeId: this.selectedInspectionType.type,
                inspectionType: this.selectedInspectionType.type,
                color: this.selectedInspectionType.color,
                shape: this.selectedInspectionType.shape,
                style: {
                    type: 'shape',
                    shape: this.selectedInspectionType.shape,
                    color: this.selectedInspectionType.color
                },
                timestamp: Date.now(),
                surface: view,
                position: section
            };

            viewMap.set(section, mark);
            this.circularSectionMarked.emit({ surface: view, section, mark });
            console.log(`Marked ${view} section ${section} with type:`, this.selectedInspectionType.type);
        }

        this.cdr.markForCheck();
    }

    clearAll() {
        this.markedCells.clear();
        this.cdr.markForCheck();
    }

    clearAllCircular() {
        this.circularMarkedSections.get('front')?.clear();
        this.circularMarkedSections.get('rear')?.clear();
        this.cdr.markForCheck();
    }
}