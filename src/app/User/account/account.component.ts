import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  standalone: true,
  imports:[CommonModule, NavbarComponent]
})
export class AccountComponent implements OnInit {
  userData: any = null;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    // Get the user ID from the token
    const userId = this.authService.getUserId();
    if (userId) {
      // Fetch user data from the API
      this.userService.getUserById(userId).subscribe((data) => {
        this.userData = data;
      });
    }
  }

}
