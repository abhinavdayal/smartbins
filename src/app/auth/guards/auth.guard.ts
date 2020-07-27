import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  //user: User;
  constructor(private authService: AuthService, private router: Router) {
  }
  
  canActivate(): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
  canLoad(route: Route): boolean {
    return this.authService.isLoggedIn ? true : false;
  }
}
