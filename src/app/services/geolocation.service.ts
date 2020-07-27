import { Injectable } from '@angular/core';
import { GeoLocation } from '../data/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private _location: BehaviorSubject<GeoLocation> = new BehaviorSubject<GeoLocation>(null)

  constructor() { }

  get CurrentLocation(): Observable<GeoLocation> {
    return this._location.asObservable();
  }

  getLocations() {
    var positionOption = { enableHighAccuracy: false, maximumAge: Infinity, timeout: 60000 };

    var gpsFailed = function () {
      //use some 3rd party position solution(get position by your device ip)
      // like https://ipstack.com/
      //getPositionBy3rdParty();
    };

    /// locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position => {
        this._location.next(new GeoLocation(position.coords.latitude, position.coords.longitude))
      }), gpsFailed, positionOption);
    }
  }
}
