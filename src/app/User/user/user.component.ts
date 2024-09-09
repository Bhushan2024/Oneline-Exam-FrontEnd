import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  imports: [NavbarComponent]
})
export class UserComponent {

  constructor(private router: Router) { }

  goToExam() {
    this.router.navigate(['/exam']); // Assuming exam route is set
  }

  goToResults() {
    this.router.navigate(['/exam-result']); // Assuming results route is set
  }

  goToProfile() {
    this.router.navigate(['/profile']); // Assuming profile route is set
  }
}
