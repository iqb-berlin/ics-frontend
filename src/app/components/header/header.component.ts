import { Component } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TaskTypes, TaskType } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { isA } from 'iqbspecs-coding-service/functions/common.typeguards';
import { filter, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { StatusPipe } from '../../pipe/status.pipe';
import { DataService } from '../../services/data.service';
import { TaskIsReadyPipe } from '../../pipe/task-is-ready.pipe';
import { download } from '../../functions/download';
import { ServiceColorPipe } from '../../pipe/service-color.pipe';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-header',
  imports: [
    MatAnchor,
    MatButton,
    StatusPipe,
    TaskIsReadyPipe,
    ServiceColorPipe,
    AsyncPipe,
    MatTooltip
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  protected currentRoute: string = '';

  constructor(
    protected readonly ds: DataService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    protected readonly cs: ConfigService
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute.root.firstChild?.routeConfig?.data?.['id'] || '')
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
    if (!this.ds.currentChunk) return;
    download(this.ds.data)[type]([this.ds.currentChunk.type, this.ds.currentChunk.id, type].join('.'));
  }

  async deleteChunk(): Promise<void> {
    if (!this.ds.currentChunk) return;
    await this.ds.deleteChunk(this.ds.currentChunk.id);
    if (!this.ds.task) return;
    await this.router.navigate(['task', this.ds.task.id, 'overview']);
  }
}
