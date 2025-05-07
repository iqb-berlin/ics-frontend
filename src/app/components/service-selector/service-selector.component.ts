import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import {AsyncPipe, JsonPipe, KeyValuePipe} from '@angular/common';
import { MatFormField, MatOption, MatSelect, MatLabel, MatSelectChange } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { ResponseCodeComponent } from '../response-code/response-code.component';
import { ResponseRow } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { MatCard } from '@angular/material/card';
import { ServiceConnection } from '../../interfaces/interfaces';

@Component({
  selector: 'app-service-selector',
  imports: [
    KeyValuePipe,
    MatSelect,
    MatOption,
    MatFormField,
    MatLabel,
    FormsModule,
    MatAnchor,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    MatCard,
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './service-selector.component.html',
  styleUrl: './service-selector.component.css'
})
export class ServiceSelectorComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['id', 'url', 'type', 'version', 'api-version', 'status'];
  readonly dataSource: MatTableDataSource<ServiceConnection> = new MatTableDataSource();

  constructor(
    public ds: DataService,
    private router: Router
  ) {
  }

  ngAfterViewInit(): void {
    this.ds.services$
      .subscribe(services => {
        this.dataSource.sort = this.sort;
        this.dataSource.data = services;
      });
  }

  async selectService(id: string): Promise<void> {
    if (this.ds.selectService(id)) await this.router.navigate(['tasks']);
  }
}
