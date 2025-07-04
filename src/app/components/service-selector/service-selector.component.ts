import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { MatAnchor, MatButton } from '@angular/material/button';
import { ServiceConnection } from '../../interfaces/interfaces';
import { DataService } from '../../services/data.service';
import { ConfigService } from '../../services/config.service';
import { ServiceColorPipe } from '../../pipe/service-color.pipe';

@Component({
  selector: 'app-service-selector',
  imports: [
    FormsModule,
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
    MatTooltip,
    ServiceColorPipe,
    MatAnchor,
    MatButton
  ],
  templateUrl: './service-selector.component.html',
  standalone: true,
  styleUrl: './service-selector.component.css'
})
export class ServiceSelectorComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['id', 'url', 'type', 'version', 'api-version', 'status', 'actions'];
  readonly dataSource: MatTableDataSource<ServiceConnection> = new MatTableDataSource();

  constructor(
    public ds: DataService,
    private router: Router,
    protected cs: ConfigService
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
    if (id && this.ds.selectService(id)) await this.router.navigate(['tasks']);
  }

  tryConnection(element: ServiceConnection): void {
    this.ds.tryServiceConnection(element.url);
  }
}
