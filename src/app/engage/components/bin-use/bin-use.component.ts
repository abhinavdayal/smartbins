import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take, filter } from 'rxjs/operators';
import { CrudService } from 'src/app/data/crud.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  SmartbinUser,
  Binusage,
  Bin,
  MonthlyHistogram,
  MonthlyProfile,
  ScanData,
  COLLECTIONS,
} from 'src/app/data/models';
import { Subscription } from 'rxjs';
import { SnotifyService } from 'ng-snotify';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

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

  histogram: MonthlyHistogram;
  histogramsub: Subscription;
  relative_histogram_data: Array<number> = [];
  monthly_histogram_data: Array<number> = [];

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;

  ngOnDestroy(): void {
    if (this.binusesub) this.binusesub.unsubscribe();
    if (this.monthlyprofilessub) this.monthlyprofilessub.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.smartbinUser
      .pipe(filter((u) => !!u))
      .pipe(take(1))
      .subscribe((u) => {
        this.user = u;
        this.histogram$ = this.crud.fetchCurrentHist();

        console.log(this.user)
        this.monthlyprofilessub = this.crud
          .fetchCurrentYearMonthlyProfiles(this.user.uid)
          .pipe(take(1))
          .subscribe((r) => {
            this.monthlyprofiles = r;
          });

        this.binusesub = this.crud
          .FetchCurrentMonthBinUse(u.uid)
          .pipe(take(1))
          .subscribe((a) => {
            this.currentMonthBinUsage = a;
            this.calcStats();
            console.log(a);
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

  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartLabels: Label[] = [
    '5',
    '10',
    '15',
    '20',
    '25',
    '30',
    '35',
    '40',
    '45',
    '50',
    '55',
    '60',
    '65',
    '70',
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    {
      data: this.relative_histogram_data,
      label: 'Users Percentage',
    },
  ];

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
  public barChartOptions_two: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartLabels_two: Label[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  public barChartType_two: ChartType = 'bar';
  public barChartLegend_two = true;
  public barChartPlugins_two = [pluginDataLabels];

  public barChartData_two: ChartDataSets[] = [
    {
      data: this.relative_histogram_data,
      label: 'Monthly Usage Of User',
    },
  ];

  calcStats() {
    // calculate overall stats like total times bin throw, totat weight etc.
    this.currentMonthUse = this.currentMonthBinUsage.length;
    this.currentMonthWeight = 0;
    this.currentMonthBinUsage.forEach((b: Binusage) => {
      this.currentMonthWeight += b.currentweight_gm;
    });
  }
}
