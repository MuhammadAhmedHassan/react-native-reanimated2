import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
} from 'react-native-reanimated';

const SIZE = 100;

const handleRotation = (progress: Animated.SharedValue<number>) => {
  'worklet';
  return `${progress.value * 2 * Math.PI}rad`;
};

const App = () => {
  const progress = useSharedValue(1);
  const scale = useSharedValue(2);

  const animatedStyles = useAnimatedStyle(
    () => ({
      opacity: progress.value,
      borderRadius: (progress.value * SIZE) / 2,
      transform: [
        {
          scale: scale.value,
        },
        {
          // rotate: `${progress.value * 2 * Math.PI}rad`,
          rotate: handleRotation(progress),
        },
      ],
    }),
    [],
  );

  useEffect(() => {
    progress.value = withRepeat(withSpring(0.5), -1, true);
    scale.value = withRepeat(withSpring(1), -1, true);
  }, [progress, scale]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.box, animatedStyles]} />
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
  box: {
    height: SIZE,
    width: SIZE,
    backgroundColor: 'blue',
  },
});

export default App;
