import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { SnotifyService } from 'ng-snotify';
import { AlertService } from './services/alert-service.service';


import { AuthService } from './auth/services/auth.service';
import { User } from 'firebase';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'smartbins';
  promptEvent: any;
  user$: Observable<User>;

  constructor(private snotifyService: SnotifyService, private swUpdate: SwUpdate,
    private router: Router, private alertService: AlertService, private swPush: SwPush,
    private authService: AuthService
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
    this.user$ = this.authService.User;
  }
}
