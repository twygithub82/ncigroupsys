import {
    Directive,
    Host,
    HostListener,
    OnInit,
} from '@angular/core';
import {
    MatButtonToggleChange,
    MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[exclusiveToggle]',
    standalone: true,
})
export class ExclusiveToggleDirective implements OnInit {
    private lastClickedValue: string | null = null;

    constructor(
        @Host() private toggleGroup: MatButtonToggleGroup,
        private ngControl: NgControl
    ) {
    }

    ngOnInit(): void {
        this.toggleGroup.multiple = true;
        const control = this.ngControl.control;

        if (control && control.value) {
            if (Array.isArray(control.value)) {
                this.lastClickedValue = control.value[0]
            } else {
                this.lastClickedValue = control.value
            }
        }

        this.toggleGroup.change.subscribe(() => {
            const control = this.ngControl.control;
            if (!control || this.lastClickedValue === null) return;

            const currentValue: string[] = control.value || [];

            if (currentValue.length === 1 && currentValue[0] === this.lastClickedValue) {
                control.setValue([]); // unselect
            } else {
                if (currentValue[0]) {
                    control.setValue([currentValue[0]]); // exclusive select
                } else {
                    control.setValue([]); // unselect
                }
            }
        });
    }

    @HostListener('click', ['$event'])
    onToggleClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const button = target.closest('mat-button-toggle');
        if (!button) return;

        const value = button.getAttribute('ng-reflect-value') || button.getAttribute('value');
        if (value !== this.lastClickedValue) {
            this.lastClickedValue = value;
        } else {
            this.lastClickedValue = null
        }
    }
}
