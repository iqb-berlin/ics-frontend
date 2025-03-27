import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { KeyValuePipe } from '@angular/common';
import { MatFormField, MatOption, MatSelect, MatLabel, MatSelectChange } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {MatAnchor} from '@angular/material/button';

@Component({
  selector: 'app-service-selector',
  imports: [
    KeyValuePipe,
    MatSelect,
    MatOption,
    MatFormField,
    MatLabel,
    FormsModule,
    MatAnchor
  ],
  templateUrl: './service-selector.component.html',
  styleUrl: './service-selector.component.css'
})
export class ServiceSelectorComponent {
  constructor(
    public ds: DataService,
    private router: Router
  ) {
  }

  async selectService($event: MatSelectChange) {
    if (await this.ds.selectService($event.value)) await this.router.navigate(['tasks']);
  }
}
