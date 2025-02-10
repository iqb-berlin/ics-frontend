import { Component, OnInit } from '@angular/core';
import { DatatableComponent } from '../datatable/datatable/datatable.component';
import { OptionsetComponent } from '../optionset/optionset.component';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { contains } from '../../interfaces/iqb.interfaces';

@Component({
  selector: 'app-task',
  imports: [
    DatatableComponent,
    OptionsetComponent,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    FormsModule,
    MatButton
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    protected readonly ds: DataService,
  ) {
  }
  ngOnInit(): void {
    this.route.params
      .pipe(
        filter(params => contains(params, 'id', 'string')),
        map(params => params['id'])
      ).subscribe(taskId => {
        this.ds.getTask(taskId);
      });
  }


  loadData($event: MatSelectChange): void {
    this.ds.getTaskData($event.value);
  }

  startEncoding(): void {
    this.ds.startEncoding();
  }
}
