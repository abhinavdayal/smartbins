import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { CrudService } from 'src/app/data/crud.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SmartbinUser, Binusage } from 'src/app/data/models';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-bin-use',
  templateUrl: './bin-use.component.html',
  styleUrls: ['./bin-use.component.scss']
})
export class BinUseComponent implements OnInit {

  constructor(private route: ActivatedRoute, private crud: CrudService, private authService: AuthService) { }

  binuse$: Observable<Binusage[]>;


  ngOnInit(): void {

    this.route.params.pipe(take(1)).subscribe(params => {
      if (!!params['encryptedmsg']) {
        this.addBinUsage(params['encryptedmsg']);
      }

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
    record.usedby = this.authService.currentUserId;
    this.crud.addBinUsage(record);
  }
}
