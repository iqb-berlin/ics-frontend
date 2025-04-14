import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import {MatFormField, MatLabel, MatOption, MatSelect, MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-coder-select',
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption
  ],
  templateUrl: './coder-select.component.html',
  styleUrl: './coder-select.component.css'
})
export class CoderSelectComponent implements OnInit {
  constructor(
    protected ds: DataService
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.ds.updateCoders();
  }

  selectCoder($event: MatSelectChange): void {
    this.ds.updateTask({ instructions: $event.value });
  }
}
