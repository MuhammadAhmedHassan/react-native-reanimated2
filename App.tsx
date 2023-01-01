import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useFCMMessagesListener} from './hooks/useFCMMessagesListener';
import {useFCMNotificationsListener} from './hooks/useFCMNotificationsListener';
import {useGetFCMToken} from './hooks/useGetFCMToken';

// FieldValue.arrayUnion
// A user can have more than one token
// (for example using 2 devices) so it's important
// to ensure that we store all tokens in the database.

const App = () => {
  useGetFCMToken();
  useFCMMessagesListener();
  useFCMNotificationsListener();

  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
