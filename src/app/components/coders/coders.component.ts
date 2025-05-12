import {
  AfterViewInit, Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { interval, Subscription } from 'rxjs';
import { Coder } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-coders',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatSort,
    MatHeaderCellDef,
    MatCellDef,
    MatButton,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTooltip,
    MatSortHeader
  ],
  templateUrl: './coders.component.html',
  standalone: true,
  styleUrl: './coders.component.css'
})
export class CodersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  protected readonly displayedColumns: string[];
  protected readonly dataSource: MatTableDataSource<Coder> = new MatTableDataSource();
  private readonly subscriptions: { [key: string]: Subscription } = {};

  constructor(
    readonly ds: DataService,
    private readonly router: Router
  ) {
    this.displayedColumns = ['label', 'actions'];
  }

  ngOnInit(): void {
    this.subscriptions['coders'] = interval(1000)
      .subscribe(() => this.ds.updateCoders()
        .then(() => {
          this.dataSource.data = this.ds.coders;
        })
      );
  }

  ngAfterViewInit(): void {
    this.dataSource.data = this.ds.coders;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    Object.keys(this.subscriptions)
      .forEach(key => {
        this.subscriptions[key].unsubscribe();
        delete this.subscriptions[key];
      });
  }

  async delete(coderId: string): Promise<void> {
    await this.ds.deleteCoder(coderId);
    await this.ds.updateCoders();
  }

  async startCodingJob(coderId: string): Promise<void> {
    await this.ds.addTask({
      label: `Coding task with ${coderId}`,
      type: 'code',
      coder: coderId
    });
    if (!this.ds.task) return;
    await this.router.navigate(['task', this.ds.task.id]);
  }
}
