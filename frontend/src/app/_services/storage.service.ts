import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  save(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Retrieve a value from localStorage
  get(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  // Clear a specific item from localStorage
  clear(key: string): void {
    localStorage.removeItem(key);
  }

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Clear all stored values (optional, use cautiously)
  clearAll(): void {
    localStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
   
    if (user.token) {
      window.sessionStorage.setItem('auth-token', user.token);
      console.log('Token saved:', user.token); // Confirm token is present and being set
    } else {
      console.log('Token not found in user object'); // Debug when token is missing
    }
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem('auth-token');
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : {};
  }

  public isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  public clean(): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.removeItem('auth-token');
    window.sessionStorage.clear();
  }
}
