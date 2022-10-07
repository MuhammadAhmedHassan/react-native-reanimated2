import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const SIZE = 100.0;
const CIRCLE_RADIUS = SIZE * 2;
const {} = Dimensions.get('window');

const App = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const context = useSharedValue({x: 0, y: 0});

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = {
        x: translateX.value,
        y: translateY.value,
      };
    })
    .onUpdate(event => {
      const x = event.translationX + context.value.x;
      const y = event.translationY + context.value.y;
      translateX.value = x;
      translateY.value = y;
      // Math.min(event.translationX, SCREEN_WIDTH);
    })
    .onEnd(() => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);

      console.log('distance', distance);
      console.log('CIRCLE_RADIUS', CIRCLE_RADIUS);
      const halfSqaure = SIZE / 2;
      if (distance < CIRCLE_RADIUS + halfSqaure) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });
  // useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
  //   onStart(event) {},
  //   onActive(event) {
  //     translateX.value = event.translationX;
  //   },
  //   onEnd(event) {},
  // });

  const rStyle = useAnimatedStyle(
    () => ({
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    }),
    [],
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* <View style={styles.container}> */}
      <View style={styles.circle}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.square, rStyle]} />
        </GestureDetector>
      </View>
      {/* </View> */}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CIRCLE_RADIUS,
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 256, 0.5)',
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'rgba(0, 0, 256, 0.8)',
    borderRadius: 20,
  },
});

export default App;
