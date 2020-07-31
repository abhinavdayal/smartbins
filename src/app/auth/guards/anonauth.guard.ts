import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnonauthGuard implements CanActivate, CanLoad {
  //user: User;
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    }
    this.authService.requestLogin();
    return true;
  }
  canLoad(route: Route): boolean {
    if (this.authService.isLoggedIn)
      return true;
    else {
      this.authService.requestLogin();
      return false;
    }
  }
}
