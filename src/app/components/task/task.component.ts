/* eslint-disable implicit-arrow-linebreak */
import {
  Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  interval,
  map,
  of, startWith,
  Subscription,
  switchMap
} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatLabel } from '@angular/material/select';
import {
  ChunkType, ChunkTypes, DataChunk, Task
} from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { contains, isA } from 'iqbspecs-coding-service/functions/common.typeguards';
import { CoderSelectComponent } from '../coder-select/coder-select.component';
import { UploadComponent } from '../upload/upload.component';
import { StatusPipe } from '../../pipe/status.pipe';
import { TabType, TaskTab } from '../../interfaces/interfaces';
import { OptionsetComponent } from '../optionset/optionset.component';
import { DatatableComponent } from '../datatable/datatable.component';
import { DataService } from '../../services/data.service';
import { TaskIsReadyPipe } from '../../pipe/task-is-ready.pipe';

@Component({
  selector: 'app-task',
  imports: [
    DatatableComponent,
    OptionsetComponent,
    FormsModule,
    MatTabGroup,
    MatTab,
    DatePipe,
    UploadComponent,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    CoderSelectComponent,
    MatButton,
    MatIconButton,
    TaskIsReadyPipe
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
    protected readonly ds: DataService
  ) {
  }

  protected tabs: TaskTab[] = [];
  protected tabIndex: number = 0;
  private readonly subscriptions: { [key: string]: Subscription } = { };
  protected newLabel: string = '';

  ngOnInit(): void {
    this.subscriptions['route'] = this.route.params
      .pipe(
        filter(params => contains(params, 'id', 'string')),
        map(params => params.id),
        switchMap(taskId =>
          this.ds.serviceConnected$
            .pipe(
              filter(c => c),
              map(() => taskId)
            )
        ),
        concatMap(taskId => this.ds.getTask(taskId))
      ).subscribe(() => {
        this.subscriptions['polling'] = interval(2000)
          .pipe(
            startWith(0),
            filter(() => !this.tabIndex),
            switchMap(() => (this.ds.task ? this.ds.getTask(this.ds.task.id) : of(null))),
            filter(t => !!t),
            distinctUntilChanged((t1: Task, t2: Task) => (StatusPipe.getStatus(t1) === StatusPipe.getStatus(t2)) && (t1.data.length === t2.data.length))
          )
          .subscribe(newTask => {
            this.collectTabs(newTask);
          });
      });
  }

  collectTabs(task: Task): void {
    this.tabs = [
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
      this.tabs.push({ id: 'add', label: task.data.length ? '+' : 'Add input Data', type: 'add' });
    }
  }

  onTabChange($event: MatTabChangeEvent) {
    if (isA<ChunkType>(ChunkTypes, this.tabs[$event.index].type)) {
      this.ds.getTaskData(this.tabs[$event.index].id);
    } else {
      this.ds.getTaskData(null);
    }
    if (this.tabs[$event.index].type === 'add') {
      if (this.uploadTab) this.uploadTab.openFileDialog();
    }
  }

  ngOnDestroy(): void {
    Object.keys(this.subscriptions)
      .forEach(subscriptionId => {
        this.subscriptions[subscriptionId].unsubscribe();
        delete this.subscriptions[subscriptionId];
      });
  }

  changeTab(tabType: TabType, id: string | null): void {
    if (!this.ds.task) return;
    this.collectTabs(this.ds.task);
    this.tabIndex = this.tabs
      .findIndex((tab: TaskTab) => tab.type === tabType && (id && tab.id === id));
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
}
