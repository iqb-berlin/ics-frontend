import { Component } from '@angular/core';
import { ServiceSelectorComponent } from '../service-selector/service-selector.component';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-start',
  imports: [
    ServiceSelectorComponent,
    MatCard
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {

}
