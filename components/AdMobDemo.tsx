import React, {useCallback, useEffect, useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = true
  ? TestIds.APP_OPEN
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const App = () => {
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  const loadInterstitial = useCallback(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setInterstitialLoaded(true);
      },
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setInterstitialLoaded(false);
        interstitial.load();
      },
    );

    interstitial.load();

    return () => {
      unsubscribeClosed();
      unsubscribeLoaded();
    };
  }, []);

  useEffect(() => {
    const unsubscribeInterstitialEvents = loadInterstitial();
    return unsubscribeInterstitialEvents;
  }, [loadInterstitial]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {interstitialLoaded ? (
          <Button
            title="Show Interstitial"
            onPress={() => interstitial.show()}
          />
        ) : (
          <Text>Loading Interstitial...</Text>
        )}
      </View>
      <View style={styles.bannerContainer}>
        <BannerAd
          size={BannerAdSize.BANNER}
          unitId={TestIds.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    marginLeft: 20,
  },
});

export default App;
