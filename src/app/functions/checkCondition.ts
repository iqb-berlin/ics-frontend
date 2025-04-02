import { map, Observable } from 'rxjs';
import { debugTypeguard } from '../interfaces/iqb.interfaces';

export const checkCondition = <T>(conditionFn: (value: unknown) => value is T) =>
  (source: Observable<unknown>) =>
    source.pipe(
      map(value => {
        if (!conditionFn(value)) {
          throw new Error('Condition not met: ' + conditionFn.name);
        }
        return value;
      })
    );
