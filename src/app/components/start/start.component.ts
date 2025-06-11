import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { ServiceSelectorComponent } from '../service-selector/service-selector.component';
import { ConfigService } from '../../services/config.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-start',
  imports: [
    ServiceSelectorComponent,
    MatCard
  ],
  templateUrl: './start.component.html',
  standalone: true,
  styleUrl: './start.component.css'
})
export class StartComponent {
  constructor(
    protected ds: DataService,
    protected cs: ConfigService
  ) {
  }
}
