import React from 'react';
import { ScrollView, View, ViewProps, ScrollViewProps } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';

interface ParallaxScrollViewProps extends ScrollViewProps {
  headerHeight?: number;
  renderHeader: () => React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function ParallaxScrollView({
  headerHeight = 200,
  renderHeader,
  children,
  style,
  className,
  ...props
}: ParallaxScrollViewProps) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight],
      [0, -headerHeight / 2],
      'clamp'
    );

    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight],
      [1, 0],
      'clamp'
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  return (
    <View className={`flex-1 ${className || ''}`} style={style}>
      <AnimatedScrollView
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        {...props}
      >
        <Animated.View
          style={[
            { height: headerHeight, position: 'relative' },
            headerStyle,
          ]}
        >
          {renderHeader()}
        </Animated.View>
        {children}
      </AnimatedScrollView>
    </View>
  );
}
