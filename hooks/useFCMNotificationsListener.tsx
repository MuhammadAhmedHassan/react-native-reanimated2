import messaging from '@react-native-firebase/messaging';
import {useCallback, useEffect} from 'react';

export const useFCMNotificationsListener = () => {
  const getInitialNotification = useCallback(async () => {
    try {
      // Check whether an initial notification is available
      const remoteMessage = await messaging().getInitialNotification();
      if (!remoteMessage) {
        return;
      }
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
      // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    getInitialNotification();
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    return messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
    });
  }, [getInitialNotification]);

  return null;
};
