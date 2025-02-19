import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../services/data.service';
import { filter } from 'rxjs';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(
    public readonly snackBar: MatSnackBar,
    private readonly ds: DataService
  ) {
    this.ds.errors$
      .pipe(
        filter(isError => !!isError)
      )
      .subscribe(e => this.showError(e));
  }

  showError(error: string) {
    this.snackBar.open(error, 'OK', {
      duration: 10000,
    });
  }
}
