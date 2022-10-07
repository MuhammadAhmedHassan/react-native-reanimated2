import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

const SIZE = SCREEN_WIDTH * 0.7;

const WORDS = ["What's", 'up', 'mobile', 'devs'];

interface IPage {
  title: string;
  index: number;
  translateX: SharedValue<number>;
}
const Page: React.FC<IPage> = ({title, index, translateX}) => {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];
  const rStyle = useAnimatedStyle(() => {
    // When translateX value is equal to
    // (index - 1) multiply by SCREEN_WIDTH
    // Our scale value should be equal to zero.
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP,
    );

    const borderRadius = interpolate(
      translateX.value,
      inputRange,
      [0, SIZE / 2, 0],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{scale}],
      borderRadius,
    };
  }, []);

  const rTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      translateX.value,
      inputRange,
      [200, 0, 200], // [200, 0, -200]
      Extrapolate.CLAMP,
    );

    const opacity = interpolate(
      translateX.value,
      inputRange,
      [-2, 1, -2], // [0, 1, 0]
      Extrapolate.CLAMP,
    );

    return {
      transform: [{translateY}],
      opacity,
    };
  }, []);

  return (
    <View
      style={[styles.page, {backgroundColor: `rgba(0,0,256, 0.${index + 2})`}]}>
      <Animated.View style={[styles.square, rStyle]} />
      <Animated.View style={[styles.textContainer, rTextStyle]}>
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
    </View>
  );
};

const App = () => {
  const translateX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateX.value = event.contentOffset.x; // scrollX
  }, []);

  return (
    <Animated.ScrollView
      style={styles.container}
      horizontal
      snapToAlignment="center"
      pagingEnabled
      onScroll={scrollHandler}
      scrollEventThrottle={16}>
      {WORDS.map((title, index) => (
        <Page
          key={index + ''}
          title={title}
          index={index}
          translateX={translateX}
        />
      ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  page: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    height: SIZE,
    width: SIZE,
    backgroundColor: 'rgba(0, 0, 256, 0.4)',
  },
  textContainer: {position: 'absolute'},
  text: {
    fontSize: 60,
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
});

export default App;
