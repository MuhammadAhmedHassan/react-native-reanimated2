import React, {useState} from 'react';
import {Dimensions, StyleSheet, Switch} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const SIZE = SCREEN_WIDTH * 0.7;

const COLORS = {
  dark: {
    background: '#1E1E1E',
    circle: '#252525',
    text: '#F8F8F8',
  },
  light: {
    background: '#F8F8F8',
    circle: '#FFF',
    text: '#1E1E1E',
  },
};

const SWITCH_TRACK_COLOR = {
  true: 'rgba(256, 0, 256, 0.2)',
  false: 'rgba(0, 0, 0, 0.1)',
};

type Theme = 'light' | 'dark';

const App = () => {
  const [theme, setTheme] = useState<Theme>('light');
  // const progress = useSharedValue(0);
  const progress = useDerivedValue(() => {
    return theme === 'dark' ? withTiming(1) : withTiming(0);
  }, [theme]);

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.light.background, COLORS.dark.background],
    );
    return {backgroundColor};
  }, []);

  const rCircleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.light.circle, COLORS.dark.circle],
    );
    return {backgroundColor};
  }, []);

  const rTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.light.text, COLORS.dark.text],
    );
    return {color};
  }, []);

  return (
    <Animated.View style={[styles.container, rStyle]}>
      <Animated.Text style={[styles.text, rTextStyle]}>Theme</Animated.Text>
      <Animated.View style={[styles.circle, rCircleStyle]}>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggled => setTheme(toggled ? 'dark' : 'light')}
          trackColor={SWITCH_TRACK_COLOR}
          thumbColor="violet"
        />
      </Animated.View>
    </Animated.View>
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
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZE / 2,
    backgroundColor: '#FFF',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  text: {
    fontSize: 60,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 12,
    marginBottom: 25,
  },
});

export default App;
