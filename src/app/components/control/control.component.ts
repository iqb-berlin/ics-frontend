import { Component, forwardRef, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatSlider } from '@angular/material/slider';
import { JsonFormControl } from '../../interfaces/optionset.interfaces';
import { isArray } from '@angular/compiler-cli/src/ngtsc/annotations/common';

@Component({
  selector: 'app-control',
  imports: [
    FormsModule,
    MatCheckbox,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSlider,
    ReactiveFormsModule
  ],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css'
})
export class ControlComponent {
  @Input() control!: JsonFormControl;
  @Input() formGroup!: FormGroup;
  protected readonly isArray = isArray;

  isArr(value: string | number | boolean | string[] | number[]): value is string[] | number[] {
    return Array.isArray(value);
  }

  add(control: JsonFormControl): void {
    this.formGroup.controls[control.name].value.push(control.type === 'string' ? "" : '');
  }
}
