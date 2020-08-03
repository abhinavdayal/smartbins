import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { SnotifyService } from 'ng-snotify';
import { CrudService } from './data/crud.service'

import { AuthService } from './auth/services/auth.service';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { take, filter } from 'rxjs/operators'
import { SmartbinUser, GeoLocation, COLLECTIONS } from './data/models';
import { GeolocationService } from './services/geolocation.service'
import { MessagingService } from './services/messaging.service'
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './dialogs/login-dialog/login-dialog.component';
import { ProfileDialogComponent } from './dialogs/profile-dialog/profile-dialog.component';
import { ScannerComponent } from './dialogs/scanner/scanner.component';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'smartbins';
  promptEvent: any;
  firebaseuser: User;
  user: SmartbinUser;
  curloc: GeoLocation;


  readonly VAPID_PUBLIC_KEY = "BKzrzNzpjVEzg_nuywGafdKAzXiHqSWVTJ5Y0pOGC5FXfhI0BZ2Zan1T1_8bXq49-Euo8DNqsOSsDqXbF_EX9o8";

  constructor(private snotifyService: SnotifyService, private swUpdate: SwUpdate,
    private router: Router, private swPush: SwPush,
    private authService: AuthService, private crud: CrudService, private geoloc: GeolocationService,
    public dialog: MatDialog, private msg: MessagingService,private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'twitter',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/twitter.svg'));


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

  get mobile() {
    return this.authService.mobile;
  }

  logingoogle() {
    this.authService.loginWithGoogle();
  }


  logout() {
    this.geoloc.end();
    this.authService.logout();
    this.user = null;
    this.firebaseuser = null;
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
    // todo, show icon on left
    this.msg.currentMessage.subscribe((m: any) => {
      this.snotifyService.html(`
      <div class="snotifyToast__title"><b>${m.notification.title}</b></div>
      <div class="snotifyToast__body">${m.notification.body}</div>
      `, { timeout: 10000 })
    })

    this.authService.LoginRequested.subscribe(r => {
      if (r) this.openLoginDialog();
    })

    this.geoloc.CurrentLocation.subscribe(l => {
      this.authService.updateSmartbinUser(
        {
          recentLocation: l,
          locationUpdated: Date.now()
        }
      )
    })

    this.authService.User.pipe(filter(user => !!user)).pipe(take(1))
      .subscribe(user => {
        this.msg.getPermission(user)
        this.msg.monitorRefresh(user);
        this.msg.receiveMessages();
        this.authService.getSmartbinUser(user)
      })

    this.authService.smartbinUser.pipe(filter(user => !!user)).pipe(take(1))
      .subscribe(u => {
        console.log("here")
        this.geoloc.start()
        this.user = u;
      })

  }

  openScannerDialog(): void {
    const dialogRef = this.dialog.open(ScannerComponent);
    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == "anonymous") {
        this.authService.anonymousLogin();
      } else if (result == "google") {
        this.logingoogle();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  openProfileDialog(): void {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.user.isAnonymous) {
        if (!!result) {
          this.authService.linkWithGoogle(this.firebaseuser).then(u => {
            //console.log(u);
            this.RenameUser(result, u);
          }).catch((e) => {
            //console.log(e);
            if (e.code == 'auth/credential-already-in-use') {
              // TODO. move all of user's data to this one and delete this user
              // way is to take anon user uid and fetch all usage data. and move to newly created user.
              this.snotifyService.warning("You already have an account. Please signin using that account.", { timeout: 10000 });
              //this.authService.SigninWithCredentials(e.credential);
            }
          })
        }
      } else {
        this.RenameUser(result);
      }
    });
  }

  private RenameUser(name: any, u?: any) {
    this.user.name = name;
    if (!!u) {
      this.user.email = u.user.email;
      this.authService.updateSmartbinUser({
        name: name,
        email: u.user.email
      });
    } else {
      this.authService.updateSmartbinUser({
        name: name
      });
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