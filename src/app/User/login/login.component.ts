import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [CookieService]  // Provide the CookieService
})
export class LoginComponent {

  loginForm: FormGroup;
  submitted = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private cookieService: CookieService  // Inject CookieService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const loginData = this.loginForm.value;

    this.userService.login(loginData).subscribe({
      next: (response) => {
        // Store the token in cookies
        this.cookieService.set('token', response.token, {
          expires: new Date(response.expiresOn),
          secure: true,  // Ensure it's only sent over HTTPS
          sameSite: 'Strict'  // Prevent CSRF
        });

        // Redirect based on role
        if (response.roles.includes('Admin')) {
          this.router.navigate(['/admin-dashboard']);
        } else if (response.roles.includes('User')) {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Login failed. Please try again.';
      }
    });
  }
}
