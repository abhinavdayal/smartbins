import { User } from 'firebase';

export class  COLLECTIONS {
    static readonly USERS = 'Users';
    static readonly BINS = 'Bins';
    static readonly BINUSAGE = 'BinUsages';
    static readonly MONTHLYPROFILE = 'MonthlyProfiles';
    static readonly MONTHLYHIST = 'MonthlyHistograms';
}

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
    code: string;
    name: string;
    currentLocation: GeoLocation;
    capacityLitres: number;
    type: string;
    manager: string;
    resetDate: number;
    lastUsed: number;
    total_use_count: number;
    total_weight_thrown: number;
    current_level: number;
    current_weight: number;

    constructor(code: string, user: SmartbinUser, capacity: number, type: string, name: string, lat?: number, lon?:number) {
        this.code = code;
        this.manager = user.id;
        this.name = name;
        this.resetDate = Date.now();
        this.lastUsed = Date.now();
        this.currentLocation= !!lat && !!lon? new GeoLocation(lat, lon) : user.recentLocation;
        this.type=type;
        this.total_use_count = 0;
        this.total_weight_thrown = 0;
        this.current_level = 0;
        this.current_weight = 0;
        this.capacityLitres = capacity;
    }
}

// NOT SECURE, eventuyally a node service.
export class ScanData {
    //secretkey: 'key'
    time: number;
    code: string;
    level: number;
    weight: number;

    constructor(encryptedmsg) {
        // TODO populate from encrypted message
        this.time = 1595937020*1000; // to convert to millisecond
        this.code = 'abcd1234'
        this.level = 45
        this.weight = 365
    }
}

export class Binusage {
    id: string;
    binid: string;
    usedby: string;
    time: number;
    currentweight_gm: number;
    currentlevel_percent: number;

    constructor(data: ScanData, user: SmartbinUser, bin: Bin) {
        //TODO: popylate from ecryoted message
        this.binid = bin.id;
        this.usedby = user.id
        this.time = data.time
        this.currentlevel_percent = data.level
        this.currentweight_gm = data.weight
    }
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