import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from 'firebase';
import { Observable, Subject} from 'rxjs';
import { SnotifyService } from 'ng-snotify';
import { SmartbinUser } from 'src/app/data/models';

// https://www.techiediaries.com/angular-firebase/angular-9-firebase-authentication-email-google-and-password/

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _smartbinUser: Subject<SmartbinUser> = new Subject<SmartbinUser>();

  get smartbinUser(): Observable<SmartbinUser> {
    return this._smartbinUser.asObservable();
  }

  setSmartbinUser(u: SmartbinUser) {
    this._smartbinUser.next(u)
  }

  get User():Observable<User> {
    return this.afAuth.user;
  }

  constructor(public afAuth: AngularFireAuth, public router: Router, private notify: SnotifyService) {
    this.afAuth.authState.subscribe(user => {
      console.log("AUTH SERVICE")
      if(!!user) localStorage.setItem("STATUS", user.uid)
      else localStorage.removeItem("STATUS");
    })
  }

  async linkWithGoogle(user: User) {
    user.linkWithPopup(new auth.GoogleAuthProvider()).catch((e)=>{
      console.log(e);
      if(e.code == 'auth/credential-already-in-use') {
        this.afAuth.signInAndRetrieveDataWithCredential(e.credential).catch((e)=>{
          this.notify.error(e.message, { timeout: 5000  })
        });
      }
    })
  }

  async anonymousLogin() {
    return this.afAuth.signInAnonymously().catch((e)=>{
      console.log(e);
      this.notify.error(e.message, { timeout: 5000  })
    })
    
  }

  async login(email: string, password: string) {
    var result = await this.afAuth.signInWithEmailAndPassword(email, password).catch((e)=>{
      console.log(e);
      this.notify.error(e.message, { timeout: 5000  })
    })
  }

  async register(email: string, password: string) {
    var result = await this.afAuth.createUserWithEmailAndPassword(email, password).catch((e)=>{
      console.log(e);
      this.notify.error(e.message, { timeout: 5000  })
    })
    this.sendEmailVerification();
  }

  async sendEmailVerification() {
    await (await this.afAuth.currentUser).sendEmailVerification().catch((e)=>{
      console.log(e);
      this.notify.error(e.message, { timeout: 5000  })
    })
    this.router.navigate(['auth/verify-email']);
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.sendPasswordResetEmail(passwordResetEmail).catch((e)=>{
      console.log(e);
      this.notify.error(e.message, { timeout: 5000  })
    });
  }

  async logout() {
    await this.afAuth.signOut().catch((e)=>{
      console.log(e);
      this.notify.error(e.message, { timeout: 5000  })
    });
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem("STATUS");
  }

  async loginWithGoogle() {
    await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).catch((e)=>{
      console.log(e);
      this.notify.error(e.message, { timeout: 5000  })
    })
  }
}
