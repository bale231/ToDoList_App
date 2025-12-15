import React, { ReactNode, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

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
  const translateX = useRef(new Animated.Value(0)).current;

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

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;

      if (translationX < -SWIPE_THRESHOLD) {
        // Swipe left → Delete
        Animated.spring(translateX, {
          toValue: -ACTION_WIDTH,
          useNativeDriver: true,
        }).start();
      } else if (translationX > SWIPE_THRESHOLD) {
        // Swipe right → Edit
        Animated.spring(translateX, {
          toValue: ACTION_WIDTH,
          useNativeDriver: true,
        }).start();
      } else {
        // Snap back
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const editOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD / 2, ACTION_WIDTH],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const deleteOpacity = translateX.interpolate({
    inputRange: [-ACTION_WIDTH, -SWIPE_THRESHOLD / 2, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

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
          { backgroundColor: colors.yellow, opacity: editOpacity },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
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
          { backgroundColor: colors.error, opacity: deleteOpacity },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
            handleDelete();
          }}
          style={styles.actionTouchable}
        >
          <Ionicons name="trash" size={22} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Swipeable Content */}
      <PanGestureHandler
        enabled={!disabled}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          {children}
        </Animated.View>
      </PanGestureHandler>
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
