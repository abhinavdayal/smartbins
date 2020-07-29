import { Injectable } from '@angular/core';
//import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object
import { SmartbinUser, Binusage, Bin, MonthlyHistogram, MonthlyProfile, COLLECTIONS } from './models'
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SnotifyService } from 'ng-snotify';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private db: AngularFirestore, private notify: SnotifyService) { }

  create(record: any, collection: string) {
    return this.db.collection(collection).add(this.deepCopyFunction(record)).then((d) => {
      //console.log(d)
    }).catch((e) => {
      //console.log(e)
      this.notify.error(e.message, { timeout: 5000 });
    })
  }


  update(record: any, collection: string) {
    //this.db.doc(`${collection}/${record.id}`).update(this.deepCopyFunction(record));
    //console.log(record)
    return this.db.collection(collection).doc(record.id).update(this.deepCopyFunction(record)).catch(e => {
      this.notify.error(e.message)
    })
  }

  delete(record: any, collection: string) {
    return this.db.doc(`${collection}/${record.id}`).delete();
  }

  fetch(id: string, collection: string) {
    return this.db.doc(`${collection}/${id}`).get();
  }

  fetchHistogram() {
    let d = new Date();
    return this.db.collection<MonthlyHistogram>(COLLECTIONS.MONTHLYHIST, ref => {
      return ref.where("month", "==", d.getMonth()).where("year", "==", d.getFullYear())
    }).valueChanges()
  }

  fetchCurrentHist() {
    let d = new Date();
    return this.db.collection<MonthlyHistogram>(COLLECTIONS.MONTHLYHIST, ref => {
      return ref.where("month", "==", d.getMonth()).where("year", "==", d.getFullYear())
    }).snapshotChanges()
  }

  fetchCurrentYearMonthlyProfiles(userid: string) {
    let d = new Date();
    return this.db.collection<MonthlyProfile>(COLLECTIONS.MONTHLYPROFILE, ref => {
      return ref.where("month", "==", d.getMonth()).where("year", "==", d.getFullYear()).where("userid", "==", userid)
    }).valueChanges()
  }

  fetchMonthlyProfile(userid: string) {
    let d = new Date();
    return this.db.collection<MonthlyProfile>(COLLECTIONS.MONTHLYPROFILE, ref => {
      return ref.where("month", "==", d.getMonth()).where("year", "==", d.getFullYear()).where("userid", "==", userid)
    }).snapshotChanges()
  }


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


  FetchCurrentMonthBinUse(id: string): Observable<Binusage[]> {
    let s = new Date();
    let monthbeginning = new Date(s.getFullYear(), s.getMonth(), 1, 0, 0, 0, 0)

    let start = Date.now() - monthbeginning.valueOf();
    return this.db.collection<Binusage>(COLLECTIONS.BINUSAGE, ref => {
      return ref.where("usedby", "==", id).where("time", ">=", start)
    }).valueChanges()
  }

  fetchMyBins(id: string) {
    return this.db.collection<Bin>(COLLECTIONS.BINS, ref => {
      return ref.where("manager", "==", id)
    }).snapshotChanges()
  }

  findBin(code: string) {
    return this.db.collection<Bin>(COLLECTIONS.BINS, ref => {
      return ref.where("code", "==", code)
    }).snapshotChanges()
  }

  FetchDuplciateBinUse(timestamp: number, binid: string): Observable<Binusage[]> {
    return this.db.collection<Binusage>(COLLECTIONS.BINUSAGE, ref => {
      return ref.where("time", "==", timestamp).where("binid", "==", binid)
    }).valueChanges()
  }

  FetchRecentBinUse(binid) {
    return this.db.collection<Binusage>(COLLECTIONS.BINUSAGE, ref => {
      return ref.where("binid", "==", binid).orderBy("time", "desc").limit(1)
    }).valueChanges()
  }

  FetchUser(uid: string): Observable<DocumentChangeAction<SmartbinUser>[]> {
    return this.db.collection<SmartbinUser>(COLLECTIONS.USERS, ref => {
      return ref.where("uid", "==", uid)
    }).snapshotChanges()
  }

}
