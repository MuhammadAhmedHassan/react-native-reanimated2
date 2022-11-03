import React, {useCallback, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  ScrollView,
  PanGestureHandler,
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import deleteIcon from './assets/icons/delete.png';

const {width} = Dimensions.get('window');

const TASKS = [
  'Record the dismissible tutorial',
  'Leave like to the video',
  'Check YouTube comments',
  'Subscritbe to the channel',
  'Leave a star on the GitHub Repo',
  'Record the dismissible tutorial',
  'Leave like to the video',
  'Check YouTube comments',
  'Subscritbe to the channel',
  'Leave a star on the GitHub Repo',
  'Record the dismissible tutorial',
  'Leave like to the video',
  'Check YouTube comments',
  'Subscritbe to the channel',
  'Leave a star on the GitHub Repo',
];

const BACKGROUND_COLOR = '#FAFBFF';
const LIST_ITEM_HEIGHT = 70;
const TRANSLATE_X_THRESHOLD = width * 0.3;

type Task = {
  id: number;
  title: string;
};

type Context = {
  translateX: number;
};
interface IListItem
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  task: Task;
  deleteTask(t: Task): void;
}

const ListItem = ({task, deleteTask, simultaneousHandlers}: IListItem) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
  const marginVertical = useSharedValue(10);

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    Context
  >(
    {
      onStart(event, context) {
        context.translateX = translateX.value;
        // context.translationX = adjustedTranslateX.value;
        // Tap Gesture handler has higher priority on panGesture
        // so we don't need these callbacks
        // translationY.value = withSpring(-CIRCLE_PICKER_SIZE);
        // scale.value = withSpring(1.2);
      },
      onActive(event, context) {
        translateX.value = withSpring(event.translationX + context.translateX);
      },
      onEnd(event) {
        translateX.value = withSpring(
          event.translationX > -TRANSLATE_X_THRESHOLD
            ? 0
            : -TRANSLATE_X_THRESHOLD,
        );
      },
    },
    [],
  );

  const rStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  }, []);
  const rDeleteStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, []);

  const handleRemoveTask = useCallback(() => {
    'worklet';
    translateX.value = withTiming(-width);
    opacity.value = withTiming(0);
    marginVertical.value = withTiming(0);
    itemHeight.value = withTiming(0, undefined, finished => {
      if (finished) {
        runOnJS(deleteTask)(task);
      }
    });
  }, [translateX, opacity, itemHeight, marginVertical, deleteTask, task]);

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginVertical.value,
    };
  }, []);

  return (
    <Animated.View style={[styles.taskContainer, rContainerStyle]}>
      <Animated.View style={[styles.deleteContainer, rDeleteStyles]}>
        <TouchableOpacity onPress={handleRemoveTask}>
          <Image
            source={deleteIcon}
            resizeMode="contain"
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      </Animated.View>
      <PanGestureHandler
        simultaneousHandlers={simultaneousHandlers}
        onGestureEvent={panGestureEvent}>
        <Animated.View style={[styles.task, rStyles]}>
          <Text style={styles.taskText}>{task.title}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

const App = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [tasks, setTasks] = useState(
    TASKS.map((t, idx) => ({id: idx, title: t})),
  );

  const deleteTask = useCallback(
    (t: Task) => {
      setTasks(tasks.filter(tsk => tsk.id !== t.id));
    },
    [tasks],
  );

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Tasks</Text>
        <ScrollView ref={scrollViewRef} style={styles.flex1}>
          {tasks.map(t => (
            <ListItem
              key={t.id}
              task={t}
              deleteTask={deleteTask}
              simultaneousHandlers={scrollViewRef}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingTop: 24,
  },
  heading: {fontSize: 36, color: 'black', marginLeft: 20, marginBottom: 10},
  taskContainer: {
    width: '100%',
    alignItems: 'center',
    // marginVertical: 10,
  },
  task: {
    width: '90%',
    height: LIST_ITEM_HEIGHT,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
  },
  taskText: {
    fontSize: 16,
    color: 'black',
  },
  deleteContainer: {
    position: 'absolute',
    height: LIST_ITEM_HEIGHT,
    width: 50,
    backgroundColor: 'red',
    top: 0,
    right: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {height: 32, width: 32, tintColor: 'white'},
});

export default App;
