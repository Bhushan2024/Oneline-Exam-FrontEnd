// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { CookieService } from 'ngx-cookie-service';
// import { JwtHelperService } from '@auth0/angular-jwt';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private loggedIn = new BehaviorSubject<boolean>(false);
//   private currentRole = new BehaviorSubject<string | null>(null);

//   constructor(private cookieService: CookieService, private jwtHelper: JwtHelperService) {
//     this.checkAuthentication();
//   }

//   checkAuthentication() {
//     const token = this.cookieService.get('token');
//     if (token && !this.jwtHelper.isTokenExpired(token)) {
//       this.loggedIn.next(true);
//       const decodedToken = this.jwtHelper.decodeToken(token);
//       this.currentRole.next(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
//     } else {
//       this.loggedIn.next(false);
//       this.currentRole.next(null);
//     }
//   }

//   get isLoggedIn() {
//     return this.loggedIn.asObservable();
//   }

//   get role() {
//     return this.currentRole.asObservable();
//   }

//   logout() {
//     this.cookieService.delete('token', '/');
//     this.loggedIn.next(false);
//     this.currentRole.next(null);
//   }

//   login(token: string) {
//     this.cookieService.set('token', token, { path: '/' });
//     this.checkAuthentication();
//   }
// }

  import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentRole = new BehaviorSubject<string | null>(null);

  constructor(private cookieService: CookieService, private jwtHelper: JwtHelperService) {
    this.checkAuthentication();
  }

  // Check if the user is authenticated based on the token
  checkAuthentication() {
    const token = this.cookieService.get('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.loggedIn.next(true);
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.currentRole.next(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
    } else {
      this.loggedIn.next(false);
      this.currentRole.next(null);
    }
  }

  // Observable for login status
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // Observable for the current role
  get role() {
    return this.currentRole.asObservable();
  }

  // Logout and delete the token
  logout() {
    this.cookieService.delete('token', '/');
    this.loggedIn.next(false);
    this.currentRole.next(null);
  }

  // Login by setting the token and checking authentication
  login(token: string) {
    this.cookieService.set('token', token, { path: '/' });
    this.checkAuthentication();
  }

  // New function to get the user ID from the decoded JWT token
  getUserId(): string | null {
    const token = this.cookieService.get('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      // Extract the user ID from the token
      return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
    }
    return null;
  }
}

