import { Component } from '@angular/core';
import { ServiceSelectorComponent } from '../service-selector/service-selector.component';

@Component({
  selector: 'app-start',
  imports: [
    ServiceSelectorComponent
  ],
  templateUrl: './start.component.html',
  standalone: true,
  styleUrl: './start.component.css'
})
export class StartComponent {

}
