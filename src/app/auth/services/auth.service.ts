import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from 'firebase';
import { Observable, BehaviorSubject } from 'rxjs';

// https://www.techiediaries.com/angular-firebase/angular-9-firebase-authentication-email-google-and-password/

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  get User():Observable<User> {
    return this._user.asObservable();
  }
  constructor(public afAuth: AngularFireAuth, public router: Router) {
    this.afAuth.authState.subscribe(user => {
      console.log(user);
      this._user.next(user);
      if(!!user) localStorage.setItem("STATUS", user.uid)
      else localStorage.removeItem("STATUS");
    })
  }



  async login(email: string, password: string) {
    var result = await this.afAuth.signInWithEmailAndPassword(email, password)
  }

  async register(email: string, password: string) {
    var result = await this.afAuth.createUserWithEmailAndPassword(email, password)
    this.sendEmailVerification();
  }

  async sendEmailVerification() {
    await (await this.afAuth.currentUser).sendEmailVerification()
    this.router.navigate(['admin/verify-email']);
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
  }

  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem("STATUS");
  }

  async loginWithGoogle() {
    await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
  }
}
