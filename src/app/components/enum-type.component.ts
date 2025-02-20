import { Component } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel, MatSelect } from '@angular/material/select';
import { isObservable } from "rxjs";


@Component({
  selector: 'formly-array-type',
  template: `
    <div class="mb-3">
      <mat-form-field>
        <mat-label>{{ props.label }}</mat-label>
        <mat-select [multiple]="props['multiple']" [disabled]="props.disabled" [required]="props.required" [placeholder]="props.placeholder || ''">
          @if (typeof props.options !== 'undefined') {
            @let options = isObservable(props.options) ? (props.options | async) : props.options;
            @for (option of options; track option) {
              <mat-option [value]="option.value">{{option.label}}</mat-option>
            }
          }
        </mat-select>
      </mat-form-field>
    </div>
  `,
  imports: [
    FormlyModule,
    CommonModule,
    MatOption,
    MatSelect,
    MatFormField,
    MatLabel
  ]
})
export class EnumTypeComponent extends FieldType {
  public isObservable = isObservable;
}
