import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { NullTypeComponent } from './components/null-type.component';
import { ArrayTypeComponent } from './components/array-type.component';
import { ObjectTypeComponent } from './components/object-type.component';
import { MultiSchemaTypeComponent } from './components/multi-schema-component';
import { EnumTypeComponent } from './components/enum-type.component';


export function minItemsValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should NOT have fewer than ${field.props?.['minItems']} items`;
}

export function maxItemsValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should NOT have more than ${field.props?.['maxItems']} items`;
}

export function minLengthValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should NOT be shorter than ${field.props?.minLength} characters`;
}

export function maxLengthValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should NOT be longer than ${field.props?.maxLength} characters`;
}

export function minValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should be >= ${field.props?.min}`;
}

export function maxValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should be <= ${field.props?.max}`;
}

export function multipleOfValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should be multiple of ${field.props?.step}`;
}

export function exclusiveMinimumValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should be > ${field.props?.['exclusiveMinimum']}`;
}

export function exclusiveMaximumValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should be < ${field.props?.['exclusiveMaximum']}`;
}

export function constValidationMessage(error: any, field: FormlyFieldConfig) {
  return `should be equal to constant "${field.props?.['const']}"`;
}

export function typeValidationMessage({ schemaType }: any) {
  return `should be "${schemaType[0]}".`;
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: 'BASE_PATH',
      useValue: 'http://localhost'
    },
    importProvidersFrom(
      FormlyModule.forRoot(
        {
          validationMessages: [
            { name: 'required', message: 'This field is required' },
            { name: 'type', message: typeValidationMessage },
            { name: 'minLength', message: minLengthValidationMessage },
            { name: 'maxLength', message: maxLengthValidationMessage },
            { name: 'min', message: minValidationMessage },
            { name: 'max', message: maxValidationMessage },
            { name: 'multipleOf', message: multipleOfValidationMessage },
            { name: 'exclusiveMinimum', message: exclusiveMinimumValidationMessage },
            { name: 'exclusiveMaximum', message: exclusiveMaximumValidationMessage },
            { name: 'minItems', message: minItemsValidationMessage },
            { name: 'maxItems', message: maxItemsValidationMessage },
            { name: 'uniqueItems', message: 'should NOT have duplicate items' },
            { name: 'const', message: constValidationMessage },
            { name: 'enum', message: `must be equal to one of the allowed values` },
          ],
          types: [
            { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
            { name: 'array', component: ArrayTypeComponent },
            { name: 'object', component: ObjectTypeComponent },
            { name: 'multischema', component: MultiSchemaTypeComponent },
            { name: 'enum', component: EnumTypeComponent },
          ],
        }
      )
    )
  ]
};
