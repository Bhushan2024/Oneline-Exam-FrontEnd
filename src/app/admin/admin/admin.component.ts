import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, AdminNavbarComponent]
})
export class AdminComponent {

  constructor(private router: Router) {}

  // Navigate to the selected route
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
