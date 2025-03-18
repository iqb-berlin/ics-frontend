import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatAnchor, MatButton } from '@angular/material/button';
import { StatusPipe } from '../../pipe/status.pipe';
import { TaskType } from '../../interfaces/api.interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    MatAnchor,
    MatButton,
    StatusPipe

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    protected readonly ds: DataService,
    private readonly router: Router,
  ) {
  }

  commit() {
    this.ds.startEncoding();
  }

  async addTask(type: TaskType) {
    await this.ds.addTask(type);
    if (!this.ds.task) return;
    await this.router.navigate(['task', this.ds.task.id]);
  }
}
