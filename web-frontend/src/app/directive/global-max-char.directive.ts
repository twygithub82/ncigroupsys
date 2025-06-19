import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: 'input:not([type=number]):not([readonly]), textarea:not([readonly])',
    standalone: true
})
export class GlobalMaxCharDirective {
    private readonly defaultMaxChar = 255;

    constructor(private el: ElementRef<HTMLInputElement | HTMLTextAreaElement>) { }

    @HostListener('input', ['$event'])
    onInput(event: Event): void {
        const input = event.target as HTMLInputElement | HTMLTextAreaElement;

        const override = input.getAttribute('data-max-char');
        const maxChar = override !== null ? parseInt(override, 10) : this.defaultMaxChar;

        if (isNaN(maxChar) || maxChar < 0) return;

        if (input.value.length > maxChar) {
            input.value = input.value.substring(0, maxChar);
            input.dispatchEvent(new Event('input'));
        }
    }
}