import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

export const processScan = functions.firestore.document('scans/{scanid}').onCreate(event=>{
    const scan = event.data();
    //scan.userid
    //scan.encryptedcode

    // DO ALL THE THINGS
    // decode 
    // check if bin exists
    // if duplicate
    // add binusage
    // admin.firestore().collection('Bins/121233eghhj').doc().
    // update bin stats
    // update user stats
    // update monthly profile
    // update monthly histogram

    //if there is and error we send a message frm system to the user in a message collection

    // send a success or error message to user
    mid = Date.now().toString()
    //admin.firestore().collection('messages/{mid}').doc().set({})
})

export const notifyUser = functions.firestore.document('messages/{messageId}').onCreate(event => {
    const message = event.data();
    const userId = message.recipientId;

    // message details for end user
    const payload = {
        notification: {
            title: 'New message!',
            body: '${message.sender} You have a new message',
            icon: 'icon url'
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
