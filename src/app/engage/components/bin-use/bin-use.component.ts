import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { CrudService } from 'src/app/data/crud.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SmartbinUser, Binusage } from 'src/app/data/models';
import { Observable, Subscription } from 'rxjs';
import { User } from 'firebase';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-bin-use',
  templateUrl: './bin-use.component.html',
  styleUrls: ['./bin-use.component.scss']
})
export class BinUseComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private crud: CrudService, private authService: AuthService, private notify: SnotifyService) { }
  

  binuse: Binusage[];
  binusesub: Subscription;
  usersub: Subscription
  user: SmartbinUser;


  ngOnDestroy(): void {
    if(this.binusesub) this.binusesub.unsubscribe();
    if(this.usersub) this.usersub.unsubscribe();
  }

  ngOnInit(): void {
    this.usersub = this.authService.smartbinUser.subscribe(u => {
      this.user = u;
      this.binusesub = this.crud.FetchBinUse(u.uid).subscribe(a => {
        this.binuse = a;
        console.log(a)
      })
      this.route.params.pipe(take(1)).subscribe(params => {
        if (!!params['encryptedmsg']) {
          // first check if this binusage already exist
          //TODO, see if this timestamp and binid already exist (avoid duplicates)
          this.crud.FetchDuplciateBinUse(1595937020339, '123').pipe(take(1)).subscribe(r=>{
            if(!!r && r.length>0) {
              this.notify.error("This entry is already made", {timeout: 5000})
            } else {
              this.addBinUsage(params['encryptedmsg']);
            }
          })
        }
      })
    })

  }


  private addBinUsage(encryptedmsg: string) {
    let record: Binusage = new Binusage();
    //TODO
    // NON SECURE WAY: to just update it from the frontend after decrypting.
    // we need to call a firebase serverside function that takes this encryptd message, and the user from the request
    // then it decrypts the message and creates a binusage record
    // TODO: decrypt the message to get time t, level l, weight w, bindid, b
    record.bincode = '123';
    record.currentlevel_percent = 45;
    record.currentweight_gm = 346;
    record.time = Date.now();
    // populate other fields
    record.usedby = this.user.uid;
    this.crud.addBinUsage(record);
  }
}
