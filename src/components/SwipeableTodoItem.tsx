import React, { ReactNode } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ACTION_WIDTH = 80;
const SWIPE_THRESHOLD = 60;

interface SwipeableTodoItemProps {
  children: ReactNode;
  label: string;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function SwipeableTodoItem({
  children,
  label,
  onEdit,
  onDelete,
  disabled = false,
}: SwipeableTodoItemProps) {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);

  const handleDelete = () => {
    Alert.alert(
      'Elimina Todo',
      `Sei sicuro di voler eliminare "${label}"?`,
      [
        { text: 'Annulla', style: 'cancel' },
        { text: 'Elimina', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((event) => {
      const clampedX = Math.max(-ACTION_WIDTH * 1.2, Math.min(ACTION_WIDTH * 1.2, event.translationX));
      translateX.value = clampedX;
    })
    .onEnd((event) => {
      const velocity = event.velocityX;
      const translation = event.translationX;

      if (translation < -SWIPE_THRESHOLD) {
        // Swipe left → Delete
        translateX.value = withSpring(-ACTION_WIDTH);
      } else if (translation > SWIPE_THRESHOLD) {
        // Swipe right → Edit
        translateX.value = withSpring(ACTION_WIDTH);
      } else {
        // Snap back
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const editActionStyle = useAnimatedStyle(() => ({
    opacity: withTiming(translateX.value > SWIPE_THRESHOLD / 2 ? 1 : 0, { duration: 150 }),
  }));

  const deleteActionStyle = useAnimatedStyle(() => ({
    opacity: withTiming(translateX.value < -SWIPE_THRESHOLD / 2 ? 1 : 0, { duration: 150 }),
  }));

  if (disabled) {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <View style={styles.container}>
      {/* Edit Action (Right) */}
      <Animated.View
        style={[
          styles.actionButton,
          styles.editAction,
          { backgroundColor: colors.yellow },
          editActionStyle,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            translateX.value = withSpring(0);
            onEdit();
          }}
          style={styles.actionTouchable}
        >
          <Ionicons name="pencil" size={22} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Delete Action (Left) */}
      <Animated.View
        style={[
          styles.actionButton,
          styles.deleteAction,
          { backgroundColor: colors.error },
          deleteActionStyle,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            translateX.value = withSpring(0);
            handleDelete();
          }}
          style={styles.actionTouchable}
        >
          <Ionicons name="trash" size={22} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Swipeable Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  actionButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAction: {
    left: 0,
  },
  deleteAction: {
    right: 0,
  },
  actionTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'transparent',
  },
});
