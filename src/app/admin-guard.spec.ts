import { AdminGuard } from './admin-guard';

describe('AdminGuard', () => {
  it('should create an instance', () => {
    // @ts-ignore
    expect(new AdminGuard()).toBeTruthy();
  });
});
