import { map, Observable } from 'rxjs';

export const checkCondition = <T>(conditionFn: (value: unknown) => value is T) =>
  (source: Observable<unknown>) =>
    source.pipe(
      map(value => {
        if (!conditionFn(value)) {
          if (Array.isArray(value)) {
            const firstErrorline = value.findIndex(row => !conditionFn([row]));
            console.log(value[firstErrorline]);
            throw new Error(`Condition not met: ${conditionFn.name} (row: ${firstErrorline})`);
          }
          throw new Error('Condition not met: ' + conditionFn.name);
        }
        return value;
      })
    );
