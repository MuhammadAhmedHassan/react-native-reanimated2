import {useCallback, useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

export const useGetFCMToken = () => {
  const saveTokenToDb = useCallback(async (token: string) => {
    const user_id = '10';
    try {
      await fetch('http://localhost:5000/save-token', {
        method: 'POST',
        body: JSON.stringify({token, user_id}),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getToken = useCallback(async () => {
    try {
      // For notifications
      await messaging().registerDeviceForRemoteMessages();
      // Get the device token
      const token = await messaging().getToken();
      console.log('getToken()', token);
      // return saveTokenToDatabase(token);
      saveTokenToDb(token);
    } catch (error) {
      console.log(error);
    }
  }, [saveTokenToDb]);

  const onTokenRefresh = useCallback(() => {
    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      console.log('onTokenRefresh', token);
      // saveTokenToDatabase(token);
    });
  }, []);

  // This useEffect will send the device associated token
  useEffect(() => {
    getToken();
    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }
    return onTokenRefresh();
  }, [getToken, onTokenRefresh]);

  return null;
};
