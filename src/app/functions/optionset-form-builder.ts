import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { JsonFormControl, JsonFormValidators } from '../interfaces/optionset.interfaces';

export const createAngularFormsControl = (fb: FormBuilder, control: JsonFormControl): {  name: string, control: FormControl | FormArray } => {
  const validators: ValidatorFn[] = Object.entries(control.validators)
    .map(getValidators)
    .filter(v => !!v);
  return (control.controlElementType === 'array')
    ? {
      name: control.name,
      control: fb.array([], validators),
    }
    : {
      name: control.name,
      control: fb.control(control.value, validators)
    };
}


const getValidators = ([key, value]: [string, unknown]) => {
  switch (key as keyof JsonFormValidators) {
    case 'min':
      return Validators.min(Number(value));
    case 'max':
      return Validators.max(Number(value));
    case 'required':
      return value ? Validators.required : null;
    case 'requiredTrue':
      return value ? Validators.requiredTrue : null;
    case 'email':
      return value ? Validators.email : null;
    case 'minLength':
      return Validators.minLength(Number(value));
    case 'maxLength':
      return Validators.maxLength(Number(value));
    case 'pattern':
      return value ? Validators.pattern(String(value)) : null;
    case 'nullValidator':
      return value ? Validators.nullValidator : null;
    case 'jsonValidate':
      return value ?
        (control: AbstractControl): ValidationErrors | null => {
          const value = control.value;
          try {
            JSON.parse(value);
          } catch (e) {
            if (e instanceof SyntaxError) {
              return {'json': e.message}
            } else {
              return {'json-unknown': e}
            }
          }
          return null;
        } :
        null;
    default:
      return null;
  }
}
