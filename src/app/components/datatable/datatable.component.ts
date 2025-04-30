import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
import { MatCard } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ResponseRow } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

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
    MatIcon
  ],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.css'
})
export class DatatableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[];
  readonly dataSource: MatTableDataSource<ResponseRow> = new MatTableDataSource();
  protected readonly settings = {
    allColumns: false
  };
  static columnSets = {
    'all': ['setId', 'id', 'subForm', 'status', 'value', 'code', 'score', 'settings'],
    'important': ['setId', 'status', 'value', 'code', 'settings']
  }
  showSettings: boolean = false;

  constructor(
    public ds: DataService
  ) {
    this.displayedColumns = DatatableComponent.columnSets.important;
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property): string | number => {
      if (property === 'code') {
        if (item.code) return item.code  * 1000000;
        if (item.codes && item.codes.length) {
          const sortPoints = item.codes
            .map(current =>
              Math.min(1, parseFloat(current.parameter ?? "0")) * 100 * current.id * 1000
            )
          const sortPoint = sortPoints
            .reduce((a, b) => a + b);
          console.log(sortPoint, item.codes, sortPoints)
          return sortPoint;
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
    }
    this.ds.data$
      .subscribe(data => {
        this.dataSource.sort = this.sort;
        this.dataSource.data = data;
      });
  }

  updateSetting(setting: keyof typeof this.settings, checked: boolean) {
    this.settings[setting] = checked;
    switch (setting) {
      case 'allColumns':
        this.displayedColumns = DatatableComponent.columnSets[checked ? 'all' : 'important'];
    }
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
  }
}
