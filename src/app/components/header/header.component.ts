import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatAnchor, MatButton } from '@angular/material/button';
import { StatusPipe } from '../../pipe/status.pipe';
import { TaskType, TaskTypes } from '../../interfaces/api.interfaces';
import { Router } from '@angular/router';
import { isA } from '../../interfaces/iqb.interfaces';

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

  commit(): void {
    this.ds.startEncoding();
  }

  async addTask(type: string): Promise<void> {
    if (!isA<TaskType>(TaskTypes, type)) return;
    await this.ds.addTask({
      type,
      label: '' // TODO
    });
    if (!this.ds.task) return;
    await this.router.navigate(['task', this.ds.task.id]);
  }

  async delete(): Promise<void> {
    await this.ds.deleteTask();
    await this.router.navigate(['tasks/']);
  }
}
