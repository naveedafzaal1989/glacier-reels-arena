import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import theme from '../constants/theme';

/**
 * Press feedback pair (codegen rule #8): the <Pressable> is the PARENT and
 * drives this scale, the <Animated.View> lives INSIDE it. An Animated.View
 * wrapping a Pressable swallows onPress on Android release builds.
 * Only `transform` is animated, so useNativeDriver stays true.
 */
export function usePressScale(pressed = 0.93) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressed,
      tension: 300,
      friction: 14,
      useNativeDriver: true,
    }).start();
  }, [pressed, scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
