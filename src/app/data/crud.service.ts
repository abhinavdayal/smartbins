import { Injectable } from '@angular/core';
//import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object
import { SmartbinUser, Binusage } from './models'
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SnotifyService } from 'ng-snotify';

@Injectable({
  providedIn: 'root'
})
export class CrudService {


  addBinUsage(record: Binusage) {
    return this.db.collection('Binuse').add(this.deepCopyFunction(record)).then((d)=>{
      //console.log(d)
    }).catch((e)=>{
      //console.log(e)
      this.notify.error(e.message, {timeout: 5000});
    })
  }


  constructor(private db: AngularFirestore, private notify: SnotifyService) { }

  deepCopyFunction(inObject: any) {
    let outObject, value, key
  
    if (typeof inObject !== "object" || inObject === null) {
      return inObject // Return the value if inObject is not an object
    }
  
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}
  
    for (key in inObject) {
      value = inObject[key]
  
      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = this.deepCopyFunction(value)
    }
  
    return outObject
  }


  CreateUser(record: any) {
    //console.log("Creating User", record)
    // used ... to convert to plain object
    // https://stackoverflow.com/questions/54171903/function-collectionreference-add-requires-its-first-argument-to-be-of-type-obj
    return this.db.collection('Users').add(this.deepCopyFunction(record)).then((d)=>{
      //console.log(d)
    }).catch((e)=>{
      //console.log(e)
      this.notify.error(e.message, {timeout: 5000});
    })
  }

  FetchUser(email: string): Observable<DocumentChangeAction<SmartbinUser>[]> {
    return this.db.collection<SmartbinUser>('Users', ref => {
      return ref.where("email", "==", email)
    }).snapshotChanges()
  }

  updateUserLoc(binUser: SmartbinUser) {
    this.db.doc('Users/' + binUser.id).update(this.deepCopyFunction(binUser));
  }

}
