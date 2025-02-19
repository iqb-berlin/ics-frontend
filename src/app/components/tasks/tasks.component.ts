import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { BackendService } from '../../services/backend.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { TaskOverview } from '../../interfaces/interfaces';
import { Task, TaskEventType, TaskEventTypes } from '../../interfaces/api.interfaces';
import { Router, RouterLink } from '@angular/router';
import { isA } from '../../interfaces/iqb.interfaces';
import { MatTooltip } from '@angular/material/tooltip';
import { interval, Subscription, switchMap } from 'rxjs';

@Component({
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    RouterLink,
    MatTooltip
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  protected readonly displayedColumns = ['id', 'type', 'status'];
  dataSource: MatTableDataSource<TaskOverview> = new MatTableDataSource();
  subscriptions: { [key: string]: Subscription } = {};

  constructor(
    protected readonly ds: DataService,
    private readonly bs: BackendService
  ) {
  }

  ngOnInit(): void {
    this.dataSource.connect().next([]);
    this.subscriptions['tasks'] = interval(1000)
      .pipe(switchMap(() => this.bs.getTasks()))
      .subscribe(data => {
        console.log('tasks', data);
        const taskOverviews = data.map((task: Task) : TaskOverview => {
          const lastEvent =
            task.events.length ?
              task.events.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1)[0] :
              { status: 'create', message: '(new)', timestamp: Date.now() };
          return {
            id: task.id,
            type: task.type,
            status: isA<TaskEventType>(TaskEventTypes, lastEvent.status) ? lastEvent.status : 'draft',
            timestamp: lastEvent.timestamp,
            message: lastEvent.message
          };
        });
        this.dataSource.connect().next(taskOverviews);
      });
  }

  ngOnDestroy() {
    Object.keys(this.subscriptions)
      .forEach(key => {
        this.subscriptions[key].unsubscribe();
        delete this.subscriptions[key];
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
