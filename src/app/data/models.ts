import { User } from 'firebase';

export class SmartbinUser {
    id: string;
    uid: string;
    email: string;
    name: string;
    role: string;
    recentLocation: GeoLocation;
    locationUpdated: number;

    constructor(user: User) {
        this.uid = user.uid;
        this.email = user.email;
        this.name = user.displayName;
    }
 }

export interface Bin {
    id: string
    code: string;
    currentLocation: GeoLocation;
    capacityLitres: number;
    type: string,
    binManager: string;
    resetDate: number;
    lastUsed: number;
}

export interface Binusage {
    bincode: string;
    usedby: string;
    time: number;
    currentweight_gm: number;
    currentlevel_percent: number;
}

export interface BinWorker {
    userid: string;
    managerid: string;
    binids: Array<string>;
}

export interface BinManager {
    userid: string;
}

export class GeoLocation {
    latitude: number;
    longitude: number;
    valid: boolean;

    constructor(lat, lon) {
        this.latitude = lat;
        this.longitude = lon;
        this.valid = !(lat==0 && lon==0);
    }
}