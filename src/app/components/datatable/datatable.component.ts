import { Component, ViewChild } from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import { DataService } from '../../services/data.service';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { ResponseCodeComponent } from '../response-code/response-code.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatCard, MatCardActions } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ResponseRow } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { MatButton } from '@angular/material/button';
import { inferSchema, initParser } from 'udsv';
import { csv } from '../../functions/csv';

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
    MatCardActions,
    MatButton
  ],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.css'
})
export class DatatableComponent {
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[];
  readonly dataSource: MatTableDataSource<ResponseRow> = new MatTableDataSource();
  protected readonly settings = {
    allColumns: false
  };
  static columnSets = {
    'all': ['setId', 'id', 'subForm', 'status', 'value', 'code', 'score'],
    'important': ['setId', 'status', 'value', 'code']
  }

  constructor(
    public ds: DataService
  ) {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.ds.data;
    this.displayedColumns = DatatableComponent.columnSets.important;
  }

  updateSetting(setting: keyof typeof this.settings, checked: boolean) {
    this.settings[setting] = checked;
    switch (setting) {
      case 'allColumns':
        this.displayedColumns = DatatableComponent.columnSets[checked ? 'all' : 'important'];
    }
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
}
