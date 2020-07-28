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

  constructor(private snotifyService: SnotifyService, private swUpdate: SwUpdate,
    private router: Router, private swPush: SwPush,
    private authService: AuthService, private crud: CrudService, private geoloc: GeolocationService
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

  logout() {
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
      if (!!this.binUser) {
        this.binUser.recentLocation = l;
        this.binUser.locationUpdated = Date.now();
        this.crud.updateUserLoc(this.binUser);
      }
    })

    this.authService.smartbinUser.subscribe(u => {
      this.binUser = u;
    });

    this.authService.User.subscribe((u: User) => {
      this.user = u;
      if (!this.user) {
        this.authService.anonymousLogin();
      } else {
        // get or create firebase user
        this.crud.FetchUser(u.email).subscribe((r: DocumentChangeAction<SmartbinUser>[]) => {
          if (!!r && r.length > 0) {
            // fetch user
            this.authService.setSmartbinUser(r.map(e => { return { id: e.payload.doc.id, ...e.payload.doc.data() } })[0]);
          } else {
            // create a new user
            this.crud.CreateUser(new SmartbinUser(u))
          }
        }), error => {
          console.log(error)
        }
      }
    })

  }

  linkanonymous() {
    this.authService.linkWithGoogle(this.user);
  }

  changeuser() {
    this.authService.loginWithGoogle();
  }
}
