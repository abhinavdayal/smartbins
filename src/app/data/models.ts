import { User } from 'firebase';

export class SmartbinUser {
    id: string; //firebase id
    uid: string; // google id
    email: string;
    name: string;
    role: string;
    recentLocation: GeoLocation;
    locationUpdated: number;

    constructor(user: User, name?:string) {
        this.uid = user.uid;
        this.email = user.email;
        this.name = !!name? name : user.displayName;
        this.role="user";
    }
 }

export class Bin {
    id: string;
    code: string;
    currentLocation: GeoLocation;
    capacityLitres: number;
    type: string;
    binManager: string;
    resetDate: number;
    lastUsed: number;
}

export class Binusage {
    bincode: string;
    usedby: string;
    time: number;
    currentweight_gm: number;
    currentlevel_percent: number;
}

export class BinWorker {
    userid: string;
    managerid: string;
    binids: Array<string>;
}

export class BinManager {
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