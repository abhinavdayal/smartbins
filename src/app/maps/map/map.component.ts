import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import { latLng, tileLayer, circle } from 'leaflet';
import { GeoLocation } from 'src/app/data/models';
import { Subscription } from 'rxjs';
import { GeolocationService } from 'src/app/services/geolocation.service';

//https://asymmetrik.com/ngx-leaflet-tutorial-angular-cli/

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() bins: Array<any> = [];
  @Input() getlocation: boolean = false;
  @Output() latlong: EventEmitter<GeoLocation> = new EventEmitter<
    GeoLocation
  >();
  currentloc: GeoLocation = new GeoLocation(0, 0);
  geosub: Subscription;
  clickpoint = circle([0, 0], { radius: 10 });
  // '' /assets/icons/dustbin_marker
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
      this.clickpoint,
    ],
    zoom: 17,
    center: latLng([16.566642, 81.5218]),
  };

  constructor(private geoloc: GeolocationService) {}

  ngOnDestroy(): void {
    if (this.geosub) this.geosub.unsubscribe();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.geosub = this.geoloc.CurrentLocation.subscribe((l) => {
        this.currentloc = l;
        this.clickpoint.setLatLng({ lat: l.latitude, lng: l.longitude });
        this.latlong.emit(l);
      });
    }, 10);
  }

  handleclick(e) {
    //console.log(e)
    if (this.getlocation) {
      let g = new GeoLocation(e.latlng.lat, e.latlng.lng);
      this.latlong.emit(g);
      this.clickpoint.setLatLng(e.latlng);
    }
  }
}
