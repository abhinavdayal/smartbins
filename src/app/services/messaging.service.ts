import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';
import { SnotifyService } from 'ng-snotify';
import { COLLECTIONS } from '../data/models'

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private messaging = firebase.messaging()

  private messageSource = new Subject()
  currentMessage = this.messageSource.asObservable()

  constructor(private afs: AngularFirestore, private notify: SnotifyService) { }

  getPermission(user) {
    this.messaging.requestPermission().then(() => {
      // Get Instance ID token. Initially this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.
      this.notify.success("Notifications permission granted.");
      return this.messaging.getToken()
    })
      .then(token => this.saveToken(user, token))
      .catch((err) => {
        console.log(err, 'Unable to get permission');
        this.notify.error("Unable to get notification permission");
      });
  }

  monitorRefresh(user) {
    // Callback fired if Instance ID token is updated.
    this.messaging.onTokenRefresh(() => {
      this.messaging.getToken().then((refreshedToken) => {
        console.log('Token refreshed.');
        this.saveToken(user, refreshedToken);
      }).catch((err) => {
        console.log('Unable to retrieve refreshed token ', err);
      });
    });
  }

  // used to show message when the app is open
  receiveMessages() {
    this.messaging.onMessage(payload => {
      console.log('Message received. ', payload);
      this.messageSource.next(payload);
    })
  }

  private saveToken(user, token): void {
    const currentTokens = user.fcmTokens || {}
    console.log(currentTokens, token)

    if (!currentTokens[token]) {
      const userRef = this.afs.collection(COLLECTIONS.USERS).doc(user.id)
      const tokens = { ...currentTokens, [token]: true }
      userRef.update({ fcmTokens: tokens })
    }
  }
}
