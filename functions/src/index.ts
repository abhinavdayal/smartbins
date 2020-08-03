import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    //functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

// NOT SECURE, eventuyally a node service.
class ScanData {
    //secretkey: 'key'
    private readonly key: string = 'b9d538aaa978253be8806966fecd8631';
    private readonly available: string = "#9876543210zyxwvutsrqponmlkjihgfedcba";
    time: number;
    code: string;
    level: number;
    weight: number;

    constructor(message: string) {
        // TODO populate from encrypted message
        let decrypted = ''

        let length = this.available.length;
        for (let i = 0; i < message.length; i++) {
            let k = i % this.key.length
            for (let j = 0; j < length; j++) {
                if (message[i] == this.available[j]) {
                    let index = (this.key[k].charCodeAt(0) + j) % length;
                    decrypted += this.available[index];
                }
            }
        }

        let d = decrypted.split('#')
        this.time = parseInt(d[0])
        this.code = d[1]
        this.level = parseInt(d[2])
        this.weight = parseInt(d[3])
    }

}

function addBinUsage(data: any, scan: any) {
    //functions.logger.log("adding bin usage")
    admin.firestore().collection('BinUsage').add({
        bincode: data.code,
        usedby: scan.uid,
        time: data.time,
        currentlevel_percent: data.level,
        currentweight_gm: data.weight
    });
}

function updateBin(binref: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>, data: any, wtchange: number, scan: any) {
    let bin = { ...binref.data() };
    //functions.logger.log("updating bin ", bin)
    bin.current_level = data.level;
    bin.current_weight = data.weight;
    bin.total_use_count = bin.total_use_count + 1;
    bin.total_weight_thrown = bin.total_weight_thrown + wtchange;
    bin.lastUsed = data.time;
    binref.ref.update(bin);
    if (wtchange < 0 && data.weight == 0) {
        // emptying the bin. Can think of more cases here
        admin.firestore().collection('Users').doc(`${scan.uid}`).get().then(userref => {
            let userdata = { ...userref.data() };
            createMessage(bin.manager, "Bin Emptied", `Your bin ${bin.name} (${bin.code}) is emptied by ${userdata.name}`);
        })
    }
}

function updateUserData(scan: any, wtchange: number, data: ScanData) {
    //functions.logger.log("updating user data")
    admin.firestore().collection('Users').doc(`${scan.uid}`).get().then(userref => {
        let userdata = { ...userref.data() };
        //functions.logger.log("for user ", userdata)
        if (wtchange >= 0) {
            userdata.total_use_count = userdata.total_use_count + 1;
            userdata.total_weight_thrown = userdata.total_weight_thrown + wtchange;
            userdata.lastUsed = data.time
            userref.ref.set(userdata);
            // can customize this later
            createMessage(scan.uid, "Thank You", `You are really doing great! keep it up. This is your use: ${userdata.total_use_count + 1}.`)
        }
        else {
            // wtchange is negative
            // see what to do
            //functions.logger.log("negative weight change")
            userdata.total_use_count = userdata.total_use_count + 1;
            //userdata.total_weight_thrown = userdata.total_weight_thrown + wtchange;
            userdata.lastUsed = data.time
            userref.ref.set(userdata);
            // can customize this later
            createMessage(scan.uid, "Thank You", `You are really doing great! keep it up. This is your use: ${userdata.total_use_count + 1}.`)
        }
    });
}

function updateMonthlyProfile(wtchange: number, data: ScanData, scan: any) {

    let d = new Date();
    let mid = `${scan.uid}-${d.getMonth()}-${d.getFullYear()}`;
    //functions.logger.log("updating monthly profile", mid)
    admin.firestore().collection('MonthlyProfile').doc(`${mid}`).get().then(mpref => {
        if (mpref.exists) {
            let mp = { ...mpref.data() };
            mp.total_use_count = mp.total_use_count + 1;
            mp.total_weight_thrown = mp.total_weight_thrown + wtchange;
            mpref.ref.set(mp);
            updateMonthlyHist(mp.total_use_count)
        }
        else {
            mpref.ref.set({
                month: d.getMonth(),
                year: d.getFullYear(),
                total_use_count: 1,
                total_weight_thrown: data.weight,
                userid: scan.uid
            });
            updateMonthlyHist(1)
        }
    })
}

function updateMonthlyHist(total_use_count: number) {
    let d = new Date();
    let id = `${d.getMonth()}-${d.getFullYear()}`;
    //functions.logger.log("updating monthly histogram ", id)
    admin.firestore().collection('MonthlyHistogram').doc(`${id}`).get().then(href => {
        if (href.exists) {
            let h = { ...href.data() };
            let pband = Math.min(
                h.numbands - 1,
                Math.floor((h.numbands * (total_use_count - 1)) / h.target)
            );
            let cband = Math.min(
                h.numbands - 1,
                Math.floor((h.numbands * total_use_count) / h.target)
            );
            if (pband != cband) {
                h.bands[pband]--;
                h.bands[cband]++;
            }
            href.ref.update(h);
        }
        else {
            let h = {
                month: d.getMonth(),
                year: d.getFullYear(),
                target: 500,
                numbands: 20,
                bands: Array<number>(20).fill(0)
            };
            let cband = Math.min(
                h.numbands - 1,
                Math.floor((h.numbands * total_use_count) / h.target)
            );
            h.bands[cband]++;
            href.ref.set(h);
        }
    });
}


export const processScan = functions.firestore.document('scans/{scanid}').onCreate(event => {
    const scan = { ...event.data() };
    const data = new ScanData(scan.code);
    admin.initializeApp()
    admin.firestore().collection('Bins').doc(data.code).get().then(binref => {
        if (binref.exists) {
            //functions.logger.log(`Bin ref ${data.code} exist:`, binref);
            // get previous usage
            admin.firestore().collection('BinUsage')
                .where('bincode', '==', data.code)
                .orderBy('time', 'desc')
                .limit(1).get().then(u => {
                    //functions.logger.log("finding previous entries: ")
                    let wtchange = 0
                    if (u.empty) {
                        // first usage
                        //functions.logger.log("NO previous entries: ", data.weight)
                        wtchange = data.weight
                    } else {
                        let prevusage = { ...u.docs[0].data() }
                        //functions.logger.log("found previous entry: ", prevusage)
                        // now we have prev usage
                        wtchange = data.weight - prevusage.currentweight_gm
                        // what if this is negative?
                    }
                    addBinUsage(data, scan);
                    updateBin(binref, data, wtchange, scan);
                    updateUserData(scan, wtchange, data);
                    updateMonthlyProfile(wtchange, data, scan);
                })
        } else {
            //functions.logger.log(`Bin ref ${data.code} does not exist:`);
            // message bin doesnt exist
            createMessage(scan.uid, "Invalid Bin", "Your scan data is wrong!")
        }
    })
})

function createMessage(user: string, messagetitle: string, messagebody: string) {
    let d: number = Date.now()
    admin.firestore().collection('messages').doc(`${user}-${d}`).set(
        {
            uid: user,
            title: messagetitle,
            body: messagebody
        }
    )
}

export const notifyUser = functions.firestore.document('messages/{messageId}').onCreate(event => {
    const message = { ...event.data() };
    const userId = message.recipientId;
    admin.initializeApp()
    // message details for end user
    const payload = {
        notification: {
            title: 'New message!',
            body: 'A system notification',
        }
    }

    // ref to the user
    const db = admin.firestore()
    const userRef = db.collection('Users').doc(userId)

    // get user's tokens and send notifications
    return userRef.get()
        .then(snapshot => snapshot.data())
        .then(user => {
            const tokens = !!user && user.fcmTokens ? Object.keys(user.fcmTokens) : []

            if (!tokens.length) {
                throw new Error('User does not have any tokens!')
            }

            return admin.messaging().sendToDevice(tokens, payload)

        }).catch(err => {
            console.log(err)
            //todo se what tikes failed and remove from fcmtokens
        })

})


