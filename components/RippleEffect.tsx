import React, {PropsWithChildren} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {
  GestureHandlerRootView,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface IRipple {
  style?: StyleProp<ViewStyle>;
  onTap?(): void;
}

const Ripple = ({children, style, onTap}: PropsWithChildren<IRipple>) => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const scale = useSharedValue(0);
  const aRef = useAnimatedRef<View>();
  const width = useSharedValue(0);
  const height = useSharedValue(0);

  const rippleOpacity = useSharedValue(1);

  const tapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>(
      {
        onStart(event) {
          const layout = measure(aRef);
          width.value = layout.width;
          height.value = layout.height;

          centerX.value = event.x;
          centerY.value = event.y;

          rippleOpacity.value = 1;
          scale.value = 0;
          scale.value = withTiming(1);
        },
        onActive() {
          if (onTap) {
            runOnJS(onTap)();
          }
        },
        // It's working fine but if for instance something goes
        // wrong while tapping the square, then onEnd will not be
        // called (instead onCancel will be called), so we should
        // use onFinish() because it acts like a finally block in
        // try-catch block
        // onEnd() {
        //   rippleOpacity.value = withTiming(0);
        // },
        onFinish() {
          rippleOpacity.value = withTiming(0);
        },
      },
      [],
    );

  const rStyle = useAnimatedStyle(() => {
    const circleRadius = Math.sqrt(width.value ** 2 + height.value ** 2);
    const translateX = centerX.value - circleRadius;
    const translateY = centerY.value - circleRadius;
    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: circleRadius,
      opacity: rippleOpacity.value,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      position: 'absolute',
      top: 0,
      left: 0,
      transform: [{translateX}, {translateY}, {scale: scale.value}],
    };
  }, []);

  return (
    <View ref={aRef} collapsable={false} style={style}>
      <TapGestureHandler onGestureEvent={tapGestureEvent}>
        <Animated.View style={[style, {overflow: 'hidden'}]}>
          <View>{children}</View>
          <Animated.View style={rStyle} />
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Ripple style={styles.ripple} onTap={() => console.log('Tap')}>
        <Text style={{fontSize: 25}}>Tap</Text>
      </Ripple>
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
  ripple: {
    width: 200,
    height: 200,
    backgroundColor: 'pink',
    elevation: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
});

export default App;
