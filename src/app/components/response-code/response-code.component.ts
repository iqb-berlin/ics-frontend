import {Component, Input} from '@angular/core';
import {isResponseRow, ResponseRow} from '../../interfaces/api.interfaces';
import {KeyValuePipe, PercentPipe} from '@angular/common';

@Component({
  selector: 'app-response-code',
  imports: [
    KeyValuePipe,
    PercentPipe
  ],
  templateUrl: './response-code.component.html',
  styleUrl: 'response-code.component.css'
})
export class ResponseCodeComponent {
  @Input({transform: (value: unknown): ResponseRow | undefined => {
    console.log(value);
    return isResponseRow(value) ? value : undefined;
  }}) response: ResponseRow | undefined;

  color(i: number): string {
    const q = i % 3;
    const r = i % 6;
    const p = (r + 1) % 3
    const c = [0, 0, 0];
    c[q] = 255;
    if (q != r) {
      c[p] = 255;
    }
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.8)`
  }
}
