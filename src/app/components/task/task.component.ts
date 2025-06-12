/* eslint-disable implicit-arrow-linebreak */
import {
  Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  exhaustMap, filter, interval, map, merge,
  startWith, Subscription, switchMap, take
} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatLabel } from '@angular/material/select';
import {
  ChunkType, ChunkTypes, DataChunk, Task
} from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { isA } from 'iqbspecs-coding-service/functions/common.typeguards';
import { MatProgressBar } from '@angular/material/progress-bar';
import { CoderSelectComponent } from '../coder-select/coder-select.component';
import { UploadComponent } from '../upload/upload.component';
import { StatusPipe } from '../../pipe/status.pipe';
import { TaskTab } from '../../interfaces/interfaces';
import { OptionsetComponent } from '../optionset/optionset.component';
import { DatatableComponent } from '../datatable/datatable.component';
import { DataService } from '../../services/data.service';
import { TaskIsReadyPipe } from '../../pipe/task-is-ready.pipe';
import { TaskProgressPipe } from '../../pipe/task-progress.pipe';

@Component({
  selector: 'app-task',
  imports: [
    DatatableComponent,
    OptionsetComponent,
    FormsModule,
    DatePipe,
    UploadComponent,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    CoderSelectComponent,
    MatButton,
    MatIconButton,
    TaskIsReadyPipe,
    TaskProgressPipe,
    MatProgressBar
  ],
  templateUrl: './task.component.html',
  standalone: true,
  styleUrls: [
    './task.component.css',
    '../../task-status.css'
  ]
})
export class TaskComponent implements OnInit, OnDestroy {
  @ViewChild(UploadComponent) uploadTab: UploadComponent | undefined;
  protected editLabel: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    protected readonly ds: DataService,
    private readonly location: Location
  ) {
  }

  protected readonly tabs: TaskTab[] = [];
  protected tabIndex: number | null = null;
  private readonly subscriptions: { [key: string]: Subscription } = { };
  protected newLabel: string = '';

  ngOnInit(): void {
    // TODO unsubscribe old poll when switch task
    // TODO does not react on navigations correctly
    this.subscriptions['polling'] = merge(interval(2000), this.route.params)
      .pipe(
        startWith(-1),
        exhaustMap(() => this.ds.serviceConnected$.pipe(filter(c => c), take(1))),
        switchMap(() => this.route.params),
        filter(params => ('id' in params)),
        switchMap((params: Params) => this.ds.getTask(params['id']).pipe(map(task => ({ task, tab: params['tab'] }))))
      )
      .subscribe(result => {
        this.collectTabs(result.task);
        if (this.tabIndex === null) this.switchTab(result.tab || 'overview');
      });
  }

  collectTabs(task: Task): void {
    const tabs: TaskTab[] = [
      { id: 'overview', label: 'Task', type: 'overview' },
      { id: 'config', label: 'Config', type: task.type },
      ...task.data
        .map((chunk: DataChunk): TaskTab => ({
          type: chunk.type,
          label: `${chunk.type}: ${chunk.id}`,
          id: chunk.id
        }))
    ];
    if (StatusPipe.getStatus(task) === 'create') {
      tabs.push({ id: 'add', label: task.data.length ? '+' : 'Add input Data', type: 'add' });
    }

    this.tabs.splice(0, this.tabs.length, ...tabs);
  }

  ngOnDestroy(): void {
    Object.keys(this.subscriptions)
      .forEach(subscriptionId => {
        this.subscriptions[subscriptionId].unsubscribe();
        delete this.subscriptions[subscriptionId];
      });
  }

  toggleEditLabel(): void {
    this.editLabel = !this.editLabel;
    this.newLabel = this.ds.task?.label || this.ds.task?.type || '';
  }

  async saveLabel() {
    this.editLabel = false;
    if (this.ds.task?.label === this.newLabel) return;
    await this.ds.updateTask({ label: this.newLabel });
  }

  async startCodingJob(): Promise<void> {
    const coderId = this.ds.task?.coder;
    if (!coderId) {
      throw new Error('Not coder selected'!);
    }
    await this.ds.addTask({
      label: `Coding task with ${coderId}`,
      type: 'code',
      coder: coderId
    });
  }

  async commit(): Promise<void> {
    await this.ds.commitTask();
  }

  async delete(): Promise<void> {
    await this.ds.deleteTask();
  }

  onChunkAdded(chunk: DataChunk): void {
    if (!this.ds.task) return;
    this.collectTabs(this.ds.task);
    this.switchTab(chunk.id);
  }

  switchTab(id: string): void {
    this.tabIndex = Math.max(this.tabs.findIndex(t => t.id === id), 0);
    if (isA<ChunkType>(ChunkTypes, this.tabs[this.tabIndex].type)) {
      this.ds.getTaskData(this.tabs[this.tabIndex].id);
    } else {
      this.ds.getTaskData(null);
    }
    this.location.replaceState(`/task/${this.ds.task?.id}/${this.tabs[this.tabIndex].id}`);
  }
}
