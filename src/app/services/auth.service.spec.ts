import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get role', () => {
    service.setRole('user');
    expect(service.getRole()).toBe('user');
  });

  it('should return null if role is not set', () => {
    expect(service.getRole()).toBeNull();
  });

  it('should identify admin role correctly', () => {
    service.setRole('admin');
    expect(service.isAdmin()).toBeTrue();
  });

  it('should return false for isAdmin if role is not admin', () => {
    service.setRole('user');
    expect(service.isAdmin()).toBeFalse();
  });

  it('should return true if a user is logged in', () => {
    service.setRole('user');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if no user is logged in', () => {
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should clear role on logout', () => {
    service.setRole('admin');
    service.logout();
    expect(service.getRole()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });
});
