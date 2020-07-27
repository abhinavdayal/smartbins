export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
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