// custom-snackbar.component.ts
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'app-custom-snackbar',
    standalone: true,
    imports: [MatIconModule],
    template: `
    <div class="snackbar-container">
      <mat-icon class="snackbar-icon">{{ data.icon }}</mat-icon>
      <span class="snackbar-text">{{ data.message }}</span>
    </div>
  `,
    styles: [``]
})
export class CustomSnackbarComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
