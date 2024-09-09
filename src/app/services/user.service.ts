import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interface for user registration
export interface RegisterModel {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;  // Optional role field with default value
}

// Interface for user login
export interface LoginModel {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private authUrl = `${environment.apiUrl}/auth`; // URL for auth-related requests
  private userUrl = `${environment.apiUrl}/User`; // URL for user-related requests

  constructor(private http: HttpClient) { }

  // Register a new user
  register(user: RegisterModel): Observable<any> {
    if (!user.role) {
      user.role = 'User';  // Set the default role to "User"
    }
    return this.http.post(`${this.authUrl}/register`, user);
  }

  // User login
  login(user: LoginModel): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, user);
  }

  // Fetch user details by ID
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/GetUserById/${userId}`);
  }
}