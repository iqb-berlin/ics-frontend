import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { DataService } from '../../services/data.service';
import { MatButton } from '@angular/material/button';
import { interval, Subscription } from 'rxjs';
import { Coder } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import {MatTooltip} from '@angular/material/tooltip';


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
    MatTooltip
  ],
  templateUrl: './coders.component.html',
  styleUrl: './coders.component.css'
})
export class CodersComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  protected readonly displayedColumns: string[];
  protected readonly dataSource: MatTableDataSource<Coder> = new MatTableDataSource();
  private readonly subscriptions: { [key: string]: Subscription } = {};

  constructor(
    public ds: DataService
  ) {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.ds.coders;
    this.displayedColumns = ['label', 'actions'];
  }

  ngOnInit(): void {
    this.dataSource.connect().next([]);
    this.subscriptions['coders'] = interval(1000)
      .subscribe(() => this.ds.updateCoders());
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
      type: 'code'
    });
    await this.ds.updateTask({
      instructions: coderId
    });
  }
}
