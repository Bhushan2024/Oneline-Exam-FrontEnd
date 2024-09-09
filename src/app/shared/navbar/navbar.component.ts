import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentRole: string | null = null;

  constructor(
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Listen for login status changes
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });

    // Listen for role changes
    this.authService.role.subscribe(role => {
      this.currentRole = role;
    });

    // Listen for route changes to update the navbar accordingly
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.authService.checkAuthentication();  // Recheck authentication on every route change
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
