import { isResponseRow } from './api.interfaces';

describe('Api Interfaces Typeguards', () => {

  it('should be correct', () => {
    const minimal = {
      code: null,
      id: "MD2",
      score: null,
      setId: "auto",
      status: "DERIVE_ERROR",
      subform: null,
      value: null
    };
    expect(isResponseRow(minimal)).toBe(true);
  });
});
