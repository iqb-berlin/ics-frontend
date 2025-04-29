import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatAnchor, MatButton } from '@angular/material/button';
import { StatusPipe } from '../../pipe/status.pipe';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { TaskTypes, TaskType } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { isA } from 'iqbspecs-coding-service/functions/common.typeguards';
import {filter, map} from 'rxjs';
import {TaskIsReadyPipe} from '../../pipe/task-is-ready.pipe';
import { csv } from '../../functions/csv';

@Component({
  selector: 'app-header',
  imports: [
    MatAnchor,
    MatButton,
    StatusPipe,
    TaskIsReadyPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  protected currentRoute: string = '';

  constructor(
    protected readonly ds: DataService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(event => this.activatedRoute.root.firstChild?.routeConfig?.data?.['id'] || '')
      )
      .subscribe(urlId => {
        this.currentRoute = urlId;
      });
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

  async commit(): Promise<void> {
    await this.ds.commitTask();
    if (!this.ds.task) return;
    await this.router.navigate(['task', this.ds.task.id, 'overview']);
  }

  async delete(): Promise<void> {
    await this.ds.deleteTask();
    await this.router.navigate(['tasks/']);
  }

  download(type: 'csv' | 'json'): void {
    const blob = (type === 'json') ?
      new Blob([JSON.stringify(this.ds.data, null, 2)], { type: 'application/json' }) :
      csv(this.ds.data);
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = this.ds.currentChunk?.id + '.' + type;
    a.click();
    URL.revokeObjectURL(url);
  }

  async deleteChunk(): Promise<void> {
    if (!this.ds.currentChunk) return;
    await this.ds.deleteChunk(this.ds.currentChunk.id);
    if (!this.ds.task) return;
    await this.router.navigate(['task', this.ds.task.id, 'overview']);
  }
}
