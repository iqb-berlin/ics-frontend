import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatLabel, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-optionset',
  imports: [
    MatFormField,
    MatInput,
    MatSelect,
    MatLabel,
    FormsModule
  ],
  templateUrl: './optionset.component.html',
  styleUrl: './optionset.component.css'
})
export class OptionsetComponent {
  constructor(
    public ds: DataService
  ) {
  }

  protected readonly Infinity = Infinity;
}
