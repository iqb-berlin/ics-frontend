import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  isFormArray,
  ReactiveFormsModule
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatSlider } from '@angular/material/slider';
import { JsonFormControl } from '../../interfaces/optionset.interfaces';
import { MatButton } from '@angular/material/button';
import { JsonPipe } from '@angular/common';
import { createAngularFormsControl } from '../../functions/optionset-form-builder';
import { convertValue } from '../../functions/optionset';

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
    ReactiveFormsModule,
    MatButton,
    JsonPipe
  ],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css'
})
export class ControlComponent {
  @Input() control!: JsonFormControl;
  @Input() formGroup!: FormGroup;
  @Input() hostControl: AbstractControl | null | undefined;
  protected readonly isArray = Array.isArray;

  constructor(
    private fb: FormBuilder
  ) {
  }

  add(): void {
    if (!this.control.childrenType) throw new Error("Not an array control!");
    const newControl = createAngularFormsControl(this.fb, this.control.childrenType);
    console.log(this.hostControl && Object.keys(this.hostControl))
    if (isFormArray(this.hostControl)) {
      this.hostControl.push(newControl.control);
      // if (!Array.isArray(this.control.value)) throw new Error("Not an array control! (value)");
      console.log("!!!!!!!!")
      // this.control.value.push('');
    }
  }

  protected readonly Object = Object;
  protected readonly FormArray = FormArray;
  protected readonly isFormArray = isFormArray;
}
