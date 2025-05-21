import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[type=number]',
  standalone: true, // Enables standalone usage
})
export class PreventNonNumericDirective {
  @Input() restrictNonNumeric = true;
  @Input() allowDecimal = false;
  @Input() decimalLimit: number | null = 2;
  @Input() disableScroll = true;

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (!this.restrictNonNumeric) return;

    const input = this.el.nativeElement as HTMLInputElement;
    const currentValue = input.value;
    const key = event.key;

    const allowed = this.allowDecimal ? /[\d.]$/ : /[\d]$/;
    const isDot = key === '.';
    const hasDecimal = currentValue.includes('.');

    // Prevent invalid characters
    if (!allowed.test(key)) {
      event.preventDefault();
      return;
    }

    // Prevent multiple decimals
    if (isDot && hasDecimal) {
      event.preventDefault();
      return;
    }

    // Predict new value after keypress
    const selectionStart = input.selectionStart ?? currentValue.length;
    const selectionEnd = input.selectionEnd ?? currentValue.length;
    const nextValue =
      currentValue.substring(0, selectionStart) +
      key +
      currentValue.substring(selectionEnd);

    // Check future decimal precision
    if (this.allowDecimal && this.decimalLimit !== null && nextValue.includes('.')) {
      const decimalPart = nextValue.split('.')[1] ?? '';
      if (decimalPart.length > this.decimalLimit) {
        event.preventDefault();
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (!this.restrictNonNumeric) return;

    const pasted = event.clipboardData?.getData('text') || '';
    const decimalRegex = this.allowDecimal ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;

    if (!decimalRegex.test(pasted)) {
      event.preventDefault();
      return;
    }

    if (this.allowDecimal && this.decimalLimit !== null && pasted.includes('.')) {
      const decimalPart = pasted.split('.')[1] ?? '';
      if (decimalPart.length > this.decimalLimit) {
        event.preventDefault();
      }
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.disableScroll && this.el.nativeElement === document.activeElement) {
      event.preventDefault(); // Prevent scrolling on focused number input
    }
  }
}
