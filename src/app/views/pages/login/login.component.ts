import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../../cores/services/auth.service';
import { APIServiceService } from '../../../../cores/services/apiservice.service';
import {
  User,
  UserRegisterDto,
  UserRegisterResponse,
} from '../../../../cores/models/User';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    FormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  showLoginModal = false;
  showRegisterModal = false;
  showHomeBackground = true;

  confirmPassword = '';
  passwordMismatch = false;

  registerModel: UserRegisterDto = this.newUser();

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiservices: APIServiceService
  ) {}

  // HEADER ACTIONS
  switchToLogin(): void {
    this.showRegisterModal = false;
    this.showLoginModal = true;
  }

  goHome(): void {
    this.showHomeBackground = true;
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  // LOGIN
  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard'], { replaceUrl: true }),
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Invalid username or password';
      },
    });
  }

  // REGISTER
  register(): void {
    // if (this.registerModel.password.length < 6) {
    //   alert('Password must be at least 6 characters');
    //   return;
    // }

    // if (this.registerModel.password !== this.confirmPassword) {
    //   alert('Passwords do not match');
    //   return;
    // }

    this.apiservices.registerUser(this.registerModel).subscribe({
      next: (res) => {
        alert(`Registered successfully as ${res.user.role}`);
        this.registerModel = this.newUser();
        this.confirmPassword = '';
        this.showRegisterModal = false;
      },
      error: (err) => {
        alert(err.error?.message || 'Registration failed');
      },
    });
  }

  // Helper method to create a new User object

  private newUser(): UserRegisterDto {
    return {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      phoneNumber: '',
    };
  }
}
