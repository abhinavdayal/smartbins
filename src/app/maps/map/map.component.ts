import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer } from 'leaflet';

//https://asymmetrik.com/ngx-leaflet-tutorial-angular-cli/

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 7,
    center: latLng([ 46.879966, -121.726909 ])
  };

  constructor() { }

  ngOnInit(): void {
  }

}