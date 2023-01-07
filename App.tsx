import {Alert, Button, SafeAreaView, StyleSheet, Text} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useStripe} from '@stripe/stripe-react-native';
import {appFetch} from './utils/app-fetch';

const App = () => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = useCallback(async () => {
    const {paymentIntent, ephemeralKey, customer} = await appFetch({
      url: '/payment-sheet',
      method: 'POST',
    });
    console.log('paymentIntent, ephemeralKey, customer');
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  }, []);

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams();

    console.log(paymentIntent, ephemeralKey, customer);

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      // setupIntentClientSecret: setupIntent,
      paymentIntentClientSecret: paymentIntent,
    });
    if (!error) {
      console.log(error);
      setLoading(true);
    }
  };

  useEffect(() => {
    // appFetch({url: '/create-customer'});
    // initializePaymentSheet();
  }, []);

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      initializePaymentSheet();
      Alert.alert(
        'Success',
        'Your payment method is successfully set up for future payments!',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>App</Text>
      <Button
        // disabled={!loading}
        title="Get Payment Sheet Params"
        onPress={initializePaymentSheet}
      />
      <Button disabled={!loading} title="Set up" onPress={openPaymentSheet} />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'space-around',
    width: '80%',
  },
});
