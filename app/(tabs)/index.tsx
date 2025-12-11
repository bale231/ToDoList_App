import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { todoService } from '../../src/api/todos';
import { TodoList, ListCategory } from '../../src/types';
import { APP_COLORS } from '../../src/constants/config';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [lists, setLists] = useState<TodoList[]>([]);
  const [categories, setCategories] = useState<ListCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([fetchLists(), fetchCategories()]);
    setIsLoading(false);
  };

  const fetchLists = async () => {
    const result = await todoService.getLists();
    if (result.success && result.data) {
      setLists(result.data);
    }
  };

  const fetchCategories = async () => {
    const result = await todoService.getCategories();
    if (result.success && result.data) {
      setCategories(result.data);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const filteredLists = selectedCategory
    ? lists.filter((list) => list.category === selectedCategory)
    : lists;

  const getCompletionPercentage = (list: TodoList) => {
    if (list.todos.length === 0) return 0;
    const completed = list.todos.filter((todo) => todo.completed).length;
    return Math.round((completed / list.todos.length) * 100);
  };

  const renderList = ({ item }: { item: TodoList }) => {
    const percentage = getCompletionPercentage(item);
    const colorValue = APP_COLORS[item.color as keyof typeof APP_COLORS] || APP_COLORS.blue;

    return (
      <TouchableOpacity
        style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.7}
      >
        <View style={[styles.listColorBar, { backgroundColor: colorValue }]} />
        <View style={styles.listContent}>
          <View style={styles.listHeader}>
            <Text style={[styles.listName, { color: colors.text }]}>{item.name}</Text>
            {item.is_shared && (
              <Ionicons name="people" size={16} color={colors.textSecondary} />
            )}
          </View>
          <Text style={[styles.listCount, { color: colors.textSecondary }]}>
            {item.todos.length} {item.todos.length === 1 ? 'item' : 'items'}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${percentage}%`, backgroundColor: colorValue },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {percentage}% complete
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategory = ({ item }: { item: ListCategory }) => {
    const isSelected = selectedCategory === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          isSelected && { backgroundColor: colors.primary },
          { borderColor: colors.border },
        ]}
        onPress={() => setSelectedCategory(isSelected ? null : item.id)}
      >
        <Text
          style={[
            styles.categoryText,
            { color: isSelected ? '#fff' : colors.text },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.username, { color: colors.text }]}>{user?.username}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="add-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      {categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      )}

      {/* Lists */}
      <FlatList
        data={filteredLists}
        renderItem={renderList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="list-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No lists yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Tap + to create your first list
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 14,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  listCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    flexDirection: 'row',
  },
  listColorBar: {
    width: 6,
  },
  listContent: {
    flex: 1,
    padding: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listCount: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
});
