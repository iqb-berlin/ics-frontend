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
import { Response } from '@iqb/responses';
import { DataService } from '../../../services/data.service';
import { MatSort, MatSortHeader } from '@angular/material/sort';

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
export class DatatableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['id', 'subform', 'status', 'value', 'code', 'score'];
  dataSource: MatTableDataSource<Response> = new MatTableDataSource();
  constructor(
    public ds: DataService
  ) {
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.ds.data);
    this.dataSource.sort = this.sort;
  }
}
