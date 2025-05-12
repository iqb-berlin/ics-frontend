import { sortEvents } from './api-helper.functions';
import { TaskEvent } from 'iqbspecs-coding-service/interfaces/ics-api.interfaces';
import {versionSatisfies} from './version.functions';

describe('Version Functions', () => {

  describe('versionSatisfies', () => {

    it('should work correctly', () => {
      expect(versionSatisfies('1.0.0', '1.0.0')).toBeTrue();
      expect(versionSatisfies('1.1.0', '1.0.0')).toBeTrue();
      expect(versionSatisfies('1.0.1', '1.0.0')).toBeTrue();
      expect(versionSatisfies('2.0.0', '1.0.0')).toBeFalse();
      expect(versionSatisfies('1.1.0', '1.2.0')).toBeTrue();
      expect(versionSatisfies('1.1.1', '1.1.0')).toBeTrue();
      expect(versionSatisfies('1.1.0', '1.1.1')).toBeTrue();
      expect(versionSatisfies('1.1.0', 'trsh')).toBeFalse();
      expect(versionSatisfies('asdsad', '0.0.0')).toBeFalse();
      expect(versionSatisfies('2.0', '3')).toBeFalse();
      expect(versionSatisfies('3', '1.0')).toBeFalse();
      expect(versionSatisfies('3', '3.000.0000')).toBeTrue();


    });
  });
});
