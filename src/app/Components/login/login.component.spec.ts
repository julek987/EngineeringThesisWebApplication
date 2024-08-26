import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoginService } from '../../services/Login/login.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: jasmine.SpyObj<LoginService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['loginUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ RouterTestingModule, FormsModule ],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loginUser and navigate on successful login', () => {
    const mockResponse = { role: 'user' };
    // @ts-ignore
    loginService.loginUser.and.returnValue(of(mockResponse));
    component.username = 'testuser';
    component.password = 'testpass';

    component.onLoginButtonClicked();

    expect(loginService.loginUser).toHaveBeenCalledWith('http://localhost:5282/Auth/login', {
      username: 'testuser',
      password: 'testpass'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/main']);
  });

  it('should handle login failure', () => {
    const mockError = { status: 401, message: 'Unauthorized' };
    loginService.loginUser.and.returnValue(throwError(mockError));
    spyOn(console, 'error');

    component.username = 'testuser';
    component.password = 'wrongpass';

    component.onLoginButtonClicked();

    expect(loginService.loginUser).toHaveBeenCalledWith('http://localhost:5282/Auth/login', {
      username: 'testuser',
      password: 'wrongpass'
    });
    expect(router.navigate).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Login failed:', mockError);
  });
});
