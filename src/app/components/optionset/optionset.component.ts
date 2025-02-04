import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-optionset',
  imports: [
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
