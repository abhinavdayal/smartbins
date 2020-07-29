import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { CrudService } from 'src/app/data/crud.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SmartbinUser, Binusage, Bin, MonthlyHistogram, MonthlyProfile, ScanData, COLLECTIONS } from 'src/app/data/models';
import { Observable, Subscription } from 'rxjs';
import { User } from 'firebase';
import { SnotifyService } from 'ng-snotify';
import { DocumentData, DocumentChangeAction, DocumentSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-bin-use',
  templateUrl: './bin-use.component.html',
  styleUrls: ['./bin-use.component.scss']
})
export class BinUseComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private crud: CrudService, private authService: AuthService, private notify: SnotifyService) { }

  currentMonthBinUsage: Binusage[];
  binusesub: Subscription;
  usersub: Subscription
  user: SmartbinUser;
  currentMonthUse: number;
  currentMonthWeight: number;
  monthlyprofiles: MonthlyProfile[]
  monthlyprofilessub: Subscription;
  histogram: MonthlyHistogram
  histogramsub: Subscription;

  ngOnDestroy(): void {
    if (this.binusesub) this.binusesub.unsubscribe();
    if (this.usersub) this.usersub.unsubscribe();
    if (this.histogramsub) this.histogramsub.unsubscribe();
    if (this.monthlyprofilessub) this.monthlyprofilessub.unsubscribe();
  }

  ngOnInit(): void {

    this.usersub = this.authService.smartbinUser.subscribe(u => {
      // same user
      if (!!u && !!this.user && this.user.id == u.id ) return;

      this.user = u;

      if(!u) return;

      this.histogramsub = this.crud.fetchHistogram().subscribe(r => {
        this.histogram = !!r && r.length > 0 ? r[0] : null;
      })

      this.monthlyprofilessub = this.crud.fetchCurrentYearMonthlyProfiles(this.user.id).subscribe(r => {

        this.monthlyprofiles = r;
      })

      this.binusesub = this.crud.FetchCurrentMonthBinUse(u.id).subscribe(a => {
        this.currentMonthBinUsage = a;
        this.calcStats();
        console.log(a)
      })

      this.route.params.pipe(take(1)).subscribe(params => {
        if (!!params['encryptedmsg']) {
          // first check if this binusage already exist
          //TODO, see if this timestamp and binid already exist (avoid duplicates)
          let scandata = new ScanData(params['encryptedmsg'])
          this.VerifyAndUpdate(scandata)
        }
      })
    })

  }



  VerifyAndUpdate(scandata: ScanData) {

    console.log("fetching bin")
    this.crud.findBin(scandata.code).pipe(take(1)).subscribe(b => {
      if (!b || b.length == 0) {
        this.notify.error("The Bin data is incorrect.", { timeout: 5000 })
      } else {
        let bin = b.map(e => { return { id: e.payload.doc.id, ...e.payload.doc.data() } as Bin; })[0];
        console.log("fetching duplicates")
        this.crud.FetchDuplciateBinUse(1595937020339, bin.id).pipe(take(1)).subscribe(r => {
          if (!!r && r.length > 0) {
            this.notify.error("This entry is already made", { timeout: 5000 })
          } else {
            let record = new Binusage(scandata, this.user, bin)
            this.addBinUsage(record, bin);
          }
        })
      }
    })

  }

  calcStats() {
    // calculate overall stats like total times bin throw, totat weight etc.
    this.currentMonthUse = this.currentMonthBinUsage.length;
    this.currentMonthWeight = 0;
    this.currentMonthBinUsage.forEach((b: Binusage) => {
      this.currentMonthWeight += b.currentweight_gm;
    })
  }

  /* TODO: comparitive stats. We need a historgam of frequency of bins used by people.
  // https://firebase.google.com/docs/firestore/solutions/aggregation
  // Firebase does not support aggregation, so we need to create it on the fly
  // as users use it, with every entry we do the following:
  // we keep a histogram for each month with a max target of say 1000 uses of bin in a month
  // we divide this in 20 bins
  */

  private addBinUsage(record: Binusage, bin: Bin) {
    //console.log("adding bin usage")
    //TODO (low priority)
    // NON SECURE WAY: to just update it from the frontend after decrypting.
    // we need to call a firebase serverside function that takes this encryptd message, and the user from the request
    // then it decrypts the message and creates a binusage record
    // TODO: decrypt the message to get time t, level l, weight w, bindid, b
    this.crud.create(record, COLLECTIONS.BINUSAGE);
    //update bin stats
    this.updateBinStats(record, bin);
  }


  private updateBinStats(record: Binusage, bin: Bin) {
    //console.log("fetching recent bin use")
    this.crud.FetchRecentBinUse(bin.id).pipe(take(1)).subscribe(r => {
      let prevwt = 0
      if (!!r && r.length > 0) {
        prevwt = r[0].currentweight_gm;
      }
      bin.current_level = record.currentlevel_percent;
      bin.current_weight = record.currentweight_gm;
      bin.total_use_count++;
      bin.total_weight_thrown += record.currentweight_gm - prevwt;
      //console.log("updating bin", bin)
      this.crud.update(bin, COLLECTIONS.BINS);
       //update monthly profile
       //update user stats
       this.updateUserStats(record, record.currentweight_gm - prevwt);
    })
  }

  private updateUserStats(record: Binusage, weightadded: number) {
    //console.log("updating userstats")
    this.user.total_use_count++;
    this.user.total_weight_thrown += weightadded;
    this.crud.update(this.user, COLLECTIONS.USERS);
    this.updateMonthlyProfile(record, weightadded);
  }

  private updateMonthlyProfile(record: Binusage, weightadded: number) {
    this.crud.fetchMonthlyProfile(this.user.id).pipe(take(1)).subscribe((r: DocumentChangeAction<MonthlyProfile>[]) => {
      let s: MonthlyProfile;
      if (!!r && r.length > 0) {
        // if exists update
        s = r.map(e => { return { id: e.payload.doc.id, ...e.payload.doc.data() } as MonthlyProfile; })[0];
        s.total_use_count++;
        s.total_weight_thrown = weightadded;
        this.crud.update(s, COLLECTIONS.MONTHLYPROFILE);
      }
      else {
        // else create
        s = new MonthlyProfile(this.user);
        s.total_use_count++;
        s.total_weight_thrown = weightadded;
        this.crud.create(s, COLLECTIONS.MONTHLYPROFILE);
      }
      this.updatehist(s);
    });
  }

  updatehist(s: MonthlyProfile) {
    // update histogram data
    this.crud.fetchCurrentHist().pipe(take(1)).subscribe(r => {
      if (!!r && r.length > 0) {
        // update
        let h = r.map(e => { return { id: e.payload.doc.id, ...e.payload.doc.data() } as MonthlyHistogram })[0];
        let pband = Math.min(h.numbands - 1, Math.floor(h.numbands * (s.total_use_count - 1) / h.target))
        let cband = Math.min(h.numbands - 1, Math.floor(h.numbands * (s.total_use_count) / h.target))
        if (pband != cband) {
          h.bands[pband]--;
          h.bands[cband]++;
          this.crud.update(h, COLLECTIONS.MONTHLYHIST)
        }
      } else {
        //create
        let h = new MonthlyHistogram(20, 500); // max 500 uses per month in 20 bands
        let cband = Math.min(h.numbands - 1, Math.floor(h.numbands * (s.total_use_count) / h.target))
        h.bands[cband]++;
        this.crud.create(h, COLLECTIONS.MONTHLYHIST)
      }
    })
  }
}
