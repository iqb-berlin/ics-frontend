import { map, Observable } from 'rxjs';

export const checkCondition = <T>(conditionFn: (value: unknown) => value is T) =>
  (source: Observable<unknown>) =>
    source.pipe(
      map(value => {
        if (!conditionFn(value)) {
          console.log(conditionFn, value);
          throw new Error('Condition not met: ');
        }
        return value;
      })
    );
