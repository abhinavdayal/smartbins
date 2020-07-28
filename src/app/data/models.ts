import { User } from 'firebase';

export class SmartbinUser {
    id: string; //firebase id
    uid: string; // google id
    email: string;
    name: string;
    role: string;
    recentLocation: GeoLocation;
    locationUpdated: number;
    total_use_count: number;
    total_weight_thrown: number;

    constructor(user: User, name?: string) {
        this.uid = user.uid;
        this.email = user.email;
        this.name = !!name ? name : user.displayName;
        this.role = "user";
        this.total_use_count = 0;
        this.total_weight_thrown = 0;
    }
}

export class Bin {
    id: string;
    name: string;
    currentLocation: GeoLocation;
    capacityLitres: number;
    type: string;
    manager: string;
    resetDate: number;
    lastUsed: number;
    total_use_count: number;
    total_weight_thrown: number;

    constructor(user: SmartbinUser, capacity: number, type: string, name: string, lat?: number, lon?:number) {
        this.manager = user.id;
        this.name = name;
        this.resetDate = Date.now();
        this.lastUsed = Date.now();
        this.currentLocation= !!lat && !!lon? new GeoLocation(lat, lon) : user.recentLocation;
        this.type=type;
        this.total_use_count = 0;
        this.total_weight_thrown = 0;
        this.capacityLitres = capacity;
    }
}

export class Binusage {
    id: string;
    binid: string;
    usedby: string;
    time: number;
    currentweight_gm: number;
    currentlevel_percent: number;
}

export class BinWorker {
    id: string;
    userid: string;
    managerid: string;
    binids: Array<string>;
}

export class BinManager {
    id: string;
    userid: string;
}

export class GeoLocation {
    latitude: number;
    longitude: number;
    valid: boolean;

    constructor(lat, lon) {
        this.latitude = lat;
        this.longitude = lon;
        this.valid = !(lat == 0 && lon == 0);
    }
}

export class MonthlyProfile {
    id: string;
    month: number;
    year: number;
    userid: string;
    total_use_count: number;
    total_weight_thrown: number;

    constructor(user: SmartbinUser) {
        let d = new Date();
        this.month = d.getMonth();
        this.year = d.getFullYear();
        this.total_use_count = 0;
        this.total_weight_thrown = 0;
        this.userid = user.id;
    }
}

export class MonthlyHistogram {
    id: string;
    month: number;
    year: number;
    target: number;
    numbands: number;
    bands: Array<number>;

    constructor(numbands, target) {
        let d = new Date();
        this.month = d.getMonth();
        this.year = d.getFullYear();
        this.target = target;
        this.numbands = numbands;
        this.bands = Array<number>(numbands).fill(0);
    }
}