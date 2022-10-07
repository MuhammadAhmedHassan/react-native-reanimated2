import mobileAds, {MaxAdContentRating} from 'react-native-google-mobile-ads';

export class AdMobService {
  static async initialize() {
    try {
      await mobileAds().setRequestConfiguration({
        // Update all future requests suitable for parental guidance
        maxAdContentRating: MaxAdContentRating.PG,

        // Indicates that you want your content treated as child-directed for purposes of COPPA.
        tagForChildDirectedTreatment: true,

        // Indicates that you want the ad request to be handled in a
        // manner suitable for users under the age of consent.
        tagForUnderAgeOfConsent: true,

        // An array of test device IDs to allow.
        testDeviceIdentifiers: ['EMULATOR', 'fca6ee7d'],
      });
    } catch (error) {
      console.log(error);
    }
  }
}
