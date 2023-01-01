import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

export const useFCMMessagesListener = () => {
  // This useEffect will listen for incoming notifications
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      if (!remoteMessage.data) {
        return;
      }
      try {
        const owner = JSON.parse(remoteMessage.data.owner);
        const user = JSON.parse(remoteMessage.data.user);
        const picture = JSON.parse(remoteMessage.data.picture);

        console.log(
          `The user "${user.name}" liked your picture "${picture.name}"`,
          owner,
        );
      } catch (error) {
        console.log(error);
      }
    });

    return unsubscribe;
  }, []);

  return null;
};
