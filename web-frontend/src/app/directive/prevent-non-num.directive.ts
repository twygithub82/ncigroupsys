import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[appPreventNonNumeric]',
  standalone: true,
})
export class PreventNonNumDirective {
  @Input() restrictNonNumeric = true;
  @Input() allowDecimal = false;
  @Input() decimalLimit: number | null = 2;
  @Input() disableScroll = true;

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

    // block anything not digit/dot
    if (!isDigit && (!this.allowDecimal || !isDot)) {
      event.preventDefault();
      return;
    }

    // prevent 2 dots
    if (isDot && value.includes('.')) {
      event.preventDefault();
      return;
    }

    if (!this.allowDecimal || this.decimalLimit === null) return;

    const dotIndex = value.indexOf('.');
    if (dotIndex === -1) return; // No decimal yet? no need to check

    const cursorPos = input.selectionStart ?? value.length;
    const selectionEnd = input.selectionEnd ?? cursorPos;

    const isTypingAfterDot = cursorPos > dotIndex;

    if (isTypingAfterDot) {
      const currentDecimal = value.slice(dotIndex + 1);
      const replacedLength = selectionEnd - cursorPos;
      const predictedDecimalLength = currentDecimal.length - replacedLength + 1;

      if (predictedDecimalLength > this.decimalLimit) {
        event.preventDefault();
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (!this.restrictNonNumeric) return;

    const pasted = event.clipboardData?.getData('text') ?? '';
    const decimalRegex = this.allowDecimal
      ? /^[0-9]*\.?[0-9]*$/
      : /^[0-9]*$/;

    if (!decimalRegex.test(pasted)) {
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
}
