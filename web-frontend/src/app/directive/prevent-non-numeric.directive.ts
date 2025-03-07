import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[type=number]',
  standalone: true, // Enables standalone usage
})
export class PreventNonNumericDirective {
  @Input() restrictNonNumeric = true;

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (this.restrictNonNumeric && (event.key === 'e' || event.key === 'E')) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (this.restrictNonNumeric) {
      const clipboardData = event.clipboardData?.getData('text');
      if (clipboardData && /[eE]/.test(clipboardData)) {
        event.preventDefault();
      }
    }
  }
}
