import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { SearchBar } from '@/components/ui';
import { ReagenteCard } from '@/components';
import { fetchReagentes } from '@/services/movimentacoes';
import { searchReagentes } from '@/services/reagentes';
import { isLowStock } from '@/utils/formatters';
import type { Reagente } from '@/types';

type FilterTab = 'all' | 'lowstock';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'lowstock', label: '⚠ Estoque Baixo' },
];

export default function CatalogoScreen() {
  const router = useRouter();

  const [allReagentes, setAllReagentes] = useState<Reagente[]>([]);
  const [searchResults, setSearchResults] = useState<Reagente[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const loadAll = useCallback(async () => {
    const data = await fetchReagentes();
    setAllReagentes(data);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadAll().finally(() => setLoading(false));
  }, [loadAll]);

  const handleSearchChange = useCallback(
    async (text: string) => {
      setSearchQuery(text);
      if (text.trim().length < 2) {
        setSearchResults(null);
        return;
      }
      try {
        setIsSearchLoading(true);
        const results = await searchReagentes(text.trim());
        setSearchResults(results);
      } catch {
        setSearchResults(null);
      } finally {
        setIsSearchLoading(false);
      }
    },
    [],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadAll();
      if (searchQuery.trim().length >= 2) {
        const results = await searchReagentes(searchQuery.trim());
        setSearchResults(results);
      }
    } finally {
      setRefreshing(false);
    }
  }, [loadAll, searchQuery]);

  const displayedReagentes = useMemo(() => {
    const base = searchResults ?? allReagentes;
    if (activeFilter === 'lowstock') {
      return base.filter((r) =>
        isLowStock(r.quantidade, r.quantidadeMinima ?? undefined),
      );
    }
    return base;
  }, [allReagentes, searchResults, activeFilter]);

  const handleCardPress = useCallback(
    (reagenteId: number) => {
      router.push(`/reagente/${reagenteId}`);
    },
    [router],
  );

  const renderHeader = useCallback(
    () => (
      <View>
        <View style={styles.filterRow}>
          {FILTER_TABS.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveFilter(tab.key)}
              hitSlop={4}
              style={[
                styles.filterTab,
                activeFilter === tab.key && styles.filterTabActive,
              ]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === tab.key && styles.filterTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.resultCount}>
          {displayedReagentes.length} reagente
          {displayedReagentes.length !== 1 ? 's' : ''}
          {activeFilter === 'lowstock'
            ? ' com estoque baixo'
            : ' encontrado' + (displayedReagentes.length !== 1 ? 's' : '')}
        </Text>
      </View>
    ),
    [activeFilter, displayedReagentes.length],
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🔎</Text>
      <Text style={styles.emptyTitle}>Nenhum reagente encontrado</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery.length > 0
          ? `Nenhum resultado para "${searchQuery}"`
          : 'Não há reagentes com estoque baixo no momento'}
      </Text>
    </View>
  );

  const renderItem = useCallback(
    ({ item }: { item: Reagente }) => (
      <ReagenteCard reagente={item} onPress={() => handleCardPress(item.id)} />
    ),
    [handleCardPress],
  );

  const keyExtractor = useCallback((item: Reagente) => String(item.id), []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Catálogo</Text>
        <Text style={styles.screenSubtitle}>Gestão de estoque químico</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        isLoading={isSearchLoading}
        placeholder="Buscar por nome do reagente..."
      />

      <FlatList
        data={loading ? [] : displayedReagentes}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={loading ? null : renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.cyan}
            colors={[Colors.cyan]}
          />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenHeader: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  screenTitle: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  filterTab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  filterTabActive: {
    backgroundColor: Colors.cyanDim,
    borderColor: Colors.cyan,
  },
  filterTabText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.cyan,
    fontWeight: Typography.weight.semibold,
  },
  resultCount: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weight.medium,
  },
  listContent: {
    paddingBottom: Spacing.xxxxxl,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.xxxxxl,
    paddingHorizontal: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyIcon: {
    fontSize: 52,
  },
  emptyTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
