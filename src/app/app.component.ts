import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { SnotifyService } from 'ng-snotify';
import { CrudService } from './data/crud.service'

import { AuthService } from './auth/services/auth.service';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators'
import { SmartbinUser, GeoLocation } from './data/models';
import { GeolocationService } from './services/geolocation.service'
import { DocumentChangeAction } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './dialogs/login-dialog/login-dialog.component';
import { ProfileDialogComponent } from './dialogs/profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'smartbins';
  promptEvent: any;
  user: User;
  binUser: SmartbinUser;
  curloc: GeoLocation;

  constructor(private snotifyService: SnotifyService, private swUpdate: SwUpdate,
    private router: Router, private swPush: SwPush,
    private authService: AuthService, private crud: CrudService, private geoloc: GeolocationService,
    public dialog: MatDialog
  ) {
    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });

    // notify user to update progressive app if update available
    this.swUpdate.available.subscribe((event) => {
      if (window.confirm("An update is available, do you want to reload?")) {
        window.location.reload();
      }
    })
  }

  logingoogle() {
    this.authService.loginWithGoogle();
  }

  logoutrequested = false;

  logout() {
    this.logoutrequested = true;
    this.authService.logout();
  }

  installPwa(): void {
    this.promptEvent.prompt();
  }

  toggleNotifications() {
    // this.snotifyService.simple("Hi there");
    // return;
    // if (!this.notifications_sub_status) {
    //   this.swPush.requestSubscription({
    //     serverPublicKey: this.VAPID_PUBLIC_KEY
    //   })
    //     .then(sub => {
    //       console.log("subscribed with", sub)
    //       this.notification_sub = sub;
    //       this.authService.updatePushSubscriber(sub).pipe(take(1)).subscribe()
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       this.openSnackBar("Could not subscribe to notifications", "OK")
    //     }
    //     );
    // } else {

    //   console.log("unsubscribing", this.notification_sub)
    //   this.authService.updatePushSubscriber(this.notification_sub, "unsubscribe").pipe(take(1)).subscribe(() => {
    //     this.swPush.unsubscribe().then(() => {
    //       this.notification_sub = null;
    //     })
    //   })
    // }

    // this.swPush.messages.subscribe((m: any) => {
    //   console.log("push message", m);
    //   this.snotifyService.info(m.body)
    // })
    // this.swPush.notificationClicks.subscribe(
    //   ({ action, notification }) => {
    //     // TODO: Do something in response to notification click.
    //     console.log(action, notification)
    //   });
    // this.swPush.subscription.subscribe((s: PushSubscription) => {
    //   console.log("subscription", s)
    //   this.notifications_sub_status = s && (!s.expirationTime || s.expirationTime > Date.now());
    //   this.notification_sub = s;
    // })
  }

  ngOnInit(): void {

    this.geoloc.CurrentLocation.subscribe(l => {
      this.curloc = l;
      this.updateUserLoc(l);
    })

    this.authService.smartbinUser.subscribe(u => {
      if (!!u) {
        this.geoloc.start()
      } else (this.geoloc.end())
      this.binUser = u;
    });



    this.authService.User.subscribe((u: User) => {
      this.user = u;
      if (!this.user) {
        if (!this.logoutrequested) this.openLoginDialog();
      } else {
        // get or create firebase user
        this.crud.FetchUser(u.uid).subscribe((r: DocumentChangeAction<SmartbinUser>[]) => {
          //this.snotifyService.success("loggedin", {timeout: 5000});
          if (!!r && r.length > 0) {
            // fetch user
            console.log(r);
            let s = r.map(e => { return { id: e.payload.doc.id, ...e.payload.doc.data() } as SmartbinUser })[0];
            this.authService.setSmartbinUser(s);
          } else {
            // create a new user
            let s = new SmartbinUser(u);
            s.recentLocation = this.curloc;
            s.locationUpdated = Date.now();
            this.crud.create(s, "User")
          }
        }), error => {
          console.log(error)
        }

      }
    })

  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.logoutrequested = false;
      if (result == "anonymous") {
        this.authService.anonymousLogin();
      } else if (result == "google") {
        this.logingoogle();
      }
    });
  }

  openProfileDialog(): void {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.authService.linkWithGoogle(this.user).then(u => {
          //console.log(u);
          u.user.updateProfile({ displayName: result })
          let s = new SmartbinUser(u.user, result);
          s.recentLocation = this.curloc;
          s.locationUpdated = Date.now();
          s.id = this.binUser.id;
          this.crud.update(s, "User")
          this.authService.setSmartbinUser(s);
        }).catch((e) => {
          //console.log(e);
          if (e.code == 'auth/credential-already-in-use') {
            // TODO. move all of user's data to this one and delete this user
            // way is to take anon user uid and fetch all usage data. and move to newly created user.
            this.snotifyService.warning("You already have an account. Please signin using that account. You will lose your", { timeout: 10000 });
            this.authService.SigninWithCredentials(e.credential);
          }
        })
      }
    });
  }

  private updateUserLoc(l: GeoLocation) {
    if (!!this.binUser) {
      this.binUser.recentLocation = l;
      this.binUser.locationUpdated = Date.now();
      console.log(this.binUser)
      if (!this.binUser.name && !!this.user.displayName)
        this.binUser.name = this.user.displayName;
      this.crud.update(this.binUser, "User");
    }
  }

  changeuser() {
    this.authService.loginWithGoogle();
  }
}


// QR CODE FORMAT
// ime in unix epoch format
// https://smart-bins-vitb.firebase-app.io/engage/binuse/encryptedmessage
// t=1595921336&l=65&w=1467&bid=kjsdfyiu23