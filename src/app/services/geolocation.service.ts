import { Injectable } from '@angular/core';
import { GeoLocation } from '../data/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private _location: BehaviorSubject<GeoLocation> = new BehaviorSubject<GeoLocation>(null)
  private intervalref: any;
  private readonly updateinterval = 60000;

  constructor() {
    
  }

  start() {
    this.getLocations();
    if (!this.intervalref) {
      this.intervalref = setInterval(() => {
        this.getLocations();
      }, this.updateinterval)
    }
  }

  end() {
    if (this.intervalref) clearInterval(this.intervalref)
  }

  get CurrentLocation(): Observable<GeoLocation> {
    return this._location.asObservable();
  }

  getLocations() {
    var positionOption = { enableHighAccuracy: false, maximumAge: Infinity, timeout: 60000 };

    var gpsFailed = function () {
      //use some 3rd party position solution(get position by your device ip)
      // like https://ipstack.com/
      //getPositionBy3rdParty();
      this._location.next(new GeoLocation(0, 0))
    };

    /// locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position => {
        this._location.next(new GeoLocation(position.coords.latitude, position.coords.longitude))
      }), gpsFailed, positionOption);
    }
  }
}
