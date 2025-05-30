import {
  AfterViewInit, Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { Task } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { interval, Subscription, switchMap } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { StatusPipe } from '../../pipe/status.pipe';
import { TaskOverview } from '../../interfaces/interfaces';
import { BackendService } from '../../services/backend.service';
import { DataService } from '../../services/data.service';

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
    MatTooltip,
    MatButton
  ],
  templateUrl: './tasks.component.html',
  standalone: true,
  styleUrls: [
    './tasks.component.css',
    '../../task-status.css'
  ]
})
export class TasksComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  protected readonly displayedColumns = ['id', 'type', 'status', 'actions'];
  dataSource: MatTableDataSource<TaskOverview> = new MatTableDataSource();
  private subscriptions: { [key: string]: Subscription } = {};

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
        this.dataSource.data = data.map((task: Task): TaskOverview => {
          const lastEvent = StatusPipe.getLastEvent(task);
          return {
            id: task.id,
            label: task.label || task.id,
            type: task.type,
            status: StatusPipe.getStatus(task),
            timestamp: lastEvent?.timestamp || Date.now(),
            message: lastEvent?.message || 'draft'
          };
        });
      });
  }

  ngOnDestroy(): void {
    Object.keys(this.subscriptions)
      .forEach(key => {
        this.subscriptions[key].unsubscribe();
        delete this.subscriptions[key];
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  delete(id: string): void {
    this.ds.deleteTask(id);
  }
}
