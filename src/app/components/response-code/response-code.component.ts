import {Component, Input} from '@angular/core';
import { PercentPipe} from '@angular/common';
import { ResponseRow } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import { isResponseRow } from 'iqbspecs-coding-service/functions/ics-api.typeguards';

@Component({
  selector: 'app-response-code',
  imports: [
    PercentPipe
  ],
  templateUrl: './response-code.component.html',
  styleUrl: 'response-code.component.css'
})
export class ResponseCodeComponent {
  @Input({
    transform: (value: unknown): ResponseRow | undefined => isResponseRow(value) ? value : undefined
  }) response: ResponseRow | undefined;

  color(code: number | string | undefined): string {
    const i = Number(code);
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

  protected readonly parseInt = parseInt;
}
