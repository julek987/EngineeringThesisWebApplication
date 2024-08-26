import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'isAdmin', 'isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch component and emit event', () => {
    spyOn(component.componentSelected, 'emit');

    component.switchComponent('bestsellers');
    expect(component.activeComponent).toBe('bestsellers');
    expect(component.componentSelected.emit).toHaveBeenCalledWith('bestsellers');
  });

  it('should call logout and navigate to home on logout button click', () => {
    component.logOutButtonClicked();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should return true if user is admin', () => {
    authService.isAdmin.and.returnValue(true);

    expect(component.isAdmin()).toBeTrue();
    expect(authService.isAdmin).toHaveBeenCalled();
  });

  it('should return false if user is not admin', () => {
    authService.isAdmin.and.returnValue(false);

    expect(component.isAdmin()).toBeFalse();
    expect(authService.isAdmin).toHaveBeenCalled();
  });

  it('should return true if user is logged in', () => {
    authService.isLoggedIn.and.returnValue(true);

    expect(component.isLoggedIn()).toBeTrue();
    expect(authService.isLoggedIn).toHaveBeenCalled();
  });

  it('should return false if user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);

    expect(component.isLoggedIn()).toBeFalse();
    expect(authService.isLoggedIn).toHaveBeenCalled();
  });
});
