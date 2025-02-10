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
import { DataService } from '../../../services/data.service';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { ResponseRow } from '../../../interfaces/api.interfaces';

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
    MatSort
  ],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.css'
})
export class DatatableComponent {
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['setId', 'id', 'subForm', 'status', 'value', 'code', 'score'];
  readonly dataSource: MatTableDataSource<ResponseRow> = new MatTableDataSource();
  constructor(
    public ds: DataService
  ) {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.ds.data;
  }
}
