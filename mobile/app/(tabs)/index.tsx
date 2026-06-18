import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';

import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import {
  scrollableListStyle,
  scrollableScreen,
  scrollViewStyle,
  shouldClipListSubviews,
} from '@/constants/layout';
import { SearchBar, Button } from '@/components/ui';
import { ReagenteCard } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
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
  const { isAdmin } = useAuth();

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

  useFocusEffect(
    useCallback(() => {
      // Carrega os dados de fundo sem tela de loading travante se já tiver dados
      loadAll().finally(() => {
        if (loading) setLoading(false);
      });
      
      // Atualiza resultados de busca se houver
      if (searchQuery.trim().length >= 2) {
        searchReagentes(searchQuery.trim())
          .then(setSearchResults)
          .catch(() => setSearchResults(null));
      }
    }, [loadAll, searchQuery, loading])
  );

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
        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>Catálogo</Text>
          <Text style={styles.screenSubtitle}>Gestão de estoque químico</Text>
        </View>

        {isAdmin && (
          <View style={styles.adminAction}>
            <Button
              title="+ Cadastrar Reagente"
              variant="primary"
              size="md"
              onPress={() => router.push('/reagente/novo')}
            />
          </View>
        )}

        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          isLoading={isSearchLoading}
          placeholder="Buscar por nome do reagente..."
        />

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
    [activeFilter, displayedReagentes.length, searchQuery, isSearchLoading, handleSearchChange, isAdmin, router],
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

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={Colors.cyan}
      colors={[Colors.cyan]}
    />
  );

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <ScrollView
          style={scrollViewStyle}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator
          nestedScrollEnabled
          refreshControl={refreshControl}
        >
          {renderHeader()}
          {!loading && displayedReagentes.length === 0 && renderEmpty()}
          {displayedReagentes.map((item) => (
            <ReagenteCard
              key={item.id}
              reagente={item}
              onPress={() => handleCardPress(item.id)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <FlatList
        style={scrollableListStyle}
        data={loading ? [] : displayedReagentes}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={loading ? null : renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        refreshControl={refreshControl}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={shouldClipListSubviews}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    ...scrollableScreen,
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
  adminAction: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
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
