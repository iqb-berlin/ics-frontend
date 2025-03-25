import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatSlider } from '@angular/material/slider';
import { JsonFormControl } from '../../interfaces/optionset.interfaces';
import { MatButton } from '@angular/material/button';

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
    MatButton
  ],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css'
})
export class ControlComponent {
  @Input() control!: JsonFormControl;
  protected readonly isArray = Array.isArray;

  add(): void {
    if (!this.control.childrenType) throw new Error("Not an array control! (value)");
    this.control.children.push({...this.control.childrenType});
  }

  delete($index: number): void {
    if (!this.control.childrenType) throw new Error("Not an array control! (value)");
    this.control.children.splice($index, 1);
  }
}
