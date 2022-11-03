import React, {useCallback, useRef} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;
const PICKER_WIDTH = width * 0.9;
const CIRCLE_PICKER_SIZE = 45;
const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE / 2;

// prettier-ignore
const COLORS = [
  'red', 'purple', 'blue', 'cyan', 'green',
  'yellow', 'orange', 'black', 'white',
];

const BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.9)';

interface IColorPicker extends LinearGradientProps {
  onColorChanged(color: string | number): void;
}

type Context = {
  translationX: number;
};

const ColorPicker = ({
  colors,
  start,
  end,
  style,
  onColorChanged,
}: IColorPicker) => {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const scale = useSharedValue(1);

  const adjustedTranslateX = useDerivedValue(() => {
    return Math.min(
      Math.max(translationX.value, 0),
      PICKER_WIDTH - CIRCLE_PICKER_SIZE,
    );
  }, []);

  const onEnd = useCallback(() => {
    'worklet';
    translationY.value = withSpring(0);
    scale.value = withSpring(1);
  }, [translationY, scale]);

  // with GestureHandler we can use the pinch handler tap handler
  // and pan handler
  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    Context
  >(
    {
      onStart(_, context) {
        context.translationX = adjustedTranslateX.value;

        // Tap Gesture handler has higher priority on panGesture
        // so we don't need these callbacks
        // translationY.value = withSpring(-CIRCLE_PICKER_SIZE);
        // scale.value = withSpring(1.2);
      },
      onActive(event, context) {
        translationX.value = event.translationX + context.translationX;
      },
      onEnd,
    },
    [],
  );

  const tapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>(
      {
        onStart(event) {
          translationY.value = withSpring(-CIRCLE_PICKER_SIZE);
          scale.value = withSpring(1.2);
          translationX.value = withTiming(event.absoluteX - CIRCLE_PICKER_SIZE);
        },
        onEnd,
      },
      [],
    );

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: adjustedTranslateX.value},
        {scale: scale.value},
        {translateY: translationY.value},
      ],
    };
  }, []);

  const rInternalPickerStyle = useAnimatedStyle(() => {
    const inputRange = colors.map(
      (_, index) => (index / colors.length) * PICKER_WIDTH,
    );
    // inputRange: [
    //  (1 / 9) * PICKER_WIDTH, (2 / 9) * PICKER_WIDTH, (3 / 9) * PICKER_WIDTH,
    //  (4 / 9) * PICKER_WIDTH, (5 / 9) * PICKER_WIDTH, (6 / 9) * PICKER_WIDTH,
    //  (7 / 9) * PICKER_WIDTH, (8 / 9) * PICKER_WIDTH, (9 / 9) * PICKER_WIDTH,
    // ],
    const backgroundColor = interpolateColor(
      translationX.value,
      inputRange,
      colors,
    );
    onColorChanged?.(backgroundColor);
    return {backgroundColor};
  }, []);

  return (
    <TapGestureHandler onGestureEvent={tapGestureEvent}>
      <Animated.View>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={{justifyContent: 'center'}}>
            <LinearGradient
              colors={colors}
              start={start}
              end={end}
              style={style}
            />
            <Animated.View style={[styles.picker, rStyle]}>
              <Animated.View
                style={[styles.internalPicker, rInternalPickerStyle]}
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};

const App = () => {
  const start = useRef({x: 0, y: 0}).current;
  const end = useRef({x: 1, y: 0}).current;
  const pickedColor = useSharedValue<string | number>(COLORS[0]);

  const onColorChanged = useCallback(
    (color: string | number) => {
      'worklet';
      pickedColor.value = color;
    },
    [pickedColor],
  );

  const rStyle = useAnimatedStyle(() => {
    return {backgroundColor: pickedColor.value};
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.topContainer}>
        <Animated.View style={[styles.circle, rStyle]} />
      </View>
      <View style={styles.bottomContainer}>
        <ColorPicker
          colors={COLORS}
          start={start}
          end={end}
          style={styles.gradient}
          onColorChanged={onColorChanged}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {height: 50, width: PICKER_WIDTH, borderRadius: 20},
  picker: {
    position: 'absolute',
    backgroundColor: 'white',
    height: CIRCLE_PICKER_SIZE,
    width: CIRCLE_PICKER_SIZE,
    borderRadius: CIRCLE_PICKER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  internalPicker: {
    height: INTERNAL_PICKER_SIZE,
    width: INTERNAL_PICKER_SIZE,
    borderRadius: INTERNAL_PICKER_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
});

export default App;
