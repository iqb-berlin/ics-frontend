/* eslint-disable implicit-arrow-linebreak */
import {
  ChangeDetectorRef,
  Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
import { TaskTab } from '../../interfaces/interfaces';
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
    private readonly router: Router,
    protected readonly ds: DataService,
    private cdr: ChangeDetectorRef
  ) {
  }

  protected readonly tabs: TaskTab[] = [];
  protected tabIndex: number = 0;
  private readonly subscriptions: { [key: string]: Subscription } = { };
  protected newLabel: string = '';

  ngOnInit(): void {
    this.subscriptions['route'] = this.route.params
      .pipe(
        filter(params => contains(params, 'id', 'string')), // PROBLEM: jetzt wird der task neu geladen, wenn amn nur den tab wechselt...
        switchMap(params =>
          this.ds.serviceConnected$
            .pipe(
              filter(c => c),
              map(() => params)
            )
        ),
        concatMap(params =>
          this.ds.getTask(params.id)
            .pipe(
              map(() => params)
            )
        )
      ).subscribe(params => {
        // TODO unsubscribe old poll when switch task
        console.log('task reload', params.id);
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
            if (!contains(params, 'tab', 'string')) return;
            const tabIndex = this.tabs.findIndex(t => t.id === params.tab);
            if (!tabIndex) return;
            this.tabIndex = tabIndex;
            console.log('HUBERT')
            this.onTabChange(this.tabs[tabIndex]);
          });
      });
    this.subscriptions['tab_change'] = this.route.params
      .pipe(
        filter(params => contains(params, 'id', 'string')),
        distinctUntilChanged((p1: Params, p2: Params) => p1['tab'] === p2['tab']),
        map((p: Params) => this.tabs.find(t => t.id === p['tab'])),
        filter(newTab => !!newTab)
      )
      .subscribe(newTab => {
        console.log('tabreload', newTab);
        if (!newTab) return;
        // const tabIndex = this.tabs.findIndex((t: TaskTab) => t.id === newTab?.id);
        // console.log({ newTab, tabIndex, oldTabindex: this.tabIndex * 1, tabs: this.tabs });
        // if (tabIndex < 0) return;
        // this.tabIndex = 0;
        // console.log({ changedTabindex: this.tabIndex });

        this.onTabChange(newTab);
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
    this.cdr.detectChanges();
  }

  async onTabSelect($event: MatTabChangeEvent): Promise<void> {
    if (!this.ds.task) return;
    this.collectTabs(this.ds.task);
    const tabId = this.tabs[$event.index].id;
    console.log('onTabSelect', tabId);
    if (!tabId) return;
    await this.router.navigate(['task', this.ds.task?.id, tabId]);
  }

  onTabChange(newTab: TaskTab): void {
    console.log('onTabChange', newTab);
    if (isA<ChunkType>(ChunkTypes, newTab.type)) {
      this.ds.getTaskData(newTab.id);
      console.log('[onTabChange] - data loaded');
    } else {
      this.ds.getTaskData(null);
    }
    if (newTab.type === 'add') {
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

    const tabIndex = this.tabs.findIndex((t: TaskTab) => t.id === chunk.id);
    if (tabIndex < 0) return;

    this.tabIndex = tabIndex;
  }
}
