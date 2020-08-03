import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

// NOT SECURE, eventuyally a node service.
class ScanData {
    //secretkey: 'key'
    time: number;
    code: string;
    level: number;
    weight: number;

    constructor(encryptedmsg: string) {
        // TODO populate from encrypted message
        this.time = 1595937020 * 1000; // to convert to millisecond
        this.code = 'abcd1234'
        this.level = 45
        this.weight = 365
    }
}

function addBinUsage(data: any, scan: any) {
    admin.firestore().collection('BinUsage').add({
        bincode: data.code,
        usedby: scan.uid,
        time: data.time,
        currentlevel_percent: data.level,
        currentweight_gm: data.weight
    });
}

function updateBin(binref: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>, data: any, wtchange: number, scan:any) {
    let bin = { ...binref.data() };
    binref.ref.set({
        current_level: data.level,
        current_weight: data.weight,
        total_use_count: bin.total_use_count + 1,
        total_weight_thrown: bin.total_weight_thrown + wtchange,
        lastUsed: data.time
    });
    if(wtchange<0 && data.weight==0) {
        // emptying the bin. Can think of more cases here
        admin.firestore().collection(`Users/${scan.uid}`).doc().get().then(userref => {
            let userdata = { ...userref.data() };
            createMessage(bin.manager, "Bin Emptied",  `Your bin ${bin.name} (${bin.code}) is emptied by ${userdata.name}`);
        })
    }
}

function updateUserData(scan: any, wtchange: number, data: ScanData) {
    admin.firestore().collection(`Users/${scan.uid}`).doc().get().then(userref => {
        let userdata = { ...userref.data() };
        if (wtchange >= 0) {
            userref.ref.set({
                total_use_count: userdata.total_use_count + 1,
                total_weight_thrown: userdata.total_weight_thrown + wtchange,
                lastUsed: data.time,
            });
            // can customize this later
            createMessage(scan.uid, "Thank You", `You are really doing great! keep it up. This is your use: ${userdata.total_use_count + 1}.`)
        }
        else {
            // wtchange is negative
            // see what to do
        }
    });
}

function updateMonthlyProfile(wtchange: number, data: ScanData, scan: any) {
    let d = new Date();
    let mid = `${scan.uid}-${d.getMonth()}-${d.getFullYear()}`;
    admin.firestore().collection(`MonthlyProfile/${mid}`).doc().get().then(mpref => {
        if (mpref.exists) {
            let mp = { ...mpref.data() };
            mpref.ref.set({
                total_use_count: mp.total_use_count + 1,
                total_weight_thrown: mp.total_weight_thrown + wtchange
            });
            updateMonthlyHist(mp.total_use_count + 1)
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
    admin.firestore().collection(`MonthlyHistogram/${id}`).doc().get().then(href => {
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
            href.ref.set(h);
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
    const data = new ScanData(scan.code)

    admin.firestore().collection(`Bins/${data.code}`).doc().get().then(binref => {
        if (binref.exists) {
            // get previous usage
            admin.firestore().collection('BinUsage')
                .where('bincode', '==', data.code)
                .orderBy('time', 'desc')
                .limit(1).get().then(u => {
                    let wtchange = 0
                    if (u.empty) {
                        // first usage
                        wtchange = data.weight
                    } else {
                        let prevusage = { ...u.docs[0].data() }
                        // now we have prev usage
                        wtchange = data.weight - prevusage.currentweight_gm
                        // what if this is negative?

                        addBinUsage(data, scan);
                        updateBin(binref, data, wtchange, scan);
                        updateUserData(scan, wtchange, data);
                        updateMonthlyProfile(wtchange, data, scan);
                    }
                })
        } else {
            // message bin doesnt exist
            createMessage(scan.uid, "Invalid Bin", "Your scan data is wrong!")
        }
    })
})

function createMessage(user: string, messagetitle: string, messagebody: string) {
    let d: number = Date.now()
    admin.firestore().collection(`messages/${user}-${d}`).doc().set(
        {
            title: messagetitle,
            body: messagebody
        }
    )
}

export const notifyUser = functions.firestore.document('messages/{messageId}').onCreate(event => {
    const message = {...event.data()};
    const userId = message.recipientId;

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


