import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
import { MatCheckbox } from '@angular/material/checkbox';
import { MatCard, MatCardActions } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ResponseRow } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { lastValueFrom } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';
import { ResponseCodeComponent } from '../response-code/response-code.component';
import { DataService } from '../../services/data.service';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-datatable',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatSortHeader,
    MatSort,
    ResponseCodeComponent,
    MatCheckbox,
    MatCard,
    FormsModule,
    MatIconButton,
    MatIcon,
    MatButton,
    MatCardActions,
    MatTooltip
  ],
  templateUrl: './datatable.component.html',
  standalone: true,
  styleUrl: './datatable.component.css'
})
export class DatatableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[];
  readonly dataSource: MatTableDataSource<ResponseRow> = new MatTableDataSource();
  protected readonly settings = {
    allColumns: false,
    codeColumn: false
  };

  static columnSets = {
    all: ['setId', 'id', 'subForm', 'status', 'value', 'code', 'codes', 'score', 'settings'],
    important: ['setId', 'status', 'value', 'code', 'codes', 'settings']
  };

  showSettings: boolean = false;

  constructor(
    public ds: DataService,
    private bs: BackendService
  ) {
    this.displayedColumns = DatatableComponent.columnSets.important;
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property): string | number => {
      if (property === 'code') {
        if (item.code) return item.code * 1000000;
        if (item.codes && item.codes.length) {
          return item.codes
            .map(current => Math.min(1, parseFloat(current.parameter ?? '0')) * 100 * current.id * 1000)
            .reduce((a, b) => a + b);
        }
        return 0;
      }
      if (Object.keys(item).includes(property)) {
        const value = item[property as keyof ResponseRow];
        if (typeof value === 'string' || typeof value === 'number') {
          return value;
        }
        return JSON.stringify(value);
      }
      return 0;
    };
    this.ds.data$
      .subscribe(data => {
        this.dataSource.sort = this.sort;
        this.dataSource.data = data;
        this.settings.codeColumn = !!data.find(r => ((!!r.codes?.length) && ('code' in r) && (r.code !== null)));
        this.setDisplayedColumns();
      });
  }

  updateSetting(setting: keyof typeof this.settings, checked: boolean): void {
    this.settings[setting] = checked;
    this.setDisplayedColumns();
  }

  private setDisplayedColumns(): void {
    this.displayedColumns = DatatableComponent.columnSets[this.settings.allColumns ? 'all' : 'important']
      .filter(c => (c !== 'code') || this.settings.codeColumn);
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
  }

  async splitSet(): Promise<void> {
    if (this.ds.task?.type !== 'train') throw new Error('Not a training task');
    const data = [...this.ds.data];
    if (!data.every(r => 'code' in r)) throw new Error('Not every row is coded');

    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = data[i];
      data[i] = data[j];
      data[j] = temp;
    }

    const sizeTowThirds = Math.round(2 * (data.length / 3));
    const training = data.slice(0, sizeTowThirds);
    const control = data.slice(sizeTowThirds);

    await lastValueFrom(this.bs.putTaskData(this.ds.task.id, training));

    if (!this.ds.currentChunk) throw new Error('Something bad happened');
    await this.ds.deleteChunk(this.ds.currentChunk.id);

    const newCodingtask = await lastValueFrom(this.bs.putTask({
      type: 'code',
      label: 'coding task for split data'
    }));

    await lastValueFrom(this.bs.putTaskData(newCodingtask.id, control));
  }
}
