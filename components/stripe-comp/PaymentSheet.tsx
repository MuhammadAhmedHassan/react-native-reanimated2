import {StripeProvider, usePaymentSheet} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {Button, Image, Text, View, Alert, StyleSheet} from 'react-native';
import {appFetch} from '../../utils/app-fetch';
import {MERCHANT_ID} from './Constants';

let counter = 1;

type PaymentSheetParams = {
  paymentIntent: string | null;
  ephemeralKey?: string;
  customer: string;
};

export const PaymentSheet = ({
  goBack,
  publishableKey,
}: {
  goBack: () => void;
  publishableKey: string;
}) => {
  const [ready, setReady] = useState(false);
  const [paymentSheetParams, setPaymentSheetParams] =
    useState<null | PaymentSheetParams>(null);
  const {
    initPaymentSheet,
    presentPaymentSheet,
    loading,
    resetPaymentSheetCustomer,
  } = usePaymentSheet();

  useEffect(() => {
    (async () => {
      const {paymentIntent, ephemeralKey, customer} = await appFetch({
        url: '/payment-sheet',
        method: 'POST',
        body: {
          email: 'bingo99.5@yopmail.com',
        },
      });

      setPaymentSheetParams({
        paymentIntent,
        ephemeralKey,
        customer,
      });
    })();
  }, []);

  useEffect(() => {
    if (!paymentSheetParams?.paymentIntent) {
      return;
    }
    initPaymentSheet({
      customerId: paymentSheetParams.customer,
      customerEphemeralKeySecret: paymentSheetParams.ephemeralKey,
      appearance: {
        //   colors: {
        //     primary: '#e06c75',
        //     background: '#282c34',
        //     componentBackground: '#abb2bf',
        //     componentDivider: '#e5c07b',
        //     primaryText: '#61afef',
        //     secondaryText: '#c678dd',
        //     componentText: '#282c34',
        //     icon: '#e06c75',
        //     placeholderText: '#ffffff',
        //   },
        // shapes: {
        //   borderRadius: 25,
        // },
      },
      paymentIntentClientSecret: paymentSheetParams.paymentIntent,
      merchantDisplayName: 'Broker Free Real Property',
      style: 'alwaysLight',
      // applePay: {
      //   merchantCountryCode: 'US',
      // },
      // googlePay: {
      //   merchantCountryCode: 'US',
      //   testEnv: true,
      //   currencyCode: 'usd',
      // },
      // allowsDelayedPaymentMethods: true,
      returnURL: 'admobreactnative://stripe-redirect',
    }).then(({error}) => {
      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        setReady(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentSheetParams]);

  async function buy() {
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'The payment was confirmed successfully');
      setReady(false);
    }
  }

  console.log('re-render', counter++);

  return (
    <View style={styles.container}>
      <StripeProvider
        publishableKey={publishableKey}
        merchantIdentifier={MERCHANT_ID}>
        <Text>1 kg of Sweet Potatoes</Text>
        <Image source={require('./potato.jpeg')} style={styles.image} />

        <View style={styles.buttons}>
          <Button title={'Go back'} onPress={goBack} />
          <Button title={'Buy'} onPress={buy} disabled={loading || !ready} />
        </View>
        <Button title={'Logout'} onPress={resetPaymentSheetCustomer} />
      </StripeProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 100,
  },
  image: {
    height: 250,
    width: 250,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
  },
});
