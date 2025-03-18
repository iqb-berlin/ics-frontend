import { Component, OnInit } from '@angular/core';
import { DatatableComponent } from '../datatable/datatable/datatable.component';
import { OptionsetComponent } from '../optionset/optionset.component';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { contains, isA } from '../../interfaces/iqb.interfaces';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { TaskTab } from '../../interfaces/interfaces';
import { ChunkType, ChunkTypes, DataChunk } from '../../interfaces/api.interfaces';
import { StatusPipe } from '../../pipe/status.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  imports: [
    DatatableComponent,
    OptionsetComponent,
    FormsModule,
    MatTabGroup,
    MatTab,
    StatusPipe,
    DatePipe
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

  tabs: TaskTab[] = [];

  ngOnInit(): void {
    this.route.params
      .pipe(
        filter(params => contains(params, 'id', 'string')),
        map(params => params['id']),
        switchMap(taskId => this.ds.getTask(taskId))
      ).subscribe(task => {
        this.tabs = [
          { id: 'overview', label: 'Task', type: 'overview' },
          { id: 'config', label: 'Config', type: 'config' },
          ...task.data.map((chunk: DataChunk): TaskTab => {
            return {
              type: chunk.type,
              label: chunk.type + ': ' + chunk.id,
              id: chunk.id
            }
          })
        ];
      });

  }

  onTabChange($event: MatTabChangeEvent) {
    if (isA<ChunkType>(ChunkTypes, this.tabs[$event.index].type)) {
      this.ds.getTaskData(this.tabs[$event.index].id);
    }
  }
}
