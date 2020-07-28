import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { latLng, tileLayer, marker, icon, circle } from 'leaflet';
import { GeoLocation } from 'src/app/data/models';

//https://asymmetrik.com/ngx-leaflet-tutorial-angular-cli/

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {

  @Input() bins: Array<any> = [];
  @Input() getlocation: boolean = false;
  @Output() latlong: EventEmitter<GeoLocation> = new EventEmitter<GeoLocation>();
  clickpoint = circle([0, 0], { radius: 10 })
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }), this.clickpoint
    ],
    zoom: 17,
    center: latLng([16.566642, 81.52180])
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['bins']) {
    //   let change = changes['bins'];
    //   console.log(change.currentValue, this.options.layers)
    //   if (!!change.currentValue && change.currentValue.length > 0) {
    //     if (this.options.layers.length == 2) {
    //       this.options.layers.push(change.currentValue[0])
    //     } else {
    //       this.options.layers.splice(2, 1, change.currentValue[0])
    //     }
    //   }
    // }
  }

  ngOnInit(): void {
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
