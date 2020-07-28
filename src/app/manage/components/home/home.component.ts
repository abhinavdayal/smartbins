import { Component, OnInit } from '@angular/core';
import { GeoLocation, SmartbinUser, Bin } from 'src/app/data/models';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/data/crud.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { marker, icon } from 'leaflet';
import { elementAt } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private route: ActivatedRoute, private crud: CrudService, private authService: AuthService, private notify: SnotifyService) { }

  usersub: Subscription
  user: SmartbinUser;
  bins: Array<Bin>;
  binsub: Subscription;
  sidenav: any;
  addpanel: any;
  nbinname: string = '';
  addmenu: boolean = false;
  mapbins = [];
  nbincapacity : number = 50;
  nbintype: string = 'domestic';
  bintypes = ['domestic', 'public', 'industrial']
  selectedloc: GeoLocation = new GeoLocation(0, 0)
  getlocation: boolean = false;
  details: any;
  selectedbin: Bin;

  ngOnDestroy(): void {
    if (this.binsub) this.binsub.unsubscribe();
    if (this.usersub) this.usersub.unsubscribe();
  }

  ngOnInit(): void {

    this.usersub = this.authService.smartbinUser.subscribe(u => {
      this.user = u;

      if (!this.user) return;


      this.binsub = this.crud.fetchMyBins(this.user.id).subscribe(r => {

        if (!!r && r.length > 0) {
          this.bins = r.map(e => { return { id: e.payload.doc.id, ...e.payload.doc.data() } as Bin });

          let b = []
          this.bins.forEach(bin => {
            b.push(marker([bin.currentLocation.latitude, bin.currentLocation.longitude], {
              icon: icon({
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                iconUrl: 'leaflet/marker-icon.png', // TODO: get right images and sizes based on data
                shadowUrl: 'leaflet/marker-shadow.png'
              }),
            }).bindTooltip(bin.name).bindPopup(`<p><strong>times used</strong>: ${bin.total_use_count}</p><p><strong>weight taken</strong>: ${bin.total_weight_thrown}</p>`));
          });

          this.mapbins = b;
          // TODO: calc some stats like total bin count, total bin capacity, total usage, weight etc.
          // and display them appropriately
        } else {
          this.bins = []
        }
      })
    })

  }

  addBin(name: string, lat: number, lon: number, capacity: number, type: string) {
    let b = new Bin(this.user, capacity, type, name, lat, lon);
    this.crud.create(b, 'Bins');
  }

  deleteBin(bin) {
    this.crud.delete(bin, 'Bins');
  }

  updateBin(bin) {
    //TODO, think of what to update
    this.crud.update(bin, 'Bins');
  }

}
