import { Component, Input } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatSlider } from '@angular/material/slider';
import { JsonFormControl } from '../../interfaces/optionset.interfaces';
import {MatIconButton} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-control',
  imports: [
    MatCheckbox,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSlider,
    MatHint,
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatIcon,
    MatIconButton
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
