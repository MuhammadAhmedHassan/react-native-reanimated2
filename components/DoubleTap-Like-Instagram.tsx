import React, {useCallback, useRef} from 'react';
import {Dimensions, Image, ImageBackground, StyleSheet} from 'react-native';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const {width} = Dimensions.get('window');

const App = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const doubleTapRef = useRef();

  const onSingleTap = useCallback(() => {
    console.log('Single Tap');
    opacity.value = withSpring(0, undefined, finished => {
      if (finished) {
        opacity.value = withDelay(200, withSpring(1));
      }
    });
  }, [opacity]);

  const onDoubleTap = useCallback(() => {
    console.log('Double Tap');
    scale.value = withSpring(1, undefined, finished => {
      if (finished) {
        scale.value = withSpring(0);
      }
    });

    // Same as above
    // scale.value = withSpring(1);
    // setTimeout(() => {
    //   scale.value = withSpring(0);
    // }, 500);
  }, [scale]);

  const rStyle = useAnimatedStyle(() => {
    // withSpring function make value less than zero
    // for a while so to keep the min value zero
    // we've used Math.max function
    return {
      transform: [{scale: Math.max(scale.value, 0)}],
    };
  }, []);

  const rTextStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <TapGestureHandler waitFor={doubleTapRef} onActivated={onSingleTap}>
        <TapGestureHandler
          maxDelayMs={200}
          ref={doubleTapRef}
          numberOfTaps={2}
          onActivated={onDoubleTap}>
          <Animated.View>
            <ImageBackground
              source={require('./assets/images/image.jpeg')}
              style={styles.image}>
              <AnimatedImage
                source={require('./assets/images/heart.png')}
                style={[styles.image, styles.shadow, rStyle]}
                resizeMode="center"
              />
            </ImageBackground>
            <Animated.Text style={[styles.turtles, rTextStyle]}>
              🐢🐢🐢🐢🐢
            </Animated.Text>
          </Animated.View>
        </TapGestureHandler>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width,
    height: width,
  },
  shadow: {
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.3,
    shadowRadius: 35,
    overlayColor: 'pink',
  },
  turtles: {alignSelf: 'center', marginVertical: 12, fontSize: 30},
});

export default App;
