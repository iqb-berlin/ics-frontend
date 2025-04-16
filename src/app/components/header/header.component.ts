import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatAnchor, MatButton } from '@angular/material/button';
import { StatusPipe } from '../../pipe/status.pipe';
import { Router } from '@angular/router';
import { TaskTypes, TaskType } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { isA } from 'iqbspecs-coding-service/functions/common.typeguards';

@Component({
  selector: 'app-header',
  imports: [
    MatAnchor,
    MatButton,
    StatusPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    protected readonly ds: DataService,
    private readonly router: Router,
  ) {
  }

  async commit(): Promise<void> {
    await this.ds.commitTask();
    if (!this.ds.task) return;
    await this.router.navigate(['task', this.ds.task.id, 'overview']);
  }

  async addTask(type: string): Promise<void> {
    if (!isA<TaskType>(TaskTypes, type)) return;
    await this.ds.addTask({
      type,
      label: `new ${type} task`
    });
    if (!this.ds.task) return;
    await this.router.navigate(['task', this.ds.task.id]);
  }

  async delete(): Promise<void> {
    await this.ds.deleteTask();
    await this.router.navigate(['tasks/']);
  }
}
