import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { SnotifyService } from 'ng-snotify';
import { AlertService } from './services/alert-service.service';
import { GeolocationService } from './services/geolocation.service';
import { GeoLocation } from './data/models';
import { AuthService } from './auth/services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'smartbins';
  promptEvent: any;
  location: GeoLocation = new GeoLocation(30, 50);

  constructor(private snotifyService: SnotifyService, private swUpdate: SwUpdate,
    private router: Router, private alertService: AlertService, private swPush: SwPush,
    private geolocationService: GeolocationService, private authService: AuthService
  ) {
    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });

    this.geolocationService.CurrentLocation.subscribe((l: GeoLocation) => {
      this.location = l;
    })


    // notify user to update progressive app if update available
    this.swUpdate.available.subscribe((event) => {
      if (window.confirm("An update is available, do you want to reload?")) {
        window.location.reload();
      }
    })

    this.alertService.getAlert().subscribe(r => {
      if (r) {
        if (r.type == "error")
          this.snotifyService.error(r.text)
        else if (r.type == "success")
          this.snotifyService.success(r.text)
        else this.snotifyService.simple(r.text)
      }
    })
  }

  loggedin = false;
  logingoogle() {
    this.authService.loginWithGoogle().then(() => {
      console.log(localStorage.getItem('user'))
      this.loggedin = true;
    })
  }

  logout() {
    this.authService.logout().then(() => {
      this.loggedin = false;
    })
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
    this.location = new GeoLocation(30, 50);
  }
}
