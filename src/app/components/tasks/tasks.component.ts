import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { isA, Task, TaskEventType, TaskEventTypes } from '../../interfaces/api.interfaces';

@Component({
  selector: 'app-tasks',
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
    MatHeaderCellDef
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  protected readonly displayedColumns = ['id', 'type', 'status'];
  dataSource: MatTableDataSource<TaskOverview> = new MatTableDataSource();
  protected readonly tasks: TaskOverview[] = [];

  constructor(
    protected readonly ds: DataService,
    private readonly bs: BackendService
  ) {
  }

  ngOnInit(): void {
    this.tasks.length = 0;
    this.bs.getTasks()
      .subscribe(data => {
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
        this.tasks.push(...taskOverviews);
        console.log(this.tasks);
      });
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.tasks);
    this.dataSource.sort = this.sort;
  }
}
