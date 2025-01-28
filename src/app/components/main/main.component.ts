import { Component } from '@angular/core';
import { DatatableComponent } from '../datatable/datatable/datatable.component';
import { ServiceSelectorComponent } from '../service-selector/service-selector.component';
import { OptionsetComponent } from '../optionset/optionset.component';
import { BASE_PATH } from '../../../gen';

@Component({
  selector: 'app-main',
  imports: [
    DatatableComponent,
    ServiceSelectorComponent,
    OptionsetComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
