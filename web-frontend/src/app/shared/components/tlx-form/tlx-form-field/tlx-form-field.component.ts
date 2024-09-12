// tlx-form-field.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'tlx-form-field',
  standalone: true,
  templateUrl: './tlx-form-field.component.html',
  styleUrls: ['./tlx-form-field.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ]
})
export class TlxFormFieldComponent {
  @Input() customClass: string = ''; // Custom class input for additional styling
  @Input() label: string = '';  // Label for the form field
  @Input() isRequired: boolean = false;  // Whether the field is required
}
