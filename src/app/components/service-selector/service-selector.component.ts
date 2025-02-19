import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { KeyValuePipe } from '@angular/common';
import { MatFormField, MatOption, MatSelect, MatLabel } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-selector',
  imports: [
    KeyValuePipe,
    MatSelect,
    MatOption,
    MatFormField,
    MatLabel,
    FormsModule
  ],
  templateUrl: './service-selector.component.html',
  styleUrl: './service-selector.component.css'
})
export class ServiceSelectorComponent {
  constructor(
    public ds: DataService
  ) {
  }
}
