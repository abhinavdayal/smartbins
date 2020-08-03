import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take, filter } from 'rxjs/operators';
import { CrudService } from 'src/app/data/crud.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  SmartbinUser,
  Binusage,

  MonthlyHistogram,
  MonthlyProfile,

  COLLECTIONS,
} from 'src/app/data/models';
import { Subscription } from 'rxjs';
import { SnotifyService } from 'ng-snotify';
import { AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-bin-use',
  templateUrl: './bin-use.component.html',
  styleUrls: ['./bin-use.component.scss'],
})
export class BinUseComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private crud: CrudService,
    private authService: AuthService,
    private notify: SnotifyService
  ) {}

  currentMonthBinUsage: Binusage[] = [];
  binusesub: Subscription;
  usersub: Subscription;
  user: SmartbinUser;
  currentMonthUse: number;
  currentMonthWeight: number;
  monthlyprofiles: MonthlyProfile[];
  monthlyprofilessub: Subscription;
  histogram$: AngularFirestoreDocument<MonthlyHistogram>;
  monthy_data: any;
  histogram: MonthlyHistogram;
  histogramsub: Subscription;
  relative_histogram_data: Array<number> = [];
  monthly_histogram_data: Array<number> = [];
  value = 50;

  ngOnDestroy(): void {
    if (this.binusesub) this.binusesub.unsubscribe();
    if (this.monthlyprofilessub) this.monthlyprofilessub.unsubscribe();
  }

  ngOnInit(): void {
    let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    this.authService.smartbinUser
      .pipe(filter((u) => !!u))
      .pipe(take(1))
      .subscribe((u) => {
        this.user = u;
        this.histogram$ = this.crud.fetchCurrentHist();

        //console.log(this.user)
        this.monthlyprofilessub = this.crud
          .fetchCurrentYearMonthlyProfiles(this.user.uid)
          .pipe(take(1))
          .subscribe((r) => {
            this.monthlyprofiles = r;
            console.log(r);
            let chartdata = [];
            this.monthlyprofiles.forEach(m=>{
              chartdata.push([months[m.month], m.total_use_count])
            })
            this.monthy_data = chartdata
          });

        this.binusesub = this.crud
          .FetchCurrentMonthBinUse(u.uid)
          .pipe(take(1))
          .subscribe((a) => {
            this.currentMonthBinUsage = a;
            
            this.calcStats();
            //console.log(a);
          });

        this.route.params.pipe(take(1)).subscribe((params) => {
          if (!!params['encryptedmsg']) {
            // first check if this binusage already exist
            //TODO, see if this timestamp and binid already exist (avoid duplicates)
            this.VerifyAndUpdate(params['encryptedmsg']);
          }
        });
      });
  }

  VerifyAndUpdate(scandata: string) {
    console.log('fetching bin');
    this.crud.FetchScan(scandata).pipe(take(1)).subscribe(d=>{
      if (!!d && d.length>0) {
        this.notify.error('The is already scanned.', { timeout: 5000 });
      } else {
        this.crud.create({
          code: scandata,
          uid: this.user.uid
        }, COLLECTIONS.SCANS)
      }
    })
  }
 
  calcStats() {
    // calculate overall stats like total times bin throw, totat weight etc.
    this.currentMonthUse = this.currentMonthBinUsage.length;
    this.currentMonthWeight = 0;
    this.currentMonthBinUsage.forEach((b: Binusage) => {
      this.currentMonthWeight += b.currentweight_gm;
    });
  }
}
