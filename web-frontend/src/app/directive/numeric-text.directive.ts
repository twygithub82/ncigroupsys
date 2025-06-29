import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[appNumericText]',
  standalone: true,
})
export class NumericTextDirective {
  @Input() restrictNonNumeric = true;
  @Input() allowDecimal = true;
  @Input() decimalLimit: number | null = 2;
  @Input() disableScroll = true;
  @Input() min: string | number | null = null;
  @Input() max: string | number | null = null;

  constructor(private el: ElementRef<HTMLInputElement>) {
  }
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (!this.restrictNonNumeric) return;

    const input = this.el.nativeElement;
    const key = event.key;
    const value = input.value;

    const isDigit = /^[0-9]$/.test(key);
    const isDot = key === '.';

    if (!isDigit && (!this.allowDecimal || !isDot)) {
      event.preventDefault();
      return;
    }

    // Prevent multiple dots
    if (isDot && value.includes('.')) {
      event.preventDefault();
      return;
    }

    const selectionStart = input.selectionStart ?? value.length;
    const selectionEnd = input.selectionEnd ?? selectionStart;

    const predictedValue =
      value.substring(0, selectionStart) + key + value.substring(selectionEnd);

    const numericValue = parseFloat(predictedValue);
    const minValue = this.toNumber(this.min);
    const maxValue = this.toNumber(this.max);

    if (
      minValue !== null && !isNaN(numericValue) && numericValue < minValue ||
      maxValue !== null && !isNaN(numericValue) && numericValue > maxValue
    ) {
      event.preventDefault();
      return;
    }

    if (!this.allowDecimal || this.decimalLimit === null) return;

    const dotIndex = value.indexOf('.');
    if (dotIndex === -1) return;

    const isTypingAfterDot = selectionStart > dotIndex;
    const replacedLength = selectionEnd - selectionStart;
    const currentDecimal = value.slice(dotIndex + 1);
    const predictedDecimalLength = currentDecimal.length - replacedLength + 1;

    if (isTypingAfterDot && predictedDecimalLength > this.decimalLimit) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (!this.restrictNonNumeric) return;

    const pasted = event.clipboardData?.getData('text') ?? '';
    const decimalRegex = this.allowDecimal
      ? /^\d+(\.\d*)?$/
      : /^\d+$/;

    if (!decimalRegex.test(pasted)) {
      event.preventDefault();
      return;
    }

    const input = this.el.nativeElement;
    const value = input.value;
    const selectionStart = input.selectionStart ?? value.length;
    const selectionEnd = input.selectionEnd ?? selectionStart;

    const predictedValue =
      value.substring(0, selectionStart) +
      pasted +
      value.substring(selectionEnd);

    const numericValue = parseFloat(predictedValue);
    const minValue = this.toNumber(this.min);
    const maxValue = this.toNumber(this.max);

    if (
      (minValue !== null && !isNaN(numericValue) && numericValue < minValue) ||
      (maxValue !== null && !isNaN(numericValue) && numericValue > maxValue)
    ) {
      event.preventDefault();
      return;
    }

    if (
      this.allowDecimal &&
      this.decimalLimit !== null &&
      pasted.includes('.')
    ) {
      const decimalPart = pasted.split('.')[1] ?? '';
      if (decimalPart.length > this.decimalLimit) {
        event.preventDefault();
      }
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.disableScroll && this.el.nativeElement === document.activeElement) {
      event.preventDefault();
    }
  }

  private toNumber(value: string | number | null): number | null {
    if (value === null || value === '') return null;
    const num = typeof value === 'number' ? value : parseFloat(value);
    return isNaN(num) ? null : num;
  }
}
