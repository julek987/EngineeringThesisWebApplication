import { AuthGuard } from './auth-guard';

describe('AuthGuard', () => {
  it('should create an instance', () => {
    // @ts-ignore
    expect(new AuthGuard()).toBeTruthy();
  });
});
