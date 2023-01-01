import messaging from '@react-native-firebase/messaging';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

/**
 * IF we're using firebase
 * You may also notice that the token is being added
 * via the FieldValue.arrayUnion method.
 * A user can have more than one token
 * (for example using 2 devices) so it's
 * important to ensure that we store all
 * tokens in the database.
 */
// export async function saveTokenToDatabase(token) {
//   // Assume user is already signed in
//   const userId = auth().currentUser.uid;

//   // Add the token to the users datastore
//   await firestore()
//     .collection('users')
//     .doc(userId)
//     .update({
//       tokens: firestore.FieldValue.arrayUnion(token),
//     });
// }
