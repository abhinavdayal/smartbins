import { Component, OnInit } from '@angular/core';
import { GeoLocation, SmartbinUser, Bin, COLLECTIONS } from 'src/app/data/models';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/data/crud.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { marker, icon, LatLng } from 'leaflet';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private route: ActivatedRoute, private crud: CrudService,
    private authService: AuthService, private notify: SnotifyService) { }

  user: SmartbinUser;
  bins: Array<Bin>;
  binsub: Subscription;
  sidenav: any;
  addpanel: any;
  nbinname: string = '';
  addmenu: boolean = false;
  mapbins = [];
  nbincapacity: number = 50;
  nbintype: string = 'domestic';
  nbincode: string = '';
  bintypes = ['domestic', 'public', 'industrial']
  selectedloc: GeoLocation = new GeoLocation(0, 0)
  getlocation: boolean = false;
  details: any;
  selectedbin: Bin;

  ngOnDestroy(): void {
    if (this.binsub) this.binsub.unsubscribe();
  }

  updateloc(e: GeoLocation) {
    setTimeout(() => {
      this.selectedloc = e;
    }, 10);
  }

  ngOnInit(): void {
    this.authService.smartbinUser.pipe(filter(u => !!u)).pipe(take(1)).subscribe(u => {
      this.user = u;

      console.log(u)
      this.binsub = this.crud.fetchMyBins(this.user.uid).subscribe(r => {
        if (!!r && r.length > 0) {
          this.bins = r.map(e => { return { id: e.payload.doc.id, ...e.payload.doc.data() } as Bin });

          let b = []
          this.bins.forEach((bin, i) => {
            b.push(marker([bin.currentLocation.latitude, bin.currentLocation.longitude], {
              alt: bin.code,
              draggable: true,
              icon: icon({
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                iconUrl: this.getIcon(bin), // TODO: get right images and sizes based on data
                shadowUrl: 'leaflet/marker-shadow.png'
              }),
            }).bindTooltip(bin.name).
              bindPopup(this.getPopup(bin)).on('dragend', (r) => {
                this.updatelocation(r.target.options.alt, r.target.getLatLng())
              }));
          });

          this.mapbins = b;
          // TODO: calc some stats like total bin count, total bin capacity, total usage, weight etc.
          // and display them appropriately
        } else {
          this.mapbins = [];
        }
      })
    })
  }

  updatelocation(code: any, location: LatLng) {
    let bin$ = this.crud.get(code, COLLECTIONS.BINS)
    bin$.get().pipe(take(1)).subscribe(r => {
      if (r.exists) {
        bin$.update(this.crud.deepCopy(
          { 
            currentLocation: new GeoLocation(location.lat, location.lng) 
          }
        ))
      } else {
        this.notify.error("This bin does not exist", { timeout: 5000 });
      }
    })
  }


  getIcon(bin: Bin): string {
    return 'leaflet/marker-icon.png'; //TODO based on bin level icon must change
  }

  // info to show on map on point click
  private getPopup(bin: Bin) {
    //TODO
    return `
<p><strong>Level</strong>: ${bin.current_level}</p>
<p><strong>Weight</strong>: ${bin.current_weight}</p>`;
  }

  addBin(code, name: string, lat: number, lon: number, capacity: number, type: string) {
    let b = new Bin(code, this.user, capacity, type, name, lat, lon);
    let bin$ = this.crud.get(code, COLLECTIONS.BINS)
    bin$.get().pipe(take(1)).subscribe(r => {
      if (r.exists) {
        this.notify.error("This bin is already there", { timeout: 5000 });
      } else {
        bin$.set(this.crud.deepCopy(b));
      }
    })
  }

  deleteBin(bin) {
    this.crud.delete(bin, COLLECTIONS.BINS);
  }

  updateBin(bin) {
    //TODO, think of what to update
    this.crud.update(bin, COLLECTIONS.BINS);
  }

}
