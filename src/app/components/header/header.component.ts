import { Component } from '@angular/core';
import { ServiceSelectorComponent } from '../service-selector/service-selector.component';

@Component({
  selector: 'app-header',
  imports: [
    ServiceSelectorComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
