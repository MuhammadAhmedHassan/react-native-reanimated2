import {useEffect} from 'react';
import {AppState} from 'react-native';

export const useAppState = () => {
  useEffect(() => {
    const blur = AppState.addEventListener('blur', state => {
      console.log('blur :: ', state);
    });

    const change = AppState.addEventListener('change', state => {
      console.log('change :: ', state);
    });

    const focus = AppState.addEventListener('focus', state => {
      console.log('focus :: ', state);
    });

    const memoryWarning = AppState.addEventListener('memoryWarning', state => {
      console.log('memoryWarning :: ', state);
    });

    return () => {
      blur.remove();
      change.remove();
      focus.remove();
      memoryWarning.remove();
    };
  }, []);

  return null;
};
