export interface User {
    
}

export interface Bin {

}

export interface Binusage {
    
}

export class GeoLocation {
    latitude: number;
    longitude: number;

    constructor(lat, lon) {
        this.latitude = lat;
        this.longitude = lon;
    }
}