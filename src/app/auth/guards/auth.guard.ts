import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { SnotifyService } from 'ng-snotify';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  //user: User;
  constructor(private authService: AuthService, private router: Router, private notify: SnotifyService) {
  }

  canActivate(): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    }
    this.router.navigate(['/']);
    this.notify.warning('Please Sign in first', { timeout: 5000 })
    return false;
  }
  canLoad(route: Route): boolean {
    if (this.authService.isLoggedIn)
      return true;
    else {
      this.notify.warning('Please Sign in first', { timeout: 5000 })
      return false;
    }
  }
}
